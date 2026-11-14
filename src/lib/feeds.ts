import type { NewsItem } from "@/types/news";
import type { Source, SourceFeed } from "@/types/source";
import { getCategory } from "@/data/categories";
import { siteConfig } from "@/data/site";
import { sources } from "@/data/sources";
import { slugify, stripHtml, truncate } from "@/lib/utils";


const MAX_PER_FEED = 20;
const MAX_STORED = 300;
const TIMEOUT_MS = 8000;
const EXCERPT_LENGTH = 180;

/**
 * Penyimpanan berita hasil sinkronisasi, di memori proses server (via globalThis supaya
 * dipakai bersama oleh route handler dan halaman). Ini cocok untuk server yang berjalan terus,
 * tetapi hilang saat proses restart dan tidak dibagi antar-instance. Untuk produksi dengan
 * banyak instance, ganti dengan database.
 */
type Store = Map<string, NewsItem>;
const g = globalThis as typeof globalThis & { __senapatiFeedStore?: Store };
const store: Store = (g.__senapatiFeedStore ??= new Map());

export function getFeedItems(): NewsItem[] {
  return [...store.values()];
}

export type FeedSyncSummary = {
  /** Jumlah feed yang dicoba. */
  feeds: number;
  /** Jumlah item yang terbaca. */
  fetched: number;
  /** Item baru yang masuk. */
  added: number;
  /** Total item tersimpan sekarang. */
  total: number;
  failed: { source: string; url: string; error: string }[];
};

/* ---------- Parser RSS 2.0 ringan (tanpa dependensi) ---------- */

function unwrap(raw: string): string {
  return raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

function codePoint(n: number): string {
  try {
    return String.fromCodePoint(n);
  } catch {
    return "";
  }
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n: string) => codePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => codePoint(parseInt(h, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function tagText(block: string, name: string): string | undefined {
  const m = block.match(
    new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"),
  );
  return m ? m[1].trim() : undefined;
}

function tagAttr(
  block: string,
  name: string,
  attr: string,
): string | undefined {
  const m = block.match(
    new RegExp(`<${name}\\s[^>]*?${attr}=["']([^"']+)["']`, "i"),
  );
  return m?.[1];
}

/** Hanya menerima http(s). Mencegah tautan berbahaya seperti javascript: masuk ke halaman. */
function safeUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(decodeEntities(unwrap(raw)).trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++)
    h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function parseFeed(xml: string, source: Source, feed: SourceFeed): NewsItem[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const items: NewsItem[] = [];

  for (const block of blocks.slice(0, MAX_PER_FEED)) {
    const title = stripHtml(
      decodeEntities(unwrap(tagText(block, "title") ?? "")),
    );
    const url = safeUrl(tagText(block, "link"));
    if (!title || !url) continue;

    const descriptionHtml = decodeEntities(
      unwrap(tagText(block, "description") ?? ""),
    );
    const image =
      safeUrl(tagAttr(block, "enclosure", "url")) ??
      safeUrl(tagAttr(block, "media:content", "url")) ??
      safeUrl(tagAttr(block, "media:thumbnail", "url")) ??
      safeUrl(descriptionHtml.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]);

    const published = new Date(unwrap(tagText(block, "pubDate") ?? ""));
    const publishedAt = Number.isNaN(published.getTime())
      ? new Date()
      : published;

    items.push({
      id: `feed-${hash(url)}`,
      slug: slugify(title),
      title,
      excerpt: truncate(stripHtml(descriptionHtml), EXCERPT_LENGTH),
      url,
      image,
      publishedAt: publishedAt.toISOString(),
      source,
      sourceSlug: source.slug,
      categorySlug: feed.categorySlug,
    });
  }

  return items;
}

async function fetchFeed(
  source: Source,
  feed: SourceFeed,
): Promise<NewsItem[]> {
  if (!getCategory(feed.categorySlug)) {
    throw new Error(`Kategori tidak dikenal: ${feed.categorySlug}`);
  }

  const response = await fetch(feed.url, {
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent": `${siteConfig.name} feed reader`,
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  return parseFeed(await response.text(), source, feed);
}

/** Menarik semua feed yang terdaftar di data/sources.ts dan menyimpan hasilnya. */
export async function syncFeeds(): Promise<FeedSyncSummary> {
  const jobs = sources.flatMap((source) =>
    (source.feeds ?? []).map((feed) => ({ source, feed })),
  );
  const results = await Promise.allSettled(
    jobs.map((job) => fetchFeed(job.source, job.feed)),
  );

  const summary: FeedSyncSummary = {
    feeds: jobs.length,
    fetched: 0,
    added: 0,
    total: 0,
    failed: [],
  };

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const message =
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason);
      summary.failed.push({
        source: jobs[i].source.name,
        url: jobs[i].feed.url,
        error: message,
      });
      return;
    }
    for (const item of result.value) {
      summary.fetched++;
      if (!store.has(item.id)) {
        store.set(item.id, item);
        summary.added++;
      }
    }
  });

  if (store.size > MAX_STORED) {
    const oldestFirst = [...store.values()].sort(
      (a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt),
    );
    for (const item of oldestFirst.slice(0, store.size - MAX_STORED))
      store.delete(item.id);
  }

  summary.total = store.size;
  return summary;
}

import type { NewsItem } from "@/types/news";
import { getSource } from "@/data/sources";
import { generatedGroups } from "./liputan.generated";
import { manualItems } from "./liputan.manual";
import metaJson from "./liputan.meta.json";

type RawItem = {
  sourceSlug: string;
  date: string;
  title: string;
  url: string;
  image?: string;
  excerpt?: string;
};

type RawGroup = {
  slug: string;
  categorySlug: string;
  items: readonly RawItem[];
};

type Meta = Record<string, { excerpt?: string; image?: string }>;

const groups: readonly RawGroup[] = generatedGroups;
const meta = metaJson as Meta;

/** Kategori untuk item manual yang tidak ada di dokumen Word. */
const MANUAL = { slug: "liputan-manual", categorySlug: "budaya" };
const FALLBACK_TITLE = "Liputan Senapati Nusantara";

/* ------------------------------------------------------------------ */
/* Pembersih teks                                                       */
/* ------------------------------------------------------------------ */

const NAMED: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
};

/** "&amp;" jadi "&", "&#187;" jadi "»". Satu langkah, jadi tidak terdekode dua kali. */
function decodeEntities(text: string): string {
  return text.replace(
    /&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi,
    (match, body: string) => {
      const b = body.toLowerCase();
      if (b.startsWith("#x"))
        return String.fromCodePoint(parseInt(b.slice(2), 16));
      if (b.startsWith("#")) return String.fromCodePoint(Number(b.slice(1)));
      return NAMED[b] ?? match;
    },
  );
}

/** Judul pengganti yang tertangkap saat scraper diblokir. Bukan judul berita. */
const BAD_TITLE: RegExp[] = [
  /^just a moment/i,
  /^attention required/i,
  /^security verification/i,
  /^site ready/i,
  /^blank page/i,
  /^(home|msn|rejogja)\b/i,
  /^yahoo search/i,
  /^(404|403)\b/i,
  /^error 4\d\d/i,
  /not found/i,
  /tidak ditemukan/i,
  /nothing here/i,
];
const isBadTitle = (title: string) =>
  BAD_TITLE.some((re) => re.test(title.trim()));

const SEPARATOR = /\s+[-–—]\s+|\s*\|\s*|\s+»\s+/g;

/** Membuang nama situs di ujung judul: "Judul - Harian Merapi". */
function stripSiteSuffix(title: string): string {
  let t = title;
  for (let i = 0; i < 2; i++) {
    const last = [...t.matchAll(SEPARATOR)].pop();
    if (!last || last.index === undefined) break;
    const head = t.slice(0, last.index).trim();
    const tail = t.slice(last.index + last[0].length).trim();
    const short =
      tail.length > 0 && tail.length <= 45 && tail.split(/\s+/).length <= 6;
    if (!short || head.length < 15) break;
    t = head;
  }
  return t;
}

function cleanTitle(raw: string): string {
  return stripSiteSuffix(decodeEntities(raw).trim())
    .replace(/^#+\s*/, "")
    .replace(/\s+\d{5,}$/, "")
    .trim();
}

/** Penanda lokasi di awal berita: "Bantul – ", "TEMPO.CO, Jakarta – ". Dibuang agar kartu lebih bersih. */
const DATELINE = /^[^–—:]{2,45}?\s[–—]\s+/;

function cleanExcerpt(raw?: string): string {
  if (!raw) return "";
  let t = decodeEntities(raw).replace(/\s+/g, " ").trim();
  const m = t.match(DATELINE);
  if (m && m[0].trim().split(/\s+/).length <= 6) t = t.slice(m[0].length);
  return t.length >= 30 ? t : "";
}

/* ------------------------------------------------------------------ */
/* Pembersih URL dan gambar                                             */
/* ------------------------------------------------------------------ */

/** Parameter pelacak (utm_*) dibuang supaya tautan bersih. */
function cleanUrl(raw: string): string {
  try {
    const u = new URL(raw);
    for (const key of [...u.searchParams.keys()]) {
      if (key.startsWith("utm_")) u.searchParams.delete(key);
    }
    return u.toString();
  } catch {
    return raw;
  }
}

/** Kunci pembanding antar sumber data: tanpa "www.", query, hash, dan garis miring akhir. */
function urlKey(raw: string): string {
  try {
    const u = new URL(raw);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return raw.replace(/\/+$/, "").toLowerCase();
  }
}

/** Logo, favicon, gambar bawaan situs, dan gambar yang salah artikel. */
const BAD_IMAGE = /(logo|favicon|default[_-]?image|portalmadura\.webp|agnez)/i;

function cleanImage(raw?: string): string | undefined {
  if (!raw) return undefined;
  let url = raw.trim();
  if (!/^https?:\/\//.test(url)) return undefined;
  if (BAD_IMAGE.test(url)) return undefined;
  if (url.endsWith(".")) return undefined; // URL terpotong
  // Kumparan menempelkan tulisan "Konten Media Partner" lewat transformasi gambar. Dibuang.
  url = url.replace(
    /\/g_south,l_og_media_partner_[^/]+\/co_rgb:[^/]+(?=\/v\d+\/)/,
    "",
  );
  return url;
}

/** Cadangan terakhir untuk judul: susun dari slug URL. */
function titleFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const segment = pathname
      .split("/")
      .filter((s) => s.includes("-"))
      .sort((a, b) => b.length - a.length)[0];
    if (!segment) return "";
    return decodeURIComponent(segment)
      .replace(/\.html?$/i, "")
      .replace(/-\d{5,}$/, "")
      .replace(/^\d+-/, "")
      .split("-")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  } catch {
    return "";
  }
}

/** Tanggal tanpa zona waktu ("2022-10-14T21:45") dianggap WIB. Tanggal saja dibiarkan. */
function normalizeDate(value: string): string {
  return /T\d{2}:\d{2}$/.test(value) ? `${value}:00+07:00` : value;
}

/**
 * Keterangan cadangan untuk berita yang belum punya deskripsi.
 * Berdasarkan pengelompokan acara di liputan.ts. Hapus fungsi ini kalau tidak diinginkan.
 */
function fallbackExcerpt(date: string): string {
  const d = date.slice(0, 10);
  if (d >= "2022-09-01" && d <= "2022-09-15")
    return "Liputan jelang Musyawarah Agung Senapati (MAS) #2 di Yogyakarta, 16–18 September 2022.";
  if (d >= "2022-09-16" && d <= "2022-09-30")
    return "Liputan pembukaan dan hasil Musyawarah Agung Senapati (MAS) #2 di Bantul, Yogyakarta.";
  if (d >= "2022-10-01" && d <= "2022-10-31")
    return "Liputan pelantikan pengurus dan pameran Senapati Nusantara di Sumenep, Madura.";
  return "";
}

/* ------------------------------------------------------------------ */
/* Sumber berita                                                        */
/* ------------------------------------------------------------------ */

function resolveSource(slug: string): NewsItem["source"] {
  const found = getSource(slug);
  if (found) return found;
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[news] Sumber belum terdaftar di data/sources.ts: "${slug}"`);
  }
  return { slug, name: slug } as NewsItem["source"];
}

/* ------------------------------------------------------------------ */
/* Gabungkan semua sumber data. Artikel yang sama jadi satu kartu.      */
/* ------------------------------------------------------------------ */

type Entry = RawItem & {
  groupSlug: string;
  categorySlug: string;
  index: number;
  manual: boolean;
};

const entries: Entry[] = [
  ...groups.flatMap((g) =>
    g.items.map((item, index) => ({
      ...item,
      groupSlug: g.slug,
      categorySlug: g.categorySlug,
      index,
      manual: false,
    })),
  ),
  ...manualItems.map((item, index) => ({
    ...item,
    groupSlug: MANUAL.slug,
    categorySlug: MANUAL.categorySlug,
    index,
    manual: true,
  })),
];

const byUrl = new Map<string, Entry[]>();
for (const e of entries) {
  const key = urlKey(e.url);
  const list = byUrl.get(key);
  if (list) list.push(e);
  else byUrl.set(key, [e]);
}

function build(list: Entry[]): NewsItem {
  const base = list.find((e) => !e.manual) ?? list[0];
  // Prioritas: data manual dulu, lalu data dokumen Word
  const ranked = [
    ...list.filter((e) => e.manual),
    ...list.filter((e) => !e.manual),
  ];
  const extra = meta[urlKey(base.url)];

  const title =
    ranked
      .map((e) => (isBadTitle(e.title) ? "" : cleanTitle(e.title)))
      .find(Boolean) ||
    titleFromUrl(base.url) ||
    FALLBACK_TITLE;

  const excerpt =
    ranked.map((e) => cleanExcerpt(e.excerpt)).find(Boolean) ||
    cleanExcerpt(extra?.excerpt);

  const image =
    ranked.map((e) => cleanImage(e.image)).find(Boolean) ||
    cleanImage(extra?.image);

  const id = `${base.groupSlug}-${String(base.index + 1).padStart(3, "0")}`;

  return {
    id,
    slug: id,
    title,
    excerpt,
    image,
    url: cleanUrl(base.url),
    publishedAt: normalizeDate(base.date),
    categorySlug: base.categorySlug,
    source: resolveSource(base.sourceSlug),
    sourceSlug: base.sourceSlug,
  } as NewsItem;
}

const built = [...byUrl.values()].map(build);

/* Artikel yang sama dengan URL berbeda (tautan share, versi mobile):
   satu sumber + judul yang sama dianggap satu berita, lalu datanya dilengkapi. */
const normTitle = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const seen = new Map<string, NewsItem>();
const unique: NewsItem[] = [];

for (const item of built) {
  if (item.title === FALLBACK_TITLE) {
    unique.push(item);
    continue;
  }
  const key = `${item.source.slug}|${normTitle(item.title)}`;
  const prev = seen.get(key);
  if (prev) {
    if (!prev.excerpt && item.excerpt) prev.excerpt = item.excerpt;
    if (!prev.image && item.image) prev.image = item.image;
    continue;
  }
  seen.set(key, item);
  unique.push(item);
}

// Berita tanpa deskripsi diberi keterangan cadangan
for (const item of unique) {
  if (!item.excerpt) item.excerpt = fallbackExcerpt(item.publishedAt);
}

const time = (n: NewsItem) => Date.parse(n.publishedAt) || 0;

/** Terbaru dulu. Sort bersifat stabil, jadi tanggal yang sama mengikuti urutan asli. */
export const newsItems: NewsItem[] = unique.sort((a, b) => time(b) - time(a));

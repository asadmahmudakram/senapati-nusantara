import mammoth from "mammoth";
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
const WITH_IMAGES = process.argv.includes("--images"); // ambil gambar tiap link
const RETRY = process.argv.includes("--retry"); // coba lagi link yang sebelumnya gagal
const USE_MICROLINK = process.argv.includes("--microlink");
if (!dir) {
  console.error(
    'Pakai: node scripts/docx-to-liputan.mjs "C:/folder-docx" [--images] [--retry]',
  );
  process.exit(1);
}

const CACHE_FILE = "src/data/liputan.images.json";

// Sesuaikan nama file / kategori / tanggal di sini.
const FILES = [
  {
    file: "BERITA_REVIEW MEDIA_01.docx",
    slug: "review-media-01",
    name: "Review Media 01",
    category: "review-media",
    mode: "review",
    date: "2022-09-14",
  },
  {
    file: "BERITA_REVIEW MEDIA_02.docx",
    slug: "review-media-02",
    name: "Review Media 02",
    category: "review-media",
    mode: "review",
    date: "2022-09-17",
  },
  {
    file: "BERITA_REVIEW MEDIA.docx",
    slug: "review-media-00",
    name: "Review Media",
    category: "review-media",
    mode: "review",
    date: "2022-09-14",
  },
  {
    file: "BERITA_LINK BERITA SN.docx",
    slug: "link-berita-sn",
    name: "Link Berita SN",
    category: "link-berita",
    mode: "links",
    date: "2022-09-14",
  },
  {
    file: "BERITA_REVIEW MEDIA SUMENEP.docx",
    slug: "link-berita-sumenep",
    name: "Link Berita Sumenep",
    category: "link-berita",
    mode: "dated",
    date: "2022-10-14",
  },
];

const MONTHS = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
};
const URL_RE = /https?:\/\/[^\s"”]+/;
const pad = (n) => String(n).padStart(2, "0");

const cleanUrl = (u) => u.replace(/[.,;)]+$/, "");
const cleanTitle = (t = "") =>
  t
    .replace(/^\s*\d+\.\s*/, "")
    .replace(/[“”"]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[\s\-–|:]+$/, "")
    .trim();

// "14 Oktober 2022 | 19.00 WIB" -> "2022-10-14T19:00:00+07:00"; "Oktober 2022" -> "2022-10-01"
function parseId(line) {
  const m = line.match(
    /(?:(\d{1,2})\s+)?(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+(\d{4})(?:\s*\|\s*(\d{1,2})[.:](\d{2}))?/i,
  );
  if (!m) return null;
  const d = `${m[3]}-${pad(MONTHS[m[2].toLowerCase()])}-${pad(m[1] ?? 1)}`;
  return m[4] ? `${d}T${pad(m[4])}:${m[5]}:00+07:00` : d;
}

function shortExcerpt(s) {
  if (!s || /^[….\s]+$/.test(s)) return undefined;
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= 220 ? t : t.slice(0, 220).replace(/\s+\S*$/, "") + "…";
}

function parseReview(text, date) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  const items = [];
  let pending = [];
  for (const b of blocks) {
    const m = b.match(URL_RE);
    if (m && b.replace(m[0], "").trim() === "") {
      items.push({
        title: cleanTitle(pending[0]),
        excerpt: shortExcerpt(pending.slice(1).join(" ")),
        url: cleanUrl(m[0]),
        date,
      });
      pending = [];
    } else pending.push(b);
  }
  return items;
}

function parseLinks(text, date) {
  const items = [];
  let pendingTitle = "";
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (/^[A-Z]\.\s+\S/.test(line)) {
      // header seksi: "A. Rilis PRA-MAS 2, 14 September 2022:"
      date = parseId(line) ?? date;
      pendingTitle = "";
      continue;
    }
    const m = line.match(URL_RE);
    if (!m) {
      if (!/^BERITA\b/i.test(line)) pendingTitle = line;
      continue;
    }
    const title =
      cleanTitle(line.slice(0, m.index)) || cleanTitle(pendingTitle);
    items.push({ title, url: cleanUrl(m[0]), date });
    pendingTitle = "";
  }
  return items;
}

function parseDated(text, date) {
  const items = [];
  let current = date;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(URL_RE);
    if (m) items.push({ title: "", url: cleanUrl(m[0]), date: current });
    else current = parseId(line) ?? current;
  }
  return items;
}

const PARSERS = { review: parseReview, links: parseLinks, dated: parseDated };

const hostOf = (url) => new URL(url).hostname.replace(/^www\./, "");
function baseDomain(host) {
  const p = host.split(".");
  const n = ["co.id", "go.id", "or.id", "web.id", "ac.id"].includes(
    p.slice(-2).join("."),
  )
    ? 3
    : 2;
  return p.slice(-n).join(".");
}

// domain dasar -> slug yang sudah ada di sources.ts
const SLUG_MAP = {
  "antaranews.com": "antara",
  "detik.com": "detik",
  "liputan6.com": "liputan6",
  "kompas.tv": "kompas-tv",
  "suara.com": "suara",
  "tribunnews.com": "tribunnews",
  "tempo.co": "tempo",
  "krjogja.com": "kr-jogja",
  "harianjogja.com": "harian-jogja",
  "harianmerapi.com": "harian-merapi",
  "jpnn.com": "jpnn",
  "merdeka.com": "merdeka",
  "koran-jakarta.com": "koran-jakarta",
  "jawapos.com": "jawapos",
  "kumparan.com": "kumparan",
  "sindonews.com": "sindonews",
  "solopos.com": "solopos",
  "republika.co.id": "republika",
  "idntimes.com": "idn-times",
  "beritasatu.com": "beritasatu",
  "portalmadura.com": "portal-madura",
  "suaramerdeka.com": "suara-merdeka",
  "maduraindepth.com": "madura-indepth",
  "kabarmadura.id": "kabar-madura",
  "sumenepkab.go.id": "pemkab-sumenep",
};
// subdomain yang punya slug sendiri (dicek lebih dulu)
const HOST_MAP = { "radarjogja.jawapos.com": "radar-jogja" };

const sourceSlugOf = (url) => {
  const host = hostOf(url);
  const base = baseDomain(host);
  return HOST_MAP[host] ?? SLUG_MAP[base] ?? base.replace(/\./g, "-");
};

function titleFromUrl(url) {
  const last = decodeURIComponent(
    new URL(url).pathname.split("/").filter(Boolean).pop() ?? "",
  );
  return last
    .replace(/\.html?$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/* ---------- Pengambilan judul dan gambar ---------- */

// Beberapa situs memblokir browser biasa tetapi mengizinkan crawler pratinjau.
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
];

function metaContent(html, key) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const k = tag
      .match(/(?:property|name)=["']([^"']+)["']/i)?.[1]
      ?.toLowerCase();
    if (k === key) return tag.match(/content=["']([^"']*)["']/i)?.[1];
  }
}

function linkImageSrc(html) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (/rel=["']image_src["']/i.test(tag))
      return tag.match(/href=["']([^"']+)["']/i)?.[1];
  }
}

function jsonLdImage(html) {
  for (const m of html.matchAll(
    /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const data = JSON.parse(m[1].trim());
      const nodes = Array.isArray(data)
        ? data
        : [data, ...(Array.isArray(data?.["@graph"]) ? data["@graph"] : [])];
      for (const n of nodes) {
        const im = n?.image ?? n?.thumbnailUrl;
        const first = Array.isArray(im) ? im[0] : im;
        const url = typeof first === "string" ? first : first?.url;
        if (url) return url;
      }
    } catch {
      /* JSON-LD rusak: abaikan */
    }
  }
}

function absUrl(raw, base) {
  if (!raw) return undefined;
  try {
    const u = new URL(raw.replace(/&amp;/g, "&").trim(), base);
    return u.protocol === "http:" || u.protocol === "https:"
      ? u.href
      : undefined;
  } catch {
    return undefined;
  }
}

async function fetchHtml(url, userAgent) {
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": userAgent,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "id-ID,id;q=0.9,en;q=0.7",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    return { html: await res.text(), finalUrl: res.url || url };
  } catch {
    return null;
  }
}

async function getMeta(url) {
  let title;
  for (const ua of USER_AGENTS) {
    const page = await fetchHtml(url, ua);
    if (!page) continue;
    const { html, finalUrl } = page;
    title ??=
      metaContent(html, "og:title") ??
      html.match(/<title>([^<]*)/i)?.[1]?.trim();
    const raw =
      metaContent(html, "og:image") ??
      metaContent(html, "og:image:secure_url") ??
      metaContent(html, "og:image:url") ??
      metaContent(html, "twitter:image") ??
      metaContent(html, "twitter:image:src") ??
      linkImageSrc(html) ??
      jsonLdImage(html);
    const image = absUrl(raw, finalUrl);
    if (image) return { title, image };
  }
  return { title };
}

async function pool(list, n, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < list.length) await fn(list[i++]);
    }),
  );
}

/* ---------- Cache gambar: url -> alamat gambar, atau null jika gagal ---------- */

let imageCache = {};
try {
  imageCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
} catch {
  /* belum ada cache */
}

const groups = [];
const seen = new Set();
const hosts = new Map();

for (const cfg of FILES) {
  const p = path.join(dir, cfg.file);
  if (!fs.existsSync(p)) {
    console.warn("Lewati (tidak ada):", cfg.file);
    continue;
  }
  const { value: text } = await mammoth.extractRawText({ path: p });

  const items = [];
  for (const it of PARSERS[cfg.mode](text, cfg.date)) {
    let u;
    try {
      u = new URL(it.url);
    } catch {
      console.warn("Lewati URL tidak valid:", it.url);
      continue;
    }
    const key = `${cfg.category}|${hostOf(it.url)}${u.pathname.replace(/\/$/, "")}`;
    if (seen.has(key)) continue; // buang duplikat dalam kategori yang sama
    seen.add(key);
    const slug = sourceSlugOf(it.url);
    hosts.set(slug, baseDomain(hostOf(it.url)));

    const cached = imageCache[it.url];
    items.push({
      ...it,
      sourceSlug: slug,
      ...(cached ? { image: cached } : {}),
    });
  }

  // Yang perlu diambil: judul kosong, atau gambar belum ada.
  // Link yang pernah gagal (null di cache) dilewati kecuali memakai --retry.
  const needImage = (i) =>
    WITH_IMAGES && !i.image && (RETRY || !(i.url in imageCache));
  const todo = items.filter((i) => !i.title || needImage(i));
  console.log(`${cfg.file}: ${items.length} item, ${todo.length} perlu fetch`);

  await pool(todo, 8, async (it) => {
    const meta = await getMeta(it.url);
    if (!it.title) it.title = cleanTitle(meta.title) || titleFromUrl(it.url);
    if (WITH_IMAGES) {
      if (meta.image) {
        it.image = meta.image;
        imageCache[it.url] = meta.image;
      } else if (!(it.url in imageCache)) {
        imageCache[it.url] = null; // tandai sudah dicoba
      }
    }
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let microlinkBlocked = false;
    let microlinkChain = Promise.resolve();

    // Satu per satu dan berjeda, supaya tidak kena batas laju
    function microlinkImage(url) {
      const run = async () => {
        if (microlinkBlocked) return undefined;
        try {
          const res = await fetch(
            `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
            { signal: AbortSignal.timeout(25000) },
          );
          if (res.status === 429) {
            microlinkBlocked = true;
            console.warn(
              "Batas harian Microlink tercapai, berhenti memakainya.",
            );
            return undefined;
          }
          const json = await res.json();
          await sleep(800);
          return json?.status === "success"
            ? absUrl(json.data?.image?.url, url)
            : undefined;
        } catch {
          return undefined;
        }
      };
      const p = microlinkChain.then(run);
      microlinkChain = p.catch(() => {});
      return p;
    }

    // Satu link hanya diproses sekali per jalan, walau muncul di beberapa file
    const metaMemo = new Map();
    function getMetaOnce(url) {
      if (!metaMemo.has(url)) {
        metaMemo.set(
          url,
          (async () => {
            const meta = await getMeta(url);
            if (!meta.image && USE_MICROLINK)
              meta.image = await microlinkImage(url);
            return meta;
          })(),
        );
      }
      return metaMemo.get(url);
    }
  });

  groups.push({
    slug: cfg.slug,
    title: cfg.name,
    date: cfg.date,
    categorySlug: cfg.category,
    items: items.map((i) =>
      Object.fromEntries(Object.entries(i).filter(([, v]) => v)),
    ),
  });
}

fs.writeFileSync(
  "src/data/liputan.generated.ts",
  `import type { LiputanGroup } from "@/types/liputan";\n\nexport const generatedGroups: LiputanGroup[] = ${JSON.stringify(groups, null, 2)};\n`,
);
if (WITH_IMAGES) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(imageCache, null, 2) + "\n");
}

const all = groups.flatMap((g) => g.items);
const noImage = all.filter((i) => !i.image);
console.log(
  `\nSelesai: ${all.length} item, ${all.length - noImage.length} punya gambar, ${noImage.length} belum.`,
);
if (WITH_IMAGES && noImage.length > 0) {
  console.log(
    "\nBelum punya gambar (isi manual di liputan.manual.ts atau jalankan lagi dengan --retry):",
  );
  for (const i of noImage) console.log(`  ${i.sourceSlug}  ${i.url}`);
}

// Bandingkan dengan sources.ts yang sebenarnya
let existing = new Set();
try {
  existing = new Set(
    [
      ...fs
        .readFileSync("src/data/sources.ts", "utf8")
        .matchAll(/slug:\s*"([^"]+)"/g),
    ].map((m) => m[1]),
  );
} catch {
  console.warn("src/data/sources.ts tidak terbaca.");
}
const missing = [...hosts].filter(([slug]) => !existing.has(slug)).sort();

console.log(
  missing.length === 0
    ? "\nSemua sumber sudah terdaftar di sources.ts."
    : `\n${missing.length} sumber belum ada di sources.ts:\n`,
);
for (const [slug, domain] of missing) {
  console.log(
    `  { slug: "${slug}", name: "${domain}", url: "https://${domain}" },`,
  );
}

import mammoth from "mammoth";
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
const WITH_IMAGES = process.argv.includes("--images"); // ambil gambar tiap link (lambat)
if (!dir) {
  console.error(
    'Pakai: node scripts/docx-to-liputan.mjs "C:/folder-docx" [--images]',
  );
  process.exit(1);
}

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

// Baca isi <meta> dengan urutan atribut apa pun.
function metaContent(html, key) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const k = tag
      .match(/(?:property|name)=["']([^"']+)["']/i)?.[1]
      ?.toLowerCase();
    if (k === key) return tag.match(/content=["']([^"']*)["']/i)?.[1];
  }
}

async function getMeta(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        accept: "text/html",
      },
      signal: AbortSignal.timeout(12000),
    });
    const html = await res.text();
    const raw =
      metaContent(html, "og:image") ??
      metaContent(html, "og:image:url") ??
      metaContent(html, "twitter:image");
    let image;
    try {
      image = raw ? new URL(raw.replace(/&amp;/g, "&"), url).href : undefined;
    } catch {}
    return {
      title:
        metaContent(html, "og:title") ??
        html.match(/<title>([^<]*)/i)?.[1]?.trim(),
      image,
    };
  } catch {
    return {};
  }
}

async function pool(list, n, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < list.length) await fn(list[i++]);
    }),
  );
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
    items.push({ ...it, sourceSlug: slug });
  }

  const todo = items.filter((i) => !i.title || (WITH_IMAGES && !i.image));
  console.log(`${cfg.file}: ${items.length} item, ${todo.length} perlu fetch`);
  await pool(todo, 8, async (it) => {
    const meta = await getMeta(it.url);
    if (!it.title) it.title = cleanTitle(meta.title) || titleFromUrl(it.url);
    if (meta.image && WITH_IMAGES) it.image = meta.image;
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

const total = groups.reduce((n, g) => n + g.items.length, 0);
const withImage = groups.reduce(
  (n, g) => n + g.items.filter((i) => i.image).length,
  0,
);
console.log(
  `\nSelesai: ${total} item, ${withImage} punya gambar${WITH_IMAGES ? "" : " (jalankan dengan --images untuk mengambil gambar)"}.`,
);

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
    ? "Semua sumber sudah terdaftar di sources.ts."
    : `${missing.length} sumber belum ada di sources.ts:\n`,
);
for (const [slug, domain] of missing) {
  console.log(
    `  { slug: "${slug}", name: "${domain}", url: "https://${domain}" },`,
  );
}

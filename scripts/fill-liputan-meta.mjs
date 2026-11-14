import { readFile, writeFile } from "node:fs/promises";

const DIR = new URL("../src/data/", import.meta.url);
const META_FILE = new URL("liputan.meta.json", DIR);
const FORCE = process.argv.includes("--force");
const MAX = 240;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const BAD_IMAGE = /(logo|favicon|default[_-]?image|portalmadura\.webp|agnez)/i;
const BAD_PAGE =
  /<title[^>]*>[^<]*(just a moment|attention required|security verification|site ready|blank page|404|403|not found|tidak ditemukan)/i;

function urlKey(raw) {
  try {
    const u = new URL(raw);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return raw.replace(/\/+$/, "").toLowerCase();
  }
}

function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function pickMeta(html, names) {
  for (const name of names) {
    const tag = html.match(
      new RegExp(`<meta\\b[^>]*(?:property|name)=["']${name}["'][^>]*>`, "i"),
    );
    if (!tag) continue;
    const c = tag[0].match(/content=(["'])([\s\S]*?)\1/i);
    if (c && c[2].trim()) return decode(c[2]).trim();
  }
  return null;
}

async function getMeta(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "id,en;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  if (BAD_PAGE.test(html))
    throw new Error("halaman diblokir atau tidak ditemukan");

  let desc = pickMeta(html, [
    "og:description",
    "description",
    "twitter:description",
  ]);
  if (desc) {
    desc = desc.replace(/\s+/g, " ").trim();
    if (desc.length < 40) desc = null;
    else if (desc.length > MAX)
      desc = desc.slice(0, MAX).replace(/\s+\S*$/, "") + "…";
  }

  let img = pickMeta(html, ["og:image", "og:image:url", "twitter:image"]);
  if (img) img = new URL(img, res.url).href;
  if (img && BAD_IMAGE.test(img)) img = null;

  return { excerpt: desc || undefined, image: img || undefined };
}

/* ---------- Kumpulkan URL dari kedua file data ---------- */

const genSrc = await readFile(new URL("liputan.generated.ts", DIR), "utf8");
const generated = JSON.parse(
  genSrc.slice(
    genSrc.indexOf("[", genSrc.indexOf("=")),
    genSrc.lastIndexOf("]") + 1,
  ),
);

const info = new Map();
const touch = (url) => {
  const key = urlKey(url);
  if (!info.has(key))
    info.set(key, { url, hasExcerpt: false, hasImage: false });
  return info.get(key);
};

for (const group of generated) {
  for (const it of group.items) {
    const t = touch(it.url);
    if (it.excerpt && it.excerpt.length >= 30) t.hasExcerpt = true;
    if (
      it.image &&
      /^https?:/.test(it.image) &&
      !BAD_IMAGE.test(it.image) &&
      !it.image.endsWith(".")
    )
      t.hasImage = true;
  }
}

const manualSrc = await readFile(new URL("liputan.manual.ts", DIR), "utf8");
for (const m of manualSrc.matchAll(/url:\s*"([^"]+)"/g)) touch(m[1]);

let meta = {};
try {
  meta = JSON.parse(await readFile(META_FILE, "utf8"));
} catch {
  /* file kosong atau belum ada */
}

const todo = [...info.entries()].filter(([key, t]) => {
  if (FORCE) return !t.hasExcerpt || !t.hasImage;
  const needExcerpt = !t.hasExcerpt && !meta[key]?.excerpt;
  const needImage = !t.hasImage && !meta[key]?.image;
  return needExcerpt || needImage;
});

console.log(`${info.size} artikel unik, ${todo.length} perlu dilengkapi.\n`);

/* ---------- Ambil data, 4 permintaan sekaligus ---------- */

const queue = [...todo];
const failed = [];

async function worker() {
  while (queue.length) {
    const [key, t] = queue.shift();
    try {
      const got = await getMeta(t.url);
      const entry = { ...(meta[key] || {}) };
      if (got.excerpt && !t.hasExcerpt) entry.excerpt = got.excerpt;
      if (got.image && !t.hasImage) entry.image = got.image;
      if (entry.excerpt || entry.image) meta[key] = entry;
      const info = [got.excerpt ? "excerpt" : "", got.image ? "gambar" : ""]
        .filter(Boolean)
        .join(" + ");
      console.log("OK   ", info || "(kosong)", "-", t.url);
    } catch (e) {
      failed.push(t.url);
      console.warn("GAGAL", t.url, "-", e.message);
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

/* ---------- Peringatan nilai kembar, lalu simpan ---------- */

for (const field of ["excerpt", "image"]) {
  const count = {};
  for (const v of Object.values(meta))
    if (v[field]) count[v[field]] = (count[v[field]] || 0) + 1;
  for (const [val, n] of Object.entries(count))
    if (n > 1)
      console.warn(
        `\nPERIKSA ${field} kembar (${n} artikel): ${val.slice(0, 90)}`,
      );
}

const sorted = Object.fromEntries(
  Object.entries(meta).sort(([a], [b]) => a.localeCompare(b)),
);
await writeFile(META_FILE, JSON.stringify(sorted, null, 2) + "\n");

console.log(
  `\nSelesai. ${failed.length} artikel gagal diambil (isi manual kalau perlu).`,
);

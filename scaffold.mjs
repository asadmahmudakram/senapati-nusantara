import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  if (!existsSync(path)) writeFileSync(path, content); // tidak menimpa file yang sudah ada
};

const pages = [
  "berita",
  "cari",
  "tentang-kami",
  "tentang-kami/profile",
  "tentang-kami/makna-logo",
  "agenda",
  "kontak-kami",
  "kategori/[...slug]",
  "sumber/[slug]",
  "(legal)/disclaimer",
  "(legal)/kebijakan-privasi",
];

const components = {
  layout: ["Navbar", "MobileMenu", "NavMenu", "Footer", "SearchBar"],
  home: ["HeroSlider", "HeadlineList", "TrendingList", "CategoryBlock"],
  news: ["NewsCard", "NewsMeta", "SourceBadge", "ExternalLink"],
  agenda: ["AgendaCard", "AgendaList"],
  ui: ["Button", "Pagination", "Breadcrumb", "Reveal", "Splash"],
};

const modules = {
  data: ["news", "sources", "categories", "navigation", "site", "agenda"],
  lib: ["news", "feeds", "utils"],
  types: ["news", "source", "category", "agenda"],
};

// Halaman
for (const p of pages) {
  write(
    `src/app/${p}/page.tsx`,
    `export default function Page() {\n  return <main className="mx-auto max-w-6xl p-6">${p}</main>;\n}\n`,
  );
}

// File khusus App Router
write(
  "src/app/not-found.tsx",
  `export default function NotFound() {\n  return <main className="p-6">Halaman tidak ditemukan</main>;\n}\n`,
);
write(
  "src/app/robots.ts",
  `import type { MetadataRoute } from "next";\n\nexport default function robots(): MetadataRoute.Robots {\n  return { rules: { userAgent: "*", allow: "/" } };\n}\n`,
);
write(
  "src/app/sitemap.ts",
  `import type { MetadataRoute } from "next";\n\nexport default function sitemap(): MetadataRoute.Sitemap {\n  return [];\n}\n`,
);

// API
for (const r of ["cari", "sync-feeds"]) {
  write(
    `src/app/api/${r}/route.ts`,
    `export async function GET() {\n  return Response.json({ ok: true });\n}\n`,
  );
}

// Komponen
for (const [dir, names] of Object.entries(components)) {
  for (const n of names) {
    write(
      `src/components/${dir}/${n}.tsx`,
      `export default function ${n}() {\n  return <div>${n}</div>;\n}\n`,
    );
  }
}

// data, lib, types
for (const [dir, names] of Object.entries(modules)) {
  for (const n of names) write(`src/${dir}/${n}.ts`, "export {};\n");
}

// Lain-lain
mkdirSync("public/images", { recursive: true });
write(".env.local", "NEXT_PUBLIC_SITE_URL=http://localhost:3000\n");

console.log("Struktur Senapati Nusantara selesai dibuat.");

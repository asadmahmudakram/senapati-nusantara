import type { Category } from "@/types/category";

export const categories: Category[] = [
  { slug: "nasional", name: "Nasional", description: "Perkembangan terbaru dari pusat pemerintahan dan isu nasional." },
  { slug: "politik", name: "Politik", parentSlug: "nasional", description: "Dinamika politik, parlemen, dan partai." },
  { slug: "hukum", name: "Hukum", parentSlug: "nasional", description: "Peradilan, penegakan hukum, dan regulasi." },

  { slug: "ekonomi", name: "Ekonomi", description: "Kabar ekonomi, dunia usaha, dan keuangan." },
  { slug: "bisnis", name: "Bisnis", parentSlug: "ekonomi", description: "Industri, perdagangan, dan UMKM." },
  { slug: "keuangan", name: "Keuangan", parentSlug: "ekonomi", description: "Pasar modal, perbankan, dan nilai tukar." },

  { slug: "daerah", name: "Daerah", description: "Berita dari berbagai provinsi, kabupaten, dan kota." },
  { slug: "internasional", name: "Internasional", description: "Peristiwa dunia dan hubungan luar negeri." },
  { slug: "teknologi", name: "Teknologi", description: "Gawai, internet, dan inovasi." },
  { slug: "olahraga", name: "Olahraga", description: "Hasil pertandingan dan kabar atlet." },
  { slug: "hiburan", name: "Hiburan", description: "Film, musik, dan budaya populer." },
  { slug: "gaya-hidup", name: "Gaya hidup", description: "Kesehatan, kuliner, dan keseharian." },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug);
}

/** Rantai dari kategori utama sampai kategori itu sendiri. */
export function getCategoryTrail(category: Category): Category[] {
  const trail = [category];
  let current = category;
  while (current.parentSlug) {
    const parent = bySlug.get(current.parentSlug);
    if (!parent) break;
    trail.unshift(parent);
    current = parent;
  }
  return trail;
}

/** Contoh: "nasional/politik". Dipakai untuk URL /kategori/... */
export function categoryPath(category: Category): string {
  return getCategoryTrail(category)
    .map((c) => c.slug)
    .join("/");
}

/** Mengembalikan kategori hanya jika seluruh jalurnya cocok (nasional/politik, bukan ekonomi/politik). */
export function findCategoryByPath(segments: string[]): Category | undefined {
  const leaf = bySlug.get(segments[segments.length - 1]);
  if (!leaf) return undefined;
  return categoryPath(leaf) === segments.join("/") ? leaf : undefined;
}

export const topLevelCategories = categories.filter((c) => !c.parentSlug);

export function getChildCategories(slug: string): Category[] {
  return categories.filter((c) => c.parentSlug === slug);
}

/** Slug kategori itu sendiri ditambah seluruh turunannya. Dipakai untuk menyaring berita. */
export function getDescendantSlugs(slug: string): string[] {
  return [slug, ...getChildCategories(slug).flatMap((c) => getDescendantSlugs(c.slug))];
}
import type { Category } from "@/types/category";

export const categories: Category[] = [
  {
    slug: "review-media",
    name: "Review Media",
    description:
      "Ulasan dan liputan media tentang kegiatan Senapati Nusantara.",
  },
  {
    slug: "link-berita",
    name: "Link Berita",
    description:
      "Tautan berita tentang Senapati Nusantara dari berbagai media.",
  },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));

if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  for (const c of categories) {
    if (seen.has(c.slug)) throw new Error(`Slug kategori ganda: ${c.slug}`);
    seen.add(c.slug);
    if (c.parentSlug && !bySlug.has(c.parentSlug)) {
      throw new Error(
        `parentSlug tidak ditemukan: ${c.parentSlug} (di ${c.slug})`,
      );
    }
  }
}

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

/** Contoh: "review-media". Untuk kategori bertingkat: "induk/anak". Dipakai untuk URL /kategori/... */
export function categoryPath(category: Category): string {
  return getCategoryTrail(category)
    .map((c) => c.slug)
    .join("/");
}

/** Mengembalikan kategori hanya jika seluruh jalurnya cocok dengan susunan induk dan anaknya. */
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
  return [
    slug,
    ...getChildCategories(slug).flatMap((c) => getDescendantSlugs(c.slug)),
  ];
}
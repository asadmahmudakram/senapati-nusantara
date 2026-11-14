import type { Category } from "@/types/category";
import type { NewsItem } from "@/types/news";
import { getDescendantSlugs, getCategory, topLevelCategories } from "@/data/categories";
import { newsItems } from "@/data/news";
import { getSource } from "@/data/sources";
import { getFeedItems } from "@/lib/feeds";


export const PER_PAGE = 12;

/** Awalan id untuk berita contoh di data/news.ts. */
const SAMPLE_PREFIX = "contoh-";

const byNewest = (a: NewsItem, b: NewsItem) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt);

/**
 * Semua berita, terbaru lebih dulu. Sumbernya data/news.ts ditambah hasil sinkronisasi RSS.
 * Begitu ada berita dari RSS, berita contoh otomatis disembunyikan.
 */
export function getAllNews(): NewsItem[] {
  const live = getFeedItems();
  const curated = live.length > 0 ? newsItems.filter((item) => !item.id.startsWith(SAMPLE_PREFIX)) : newsItems;

  const seen = new Set<string>();
  const merged: NewsItem[] = [];
  for (const item of [...curated, ...live]) {
    const key = item.id.startsWith(SAMPLE_PREFIX) ? item.id : item.url;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return merged.sort(byNewest);
}

export function getLatest(limit: number): NewsItem[] {
  return getAllNews().slice(0, limit);
}

/** Berita untuk slider: yang bertanda featured dulu, lalu dilengkapi berita terbaru yang punya gambar. */
export function getFeatured(limit: number): NewsItem[] {
  const all = getAllNews();
  const picked = all.filter((item) => item.featured);
  const rest = all.filter((item) => !item.featured);
  const withImage = rest.filter((item) => item.image);
  const withoutImage = rest.filter((item) => !item.image);
  return [...picked, ...withImage, ...withoutImage].slice(0, limit);
}

/**
 * Daftar pilihan redaksi: hanya berita yang diberi flag trending di data. Belum ada data
 * jumlah pembaca, jadi hasilnya bisa kosong dan beranda menyembunyikan bagiannya.
 */
export function getTrending(limit: number): NewsItem[] {
  return getAllNews()
    .filter((item) => item.trending)
    .slice(0, limit);
}

/** Berita dalam satu kategori, termasuk semua subkategorinya. */
export function getByCategory(slug: string): NewsItem[] {
  const slugs = new Set(getDescendantSlugs(slug));
  return getAllNews().filter((item) => slugs.has(item.categorySlug));
}

export function getBySource(slug: string): NewsItem[] {
  return getAllNews().filter((item) => item.sourceSlug === slug);
}

/** Blok kategori untuk beranda: kategori utama yang punya berita, masing-masing dibatasi perBlock. */
export function getCategoryBlocks(
  blockCount: number,
  perBlock: number,
): { category: Category; items: NewsItem[] }[] {
  return topLevelCategories
    .map((category) => ({ category, items: getByCategory(category.slug).slice(0, perBlock) }))
    .filter((block) => block.items.length > 0)
    .slice(0, blockCount);
}

/** Pencarian sederhana: semua kata kunci harus ada di judul, ringkasan, nama media, atau kategori. */
export function searchNews(query: string): NewsItem[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return getAllNews().filter((item) => {
    const haystack = [
      item.title,
      item.excerpt,
      getSource(item.sourceSlug)?.name ?? "",
      getCategory(item.categorySlug)?.name ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export type Paginated<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
};

/** Halaman di luar jangkauan otomatis disesuaikan ke halaman terdekat. */
export function paginate<T>(items: T[], page: number, perPage: number = PER_PAGE): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  const start = (current - 1) * perPage;
  return { items: items.slice(start, start + perPage), page: current, totalPages, total };
}
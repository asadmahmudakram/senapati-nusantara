export type SourceFeed = {
  /** Alamat RSS (format RSS 2.0). */
  url: string;
  /** Kategori untuk semua berita dari feed ini. Harus ada di data/categories.ts. */
  categorySlug: string;
};

export type Source = {
  slug: string;
  name: string;
  /** Beranda situs media. */
  url: string;
  /** Feed RSS untuk sinkronisasi otomatis (opsional). Satu media boleh punya beberapa feed. */
  feeds?: SourceFeed[];
};
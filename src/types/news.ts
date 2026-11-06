export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  /** Ringkasan singkat, bukan salinan isi artikel. */
  excerpt: string;
  /** Tautan ke artikel asli di situs media. */
  url: string;
  /** URL gambar. Jika kosong, dipakai siteConfig.placeholderImage. */
  image?: string;
  /** Format ISO 8601, misalnya "2026-11-05T08:00:00+07:00". */
  publishedAt: string;
  sourceSlug: string;
  categorySlug: string;
  /** Tampil di slider beranda. */
  featured?: boolean;
  /** Tampil di daftar populer. */
  trending?: boolean;
};
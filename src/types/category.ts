export type Category = {
  /** Harus unik di seluruh kategori, termasuk subkategori. */
  slug: string;
  name: string;
  description?: string;
  /** Slug kategori induk. Kosong untuk kategori utama. */
  parentSlug?: string;
};
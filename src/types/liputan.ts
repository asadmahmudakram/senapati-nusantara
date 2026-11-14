export type LiputanItem = {
  sourceSlug: string;
  date: string; // YYYY-MM-DD, boleh dengan jam: YYYY-MM-DDTHH:mm
  title: string;
  url: string;
  image?: string;
  excerpt?: string;
};

/** Bentuk yang dipakai halaman /liputan (liputan.ts): judul dan tanggal wajib ada. */
export type LiputanGroup = {
  slug: string;
  title: string;
  date: string;
  items: LiputanItem[];
};

/** Bentuk data hasil generate dari dokumen Word (liputan.generated.ts). */
export type GeneratedGroup = {
  slug: string;
  name: string;
  categorySlug: string;
  items: LiputanItem[];
};
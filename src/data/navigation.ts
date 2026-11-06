import { categories, categoryPath } from "@/data/categories";

export type NavItem = {
  label: string;
  /** Harus halaman yang valid. Menu seluler memakainya untuk tautan "Semua ...". */
  href: string;
  children?: NavItem[];
};

function categoryNav(parentSlug?: string): NavItem[] {
  return categories
    .filter((c) => c.parentSlug === parentSlug)
    .map((c) => {
      const children = categoryNav(c.slug);
      return {
        label: c.name,
        href: `/kategori/${categoryPath(c)}`,
        ...(children.length > 0 ? { children } : {}),
      };
    });
}

export const mainNav: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/berita", children: categoryNav() },
  {
    label: "Tentang",
    href: "/tentang",
    children: [
      { label: "Kirim tautan", href: "/kirim-tautan" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
];

export const footerNav: NavItem[] = [
  { label: "Semua berita", href: "/berita" },
  { label: "Tentang kami", href: "/tentang" },
  { label: "Kirim tautan", href: "/kirim-tautan" },
  { label: "Kontak", href: "/kontak" },
  { label: "Penafian", href: "/disclaimer" },
  { label: "Kebijakan privasi", href: "/kebijakan-privasi" },
];

/** Isi dengan akun resmi, misalnya { label: "Instagram", href: "https://instagram.com/akunanda" }. */
export const socialLinks: { label: string; href: string }[] = [];
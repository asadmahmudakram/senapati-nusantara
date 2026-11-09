import { categories, categoryPath } from "@/data/categories";
import { sources } from "@/data/sources";

export type NavItem = {
  label: string;
  /** Kosongkan untuk menu yang hanya membuka submenu (tanpa halaman sendiri). */
  href?: string;
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
    label: "Media",
    children: sources.map((s) => ({ label: s.name, href: `/sumber/${s.slug}` })),
  },
  {
    label: "Tentang kami",
    href: "/tentang",
    children: [
      { label: "Kirim tautan", href: "/kirim-tautan" },
      { label: "Penafian", href: "/disclaimer" },
      { label: "Kebijakan privasi", href: "/kebijakan-privasi" },
    ],
  },
  { label: "Kontak", href: "/kontak" },
];

export const footerNav: { label: string; href: string }[] = [
  { label: "Semua berita", href: "/berita" },
  { label: "Tentang kami", href: "/tentang" },
  { label: "Kirim tautan", href: "/kirim-tautan" },
  { label: "Kontak", href: "/kontak" },
  { label: "Penafian", href: "/disclaimer" },
  { label: "Kebijakan privasi", href: "/kebijakan-privasi" },
];

/** Isi dengan akun resmi, misalnya { label: "Instagram", href: "https://instagram.com/akunanda" }. */
export const socialLinks: { label: string; href: string }[] = [];
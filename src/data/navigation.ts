import { categories, categoryPath } from "@/data/categories";

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
  {
    label: "Tentang Kami",

    children: [
      { label: "Profile Senapati Nusantara", href: "/tentang-kami/profile" },
      { label: "Makna Logo", href: "/tentang-kami/makna-logo" },
    ],
  },
  {
    label: "Berita",

    children: [
      { label: "Semua Berita", href: "/berita" },
      { label: "Review Media", href: "/kategori/review-media" },
      { label: "Link Berita", href: "/kategori/link-berita" },
    ],
  },
  { label: "Agenda", href: "/agenda" },
  { label: "Kontak Kami", href: "/kontak-kami" },
];

export const footerNav: { label: string; href: string }[] = [
  { label: "Penafian/Disclaimer", href: "/disclaimer" },
  { label: "Kebijakan privasi", href: "/kebijakan-privasi" },
];

export const socialLinks: { label: string; href: string }[] = [
  { label: "YouTube", href: "https://www.youtube.com/@senapatinusantara" },
  { label: "Facebook", href: "https://www.facebook.com/senapatinusantara" },
  { label: "Instagram", href: "https://www.instagram.com/senapatinusantara" },
];

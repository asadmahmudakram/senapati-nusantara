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
  { label: "BERANDA", href: "/" },
  {
    label: "TENTANG KAMI",
    children: [
      { label: "PROFILE SENAPATI NUSANTARA", href: "/tentang-kami/profile" },
      { label: "MAKNA LOGO", href: "/tentang-kami/makna-logo" },
    ],
  },
  {
    label: "BERITA",
    children: [
      { label: "SEMUA BERITA", href: "/berita" },
      { label: "REVIEW MEDIA", href: "/kategori/review-media" },
      { label: "LINK BERITA", href: "/kategori/link-berita" },
    ],
  },
  {
    label: "GALERI",
    children: [
      { label: "VIDEO SENAPATI NUSANTARA", href: "/galeri/video" },
      { label: "GALERI FOTO-FOTO", href: "/galeri/foto" },
    ],
  },
  { label: "AGENDA", href: "/agenda" },
  { label: "KONTAK KAMI", href: "/kontak-kami" },
];

export const footerNav: { label: string; href: string }[] = [
  { label: "Penafian/Disclaimer", href: "/disclaimer" },
  { label: "Kebijakan privasi", href: "/kebijakan-privasi" },
];

export const socialLinks: { label: string; href: string }[] = [
  { label: "YouTube", href: "https://www.youtube.com/@senapatinusantara8328" },
  { label: "Facebook", href: "https://www.facebook.com/senapatinusantara" },
  { label: "Instagram", href: "https://www.instagram.com/senapatinusantara" },
];

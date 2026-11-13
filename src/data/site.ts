export const siteConfig = {
  name: "Senapati Nusantara",
  tagline: "Kabar terkini dari seluruh Nusantara",
  description:
    "Portal yang merangkum headline dari berbagai media nasional dan daerah, dengan tautan langsung ke sumber aslinya.",
  /** Atur NEXT_PUBLIC_SITE_URL di .env.local dan di hosting. */
url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://senapatinusantara.org",
  /** Ganti lewat NEXT_PUBLIC_CONTACT_EMAIL. Nilai bawaan hanyalah contoh. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "redaksi@example.com",
  /** Letakkan gambarnya di public/images/placeholder.svg. */
  placeholderImage: "/images/placeholder.svg",
} as const;
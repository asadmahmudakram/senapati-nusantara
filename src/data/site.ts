export const siteConfig = {
  name: "Senapati Nusantara",
  fullName: "Serikat Nasional Pelestari Tosan Aji Nusantara",
  legalNumber: "SK Kemenkumham Nomor AHU.0015215.AH.01.07.2017",
  tagline: "Kabar terkini dari seluruh Nusantara",
  domain: "senapatinusantara.org",
  description:
    "Portal yang merangkum headline dari berbagai media nasional dan daerah, dengan tautan langsung ke sumber aslinya.",
  /** Atur NEXT_PUBLIC_SITE_URL di .env.local dan di hosting. */
url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://senapatinusantara.org",
  /** Ganti lewat NEXT_PUBLIC_CONTACT_EMAIL. Nilai bawaan hanyalah contoh. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "redaksi@example.com",
  /** Letakkan gambarnya di public/images/placeholder.svg. */
  placeholderImage: "/images/placeholder.svg",
  address: {
    label: "Sekretariat",
    lines: [
      "Jl. Ring-Road Selatan No. 69, Sokowaten",
      "Tamanan, Banguntapan, Bantul",
      "D.I. Yogyakarta 55191",
    ],
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Jl.%20Ring-Road%20Selatan%20No.%2069%2C%20Sokowaten%2C%20Tamanan%2C%20Banguntapan%2C%20Bantul%2C%20D.I.%20Yogyakarta%2055191",
} as const;
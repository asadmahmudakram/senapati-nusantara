import type { Source } from "@/types/source";

// Untuk sinkronisasi RSS, tambahkan pada media yang diinginkan, setelah alamat feed-nya dipastikan:
//   feeds: [{ url: "https://.../rss", categorySlug: "nasional" }]
// Dibaca oleh lib/feeds.ts.
export const sources: Source[] = [
  { slug: "kompas", name: "Kompas", url: "https://www.kompas.com" },
  { slug: "tempo", name: "Tempo", url: "https://www.tempo.co" },
  { slug: "detik", name: "Detik", url: "https://www.detik.com" },
  { slug: "cnn-indonesia", name: "CNN Indonesia", url: "https://www.cnnindonesia.com" },
  { slug: "antara", name: "Antara", url: "https://www.antaranews.com" },
  { slug: "kumparan", name: "Kumparan", url: "https://kumparan.com" },
  { slug: "liputan6", name: "Liputan6", url: "https://www.liputan6.com" },
  { slug: "tribunnews", name: "Tribunnews", url: "https://www.tribunnews.com" },
  { slug: "cnbc-indonesia", name: "CNBC Indonesia", url: "https://www.cnbcindonesia.com" },
  { slug: "bisnis", name: "Bisnis.com", url: "https://www.bisnis.com" },
  { slug: "republika", name: "Republika", url: "https://www.republika.co.id" },
  { slug: "media-indonesia", name: "Media Indonesia", url: "https://mediaindonesia.com" },
];

const bySlug = new Map(sources.map((s) => [s.slug, s]));

export function getSource(slug: string): Source | undefined {
  return bySlug.get(slug);
}
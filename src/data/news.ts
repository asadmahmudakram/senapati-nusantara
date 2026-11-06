import type { NewsItem } from "@/types/news";
import { getSource } from "@/data/sources";

/**
 * DATA CONTOH untuk pengembangan. Judulnya sengaja diawali "[Contoh]" dan semua tautan
 * mengarah ke beranda media. Ganti dengan data asli atau hasil sinkronisasi RSS (lib/feeds.ts).
 */

const BASE_TIME = new Date("2026-11-05T08:00:00+07:00").getTime();

const hoursAgo = (h: number) => new Date(BASE_TIME - h * 3_600_000).toISOString();

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type Seed = {
  title: string;
  categorySlug: string;
  sourceSlug: string;
  hoursAgo: number;
  featured?: boolean;
  trending?: boolean;
};

const seeds: Seed[] = [
  { title: "[Contoh] Sidang paripurna bahas rancangan anggaran", categorySlug: "politik", sourceSlug: "kompas", hoursAgo: 1, featured: true, trending: true },
  { title: "[Contoh] Penegak hukum periksa sejumlah saksi kasus korupsi daerah", categorySlug: "hukum", sourceSlug: "tempo", hoursAgo: 2, featured: true },
  { title: "[Contoh] Rupiah bergerak terbatas di awal pekan", categorySlug: "keuangan", sourceSlug: "cnbc-indonesia", hoursAgo: 3, featured: true, trending: true },
  { title: "[Contoh] Pemerintah daerah siapkan program perbaikan jalan", categorySlug: "daerah", sourceSlug: "antara", hoursAgo: 4, featured: true },
  { title: "[Contoh] Startup lokal luncurkan layanan berbasis kecerdasan buatan", categorySlug: "teknologi", sourceSlug: "kumparan", hoursAgo: 5, featured: true, trending: true },
  { title: "[Contoh] Timnas bersiap menghadapi laga persahabatan", categorySlug: "olahraga", sourceSlug: "detik", hoursAgo: 6, trending: true },
  { title: "[Contoh] Festival film daerah kembali digelar", categorySlug: "hiburan", sourceSlug: "liputan6", hoursAgo: 7 },
  { title: "[Contoh] Tips menjaga pola tidur di musim hujan", categorySlug: "gaya-hidup", sourceSlug: "kompas", hoursAgo: 8 },
  { title: "[Contoh] Pertemuan regional bahas kerja sama perdagangan", categorySlug: "internasional", sourceSlug: "cnn-indonesia", hoursAgo: 9, trending: true },
  { title: "[Contoh] Pelaku usaha kecil mendapat pelatihan digital", categorySlug: "bisnis", sourceSlug: "bisnis", hoursAgo: 10 },
  { title: "[Contoh] Partai gelar konsolidasi menjelang tahun politik", categorySlug: "politik", sourceSlug: "tribunnews", hoursAgo: 11 },
  { title: "[Contoh] Mahkamah gelar sidang uji materi undang-undang", categorySlug: "hukum", sourceSlug: "antara", hoursAgo: 12, trending: true },
  { title: "[Contoh] Pemerintah pusat luncurkan program layanan terpadu", categorySlug: "nasional", sourceSlug: "kompas", hoursAgo: 13 },
  { title: "[Contoh] Inflasi bulanan tercatat stabil", categorySlug: "ekonomi", sourceSlug: "republika", hoursAgo: 14 },
  { title: "[Contoh] Bank sentral pertahankan suku bunga acuan", categorySlug: "keuangan", sourceSlug: "cnbc-indonesia", hoursAgo: 15 },
  { title: "[Contoh] Pasar tradisional dipadati pembeli jelang akhir pekan", categorySlug: "daerah", sourceSlug: "tribunnews", hoursAgo: 16 },
  { title: "[Contoh] Peneliti kembangkan baterai berbiaya rendah", categorySlug: "teknologi", sourceSlug: "tempo", hoursAgo: 18 },
  { title: "[Contoh] Klub tuan rumah menang tipis di kandang", categorySlug: "olahraga", sourceSlug: "kumparan", hoursAgo: 20 },
  { title: "[Contoh] Konser amal kumpulkan dana pendidikan", categorySlug: "hiburan", sourceSlug: "detik", hoursAgo: 22 },
  { title: "[Contoh] Resep sarapan sehat dari bahan lokal", categorySlug: "gaya-hidup", sourceSlug: "liputan6", hoursAgo: 24 },
  { title: "[Contoh] Delegasi bahas isu perubahan iklim di forum dunia", categorySlug: "internasional", sourceSlug: "antara", hoursAgo: 27 },
  { title: "[Contoh] Ekspor produk pertanian naik pada kuartal ini", categorySlug: "bisnis", sourceSlug: "bisnis", hoursAgo: 30 },
  { title: "[Contoh] Komisi dewan undang pakar bahas kebijakan pendidikan", categorySlug: "politik", sourceSlug: "media-indonesia", hoursAgo: 33 },
  { title: "[Contoh] Warga bergotong royong membersihkan sungai", categorySlug: "daerah", sourceSlug: "republika", hoursAgo: 36 },
  { title: "[Contoh] Aplikasi layanan publik menambah fitur baru", categorySlug: "teknologi", sourceSlug: "detik", hoursAgo: 40 },
  { title: "[Contoh] Atlet muda meraih medali di kejuaraan nasional", categorySlug: "olahraga", sourceSlug: "antara", hoursAgo: 44 },
];

const seedNews: NewsItem[] = seeds.map((seed, i) => {
  const source = getSource(seed.sourceSlug);
  if (!source) throw new Error(`Sumber tidak dikenal di data/news.ts: ${seed.sourceSlug}`);

  return {
    id: `contoh-${i + 1}`,
    slug: slugify(seed.title),
    title: seed.title,
    excerpt: `Ringkasan singkat berita contoh dari ${source.name}. Ganti dengan data asli atau hasil sinkronisasi RSS.`,
    url: source.url,
    // Gambar contoh bergantian dari public/images/contoh/. Berita asli memakai gambar dari media.
    image: `/images/contoh/${(i % 5) + 1}.svg`,
    publishedAt: hoursAgo(seed.hoursAgo),
    sourceSlug: seed.sourceSlug,
    categorySlug: seed.categorySlug,
    featured: seed.featured,
    trending: seed.trending,
  };
  
});
const realNews: NewsItem[] = [
  {
    id: "detik-8740537",
    slug: "ajudan-jokowi-jadi-saksi-di-sidang-dr-tifa-12-november",
    title: "Ajudan Jokowi Jadi Saksi di Sidang dr Tifa 12 November",
    excerpt: "Majelis hakim menjadwalkan pemeriksaan ajudan Jokowi sebagai saksi pada lanjutan sidang pekan depan.",
    url: "https://news.detik.com/berita/d-8740537/ajudan-jokowi-jadi-saksi-di-sidang-dr-tifa-12-november",
    image: "https://awsimages.detik.net.id/community/media/visual/2026/07/23/sidang-dr-tifa-di-pn-jaktim-muliadetikcom-1784775725025_169.jpeg?w=700&q=90",
    publishedAt: "2026-11-06T03:41:00+07:00",
    sourceSlug: "detik",
    categorySlug: "hukum",
    featured: true,
  },
    {
    id: "kompas-22344781",
    slug: "sidang-ijazah-jokowi-memanas-dokter-tifa-protes-jatah-bertanya-hanya-30-menit",
    title: "Sidang Ijazah Jokowi Memanas, Dokter Tifa Protes Jatah Bertanya Hanya 30 Menit",
    excerpt: "Dokter Tifa memprotes pembatasan waktu bertanya dalam sidang yang berlangsung memanas.",
    url: "https://megapolitan.kompas.com/read/2026/11/05/22344781/sidang-ijazah-jokowi-memanas-dokter-tifa-protes-jatah-bertanya-hanya-30?source=headline",
    publishedAt: "2026-11-05T22:34:00+07:00",
    sourceSlug: "kompas",
    categorySlug: "hukum",
  },
    {
    id: "detik-8740541",
    slug: "soroti-transkip-nilai-dr-tifa-pertanyakan-3-semester-kuliah-jokowi-di-ugm",
    title: "Soroti Transkip Nilai, dr Tifa Pertanyakan 3 Semester Kuliah Jokowi di UGM",
    excerpt: "Seusai sidang, dr Tifa menyampaikan pandangannya soal dokumen transkrip nilai dan riwayat kuliah Jokowi di UGM.",
    url: "https://news.detik.com/berita/d-8740541/soroti-transkip-nilai-dr-tifa-pertanyakan-3-semester-kuliah-jokowi-di-ugm",
    image: "https://awsimages.detik.net.id/community/media/visual/2026/11/05/jokowi-bawa-foto-dan-dokumen-saat-jadi-saksi-kasus-dokter-tifa-1793896750260_169.jpeg?w=700&q=90",
    publishedAt: "2026-11-06T04:25:00+07:00",
    sourceSlug: "detik",
    categorySlug: "hukum",
  },
];

export const newsItems: NewsItem[] = [...realNews, ...seedNews];
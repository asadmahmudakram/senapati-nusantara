import type { NewsItem } from "@/types/news";
import { getSource } from "@/data/sources";

/**
 * DATA CONTOH untuk pengembangan. Judulnya sengaja diawali "[Contoh]" dan semua tautan
 * mengarah ke beranda media. Ganti dengan data asli atau hasil sinkronisasi RSS (lib/feeds.ts).
 */

/**
 * BERITA YANG DIISI MANUAL. Tambahkan objek baru di bagian atas daftar ini.
 * Selama daftar ini berisi minimal satu berita, berita contoh di bawah tidak ditampilkan.
 * Aturan isi: excerpt ditulis sendiri (1 kalimat), url ke artikel asli, image dari halaman artikelnya.
 */
const manualNews: NewsItem[] = [
  {
    id: "cnbc-783480",
    slug: "kejayaan-nvidia-runtuh-seketika-setelah-ceo-mengaku-selingkuh",
    title: "Kejayaan Nvidia Runtuh Seketika Setelah CEO Mengaku Selingkuh",
    excerpt: "Dewan komisaris Nvidia membuka penyelidikan independen atas CEO Jensen Huang, dan saham perusahaan melemah di perdagangan luar jam reguler.",
    url: "https://www.cnbcindonesia.com/tech/20261109111306-37-783480/kejayaan-nvidia-runtuh-seketika-setelah-ceo-mengaku-selingkuh",
    image: "https://awsimages.detik.net.id/visual/2026/11/09/ellis-huang-1794182202198_169.png?w=650&q=90",
    publishedAt: "2026-11-09T12:05:00+07:00",
    sourceSlug: "cnbc-indonesia",
    categorySlug: "teknologi",
  },
  {
    id: "antara-5840847",
    slug: "batam-uji-coba-program-mbg-dengan-metode-prasmanan-pertama-di-kepri",
    title: "Batam uji coba program MBG dengan metode prasmanan pertama di Kepri",
    excerpt: "Sebuah sekolah dasar di Batam menjadi lokasi uji coba penyajian MBG model prasmanan pertama di Kepulauan Riau, berlangsung dua minggu.",
    url: "https://www.antaranews.com/berita/5840847/batam-uji-coba-program-mbg-dengan-metode-prasmanan-pertama-di-kepri",
    image: "https://img.antaranews.com/cache/1200x800/2026/11/09/IMG_6250.jpeg",
    publishedAt: "2026-11-09T12:07:46+07:00",
    sourceSlug: "antara",
    categorySlug: "daerah",
  },
  {
    id: "kompas-22344781",
    slug: "sidang-ijazah-jokowi-memanas-dokter-tifa-protes-jatah-bertanya-hanya-30-menit",
    title: "Sidang Ijazah Jokowi Memanas, Dokter Tifa Protes Jatah Bertanya Hanya 30 Menit",
    excerpt: "Dokter Tifa memprotes pembatasan waktu bertanya dalam sidang yang berlangsung memanas.",
    url: "https://megapolitan.kompas.com/read/2026/11/05/22344781/sidang-ijazah-jokowi-memanas-dokter-tifa-protes-jatah-bertanya-hanya-30",
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
    {
    id: "kompas-lestari-140100786",
    slug: "saat-ai-mendorong-kebutuhan-listrik-mitsubishi-power-bersiap-menjawab-tantangan-baru",
    title: "Saat AI Mendorong Kebutuhan Listrik, Mitsubishi Power Bersiap Menjawab Tantangan Baru",
    excerpt: "Lonjakan kebutuhan listrik dari pusat data AI dan cara Mitsubishi Power menyiapkan teknologi pembangkitnya.",
    url: "https://lestari.kompas.com/read/cm/2026/10/29/140100786/saat-ai-mendorong-kebutuhan-listrik-mitsubishi-power-bersiap-menjawab",
    image: "https://asset.kompas.com/crops/C_YXtA-7b_Utbf59_HAwr05vYCU=/0x0:1536x1024/1200x675/data/photo/2026/10/28/6ae1e213c0ac9.png",
    publishedAt: "2026-10-29T14:01:00+07:00",
    sourceSlug: "kompas",
    categorySlug: "bisnis",
  },

  // TEMPO: belum bisa diisi dari sini karena Tempo memblokir akses otomatis.
  // Buka artikelnya, isi 3 bagian bertanda ISI, lalu hapus tanda komentar /* dan */.
  /*
  {
    id: "tempo-2304081",
    slug: "penyadapan-ilegal-sejumlah-kapolri",
    title: "ISI judul persis dari halaman artikel",
    excerpt: "ISI ringkasan satu kalimat dengan kata-kata Anda sendiri.",
    url: "https://www.tempo.co/hukum/penyadapan-ilegal-sejumlah-kapolri-2304081",
    image: "ISI alamat gambar (klik kanan gambar artikel, pilih salin alamat gambar)",
    publishedAt: "ISI tanggal terbit, contoh 2026-11-09T10:00:00+07:00",
    sourceSlug: "tempo",
    categorySlug: "hukum",
  },
  */
];

/* ===== Berita contoh (otomatis disembunyikan jika manualNews terisi) ===== */

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

const sampleNews: NewsItem[] = seeds.map((seed, i) => {
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

export const newsItems: NewsItem[] = manualNews.length > 0 ? manualNews : sampleNews;
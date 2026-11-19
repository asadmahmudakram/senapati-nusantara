// src/data/galeri.ts

export type Foto = { src: string; alt: string };

export type Album = {
  slug: string;
  judul: string;
  keterangan?: string;
  foto: Foto[];
};

export type Video = {
  /** ID video YouTube, yaitu bagian setelah "v=" di alamat videonya. */
  id: string;
  judul: string;
};

const nomor = (n: number) => String(n).padStart(2, "0");

/**
 * Membuat daftar foto berurutan dari satu folder di public/images/galeri/.
 * Contoh: seri("mas-2/kongres", "Kongres MAS #2", 9) mengharapkan file
 *   public/images/galeri/mas-2/kongres/01.jpg ... 09.jpg
 */
function seri(folder: string, label: string, jumlah: number): Foto[] {
  return Array.from({ length: jumlah }, (_, i) => ({
    src: `/images/galeri/${folder}/${nomor(i + 1)}.jpg`,
    alt: `${label}, foto ${i + 1}`,
  }));
}

export const albums: Album[] = [
  {
    slug: "mas-2-kongres",
    judul: "Kongres MAS #2",
    keterangan: "Dokumentasi Kongres Musyawarah Agung SENAPATI NUSANTARA #2.",
    foto: seri("mas-2/kongres", "Kongres MAS #2", 9),
  },
  {
    slug: "mas-2-pagelaran",
    judul: "Pagelaran MAS #2",
    keterangan: "Dokumentasi Pagelaran keris dan tosan aji MAS #2.",
    foto: seri("mas-2/pagelaran", "Pagelaran MAS #2", 9),
  },
  {
    slug: "mas-2-bursa",
    judul: "Bursa MAS #2",
    keterangan: "Dokumentasi Bursa Tosan Aji MAS #2.",
    foto: seri("mas-2/bursa", "Bursa MAS #2", 9),
  },
];

export const channelYoutube = "https://www.youtube.com/@senapatinusantara";

/**
 * Tambahkan video di sini. Contoh:
 *   { id: "dQw4w9WgXcQ", judul: "Judul video" },
 * Kosongkan bila belum ada: halaman akan menampilkan tautan ke kanal YouTube.
 */
export const videos: Video[] = [
  { id: "dZSRF7V_ZJA", judul: "Video Senapati Nusantara 1" },
  { id: "vtV-uGR_260", judul: "Video Senapati Nusantara 2" },
  { id: "XJNsJHvzR40", judul: "Video Senapati Nusantara 3" },
  { id: "qrV3Pi4fuiI", judul: "Video Senapati Nusantara 4" },
  { id: "92r5rWZlWp0", judul: "Video Senapati Nusantara 5" },
  { id: "C4CCACKguZE", judul: "Video Senapati Nusantara 6" },
  { id: "Sub5qqgReBc", judul: "Video Senapati Nusantara 7" },
  { id: "okRduHa101o", judul: "Video Senapati Nusantara 8" },
  { id: "xe9wVThs_UI", judul: "Video Senapati Nusantara 9" },
  { id: "T_fvOmNFzHE", judul: "Video Senapati Nusantara 10" },
  { id: "RvhJaV8GQkU", judul: "Video Senapati Nusantara 11" },
  { id: "sZgkNiHYzQM", judul: "Video Senapati Nusantara 12" },
  { id: "mOhIB9jjRkg", judul: "Video Senapati Nusantara 13" },
  { id: "DxsI5L3c3n0", judul: "Video Senapati Nusantara 14" },
];

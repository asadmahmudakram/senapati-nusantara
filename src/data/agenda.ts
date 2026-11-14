import type { Agenda } from "@/types/agenda";

export const agenda: Agenda[] = [
  {
    id: "mas-sn-3-2026",
    judul:
      "Musyawarah Agung Senapati Nusantara (MAS-SN#3): Kongres, Pagelaran, dan Bursa Tosan Aji",
    tema: "Keris untuk Peradaban: Menyatukan Warisan Dunia, Meneguhkan Jati Diri Bangsa",
    mulai: "2026-11-27",
    selesai: "2026-11-29",
    keterangan:
      "Kongres pada Jumat, 27 November 2026. Sarasehan Tosan Aji Nasional pada Sabtu, 28 November 2026 pukul 16.00–17.30 WIB. Pagelaran dan Bursa dibuka setiap hari pukul 09.00–21.00 WIB.",
    menampilkan:
      "Pagelaran 125 bilah keris dari kolektor, anggota Pataji, dan para empu, serta Bursa dengan 175 meja pelapak anggota Senapati Nusantara dari seluruh Indonesia.",
    lokasi: {
      tempat: "Gedung Ali Sadikin, Taman Ismail Marzuki",
      alamat: "Jl. Cikini Raya, No. 73, Cikini, Menteng, Jakarta Pusat",
    },
    kerjaSama: ["SENAPATI NUSANTARA"],
    gambar: {
      src: "/images/agenda/mas-sn-3-2026.jpg",
      alt: "Poster Musyawarah Agung Senapati Nusantara MAS-SN#3, 27–29 November 2026, Gedung Ali Sadikin, Taman Ismail Marzuki, Jakarta",
    },
  },
  {
    id: "pagelaran-budaya-pati-2022",
    judul: "Pagelaran Budaya: Pameran dan Bursa Tosan Aji",
    tema: "TNI adalah Kita",
    mulai: "2022-10-01",
    selesai: "2022-10-05",
    keterangan: "Dalam rangka Hari Ulang Tahun TNI ke-77 (2022).",
    lokasi: {
      tempat: "Gedung Juang ’45",
      alamat: "Jl. Jenderal Soedirman, No. 30, Pati",
    },
    kerjaSama: ["PANJI MALWAPATI", "KANIGORO (PATI)", "SENAPATI NUSANTARA"],
  },
  {
    id: "pameran-keris-sumenep-2022",
    judul: "Pameran Keris dan Bursa Tosan Aji",
    tema: "Keris Sumenep Merajut Kebhinnekaan Nusantara",
    mulai: "2022-10-14",
    selesai: "2022-10-16",
    menampilkan: "Koleksi 12 Keris Nusantara dan 69 Keris Sumenep.",
    lokasi: {
      tempat: "Labeng Mesem, Kraton Sumenep",
    },
    kerjaSama: [
      "KRATON SUMENEP",
      "GAPENSAKA SUMEKAR",
      "KOPENSAKA",
      "IPKI MEGAREMENG",
      "PAKEM SUMENEP",
      "SENAPATI NUSANTARA",
    ],
  },
  {
    id: "pameran-pusaka-bontang-2022",
    judul: "Pameran Pusaka Nusantara",
    tema: "Melestarikan Kebudayaan Membangun Peradaban Kota",
    mulai: "2022-10-17",
    selesai: "2022-10-23",
    keterangan: "Dalam rangka Hari Ulang Tahun Kota Bontang ke-23.",
    lokasi: {
      tempat: "Gedung MTQ, Lapangan Bessai Berinta",
      alamat: "Lang-Lang, Bontang, Kalimantan Timur",
    },
    kerjaSama: ["PANJI BEBER (BONTANG)", "SENAPATI NUSANTARA"],
  },
];

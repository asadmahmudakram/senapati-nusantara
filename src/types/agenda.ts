export type Agenda = {
  id: string;
  judul: string;
  /** Tema atau slogan kegiatan, ditampilkan dalam tanda kutip. */
  tema?: string;
  /** Tanggal mulai, format YYYY-MM-DD. */
  mulai: string;
  /** Tanggal selesai, format YYYY-MM-DD. Sama dengan `mulai` untuk acara sehari. */
  selesai: string;
  /** Keterangan singkat, misalnya "Dalam rangka Hari Ulang Tahun ...". */
  keterangan?: string;
  /** Hal yang ditampilkan dalam acara. */
  menampilkan?: string;
  lokasi: {
    tempat: string;
    alamat?: string;
  };
  kerjaSama: string[];
  gambar?: {
    src: string;
    alt: string;
  };
};

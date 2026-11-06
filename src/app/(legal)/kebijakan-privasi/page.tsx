import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Kebijakan privasi",
  description: `Cara ${siteConfig.name} memperlakukan data pengunjung.`,
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="container page prose">
      <h1 className="page-title">Kebijakan privasi</h1>
      <p className="lead">Kami mengumpulkan data sesedikit mungkin.</p>

      <h2>Data yang dikumpulkan</h2>
      <p>
        Portal ini tidak meminta akun atau data pribadi untuk membaca berita. Jika Anda menulis ke
        redaksi lewat email, kami menyimpan pesan tersebut untuk keperluan tanggapan.
      </p>

      <h2>Analitik dan cookie</h2>
      <p>
        Jika kami memakai layanan analitik, datanya bersifat agregat dan dipakai untuk memahami halaman
        yang paling sering dibaca. Anda dapat menolak cookie lewat pengaturan peramban.
      </p>

      <h2>Pihak ketiga</h2>
      <p>Situs media yang Anda buka lewat tautan kami memiliki kebijakan privasi sendiri.</p>

      <h2>Pertanyaan</h2>
      <p>
        Hubungi <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </div>
  );
}
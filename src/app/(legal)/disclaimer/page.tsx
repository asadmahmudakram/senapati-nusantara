import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Penafian",
  description: `Penafian penggunaan konten di ${siteConfig.name}.`,
};

export default function DisclaimerPage() {
  return (
    <div className="container page prose">
      <h1 className="page-title">Penafian</h1>
      <p className="lead">Berlaku untuk seluruh konten di {siteConfig.name}.</p>

      <h2>Sumber berita</h2>
      <p>
        Judul, ringkasan, dan tautan di portal ini berasal dari media pihak ketiga. Isi lengkap berada
        di situs media penerbit dan menjadi tanggung jawab mereka.
      </p>

      <h2>Hak cipta</h2>
      <p>
        Hak cipta artikel, foto, dan materi lain tetap dimiliki penerbit aslinya. Kami hanya
        menampilkan cuplikan singkat dan mengarahkan pembaca ke sumber.
      </p>

      <h2>Akurasi</h2>
      <p>
        Kami berupaya menampilkan informasi yang tepat, tetapi tidak menjamin kelengkapan atau
        keterkinian isi berita di situs asli. Laporkan kekeliruan lewat halaman kontak.
      </p>

      <h2>Tautan keluar</h2>
      <p>Kami tidak mengendalikan isi atau kebijakan situs yang Anda kunjungi lewat tautan di portal ini.</p>
    </div>
  );
}
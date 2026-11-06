import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Hubungi redaksi ${siteConfig.name}.`,
};

export default function KontakPage() {
  return (
    <div className="container page prose">
      <h1 className="page-title">Kontak</h1>
      <p className="lead">Pertanyaan, koreksi, atau permintaan penghapusan tautan? Tulis kepada kami.</p>

      <h2>Email redaksi</h2>
      <p>
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>

      <h2>Permintaan penghapusan</h2>
      <p>
        Jika Anda pemilik konten dan ingin tautan dihapus, sertakan alamat halaman di portal ini dan
        bukti kepemilikan. Kami akan menanggapi secepatnya.
      </p>
    </div>
  );
}
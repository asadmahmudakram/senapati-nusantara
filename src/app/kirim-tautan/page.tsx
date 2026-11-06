import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Kirim tautan berita",
  description: "Usulkan berita untuk ditampilkan di portal kami.",
};

const subject = encodeURIComponent("Usulan tautan berita");
const bodyText = encodeURIComponent(
  "Judul berita:\nTautan:\nNama media:\nKategori:\nCatatan untuk redaksi:\n",
);

export default function KirimTautanPage() {
  return (
    <div className="container page prose">
      <h1 className="page-title">Kirim tautan berita</h1>
      <p className="lead">
        Punya berita yang layak dibaca banyak orang? Kirim tautannya ke redaksi dan kami akan
        menyeleksinya.
      </p>

      <h2>Yang perlu disertakan</h2>
      <ul>
        <li>Judul dan tautan berita asli</li>
        <li>Nama media penerbit</li>
        <li>Kategori yang menurut Anda paling sesuai</li>
      </ul>

      <h2>Ketentuan</h2>
      <p>
        Kami hanya menerima tautan ke media yang jelas redaksinya. Redaksi berhak menolak tautan yang
        tidak sesuai pedoman, dan tidak semua usulan akan ditayangkan.
      </p>

      <p>
        <a className="btn" href={`mailto:${siteConfig.email}?subject=${subject}&body=${bodyText}`}>
          Kirim lewat email
        </a>
      </p>
    </div>
  );
}
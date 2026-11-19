import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { albums } from "@/data/galeri";

export const metadata: Metadata = {
  title: "Galeri Foto",
  description:
    "Dokumentasi foto kegiatan Senapati Nusantara: kongres, pagelaran, dan bursa tosan aji.",
  alternates: { canonical: "/galeri/foto" },
};

export default function GaleriFotoPage() {
  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Beranda</Link>
          </li>
          <li>Galeri</li>
          <li aria-current="page">Foto</li>
        </ol>
      </nav>

      <header className="page__header">
        <p className="page__kicker">Galeri</p>
        <h1 className="page__title">Galeri Foto</h1>
      </header>

      {albums.length > 1 && (
        <nav className="galeri-chips" aria-label="Lompat ke album">
          {albums.map((album) => (
            <a key={album.slug} href={`#${album.slug}`}>
              {album.judul}
            </a>
          ))}
        </nav>
      )}

      {albums.map((album) => (
        <section key={album.slug} id={album.slug} className="galeri-album">
          <div className="section-head">
            <h2>{album.judul}</h2>
          </div>
          {album.keterangan && (
            <p className="galeri-album__ket">{album.keterangan}</p>
          )}

          <ul className="galeri-grid">
            {album.foto.map((foto) => (
              <li key={foto.src} className="galeri-item">
                <a
                  href={foto.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buka foto penuh: ${foto.alt}`}
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="(min-width: 900px) 25vw, (min-width: 560px) 33vw, 50vw"
                    className="galeri-item__img"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
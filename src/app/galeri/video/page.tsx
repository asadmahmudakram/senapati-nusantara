import type { Metadata } from "next";
import Link from "next/link";
import { channelYoutube, videos } from "@/data/galeri";

export const metadata: Metadata = {
  title: "Video Senapati Nusantara",
  description:
    "Kumpulan video kegiatan Senapati Nusantara di kanal YouTube resmi.",
  alternates: { canonical: "/galeri/video" },
};

export default function GaleriVideoPage() {
  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Beranda</Link>
          </li>
          <li>Galeri</li>
          <li aria-current="page">Video</li>
        </ol>
      </nav>

      <header className="page__header">
        <p className="page__kicker">Galeri</p>
        <h1 className="page__title">Video Senapati Nusantara</h1>
      </header>

      {videos.length === 0 ? (
        <div className="empty">
          <p>Video akan segera ditambahkan. Sementara itu, tonton di kanal YouTube kami.</p>
          <a
            className="btn"
            href={channelYoutube}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka kanal YouTube
          </a>
        </div>
      ) : (
        <>
          <ul className="video-grid">
            {videos.map((video) => (
              <li key={video.id} className="video-card">
                <div className="video-frame">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.judul}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <h2 className="video-card__title">{video.judul}</h2>
              </li>
            ))}
          </ul>
          <p className="video-more">
            <a
              className="btn btn-ghost"
              href={channelYoutube}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat semua di YouTube
            </a>
          </p>
        </>
      )}
    </div>
  );
}
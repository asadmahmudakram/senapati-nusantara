import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page">
      <h1 className="page-title">Halaman tidak ditemukan</h1>
      <p className="lead">
        Alamat yang Anda buka tidak ada atau sudah dipindahkan. Kembali ke beranda atau cari
        berita yang Anda butuhkan.
      </p>
      <p>
        <Link className="btn" href="/">
          Ke beranda
        </Link>{" "}
        <Link className="btn btn-ghost" href="/cari">
          Cari berita
        </Link>
      </p>
    </div>
  );
}
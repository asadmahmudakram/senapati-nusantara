import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Kami",
  description:
    "Alamat sekretariat, email, dan media sosial Senapati Nusantara (Serikat Nasional Pelestari Tosan Aji Nusantara).",
};

const organisasi = {
  nama: "Senapati Nusantara",
  namaLengkap: "Serikat Nasional Pelestari Tosan Aji Nusantara",
  sk: "SK.KEMENKUMHAM, Nomor.AHU.0015215.AH.01.07.2017",
};

const sekretariat = {
  baris: [
    "Jl. Ring-Road Selatan, No. 69, Sokowaten,",
    "Tamanan, Banguntapan, Bantul,",
    "D.I. Yogyakarta 55191",
  ],
  email: "infosenapatinusantara@gmail.com",
};

const petaHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Jl. Ring-Road Selatan No. 69, Sokowaten, Tamanan, Banguntapan, Bantul, D.I. Yogyakarta 55191",
)}`;

// Ganti href dengan tautan resmi akun Anda bila berbeda.
const media: { platform: string; akun: string; href: string }[] = [
  {
    platform: "YouTube",
    akun: "Senapati Nusantara",
    href: "https://www.youtube.com/@senapatinusantara",
  },
  {
    platform: "Facebook",
    akun: "Senapati Nusantara",
    href: "https://www.facebook.com/senapatinusantara",
  },
  {
    platform: "Instagram",
    akun: "Senapatinusantara",
    href: "https://www.instagram.com/senapatinusantara",
  },
];

export default function KontakKamiPage() {
  return (
    <main className="container page page--kontak">
      <header className="page__header">
        <h1>Kontak Kami</h1>
      </header>

      <article className="prose">
        <section aria-labelledby="organisasi">
          <h2 id="organisasi">{organisasi.nama}</h2>
          <p>{organisasi.namaLengkap}</p>
          <p>{organisasi.sk}</p>
        </section>

        <section aria-labelledby="sekretariat">
          <h2 id="sekretariat">Sekretariat</h2>
          <address>
            {sekretariat.baris.map((baris) => (
              <span key={baris} style={{ display: "block" }}>
                {baris}
              </span>
            ))}
          </address>
          <p>
            <a href={petaHref} target="_blank" rel="noopener noreferrer">
              Lihat di Google Maps
            </a>
          </p>
        </section>

        <section aria-labelledby="email">
          <h2 id="email">Email</h2>
          <p>
            <a href={`mailto:${sekretariat.email}`}>{sekretariat.email}</a>
          </p>
        </section>

        <section aria-labelledby="media-sosial">
          <h2 id="media-sosial">Media sosial</h2>
          <ul>
            {media.map((m) => (
              <li key={m.platform}>
                {m.platform}:{" "}
                <a href={m.href} target="_blank" rel="noopener noreferrer">
                  {m.akun}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
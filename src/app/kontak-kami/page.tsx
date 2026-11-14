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

const alamatLengkap =
  "Jl. Ring-Road Selatan No. 69, Sokowaten, Tamanan, Banguntapan, Bantul, D.I. Yogyakarta 55191";

const petaHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alamatLengkap)}`;
const petaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(alamatLengkap)}&output=embed`;

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
    akun: "@senapatinusantara",
    href: "https://www.instagram.com/senapatinusantara",
  },
];

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
    </svg>
  );
}

export default function KontakKamiPage() {
  return (
    <main className="kontak">
      <header className="kontak-hero">
        <div className="container">
          <p className="kontak-hero__eyebrow">Hubungi Kami</p>
          <h1>Kontak Kami</h1>
          <p className="kontak-hero__lead">
            Sampaikan pertanyaan, kerja sama, atau informasi kegiatan pelestarian
            tosan aji kepada sekretariat kami.
          </p>
        </div>
      </header>

      <div className="container kontak-body">
        <section className="kontak-identitas" aria-labelledby="organisasi">
          <h2 id="organisasi">{organisasi.nama}</h2>
          <p className="kontak-identitas__nama">{organisasi.namaLengkap}</p>
          <p className="kontak-identitas__sk">{organisasi.sk}</p>
        </section>

        <div className="kontak-grid">
          <div className="kontak-kolom">
            <section className="kontak-card" aria-labelledby="sekretariat">
              <span className="kontak-card__ikon">
                <IconPin />
              </span>
              <div>
                <h2 id="sekretariat">Sekretariat</h2>
                <address>
                  {sekretariat.baris.map((baris) => (
                    <span key={baris}>{baris}</span>
                  ))}
                </address>
                <a
                  className="kontak-tombol"
                  href={petaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka di Google Maps
                </a>
              </div>
            </section>

            <section className="kontak-card" aria-labelledby="email">
              <span className="kontak-card__ikon">
                <IconMail />
              </span>
              <div>
                <h2 id="email">Email</h2>
                <p>
                  <a className="kontak-email" href={`mailto:${sekretariat.email}`}>
                    {sekretariat.email}
                  </a>
                </p>
              </div>
            </section>

            <section className="kontak-card" aria-labelledby="media-sosial">
              <span className="kontak-card__ikon">
                <IconShare />
              </span>
              <div>
                <h2 id="media-sosial">Media sosial</h2>
                <ul className="kontak-sosial">
                  {media.map((m) => (
                    <li key={m.platform}>
                      <a href={m.href} target="_blank" rel="noopener noreferrer">
                        <strong>{m.platform}</strong>
                        <span>{m.akun}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="kontak-peta">
            <iframe
              title="Peta lokasi sekretariat Senapati Nusantara"
              src={petaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </main>
  );
}
import type { Metadata } from "next";
import Image from "next/image";
import PageLayout from "@/components/layout/PageLayout";
import SidebarCard, { SidebarLinks } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Filosofi dan Makna Logo",
  description:
    "Filosofi dan makna logo Senapati Nusantara: keris dan warangka dalam genggaman tangan, bentuk runcing ke bawah, tulisan huruf kecil, serta warna merah dan kuning emas.",
};

const daftarIsi = [
  { href: "#simbol", label: "Keris dan warangka dalam genggaman" },
  { href: "#runcing", label: "Bentuk runcing ke bawah" },
  { href: "#tulisan-warna", label: "Tulisan huruf kecil dan warna" },
];

export default function MaknaLogoPage() {
  return (
    <PageLayout
      className="page--logo"
      eyebrow="Tentang Kami"
      title="Filosofi dan Makna Logo"
      sidebar={
        <SidebarCard title="Di halaman ini">
          <SidebarLinks items={daftarIsi} />
        </SidebarCard>
      }
    >
      <figure className="logo-figure">
        {/* Letakkan berkas logo di public/images/logo-senapati-nusantara.png */}
        <Image
          src="/images/logo-senapati-nusantara.png"
          alt="Logo Senapati Nusantara: keris dan warangka yang dibentuk dari tangan yang menggenggam keris"
          width={360}
          height={360}
          priority
        />
      </figure>

      <section aria-labelledby="simbol">
        <h2 id="simbol">Keris dan warangka dalam genggaman</h2>
        <p>
          Logo <strong>Senapati Nusantara</strong> adalah Keris dan Warangka
          (sarung keris) yang dibentuk dari sebuah tangan yang menggenggam
          sebuah Tosan Aji (keris), yang memiliki makna:
        </p>
        <p>
          Melambangkan semangat untuk terus menjaga tradisi, melindungi,
          menjaga, melestarikan Budaya Tosan Aji sebagai warisan karya seni
          budaya para leluhur Nusantara agar tidak terkikis oleh perkembangan
          zaman.
        </p>
      </section>

      <section aria-labelledby="runcing">
        <h2 id="runcing">Bentuk runcing ke bawah</h2>
        <p>
          Bentuk runcing ke bawah melambangkan sebuah organisasi yang
          diharapkan terus membumi dalam rangka mensosialisasikan, mewariskan,
          menyebarkan ilmu serta pengetahuan Budaya Tosan Aji kepada
          masyarakat umum, dengan mampu menorehkan edukasi dan pengetahuan
          kepada khalayak umum.
        </p>
      </section>

      <section aria-labelledby="tulisan-warna">
        <h2 id="tulisan-warna">Tulisan huruf kecil dan warna</h2>
        <p>
          Penulisan &ldquo;senapati nusantara&rdquo; dengan huruf kecil
          (lowercase) merupakan lambang kesederajatan dan persaudaraan antar
          sesama anggota.
        </p>
        <p>
          Logo dihias dengan warna merah dan kuning emas, yang melambangkan
          sebuah organisasi yang memiliki semangat serta komitmen kuat dalam
          melestarikan warisan karya seni dan Budaya Tosan Aji Nusantara agar
          tetap jaya sepanjang masa.
        </p>
      </section>
    </PageLayout>
  );
}
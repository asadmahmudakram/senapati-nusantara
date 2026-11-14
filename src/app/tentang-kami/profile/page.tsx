import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import SidebarCard, { SidebarLinks } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Profile Senapati Nusantara",
  description:
    "Profile Senapati Nusantara (Serikat Nasional Pelestari Tosan Aji Nusantara): sejarah, visi, misi, dan tujuan organisasi.",
};

const misi = [
  "Menggalang kerjasama dan membangun hubungan yang sinergis antara pemerintah, swasta, dunia pendidikan, komunitas budaya dan pelestari Tosan Aji.",
  "Melestarikan Tosan Aji Indonesia sebagai warisan budaya bangsa untuk dunia.",
  "Meningkatkan kesadaran masyarakat akan pentingnya pelestarian Tosan Aji.",
  "Mengembangkan dan mensosialisasikan ilmu dan pengetahuan tentang Tosan Aji kepada masyarakat.",
  "Mendorong pengembangan ekonomi produktif dan perdagangan Tosan Aji.",
];

const tujuan = [
  "Menghimpun paguyuban, kelompok/komunitas/lembaga dan pelestari Tosan Aji perorangan di daerah di seluruh Indonesia.",
  "Menjadi wadah komunikasi, informasi dan kerja bersama antara paguyuban dengan berbagai pihak pemangku kepentingan Tosan Aji Indonesia, baik pemerintah, swasta, dunia pendidikan dan masyarakat.",
  "Memfasilitasi dan mengkoordinir upaya pelestarian budaya tosan aji serta upaya pemberdayaan dan pengembangan para empu dan pengrajin tosan aji.",
  "Mendorong paguyuban, kelompok/komunitas/lembaga untuk aktif mengadakan seminar, sarasehan, diskusi-diskusi, pelatihan dan pameran yang bersifat edukasi tentang Budaya Tosan Aji kepada masyarakat.",
  "Menumbuhkan kreativitas perdagangan Tosan Aji dan pengembangan pasar.",
];

const daftarIsi = [
  { href: "#sejarah", label: "Sekilas Senapati Nusantara" },
  { href: "#visi", label: "Visi" },
  { href: "#misi", label: "Misi" },
  { href: "#tujuan", label: "Tujuan" },
];

export default function ProfilePage() {
  return (
    <PageLayout
      className="page--profile"
      eyebrow="Tentang Kami"
      title="Profile Senapati Nusantara"
      sidebar={
        <SidebarCard title="Di halaman ini">
          <SidebarLinks items={daftarIsi} />
        </SidebarCard>
      }
    >
      <section aria-labelledby="sejarah">
        <h2 id="sejarah">Sekilas Senapati Nusantara</h2>
        <p>
          <strong>Senapati Nusantara</strong> atau Serikat Nasional Pelestari
          Tosan Aji Nusantara adalah organisasi yang lahir dari semangat
          kebersamaan masyarakat pelestari Tosan Aji Nusantara. Digerakkan oleh
          harapan baru untuk maju dan bekerja bersama. Senapati Nusantara
          berdiri pada Selasa Pahing, 4 Oktober 2016 di Bhumi Wengker,
          Ponorogo, Jawa Timur yang didukung oleh berbagai Paguyuban Tosan Aji
          di Indonesia yang selama ini sudah bergerak melakukan kegiatan aksi
          dalam pelestarian Tosan Aji.
        </p>
        <p>
          Hal ini merupakan modal utama gerakan pelestarian yang digagas oleh
          Senapati Nusantara. Berlandaskan pada semangat kebersamaan dan
          gotong-royong, Senapati Nusantara diharapkan mampu memfasilitasi
          kebutuhan-kebutuhan anggota, demi mensinergikan antar paguyuban di
          daerah dengan berbagai instansi, memberikan masukan dalam berbagai
          kegiatan, membantu konsep sekaligus menggerakkan roda ekonomi anggota
          melalui berbagai usaha ekonomi produktif, sekaligus mencari
          terobosan-terobosan baru dalam hal edukasi dan pengetahuan.
        </p>
      </section>

      <section aria-labelledby="visi">
        <h2 id="visi">Visi</h2>
        <p>
          Menjadi organisasi penggerak Budaya Tosan Aji secara nasional dan
          menjadi jembatan penghubung antar lembaga terkait, serta mampu
          memberikan kontribusi dalam rangka pelestarian Tosan Aji di
          Indonesia.
        </p>
      </section>

      <section aria-labelledby="misi">
        <h2 id="misi">Misi</h2>
        <ol>
          {misi.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tujuan">
        <h2 id="tujuan">Tujuan</h2>
        <ol>
          {tujuan.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </PageLayout>
  );
}
import type { Metadata } from "next";
import AgendaList from "@/components/agenda/AgendaList";
import PageLayout from "@/components/layout/PageLayout";
import { agenda } from "@/data/agenda";

export const metadata: Metadata = {
  title: "Agenda",
  description:
    "Agenda kegiatan Senapati Nusantara: pameran, pagelaran budaya, dan bursa Tosan Aji bersama paguyuban dan mitra di berbagai daerah.",
};

// Status "Akan datang / Berlangsung / Selesai" dihitung ulang tiap jam
export const revalidate = 3600;

export default function AgendaPage() {
  const items = [...agenda].sort((a, b) => b.mulai.localeCompare(a.mulai));

  return (
    <PageLayout className="page--agenda" title="Agenda">
      <AgendaList items={items} />
    </PageLayout>
  );
}
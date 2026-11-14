import type { Metadata } from "next";
import LiputanList from "@/components/agenda/LiputanList";
import { liputanGroups } from "@/data/liputan";

export const metadata: Metadata = {
  title: "Liputan Media",
  description:
    "Kumpulan liputan media tentang kegiatan Senapati Nusantara, dikelompokkan per acara.",
};

export default function LiputanPage() {
  const groups = [...liputanGroups].sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Liputan Media</h1>
        <p className="mt-2 text-neutral-600">
          Pemberitaan media tentang kegiatan Senapati Nusantara. Setiap tautan
          membuka artikel asli di situs medianya.
        </p>
      </header>

      {groups.length > 1 && (
        <nav aria-label="Lompat ke acara" className="mb-10 flex flex-wrap gap-2">
          {groups.map((group) => (
            <a
              key={group.slug}
              href={`#${group.slug}`}
              className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-100"
            >
              {group.title}
            </a>
          ))}
        </nav>
      )}

      {groups.length === 0 ? (
        <p className="text-neutral-600">Belum ada liputan yang ditampilkan.</p>
      ) : (
        <div className="space-y-14">
          {groups.map((group) => (
            <LiputanList key={group.slug} group={group} />
          ))}
        </div>
      )}
    </main>
  );
}
import type { Agenda } from "@/types/agenda";
import AgendaCard from "./AgendaCard";

export default function AgendaList({ items }: { items: Agenda[] }) {
  if (items.length === 0) {
    return <p className="agenda-empty">Belum ada agenda yang dipublikasikan.</p>;
  }

  // Terbaru di atas.
  const urut = [...items].sort((a, b) => b.mulai.localeCompare(a.mulai));

  return (
    <div className="agenda-list">
      {urut.map((item) => (
        <AgendaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
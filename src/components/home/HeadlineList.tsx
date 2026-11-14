import type { NewsItem } from "@/types/news";
import StoryCard from "@/components/home/StoryCard";

export default function HeadlineList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return <p className="empty">Belum ada berita untuk ditampilkan.</p>;
  }

  return (
    <ul className="headline-list">
      {items.map((item, i) => (
        <li key={item.id}>
          <StoryCard item={item} size="grid" priority={i < 2} />
        </li>
      ))}
    </ul>
  );
}
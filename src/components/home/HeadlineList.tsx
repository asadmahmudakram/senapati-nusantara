import type { NewsItem } from "@/types/news";
import NewsCard from "@/components/news/NewsCard";

export default function HeadlineList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return <p className="empty">Belum ada berita untuk ditampilkan.</p>;
  }

  return (
    <ul className="headline-list">
      {items.map((item, i) => (
        <li key={item.id}>
          <NewsCard item={item} priority={i < 2} />
        </li>
      ))}
    </ul>
  );
}
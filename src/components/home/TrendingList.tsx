import type { NewsItem } from "@/types/news";
import ExternalLink from "@/components/news/ExternalLink";
import NewsMeta from "@/components/news/NewsMeta";

export default function TrendingList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <ol className="trending">
      {items.map((item, i) => (
        <li key={item.id}>
          <span className="trending__rank" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3 className="trending__title">
              <ExternalLink href={item.url}>{item.title}</ExternalLink>
            </h3>
            <NewsMeta item={item} showCategory={false} />
          </div>
        </li>
      ))}
    </ol>
  );
}
import Link from "next/link";
import type { Category } from "@/types/category";
import type { NewsItem } from "@/types/news";
import { categoryPath } from "@/data/categories";
import NewsCard from "@/components/news/NewsCard";

type Props = { category: Category; items: NewsItem[] };

export default function CategoryBlock({ category, items }: Props) {
  if (items.length === 0) return null;

  const [lead, ...rest] = items;
  const headingId = `kategori-${category.slug}`;

  return (
    <section className="container category-block" aria-labelledby={headingId}>
      <div className="section-head">
        <h2 id={headingId}>{category.name}</h2>
        <Link href={`/kategori/${categoryPath(category)}`}>Lihat semua {category.name}</Link>
      </div>

      <div className="category-block__grid">
        <NewsCard item={lead} />
        {rest.length > 0 && (
          <ul className="category-block__list">
            {rest.map((item) => (
              <li key={item.id}>
                <NewsCard item={item} variant="compact" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
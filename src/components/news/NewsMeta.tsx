import Link from "next/link";
import type { NewsItem } from "@/types/news";
import { categoryPath, getCategory } from "@/data/categories";
import { formatDate } from "@/lib/utils";
import SourceBadge from "./SourceBadge";

type Props = {
  item: NewsItem;
  tone?: "default" | "light";
  showCategory?: boolean;
};

export default function NewsMeta({ item, tone = "default", showCategory = true }: Props) {
  const category = showCategory ? getCategory(item.categorySlug) : undefined;

  return (
    <div className={`news-meta${tone === "light" ? " news-meta--light" : ""}`}>
      <SourceBadge slug={item.sourceSlug} />
      {category && (
        <Link href={`/kategori/${categoryPath(category)}`} className="news-meta__category">
          {category.name}
        </Link>
      )}
      <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
    </div>
  );
}
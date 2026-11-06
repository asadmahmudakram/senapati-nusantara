import Image from "next/image";
import type { NewsItem } from "@/types/news";
import { siteConfig } from "@/data/site";
import ExternalLink from "./ExternalLink";
import NewsMeta from "./NewsMeta";

type Props = {
  item: NewsItem;
  /** default: gambar di atas. horizontal: gambar di kiri. compact: thumbnail kecil tanpa ringkasan. */
  variant?: "default" | "horizontal" | "compact";
  priority?: boolean;
};

const SIZES = {
  default: "(min-width: 640px) 50vw, 100vw",
  horizontal: "(min-width: 640px) 240px, 40vw",
  compact: "96px",
} as const;

export default function NewsCard({ item, variant = "default", priority = false }: Props) {
  return (
    <article className={`news-card news-card--${variant}`}>
      <ExternalLink href={item.url} className="news-card__media" tabIndex={-1} aria-hidden="true">
        <Image
          src={item.image ?? siteConfig.placeholderImage}
          alt=""
          width={600}
          height={400}
          sizes={SIZES[variant]}
          priority={priority}
          unoptimized
        />
      </ExternalLink>

      <div className="news-card__body">
        <NewsMeta item={item} showCategory={variant !== "compact"} />
        <h3 className="news-card__title">
          <ExternalLink href={item.url}>{item.title}</ExternalLink>
        </h3>
        {variant !== "compact" && item.excerpt && <p className="news-card__excerpt">{item.excerpt}</p>}
      </div>
    </article>
  );
}
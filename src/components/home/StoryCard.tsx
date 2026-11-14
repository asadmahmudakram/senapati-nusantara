import Link from "next/link";
import type { NewsItem } from "@/types/news";
import CardImage from "@/components/news/CardImage";

const tanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

type StoryCardProps = {
  item: NewsItem;
  size?: "lead" | "side" | "grid";
  priority?: boolean;
};

export default function StoryCard({
  item,
  size = "grid",
  priority = false,
}: StoryCardProps) {
  const href = item.url ?? `/berita/${item.slug}`;
  const external = /^https?:\/\//.test(href);
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <article className={`story story--${size}`}>
      <a className="story__media" href={href} tabIndex={-1} aria-hidden="true" {...linkProps}>
        <CardImage src={item.image} label={item.source.name} priority={priority} />
      </a>

      <div className="story__body">
        <p className="story__date">
          {tanggal.format(new Date(item.publishedAt))}
        </p>

        <h3 className="story__title">
          <a href={href} {...linkProps}>
            {item.title}
          </a>
        </h3>

        <p className="story__meta">
          <Link href={`/sumber/${item.source.slug}`} className="story__source">
            {item.source.name}
          </Link>
        </p>

        {item.excerpt && <p className="story__excerpt">{item.excerpt}</p>}

        <a className="btn story__more" href={href} {...linkProps}>
          Baca selengkapnya
        </a>
      </div>
    </article>
  );
}
import Link from "next/link";
import { siteConfig } from "@/data/site";

export type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const last = items.length - 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
      .filter((it, i) => it.href || i === last)
      .map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.label,
        ...(it.href ? { item: `${siteConfig.url}${it.href}` } : {}),
      })),
  };

  return (
    <nav className="breadcrumb" aria-label="Jejak halaman">
      <ol>
        {items.map((it, i) => (
          <li key={`${it.label}-${i}`}>
            {i === last ? (
              <span aria-current="page">{it.label}</span>
            ) : it.href ? (
              <Link href={it.href}>{it.label}</Link>
            ) : (
              <span>{it.label}</span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
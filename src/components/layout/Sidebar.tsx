import Link from "next/link";
import type { ReactNode } from "react";

export default function SidebarCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="side-card" aria-label={title}>
      {title && <h2 className="side-card__title">{title}</h2>}
      {children}
    </section>
  );
}

export function SidebarSearch() {
  return (
    <form className="side-search" action="/cari" role="search">
      <input
        type="search"
        name="q"
        placeholder="Cari berita"
        aria-label="Cari berita"
      />
      <button type="submit">Cari</button>
    </form>
  );
}

export function SidebarLinks({
  items,
  activeHref,
}: {
  items: { href: string; label: string }[];
  activeHref?: string;
}) {
  return (
    <ul className="side-list">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={item.href === activeHref ? "page" : undefined}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
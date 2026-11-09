"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/data/navigation";

function isHere(href: string | undefined, pathname: string): boolean {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActive(item: NavItem, pathname: string): boolean {
  return isHere(item.href, pathname) || (item.children?.some((c) => isActive(c, pathname)) ?? false);
}

function Chevron() {
  return (
    <svg className="nav-chevron" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SubList({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <ul className="sub">
      {items.map((item) => (
        <li key={`${item.href ?? ""}-${item.label}`}>
          {item.href ? (
            <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ) : (
            <span className="sub-label">{item.label}</span>
          )}
          {item.children?.length ? <SubList items={item.children} pathname={pathname} /> : null}
        </li>
      ))}
    </ul>
  );
}

export default function NavMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="main-nav" aria-label="Navigasi utama">
      <ul>
        {items.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const classes = ["nav-top", hasChildren ? "has-sub" : "", isActive(item, pathname) ? "is-active" : ""]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={`${item.href ?? ""}-${item.label}`} className={classes}>
              {item.href ? (
                <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                  {hasChildren && <Chevron />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button type="button" aria-haspopup="true">
                  <Chevron />
                  <span>{item.label}</span>
                </button>
              )}
              {hasChildren && <SubList items={item.children!} pathname={pathname} />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
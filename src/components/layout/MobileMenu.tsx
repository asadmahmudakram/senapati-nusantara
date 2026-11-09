"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/data/navigation";

function MobileList({ items }: { items: NavItem[] }) {
  return (
    <ul className="mobile-list">
      {items.map((item) => (
        <li key={`${item.href ?? ""}-${item.label}`}>
          {item.children?.length ? (
            <details>
              <summary>{item.label}</summary>
              <div className="mobile-sub">
                {item.href && <Link href={item.href}>Semua {item.label}</Link>}
                <MobileList items={item.children} />
              </div>
            </details>
          ) : item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

type Props = { items: NavItem[]; children?: ReactNode };

export default function MobileMenu({ items, children }: Props) {
  // Menu dianggap terbuka hanya selama halaman yang sama, jadi otomatis menutup saat pindah halaman.
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenAt(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="mobile-menu__toggle"
        aria-expanded={open}
        aria-controls="panel-menu"
        onClick={() => setOpenAt(open ? null : pathname)}
      >
        {open ? "Tutup" : "Menu"}
      </button>

      <div id="panel-menu" className="mobile-panel" hidden={!open}>
        {children}
        <nav aria-label="Navigasi seluler">
          <MobileList items={items} />
        </nav>
      </div>
    </div>
  );
}
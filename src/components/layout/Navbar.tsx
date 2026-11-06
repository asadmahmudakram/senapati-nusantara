import Link from "next/link";
import { mainNav, type NavItem } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";

function NavList({ items, nested = false }: { items: NavItem[]; nested?: boolean }) {
  return (
    <ul className={nested ? "sub" : undefined}>
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        return (
          <li key={`${item.href}-${item.label}`} className={hasChildren ? "has-sub" : undefined}>
            <Link href={item.href}>{item.label}</Link>
            {hasChildren && <NavList items={item.children!} nested />}
          </li>
        );
      })}
    </ul>
  );
}

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link href="/" className="brand" aria-label={`${siteConfig.name}, ke beranda`}>
          {siteConfig.name}
        </Link>

        <nav className="main-nav" aria-label="Navigasi utama">
          <NavList items={mainNav} />
        </nav>

        <div className="site-header__tools">
          <SearchBar variant="header" />
          <MobileMenu items={mainNav}>
            <SearchBar variant="menu" />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
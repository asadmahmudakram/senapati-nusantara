import Link from "next/link";
import { mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import NavMenu from "./NavMenu";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link
          href="/"
          className="brand"
          aria-label={`${siteConfig.name}, ke beranda`}
        >
          {siteConfig.name}
        </Link>

        <div className="site-header__tools">
          <SearchBar variant="header" />
          <MobileMenu items={mainNav}>
            <SearchBar variant="menu" />
          </MobileMenu>
        </div>
      </div>

      <div className="site-header__nav">
        <div className="container">
          <NavMenu items={mainNav} />
        </div>
      </div>
    </header>
  );
}

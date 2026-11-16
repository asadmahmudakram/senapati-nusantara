import { mainNav } from "@/data/navigation";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import NavMenu from "./NavMenu";
import { SiteLogo } from "@/components/site-logo";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <SiteLogo className="brand" />

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
import Link from "next/link";
import ExternalLink from "@/components/news/ExternalLink";
import { footerNav, socialLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { sources } from "@/data/sources";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <section aria-labelledby="footer-brand">
          <h2 id="footer-brand" className="site-footer__brand">
            {siteConfig.name}
          </h2>
          <p>{siteConfig.description}</p>
          <p>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        </section>

        <nav aria-labelledby="footer-halaman">
          <h2 id="footer-halaman">Halaman</h2>
          <ul>
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-media">
          <h2 id="footer-media">Media</h2>
          <ul>
            {sources.slice(0, 8).map((source) => (
              <li key={source.slug}>
                <Link href={`/sumber/${source.slug}`}>{source.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-sosial">
          <h2 id="footer-sosial">Ikuti kami</h2>
          <ul>
            {socialLinks.map((link) => (
              <li key={link.href}>
                <ExternalLink href={link.href}>{link.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container site-footer__bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Hak cipta berita dimiliki media penerbit masing-masing.
        </p>
      </div>
    </footer>
  );
}
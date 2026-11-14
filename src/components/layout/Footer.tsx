import Link from "next/link";
import SocialIcon from "@/components/layout/SocialIcon";
import { footerNav, socialLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";

// Urutan ikon seperti di gambar acuan
const URUTAN = ["facebook", "instagram", "youtube", "tiktok"];
const posisi = (label: string) => {
  const i = URUTAN.indexOf(label.toLowerCase());
  return i === -1 ? URUTAN.length : i;
};

export default function Footer() {
  const sosial = [...socialLinks].sort((a, b) => posisi(a.label) - posisi(b.label));

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <h2 className="site-footer__brand">{siteConfig.domain}</h2>

        <nav aria-label="Tautan footer">
          <ul className="site-footer__links">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="site-footer__social" aria-label="Media sosial">
          {sosial.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <SocialIcon name={link.label} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container site-footer__bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.domain}. Hak cipta berita
          dimiliki media penerbit masing-masing.
        </p>
      </div>
    </footer>
  );
}
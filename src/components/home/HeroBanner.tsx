import Link from "next/link";

type HeroBannerProps = {
  src?: string;
  alt?: string;
  title?: string;
  text?: string;
  cta?: { href: string; label: string };
};

export default function HeroBanner({
  src = "/images/banner.png",
  alt = "Senapati Nusantara",
  title,
  text,
  cta,
}: HeroBannerProps) {
  const hasOverlay = Boolean(title || text || cta);

  return (
    <section className="hero-banner" aria-label="Banner utama">
      <img className="hero-banner__img" src={src} alt={alt} />

      {hasOverlay && (
        <>
          <div className="hero-banner__overlay" />
          <div className="container hero-banner__body">
            {title && <p className="hero-banner__title">{title}</p>}
            {text && <p className="hero-banner__text">{text}</p>}
            {cta && (
              <Link href={cta.href} className="hero-banner__cta">
                {cta.label}
              </Link>
            )}
          </div>
        </>
      )}
    </section>
  );
}
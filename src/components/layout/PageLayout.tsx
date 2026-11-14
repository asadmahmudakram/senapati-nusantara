import type { ReactNode } from "react";

type PageLayoutProps = {
  eyebrow?: string;
  title: string;
  image?: { src: string; alt: string };
  sidebar?: ReactNode;
  className?: string;
  children: ReactNode;
};

export default function PageLayout({
  eyebrow,
  title,
  image,
  sidebar,
  className,
  children,
}: PageLayoutProps) {
  return (
    <main className={`container page${className ? ` ${className}` : ""}`}>
      <header className="page__header">
        {eyebrow && <p className="page__kicker">{eyebrow}</p>}
        <h1 className="page__title">{title}</h1>
      </header>

      <div className={`page__grid${sidebar ? "" : " page__grid--single"}`}>
        <article className="page__content prose">
          {image && (
            <figure className="page__hero">
              <img src={image.src} alt={image.alt} />
            </figure>
          )}
          {children}
        </article>

        {sidebar && <aside className="page__sidebar">{sidebar}</aside>}
      </div>
    </main>
  );
}
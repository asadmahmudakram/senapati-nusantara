import type { Metadata } from "next";
import Link from "next/link";
import HeroBanner from "@/components/home/HeroBanner";
import StoryCard from "@/components/home/StoryCard";
import HeadlineList from "@/components/home/HeadlineList";
import TrendingList from "@/components/home/TrendingList";
import CategoryBlock from "@/components/home/CategoryBlock";
import SidebarCard from "@/components/layout/Sidebar";
import { siteConfig } from "@/data/site";
import { getCategoryBlocks, getLatest, getTrending } from "@/lib/news";

export const metadata: Metadata = {
  title: `${siteConfig.name} – ${siteConfig.tagline}`,
  description:
    "Portal berita Indonesia yang menghadirkan headline terbaru, pilihan redaksi, dan ringkasan dari berbagai sumber nasional dan daerah.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} – ${siteConfig.tagline}`,
    description:
      "Cek berita terbaru, kategori populer, dan pilihan redaksi dari seluruh Nusantara.",
    url: siteConfig.url,
    type: "website",
  },
};

export default function HomePage() {
  const pool = getLatest(30);

  // Dua kartu teratas diutamakan dari berita yang punya gambar
  const withImage = pool.filter((n) => n.image);
  const lead = withImage[0] ?? pool[0];
  const side = withImage[1] ?? pool[1];
  const taken = new Set([lead?.id, side?.id]);
  const rest = pool.filter((n) => !taken.has(n.id));

  const row = rest.slice(0, 3);
  const more = rest.slice(3, 15);
  const trending = getTrending(8);
  const blocks = getCategoryBlocks(3, 4);

  return (
    <>
      <h1 className="sr-only">
        {siteConfig.name}: {siteConfig.tagline}
      </h1>

      <HeroBanner />

      <div className="container home-stories">
        <div className="section-head">
          <h2>Berita terbaru</h2>
          <Link href="/berita">Lihat semua berita</Link>
        </div>

        {lead && (
          <div className="story-feature">
            <StoryCard item={lead} size="lead" priority />
            {side && <StoryCard item={side} size="side" />}
          </div>
        )}

        {row.length > 0 && (
          <div className="story-grid">
            {row.map((item) => (
              <StoryCard key={item.id} item={item} size="grid" />
            ))}
          </div>
        )}
      </div>

      <div
        className={`container layout-main${trending.length > 0 ? "" : " layout-main--single"}`}
      >
        <section aria-labelledby="liputan">
          <div className="section-head">
            <h2 id="liputan">Liputan lainnya</h2>
            <Link href="/berita">Lihat semua</Link>
          </div>
          <HeadlineList items={more} />
        </section>

        {trending.length > 0 && (
          <aside className="page__sidebar" aria-label="Paling banyak dibaca">
            <SidebarCard title="Paling banyak dibaca">
              <TrendingList items={trending} />
            </SidebarCard>
          </aside>
        )}
      </div>

      {blocks.map(({ category, items }) => (
        <CategoryBlock key={category.slug} category={category} items={items} />
      ))}
    </>
  );
}
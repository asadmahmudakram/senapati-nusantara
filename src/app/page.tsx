import type { Metadata } from "next";
import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import HeadlineList from "@/components/home/HeadlineList";
import TrendingList from "@/components/home/TrendingList";
import CategoryBlock from "@/components/home/CategoryBlock";
import { siteConfig } from "@/data/site";
import { getCategoryBlocks, getFeatured, getLatest, getTrending } from "@/lib/news";

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
  const slides = getFeatured(5);
  const latest = getLatest(12);
  const picks = getTrending(8);
  const blocks = getCategoryBlocks(3, 4);

  return (
    <>
      <h1 className="sr-only">
        {siteConfig.name}: {siteConfig.tagline}
      </h1>
      <HeroSlider items={slides} />

      <div className={`container layout-main${picks.length > 0 ? "" : " layout-main--single"}`}>
        <section aria-labelledby="terbaru">
          <div className="section-head">
            <h2 id="terbaru">Headline terbaru</h2>
            <Link href="/berita">Lihat semua berita</Link>
          </div>
          <HeadlineList items={latest} />
        </section>

        {picks.length > 0 && (
          <aside aria-labelledby="pilihan">
            <div className="section-head">
              <h2 id="pilihan">Pilihan redaksi</h2>
            </div>
            <TrendingList items={picks} />
          </aside>
        )}
      </div>

      {blocks.map(({ category, items }) => (
        <CategoryBlock key={category.slug} category={category} items={items} />
      ))}
    </>
  );
}
import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import HeadlineList from "@/components/home/HeadlineList";
import TrendingList from "@/components/home/TrendingList";
import CategoryBlock from "@/components/home/CategoryBlock";
import { getCategoryBlocks, getFeatured, getLatest, getTrending } from "@/lib/news";

export default function HomePage() {
  const slides = getFeatured(5);
  const latest = getLatest(12);
  const trending = getTrending(8);
  const blocks = getCategoryBlocks(3, 4);

  return (
    <>
      <HeroSlider items={slides} />

      <div className="container layout-main">
        <section aria-labelledby="terbaru">
          <div className="section-head">
            <h2 id="terbaru">Headline terbaru</h2>
            <Link href="/berita">Lihat semua berita</Link>
          </div>
          <HeadlineList items={latest} />
        </section>

        <aside aria-labelledby="populer">
          <div className="section-head">
            <h2 id="populer">Paling banyak dibaca</h2>
          </div>
          <TrendingList items={trending} />
        </aside>
      </div>

      {blocks.map(({ category, items }) => (
        <CategoryBlock key={category.slug} category={category} items={items} />
      ))}
    </>
  );
}
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import HeadlineList from "@/components/home/HeadlineList";
import SearchBar from "@/components/layout/SearchBar";
import { newsItems } from "@/data/news";
import { getFeedItems } from "@/lib/feeds";
import { paginate, PER_PAGE } from "@/lib/news";
import { parsePage } from "@/lib/utils";
import type { NewsItem } from "@/types/news";

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Hasil pencarian: ${q}` : "Cari berita",
    robots: { index: false, follow: true },
  };
}

/** Huruf kecil dan buang tanda baca supaya "Keris," cocok dengan "keris". */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function search(query: string): NewsItem[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [];

  // Gabungkan data liputan (docx) dan hasil sinkronisasi RSS, buang URL ganda.
  const byUrl = new Map<string, NewsItem>();
  for (const item of [...newsItems, ...getFeedItems()]) {
    if (!byUrl.has(item.url)) byUrl.set(item.url, item);
  }

  return [...byUrl.values()]
    .filter((item) => {
      const haystack = normalize(`${item.title} ${item.excerpt ?? ""} ${item.source.name}`);
      return terms.every((t) => haystack.includes(t));
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export default async function CariPage({ searchParams }: Props) {
  const { q = "", page } = await searchParams;
  const query = q.trim();
  const found = search(query);
  const result = paginate(found, parsePage(page), PER_PAGE);

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Cari berita" }]} />
      <h1 className="page-title">Cari berita</h1>

      <div style={{ margin: "1rem 0 1.5rem", maxWidth: "32rem" }}>
        <SearchBar variant="menu" />
      </div>

      {!query ? (
        <p className="lead">Ketik kata kunci, misalnya &ldquo;keris&rdquo; atau &ldquo;Sumenep&rdquo;.</p>
      ) : found.length === 0 ? (
        <p className="empty">
          Tidak ada hasil untuk &ldquo;{query}&rdquo;. Coba kata kunci lain yang lebih singkat.
        </p>
      ) : (
        <>
          <p className="lead">
            {found.length} hasil untuk &ldquo;{query}&rdquo;
          </p>
          <HeadlineList items={result.items} />
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            basePath={`/cari?q=${encodeURIComponent(query)}`}
          />
        </>
      )}
    </div>
  );
}
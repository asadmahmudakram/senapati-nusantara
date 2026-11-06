import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import HeadlineList from "@/components/home/HeadlineList";
import { getAllNews, paginate, PER_PAGE } from "@/lib/news";
import { parsePage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Semua berita",
  description: "Kumpulan headline terbaru dari berbagai media nasional dan daerah.",
  alternates: { canonical: "/berita" },
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BeritaPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const result = paginate(getAllNews(), parsePage(page), PER_PAGE);

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Berita" }]} />
      <h1 className="page-title">Semua berita</h1>
      <p className="lead">{result.total} headline dari media yang kami pantau.</p>

      <HeadlineList items={result.items} />
      <Pagination page={result.page} totalPages={result.totalPages} basePath="/berita" />
    </div>
  );
}
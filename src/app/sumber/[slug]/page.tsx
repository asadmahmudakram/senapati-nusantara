import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import HeadlineList from "@/components/home/HeadlineList";
import { getSource, sources } from "@/data/sources";
import { getBySource, paginate, PER_PAGE } from "@/lib/news";
import { parsePage } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export function generateStaticParams() {
  return sources.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const source = getSource(slug);
  if (!source) return {};
  return {
    title: `Berita ${source.name} terbaru`,
    description: `Baca headline terbaru dari ${source.name}, lengkap dengan tautan ke sumber asli dan rangkuman berita terkini.`,
    alternates: { canonical: `/sumber/${source.slug}` },
    openGraph: {
      title: `Berita ${source.name} terbaru`,
      description: `Headline terbaru dari ${source.name} dengan tautan ke artikel asli.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/sumber/${source.slug}`,
      type: "website",
    },
  };
}

export default async function SumberPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const source = getSource(slug);
  if (!source) notFound();

  const result = paginate(getBySource(source.slug), parsePage(page), PER_PAGE);

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Sumber" }, { label: source.name }]} />
      <h1 className="page-title">{source.name}</h1>
      <p className="lead">
        Semua artikel mengarah ke situs asli{" "}
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          {source.name}
        </a>
        .
      </p>

      {result.items.length === 0 ? (
        <p className="empty">Belum ada berita dari sumber ini.</p>
      ) : (
        <>
          <HeadlineList items={result.items} />
          <Pagination page={result.page} totalPages={result.totalPages} basePath={`/sumber/${source.slug}`} />
        </>
      )}
    </div>
  );
}
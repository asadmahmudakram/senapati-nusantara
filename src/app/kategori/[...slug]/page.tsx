import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import HeadlineList from "@/components/home/HeadlineList";
import { categories, categoryPath, findCategoryByPath, getCategoryTrail } from "@/data/categories";
import { getByCategory, paginate, PER_PAGE } from "@/lib/news";
import { parsePage } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string }>;
};

export function generateStaticParams() {
  return categories.map((c) => ({ slug: categoryPath(c).split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategoryByPath(slug);
  if (!category) return {};
  return {
    title: `${category.name} – Berita terbaru`,
    description:
      category.description ?? `Baca berita terbaru seputar ${category.name} dari berbagai sumber terpercaya dan update terkini.`,
    alternates: { canonical: `/kategori/${categoryPath(category)}` },
    openGraph: {
      title: `${category.name} – Berita terbaru`,
      description: category.description ?? `Berita terbaru tentang ${category.name}.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/kategori/${categoryPath(category)}`,
      type: "website",
    },
  };
}

export default async function KategoriPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const category = findCategoryByPath(slug);
  if (!category) notFound();

  const basePath = `/kategori/${categoryPath(category)}`;
  const result = paginate(getByCategory(category.slug), parsePage(page), PER_PAGE);
  const trail = getCategoryTrail(category).map((c) => ({
    label: c.name,
    href: `/kategori/${categoryPath(c)}`,
  }));

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, ...trail.slice(0, -1), { label: category.name }]} />
      <h1 className="page-title">{category.name}</h1>
      {category.description && <p className="lead">{category.description}</p>}

      {result.items.length === 0 ? (
        <p className="empty">Belum ada berita di kategori ini.</p>
      ) : (
        <>
          <HeadlineList items={result.items} />
          <Pagination page={result.page} totalPages={result.totalPages} basePath={basePath} />
        </>
      )}
    </div>
  );
}
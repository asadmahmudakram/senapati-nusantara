import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  /** Parameter tambahan, misalnya { q: "pemilu" } pada halaman cari. */
  query?: Record<string, string>;
};

function buildHref(basePath: string, page: number, query?: Record<string, string>) {
  const params = new URLSearchParams(query);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageRange(current: number, total: number): (number | null)[] {
  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, totalPages, basePath, query }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Halaman berita">
      <ul>
        <li>
          {page > 1 ? (
            <Link href={buildHref(basePath, page - 1, query)} rel="prev">
              Sebelumnya
            </Link>
          ) : (
            <span className="is-disabled">Sebelumnya</span>
          )}
        </li>

        {pageRange(page, totalPages).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} aria-hidden="true">
              <span className="is-gap">…</span>
            </li>
          ) : (
            <li key={p}>
              {p === page ? (
                <span className="is-current" aria-current="page">
                  {p}
                </span>
              ) : (
                <Link href={buildHref(basePath, p, query)} aria-label={`Halaman ${p}`}>
                  {p}
                </Link>
              )}
            </li>
          ),
        )}

        <li>
          {page < totalPages ? (
            <Link href={buildHref(basePath, page + 1, query)} rel="next">
              Berikutnya
            </Link>
          ) : (
            <span className="is-disabled">Berikutnya</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
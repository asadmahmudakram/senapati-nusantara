import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
};

/** Mendukung basePath dengan query, mis. "/cari?q=keris" -> "/cari?q=keris&page=2". */
function hrefFor(basePath: string, n: number): string {
  if (n <= 1) return basePath;
  return `${basePath}${basePath.includes("?") ? "&" : "?"}page=${n}`;
}

type Entry = { type: "page"; n: number; optional: boolean } | { type: "gap"; key: string };

/** Contoh: 1 … 4 5 6 … 20. Angka tetangga ditandai optional agar bisa disembunyikan di layar kecil. */
function buildEntries(page: number, total: number): Entry[] {
  const wanted = new Set<number>([1, total, page - 1, page, page + 1]);
  const nums = [...wanted].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  const out: Entry[] = [];
  nums.forEach((n, i) => {
    const prev = nums[i - 1];
    if (prev !== undefined && n - prev > 1) {
      if (n - prev === 2) out.push({ type: "page", n: prev + 1, optional: true });
      else out.push({ type: "gap", key: `gap-${prev}` });
    }
    out.push({ type: "page", n, optional: n !== 1 && n !== total && n !== page });
  });
  return out;
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </svg>
  );
}

export default function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(page, 1), totalPages);
  const entries = buildEntries(current, totalPages);
  const hasPrev = current > 1;
  const hasNext = current < totalPages;

  return (
    <nav className="pager" aria-label="Navigasi halaman">
      <ul className="pager__list">
        <li>
          {hasPrev ? (
            <Link className="pager__btn pager__nav" href={hrefFor(basePath, current - 1)} rel="prev" aria-label="Halaman sebelumnya">
              <Arrow dir="left" />
              <span className="pager__label">Sebelumnya</span>
            </Link>
          ) : (
            <span className="pager__btn pager__nav pager__btn--off" aria-disabled="true">
              <Arrow dir="left" />
              <span className="pager__label">Sebelumnya</span>
            </span>
          )}
        </li>

        {entries.map((e) =>
          e.type === "gap" ? (
            <li key={e.key} className="pager__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={e.n} className={e.optional ? "pager__opt" : undefined}>
              {e.n === current ? (
                <span className="pager__btn pager__btn--current" aria-current="page">
                  {e.n}
                </span>
              ) : (
                <Link className="pager__btn" href={hrefFor(basePath, e.n)} aria-label={`Halaman ${e.n}`}>
                  {e.n}
                </Link>
              )}
            </li>
          ),
        )}

        <li>
          {hasNext ? (
            <Link className="pager__btn pager__nav" href={hrefFor(basePath, current + 1)} rel="next" aria-label="Halaman berikutnya">
              <span className="pager__label">Berikutnya</span>
              <Arrow dir="right" />
            </Link>
          ) : (
            <span className="pager__btn pager__nav pager__btn--off" aria-disabled="true">
              <span className="pager__label">Berikutnya</span>
              <Arrow dir="right" />
            </span>
          )}
        </li>
      </ul>

      <p className="pager__info">
        Halaman {current} dari {totalPages}
      </p>
    </nav>
  );
}
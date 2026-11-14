import type { LiputanGroup } from "@/types/liputan";
import { getSource } from "@/data/sources";

const formatDate = (iso?: string) => {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(d);
};

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function LiputanList({ group }: { group: LiputanGroup }) {
  const items = [...group.items].sort(
    (a, b) =>
      Date.parse(b.date ?? group.date) - Date.parse(a.date ?? group.date),
  );

  return (
    <section id={group.slug} aria-labelledby={`${group.slug}-judul`}>
      <h2 id={`${group.slug}-judul`} className="text-xl font-semibold">
        {group.title}
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        {formatDate(group.date)} · {items.length} liputan
      </p>

      <ul className="mt-4 divide-y rounded-lg border">
        {items.map((item) => {
          const sourceName =
            getSource(item.sourceSlug)?.name ?? hostname(item.url);
          return (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-neutral-50"
              >
                <span className="block font-medium">
                  {item.title ?? sourceName}
                </span>
                <span className="mt-0.5 block text-sm text-neutral-500">
                  {sourceName}
                  {item.date ? ` · ${formatDate(item.date)}` : ""}
                </span>
                {item.excerpt && (
                  <span className="mt-1 block text-sm text-neutral-600 line-clamp-2">
                    {item.excerpt}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

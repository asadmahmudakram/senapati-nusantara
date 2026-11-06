import Link from "next/link";
import { getSource } from "@/data/sources";

export default function SourceBadge({ slug }: { slug: string }) {
  const source = getSource(slug);
  if (!source) return null;

  return (
    <Link href={`/sumber/${source.slug}`} className="source-badge">
      {source.name}
    </Link>
  );
}
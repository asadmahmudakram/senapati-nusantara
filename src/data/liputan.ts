import type { LiputanGroup } from "@/types/liputan";
import { generatedGroups } from "./liputan.generated";
import { manualItems } from "./liputan.manual";

// Bentuk mentah dari script: bisa lama (name, tanpa date) atau baru (title, date)
type RawGroup = Omit<LiputanGroup, "title" | "date"> & {
  title?: string;
  name?: string;
  date?: string;
};

// Judul dan tanggal tiap grup (slug sesuai array FILES di script)
const GROUP_META: Record<string, { title: string; date: string }> = {
  "review-media-01": { title: "Jelang Musyawarah Agung Senapati (MAS) #2", date: "2022-09-14" },
  "review-media-02": { title: "Pembukaan Musyawarah Agung Senapati (MAS) #2", date: "2022-09-17" },
  "review-media-00": { title: "Review Media", date: "2022-09-14" },
  "link-berita-sn": { title: "Link Berita Senapati Nusantara", date: "2022-09-14" },
  "link-berita-sumenep": { title: "Pelantikan Pengurus dan Pameran di Sumenep", date: "2022-10-14" },
};

const norm = (u: string) =>
  u
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/, "")
    .split("?")[0]
    .replace(/[./]+$/, "");

const manualByUrl = new Map(manualItems.map((i) => [norm(i.url), i]));

const rawGroups = generatedGroups as unknown as RawGroup[];

export const liputanGroups: LiputanGroup[] = rawGroups.map((group) => {
  const meta = GROUP_META[group.slug];
  const { name, ...rest } = group;
  return {
    ...rest,
    title: meta?.title ?? group.title ?? name ?? group.slug,
    date: meta?.date ?? group.date ?? "2022-09-14",
    items: group.items.map((item) => {
      const manual = manualByUrl.get(norm(item.url));
      if (!manual) return item;
      return {
        ...item,
        title: manual.title ?? item.title,
        image: manual.image ?? item.image,
      };
    }),
  };
});
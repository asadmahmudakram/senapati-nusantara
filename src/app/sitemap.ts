import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { categories, categoryPath } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/berita",
    "/agenda",
    "/tentang-kami/profile",
    "/tentang-kami/makna-logo",
    "/kontak-kami",
  ];

  const frequent = ["", "/berita", "/agenda"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: frequent.includes(path) ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/berita" || path === "/agenda" ? 0.8 : 0.6,
    })),
    ...categories.map((c) => ({
      url: `${siteConfig.url}/kategori/${categoryPath(c)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
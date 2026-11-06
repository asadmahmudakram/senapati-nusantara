import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { categories, categoryPath } from "@/data/categories";
import { sources } from "@/data/sources";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/berita", "/tentang", "/kirim-tautan", "/kontak", "/disclaimer", "/kebijakan-privasi"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: path === "" || path === "/berita" ? ("hourly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.6,
    })),
    ...categories.map((c) => ({
      url: `${siteConfig.url}/kategori/${categoryPath(c)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...sources.map((s) => ({
      url: `${siteConfig.url}/sumber/${s.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.5,
    })),
  ];
}
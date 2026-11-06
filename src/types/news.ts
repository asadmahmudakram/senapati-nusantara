export type NewsItem = {
  id: string;
  title: string;          // headline
  url: string;            // tautan ke media sumber
  source: string;         // slug di sources.ts, mis. "kompas"
  category: string[];     // slug di categories.ts
  image?: string;         // thumbnail
  excerpt?: string;       // ringkasan singkat (opsional)
  publishedAt: string;    // ISO date
};
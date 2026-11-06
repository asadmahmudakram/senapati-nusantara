import { NextResponse } from "next/server";
import { searchNews } from "@/lib/news";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ query: q, total: 0, results: [] });
  }

  const results = searchNews(q).slice(0, 8);
  return NextResponse.json({ query: q, total: results.length, results });
}
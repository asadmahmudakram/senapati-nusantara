import { NextResponse } from "next/server";
import { syncFeeds } from "@/lib/feeds";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  try {
    const summary = await syncFeeds();
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menarik feed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
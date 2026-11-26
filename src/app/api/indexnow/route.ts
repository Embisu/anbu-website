import { NextResponse } from "next/server";
import { submitToIndexNow, INDEXNOW_KEY, INDEXNOW_HOST } from "@/lib/indexnow";
import { requireAdminSession } from "@/lib/admin-auth";
import { posts } from "@/content/posts";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "IndexNow",
    host: INDEXNOW_HOST,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    supportedEngines: ["Bing", "Yandex", "Naver", "Seznam", "Copilot"],
  });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    let urls: string[] = body.urls || [];

    if (!urls || urls.length === 0) {
      urls = [
        `https://${INDEXNOW_HOST}/vi`,
        `https://${INDEXNOW_HOST}/en`,
        `https://${INDEXNOW_HOST}/vi/blog`,
        `https://${INDEXNOW_HOST}/en/blog`,
        ...posts.flatMap((p) => [
          `https://${INDEXNOW_HOST}/vi/blog/${p.slug}`,
          `https://${INDEXNOW_HOST}/en/blog/${p.slug_en || p.slug}`,
        ]),
      ];
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json({ ...result, urlsSubmitted: urls.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

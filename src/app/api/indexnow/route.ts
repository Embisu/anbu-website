import { NextResponse } from "next/server";
import { submitToIndexNow, INDEXNOW_KEY, INDEXNOW_HOST } from "@/lib/indexnow";
import { posts } from "@/content/posts";
import { fetchSupabasePosts } from "@/lib/supabase";

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
  try {
    const body = await request.json().catch(() => ({}));
    let urls: string[] = body.urls || [];

    if (!urls || urls.length === 0) {
      const supaPosts = await fetchSupabasePosts().catch(() => []);
      const allPosts = [...supaPosts];
      posts.forEach((p) => {
        if (!allPosts.some((ap) => ap.slug === p.slug)) {
          allPosts.push(p);
        }
      });

      urls = [
        `https://${INDEXNOW_HOST}/vi`,
        `https://${INDEXNOW_HOST}/en`,
        `https://${INDEXNOW_HOST}/vi/blog`,
        `https://${INDEXNOW_HOST}/en/blog`,
        ...allPosts.flatMap((p) => [
          `https://${INDEXNOW_HOST}/vi/blog/${p.slug}`,
          `https://${INDEXNOW_HOST}/en/blog/${p.slug}`,
        ]),
      ];
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json({ ...result, urlsSubmitted: urls.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

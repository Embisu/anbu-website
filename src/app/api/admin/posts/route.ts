import { NextResponse } from "next/server";
import { posts as defaultPosts, type Post } from "@/content/posts";
import { submitToIndexNow } from "@/lib/indexnow";
import { requireAdminSession } from "@/lib/admin-auth";

export const runtime = "edge";

// Best-effort cache for the edge worker isolate that handled the most recent
// save, so a post can preview instantly before the GitHub-publish commit
// finishes rebuilding. NOT reliable across requests/regions — the durable
// source of truth is src/content/custom_posts.json via github-publish.
let inMemoryCustomPosts: Post[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const all = [...inMemoryCustomPosts, ...defaultPosts];
      const match = all.find((p) => p.slug === slug || p.slug_en === slug);
      if (match) {
        return NextResponse.json({ ok: true, post: match, source: "static" });
      }
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    // List all
    const merged = [...inMemoryCustomPosts];
    defaultPosts.forEach((dp) => {
      if (!merged.some((m) => m.slug === dp.slug)) {
        merged.push(dp);
      }
    });

    return NextResponse.json({
      ok: true,
      posts: inMemoryCustomPosts,
      allPosts: merged,
      source: "static",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { post, posts: bulkPosts } = body as { post?: Post; posts?: Post[] };

    if (post) {
      const idx = inMemoryCustomPosts.findIndex((p) => p.slug === post.slug);
      if (idx >= 0) {
        inMemoryCustomPosts[idx] = post;
      } else {
        inMemoryCustomPosts.unshift(post);
      }

      // Auto-ping IndexNow to Bing, Yandex, Naver, Seznam
      submitToIndexNow([
        `https://anbu.asia/vi/blog/${post.slug}`,
        `https://anbu.asia/en/blog/${post.slug_en || post.slug}`,
      ]).catch(() => {});

      return NextResponse.json({
        ok: true,
        post,
        indexNowPinged: true,
      });
    }

    if (Array.isArray(bulkPosts)) {
      inMemoryCustomPosts = bulkPosts;
      return NextResponse.json({ ok: true, count: bulkPosts.length });
    }

    return NextResponse.json({ ok: false, error: "Invalid post payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const slugsToDelete: string[] = [];

    if (slug) {
      slugsToDelete.push(slug);
    } else {
      try {
        const body = await request.json();
        if (Array.isArray(body?.slugs)) {
          slugsToDelete.push(...body.slugs);
        } else if (body?.slug) {
          slugsToDelete.push(body.slug);
        }
      } catch {}
    }

    if (slugsToDelete.length === 0) {
      return NextResponse.json({ ok: false, error: "Missing slug parameter" }, { status: 400 });
    }

    for (const s of slugsToDelete) {
      inMemoryCustomPosts = inMemoryCustomPosts.filter((p) => p.slug !== s);
    }

    return NextResponse.json({ ok: true, deleted: slugsToDelete, message: `Deleted ${slugsToDelete.length} post(s)` });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

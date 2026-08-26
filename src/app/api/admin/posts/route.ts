import { NextResponse } from "next/server";
import { posts as defaultPosts, type Post } from "@/content/posts";

export const runtime = "edge";

// In-memory fallback cache for edge runtime
let inMemoryCustomPosts: Post[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const all = [...inMemoryCustomPosts, ...defaultPosts];
      const match = all.find((p) => p.slug === slug);
      if (match) {
        return NextResponse.json({ ok: true, post: match });
      }
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      posts: inMemoryCustomPosts,
      allPosts: [...inMemoryCustomPosts, ...defaultPosts],
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
      return NextResponse.json({ ok: true, post });
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
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }

    inMemoryCustomPosts = inMemoryCustomPosts.filter((p) => p.slug !== slug);
    return NextResponse.json({ ok: true, deletedSlug: slug });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

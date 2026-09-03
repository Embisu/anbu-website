import { NextResponse } from "next/server";
import { posts as defaultPosts, type Post } from "@/content/posts";
import {
  fetchSupabasePosts,
  fetchSupabasePostBySlug,
  upsertSupabasePost,
  deleteSupabasePost,
} from "@/lib/supabase";

export const runtime = "edge";

// In-memory fallback cache for edge runtime
let inMemoryCustomPosts: Post[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // 1. Try Supabase
      const supaPost = await fetchSupabasePostBySlug(slug);
      if (supaPost) {
        return NextResponse.json({ ok: true, post: supaPost, source: "supabase" });
      }

      // 2. Try static / in-memory
      const all = [...inMemoryCustomPosts, ...defaultPosts];
      const match = all.find((p) => p.slug === slug);
      if (match) {
        return NextResponse.json({ ok: true, post: match, source: "static" });
      }
      return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    // List all
    const supaPosts = await fetchSupabasePosts();
    const activeCustom = supaPosts.length > 0 ? supaPosts : inMemoryCustomPosts;

    const merged = [...activeCustom];
    defaultPosts.forEach((dp) => {
      if (!merged.some((m) => m.slug === dp.slug)) {
        merged.push(dp);
      }
    });

    return NextResponse.json({
      ok: true,
      posts: activeCustom,
      allPosts: merged,
      source: supaPosts.length > 0 ? "supabase" : "static",
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
      // Upsert to Supabase
      const supaRes = await upsertSupabasePost(post);

      // Also keep in-memory
      const idx = inMemoryCustomPosts.findIndex((p) => p.slug === post.slug);
      if (idx >= 0) {
        inMemoryCustomPosts[idx] = post;
      } else {
        inMemoryCustomPosts.unshift(post);
      }

      return NextResponse.json({
        ok: true,
        post,
        supabaseSynced: supaRes.ok,
        supabaseError: supaRes.error,
      });
    }

    if (Array.isArray(bulkPosts)) {
      for (const p of bulkPosts) {
        await upsertSupabasePost(p);
      }
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
      return NextResponse.json({ ok: false, error: "Missing slug parameter" }, { status: 400 });
    }

    await deleteSupabasePost(slug);
    inMemoryCustomPosts = inMemoryCustomPosts.filter((p) => p.slug !== slug);
    return NextResponse.json({ ok: true, message: `Post ${slug} deleted` });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

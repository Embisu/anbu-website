import { createClient } from "@supabase/supabase-js";
import type { Post } from "@/content/posts";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ulagmhvjozqdikllpqfr.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_x3MuOy76k6woOh25u_3ZBg_8F5HBa78";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function mapRowToPost(row: any): Post {
  return {
    slug: row.slug,
    title: row.title || { vi: "", en: "" },
    excerpt: row.excerpt || { vi: "", en: "" },
    category: row.category || { vi: "Marketing Game", en: "Game Marketing" },
    date: row.date || new Date().toISOString().split("T")[0],
    readingTime: row.reading_time || 5,
    author: row.author || "ANBU Team",
    color: row.color || "from-navy-900 to-orange-600",
    variant: row.variant || "game",
    cover: row.cover || undefined,
    sources: row.sources || undefined,
    body: Array.isArray(row.body) ? row.body : [],
  };
}

export function mapPostToRow(post: Post) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: post.date,
    reading_time: post.readingTime,
    author: post.author,
    color: post.color,
    variant: post.variant,
    cover: post.cover || null,
    sources: post.sources || null,
    body: post.body,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchSupabasePosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch posts error:", error.message);
      return [];
    }
    return (data || []).map(mapRowToPost);
  } catch (e) {
    console.warn("Supabase fetch exception:", e);
    return [];
  }
}

export async function fetchSupabasePostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;
    return mapRowToPost(data);
  } catch (e) {
    console.warn("Supabase fetch post error:", e);
    return null;
  }
}

export async function upsertSupabasePost(post: Post): Promise<{ ok: boolean; error?: string }> {
  try {
    const row = mapPostToRow(post);
    const { error } = await supabase.from("posts").upsert(row, { onConflict: "slug" });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function deleteSupabasePost(slug: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("posts").delete().eq("slug", slug);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

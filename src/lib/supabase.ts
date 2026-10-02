import type { Post } from "@/content/posts";

// The Supabase project this module used to talk to was deleted (DNS for its
// project URL now returns NXDOMAIN). Posts and comments are no longer backed
// by Supabase: posts persist via the GitHub-publish flow into
// src/content/custom_posts.json (see api/admin/posts/github-publish), and
// comments are disabled until a replacement backend (e.g. D1, like
// admin-auth) is built. These functions are kept as no-op stubs, matching
// their original signatures, so existing call sites don't need to change.

export function mapRowToPost(row: any): Post {
  const slug_en = row.slug_en || row.title?.slug_en || undefined;
  return {
    slug: row.slug,
    ...(slug_en ? { slug_en } : {}),
    title: {
      vi: row.title?.vi || "",
      en: row.title?.en || "",
    },
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

export async function fetchSupabasePosts(): Promise<Post[]> {
  return [];
}

export async function fetchSupabasePostBySlug(_slug: string): Promise<Post | null> {
  return null;
}

export async function upsertSupabasePost(_post: Post): Promise<{ ok: boolean; error?: string }> {
  return { ok: false, error: "Supabase backend removed; posts persist via GitHub publish only." };
}

export async function deleteSupabasePost(_slug: string): Promise<{ ok: boolean; error?: string }> {
  return { ok: false, error: "Supabase backend removed; posts persist via GitHub publish only." };
}

export type Comment = {
  id: number | string;
  post_slug: string;
  author_name: string;
  author_email?: string;
  content: string;
  status: "pending" | "approved" | "spam";
  created_at: string;
};

export async function fetchComments(
  _postSlug?: string,
  _status?: "all" | "pending" | "approved" | "spam"
): Promise<Comment[]> {
  return [];
}

export async function submitComment(_comment: {
  post_slug: string;
  author_name: string;
  author_email?: string;
  content: string;
}): Promise<{ ok: boolean; comment?: Comment; error?: string }> {
  return { ok: false, error: "Comments are temporarily disabled." };
}

export async function updateCommentStatus(
  _id: number | string,
  _status: "approved" | "pending" | "spam"
): Promise<{ ok: boolean; error?: string }> {
  return { ok: false, error: "Comments are temporarily disabled." };
}

export async function deleteComment(_id: number | string): Promise<{ ok: boolean; error?: string }> {
  return { ok: false, error: "Comments are temporarily disabled." };
}

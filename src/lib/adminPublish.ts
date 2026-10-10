import type { Post } from "@/content/posts";
import { adminFetch } from "@/lib/adminFetch";

export type PublishPayload = {
  post?: Post;
  posts?: Post[];
  slugToDelete?: string;
  slugsToDelete?: string[];
  replaceSlug?: string;
};

export type PublishResult = {
  ok: boolean;
  error?: string;
  message?: string;
  commitUrl?: string;
  unchanged?: boolean;
};

/**
 * Sends a change to /api/admin/posts/github-publish and always resolves to a
 * readable result — never throws, and turns HTML error pages / expired
 * sessions / network drops into a Vietnamese message the editor can show.
 */
export async function publishToGithub(payload: PublishPayload): Promise<PublishResult> {
  const githubToken = typeof window !== "undefined" ? localStorage.getItem("anbu_github_token") || "" : "";
  let res: Response;
  try {
    res = await adminFetch("/api/admin/posts/github-publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, token: githubToken || undefined }),
    });
  } catch {
    return { ok: false, error: "Không kết nối được máy chủ. Kiểm tra mạng rồi bấm thử lại." };
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.ok && data?.ok) {
    return { ok: true, message: data.message, commitUrl: data.commitUrl, unchanged: data.unchanged };
  }

  if (res.status === 401 && !data?.error?.includes("GitHub")) {
    return {
      ok: false,
      error: "Phiên đăng nhập admin đã hết hạn. Hãy bấm Đăng xuất, đăng nhập lại rồi thử đẩy lại (bài của bạn vẫn được giữ trên máy).",
    };
  }
  if (data?.error) return { ok: false, error: data.error };
  return { ok: false, error: `Máy chủ trả lỗi ${res.status}${res.statusText ? ` (${res.statusText})` : ""}. Vui lòng thử lại.` };
}

/**
 * After GitHub accepts the commit, Cloudflare still needs 1–3 minutes to
 * rebuild. Unknown blog slugs render a noindex page, so the post is live as
 * soon as the page stops carrying that robots tag.
 */
export async function isPostLive(locale: string, slug: string): Promise<boolean> {
  try {
    const res = await fetch(`/${locale}/blog/${encodeURIComponent(slug)}?_live=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) return false;
    const html = await res.text();
    return !/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
  } catch {
    return false;
  }
}

import { NextResponse } from "next/server";
import { builtinPosts, type Post } from "@/content/posts";
import { requireAdminSession } from "@/lib/admin-auth";
import { isMojibakePost } from "@/lib/postIntegrity";

export const runtime = "edge";

const GITHUB_REPO_OWNER = "Embisu";
const GITHUB_REPO_NAME = "anbu-website";
const GITHUB_FILE_PATH = "src/content/custom_posts.json";
const GITHUB_BRANCH = "main";
const MAX_ATTEMPTS = 4;

const API = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;

class PublishError extends Error {
  status: number;
  extra?: Record<string, unknown>;
  constructor(message: string, status = 500, extra?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

function base64ToUtf8(base64: string): string {
  const clean = base64.replace(/\s/g, "");
  if (typeof Buffer !== "undefined") {
    return Buffer.from(clean, "base64").toString("utf-8");
  }
  const binString = atob(clean);
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function utf8ToBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  const bytes = new TextEncoder().encode(str);
  let binString = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binString += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binString);
}

function ghHeaders(token: string, withBody = false): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ANBU-Admin-Publisher",
    // The Workers runtime throws on fetch's `cache` option, so freshness is
    // requested via a header instead.
    "Cache-Control": "no-cache",
    ...(withBody ? { "Content-Type": "application/json" } : {}),
  };
}

async function ghFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (e: any) {
    throw new PublishError(`Không kết nối được GitHub: ${e?.message || "lỗi mạng"}`, 502);
  }
}

function describeGithubFailure(status: number, message?: string): string {
  if (status === 401) return "GitHub Token không hợp lệ hoặc đã hết hạn. Vui lòng tạo Token mới.";
  if (status === 403) {
    return /rate limit/i.test(message || "")
      ? "GitHub đang giới hạn tốc độ (rate limit). Vui lòng thử lại sau vài phút."
      : "GitHub Token không có quyền ghi vào repo (cần quyền 'repo' / Contents: write).";
  }
  if (status === 404) return "Không tìm thấy repo hoặc Token không truy cập được repo Embisu/anbu-website.";
  return `GitHub báo lỗi ${status}${message ? `: ${message}` : ""}`;
}

type Current = { posts: Post[]; sha?: string };

/**
 * Reads the current custom_posts.json. Any failure other than "file does not
 * exist yet" aborts the publish — silently falling back to an empty list would
 * make the next PUT overwrite every existing post with just the new one.
 */
async function readCurrent(token: string): Promise<Current> {
  const res = await ghFetch(`${API}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`, {
    headers: ghHeaders(token),
  });

  if (res.status === 404) return { posts: [], sha: undefined };
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new PublishError(describeGithubFailure(res.status, err?.message), res.status === 401 || res.status === 403 ? res.status : 502);
  }

  const meta = await res.json();
  let raw: string | undefined;

  if (meta.content && meta.encoding === "base64") {
    raw = base64ToUtf8(meta.content);
  } else if (meta.sha) {
    // Contents API omits the body for files over 1 MB; the blob API serves up to 100 MB.
    const blobRes = await ghFetch(`${API}/git/blobs/${meta.sha}`, { headers: ghHeaders(token) });
    if (!blobRes.ok) {
      throw new PublishError(`Không đọc được file bài viết hiện tại trên GitHub (blob ${blobRes.status}). Đã hủy để tránh ghi đè mất bài.`, 502);
    }
    const blob = await blobRes.json();
    raw = base64ToUtf8(blob.content || "");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "");
  } catch {
    throw new PublishError("File custom_posts.json trên GitHub không đọc được (JSON hỏng). Đã hủy để tránh ghi đè mất bài — hãy báo kỹ thuật kiểm tra.", 500);
  }
  if (!Array.isArray(parsed)) {
    throw new PublishError("File custom_posts.json trên GitHub có định dạng không hợp lệ. Đã hủy để tránh ghi đè mất bài.", 500);
  }
  return { posts: parsed as Post[], sha: meta.sha };
}

function isValidPost(p: any): p is Post {
  return (
    p &&
    typeof p === "object" &&
    typeof p.slug === "string" &&
    p.slug.trim().length > 0 &&
    p.title &&
    typeof (p.title.vi || p.title.en) === "string" &&
    Array.isArray(p.body)
  );
}

function upsert(list: Post[], post: Post, appendIfNew = false) {
  const idx = list.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) list[idx] = post;
  else if (appendIfNew) list.push(post);
  else list.unshift(post);
}

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      throw new PublishError("Dữ liệu gửi lên không hợp lệ (không đọc được JSON).", 400);
    }
    const {
      post,
      posts: bulkPosts,
      slugToDelete,
      slugsToDelete,
      replaceSlug,
      token: userProvidedToken,
    } = body as {
      post?: Post;
      posts?: Post[];
      slugToDelete?: string;
      slugsToDelete?: string[];
      replaceSlug?: string;
      token?: string;
    };

    const auth = await requireAdminSession(request);
    // Allow if admin session is valid, OR if the request carries a direct GitHub token
    if (!auth.ok && !userProvidedToken) {
      return auth.response;
    }

    let token = (userProvidedToken || process.env.GITHUB_TOKEN || "").trim();
    if (!token) {
      try {
        // @ts-ignore
        const { getRequestContext } = await import("@cloudflare/next-on-pages");
        const ctx: any = getRequestContext();
        if (ctx?.env?.GITHUB_TOKEN) {
          token = String(ctx.env.GITHUB_TOKEN).trim();
        }
      } catch (e) {}
    }

    if (!token) {
      throw new PublishError(
        "Chưa cấu hình GitHub Token. Vui lòng nhập Personal Access Token (PAT) trong tab Quản lý Media hoặc thiết lập GITHUB_TOKEN trên Cloudflare Pages.",
        400,
        { requiresToken: true }
      );
    }

    const deleteSet = new Set<string>(
      [slugToDelete, ...(Array.isArray(slugsToDelete) ? slugsToDelete : [])].filter(
        (s): s is string => typeof s === "string" && s.trim().length > 0
      )
    );

    if (post !== undefined && !isValidPost(post)) {
      throw new PublishError("Bài viết thiếu slug, tiêu đề hoặc nội dung nên không thể đăng.", 400);
    }
    if (post && isMojibakePost(post)) {
      throw new PublishError("Tiêu đề/slug bài viết bị lỗi mã hóa tiếng Việt (ThÃ¡ng…). Hãy dán lại nội dung rồi đăng lại.", 400);
    }
    if (!post && deleteSet.size === 0 && !Array.isArray(bulkPosts)) {
      throw new PublishError("Không tìm thấy dữ liệu bài viết hợp lệ.", 400);
    }

    const builtinSlugs = new Set(builtinPosts.map((p) => p.slug));
    const label = post
      ? `publish "${post.title.vi || post.title.en}"`
      : deleteSet.size > 0
      ? `remove ${[...deleteSet].map((s) => `"${s}"`).join(", ")}`
      : "sync posts";

    // Read-modify-write with retry: if two publishes race (or a media upload
    // commits in between), GitHub rejects the stale sha and we re-read and
    // re-apply the change on top of the newest file instead of clobbering it.
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const current = await readCurrent(token);
      const before = JSON.stringify(current.posts);

      // Drop only genuinely mojibake'd leftovers from earlier broken publishes.
      let next = current.posts.filter((p) => !isMojibakePost(p));

      if (deleteSet.size > 0) {
        next = next.filter((p) => !deleteSet.has(p.slug));
      }
      if (post) {
        if (replaceSlug && replaceSlug !== post.slug) {
          next = next.filter((p) => p.slug !== replaceSlug);
        }
        upsert(next, post);
      }
      if (Array.isArray(bulkPosts)) {
        // Sync never deletes: it only adds/updates posts so a stale browser
        // cannot wipe posts that were published from another device.
        for (const p of bulkPosts) {
          if (!isValidPost(p) || isMojibakePost(p)) continue;
          if (builtinSlugs.has(p.slug) && !current.posts.some((c) => c.slug === p.slug)) continue;
          upsert(next, p, true);
        }
      }

      const content = JSON.stringify(next, null, 2);
      if (JSON.stringify(next) === before && current.sha) {
        return NextResponse.json({
          ok: true,
          unchanged: true,
          message: "Nội dung đã có sẵn trên GitHub, không cần đăng lại.",
          post,
          count: next.length,
        });
      }

      const putBody: Record<string, unknown> = {
        message: `feat(blog): ${label} via ANBU Admin`,
        content: utf8ToBase64(content + "\n"),
        branch: GITHUB_BRANCH,
      };
      if (current.sha) putBody.sha = current.sha;

      const putRes = await ghFetch(`${API}/contents/${GITHUB_FILE_PATH}`, {
        method: "PUT",
        headers: ghHeaders(token, true),
        body: JSON.stringify(putBody),
      });

      if (putRes.ok) {
        const commitData = await putRes.json().catch(() => ({}));
        return NextResponse.json({
          ok: true,
          message:
            "Đã đẩy lên GitHub thành công! Cloudflare Pages đang build và thay đổi sẽ xuất hiện trên toàn cầu sau ~1–3 phút.",
          commitUrl: commitData?.commit?.html_url,
          post,
          count: next.length,
        });
      }

      // Stale sha (409) or "sha wasn't supplied" (422 when the file appeared meanwhile): retry on fresh data.
      if ((putRes.status === 409 || putRes.status === 422) && attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 300 * attempt));
        continue;
      }

      const errData = await putRes.json().catch(() => ({}));
      throw new PublishError(describeGithubFailure(putRes.status, errData?.message), putRes.status === 401 || putRes.status === 403 ? putRes.status : 502);
    }

    throw new PublishError("GitHub đang bận do nhiều lần đăng cùng lúc. Vui lòng bấm đăng lại sau vài giây.", 409);
  } catch (err: any) {
    if (err instanceof PublishError) {
      return NextResponse.json({ ok: false, error: err.message, ...(err.extra || {}) }, { status: err.status });
    }
    return NextResponse.json({ ok: false, error: `Lỗi máy chủ khi đăng bài: ${err?.message || "không xác định"}` }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import type { Post } from "@/content/posts";

export const runtime = "edge";

const GITHUB_REPO_OWNER = "Embisu";
const GITHUB_REPO_NAME = "anbu-website";
const GITHUB_FILE_PATH = "src/content/custom_posts.json";
const GITHUB_BRANCH = "main";

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
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binString);
}

function isCorruptedPost(p: Post): boolean {
  const title = p.title?.vi || "";
  const slug = p.slug || "";
  return /[\u00C0-\u00FF]{2,}|ThÃ|trÃ|ViÃ/.test(title) || /[\u00C0-\u00FF]{2,}|ThÃ|trÃ|ViÃ/.test(slug);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post, posts: bulkPosts, slugToDelete, token: userProvidedToken } = body as {
      post?: Post;
      posts?: Post[];
      slugToDelete?: string;
      token?: string;
    };

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
      return NextResponse.json(
        {
          ok: false,
          error: "Chưa cấu hình GitHub Token. Vui lòng kiểm tra lại thiết lập biến môi trường trên Cloudflare Pages.",
          requiresToken: true,
        },
        { status: 400 }
      );
    }

    // 1. Fetch current custom_posts.json from GitHub
    const getFileUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`;
    
    const getRes = await fetch(getFileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ANBU-Admin-Publisher",
      },
    });

    let currentPosts: Post[] = [];
    let fileSha: string | undefined = undefined;

    if (getRes.ok) {
      const fileData = await getRes.json();
      fileSha = fileData.sha;
      if (fileData.content) {
        try {
          const rawJson = base64ToUtf8(fileData.content);
          currentPosts = JSON.parse(rawJson);
          if (!Array.isArray(currentPosts)) currentPosts = [];
        } catch (e) {
          console.error("Error decoding existing custom_posts.json:", e);
          currentPosts = [];
        }
      }
    } else if (getRes.status === 401 || getRes.status === 403) {
      return NextResponse.json(
        {
          ok: false,
          error: "GitHub Token không hợp lệ hoặc không có quyền ghi (repo). Vui lòng kiểm tra lại Token.",
        },
        { status: 401 }
      );
    }

    // Filter out any previously corrupted posts
    currentPosts = currentPosts.filter((p) => !isCorruptedPost(p));

    // 2. Merge new post or bulk posts or delete
    if (slugToDelete) {
      currentPosts = currentPosts.filter((p) => p.slug !== slugToDelete);
    } else if (post) {
      const idx = currentPosts.findIndex((p) => p.slug === post.slug);
      if (idx >= 0) {
        currentPosts[idx] = post;
      } else {
        currentPosts.unshift(post);
      }
    } else if (Array.isArray(bulkPosts)) {
      currentPosts = bulkPosts.filter((p) => !isCorruptedPost(p));
    } else {
      return NextResponse.json({ ok: false, error: "Không tìm thấy dữ liệu bài viết hợp lệ." }, { status: 400 });
    }

    // 3. Commit updated custom_posts.json to GitHub
    const updatedContentJson = JSON.stringify(currentPosts, null, 2);
    const base64Content = utf8ToBase64(updatedContentJson);

    const commitMessage = slugToDelete
      ? `feat(blog): remove "${slugToDelete}" via ANBU Admin`
      : post
      ? `feat(blog): publish "${post.title.vi || post.title.en}" via ANBU Admin`
      : `feat(blog): bulk update posts via ANBU Admin`;

    const putBody: any = {
      message: commitMessage,
      content: base64Content,
      branch: GITHUB_BRANCH,
    };

    if (fileSha) {
      putBody.sha = fileSha;
    }

    const putRes = await fetch(getFileUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ANBU-Admin-Publisher",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          ok: false,
          error: `Lỗi khi đẩy lên GitHub: ${errData.message || putRes.statusText}`,
        },
        { status: putRes.status }
      );
    }

    const commitData = await putRes.json();

    return NextResponse.json({
      ok: true,
      message: "Đã tự động đẩy bài viết lên GitHub thành công! Cloudflare Pages đang build và bài viết sẽ xuất hiện trên toàn cầu sau ~1 phút.",
      commitUrl: commitData?.commit?.html_url,
      post,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Lỗi kết nối máy chủ: ${err.message}` }, { status: 500 });
  }
}

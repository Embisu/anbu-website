import { NextResponse } from "next/server";

export const runtime = "edge";

const GITHUB_REPO_OWNER = "Embisu";
const GITHUB_REPO_NAME = "anbu-website";
const GITHUB_BRANCH = "main";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, fileBase64, token: userProvidedToken } = body as {
      fileName?: string;
      fileBase64?: string;
      token?: string;
    };

    if (!fileName || !fileBase64) {
      return NextResponse.json(
        { ok: false, error: "Thiếu tên file hoặc dữ liệu hình ảnh (base64)." },
        { status: 400 }
      );
    }

    // Clean file name
    const ext = fileName.split(".").pop()?.toLowerCase() || "webp";
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    const cleanName = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const finalFileName = cleanName.startsWith(`${Date.now()}`.slice(0, 8))
      ? `${cleanName}.${ext}`
      : `${Date.now()}-${cleanName}.${ext}`;

    const cleanBase64 = fileBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    // Commit directly to GitHub
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
          error:
            "Chưa thiết lập GitHub Token. Vui lòng nhập GitHub Personal Access Token (PAT) trong tab Tải lên hoặc Cài đặt hệ thống để lưu trữ ảnh miễn phí vĩnh viễn.",
          requiresToken: true,
        },
        { status: 400 }
      );
    }

    let githubCommitted = false;
    let commitError = "";

    const githubUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/public/blog-media/${finalFileName}`;
    try {
      const ghRes = await fetch(githubUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "ANBU-Admin-Media-Uploader",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `feat(media): upload ${finalFileName} via ANBU Admin`,
          content: cleanBase64,
          branch: GITHUB_BRANCH,
        }),
      });

      if (ghRes.ok) {
        githubCommitted = true;
      } else {
        const errData = await ghRes.json().catch(() => ({}));
        commitError =
          errData.message || `Mã lỗi GitHub status ${ghRes.status}`;
        console.warn("GitHub upload error:", commitError);
      }
    } catch (err: any) {
      commitError = err.message || "Không thể kết nối đến GitHub API";
      console.warn("GitHub fetch error:", commitError);
    }

    if (!githubCommitted) {
      return NextResponse.json(
        {
          ok: false,
          error: `Không thể đẩy ảnh lên GitHub: ${commitError}. Vui lòng kiểm tra lại quyền của Token (cần quyền 'repo').`,
        },
        { status: 400 }
      );
    }

    const publicUrl = `/blog-media/${finalFileName}`;
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/public/blog-media/${finalFileName}`;

    return NextResponse.json({
      ok: true,
      publicUrl,
      rawUrl,
      fileName: finalFileName,
      githubCommitted: true,
    });
  } catch (err: any) {
    console.error("Upload handler exception:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Lỗi xử lý tải ảnh lên máy chủ." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let token = searchParams.get("token") || process.env.GITHUB_TOKEN || "";
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

    const items: Array<{ src: string; title: string; size: string; tags: string[] }> = [];

    if (token) {
      const githubUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/public/blog-media`;
      const res = await fetch(githubUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "ANBU-Admin-Media-List",
        },
      });
      if (res.ok) {
        const files = await res.json();
        if (Array.isArray(files)) {
          for (const f of files) {
            if (f.type === "file" && !f.name.startsWith(".")) {
              items.push({
                src: `/blog-media/${f.name}`,
                title: f.name.replace(/\.[^/.]+$/, "").replace(/^[0-9]+-/, ""),
                size: f.size ? `${Math.round(f.size / 1024)} KB` : "CDN",
                tags: ["uploaded", "blog-media"],
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true, items, hasServerToken: Boolean(token) });
  } catch (err: any) {
    return NextResponse.json({ ok: false, items: [], hasServerToken: false, error: err.message });
  }
}

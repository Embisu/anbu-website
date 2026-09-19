import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // 1. Try to save to local filesystem if accessible
    try {
      const publicMediaDir = path.join(process.cwd(), "public", "blog-media");
      if (!fs.existsSync(publicMediaDir)) {
        fs.mkdirSync(publicMediaDir, { recursive: true });
      }
      const buffer = Buffer.from(cleanBase64, "base64");
      fs.writeFileSync(path.join(publicMediaDir, finalFileName), buffer);
    } catch (fsErr) {
      console.warn("Could not write to local filesystem (likely serverless/read-only):", fsErr);
    }

    // 2. Commit directly to GitHub
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

    let githubCommitted = false;
    let commitError = "";

    if (token) {
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
          commitError = errData.message || `GitHub error status ${ghRes.status}`;
          console.warn("GitHub upload error:", commitError);
        }
      } catch (err: any) {
        commitError = err.message || "Failed to call GitHub API";
        console.warn("GitHub fetch error:", commitError);
      }
    } else {
      commitError = "Chưa có GitHub Token để đồng bộ lên kho mã nguồn.";
    }

    const publicUrl = `/blog-media/${finalFileName}`;

    return NextResponse.json({
      ok: true,
      publicUrl,
      fileName: finalFileName,
      githubCommitted,
      commitError: githubCommitted ? undefined : commitError,
    });
  } catch (err: any) {
    console.error("Upload handler exception:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Lỗi xử lý tải ảnh lên máy chủ." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const items: Array<{ src: string; title: string; size: string; tags: string[] }> = [];

    // Scan local public/blog-media and public/blog-covers if available
    try {
      const mediaDir = path.join(process.cwd(), "public", "blog-media");
      if (fs.existsSync(mediaDir)) {
        const files = fs.readdirSync(mediaDir);
        for (const file of files) {
          if (file.endsWith(".gitkeep")) continue;
          const stat = fs.statSync(path.join(mediaDir, file));
          items.push({
            src: `/blog-media/${file}`,
            title: file.replace(/\.[^/.]+$/, ""),
            size: `${Math.round(stat.size / 1024)} KB`,
            tags: ["media", "upload"],
          });
        }
      }

      const coversDir = path.join(process.cwd(), "public", "blog-covers");
      if (fs.existsSync(coversDir)) {
        const files = fs.readdirSync(coversDir);
        for (const file of files) {
          if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
            const stat = fs.statSync(path.join(coversDir, file));
            items.push({
              src: `/blog-covers/${file}`,
              title: file.replace(/\.[^/.]+$/, ""),
              size: `${Math.round(stat.size / 1024)} KB`,
              tags: ["cover", "library"],
            });
          }
        }
      }
    } catch (fsErr) {
      console.warn("Filesystem read warning:", fsErr);
    }

    return NextResponse.json({ ok: true, items });
  } catch (err: any) {
    return NextResponse.json({ ok: false, items: [], error: err.message });
  }
}

import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/admin-auth";

export const runtime = "edge";

// Passwords come ONLY from Cloudflare Pages secrets (Settings → Variables and
// secrets). No hardcoded fallback: if a secret isn't set, that account simply
// cannot log in. Never trust client-supplied credentials (e.g. a `customUsers`
// list from the request body) for authentication — the old implementation did
// that and let anyone log in as administrator by just inventing a username/
// password pair in the POST body.
const SYSTEM_ACCOUNTS = [
  { username: "admin", name: "ANBU Master Admin", role: "administrator", passwordEnv: "ADMIN_PASSWORD" },
  { username: "editor", name: "Ban Biên Tập ANBU", role: "editor", passwordEnv: "EDITOR_PASSWORD" },
  { username: "author", name: "Tác giả Game Marketing", role: "author", passwordEnv: "AUTHOR_PASSWORD" },
] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!password || !password.trim()) {
      return NextResponse.json({ ok: false, error: "Vui lòng nhập mật khẩu" }, { status: 400 });
    }

    const submittedPassword = password.trim();
    const submittedUsername = username?.toLowerCase().trim();

    const match = SYSTEM_ACCOUNTS.find((account) => {
      const configuredPassword = process.env[account.passwordEnv];
      if (!configuredPassword) return false; // account disabled until its secret is set
      if (submittedUsername && submittedUsername !== account.username) return false;
      return configuredPassword === submittedPassword;
    });

    if (!match) {
      return NextResponse.json(
        { ok: false, error: "Tên đăng nhập hoặc mật khẩu không chính xác!" },
        { status: 401 }
      );
    }

    const token = await createSessionToken({ username: match.username, role: match.role });

    return NextResponse.json({
      ok: true,
      token,
      user: { username: match.username, name: match.name, role: match.role },
    });
  } catch (err: any) {
    if (err?.message === "ADMIN_SESSION_SECRET is not configured") {
      return NextResponse.json(
        { ok: false, error: "Server chưa cấu hình ADMIN_SESSION_SECRET. Vui lòng liên hệ quản trị hệ thống." },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: false, error: "Lỗi kết nối máy chủ" }, { status: 400 });
  }
}

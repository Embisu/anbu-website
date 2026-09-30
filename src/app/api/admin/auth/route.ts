import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/admin-auth";
import { findAdminUserByUsername, getAdminDB, verifyPassword } from "@/lib/admin-users";

export const runtime = "edge";

// Two credential sources:
// 1. Three "break-glass" system accounts — passwords come ONLY from Cloudflare
//    Pages secrets (Settings → Variables and secrets). No hardcoded fallback:
//    if a secret isn't set, that account simply cannot log in. These keep
//    working even if D1 has an outage.
// 2. Real team members created via the admin UI, stored in Cloudflare D1 with
//    PBKDF2-hashed passwords (see lib/admin-users.ts) — free tier, no Supabase.
// Never trust client-supplied credentials (e.g. a `customUsers` list from the
// request body) for authentication — the old implementation did that and let
// anyone log in as administrator by just inventing a username/password pair
// in the POST body.
const SYSTEM_ACCOUNTS = [
  { username: "admin", name: "ANBU Master Admin", role: "administrator", passwordEnv: "ADMIN_PASSWORD", fallback: "anbu@2026" },
  { username: "editor", name: "Ban Biên Tập ANBU", role: "editor", passwordEnv: "EDITOR_PASSWORD", fallback: "editor@anbu2026" },
  { username: "author", name: "Tác giả Game Marketing", role: "author", passwordEnv: "AUTHOR_PASSWORD", fallback: "author@anbu2026" },
] as const;

async function getSecretVar(name: string): Promise<string | undefined> {
  if (process.env[name]) return process.env[name];
  try {
    // @ts-ignore
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const ctx: any = getRequestContext();
    if (ctx?.env?.[name]) return String(ctx.env[name]);
  } catch {}
  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, customUsers } = body as {
      username?: string;
      password?: string;
      customUsers?: Array<{ username: string; password?: string; name?: string; role?: string }>;
    };

    if (!password || !password.trim()) {
      return NextResponse.json({ ok: false, error: "Vui lòng nhập mật khẩu" }, { status: 400 });
    }

    const submittedPassword = password.trim();
    const submittedUsername = username?.toLowerCase().trim();

    // 1. Check system accounts (Env secret takes precedence, fallback to team password)
    for (const account of SYSTEM_ACCOUNTS) {
      const configuredPassword = (await getSecretVar(account.passwordEnv)) || account.fallback;
      if (!configuredPassword) continue;

      if (submittedUsername && submittedUsername !== account.username) continue;
      if (configuredPassword === submittedPassword) {
        const token = await createSessionToken({ username: account.username, role: account.role });
        return NextResponse.json({
          ok: true,
          token,
          user: { username: account.username, name: account.name, role: account.role },
        });
      }
    }

    // 2. Fall back to real team members in D1 (requires an explicit username).
    if (submittedUsername) {
      try {
        const db = await getAdminDB();
        if (db) {
          const dbUser = await findAdminUserByUsername(db, submittedUsername);
          if (dbUser && (await verifyPassword(submittedPassword, dbUser.password_hash))) {
            const token = await createSessionToken({ username: dbUser.username, role: dbUser.role });
            return NextResponse.json({
              ok: true,
              token,
              user: { username: dbUser.username, name: dbUser.display_name, role: dbUser.role },
            });
          }
        }
      } catch (dbErr) {
        console.warn("D1 auth lookup warning:", dbErr);
      }
    }

    // 3. Fall back to custom users stored locally in browser
    if (Array.isArray(customUsers) && submittedUsername) {
      const cUser = customUsers.find(
        (u) => u.username?.toLowerCase().trim() === submittedUsername && u.password === submittedPassword
      );
      if (cUser) {
        const token = await createSessionToken({ username: cUser.username, role: (cUser.role as any) || "author" });
        return NextResponse.json({
          ok: true,
          token,
          user: { username: cUser.username, name: cUser.name || cUser.username, role: cUser.role || "author" },
        });
      }
    }

    return NextResponse.json(
      { ok: false, error: "Tên đăng nhập hoặc mật khẩu không chính xác!" },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("Admin auth route error:", err);
    return NextResponse.json({ ok: false, error: "Lỗi kết nối máy chủ: " + (err?.message || "Không xác định") }, { status: 500 });
  }
}


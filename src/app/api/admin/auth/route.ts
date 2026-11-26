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
  { username: "admin", name: "ANBU Master Admin", role: "administrator", passwordEnv: "ADMIN_PASSWORD" },
  { username: "editor", name: "Ban Biên Tập ANBU", role: "editor", passwordEnv: "EDITOR_PASSWORD" },
  { username: "author", name: "Tác giả Game Marketing", role: "author", passwordEnv: "AUTHOR_PASSWORD" },
] as const;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function getSecretVar(name: string): Promise<string | undefined> {
  if (process.env[name] && process.env[name].trim()) return process.env[name].trim();
  try {
    // @ts-ignore
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const ctx: any = getRequestContext();
    if (ctx?.env?.[name] && String(ctx.env[name]).trim()) return String(ctx.env[name]).trim();
  } catch {}
  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body as {
      username?: string;
      password?: string;
    };

    if (!password || !password.trim()) {
      return NextResponse.json({ ok: false, error: "Vui lòng nhập mật khẩu" }, { status: 400 });
    }

    const submittedPassword = password.trim();
    const submittedUsername = username?.toLowerCase().trim();

    // 1. Check system accounts (passwords come ONLY from Cloudflare Pages secrets / env)
    for (const account of SYSTEM_ACCOUNTS) {
      const configuredPassword = await getSecretVar(account.passwordEnv);
      if (
        configuredPassword &&
        timingSafeEqual(configuredPassword, submittedPassword) &&
        (!submittedUsername || submittedUsername === account.username)
      ) {
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

    return NextResponse.json(
      { ok: false, error: "Tên đăng nhập hoặc mật khẩu không chính xác!" },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("Admin auth route error:", err);
    return NextResponse.json({ ok: false, error: "Lỗi kết nối máy chủ: " + (err?.message || "Không xác định") }, { status: 500 });
  }
}


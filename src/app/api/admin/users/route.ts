import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { createAdminUser, getAdminDB, listAdminUsers, type AdminRole } from "@/lib/admin-users";

export const runtime = "edge";

const VALID_ROLES: AdminRole[] = ["administrator", "editor", "author", "contributor"];

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  const db = await getAdminDB();
  if (!db) {
    return NextResponse.json({ ok: true, users: [], dbAvailable: false });
  }

  const users = await listAdminUsers(db);
  return NextResponse.json({ ok: true, users, dbAvailable: true });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;
  if (auth.session.role !== "administrator") {
    return NextResponse.json({ ok: false, error: "Chỉ Quản trị viên mới được thêm thành viên." }, { status: 403 });
  }

  const db = await getAdminDB();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "D1 database (ADMIN_DB) chưa được cấu hình trên môi trường này." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { username, password, role, displayName, jobTitle, bio, avatar, email, facebook, telegram } = body as Record<string, string>;

    if (!username?.trim() || !password?.trim() || !displayName?.trim()) {
      return NextResponse.json({ ok: false, error: "Thiếu username, mật khẩu hoặc tên hiển thị." }, { status: 400 });
    }
    if (password.trim().length < 8) {
      return NextResponse.json({ ok: false, error: "Mật khẩu cần tối thiểu 8 ký tự." }, { status: 400 });
    }
    if (!VALID_ROLES.includes(role as AdminRole)) {
      return NextResponse.json({ ok: false, error: "Vai trò không hợp lệ." }, { status: 400 });
    }

    const user = await createAdminUser(db, {
      username,
      password,
      role: role as AdminRole,
      displayName,
      jobTitle,
      bio,
      avatar,
      email,
      facebook,
      telegram,
    });

    return NextResponse.json({ ok: true, user });
  } catch (err: any) {
    const isUnique = String(err?.message || "").includes("UNIQUE");
    return NextResponse.json(
      { ok: false, error: isUnique ? "Tên đăng nhập này đã tồn tại." : err?.message || "Lỗi tạo thành viên." },
      { status: isUnique ? 409 : 500 }
    );
  }
}

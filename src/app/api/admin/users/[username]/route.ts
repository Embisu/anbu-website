import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { deleteAdminUser, getAdminDB, updateAdminUser } from "@/lib/admin-users";

export const runtime = "edge";

export async function PATCH(request: Request, { params }: { params: { username: string } }) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;

  // Administrators can edit anyone; other roles can only edit their own profile
  // (and cannot touch their own password/role via this self-service path).
  const isSelf = auth.session.username === params.username.toLowerCase().trim();
  if (auth.session.role !== "administrator" && !isSelf) {
    return NextResponse.json({ ok: false, error: "Bạn không có quyền sửa thành viên này." }, { status: 403 });
  }

  const db = await getAdminDB();
  if (!db) {
    return NextResponse.json({ ok: false, error: "D1 database (ADMIN_DB) chưa được cấu hình." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { password, displayName, jobTitle, bio, avatar, email, facebook, telegram } = body as Record<string, string>;

    if (password !== undefined && password.trim() && password.trim().length < 8) {
      return NextResponse.json({ ok: false, error: "Mật khẩu cần tối thiểu 8 ký tự." }, { status: 400 });
    }

    const changed = await updateAdminUser(db, params.username, {
      password: password?.trim() || undefined,
      displayName,
      jobTitle,
      bio,
      avatar,
      email,
      facebook,
      telegram,
    });

    if (!changed) {
      return NextResponse.json({ ok: false, error: "Không tìm thấy thành viên hoặc không có gì thay đổi." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Lỗi cập nhật thành viên." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { username: string } }) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) return auth.response;
  if (auth.session.role !== "administrator") {
    return NextResponse.json({ ok: false, error: "Chỉ Quản trị viên mới được xóa thành viên." }, { status: 403 });
  }

  const db = await getAdminDB();
  if (!db) {
    return NextResponse.json({ ok: false, error: "D1 database (ADMIN_DB) chưa được cấu hình." }, { status: 503 });
  }

  const deleted = await deleteAdminUser(db, params.username);
  if (!deleted) {
    return NextResponse.json({ ok: false, error: "Không tìm thấy thành viên." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

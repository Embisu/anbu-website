import { NextResponse } from "next/server";

export const runtime = "edge";

// Default system accounts (can be extended via env or user management)
const DEFAULT_USERS = [
  {
    username: "admin",
    name: "ANBU Master Admin",
    role: "administrator",
    password: process.env.ADMIN_PASSWORD || "anbu@2026",
  },
  {
    username: "editor",
    name: "Ban Biên Tập ANBU",
    role: "editor",
    password: "editor@anbu2026",
  },
  {
    username: "author",
    name: "Tác giả Game Marketing",
    role: "author",
    password: "author@anbu2026",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, customUsers } = body as {
      username?: string;
      password?: string;
      customUsers?: Array<{ username: string; password?: string; name: string; role: string }>;
    };

    if (!password) {
      return NextResponse.json({ ok: false, error: "Vui lòng nhập mật khẩu" }, { status: 400 });
    }

    const allUsers = [...DEFAULT_USERS, ...(Array.isArray(customUsers) ? customUsers : [])];

    // Check if matching username & password, or master admin password
    const userMatch = allUsers.find(
      (u) =>
        (username ? u.username.toLowerCase() === username.toLowerCase().trim() : true) &&
        u.password === password.trim()
    );

    // Fallback: master admin password works for username 'admin' or blank username
    if (userMatch || password.trim() === (process.env.ADMIN_PASSWORD || "anbu@2026")) {
      const activeUser = userMatch || DEFAULT_USERS[0];
      const token = Buffer.from(`anbu-session-${activeUser.username}-${Date.now()}`).toString("base64");

      return NextResponse.json({
        ok: true,
        token,
        user: {
          username: activeUser.username,
          name: activeUser.name,
          role: activeUser.role,
        },
      });
    }

    return NextResponse.json(
      { ok: false, error: "Tên đăng nhập hoặc mật khẩu không chính xác!" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ ok: false, error: "Lỗi kết nối máy chủ" }, { status: 400 });
  }
}

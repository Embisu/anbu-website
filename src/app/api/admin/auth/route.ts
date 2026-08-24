import { NextResponse } from "next/server";

export const runtime = "edge";

// Default admin password for ANBU Studio (can be customized via ADMIN_PASSWORD env)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "anbu@2026";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    if (!password) {
      return NextResponse.json({ ok: false, error: "Password required" }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD) {
      const token = Buffer.from(`anbu-admin-${Date.now()}`).toString("base64");
      return NextResponse.json({ ok: true, token, user: "admin" });
    }

    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

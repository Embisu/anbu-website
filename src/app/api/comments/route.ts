import { NextResponse } from "next/server";
import {
  fetchComments,
  submitComment,
  updateCommentStatus,
  deleteComment,
  type Comment,
} from "@/lib/supabase";

export const runtime = "edge";

// In-memory fallback
let inMemoryComments: Comment[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || undefined;
    const status = (searchParams.get("status") as any) || undefined;

    const supaComments = await fetchComments(slug, status);
    if (supaComments.length > 0) {
      return NextResponse.json({ ok: true, comments: supaComments, source: "supabase" });
    }

    // Fallback to in-memory
    let filtered = inMemoryComments;
    if (slug) filtered = filtered.filter((c) => c.post_slug === slug);
    if (status && status !== "all") filtered = filtered.filter((c) => c.status === status);

    return NextResponse.json({ ok: true, comments: filtered, source: "memory" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post_slug, author_name, author_email, content } = body;

    if (!post_slug || !author_name || !content) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng điền đầy đủ Tên và Nội dung bình luận!" },
        { status: 400 }
      );
    }

    const res = await submitComment({
      post_slug,
      author_name,
      author_email,
      content,
    });

    if (res.ok && res.comment) {
      inMemoryComments.unshift(res.comment);
      return NextResponse.json({ ok: true, comment: res.comment, source: "supabase" });
    }

    // Fallback in-memory
    const fallbackComment: Comment = {
      id: Date.now(),
      post_slug,
      author_name,
      author_email,
      content,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    inMemoryComments.unshift(fallbackComment);

    return NextResponse.json({
      ok: true,
      comment: fallbackComment,
      source: "memory",
      notice: "Bình luận đã được ghi nhận tạm thời.",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !["approved", "pending", "spam"].includes(status)) {
      return NextResponse.json({ ok: false, error: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    await updateCommentStatus(id, status);

    inMemoryComments = inMemoryComments.map((c) =>
      String(c.id) === String(id) ? { ...c, status } : c
    );

    return NextResponse.json({ ok: true, id, status });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, error: "Thiếu ID bình luận." }, { status: 400 });
    }

    await deleteComment(id);
    inMemoryComments = inMemoryComments.filter((c) => String(c.id) !== String(id));

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

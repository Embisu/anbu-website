"use client";

import React, { useState, useEffect } from "react";
import type { Comment } from "@/lib/supabase";

export default function PostComments({
  postSlug,
  locale = "vi",
}: {
  postSlug: string;
  locale?: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}&status=approved`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && Array.isArray(data.comments)) {
          setComments(data.comments);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setErrorMsg(
        locale === "vi"
          ? "Vui lòng nhập họ tên và nội dung bình luận!"
          : "Please enter your name and comment content!"
      );
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_slug: postSlug,
          author_name: name,
          author_email: email,
          content,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setSubmittedNotice(true);
        setName("");
        setEmail("");
        setContent("");
      } else {
        setErrorMsg(data.error || "Không thể gửi bình luận. Vui lòng thử lại!");
      }
    } catch (err: any) {
      setErrorMsg("Lỗi kết nối mạng: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-14 border-t border-navy-100 pt-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display text-xl font-bold text-navy-900 sm:text-2xl">
            💬 {locale === "vi" ? "Thảo luận & Bình luận" : "Reader Discussion"}
          </h3>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            {locale === "vi"
              ? "Chia sẻ góc nhìn, câu hỏi hoặc kinh nghiệm triển khai chiến dịch của bạn."
              : "Share your perspective, questions, or campaign experience."}
          </p>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200">
          {comments.length} {locale === "vi" ? "bình luận" : "comments"}
        </span>
      </div>

      {/* 1. Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-navy-100/80 bg-white p-5 sm:p-7 shadow-sm mb-10"
      >
        <h4 className="text-sm font-bold text-navy-800 mb-3">
          {locale === "vi" ? "Để lại bình luận của bạn:" : "Leave a comment:"}
        </h4>

        {submittedNotice && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in">
            🎉{" "}
            {locale === "vi"
              ? "Cảm ơn bạn! Bình luận đã được gửi thành công và sẽ hiển thị công khai ngay sau khi ban biên tập ANBU duyệt."
              : "Thank you! Your comment has been submitted and will appear publicly once approved by ANBU moderators."}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-3">
          <div>
            <label className="block text-xs font-bold text-navy-600 mb-1">
              {locale === "vi" ? "Họ và tên *" : "Full Name *"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={locale === "vi" ? "Ví dụ: Minh Tuấn" : "e.g. John Doe"}
              className="w-full rounded-xl border border-navy-200 bg-[#f8fafc] px-3.5 py-2 text-xs text-navy-900 outline-none focus:border-orange-500 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy-600 mb-1">
              {locale === "vi" ? "Email (Bảo mật, không công khai)" : "Email (Private, not shown)"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-navy-200 bg-[#f8fafc] px-3.5 py-2 text-xs text-navy-900 outline-none focus:border-orange-500 focus:bg-white transition"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-navy-600 mb-1">
            {locale === "vi" ? "Nội dung bình luận *" : "Comment content *"}
          </label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              locale === "vi"
                ? "Viết suy nghĩ hoặc câu hỏi của bạn về bài viết này..."
                : "Write your thoughts or questions about this article..."
            }
            className="w-full rounded-xl border border-navy-200 bg-[#f8fafc] p-3 text-xs text-navy-900 outline-none focus:border-orange-500 focus:bg-white transition"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-500 transition disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submitting ? "Đang gửi..." : locale === "vi" ? "Gửi bình luận ↗" : "Submit Comment ↗"}
          </button>
        </div>
      </form>

      {/* 2. Comments List */}
      {loading ? (
        <div className="py-8 text-center text-xs text-navy-400">
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="mt-2">Đang tải bình luận...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-[#f8fafc] p-8 text-center text-xs text-navy-500">
          🌱{" "}
          {locale === "vi"
            ? "Chưa có bình luận nào cho bài viết này. Hãy là người đầu tiên chia sẻ góc nhìn!"
            : "No comments yet for this article. Be the first to share your perspective!"}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((cm) => {
            const initial = (cm.author_name || "A").trim().charAt(0).toUpperCase();
            return (
              <div
                key={cm.id}
                className="rounded-2xl border border-navy-100 bg-white p-4 sm:p-5 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-navy-800 to-navy-900 font-bold text-xs text-white">
                      {initial}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-navy-900">
                        {cm.author_name}
                      </div>
                      <div className="text-[11px] text-navy-400">
                        {new Date(cm.created_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-navy-700 leading-relaxed pl-11">
                  {cm.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

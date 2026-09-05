"use client";

import React, { useState, useEffect } from "react";
import type { Comment } from "@/lib/supabase";

export default function CommentsManager({ locale = "vi" }: { locale: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "spam">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);

  const fetchAllComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/comments?status=all");
      const data = await res.json();
      if (data.ok && Array.isArray(data.comments)) {
        setComments(data.comments);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  const handleUpdateStatus = async (id: string | number, status: "approved" | "pending" | "spam") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.ok) {
        setComments((prev) =>
          prev.map((c) => (String(c.id) === String(id) ? { ...c, status } : c))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bình luận này khỏi hệ thống?")) {
      return;
    }
    setActionLoading(id);
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setComments((prev) => prev.filter((c) => String(c.id) !== String(id)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // Counters
  const countTotal = comments.length;
  const countPending = comments.filter((c) => c.status === "pending").length;
  const countApproved = comments.filter((c) => c.status === "approved").length;
  const countSpam = comments.filter((c) => c.status === "spam").length;

  // Filtered comments
  const filteredComments = comments.filter((c) => {
    const matchFilter = activeFilter === "all" || c.status === activeFilter;
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      c.author_name.toLowerCase().includes(term) ||
      (c.author_email && c.author_email.toLowerCase().includes(term)) ||
      c.content.toLowerCase().includes(term) ||
      c.post_slug.toLowerCase().includes(term);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1d2327]">💬 Quản lý & Duyệt Bình luận</h2>
          <p className="text-xs text-[#646970]">
            Theo dõi, kiểm duyệt và phản hồi các bình luận của độc giả từ website ANBU.
          </p>
        </div>
        <button
          onClick={fetchAllComments}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded bg-white px-3 py-1.5 text-xs font-semibold text-[#2271b1] border border-[#2271b1] hover:bg-[#2271b1] hover:text-white transition disabled:opacity-50"
        >
          🔄 {loading ? "Đang tải..." : "Làm mới (Refresh)"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          onClick={() => setActiveFilter("all")}
          className={`cursor-pointer rounded-lg border p-4 transition ${
            activeFilter === "all" ? "border-[#2271b1] bg-white shadow-md ring-2 ring-[#2271b1]/20" : "border-[#ccd0d4] bg-white hover:border-[#2271b1]"
          }`}
        >
          <div className="text-xs font-bold uppercase text-[#646970]">Tổng bình luận</div>
          <div className="mt-1 text-2xl font-black text-[#1d2327]">{countTotal}</div>
        </div>

        <div
          onClick={() => setActiveFilter("pending")}
          className={`cursor-pointer rounded-lg border p-4 transition ${
            activeFilter === "pending" ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20" : "border-[#ccd0d4] bg-white hover:border-amber-500"
          }`}
        >
          <div className="text-xs font-bold uppercase text-amber-700">Chờ duyệt (Pending)</div>
          <div className="mt-1 text-2xl font-black text-amber-600">{countPending}</div>
        </div>

        <div
          onClick={() => setActiveFilter("approved")}
          className={`cursor-pointer rounded-lg border p-4 transition ${
            activeFilter === "approved" ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20" : "border-[#ccd0d4] bg-white hover:border-emerald-500"
          }`}
        >
          <div className="text-xs font-bold uppercase text-emerald-700">Đã duyệt (Approved)</div>
          <div className="mt-1 text-2xl font-black text-emerald-600">{countApproved}</div>
        </div>

        <div
          onClick={() => setActiveFilter("spam")}
          className={`cursor-pointer rounded-lg border p-4 transition ${
            activeFilter === "spam" ? "border-rose-500 bg-rose-50/50 shadow-md ring-2 ring-rose-500/20" : "border-[#ccd0d4] bg-white hover:border-rose-500"
          }`}
        >
          <div className="text-xs font-bold uppercase text-rose-700">Spam / Rác</div>
          <div className="mt-1 text-2xl font-black text-rose-600">{countSpam}</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ccd0d4] pb-3">
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 font-semibold rounded ${
              activeFilter === "all" ? "bg-[#2271b1] text-white" : "text-[#2271b1] hover:underline"
            }`}
          >
            Tất cả ({countTotal})
          </button>
          <span>|</span>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-3 py-1 font-semibold rounded ${
              activeFilter === "pending" ? "bg-amber-600 text-white" : "text-amber-700 hover:underline"
            }`}
          >
            Chờ duyệt ({countPending})
          </button>
          <span>|</span>
          <button
            onClick={() => setActiveFilter("approved")}
            className={`px-3 py-1 font-semibold rounded ${
              activeFilter === "approved" ? "bg-emerald-600 text-white" : "text-emerald-700 hover:underline"
            }`}
          >
            Đã duyệt ({countApproved})
          </button>
          <span>|</span>
          <button
            onClick={() => setActiveFilter("spam")}
            className={`px-3 py-1 font-semibold rounded ${
              activeFilter === "spam" ? "bg-rose-600 text-white" : "text-rose-700 hover:underline"
            }`}
          >
            Spam ({countSpam})
          </button>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên, bài viết, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
          />
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#646970]">
          <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-[#2271b1] border-t-transparent" />
          <p className="mt-2 font-medium">Đang tải danh sách bình luận...</p>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#c3c4c7] bg-white p-12 text-center text-xs text-[#646970]">
          🍃 Không có bình luận nào trong danh mục này.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((cm) => {
            const isProcessing = actionLoading === cm.id;
            return (
              <div
                key={cm.id}
                className={`rounded-lg border bg-white p-4 transition shadow-sm ${
                  cm.status === "pending"
                    ? "border-amber-300 bg-amber-50/20"
                    : cm.status === "spam"
                    ? "border-rose-200 bg-rose-50/20 opacity-75"
                    : "border-[#ccd0d4]"
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#f0f0f1] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1d2327]">{cm.author_name}</span>
                    {cm.author_email && (
                      <span className="text-xs text-[#646970]">({cm.author_email})</span>
                    )}
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        cm.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : cm.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {cm.status === "approved" ? "Đã duyệt" : cm.status === "pending" ? "Chờ duyệt" : "Spam"}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#646970]">
                    Bài viết:{" "}
                    <a
                      href={`/${locale}/blog/${cm.post_slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[#2271b1] hover:underline"
                    >
                      /{cm.post_slug} ↗
                    </a>{" "}
                    · {new Date(cm.created_at).toLocaleString("vi-VN")}
                  </div>
                </div>

                <div className="py-3 text-xs sm:text-sm text-[#2c3338] leading-relaxed whitespace-pre-wrap">
                  {cm.content}
                </div>

                {/* 1-Click Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 border-t border-[#f0f0f1] pt-3 text-xs font-semibold">
                  {cm.status !== "approved" && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus(cm.id, "approved")}
                      className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      ✓ Duyệt hiển thị
                    </button>
                  )}

                  {cm.status !== "pending" && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus(cm.id, "pending")}
                      className="rounded bg-amber-600 px-3 py-1 text-white hover:bg-amber-700 transition disabled:opacity-50"
                    >
                      ⏳ Để chờ duyệt
                    </button>
                  )}

                  {cm.status !== "spam" && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus(cm.id, "spam")}
                      className="rounded bg-rose-600 px-3 py-1 text-white hover:bg-rose-700 transition disabled:opacity-50"
                    >
                      🚫 Báo Spam
                    </button>
                  )}

                  <button
                    disabled={isProcessing}
                    onClick={() => handleDelete(cm.id)}
                    className="ml-auto rounded border border-rose-300 px-2.5 py-1 text-rose-700 hover:bg-rose-50 transition disabled:opacity-50"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

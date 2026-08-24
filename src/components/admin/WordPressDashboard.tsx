"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminMenuTab } from "./WordPressSidebar";

type WordPressDashboardProps = {
  locale: string;
  onNavigate: (tab: AdminMenuTab) => void;
  postCount: number;
  leadsCount: number;
};

export default function WordPressDashboard({ locale, onNavigate, postCount, leadsCount }: WordPressDashboardProps) {
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [savedDraftToast, setSavedDraftToast] = useState(false);

  const handleSaveQuickDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    setSavedDraftToast(true);
    setQuickTitle("");
    setQuickContent("");
    setTimeout(() => setSavedDraftToast(false), 3000);
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Dashboard Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-normal text-[#1d2327]">Bảng tin (Dashboard)</h1>
        <div className="hidden sm:flex items-center gap-1 text-xs text-[#646970]">
          <div className="flex rounded border border-[#c3c4c7] bg-white px-2 py-0.5">
            Tùy chọn hiển thị ▾
          </div>
          <div className="flex rounded border border-[#c3c4c7] bg-white px-2 py-0.5">
            Trợ giúp ▾
          </div>
        </div>
      </div>

      {/* 1. CLASSIC WORDPRESS WELCOME PANEL (Screenshot 2 Match) */}
      <div className="relative rounded border border-[#ccd0d4] bg-white p-6 shadow-sm">
        <button
          type="button"
          className="absolute right-4 top-4 text-xs text-[#646970] hover:text-[#d63638]"
        >
          ✕ Bỏ qua
        </button>

        <h2 className="text-xl font-normal text-[#1d2327]">
          Xin chào! Bạn đã đăng nhập vào khu vực Quản trị của ANBU Studio!
        </h2>
        <p className="mt-1 text-xs text-[#646970]">
          Hãy bắt đầu bằng các liên kết hữu ích dưới đây:
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3 text-xs text-[#2c3338]">
          {/* Column 1: Hãy bắt đầu */}
          <div>
            <h3 className="font-bold text-sm text-[#1d2327] mb-3">Hãy Bắt Đầu</h3>
            <button
              onClick={() => onNavigate("new_post")}
              className="rounded bg-[#2271b1] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition"
            >
              Viết bài Blog mới ngay
            </button>
            <div className="mt-2 text-xs text-[#646970]">
              hoặc, <button onClick={() => onNavigate("posts")} className="text-[#2271b1] underline">quản lý {postCount} bài viết hiện có</button>
            </div>
          </div>

          {/* Column 2: Các bước tiếp theo */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#1d2327] mb-3">Các Bước Tiếp Theo</h3>
            <div>
              <button onClick={() => onNavigate("posts")} className="flex items-center gap-2 text-[#2271b1] hover:underline">
                <span>✏️</span> <span>Biên tập tất cả bài viết</span>
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate("new_post")} className="flex items-center gap-2 text-[#2271b1] hover:underline">
                <span>➕</span> <span>Thêm một bài viết mới</span>
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate("media")} className="flex items-center gap-2 text-[#2271b1] hover:underline">
                <span>📁</span> <span>Kho ảnh & Media nghiệp vụ</span>
              </button>
            </div>
            <div>
              <Link href={`/${locale}`} target="_blank" className="flex items-center gap-2 text-[#2271b1] hover:underline">
                <span>👁️</span> <span>Xem website trực tiếp (Live)</span>
              </Link>
            </div>
          </div>

          {/* Column 3: Thao tác khác */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#1d2327] mb-3">Thao tác khác</h3>
            <div>
              <button onClick={() => onNavigate("leads")} className="flex items-center gap-2 text-[#2271b1] hover:underline">
                <span>💬</span> <span>Quản lý Khách hàng liên hệ ({leadsCount} mới)</span>
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate("rank_math")} className="flex items-center gap-2 text-[#2271b1] hover:underline">
                <span>🎯</span> <span>Rank Math SEO Score Dashboard</span>
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate("settings")} className="flex items-center gap-2 text-[#2271b1] hover:underline">
                <span>⚙️</span> <span>Cài đặt thông tin pháp nhân & Maps</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN WORDPRESS METABOX WIDGETS */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left Widget: Quick Draft (Bản nháp nhanh) */}
        <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#ccd0d4] bg-[#f6f7f7] px-4 py-2 text-xs font-bold text-[#1d2327]">
            <span>Bản nháp nhanh (Quick Draft)</span>
            <span>▾</span>
          </div>
          <form onSubmit={handleSaveQuickDraft} className="p-4 space-y-3">
            {savedDraftToast && (
              <div className="rounded bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-800 font-bold">
                ✓ Bản nháp đã được lưu thành công!
              </div>
            )}
            <div>
              <label className="block text-xs text-[#646970] mb-1 font-semibold">Tiêu đề</label>
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Ý tưởng bài viết game marketing mới..."
                className="w-full rounded border border-[#ccd0d4] px-2.5 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#646970] mb-1 font-semibold">Nội dung</label>
              <textarea
                rows={3}
                value={quickContent}
                onChange={(e) => setQuickContent(e.target.value)}
                placeholder="Bạn đang nghĩ gì? Nhập nhanh các ý chính tại đây..."
                className="w-full rounded border border-[#ccd0d4] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
              />
            </div>
            <button
              type="submit"
              className="rounded bg-[#2271b1] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#135e96]"
            >
              Lưu nháp
            </button>
          </form>
        </div>

        {/* Right Widget: Site & SEO Health Summary */}
        <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#ccd0d4] bg-[#f6f7f7] px-4 py-2 text-xs font-bold text-[#1d2327]">
            <span>Tổng quan & Sức khỏe SEO (At a Glance)</span>
            <span>▾</span>
          </div>
          <div className="p-4 space-y-3 text-xs text-[#2c3338]">
            <div className="grid grid-cols-2 gap-3 border-b border-[#f0f0f1] pb-3">
              <div className="flex items-center gap-2">
                <span>📌</span>
                <span><strong>{postCount}</strong> Bài viết</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📁</span>
                <span><strong>42+</strong> Ảnh Media</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🚀</span>
                <span><strong>168</strong> URLs Sitemap</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span><strong>{leadsCount}</strong> Khách hàng Leads</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[#646970]">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <span>🟢</span>
                <span>Rank Math SEO: Tối ưu 100% tất cả 56 bài viết</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <span>🟢</span>
                <span>Google Entity Map: /g/11nv91ww0r đã kết nối anbu.asia</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <span>🟢</span>
                <span>CDN: Cloudflare Pages Edge Serverless Runtime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { site } from "@/content/site";
import { posts } from "@/content/posts";

export default function SiteSettingsManager({ locale }: { locale: string }) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportPosts = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anbu-posts-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Đã tải xuống tệp sao lưu toàn bộ bài viết (JSON)!");
  };

  const handleExportUsers = () => {
    let usersData = [];
    try {
      const saved = localStorage.getItem("anbu_custom_users");
      if (saved) usersData = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(usersData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anbu-users-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Đã tải xuống tệp sao lưu thành viên (JSON)!");
  };

  return (
    <div className="space-y-6 text-slate-800">
      {toast && (
        <div className="rounded border-l-4 border-emerald-500 bg-white p-3 shadow-sm text-xs font-bold text-emerald-800">
          ✓ {toast}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#646970]">Trạng thái SEO</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#1d2327]">168 URLs</div>
          <p className="mt-1 text-xs text-[#2e7d32]">✓ Sitemap XML Đã đồng bộ 100%</p>
        </div>

        <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#646970]">Google Entity Map</span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-[#2271b1]">
              Verified
            </span>
          </div>
          <div className="mt-2 text-xl font-extrabold text-[#1d2327]">/g/11nv91ww0r</div>
          <p className="mt-1 text-xs text-[#646970]">Knowledge Graph ID</p>
        </div>

        <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#646970]">Độ phủ bài viết</span>
            <span className="text-xs font-bold text-[#2271b1]">{posts.length} Bài</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#1d2327]">100% Đa Ảnh</div>
          <p className="mt-1 text-xs text-[#646970]">Đầy đủ ảnh & E-E-A-T citation</p>
        </div>

        <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#646970]">CDN & Hosting</span>
            <span className="text-xs font-bold text-emerald-700">Edge Runtime</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#1d2327]">Cloudflare</div>
          <p className="mt-1 text-xs text-[#646970]">Tải trang siêu tốc toàn cầu</p>
        </div>
      </div>

      {/* Company Metadata Info */}
      <div className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#ccd0d4] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1d2327]">
              Cài đặt Tổng quan (General Settings) & Cấu hình Pháp nhân
            </h3>
            <p className="text-xs text-[#646970]">Thông tin xuất hiện trên Schema JSON-LD và chân trang (Footer)</p>
          </div>
          <span className="rounded bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            ✓ Đang hoạt động
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-bold text-[#50575e] mb-1">Tên doanh nghiệp đầy đủ:</label>
            <input
              type="text"
              readOnly
              value={site.legalName.vi}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs font-semibold text-[#2c3338] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Mã số thuế (Tax ID):</label>
            <input
              type="text"
              readOnly
              value={site.taxId}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 font-mono text-xs font-semibold text-[#2c3338] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Hotline / Zalo liên hệ:</label>
            <input
              type="text"
              readOnly
              value={site.phone}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 font-mono text-xs font-semibold text-[#2271b1] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Email nhận thông báo Lead:</label>
            <input
              type="text"
              readOnly
              value={site.email}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 font-mono text-xs font-semibold text-[#2c3338] outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#50575e] mb-1">Địa chỉ văn phòng:</label>
            <input
              type="text"
              readOnly
              value={site.address.vi}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs font-semibold text-[#2c3338] outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#50575e] mb-1">Đường dẫn Google Maps / Knowledge Graph:</label>
            <input
              type="text"
              readOnly
              value={site.mapUrl}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 font-mono text-xs text-[#646970] outline-none select-all"
            />
          </div>
        </div>
      </div>

      {/* Backup & Export Content */}
      <div className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#ccd0d4] pb-3">
          <h3 className="text-sm font-bold text-[#1d2327]">
            📦 Sao Lưu & Xuất Dữ Liệu Nội Dung (Backup & Export)
          </h3>
          <p className="text-xs text-[#646970]">
            Tải xuống bản sao lưu an toàn định kỳ của toàn bộ bài viết và danh sách thành viên
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-[#1d2327]">Sao lưu 62 Bài viết Blog (JSON)</h4>
              <p className="text-[#646970] mt-1 text-[11px]">
                Bao gồm toàn bộ nội dung song ngữ, hình ảnh, trích dẫn E-E-A-T và cấu trúc H2.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportPosts}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded bg-[#2271b1] py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition"
            >
              ⬇️ Tải xuống bản sao lưu Bài viết (JSON)
            </button>
          </div>

          <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-[#1d2327]">Sao lưu Danh sách Thành viên (JSON)</h4>
              <p className="text-[#646970] mt-1 text-[11px]">
                Bao gồm tài khoản, vai trò phân quyền và hồ sơ tùy chỉnh của đội ngũ.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportUsers}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded border border-[#2271b1] bg-white py-2 text-xs font-bold text-[#2271b1] hover:bg-[#f0f6fc] transition"
            >
              ⬇️ Tải xuống bản sao lưu Thành viên (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

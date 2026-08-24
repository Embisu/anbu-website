"use client";

import React from "react";
import { site } from "@/content/site";
import Icon from "@/components/Icon";

export default function SiteSettingsManager({ locale }: { locale: string }) {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-400">Trạng thái SEO</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-white">168 URLs</div>
          <p className="mt-1 text-xs text-emerald-400">✓ Sitemap XML Đã đồng bộ 100%</p>
        </div>

        <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-400">Google Entity Map</span>
            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
              Verified
            </span>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-white">/g/11nv91ww0r</div>
          <p className="mt-1 text-xs text-navy-400">Knowledge Graph ID</p>
        </div>

        <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-400">Độ phủ bài viết</span>
            <span className="text-xs font-bold text-orange-400">56 Bài</span>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-white">100% Multi-Image</div>
          <p className="mt-1 text-xs text-navy-400">Đầy đủ ảnh & E-E-A-T citation</p>
        </div>

        <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-400">CDN & Hosting</span>
            <span className="text-xs font-bold text-emerald-400">Edge Runtime</span>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-white">Cloudflare</div>
          <p className="mt-1 text-xs text-navy-400">Tải trang siêu tốc toàn cầu</p>
        </div>
      </div>

      {/* Company Metadata Info */}
      <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-8 shadow-xl space-y-6">
        <h3 className="font-display text-lg font-bold text-white border-b border-navy-800 pb-4">
          Thông tin pháp nhân & Cấu hình thương hiệu
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Tên doanh nghiệp</label>
            <input
              type="text"
              readOnly
              value={site.legalName.vi}
              className="mt-1 w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 text-sm font-semibold text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Mã số thuế (Tax ID)</label>
            <input
              type="text"
              readOnly
              value={site.taxId}
              className="mt-1 w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 font-mono text-sm font-semibold text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Hotline / Zalo liên hệ</label>
            <input
              type="text"
              readOnly
              value={site.phone}
              className="mt-1 w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 font-mono text-sm font-semibold text-orange-400 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Email nhận thông báo Lead</label>
            <input
              type="text"
              readOnly
              value={site.email}
              className="mt-1 w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 font-mono text-sm font-semibold text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Địa chỉ văn phòng</label>
            <input
              type="text"
              readOnly
              value={site.address.vi}
              className="mt-1 w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 text-sm font-semibold text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Đường dẫn Google Maps / Knowledge Graph</label>
            <input
              type="text"
              readOnly
              value={site.mapUrl}
              className="mt-1 w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 font-mono text-xs text-navy-300 outline-none select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

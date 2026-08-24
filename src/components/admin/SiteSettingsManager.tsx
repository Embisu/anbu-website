"use client";

import React from "react";
import { site } from "@/content/site";
import Icon from "@/components/Icon";

export default function SiteSettingsManager({ locale }: { locale: string }) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái SEO</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-3 font-display text-2xl font-extrabold text-slate-900">168 URLs</div>
          <p className="mt-1 text-xs font-medium text-emerald-600">✓ Sitemap XML Đã đồng bộ 100%</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Google Entity Map</span>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              Verified
            </span>
          </div>
          <div className="mt-3 font-display text-xl font-extrabold text-slate-900">/g/11nv91ww0r</div>
          <p className="mt-1 text-xs text-slate-500">Knowledge Graph ID</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Độ phủ bài viết</span>
            <span className="text-xs font-bold text-blue-600">56 Bài</span>
          </div>
          <div className="mt-3 font-display text-2xl font-extrabold text-slate-900">100% Đa Ảnh</div>
          <p className="mt-1 text-xs text-slate-500">Đầy đủ ảnh & E-E-A-T citation</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CDN & Hosting</span>
            <span className="text-xs font-bold text-emerald-600">Edge Runtime</span>
          </div>
          <div className="mt-3 font-display text-2xl font-extrabold text-slate-900">Cloudflare</div>
          <p className="mt-1 text-xs text-slate-500">Tải trang siêu tốc toàn cầu</p>
        </div>
      </div>

      {/* Company Metadata Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Cài đặt Tổng quan (General Settings) & Cấu hình Pháp nhân
            </h3>
            <p className="text-xs text-slate-500">Thông tin xuất hiện trên Schema JSON-LD và chân trang (Footer)</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Trạng thái hoạt động
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Tên doanh nghiệp đầy đủ</label>
            <input
              type="text"
              readOnly
              value={site.legalName.vi}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Mã số thuế (Tax ID)</label>
            <input
              type="text"
              readOnly
              value={site.taxId}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-sm font-semibold text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Hotline / Zalo liên hệ</label>
            <input
              type="text"
              readOnly
              value={site.phone}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-sm font-semibold text-blue-700 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email nhận thông báo Lead</label>
            <input
              type="text"
              readOnly
              value={site.email}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-sm font-semibold text-slate-900 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Địa chỉ văn phòng</label>
            <input
              type="text"
              readOnly
              value={site.address.vi}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Đường dẫn Google Maps / Knowledge Graph</label>
            <input
              type="text"
              readOnly
              value={site.mapUrl}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-700 outline-none select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

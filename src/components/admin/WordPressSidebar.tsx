"use client";

import React, { useState } from "react";

export type AdminMenuTab = "dashboard" | "posts" | "new_post" | "categories" | "media" | "leads" | "settings" | "rank_math";

type WordPressSidebarProps = {
  activeTab: AdminMenuTab;
  onSelectTab: (tab: AdminMenuTab) => void;
  postCount: number;
  leadsCount: number;
};

export default function WordPressSidebar({ activeTab, onSelectTab, postCount, leadsCount }: WordPressSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isPostsSection = activeTab === "posts" || activeTab === "new_post" || activeTab === "categories";

  return (
    <aside
      className={`shrink-0 bg-[#1d2327] text-[#c3c4c7] text-[13px] select-none transition-all duration-200 ${
        collapsed ? "w-12" : "w-44"
      }`}
    >
      <nav className="py-2 space-y-0.5">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab("dashboard")}
          className={`flex w-full items-center gap-3 px-3 py-2 text-left font-medium transition ${
            activeTab === "dashboard"
              ? "bg-[#2271b1] text-white font-bold"
              : "hover:bg-[#135e96]/30 hover:text-[#72aee6]"
          }`}
        >
          <span className="text-sm">📊</span>
          {!collapsed && <span>Bảng tin</span>}
        </button>

        {/* Posts Menu Item (With Submenu) */}
        <div>
          <button
            onClick={() => onSelectTab("posts")}
            className={`flex w-full items-center justify-between px-3 py-2 text-left font-medium transition ${
              isPostsSection
                ? "bg-[#2271b1] text-white font-bold"
                : "hover:bg-[#135e96]/30 hover:text-[#72aee6]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">📌</span>
              {!collapsed && <span>Bài viết</span>}
            </div>
            {!collapsed && (
              <span className="rounded bg-[#135e96] px-1.5 py-0.2 text-[10px] font-bold text-white">
                {postCount}
              </span>
            )}
          </button>

          {/* Posts Submenu (Always open when in Posts Section) */}
          {isPostsSection && !collapsed && (
            <div className="bg-[#13171b] py-1 text-xs">
              <button
                onClick={() => onSelectTab("posts")}
                className={`flex w-full px-7 py-1.5 text-left transition ${
                  activeTab === "posts"
                    ? "text-white font-bold"
                    : "text-[#a7aaad] hover:text-[#72aee6]"
                }`}
              >
                Tất cả bài viết
              </button>
              <button
                onClick={() => onSelectTab("new_post")}
                className={`flex w-full px-7 py-1.5 text-left transition ${
                  activeTab === "new_post"
                    ? "text-white font-bold"
                    : "text-[#a7aaad] hover:text-[#72aee6]"
                }`}
              >
                Viết bài mới
              </button>
              <button
                onClick={() => onSelectTab("categories")}
                className={`flex w-full px-7 py-1.5 text-left transition ${
                  activeTab === "categories"
                    ? "text-white font-bold"
                    : "text-[#a7aaad] hover:text-[#72aee6]"
                }`}
              >
                Chuyên mục
              </button>
            </div>
          )}
        </div>

        {/* Media */}
        <button
          onClick={() => onSelectTab("media")}
          className={`flex w-full items-center gap-3 px-3 py-2 text-left font-medium transition ${
            activeTab === "media"
              ? "bg-[#2271b1] text-white font-bold"
              : "hover:bg-[#135e96]/30 hover:text-[#72aee6]"
          }`}
        >
          <span className="text-sm">📁</span>
          {!collapsed && <span>Media</span>}
        </button>

        {/* Leads / Contact Submissions */}
        <button
          onClick={() => onSelectTab("leads")}
          className={`flex w-full items-center justify-between px-3 py-2 text-left font-medium transition ${
            activeTab === "leads"
              ? "bg-[#2271b1] text-white font-bold"
              : "hover:bg-[#135e96]/30 hover:text-[#72aee6]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">💬</span>
            {!collapsed && <span>Phản hồi (Leads)</span>}
          </div>
          {!collapsed && (
            <span className="rounded-full bg-[#d63638] px-1.5 py-0.2 text-[10px] font-bold text-white">
              {leadsCount}
            </span>
          )}
        </button>

        {/* Rank Math SEO Plugin item */}
        <button
          onClick={() => onSelectTab("rank_math")}
          className={`flex w-full items-center justify-between px-3 py-2 text-left font-medium transition ${
            activeTab === "rank_math"
              ? "bg-[#2271b1] text-white font-bold"
              : "hover:bg-[#135e96]/30 hover:text-[#72aee6]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">🎯</span>
            {!collapsed && <span>Rank Math SEO</span>}
          </div>
          {!collapsed && (
            <span className="rounded bg-[#e53935] px-1 py-0.2 text-[9px] font-extrabold text-white">
              PRO
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => onSelectTab("settings")}
          className={`flex w-full items-center gap-3 px-3 py-2 text-left font-medium transition ${
            activeTab === "settings"
              ? "bg-[#2271b1] text-white font-bold"
              : "hover:bg-[#135e96]/30 hover:text-[#72aee6]"
          }`}
        >
          <span className="text-sm">⚙️</span>
          {!collapsed && <span>Cài đặt</span>}
        </button>

        {/* Collapse Button */}
        <div className="pt-8">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center gap-3 px-3 py-2 text-left text-xs text-[#a7aaad] hover:text-[#72aee6] transition"
          >
            <span>{collapsed ? "▶" : "◀"}</span>
            {!collapsed && <span>Thu gọn menu</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}

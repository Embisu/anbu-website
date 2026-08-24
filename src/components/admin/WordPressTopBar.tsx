"use client";

import React from "react";
import Link from "next/link";

type WordPressTopBarProps = {
  locale: string;
  avgScore?: number;
  onNewPost: () => void;
  onLogout: () => void;
};

export default function WordPressTopBar({ locale, avgScore = 91, onNewPost, onLogout }: WordPressTopBarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-8 items-center justify-between bg-[#1d2327] px-3 text-[#c3c4c7] text-[13px] select-none border-b border-[#2c3338]">
      {/* Left Menu Items */}
      <div className="flex items-center gap-4">
        {/* WordPress Icon */}
        <div className="group relative flex items-center">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="flex h-8 items-center gap-1.5 px-2 hover:bg-[#2c3338] hover:text-[#72aee6] transition"
            title="ANBU Website"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c3c4c7] font-display text-[10px] font-black text-[#1d2327]">
              W
            </span>
          </Link>
        </div>

        {/* Site Name with Home Icon */}
        <Link
          href={`/${locale}`}
          target="_blank"
          className="flex h-8 items-center gap-1.5 px-2 hover:bg-[#2c3338] hover:text-[#72aee6] transition font-medium"
        >
          <span className="text-sm">🏠</span>
          <span>ANBU Studio</span>
        </Link>

        {/* Comment Bubble */}
        <div className="hidden sm:flex h-8 items-center gap-1 px-2 text-[#c3c4c7]">
          <span>💬</span>
          <span className="rounded-full bg-[#4f94d4] px-1.5 text-[10px] font-bold text-white leading-tight">
            3
          </span>
        </div>

        {/* + New Button */}
        <button
          onClick={onNewPost}
          className="flex h-8 items-center gap-1 px-2 hover:bg-[#2c3338] hover:text-[#72aee6] transition font-medium"
        >
          <span className="text-sm leading-none">+</span>
          <span>Mới</span>
        </button>

        {/* Dynamic SEO Indicator */}
        <div className="hidden md:flex h-8 items-center gap-1.5 px-2 text-[#c3c4c7]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold text-emerald-400">Rank Math SEO: {avgScore}/100</span>
        </div>
      </div>

      {/* Right User Profile */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#c3c4c7] hidden sm:inline">
          Chào, <strong className="text-white">admin</strong>
        </span>
        {/* User Avatar */}
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3c434a] text-xs font-bold text-white">
          👤
        </div>
        <button
          onClick={onLogout}
          className="flex h-8 items-center px-2 text-xs text-[#c3c4c7] hover:bg-[#2c3338] hover:text-rose-400 transition"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

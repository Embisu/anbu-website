"use client";

import React, { useState } from "react";
import type { Post } from "@/content/posts";

type RankMathSEOProps = {
  post: Post;
  lang: "vi" | "en";
  onUpdateSnippet: (field: "title" | "excerpt" | "slug", value: string) => void;
};

export default function RankMathSEO({ post, lang, onUpdateSnippet }: RankMathSEOProps) {
  const [focusKeyword, setFocusKeyword] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "social">("desktop");

  const currentTitle = post.title[lang] || "";
  const currentExcerpt = post.excerpt[lang] || "";
  const currentSlug = post.slug || "";

  // Combine full text for SEO checks
  const fullContentText = post.body
    .map((b) => {
      if (b.type === "p" || b.type === "h2" || b.type === "quote") return b.text[lang] || "";
      if (b.type === "ul") return b.items.map((it) => it[lang] || "").join(" ");
      return "";
    })
    .join(" ");

  const wordCount = fullContentText.trim().split(/\s+/).filter(Boolean).length;
  const imageBlocks = post.body.filter((b) => b.type === "image");
  const h2Blocks = post.body.filter((b) => b.type === "h2");

  // Normalized keywords check
  const kw = focusKeyword.trim().toLowerCase();

  // SEO Checks
  const checks = {
    // 1. Basic SEO
    hasKeyword: kw.length > 0,
    kwInTitle: kw.length > 0 && currentTitle.toLowerCase().includes(kw),
    kwInExcerpt: kw.length > 0 && currentExcerpt.toLowerCase().includes(kw),
    kwInSlug: kw.length > 0 && currentSlug.toLowerCase().includes(kw.replace(/\s+/g, "-")),
    kwInContentFirst10:
      kw.length > 0 && fullContentText.slice(0, Math.floor(fullContentText.length * 0.2)).toLowerCase().includes(kw),
    wordCountPassed: wordCount >= 350,
    wordCountGreat: wordCount >= 600,

    // 2. Additional SEO
    kwInH2: kw.length > 0 && h2Blocks.some((h) => (h.text[lang] || "").toLowerCase().includes(kw)),
    kwInImageAlt:
      kw.length > 0 &&
      imageBlocks.some((img) => ((img as any).alt?.[lang] || "").toLowerCase().includes(kw)),
    hasImages: imageBlocks.length >= 1,
    hasMultipleImages: imageBlocks.length >= 2,
    hasH2s: h2Blocks.length >= 2,

    // 3. Title & Readability
    titleLengthGood: currentTitle.length >= 40 && currentTitle.length <= 70,
    excerptLengthGood: currentExcerpt.length >= 110 && currentExcerpt.length <= 165,
    titleHasNumber: /\d+/.test(currentTitle),
    hasList: post.body.some((b) => b.type === "ul"),
    hasQuote: post.body.some((b) => b.type === "quote"),
  };

  // Calculate SEO Score out of 100
  let score = 25; // base for having content
  if (checks.hasKeyword) score += 10;
  if (checks.kwInTitle) score += 15;
  if (checks.kwInExcerpt) score += 10;
  if (checks.kwInSlug) score += 5;
  if (checks.kwInContentFirst10) score += 5;
  if (checks.wordCountGreat) score += 10;
  else if (checks.wordCountPassed) score += 5;
  if (checks.kwInH2) score += 5;
  if (checks.kwInImageAlt) score += 5;
  if (checks.hasMultipleImages) score += 5;
  if (checks.titleLengthGood) score += 5;
  if (checks.excerptLengthGood) score += 5;
  if (checks.titleHasNumber) score += 5;
  if (score > 100) score = 100;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "bg-emerald-500 text-white";
    if (s >= 55) return "bg-amber-500 text-white";
    return "bg-rose-500 text-white";
  };

  const getScoreText = (s: number) => {
    if (s >= 80) return lang === "vi" ? "Tuyệt vời (Great)" : "Great";
    if (s >= 55) return lang === "vi" ? "Khá tốt (Good)" : "Good";
    return lang === "vi" ? "Cần cải thiện (Needs Work)" : "Needs Work";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Rank Math Plugin Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#e53935] to-[#f4511e] font-display text-sm font-black text-white shadow-sm">
            RM
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Rank Math SEO <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">PRO</span>
            </h3>
            <p className="text-xs text-slate-500">Chấm điểm tối ưu hóa công cụ tìm kiếm chuẩn Google</p>
          </div>
        </div>

        {/* Dynamic SEO Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">SEO Score</span>
            <span className="text-xs font-semibold text-slate-600">{getScoreText(score)}</span>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-display text-base font-extrabold shadow-md ${getScoreColor(score)}`}>
            {score}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Focus Keyword Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Từ khóa chính (Focus Keyword)
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder={lang === "vi" ? "Ví dụ: marketing game, aso game mobile, discord việt nam..." : "e.g. game marketing, aso mobile..."}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-inner outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            {focusKeyword && (
              <button
                onClick={() => setFocusKeyword("")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Xóa
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Nhập từ khóa chính mà bạn muốn bài viết này xếp hạng Top 1 trên Google Search.
          </p>
        </div>

        {/* Google SERP Snippet Preview */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Xem trước kết quả tìm kiếm (SERP Preview)</span>
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`rounded px-2.5 py-1 text-xs font-semibold ${previewMode === "desktop" ? "bg-slate-800 text-white" : "text-slate-600"}`}
              >
                🖥️ Desktop
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`rounded px-2.5 py-1 text-xs font-semibold ${previewMode === "mobile" ? "bg-slate-800 text-white" : "text-slate-600"}`}
              >
                📱 Mobile
              </button>
              <button
                onClick={() => setPreviewMode("social")}
                className={`rounded px-2.5 py-1 text-xs font-semibold ${previewMode === "social" ? "bg-slate-800 text-white" : "text-slate-600"}`}
              >
                🌐 Social Share
              </button>
            </div>
          </div>

          {/* Snippet Card */}
          <div className="mt-4">
            {previewMode !== "social" ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left max-w-xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-white">
                    A
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-slate-800">ANBU Asia</div>
                    <div className="text-[11px] text-slate-500 font-mono">https://anbu.asia/{lang}/blog/{currentSlug}</div>
                  </div>
                </div>
                <h4 className="mt-2 text-base font-medium text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                  {currentTitle || "Tiêu đề bài viết..."}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#4d5156] line-clamp-2">
                  {currentExcerpt || "Mô tả tóm tắt nội dung bài viết sẽ hiển thị tại đây khi người dùng tìm kiếm trên Google..."}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm max-w-md">
                <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">ANBU.ASIA</div>
                  <div className="text-sm font-bold text-slate-900 line-clamp-1">{currentTitle}</div>
                  <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{currentExcerpt}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Rank Math Checklist */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            Danh sách tiêu chuẩn chấm điểm SEO (SEO Audit Checklist)
          </h4>

          {/* Group 1: Basic SEO */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5">
            <div className="text-xs font-bold text-slate-700">1. Tiêu chuẩn SEO cơ bản (Basic SEO)</div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span>{checks.kwInTitle ? "🟢" : "🔴"}</span>
                <span className={checks.kwInTitle ? "text-slate-700" : "text-rose-600 font-medium"}>
                  Từ khóa chính xuất hiện trong <strong>Tiêu đề bài viết (SEO Title)</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.kwInExcerpt ? "🟢" : "🔴"}</span>
                <span className={checks.kwInExcerpt ? "text-slate-700" : "text-rose-600 font-medium"}>
                  Từ khóa chính xuất hiện trong <strong>Mô tả tóm tắt (Meta Description)</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.kwInSlug ? "🟢" : "🔴"}</span>
                <span className={checks.kwInSlug ? "text-slate-700" : "text-rose-600 font-medium"}>
                  Từ khóa chính xuất hiện trong <strong>Đường dẫn URL / Slug</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.kwInContentFirst10 ? "🟢" : "🟡"}</span>
                <span className={checks.kwInContentFirst10 ? "text-slate-700" : "text-amber-700 font-medium"}>
                  Từ khóa chính xuất hiện ở <strong>đoạn mở đầu bài viết (First 10%)</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.wordCountGreat ? "🟢" : checks.wordCountPassed ? "🟡" : "🔴"}</span>
                <span className={checks.wordCountGreat ? "text-slate-700" : "text-amber-700 font-medium"}>
                  Độ dài nội dung: <strong>{wordCount} từ</strong> (Khuyên dùng: &ge;600 từ cho bài phân tích sâu).
                </span>
              </li>
            </ul>
          </div>

          {/* Group 2: Additional SEO */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5">
            <div className="text-xs font-bold text-slate-700">2. Bổ trợ nâng cao & Trực quan (Additional SEO & Media)</div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span>{checks.kwInH2 ? "🟢" : "🟡"}</span>
                <span className={checks.kwInH2 ? "text-slate-700" : "text-slate-600"}>
                  Từ khóa chính được sử dụng trong các <strong>thẻ tiêu đề mục phụ (H2)</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.kwInImageAlt ? "🟢" : "🟡"}</span>
                <span className={checks.kwInImageAlt ? "text-slate-700" : "text-slate-600"}>
                  Từ khóa chính có trong <strong>thẻ Alt mô tả của hình ảnh</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.hasMultipleImages ? "🟢" : checks.hasImages ? "🟡" : "🔴"}</span>
                <span className={checks.hasMultipleImages ? "text-slate-700" : "text-amber-700 font-medium"}>
                  Bài viết tích hợp <strong>đa ảnh minh họa thực tế ({imageBlocks.length} ảnh)</strong> kèm Caption.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.hasH2s ? "🟢" : "🔴"}</span>
                <span className={checks.hasH2s ? "text-slate-700" : "text-rose-600 font-medium"}>
                  Cấu trúc phân mục rõ ràng với ít nhất <strong>{h2Blocks.length} thẻ H2</strong>.
                </span>
              </li>
            </ul>
          </div>

          {/* Group 3: Title & Readability */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5">
            <div className="text-xs font-bold text-slate-700">3. Khả năng đọc & Thu hút (Title & Content Readability)</div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span>{checks.titleLengthGood ? "🟢" : "🟡"}</span>
                <span className="text-slate-700">
                  Độ dài tiêu đề tối ưu: <strong>{currentTitle.length} ký tự</strong> (Chuẩn: 40–70 ký tự).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.excerptLengthGood ? "🟢" : "🟡"}</span>
                <span className="text-slate-700">
                  Độ dài mô tả tóm tắt: <strong>{currentExcerpt.length} ký tự</strong> (Chuẩn: 120–165 ký tự).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.titleHasNumber ? "🟢" : "⚪"}</span>
                <span className="text-slate-700">
                  Tiêu đề chứa con số thống kê hoặc các bước (ví dụ: &quot;3 Bước&quot;, &quot;10 Chỉ số&quot;, &quot;2026&quot;).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.hasList ? "🟢" : "⚪"}</span>
                <span className="text-slate-700">
                  Sử dụng danh sách gạch đầu dòng (`ul`) giúp người đọc dễ quét thông tin.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

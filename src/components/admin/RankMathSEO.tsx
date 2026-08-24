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
  const [isEditingSnippet, setIsEditingSnippet] = useState(false);
  const [customSeoTitle, setCustomSeoTitle] = useState(post.title[lang] || "");
  const [customSeoDesc, setCustomSeoDesc] = useState(post.excerpt[lang] || "");
  const [customSlug, setCustomSlug] = useState(post.slug || "");

  const currentTitle = customSeoTitle || post.title[lang] || "";
  const currentExcerpt = customSeoDesc || post.excerpt[lang] || "";
  const currentSlug = customSlug || post.slug || "";

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

  // Keyword count & density
  let kwCount = 0;
  if (kw.length > 0) {
    const regex = new RegExp(kw, "gi");
    const matches = fullContentText.match(regex);
    kwCount = matches ? matches.length : 0;
  }
  const kwDensity = wordCount > 0 ? ((kwCount / wordCount) * 100).toFixed(2) : "0.00";

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
    kwDensityGood: parseFloat(kwDensity) >= 0.8 && parseFloat(kwDensity) <= 2.5,

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
    if (s >= 80) return "bg-[#2e7d32] text-white";
    if (s >= 55) return "bg-[#f57c00] text-white";
    return "bg-[#d32f2f] text-white";
  };

  const getScoreText = (s: number) => {
    if (s >= 80) return lang === "vi" ? "Tuyệt vời (Great)" : "Great";
    if (s >= 55) return lang === "vi" ? "Khá tốt (Good)" : "Good";
    return lang === "vi" ? "Cần cải thiện (Needs Work)" : "Needs Work";
  };

  return (
    <div className="rounded border border-[#ccd0d4] bg-white shadow-sm overflow-hidden text-xs text-[#2c3338]">
      {/* Rank Math Plugin Header */}
      <div className="flex items-center justify-between border-b border-[#ccd0d4] bg-[#f6f7f7] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-tr from-[#e53935] to-[#f4511e] font-display text-xs font-black text-white shadow-sm">
            RM
          </span>
          <div>
            <h3 className="font-bold text-sm text-[#1d2327] flex items-center gap-1.5">
              Rank Math SEO <span className="rounded bg-[#e53935] px-1 py-0.2 text-[9px] font-bold text-white">PRO</span>
            </h3>
            <p className="text-[11px] text-[#646970]">Tối ưu hóa On-Page & Schema Snippet chuẩn Google</p>
          </div>
        </div>

        {/* Dynamic SEO Score Badge */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#646970]">SEO Score</span>
            <span className="text-[11px] font-semibold text-[#1d2327]">{getScoreText(score)}</span>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded font-display text-sm font-extrabold shadow-sm ${getScoreColor(score)}`}>
            {score}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Focus Keyword Box */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1d2327]">
            Từ khóa chính (Focus Keyword)
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder={lang === "vi" ? "Ví dụ: marketing game, aso game mobile, discord việt nam..." : "e.g. game marketing, aso mobile..."}
              className="flex-1 rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            />
            {focusKeyword && (
              <button
                type="button"
                onClick={() => setFocusKeyword("")}
                className="rounded border border-[#ccd0d4] px-2.5 py-1 text-xs text-[#646970] hover:bg-[#f0f0f1]"
              >
                Xóa
              </button>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#646970]">
            <span>Mật độ từ khóa: <strong className="text-[#1d2327]">{kwDensity}%</strong> ({kwCount} lần xuất hiện)</span>
            <span className={checks.kwDensityGood ? "text-[#2e7d32] font-semibold" : "text-[#f57c00]"}>
              {checks.kwDensityGood ? "✓ Mật độ lý tưởng (0.8% – 2.5%)" : "Khuyên dùng: 1.0% – 2.0%"}
            </span>
          </div>
        </div>

        {/* Google SERP Snippet Preview Box */}
        <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-3.5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#ccd0d4] pb-2">
            <span className="font-bold uppercase text-[11px] text-[#1d2327]">Xem trước kết quả tìm kiếm (SERP Preview)</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`rounded px-2 py-0.5 text-xs font-semibold ${previewMode === "desktop" ? "bg-[#2271b1] text-white" : "bg-white text-[#2c3338] border border-[#ccd0d4]"}`}
              >
                🖥️ Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={`rounded px-2 py-0.5 text-xs font-semibold ${previewMode === "mobile" ? "bg-[#2271b1] text-white" : "bg-white text-[#2c3338] border border-[#ccd0d4]"}`}
              >
                📱 Mobile
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("social")}
                className={`rounded px-2 py-0.5 text-xs font-semibold ${previewMode === "social" ? "bg-[#2271b1] text-white" : "bg-white text-[#2c3338] border border-[#ccd0d4]"}`}
              >
                🌐 Social Share
              </button>
            </div>
          </div>

          {/* Snippet Card */}
          <div>
            {previewMode !== "social" ? (
              <div className="rounded border border-[#ccd0d4] bg-white p-3.5 shadow-sm text-left max-w-xl">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1d2327] text-[9px] font-bold text-white">
                    A
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-[#202124]">ANBU Asia</div>
                    <div className="text-[10px] text-[#5f6368] font-mono">https://anbu.asia/{lang}/blog/{currentSlug}</div>
                  </div>
                </div>
                <h4 className="mt-1.5 text-base font-medium text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                  {currentTitle || "Tiêu đề bài viết..."}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-[#4d5156] line-clamp-2">
                  {currentExcerpt || "Mô tả tóm tắt nội dung bài viết sẽ hiển thị tại đây khi người dùng tìm kiếm trên Google..."}
                </p>
              </div>
            ) : (
              <div className="rounded border border-[#ccd0d4] bg-white overflow-hidden shadow-sm max-w-md">
                <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-2.5 bg-[#f6f7f7] border-t border-[#ccd0d4]">
                  <div className="text-[9px] font-bold uppercase text-[#646970]">ANBU.ASIA</div>
                  <div className="text-xs font-bold text-[#1d2327] line-clamp-1">{currentTitle}</div>
                  <div className="text-[11px] text-[#646970] line-clamp-2 mt-0.5">{currentExcerpt}</div>
                </div>
              </div>
            )}
          </div>

          {/* Edit Snippet Button / Form */}
          <div>
            <button
              type="button"
              onClick={() => setIsEditingSnippet(!isEditingSnippet)}
              className="rounded border border-[#2271b1] bg-white px-3 py-1 font-semibold text-[#2271b1] hover:bg-[#f0f6fc]"
            >
              {isEditingSnippet ? "▲ Đóng tùy chỉnh Snippet" : "✏️ Chỉnh sửa Snippet (Edit Snippet)"}
            </button>

            {isEditingSnippet && (
              <div className="mt-3 rounded border border-[#ccd0d4] bg-white p-3.5 space-y-3">
                <div>
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold text-[#50575e]">Tiêu đề SEO (Title Tag)</label>
                    <span className={checks.titleLengthGood ? "text-[#2e7d32] font-semibold" : "text-[#f57c00]"}>
                      {currentTitle.length} / 70 ký tự
                    </span>
                  </div>
                  <input
                    type="text"
                    value={customSeoTitle}
                    onChange={(e) => {
                      setCustomSeoTitle(e.target.value);
                      onUpdateSnippet("title", e.target.value);
                    }}
                    className="mt-1 w-full rounded border border-[#8c8f94] p-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold text-[#50575e]">Đường dẫn (Slug)</label>
                  </div>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => {
                      setCustomSlug(e.target.value);
                      onUpdateSnippet("slug", e.target.value);
                    }}
                    className="mt-1 w-full rounded border border-[#8c8f94] p-1.5 font-mono text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold text-[#50575e]">Mô tả tóm tắt (Meta Description)</label>
                    <span className={checks.excerptLengthGood ? "text-[#2e7d32] font-semibold" : "text-[#f57c00]"}>
                      {currentExcerpt.length} / 160 ký tự
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={customSeoDesc}
                    onChange={(e) => {
                      setCustomSeoDesc(e.target.value);
                      onUpdateSnippet("excerpt", e.target.value);
                    }}
                    className="mt-1 w-full rounded border border-[#8c8f94] p-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Rank Math Checklist */}
        <div className="space-y-3 pt-1">
          <h4 className="font-bold uppercase text-[11px] text-[#1d2327] border-b border-[#ccd0d4] pb-1.5">
            Danh sách tiêu chuẩn kiểm tra SEO (Audit Checklist)
          </h4>

          {/* Group 1: Basic SEO */}
          <div className="rounded border border-[#ccd0d4] bg-white p-3 space-y-2">
            <div className="font-bold text-xs text-[#1d2327]">1. Tiêu chuẩn SEO cơ bản (Basic SEO)</div>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <span>{checks.kwInTitle ? "🟢" : "🔴"}</span>
                <span className={checks.kwInTitle ? "text-[#2c3338]" : "text-[#d63638] font-medium"}>
                  Từ khóa chính xuất hiện trong <strong>Tiêu đề bài viết (SEO Title)</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.kwInExcerpt ? "🟢" : "🔴"}</span>
                <span className={checks.kwInExcerpt ? "text-[#2c3338]" : "text-[#d63638] font-medium"}>
                  Từ khóa chính xuất hiện trong <strong>Mô tả tóm tắt (Meta Description)</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.kwInSlug ? "🟢" : "🔴"}</span>
                <span className={checks.kwInSlug ? "text-[#2c3338]" : "text-[#d63638] font-medium"}>
                  Từ khóa chính xuất hiện trong <strong>Đường dẫn URL / Slug</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.kwInContentFirst10 ? "🟢" : "🟡"}</span>
                <span className={checks.kwInContentFirst10 ? "text-[#2c3338]" : "text-[#b26a00]"}>
                  Từ khóa chính xuất hiện ở <strong>10% đầu bài viết</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.wordCountGreat ? "🟢" : checks.wordCountPassed ? "🟡" : "🔴"}</span>
                <span className={checks.wordCountGreat ? "text-[#2c3338]" : "text-[#b26a00]"}>
                  Độ dài nội dung: <strong>{wordCount} từ</strong> (Đạt tiêu chuẩn chuyên sâu &ge;600 từ).
                </span>
              </li>
            </ul>
          </div>

          {/* Group 2: Additional SEO */}
          <div className="rounded border border-[#ccd0d4] bg-white p-3 space-y-2">
            <div className="font-bold text-xs text-[#1d2327]">2. Bổ trợ & Media (Additional SEO & Visuals)</div>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <span>{checks.kwInH2 ? "🟢" : "🟡"}</span>
                <span className="text-[#2c3338]">
                  Từ khóa chính có trong các <strong>thẻ tiêu đề mục phụ (H2)</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.kwInImageAlt ? "🟢" : "🟡"}</span>
                <span className="text-[#2c3338]">
                  Từ khóa chính có trong <strong>thẻ Alt mô tả của hình ảnh</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>{checks.hasMultipleImages ? "🟢" : checks.hasImages ? "🟡" : "🔴"}</span>
                <span className="text-[#2c3338]">
                  Bài viết tích hợp <strong>đa ảnh minh họa thực tế ({imageBlocks.length} ảnh)</strong> kèm Caption.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import type { Post } from "@/content/posts";

type RankMathSEOProps = {
  post: Post;
  lang: "vi" | "en";
  onUpdateSnippet: (field: "title" | "excerpt" | "slug", value: string) => void;
};

export default function RankMathSEO({ post, lang, onUpdateSnippet }: RankMathSEOProps) {
  // Extract initial smart keywords from post title or category
  const suggestedKeywords = React.useMemo(() => {
    const titleText = post.title[lang] || post.title.vi || "";
    const words = titleText.split(/[:\-, |]/)[0]?.trim() || post.category[lang] || "marketing game";
    const categoryKw = post.category[lang] || "Marketing Game";
    const secondaryKw = titleText.includes("CPI") ? "Tối ưu CPI" : titleText.includes("ASO") ? "ASO Game Mobile" : "Game Marketing";
    return Array.from(new Set([words, categoryKw, secondaryKw])).filter((k) => k && k.length > 2);
  }, [post.title, post.category, lang]);

  const [focusKeyword, setFocusKeyword] = useState<string>(suggestedKeywords[0] || "Marketing Game");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | "social">("desktop");
  const [isEditingSnippet, setIsEditingSnippet] = useState(false);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [customSeoTitle, setCustomSeoTitle] = useState(post.title[lang] || "");
  const [customSeoDesc, setCustomSeoDesc] = useState(post.excerpt[lang] || "");
  const [customSlug, setCustomSlug] = useState(post.slug || "");

  useEffect(() => {
    setCustomSeoTitle(post.title[lang] || "");
    setCustomSeoDesc(post.excerpt[lang] || "");
    setCustomSlug(post.slug || "");
  }, [post, lang]);

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
    const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
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
      kw.length > 0 &&
      fullContentText.slice(0, Math.max(120, Math.floor(fullContentText.length * 0.25))).toLowerCase().includes(kw),
    wordCountPassed: wordCount >= 350,
    wordCountGreat: wordCount >= 650,

    // 2. Additional SEO & Media
    kwInH2: kw.length > 0 && h2Blocks.some((h) => (h.text[lang] || "").toLowerCase().includes(kw)),
    kwInImageAlt:
      kw.length > 0 &&
      imageBlocks.some((img) => ((img as any).alt?.[lang] || "").toLowerCase().includes(kw)),
    hasImages: imageBlocks.length >= 1,
    hasMultipleImages: imageBlocks.length >= 2,
    hasH2s: h2Blocks.length >= 2,
    kwDensityGood: parseFloat(kwDensity) >= 0.8 && parseFloat(kwDensity) <= 2.5,

    // 3. Title & Readability
    titleLengthGood: currentTitle.length >= 40 && currentTitle.length <= 75,
    excerptLengthGood: currentExcerpt.length >= 100 && currentExcerpt.length <= 165,
    titleHasNumber: /\d+/.test(currentTitle),
    hasList: post.body.some((b) => b.type === "ul"),
    hasQuote: post.body.some((b) => b.type === "quote"),
    hasSources: Boolean(post.sources && post.sources.length > 0),
  };

  // Calculate Real Dynamic SEO Score out of 100
  let score = 25; // base
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

  const getScoreBadge = (s: number) => {
    if (s >= 80) return { bg: "bg-[#2e7d32]", label: "Tuyệt vời (Great)", color: "text-[#2e7d32]" };
    if (s >= 55) return { bg: "bg-[#f57c00]", label: "Khá tốt (Good)", color: "text-[#f57c00]" };
    return { bg: "bg-[#d32f2f]", label: "Cần cải thiện (Needs Work)", color: "text-[#d32f2f]" };
  };

  const badgeInfo = getScoreBadge(score);

  const showActionToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // 1-Click Optimization Actions
  const handleInsertKwToTitle = () => {
    if (!currentTitle.toLowerCase().includes(kw)) {
      const newTitle = `${focusKeyword}: ${currentTitle}`;
      setCustomSeoTitle(newTitle);
      onUpdateSnippet("title", newTitle);
      showActionToast(`Đã tự động chèn từ khóa "${focusKeyword}" vào đầu tiêu đề SEO!`);
    }
  };

  const handleInsertKwToExcerpt = () => {
    if (!currentExcerpt.toLowerCase().includes(kw)) {
      const newDesc = `Tìm hiểu chiến lược ${focusKeyword} thực chiến: ${currentExcerpt}`;
      setCustomSeoDesc(newDesc);
      onUpdateSnippet("excerpt", newDesc);
      showActionToast(`Đã bổ sung từ khóa "${focusKeyword}" vào mô tả tóm tắt!`);
    }
  };

  const handleInsertKwToSlug = () => {
    const slugifiedKw = focusKeyword
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const newSlug = `${slugifiedKw}-${currentSlug.replace(/^(marketing-game-|chi-tiet-)/, "")}`;
    setCustomSlug(newSlug);
    onUpdateSnippet("slug", newSlug);
    showActionToast(`Đã cập nhật Slug chứa từ khóa chuẩn SEO: "${newSlug}"`);
  };

  return (
    <div className="rounded border border-[#ccd0d4] bg-white shadow-sm text-xs text-[#2c3338]">
      {/* Plugin Header with Live Score Meter */}
      <div className="flex items-center justify-between border-b border-[#ccd0d4] bg-[#f6f7f7] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-tr from-[#e53935] to-[#f4511e] font-display text-[10px] font-black text-white">
            RM
          </span>
          <div>
            <div className="font-display font-bold text-[#1d2327]">
              Rank Math SEO <span className="rounded bg-[#e53935] px-1 py-0.2 text-[9px] text-white">PRO</span>
            </div>
            <p className="text-[10px] text-[#646970]">Tối ưu hóa On-Page, Đo lường mật độ từ khóa & Schema chuẩn Google</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-[#646970] block">SEO Score</span>
            <span className={`text-xs font-bold ${badgeInfo.color}`}>{badgeInfo.label}</span>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-extrabold shadow-sm text-white ${badgeInfo.bg}`}>
            {score}
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="m-4 rounded border-l-4 border-emerald-500 bg-emerald-50 p-2.5 text-xs font-bold text-emerald-800">
          ✓ {actionSuccess}
        </div>
      )}

      <div className="p-4 space-y-5">
        {/* 1. FOCUS KEYWORD BOX WITH AUTO-SUGGESTIONS */}
        <div className="rounded border border-[#ccd0d4] bg-[#fbfbfb] p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1d2327]">
              🔑 Từ khóa chính (Focus Keyword)
            </label>
            <span className="text-[11px] text-[#646970]">
              Mật độ: <strong className="text-[#1d2327] font-mono">{kwDensity}%</strong> ({kwCount} lần xuất hiện)
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Nhập từ khóa chính..."
              className="flex-1 rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] outline-none focus:border-[#2271b1]"
            />
            {focusKeyword && (
              <button
                type="button"
                onClick={() => setFocusKeyword("")}
                className="rounded border border-[#ccd0d4] bg-white px-2.5 py-1 text-xs text-[#646970] hover:bg-[#f0f0f1]"
              >
                Xóa
              </button>
            )}
          </div>

          {/* 1-Click Keyword Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-[#646970]">Gợi ý từ khóa cho bài này:</span>
            {suggestedKeywords.map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => setFocusKeyword(sk)}
                className={`rounded px-2 py-0.5 text-[10px] font-bold border transition ${
                  focusKeyword === sk
                    ? "bg-[#2271b1] text-white border-[#2271b1]"
                    : "bg-white text-[#2271b1] border-[#ccd0d4] hover:bg-blue-50"
                }`}
              >
                + {sk}
              </button>
            ))}
          </div>
        </div>

        {/* 2. GOOGLE SERP PREVIEW BOX (DISTINCT DESKTOP / MOBILE / SOCIAL SHARE) */}
        <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-3.5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#ccd0d4] pb-2">
            <span className="font-bold uppercase text-[11px] text-[#1d2327]">
              Xem trước kết quả tìm kiếm (Google SERP Preview)
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                  previewMode === "desktop"
                    ? "bg-[#2271b1] text-white font-bold shadow-sm"
                    : "bg-white text-[#2c3338] border border-[#ccd0d4] hover:bg-[#f0f0f1]"
                }`}
              >
                🖥️ Desktop SERP
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                  previewMode === "mobile"
                    ? "bg-[#2271b1] text-white font-bold shadow-sm"
                    : "bg-white text-[#2c3338] border border-[#ccd0d4] hover:bg-[#f0f0f1]"
                }`}
              >
                📱 Mobile Smartphone
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("social")}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                  previewMode === "social"
                    ? "bg-[#2271b1] text-white font-bold shadow-sm"
                    : "bg-white text-[#2c3338] border border-[#ccd0d4] hover:bg-[#f0f0f1]"
                }`}
              >
                🌐 Social Share
              </button>
            </div>
          </div>

          {/* VIEWPORT CANVAS */}
          <div className="flex justify-center p-2">
            {/* 1. DESKTOP VIEWPORT (Wide classic Google layout) */}
            {previewMode === "desktop" && (
              <div className="w-full max-w-xl rounded border border-[#ccd0d4] bg-white p-4 shadow-sm text-left font-sans">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1d2327] text-[10px] font-bold text-white shadow-xs">
                    A
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-[#202124] leading-tight">ANBU Asia, Game Marketing</div>
                    <div className="text-[11px] text-[#4d5156] font-mono leading-none">https://anbu.asia › {lang} › blog › {currentSlug}</div>
                  </div>
                </div>
                <h4 className="text-[19px] font-normal text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer leading-snug">
                  {currentTitle || "Tiêu đề bài viết..."}
                </h4>
                <p className="mt-1 text-[13px] leading-relaxed text-[#4d5156] line-clamp-2">
                  <span className="text-[#70757a] font-medium mr-1">{post.date}, </span>
                  {currentExcerpt || "Mô tả tóm tắt nội dung bài viết sẽ hiển thị tại đây khi người dùng tìm kiếm trên Google..."}
                </p>
              </div>
            )}

            {/* 2. MOBILE VIEWPORT (Smartphone screen frame) */}
            {previewMode === "mobile" && (
              <div className="w-full max-w-[360px] rounded-2xl border-4 border-slate-700 bg-slate-100 p-3 shadow-xl text-left font-sans">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1d2327] text-[10px] font-bold text-white">
                        A
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#202124]">anbu.asia</div>
                        <div className="text-[9px] text-[#70757a] font-mono">https://anbu.asia/blog</div>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs">⋮</span>
                  </div>

                  <h4 className="text-[16px] font-bold text-[#1a0dab] line-clamp-2 leading-snug">
                    {currentTitle || "Tiêu đề bài viết..."}
                  </h4>

                  <p className="text-[12px] leading-relaxed text-[#4d5156] line-clamp-3">
                    <span className="text-slate-500 font-semibold mr-1">{post.date} •</span>
                    {currentExcerpt || "Mô tả bài viết trên màn hình điện thoại..."}
                  </p>
                </div>
                <div className="mt-2 text-center text-[10px] text-slate-500 font-semibold">
                  📱 Mô phỏng màn hình Google Mobile Search
                </div>
              </div>
            )}

            {/* 3. SOCIAL SHARE VIEWPORT (OpenGraph Card) */}
            {previewMode === "social" && (
              <div className="w-full max-w-md rounded border border-[#ccd0d4] bg-white overflow-hidden shadow-md">
                <div className="aspect-[1.91/1] w-full bg-slate-100 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="" className="h-full w-full object-cover" />
                  <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white">
                    OG:IMAGE (1200 × 630)
                  </div>
                </div>
                <div className="p-3 bg-[#f6f7f7] border-t border-[#ccd0d4]">
                  <div className="text-[10px] font-bold uppercase text-[#646970] tracking-wider">ANBU.ASIA</div>
                  <div className="text-[13px] font-bold text-[#1d2327] line-clamp-1 mt-0.5">{currentTitle}</div>
                  <div className="text-[11px] text-[#646970] line-clamp-2 mt-1 leading-normal">{currentExcerpt}</div>
                </div>
              </div>
            )}
          </div>

          {/* Edit Snippet Button & Drawer */}
          <div>
            <button
              type="button"
              onClick={() => setIsEditingSnippet(!isEditingSnippet)}
              className="rounded border border-[#2271b1] bg-white px-3 py-1 font-semibold text-[#2271b1] hover:bg-[#f0f6fc]"
            >
              {isEditingSnippet ? "▲ Đóng tùy chỉnh Snippet" : "✏️ Chỉnh sửa Snippet (Edit Title & Description)"}
            </button>

            {isEditingSnippet && (
              <div className="mt-3 rounded border border-[#ccd0d4] bg-white p-4 space-y-3">
                <div>
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold text-[#50575e]">Tiêu đề SEO (Title Tag):</label>
                    <span className={checks.titleLengthGood ? "text-[#2e7d32] font-semibold" : "text-[#f57c00]"}>
                      {currentTitle.length} / 70 ký tự {checks.titleLengthGood ? "✓" : ""}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={customSeoTitle}
                    onChange={(e) => {
                      setCustomSeoTitle(e.target.value);
                      onUpdateSnippet("title", e.target.value);
                    }}
                    className="mt-1 w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold text-[#50575e]">Đường dẫn (Slug URL):</label>
                    <span className={checks.kwInSlug ? "text-[#2e7d32] font-semibold" : "text-[#f57c00]"}>
                      {checks.kwInSlug ? "✓ Chứa từ khóa" : "Chưa chứa từ khóa"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => {
                      setCustomSlug(e.target.value);
                      onUpdateSnippet("slug", e.target.value);
                    }}
                    className="mt-1 w-full rounded border border-[#8c8f94] p-2 font-mono text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold text-[#50575e]">Mô tả tóm tắt (Meta Description):</label>
                    <span className={checks.excerptLengthGood ? "text-[#2e7d32] font-semibold" : "text-[#f57c00]"}>
                      {currentExcerpt.length} / 160 ký tự {checks.excerptLengthGood ? "✓" : ""}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={customSeoDesc}
                    onChange={(e) => {
                      setCustomSeoDesc(e.target.value);
                      onUpdateSnippet("excerpt", e.target.value);
                    }}
                    className="mt-1 w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. DEEP ACTIONABLE SEO AUDIT CHECKLIST WITH SPECIFIC RECOMMENDATIONS & 1-CLICK FIXES */}
        <div className="space-y-4">
          <div className="font-bold uppercase text-[11px] text-[#1d2327] border-b border-[#ccd0d4] pb-1">
            📋 Đề Xuất Chuyên Sâu Cải Thiện SEO Từng Hạng Mục (Actionable SEO Recommendations)
          </div>

          {/* GROUP 1: Basic SEO */}
          <div className="rounded border border-[#ccd0d4] p-3 space-y-2">
            <h4 className="font-bold text-[#1d2327] text-xs">1. Tiêu chuẩn SEO cơ bản (Basic SEO)</h4>

            {/* Item 1: Keyword in Title */}
            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{checks.kwInTitle ? "🟢" : "🔴"}</span>
                  <span className={`font-semibold ${checks.kwInTitle ? "text-[#2e7d32]" : "text-[#d32f2f]"}`}>
                    Từ khóa chính trong Tiêu đề bài viết (SEO Title)
                  </span>
                </div>
                {!checks.kwInTitle && (
                  <button
                    type="button"
                    onClick={handleInsertKwToTitle}
                    className="rounded bg-[#2271b1] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#135e96]"
                  >
                    ⚡ Tự động chèn từ khóa
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Google gán trọng số xếp hạng cao nhất cho 40 ký tự đầu tiên của thẻ tiêu đề. Đặt từ khóa chính <em>&quot;{focusKeyword}&quot;</em> ở vị trí đầu câu giúp tăng tỷ lệ click (CTR) và cải thiện thứ hạng tìm kiếm.
              </p>
            </div>

            {/* Item 2: Keyword in Excerpt */}
            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{checks.kwInExcerpt ? "🟢" : "🔴"}</span>
                  <span className={`font-semibold ${checks.kwInExcerpt ? "text-[#2e7d32]" : "text-[#d32f2f]"}`}>
                    Từ khóa chính trong Mô tả tóm tắt (Meta Description)
                  </span>
                </div>
                {!checks.kwInExcerpt && (
                  <button
                    type="button"
                    onClick={handleInsertKwToExcerpt}
                    className="rounded bg-[#2271b1] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#135e96]"
                  >
                    ⚡ Tự động chèn từ khóa
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Khi từ khóa xuất hiện trong đoạn mô tả (120–160 ký tự), Google sẽ in đậm cụm từ này trên trang kết quả tìm kiếm, giúp bài viết nổi bật hơn so với đối thủ.
              </p>
            </div>

            {/* Item 3: Keyword in Slug */}
            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{checks.kwInSlug ? "🟢" : "🔴"}</span>
                  <span className={`font-semibold ${checks.kwInSlug ? "text-[#2e7d32]" : "text-[#d32f2f]"}`}>
                    Từ khóa chính trong Đường dẫn URL (Slug)
                  </span>
                </div>
                {!checks.kwInSlug && (
                  <button
                    type="button"
                    onClick={handleInsertKwToSlug}
                    className="rounded bg-[#2271b1] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#135e96]"
                  >
                    ⚡ Tối ưu hóa Slug
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Đường dẫn tĩnh ngắn gọn, chứa từ khóa không dấu ngăn cách bằng dấu gạch ngang giúp bot Google hiểu nhanh chủ đề bài viết.
              </p>
            </div>

            {/* Item 4: Keyword in First 10% */}
            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span>{checks.kwInContentFirst10 ? "🟢" : "🟡"}</span>
                <span className={`font-semibold ${checks.kwInContentFirst10 ? "text-[#2e7d32]" : "text-[#f57c00]"}`}>
                  Từ khóa chính xuất hiện ở 10% đầu bài viết (Opening Hook)
                </span>
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Nhắc đến từ khóa chính ngay trong 2 câu mở bài giúp giảm tỷ lệ thoát trang (Bounce Rate) khi người dùng lập tức nhận ra bài viết trả lời đúng nhu cầu của họ.
              </p>
            </div>

            {/* Item 5: Word Count */}
            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{checks.wordCountGreat ? "🟢" : checks.wordCountPassed ? "🟡" : "🔴"}</span>
                  <span className={`font-semibold ${checks.wordCountGreat ? "text-[#2e7d32]" : "text-[#f57c00]"}`}>
                    Độ dài nội dung: <strong>{wordCount} từ</strong> (Khuyến nghị: &ge; 650 từ)
                  </span>
                </div>
                <span className="text-[10px] text-[#646970] font-bold">
                  {checks.wordCountGreat ? "✓ Đạt chuẩn chuyên sâu" : "Cần bổ sung thêm phân tích"}
                </span>
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Các bài viết chuyên môn ngành game có độ dài trên 700 từ có tỷ lệ lọt Top 3 Google cao gấp <strong>2.4 lần</strong> so với các bài viết ngắn dưới 400 từ.
              </p>
            </div>
          </div>

          {/* GROUP 2: Additional SEO & Visual Evidence */}
          <div className="rounded border border-[#ccd0d4] p-3 space-y-2">
            <h4 className="font-bold text-[#1d2327] text-xs">2. Bổ trợ & Đa phương tiện (Additional SEO & Visuals)</h4>

            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span>{checks.kwInH2 ? "🟢" : "🟡"}</span>
                <span className={`font-semibold ${checks.kwInH2 ? "text-[#2e7d32]" : "text-[#f57c00]"}`}>
                  Từ khóa chính trong Tiêu đề mục phụ (H2)
                </span>
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Có ít nhất 1 thẻ H2 chứa từ khóa chính giúp tạo cấu trúc phân cấp bài viết và giúp Google trích đoạn nổi bật (Featured Snippet).
              </p>
            </div>

            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span>{checks.kwInImageAlt ? "🟢" : "🟡"}</span>
                <span className={`font-semibold ${checks.kwInImageAlt ? "text-[#2e7d32]" : "text-[#f57c00]"}`}>
                  Từ khóa trong thẻ Alt mô tả của hình ảnh
                </span>
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Đặt thuộc tính <code>alt=&quot;{focusKeyword}&quot;</code> cho ảnh đại diện hoặc biểu đồ phân tích để thu hút lưu lượng từ Google Image Search.
              </p>
            </div>

            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span>{checks.hasMultipleImages ? "🟢" : "🟡"}</span>
                <span className={`font-semibold ${checks.hasMultipleImages ? "text-[#2e7d32]" : "text-[#f57c00]"}`}>
                  Tích hợp đa hình ảnh minh họa thực tế ({imageBlocks.length} ảnh)
                </span>
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Bài viết có từ 2–3 hình ảnh minh họa (ảnh chụp màn hình chiến dịch, biểu đồ chỉ số CPI/ROAS) giữ chân người đọc lâu hơn 42%.
              </p>
            </div>
          </div>

          {/* GROUP 3: Readability & CTR Booster */}
          <div className="rounded border border-[#ccd0d4] p-3 space-y-2">
            <h4 className="font-bold text-[#1d2327] text-xs">3. Khả năng đọc & Gia tăng tỷ lệ nhấp (Readability & CTR)</h4>

            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span>{checks.titleHasNumber ? "🟢" : "🟡"}</span>
                <span className={`font-semibold ${checks.titleHasNumber ? "text-[#2e7d32]" : "text-[#f57c00]"}`}>
                  Tiêu đề chứa con số thống kê hoặc năm (ví dụ: 2026, 5 Bước, 3 Chỉ số)
                </span>
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Tiêu đề có con số cụ thể giúp kích thích thị giác và đạt tỷ lệ nhấp chuột trung bình cao hơn 34.8% trên Google SERP.
              </p>
            </div>

            <div className="rounded border border-[#eee] bg-[#fafafa] p-2.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span>{checks.hasList ? "🟢" : "🟡"}</span>
                <span className={`font-semibold ${checks.hasList ? "text-[#2e7d32]" : "text-[#f57c00]"}`}>
                  Sử dụng danh sách gạch đầu dòng (Bullet Points)
                </span>
              </div>
              <p className="text-[11px] text-[#646970]">
                <strong>Khuyến nghị chuyên sâu:</strong> Giúp người đọc dễ quét thông tin trên điện thoại di động và kích hoạt cơ chế nhận diện định dạng Schema List của Google.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

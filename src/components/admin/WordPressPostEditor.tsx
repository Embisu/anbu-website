"use client";

import React, { useState } from "react";
import type { Post } from "@/content/posts";
import { blogCategories } from "@/content/posts";
import MediaManager from "@/components/admin/MediaManager";
import RankMathSEO from "@/components/admin/RankMathSEO";

type WordPressPostEditorProps = {
  initialPost?: Post | null;
  locale: string;
  onSave: (post: Post) => void;
  onCancel: () => void;
};

const emptyPost: Post = {
  slug: "",
  title: { vi: "", en: "" },
  excerpt: { vi: "", en: "" },
  category: { vi: "Marketing Game", en: "Game Marketing" },
  date: new Date().toISOString().split("T")[0],
  readingTime: 5,
  cover: "/blog-covers/performance-ad-campaigns.jpg",
  author: "ANBU Team",
  color: "from-blue-600 to-indigo-600",
  variant: "game",
  body: [
    { type: "p", text: { vi: "Nhập nội dung đoạn mở đầu tại đây...", en: "Enter intro paragraph here..." } },
    { type: "h2", text: { vi: "1. Tổng quan chiến lược", en: "1. Strategic Overview" } },
    { type: "p", text: { vi: "Nội dung phân tích chi tiết cho phần 1...", en: "Detailed analysis for section 1..." } },
  ],
};

const availableTags = [
  "Marketing Game", "LiveOps", "ASO Mobile", "KOL Gaming", "CPI Optimization", 
  "ROAS", "Cộng đồng Discord", "TikTok Game Ads", "Google UAC", "Bản địa hóa Game"
];

export default function WordPressPostEditor({ initialPost, locale, onSave, onCancel }: WordPressPostEditorProps) {
  const [post, setPost] = useState<Post>(initialPost || { ...emptyPost, slug: `bai-viet-moi-${Date.now()}` });
  const [activeLang, setActiveLang] = useState<"vi" | "en">("vi");
  const [editorMode, setEditorMode] = useState<"visual" | "preview">("visual");
  const [categoryTab, setCategoryTab] = useState<"all" | "most_used">("all");
  const [showMediaModal, setShowMediaModal] = useState<number | "cover" | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Marketing Game", "LiveOps"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setPost({
      ...post,
      title: { ...post.title, [activeLang]: val },
      slug: !initialPost && activeLang === "vi" ? val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") : post.slug,
    });
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !selectedTags.includes(newTagInput.trim())) {
      setSelectedTags([...selectedTags, newTagInput.trim()]);
      setNewTagInput("");
    }
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // AI Content Helpers
  const handleAiGenerateTitles = () => {
    const titlesVi = [
      "Chiến Lược Tối Ưu CPI và ROAS Game Mobile 2026: 5 Bước Bứt Phá Doanh Thu",
      "Kế Hoạch Ra Mắt Game Tại Việt Nam: Khung Vận Hành Toàn Diện Từ A-Z",
      "Bí Quyết Chọn KOL & KOC Gaming Đúng Chuẩn: Tránh Bẫy View Ảo và Tối Ưu Ngân Sách",
    ];
    const picked = titlesVi[Math.floor(Math.random() * titlesVi.length)];
    setPost({ ...post, title: { ...post.title, [activeLang]: picked } });
    setAiNotice(`Đã áp dụng tiêu đề chuẩn SEO Viral: "${picked}"`);
    setTimeout(() => setAiNotice(null), 4000);
  };

  const handleAiGenerateSummary = () => {
    const summary = activeLang === "vi"
      ? `Phân tích chuyên sâu chiến lược ${post.category.vi.toLowerCase()} cho các studio game. Cung cấp khung đo lường thực chiến, tối ưu chi phí và tăng trưởng bền vững.`
      : `In-depth analysis of ${post.category.en.toLowerCase()} strategies for game studios. Providing actionable frameworks for measurable growth.`;
    setPost({ ...post, excerpt: { ...post.excerpt, [activeLang]: summary } });
    setAiNotice("Đã tự động tạo tóm tắt Meta Description chuẩn độ dài SEO!");
    setTimeout(() => setAiNotice(null), 4000);
  };

  const handleAiAddFaqBlock = () => {
    const newBody = [
      ...post.body,
      { type: "h2" as const, text: { vi: "Câu hỏi thường gặp (FAQ)", en: "Frequently Asked Questions (FAQ)" } },
      {
        type: "p" as const,
        text: {
          vi: "Q: Chi phí tối ưu CPI cho game mobile trung bình là bao nhiêu?\nA: Chi phí biến thiên tùy theo thể loại game (Casual, Mid-core hoặc Hardcore) và chất lượng tệp người chơi tiếp cận.",
          en: "Q: What is the average CPI for mobile games?\nA: Costs vary based on the game genre (Casual, Mid-core, or Hardcore) and target audience engagement.",
        },
      },
    ];
    setPost({ ...post, body: newBody });
    setAiNotice("Đã thêm khối FAQ (Câu hỏi thường gặp) để tối ưu Google Rich Snippets!");
    setTimeout(() => setAiNotice(null), 4000);
  };

  const updateBlock = (index: number, text: string) => {
    const updated = [...post.body];
    const block = updated[index];
    if (block.type === "p" || block.type === "h2" || block.type === "quote") {
      block.text[activeLang] = text;
    }
    setPost({ ...post, body: updated });
  };

  const updateListItem = (blockIndex: number, itemIndex: number, text: string) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block.type === "ul") {
      block.items[itemIndex][activeLang] = text;
      setPost({ ...post, body: updated });
    }
  };

  const addListItem = (blockIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block.type === "ul") {
      block.items.push({ vi: "Mục danh sách mới...", en: "New item..." });
      setPost({ ...post, body: updated });
    }
  };

  const removeListItem = (blockIndex: number, itemIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block.type === "ul") {
      block.items.splice(itemIndex, 1);
      setPost({ ...post, body: updated });
    }
  };

  const addBlock = (type: "p" | "h2" | "quote" | "ul" | "image") => {
    const updated = [...post.body];
    if (type === "p") {
      updated.push({ type: "p", text: { vi: "Nhập nội dung đoạn văn mới...", en: "New paragraph content..." } });
    } else if (type === "h2") {
      updated.push({ type: "h2", text: { vi: "Tiêu đề mục mới (Heading 2)", en: "New section title (Heading 2)" } });
    } else if (type === "quote") {
      updated.push({ type: "quote", text: { vi: "Trích dẫn số liệu hoặc nhận định chuyên gia...", en: "Key expert quote..." } });
    } else if (type === "ul") {
      updated.push({
        type: "ul",
        items: [
          { vi: "Điểm nổi bật 1...", en: "Highlight item 1..." },
          { vi: "Điểm nổi bật 2...", en: "Highlight item 2..." },
        ],
      });
    } else if (type === "image") {
      updated.push({
        type: "image",
        src: "/blog-covers/performance-ad-campaigns.jpg",
        alt: { vi: "Mô tả hình ảnh", en: "Image description" },
        caption: { vi: "Chú thích hình ảnh", en: "Image caption" },
      });
    }
    setPost({ ...post, body: updated });
  };

  const removeBlock = (index: number) => {
    if (post.body.length <= 1) return;
    const updated = [...post.body];
    updated.splice(index, 1);
    setPost({ ...post, body: updated });
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === post.body.length - 1) return;
    const updated = [...post.body];
    const target = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setPost({ ...post, body: updated });
  };

  const handleSave = () => {
    if (!post.title.vi.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết!");
      return;
    }
    const cleanSlug = (post.slug || post.title.vi || "bai-viet-moi")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const finalPost: Post = {
      ...post,
      slug: cleanSlug,
      readingTime,
    };
    onSave(finalPost);
  };

  const copyPostCode = () => {
    const code = JSON.stringify({ ...post, readingTime }, null, 2);
    navigator.clipboard.writeText(code).then(() => {
      setAiNotice("Đã sao chép toàn bộ mã JSON của bài viết vào Clipboard!");
      setTimeout(() => setAiNotice(null), 3000);
    });
  };

  const totalWords = post.body.reduce((acc, b) => {
    if (b.type === "p" || b.type === "h2" || b.type === "quote") {
      return acc + (b.text[activeLang] || "").split(/\s+/).filter(Boolean).length;
    }
    if (b.type === "ul") {
      return acc + b.items.reduce((s, it) => s + (it[activeLang] || "").split(/\s+/).filter(Boolean).length, 0);
    }
    return acc;
  }, 0);

  const readingTime = Math.max(1, Math.ceil(totalWords / 180));

  return (
    <div className="space-y-4 text-slate-800">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">
            {initialPost ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </h1>
          <p className="text-xs text-[#646970]">
            Trình soạn thảo Classic Editor WordPress tích hợp Rank Math SEO PRO & Trợ lý AI
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyPostCode}
            className="rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-sm hover:bg-[#f6f7f7]"
          >
            📋 Sao chép JSON
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-sm hover:bg-[#f6f7f7]"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-[#2271b1] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition"
          >
            {initialPost ? "Cập nhật bài viết" : "Đăng bài viết (Publish)"}
          </button>
        </div>
      </div>

      {aiNotice && (
        <div className="rounded border-l-4 border-[#2271b1] bg-white p-3 shadow-sm text-xs font-bold text-[#135e96]">
          ⚡ {aiNotice}
        </div>
      )}

      {/* Main 2-Column WordPress Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* LEFT COLUMN: Main Post Editor (70% ~ 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Post Title Input Box */}
          <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm space-y-3">
            <div>
              <input
                type="text"
                value={post.title[activeLang] || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Nhập tiêu đề bài viết tại đây..."
                className="w-full border-b border-[#ccd0d4] pb-2 font-display text-xl font-bold text-[#1d2327] placeholder:text-[#8c8f94] outline-none focus:border-[#2271b1]"
              />
            </div>

            {/* Permalink Slug Preview & Edit */}
            <div className="flex items-center gap-2 text-xs text-[#646970] font-mono">
              <span>Đường dẫn tĩnh (Permalink):</span>
              <span className="text-[#2271b1]">https://anbu.asia/{locale}/blog/</span>
              <input
                type="text"
                value={post.slug}
                onChange={(e) => setPost({ ...post, slug: e.target.value })}
                className="rounded border border-[#ccd0d4] bg-[#f6f7f7] px-2 py-0.5 text-xs text-[#2c3338] outline-none"
              />
            </div>
          </div>

          {/* AI Content & SEO Copilot Bar */}
          <div className="rounded border border-[#ccd0d4] bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-3 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#1d2327]">
              <span>⚡ Trợ lý AI Copilot:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleAiGenerateTitles}
                className="rounded border border-[#2271b1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-blue-50 transition"
              >
                💡 Gợi ý Tiêu đề Viral
              </button>
              <button
                type="button"
                onClick={handleAiGenerateSummary}
                className="rounded border border-[#2271b1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-blue-50 transition"
              >
                📝 Tạo Tóm tắt Meta
              </button>
              <button
                type="button"
                onClick={handleAiAddFaqBlock}
                className="rounded border border-indigo-600 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-50 transition"
              >
                ❓ Thêm khối FAQ Schema
              </button>
            </div>
          </div>

          {/* Language Switcher & Editor Mode Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#50575e]">Ngôn ngữ bài viết:</span>
              <div className="flex rounded border border-[#ccd0d4] bg-white p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveLang("vi")}
                  className={`rounded px-2.5 py-0.5 font-bold transition ${
                    activeLang === "vi" ? "bg-[#2271b1] text-white shadow-sm" : "text-[#50575e] hover:text-black"
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang("en")}
                  className={`rounded px-2.5 py-0.5 font-bold transition ${
                    activeLang === "en" ? "bg-[#2271b1] text-white shadow-sm" : "text-[#50575e] hover:text-black"
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>

            {/* Visual / Text Tabs */}
            <div className="flex gap-0.5 text-xs">
              <button
                type="button"
                onClick={() => setEditorMode("visual")}
                className={`border border-b-0 px-3 py-1 font-semibold rounded-t ${
                  editorMode === "visual"
                    ? "border-[#ccd0d4] bg-white text-[#2c3338]"
                    : "border-transparent bg-[#f0f0f1] text-[#646970] hover:bg-[#f6f7f7]"
                }`}
              >
                Trực quan (Visual)
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("preview")}
                className={`border border-b-0 px-3 py-1 font-semibold rounded-t ${
                  editorMode === "preview"
                    ? "border-[#ccd0d4] bg-white text-[#2c3338]"
                    : "border-transparent bg-[#f0f0f1] text-[#646970] hover:bg-[#f6f7f7]"
                }`}
              >
                Xem trước (Preview)
              </button>
            </div>
          </div>

          {/* EDITOR BODY CONTAINER */}
          {editorMode === "visual" ? (
            <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
              {/* Classic TinyMCE Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 border-b border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs text-[#2c3338] select-none">
                <div className="flex items-center gap-0.5 border-r border-[#c3c4c7] pr-1.5 mr-1">
                  <button type="button" onClick={() => addBlock("p")} className="h-6 w-6 rounded border border-transparent font-bold hover:bg-white hover:border-[#c3c4c7]" title="Paragraph">¶</button>
                  <button type="button" onClick={() => addBlock("h2")} className="h-6 w-6 rounded border border-transparent font-bold hover:bg-white hover:border-[#c3c4c7]" title="Heading 2">H2</button>
                </div>
                <div className="flex items-center gap-0.5 border-r border-[#c3c4c7] pr-1.5 mr-1">
                  <span className="flex h-6 w-6 items-center justify-center font-bold hover:bg-white rounded cursor-pointer" title="Bold">B</span>
                  <span className="flex h-6 w-6 items-center justify-center italic font-bold hover:bg-white rounded cursor-pointer" title="Italic">I</span>
                  <span className="flex h-6 w-6 items-center justify-center line-through hover:bg-white rounded cursor-pointer" title="Strikethrough">S</span>
                </div>
                <div className="flex items-center gap-0.5 border-r border-[#c3c4c7] pr-1.5 mr-1">
                  <span onClick={() => addBlock("ul")} className="flex h-6 w-6 items-center justify-center hover:bg-white rounded cursor-pointer" title="Bulleted List">•≡</span>
                  <span onClick={() => addBlock("quote")} className="flex h-6 w-6 items-center justify-center hover:bg-white rounded cursor-pointer" title="Blockquote">“</span>
                </div>
                <div className="flex items-center gap-0.5 border-r border-[#c3c4c7] pr-1.5 mr-1">
                  <span className="flex h-6 w-6 items-center justify-center hover:bg-white rounded cursor-pointer" title="Align Left">≡</span>
                  <span className="flex h-6 w-6 items-center justify-center hover:bg-white rounded cursor-pointer" title="Align Center">≍</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <span onClick={() => setShowMediaModal(0)} className="flex h-6 px-1.5 items-center justify-center hover:bg-white rounded cursor-pointer text-[11px] font-semibold text-[#2271b1]" title="Insert Media">🖼️ Ảnh</span>
                </div>
              </div>

              {/* Editor Workspace Canvas */}
              <div className="min-h-[420px] p-5 space-y-4">
                {post.body.map((block, index) => (
                  <div
                    key={index}
                    className="group relative rounded border border-transparent hover:border-[#c3c4c7] p-2 transition hover:bg-[#fafafa]"
                  >
                    {/* Block Action Floating Bar on hover */}
                    <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1 bg-white border border-[#ccd0d4] rounded shadow-sm px-1.5 py-0.5 text-[10px] z-10">
                      <span className="font-bold text-[#646970] mr-1 uppercase">#{index + 1} {block.type}</span>
                      <button type="button" onClick={() => moveBlock(index, "up")} disabled={index === 0} className="px-1 text-slate-500 hover:text-black disabled:opacity-30">▲</button>
                      <button type="button" onClick={() => moveBlock(index, "down")} disabled={index === post.body.length - 1} className="px-1 text-slate-500 hover:text-black disabled:opacity-30">▼</button>
                      <button type="button" onClick={() => removeBlock(index)} className="px-1 font-bold text-rose-600 hover:text-rose-800">✕</button>
                    </div>

                    {block.type === "h2" && (
                      <div>
                        <span className="block text-[10px] font-bold text-[#2271b1] uppercase mb-1">Tiêu đề H2</span>
                        <input
                          type="text"
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlock(index, e.target.value)}
                          placeholder="Nhập tiêu đề H2..."
                          className="w-full font-display text-lg font-bold text-[#1d2327] outline-none border-b border-dashed border-[#ccd0d4] pb-1"
                        />
                      </div>
                    )}

                    {block.type === "p" && (
                      <div>
                        <span className="block text-[10px] font-bold text-[#646970] uppercase mb-1">Đoạn văn (Paragraph)</span>
                        <textarea
                          rows={3}
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlock(index, e.target.value)}
                          placeholder="Nhập nội dung đoạn văn..."
                          className="w-full resize-y text-xs leading-relaxed text-[#2c3338] outline-none border-b border-dashed border-[#ccd0d4]"
                        />
                      </div>
                    )}

                    {block.type === "quote" && (
                      <div className="border-l-4 border-[#2271b1] bg-blue-50/30 p-3 rounded">
                        <span className="block text-[10px] font-bold text-[#2271b1] uppercase mb-1">Trích dẫn (Quote)</span>
                        <textarea
                          rows={2}
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlock(index, e.target.value)}
                          placeholder="Nhập nội dung trích dẫn..."
                          className="w-full resize-y italic text-xs leading-relaxed text-[#2c3338] outline-none bg-transparent"
                        />
                      </div>
                    )}

                    {block.type === "ul" && (
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-[#646970] uppercase">Danh sách gạch đầu dòng</span>
                        <div className="space-y-1.5 pl-2">
                          {block.items.map((it, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-2">
                              <span className="text-[#2271b1] font-bold">•</span>
                              <input
                                type="text"
                                value={it[activeLang] || ""}
                                onChange={(e) => updateListItem(index, itemIdx, e.target.value)}
                                className="flex-1 rounded border border-[#ccd0d4] p-1 text-xs text-[#2c3338] outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => removeListItem(index, itemIdx)}
                                className="text-slate-400 hover:text-rose-600 text-xs px-1"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addListItem(index)}
                          className="text-[11px] text-[#2271b1] hover:underline font-semibold pl-4"
                        >
                          + Thêm mục danh sách
                        </button>
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#2271b1] uppercase">Hình ảnh minh họa</span>
                          <button
                            type="button"
                            onClick={() => setShowMediaModal(index)}
                            className="text-[11px] text-[#2271b1] hover:underline font-semibold"
                          >
                            Đổi ảnh từ thư viện ↗
                          </button>
                        </div>
                        <div className="relative aspect-video max-h-48 overflow-hidden rounded border border-[#ccd0d4] bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={block.src} alt={block.alt[activeLang]} className="h-full w-full object-cover" />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                          <div>
                            <label className="block text-[10px] font-bold text-[#50575e]">Thẻ Alt (Mô tả SEO):</label>
                            <input
                              type="text"
                              value={block.alt[activeLang] || ""}
                              onChange={(e) => {
                                const updated = [...post.body];
                                const b = updated[index];
                                if (b.type === "image") {
                                  b.alt[activeLang] = e.target.value;
                                  setPost({ ...post, body: updated });
                                }
                              }}
                              className="w-full rounded border border-[#ccd0d4] bg-white p-1 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-[#50575e]">Chú thích (Caption):</label>
                            <input
                              type="text"
                              value={block.caption ? block.caption[activeLang] : ""}
                              onChange={(e) => {
                                const updated = [...post.body];
                                const b = updated[index];
                                if (b.type === "image") {
                                  if (!b.caption) b.caption = { vi: "", en: "" };
                                  b.caption[activeLang] = e.target.value;
                                  setPost({ ...post, body: updated });
                                }
                              }}
                              className="w-full rounded border border-[#ccd0d4] bg-white p-1 text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Add Block Bar at Bottom */}
              <div className="flex flex-wrap items-center justify-between border-t border-[#ccd0d4] bg-[#f6f7f7] px-4 py-2 text-xs text-[#646970]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1d2327]">Chèn thêm khối:</span>
                  <button type="button" onClick={() => addBlock("p")} className="rounded border border-[#c3c4c7] bg-white px-2 py-0.5 hover:bg-[#f0f0f1] font-semibold text-[#2c3338]">+ Đoạn văn</button>
                  <button type="button" onClick={() => addBlock("h2")} className="rounded border border-[#c3c4c7] bg-white px-2 py-0.5 hover:bg-[#f0f0f1] font-semibold text-[#2c3338]">+ Tiêu đề H2</button>
                  <button type="button" onClick={() => addBlock("ul")} className="rounded border border-[#c3c4c7] bg-white px-2 py-0.5 hover:bg-[#f0f0f1] font-semibold text-[#2c3338]">+ Danh sách</button>
                  <button type="button" onClick={() => addBlock("quote")} className="rounded border border-[#c3c4c7] bg-white px-2 py-0.5 hover:bg-[#f0f0f1] font-semibold text-[#2c3338]">+ Trích dẫn</button>
                  <button type="button" onClick={() => addBlock("image")} className="rounded border border-[#2271b1] bg-white px-2 py-0.5 hover:bg-blue-50 font-bold text-[#2271b1]">+ Hình ảnh</button>
                </div>
                <div>
                  Tổng cộng: <strong className="text-[#1d2327]">{totalWords}</strong> từ • <strong className="text-[#1d2327]">{readingTime}</strong> phút đọc
                </div>
              </div>
            </div>
          ) : (
            /* Live Preview Canvas */
            <div className="rounded border border-[#ccd0d4] bg-white p-8 shadow-sm">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#f5501e]">
                {post.category[activeLang]} • {post.date} • {readingTime} phút đọc
              </div>
              <h2 className="font-display text-3xl font-bold text-[#1d2327]">{post.title[activeLang]}</h2>
              <p className="mt-3 text-base leading-relaxed text-[#50575e] border-b border-[#eee] pb-5">
                {post.excerpt[activeLang]}
              </p>

              <div className="mt-6 space-y-4">
                {post.body.map((b, i) => {
                  if (b.type === "h2") return <h3 key={i} className="font-display text-xl font-bold text-[#1d2327] mt-6">{b.text[activeLang]}</h3>;
                  if (b.type === "p") return <p key={i} className="text-sm leading-relaxed text-[#2c3338]">{b.text[activeLang]}</p>;
                  if (b.type === "quote") return <blockquote key={i} className="border-l-4 border-[#f5501e] bg-orange-50/40 p-3 italic text-sm text-[#2c3338]">{b.text[activeLang]}</blockquote>;
                  if (b.type === "ul") return (
                    <ul key={i} className="space-y-1.5 pl-4 list-disc text-sm text-[#2c3338]">
                      {b.items.map((it, iIdx) => <li key={iIdx}>{it[activeLang]}</li>)}
                    </ul>
                  );
                  if (b.type === "image") return (
                    <figure key={i} className="my-4 overflow-hidden rounded border border-[#eee] bg-[#fafafa]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.src} alt={b.alt[activeLang]} className="w-full max-h-[420px] object-cover" />
                      {b.caption && <figcaption className="p-2 text-center text-xs text-[#646970]">{b.caption[activeLang]}</figcaption>}
                    </figure>
                  );
                  return null;
                })}
              </div>
            </div>
          )}

          {/* CLASSIC WORDPRESS METABOX: Excerpt */}
          <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#ccd0d4] bg-[#f6f7f7] px-4 py-2 text-xs font-bold text-[#1d2327]">
              <span>Đoạn trích (Excerpt)</span>
              <span>▾</span>
            </div>
            <div className="p-4">
              <textarea
                rows={2}
                value={post.excerpt[activeLang] || ""}
                onChange={(e) => setPost({ ...post, excerpt: { ...post.excerpt, [activeLang]: e.target.value } })}
                placeholder="Đoạn trích ngắn gọn mô tả bài viết..."
                className="w-full rounded border border-[#ccd0d4] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
              />
              <p className="mt-1 text-[11px] text-[#646970]">
                Đoạn trích là các phần tóm tắt thủ công được tạo ra cho bài viết của bạn để sử dụng trên trang chuyên mục và kết quả tìm kiếm.
              </p>
            </div>
          </div>

          {/* RANK MATH SEO PLUGIN METABOX (PRO) */}
          <RankMathSEO
            post={post}
            lang={activeLang}
            onUpdateSnippet={(field, value) => {
              if (field === "title") setPost({ ...post, title: { ...post.title, [activeLang]: value } });
              if (field === "excerpt") setPost({ ...post, excerpt: { ...post.excerpt, [activeLang]: value } });
              if (field === "slug") setPost({ ...post, slug: value });
            }}
          />
        </div>

        {/* RIGHT COLUMN: WordPress Metabox Sidebar (30% ~ 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. PUBLISH METABOX */}
          <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
            <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 text-xs font-bold text-[#1d2327]">
              Đăng bài viết (Publish)
            </div>
            <div className="p-3.5 space-y-3 text-xs text-[#646970]">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert("Đã lưu bản nháp thành công!")}
                  className="rounded border border-[#c3c4c7] bg-[#f6f7f7] px-3 py-1 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
                >
                  Lưu bản nháp
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode(editorMode === "preview" ? "visual" : "preview")}
                  className="rounded border border-[#c3c4c7] bg-[#f6f7f7] px-3 py-1 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
                >
                  Xem thử (Preview)
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>🔑 Trạng thái: <strong className="text-[#1d2327]">Đã xuất bản</strong></span>
                  <button type="button" className="text-[#2271b1] underline">Chỉnh sửa</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>👁️ Hiển thị: <strong className="text-[#1d2327]">Công khai</strong></span>
                  <button type="button" className="text-[#2271b1] underline">Chỉnh sửa</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>📅 Đăng: <strong className="text-[#1d2327]">{post.date}</strong></span>
                  <button type="button" className="text-[#2271b1] underline">Chỉnh sửa</button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#ccd0d4] bg-[#f6f7f7] -mx-3.5 -mb-3.5 p-3.5 rounded-b">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs text-[#d63638] hover:underline"
                >
                  Bỏ vào thùng rác
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded bg-[#2271b1] px-4 py-1.5 font-bold text-white shadow-sm hover:bg-[#135e96] transition"
                >
                  Cập nhật (Publish)
                </button>
              </div>
            </div>
          </div>

          {/* 2. CATEGORIES METABOX */}
          <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
            <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 text-xs font-bold text-[#1d2327]">
              Chuyên mục (Categories)
            </div>
            <div className="p-3.5">
              <div className="flex border-b border-[#ccd0d4] text-xs pb-1 mb-2">
                <button
                  type="button"
                  onClick={() => setCategoryTab("all")}
                  className={`px-2 py-0.5 font-semibold ${categoryTab === "all" ? "text-[#1d2327] border-b-2 border-[#2271b1] font-bold" : "text-[#646970]"}`}
                >
                  Tất cả chuyên mục
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryTab("most_used")}
                  className={`px-2 py-0.5 font-semibold ${categoryTab === "most_used" ? "text-[#1d2327] border-b-2 border-[#2271b1] font-bold" : "text-[#646970]"}`}
                >
                  Hay dùng nhất
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5 border border-[#ccd0d4] p-2.5 rounded bg-white text-xs text-[#2c3338]">
                {blogCategories.map((c) => (
                  <label key={c.slug} className="flex items-center gap-2 cursor-pointer hover:bg-[#f6f7f7] p-1 rounded">
                    <input
                      type="radio"
                      name="wp_category"
                      checked={post.category.vi === c.vi}
                      onChange={() => setPost({ ...post, category: { vi: c.vi, en: c.en } })}
                      className="text-[#2271b1]"
                    />
                    <span>{c.vi}</span>
                  </label>
                ))}
              </div>

              <button
                type="button"
                className="mt-2 text-xs text-[#2271b1] underline font-medium"
              >
                + Thêm chuyên mục mới
              </button>
            </div>
          </div>

          {/* 3. TAGS METABOX (Thẻ bài viết) */}
          <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
            <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 text-xs font-bold text-[#1d2327]">
              Thẻ từ khóa (Tags)
            </div>
            <div className="p-3.5 space-y-2.5 text-xs text-[#2c3338]">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Thêm thẻ mới..."
                  className="flex-1 rounded border border-[#8c8f94] p-1 text-xs outline-none focus:border-[#2271b1]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded border border-[#8c8f94] bg-white px-2 py-1 text-xs font-bold text-[#2c3338] hover:bg-[#f0f0f1]"
                >
                  Thêm
                </button>
              </div>

              {/* Selected Tags Pills */}
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded bg-[#f0f6fc] border border-[#c5d9ed] px-2 py-0.5 text-[11px] font-semibold text-[#135e96]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className="text-[#646970] hover:text-rose-600 font-bold ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Popular Tags List */}
              <div className="pt-2 border-t border-[#eee]">
                <span className="text-[10px] font-bold uppercase text-[#646970] block mb-1">Thẻ phổ biến ngành Game:</span>
                <div className="flex flex-wrap gap-1">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[10px] rounded px-1.5 py-0.5 border transition ${
                          isSelected
                            ? "bg-[#2271b1] text-white border-[#2271b1] font-bold"
                            : "bg-[#f6f7f7] text-[#50575e] border-[#ccd0d4] hover:border-[#8c8f94]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 4. AUTHOR METABOX */}
          <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
            <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 text-xs font-bold text-[#1d2327]">
              Tác giả bài viết (Author)
            </div>
            <div className="p-3.5 space-y-2 text-xs">
              <select
                value={post.author || "ANBU Team"}
                onChange={(e) => setPost({ ...post, author: e.target.value })}
                className="w-full rounded border border-[#8c8f94] bg-white p-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
              >
                <option value="ANBU Team">ANBU Team (Mặc định)</option>
                <option value="ANBU Master Admin">ANBU Master Admin</option>
                <option value="Ban Biên Tập ANBU Studio">Ban Biên Tập ANBU Studio</option>
                <option value="Tác giả Game Marketing">Tác giả Game Marketing</option>
                <option value="Nguyễn Hoàng Linh (UA Lead)">Nguyễn Hoàng Linh (UA Lead)</option>
                <option value="ANBU Growth Squad">ANBU Growth Squad</option>
              </select>
              <p className="text-[11px] text-[#646970]">
                Tên tác giả sẽ hiển thị trên bài viết và trong dữ liệu có cấu trúc Schema Author.
              </p>
            </div>
          </div>

          {/* 5. FEATURED IMAGE METABOX */}
          <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
            <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 text-xs font-bold text-[#1d2327]">
              Ảnh đại diện (Featured Image)
            </div>
            <div className="p-3.5 text-xs text-[#646970]">
              <div className="relative aspect-[16/10] overflow-hidden rounded border border-[#ccd0d4] bg-[#f0f0f1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="Cover" className="h-full w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal("cover")}
                className="mt-2 block text-xs text-[#2271b1] underline hover:text-[#135e96]"
              >
                Nhấp vào ảnh để thay đổi hoặc xóa ảnh đại diện
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Selector Modal */}
      {showMediaModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded bg-white p-6 shadow-2xl border border-[#ccd0d4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#ccd0d4]">
              <h3 className="font-display text-base font-bold text-[#1d2327]">Thư viện Media (Chọn hoặc Tải lên Media)</h3>
              <button
                type="button"
                onClick={() => setShowMediaModal(null)}
                className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3">
              <MediaManager
                locale={locale}
                onSelectImage={(src) => {
                  if (showMediaModal === "cover") {
                    setPost({ ...post, cover: src });
                  } else if (typeof showMediaModal === "number") {
                    const updated = [...post.body];
                    const block = updated[showMediaModal];
                    if (block.type === "image") {
                      block.src = src;
                      setPost({ ...post, body: updated });
                    }
                  }
                  setShowMediaModal(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

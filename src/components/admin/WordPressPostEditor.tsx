"use client";

import React, { useState } from "react";
import type { Post, Block } from "@/content/posts";
import { blogCategories } from "@/content/posts";
import MediaManager from "./MediaManager";
import RankMathSEO from "./RankMathSEO";

type WordPressPostEditorProps = {
  initialPost?: Post | null;
  locale: string;
  onSave: (post: Post) => void;
  onCancel: () => void;
};

const defaultEmptyPost: Post = {
  slug: "bai-viet-moi-anbu-game-marketing",
  title: {
    vi: "Tiêu đề bài viết mới về Game Marketing",
    en: "New Game Marketing Strategy Title",
  },
  excerpt: {
    vi: "Tóm tắt ngắn gọn và hấp dẫn về nội dung bài viết để hiển thị trên thẻ Google và mạng xã hội.",
    en: "A concise and compelling summary of the article for search results and social previews.",
  },
  category: {
    vi: "Marketing Game",
    en: "Game Marketing",
  },
  date: new Date().toISOString().split("T")[0],
  readingTime: 5,
  author: "ANBU Team",
  color: "from-navy-900 to-orange-600",
  variant: "performance",
  cover: "/blog-covers/performance-ad-campaigns.jpg",
  sources: [
    {
      label: { vi: "Google Search Central — Helpful Content", en: "Google Search Central — Helpful Content" },
      href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
  ],
  body: [
    {
      type: "p",
      text: {
        vi: "Đoạn mở đầu nêu trực diện vấn đề và giải pháp thực chiến cho các studio và nhà phát hành game tại Việt Nam.",
        en: "Opening paragraph introducing the core operational challenge and proven framework for gaming studios.",
      },
    },
    {
      type: "image",
      src: "/blog-covers/performance-ad-campaigns.jpg",
      alt: {
        vi: "Biểu đồ đo lường hiệu suất chiến dịch quảng cáo game mobile",
        en: "Mobile game performance marketing campaign analytics dashboard",
      },
      caption: {
        vi: "Tối ưu hóa phễu chuyển đổi giúp hạ thấp chi phí CPI và gia tăng LTV.",
        en: "Optimizing the conversion funnel reduces CPI and scales player LTV.",
      },
    },
    {
      type: "h2",
      text: {
        vi: "1. Khung chiến lược triển khai 3 bước",
        en: "1. The 3-Step Execution Framework",
      },
    },
    {
      type: "ul",
      items: [
        { vi: "Bước 1: Nghiên cứu tệp người chơi mục tiêu và thiết lập tracking attribution", en: "Step 1: Deep audience persona research and attribution setup" },
        { vi: "Bước 2: Triển khai kiểm thử sáng tạo A/B Testing trong 48 giờ", en: "Step 2: Rapid 48-hour modular creative testing" },
        { vi: "Bước 3: Tối ưu hóa vòng lặp LiveOps và tỷ lệ giữ chân D30", en: "Step 3: LiveOps retention loop optimization" },
      ],
    },
  ],
};

export default function WordPressPostEditor({ initialPost, locale, onSave, onCancel }: WordPressPostEditorProps) {
  const [post, setPost] = useState<Post>(initialPost ? JSON.parse(JSON.stringify(initialPost)) : defaultEmptyPost);
  const [activeLang, setActiveLang] = useState<"vi" | "en">("vi");
  const [editorMode, setEditorMode] = useState<"visual" | "text" | "preview">("visual");
  const [showMediaModal, setShowMediaModal] = useState<number | "cover" | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const [categoryTab, setCategoryTab] = useState<"all" | "most_used">("all");

  // Word count & reading time
  const calculateStats = () => {
    let wordCount = 0;
    wordCount += (post.title[activeLang] || "").split(/\s+/).filter(Boolean).length;
    wordCount += (post.excerpt[activeLang] || "").split(/\s+/).filter(Boolean).length;
    post.body.forEach((b) => {
      if (b.type === "p" || b.type === "h2" || b.type === "quote") {
        wordCount += (b.text[activeLang] || "").split(/\s+/).filter(Boolean).length;
      } else if (b.type === "ul") {
        b.items.forEach((it) => {
          wordCount += (it[activeLang] || "").split(/\s+/).filter(Boolean).length;
        });
      }
    });
    const readingTime = Math.max(3, Math.ceil(wordCount / 180));
    return { wordCount, readingTime };
  };

  const { wordCount, readingTime } = calculateStats();

  const addBlock = (type: Block["type"]) => {
    let newBlock: Block;
    if (type === "h2") {
      newBlock = { type: "h2", text: { vi: "Tiêu đề mục mới (Heading 2)", en: "New Section Heading" } };
    } else if (type === "quote") {
      newBlock = { type: "quote", text: { vi: "Trích dẫn nhận định chiến lược quan trọng...", en: "Key strategic quote or insight..." } };
    } else if (type === "ul") {
      newBlock = {
        type: "ul",
        items: [
          { vi: "Ý chính thứ nhất của bài viết", en: "First core takeaway" },
          { vi: "Ý chính thứ hai của bài viết", en: "Second core takeaway" },
        ],
      };
    } else if (type === "image") {
      newBlock = {
        type: "image",
        src: "/blog-covers/creative-testing-lab.jpg",
        alt: { vi: "Hình ảnh minh họa thực tế chuẩn SEO", en: "SEO-optimized practitioner image" },
        caption: { vi: "Chú thích giải thích biểu đồ và quy trình.", en: "Analytical caption explaining the chart." },
      };
    } else {
      newBlock = { type: "p", text: { vi: "Nội dung đoạn văn mới...", en: "New paragraph content..." } };
    }

    setPost({ ...post, body: [...post.body, newBlock] });
  };

  const removeBlock = (index: number) => {
    const updated = [...post.body];
    updated.splice(index, 1);
    setPost({ ...post, body: updated });
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === post.body.length - 1)) return;
    const updated = [...post.body];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPost({ ...post, body: updated });
  };

  const updateBlockText = (index: number, field: "text" | "alt" | "caption", value: string) => {
    const updated = [...post.body];
    const block = updated[index] as any;
    if (!block[field]) block[field] = { vi: "", en: "" };
    block[field][activeLang] = value;
    setPost({ ...post, body: updated });
  };

  const updateListItem = (blockIndex: number, itemIndex: number, value: string) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block.type === "ul") {
      block.items[itemIndex][activeLang] = value;
      setPost({ ...post, body: updated });
    }
  };

  const addListItem = (blockIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block.type === "ul") {
      block.items.push({ vi: "Nội dung gạch đầu dòng mới", en: "New bullet point item" });
      setPost({ ...post, body: updated });
    }
  };

  const removeListItem = (blockIndex: number, itemIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block.type === "ul" && block.items.length > 1) {
      block.items.splice(itemIndex, 1);
      setPost({ ...post, body: updated });
    }
  };

  const handleSave = () => {
    const finalPost = { ...post, readingTime };
    onSave(finalPost);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="text-slate-800">
      {/* WordPress Page Title & Screen Options */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">
            {initialPost ? "Chỉnh sửa bài viết" : "Viết bài mới"}
          </h1>
          <button
            onClick={onCancel}
            className="rounded border border-[#2271b1] bg-white px-2.5 py-1 text-xs font-semibold text-[#2271b1] hover:bg-[#f0f6fc]"
          >
            Quay lại
          </button>
        </div>

        {/* Top Right Help / Screen Options */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-[#646970]">
          <div className="flex rounded border border-[#c3c4c7] bg-white px-2 py-0.5">
            Tùy chọn hiển thị ▾
          </div>
          <div className="flex rounded border border-[#c3c4c7] bg-white px-2 py-0.5">
            Trợ giúp ▾
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="mb-4 rounded border-l-4 border-emerald-500 bg-white p-3 shadow-sm text-xs font-bold text-emerald-800 flex items-center justify-between">
          <span>✓ Bài viết đã được lưu thành công vào hệ thống ANBU.</span>
          <span className="text-slate-400 font-normal">Vừa xong</span>
        </div>
      )}

      {/* Main Grid: Left Editor (col-span-8 or 9), Right MetaBoxes (col-span-4 or 3) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* LEFT COLUMN: Post Title, Add Media, Visual Editor Canvas, Excerpt, Rank Math */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5">
          {/* Title Box */}
          <div className="bg-white">
            <input
              type="text"
              value={post.title[activeLang] || ""}
              onChange={(e) => setPost({ ...post, title: { ...post.title, [activeLang]: e.target.value } })}
              placeholder="Nhập tiêu đề tại đây (Enter title here)"
              className="w-full rounded border border-[#ccd0d4] bg-white px-3.5 py-2 text-xl font-normal text-[#2c3338] shadow-inner outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
            />
            {/* Permalink */}
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#646970]">
              <span>Liên kết tĩnh:</span>
              <span className="font-mono text-[#2271b1] underline">https://anbu.asia/{activeLang}/blog/{post.slug}</span>
              <button
                type="button"
                onClick={() => {
                  const newSlug = prompt("Chỉnh sửa slug bài viết:", post.slug);
                  if (newSlug) setPost({ ...post, slug: newSlug.trim() });
                }}
                className="rounded border border-[#c3c4c7] bg-[#f6f7f7] px-1.5 py-0.5 text-[11px] font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>

          {/* Language Tabs & Add Media Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ccd0d4] pb-2">
            <div className="flex items-center gap-2">
              {/* Add Media Button (Classic WordPress Style) */}
              <button
                type="button"
                onClick={() => setShowMediaModal(post.body.length > 0 ? 0 : "cover")}
                className="flex items-center gap-1.5 rounded border border-[#c3c4c7] bg-[#f6f7f7] px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-sm hover:bg-[#f0f0f1] hover:border-[#a7aaad] active:bg-[#f0f0f1]"
              >
                <span className="text-sm">📷</span>
                <span>Thêm Media (Add Media)</span>
              </button>

              {/* Block Action Quick Inserters */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => addBlock("p")}
                  className="rounded border border-[#c3c4c7] bg-white px-2 py-1 text-xs text-[#2c3338] hover:bg-[#f6f7f7]"
                >
                  + Đoạn văn
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("h2")}
                  className="rounded border border-[#c3c4c7] bg-white px-2 py-1 text-xs font-bold text-[#2c3338] hover:bg-[#f6f7f7]"
                >
                  + Tiêu đề H2
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("image")}
                  className="rounded border border-[#2271b1] bg-[#f0f6fc] px-2 py-1 text-xs font-bold text-[#2271b1] hover:bg-[#e0f0ff]"
                >
                  + Ảnh minh họa
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("ul")}
                  className="rounded border border-[#c3c4c7] bg-white px-2 py-1 text-xs text-[#2c3338] hover:bg-[#f6f7f7]"
                >
                  + Danh sách
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("quote")}
                  className="rounded border border-[#c3c4c7] bg-white px-2 py-1 text-xs text-[#2c3338] hover:bg-[#f6f7f7]"
                >
                  + Trích dẫn
                </button>
              </div>
            </div>

            {/* Right: Bilingual Selector & Visual/Text Tabs */}
            <div className="flex items-center gap-3">
              {/* Bilingual Tab */}
              <div className="flex rounded border border-[#c3c4c7] bg-[#f6f7f7] p-0.5 text-xs">
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
                      <button type="button" onClick={() => removeBlock(index)} className="px-1 text-rose-600 hover:text-rose-800 font-bold">✕</button>
                    </div>

                    {/* Block Content Inputs */}
                    {block.type === "p" && (
                      <textarea
                        rows={3}
                        value={block.text[activeLang] || ""}
                        onChange={(e) => updateBlockText(index, "text", e.target.value)}
                        placeholder={`Đoạn văn (${activeLang.toUpperCase()})...`}
                        className="w-full resize-y border-0 bg-transparent p-1 text-sm leading-relaxed text-[#2c3338] outline-none placeholder:text-slate-300 focus:bg-white focus:ring-1 focus:ring-[#2271b1]"
                      />
                    )}

                    {block.type === "h2" && (
                      <input
                        type="text"
                        value={block.text[activeLang] || ""}
                        onChange={(e) => updateBlockText(index, "text", e.target.value)}
                        placeholder={`Tiêu đề H2 (${activeLang.toUpperCase()})...`}
                        className="w-full border-0 bg-transparent p-1 font-display text-lg font-bold text-[#1d2327] outline-none placeholder:text-slate-300 focus:bg-white focus:ring-1 focus:ring-[#2271b1]"
                      />
                    )}

                    {block.type === "quote" && (
                      <textarea
                        rows={2}
                        value={block.text[activeLang] || ""}
                        onChange={(e) => updateBlockText(index, "text", e.target.value)}
                        placeholder={`Trích dẫn (${activeLang.toUpperCase()})...`}
                        className="w-full resize-y border-l-4 border-[#f5501e] bg-orange-50/30 p-2.5 text-sm italic text-[#2c3338] outline-none"
                      />
                    )}

                    {block.type === "ul" && (
                      <div className="space-y-1.5 pl-2">
                        {block.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#f5501e] shrink-0" />
                            <input
                              type="text"
                              value={item[activeLang] || ""}
                              onChange={(e) => updateListItem(index, iIdx, e.target.value)}
                              placeholder={`Ý gạch đầu dòng #${iIdx + 1}...`}
                              className="flex-1 border-b border-[#ddd] bg-transparent py-1 text-sm text-[#2c3338] outline-none focus:border-[#2271b1]"
                            />
                            <button
                              type="button"
                              onClick={() => removeListItem(index, iIdx)}
                              className="text-slate-400 hover:text-rose-600 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addListItem(index)}
                          className="mt-1 text-xs font-bold text-[#2271b1] hover:underline"
                        >
                          + Thêm dòng
                        </button>
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-3">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                          <div className="sm:col-span-4">
                            <div className="relative aspect-[16/10] overflow-hidden rounded border border-[#ccd0d4] bg-white">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={block.src} alt="" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setShowMediaModal(index)}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-bold text-white opacity-0 transition hover:opacity-100"
                              >
                                🔄 Đổi ảnh
                              </button>
                            </div>
                            <p className="mt-1 font-mono text-[10px] text-[#646970] truncate">{block.src}</p>
                          </div>

                          <div className="space-y-2.5 sm:col-span-8">
                            <div>
                              <label className="text-[11px] font-bold uppercase text-[#50575e]">Thẻ Alt (SEO Image Description)</label>
                              <input
                                type="text"
                                value={block.alt?.[activeLang] || ""}
                                onChange={(e) => updateBlockText(index, "alt", e.target.value)}
                                placeholder="Mô tả bức ảnh chứa từ khóa..."
                                className="mt-1 w-full rounded border border-[#ccd0d4] bg-white px-2.5 py-1 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold uppercase text-[#50575e]">Chú thích (Caption)</label>
                              <input
                                type="text"
                                value={block.caption?.[activeLang] || ""}
                                onChange={(e) => updateBlockText(index, "caption", e.target.value)}
                                placeholder="Chú thích hiển thị dưới ảnh..."
                                className="mt-1 w-full rounded border border-[#ccd0d4] bg-white px-2.5 py-1 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Status Bar at Bottom of TinyMCE */}
              <div className="flex items-center justify-between border-t border-[#ccd0d4] bg-[#f6f7f7] px-4 py-1.5 text-xs text-[#646970]">
                <span>Đường dẫn: <strong>p &gt; article</strong></span>
                <span>Số từ (Word count): <strong className="text-[#1d2327]">{wordCount}</strong></span>
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

        {/* RIGHT COLUMN: Classic WordPress Meta Boxes */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          {/* 1. PUBLISH METABOX */}
          <div className="rounded border border-[#ccd0d4] bg-white shadow-sm">
            <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 text-xs font-bold text-[#1d2327]">
              Đăng bài (Publish)
            </div>
            <div className="p-3.5 space-y-3 text-xs text-[#646970]">
              <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2.5">
                <button
                  type="button"
                  onClick={handleSave}
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

          {/* 3. AUTHOR METABOX */}
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

          {/* 4. FEATURED IMAGE METABOX */}
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

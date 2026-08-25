"use client";

import React, { useState } from "react";
import type { Post, Block } from "@/content/posts";
import { blogCategories } from "@/content/posts";
import Icon from "@/components/Icon";
import MediaManager from "./MediaManager";

type PostEditorProps = {
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
      label: { vi: "Google Search Central, Helpful Content", en: "Google Search Central, Helpful Content" },
      href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
  ],
  body: [
    {
      type: "p",
      text: {
        vi: "Đoạn mở đầu nêu trực diện vấn đề và giải pháp thực chiến cho các studio và nhà phát hành game.",
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

export default function PostEditor({ initialPost, locale, onSave, onCancel }: PostEditorProps) {
  const [post, setPost] = useState<Post>(initialPost ? JSON.parse(JSON.stringify(initialPost)) : defaultEmptyPost);
  const [activeLang, setActiveLang] = useState<"vi" | "en">("vi");
  const [activeView, setActiveView] = useState<"editor" | "preview" | "code">("editor");
  const [showMediaModal, setShowMediaModal] = useState<number | "cover" | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Character counters for SEO
  const titleLength = post.title[activeLang]?.length || 0;
  const excerptLength = post.excerpt[activeLang]?.length || 0;

  // Auto calculate reading time based on total words
  const calculateReadingTime = () => {
    let wordCount = 0;
    wordCount += (post.title.vi || "").split(/\s+/).length;
    wordCount += (post.excerpt.vi || "").split(/\s+/).length;
    post.body.forEach((b) => {
      if (b.type === "p" || b.type === "h2" || b.type === "quote") {
        wordCount += (b.text.vi || "").split(/\s+/).length;
      } else if (b.type === "ul") {
        b.items.forEach((it) => {
          wordCount += (it.vi || "").split(/\s+/).length;
        });
      }
    });
    return Math.max(3, Math.ceil(wordCount / 180));
  };

  // Block Manipulation Handlers
  const addBlock = (type: Block["type"]) => {
    let newBlock: Block;
    if (type === "h2") {
      newBlock = { type: "h2", text: { vi: "Tiêu đề mục mới", en: "New Section Heading" } };
    } else if (type === "quote") {
      newBlock = { type: "quote", text: { vi: "Trích dẫn nhận định quan trọng...", en: "Key industry quote or insight..." } };
    } else if (type === "ul") {
      newBlock = {
        type: "ul",
        items: [
          { vi: "Ý chính thứ nhất", en: "First core takeaway" },
          { vi: "Ý chính thứ hai", en: "Second core takeaway" },
        ],
      };
    } else if (type === "image") {
      newBlock = {
        type: "image",
        src: "/blog-covers/creative-testing-lab.jpg",
        alt: { vi: "Hình ảnh minh họa chuẩn SEO", en: "SEO-optimized editorial image" },
        caption: { vi: "Chú thích phân tích dữ liệu cho hình ảnh.", en: "Analytical caption for the screenshot." },
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
    const calculatedReadingTime = calculateReadingTime();
    const finalPost = { ...post, readingTime: calculatedReadingTime };
    onSave(finalPost);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-navy-800 bg-navy-950 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-800 text-navy-400 hover:border-navy-700 hover:text-white"
          >
            ←
          </button>
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              {initialPost ? (locale === "vi" ? "Chỉnh sửa bài viết" : "Edit Post") : (locale === "vi" ? "Tạo bài viết mới" : "Create New Post")}
            </h2>
            <p className="text-xs text-navy-400 font-mono">slug: /{post.slug}</p>
          </div>
        </div>

        {/* View mode toggle & Language Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-navy-800 bg-navy-900/60 p-1">
            <button
              onClick={() => setActiveLang("vi")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                activeLang === "vi" ? "bg-orange-500 text-white" : "text-navy-400 hover:text-white"
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => setActiveLang("en")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                activeLang === "en" ? "bg-orange-500 text-white" : "text-navy-400 hover:text-white"
              }`}
            >
              🇺🇸 English
            </button>
          </div>

          <div className="flex rounded-xl border border-navy-800 bg-navy-900/60 p-1">
            <button
              onClick={() => setActiveView("editor")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                activeView === "editor" ? "bg-navy-800 text-white" : "text-navy-400 hover:text-white"
              }`}
            >
              ✏️ Soạn thảo
            </button>
            <button
              onClick={() => setActiveView("preview")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                activeView === "preview" ? "bg-navy-800 text-white" : "text-navy-400 hover:text-white"
              }`}
            >
              👁️ Xem trước
            </button>
            <button
              onClick={() => setActiveView("code")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                activeView === "code" ? "bg-navy-800 text-white" : "text-navy-400 hover:text-white"
              }`}
            >
              💾 JSON / Code
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
          >
            <span>{locale === "vi" ? "Lưu bài viết" : "Save Post"}</span>
            <Icon name="check" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-500/40 bg-emerald-950/90 px-5 py-3 text-sm font-bold text-emerald-400 shadow-2xl backdrop-blur-xl">
          ✓ {locale === "vi" ? "Đã lưu bài viết thành công!" : "Post saved successfully!"}
        </div>
      )}

      {/* Main Content Layout */}
      {activeView === "editor" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Editor (8 cols) */}
          <div className="space-y-6 lg:col-span-8">
            {/* Title & Excerpt */}
            <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-navy-300">
                    Tiêu đề bài viết ({activeLang.toUpperCase()})
                  </label>
                  <span className={`text-xs font-bold ${titleLength >= 45 && titleLength <= 75 ? "text-emerald-400" : "text-orange-400"}`}>
                    {titleLength} ký tự (Khuyên dùng: 50-70)
                  </span>
                </div>
                <input
                  type="text"
                  value={post.title[activeLang]}
                  onChange={(e) => setPost({ ...post, title: { ...post.title, [activeLang]: e.target.value } })}
                  placeholder="Nhập tiêu đề thu hút, chuẩn SEO..."
                  className="mt-2 w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3.5 text-base font-bold text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-navy-300">
                    Mô tả tóm tắt (SEO Meta Description) ({activeLang.toUpperCase()})
                  </label>
                  <span className={`text-xs font-bold ${excerptLength >= 120 && excerptLength <= 165 ? "text-emerald-400" : "text-navy-400"}`}>
                    {excerptLength} ký tự (Khuyên dùng: 130-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={post.excerpt[activeLang]}
                  onChange={(e) => setPost({ ...post, excerpt: { ...post.excerpt, [activeLang]: e.target.value } })}
                  placeholder="Tóm tắt giá trị bài viết để người đọc bấm vào từ Google..."
                  className="mt-2 w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 text-sm text-navy-100 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Block Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">
                  Khối nội dung bài viết ({post.body.length} khối)
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => addBlock("p")}
                    className="rounded-xl border border-navy-800 bg-navy-900/80 px-3 py-1.5 text-xs font-bold text-navy-300 hover:border-orange-500 hover:text-white"
                  >
                    + Đoạn văn (p)
                  </button>
                  <button
                    onClick={() => addBlock("h2")}
                    className="rounded-xl border border-navy-800 bg-navy-900/80 px-3 py-1.5 text-xs font-bold text-navy-300 hover:border-orange-500 hover:text-white"
                  >
                    + Tiêu đề mục (H2)
                  </button>
                  <button
                    onClick={() => addBlock("image")}
                    className="rounded-xl border border-navy-800 bg-navy-900/80 px-3 py-1.5 text-xs font-bold text-orange-400 hover:border-orange-500 hover:bg-orange-500/10"
                  >
                    + Hình ảnh (Image)
                  </button>
                  <button
                    onClick={() => addBlock("ul")}
                    className="rounded-xl border border-navy-800 bg-navy-900/80 px-3 py-1.5 text-xs font-bold text-navy-300 hover:border-orange-500 hover:text-white"
                  >
                    + Danh sách (ul)
                  </button>
                  <button
                    onClick={() => addBlock("quote")}
                    className="rounded-xl border border-navy-800 bg-navy-900/80 px-3 py-1.5 text-xs font-bold text-navy-300 hover:border-orange-500 hover:text-white"
                  >
                    + Trích dẫn (quote)
                  </button>
                </div>
              </div>

              {/* Render Block List */}
              {post.body.map((block, index) => (
                <div
                  key={index}
                  className="relative rounded-3xl border border-navy-800/80 bg-navy-950/70 p-5 transition hover:border-navy-700"
                >
                  <div className="flex items-center justify-between border-b border-navy-800/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-navy-800 text-xs font-bold text-orange-400">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-navy-300">
                        Khối: <strong className="text-white">{block.type.toUpperCase()}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                        className="rounded-lg p-1.5 text-xs text-navy-400 hover:bg-navy-800 hover:text-white disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === post.body.length - 1}
                        className="rounded-lg p-1.5 text-xs text-navy-400 hover:bg-navy-800 hover:text-white disabled:opacity-30"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => removeBlock(index)}
                        className="rounded-lg p-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                        title="Xóa khối"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {block.type === "p" && (
                      <textarea
                        rows={3}
                        value={block.text[activeLang] || ""}
                        onChange={(e) => updateBlockText(index, "text", e.target.value)}
                        placeholder={`Nội dung đoạn văn (${activeLang.toUpperCase()})...`}
                        className="w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 text-sm text-navy-100 outline-none focus:border-orange-500"
                      />
                    )}

                    {block.type === "h2" && (
                      <input
                        type="text"
                        value={block.text[activeLang] || ""}
                        onChange={(e) => updateBlockText(index, "text", e.target.value)}
                        placeholder={`Tiêu đề H2 (${activeLang.toUpperCase()})...`}
                        className="w-full rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 text-sm font-bold text-white outline-none focus:border-orange-500"
                      />
                    )}

                    {block.type === "quote" && (
                      <textarea
                        rows={2}
                        value={block.text[activeLang] || ""}
                        onChange={(e) => updateBlockText(index, "text", e.target.value)}
                        placeholder={`Trích dẫn (${activeLang.toUpperCase()})...`}
                        className="w-full rounded-2xl border border-orange-500/30 bg-orange-500/5 px-4 py-3 text-sm italic text-orange-200 outline-none focus:border-orange-500"
                      />
                    )}

                    {block.type === "ul" && (
                      <div className="space-y-2">
                        {block.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center gap-2">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                            <input
                              type="text"
                              value={item[activeLang] || ""}
                              onChange={(e) => updateListItem(index, iIdx, e.target.value)}
                              placeholder={`Ý gạch đầu dòng #${iIdx + 1} (${activeLang.toUpperCase()})...`}
                              className="flex-1 rounded-xl border border-navy-800 bg-navy-900 px-3.5 py-2 text-sm text-navy-100 outline-none focus:border-orange-500"
                            />
                            <button
                              onClick={() => removeListItem(index, iIdx)}
                              className="text-xs text-rose-400 hover:text-rose-300"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addListItem(index)}
                          className="mt-2 text-xs font-bold text-orange-400 hover:text-orange-300"
                        >
                          + Thêm ý gạch đầu dòng
                        </button>
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                        <div className="sm:col-span-4">
                          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={block.src} alt={block.alt?.[activeLang] || ""} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setShowMediaModal(index)}
                              className="absolute inset-0 flex items-center justify-center bg-navy-950/70 text-xs font-bold text-white opacity-0 transition hover:opacity-100"
                            >
                              🔄 Đổi ảnh từ thư viện
                            </button>
                          </div>
                          <p className="mt-1 font-mono text-[10px] text-navy-400 truncate">{block.src}</p>
                        </div>

                        <div className="space-y-3 sm:col-span-8">
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-navy-400">
                              Thẻ Alt mô tả cho SEO ({activeLang.toUpperCase()})
                            </label>
                            <input
                              type="text"
                              value={block.alt?.[activeLang] || ""}
                              onChange={(e) => updateBlockText(index, "alt", e.target.value)}
                              placeholder="Mô tả bức ảnh chứa từ khóa liên quan..."
                              className="mt-1 w-full rounded-xl border border-navy-800 bg-navy-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-navy-400">
                              Chú thích ảnh Caption ({activeLang.toUpperCase()})
                            </label>
                            <input
                              type="text"
                              value={block.caption?.[activeLang] || ""}
                              onChange={(e) => updateBlockText(index, "caption", e.target.value)}
                              placeholder="Chú thích hiển thị bên dưới bức ảnh..."
                              className="mt-1 w-full rounded-xl border border-navy-800 bg-navy-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Settings (4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Metadata Settings */}
            <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange-400">
                Thông tin xuất bản
              </h3>

              <div>
                <label className="text-xs font-bold text-navy-300">Đường dẫn Slug (URL)</label>
                <input
                  type="text"
                  value={post.slug}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-navy-800 bg-navy-900 px-3.5 py-2.5 font-mono text-xs text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-300">Chuyên mục</label>
                <select
                  value={post.category.vi}
                  onChange={(e) => {
                    const found = blogCategories.find((c) => c.vi === e.target.value);
                    if (found) {
                      setPost({ ...post, category: { vi: found.vi, en: found.en } });
                    }
                  }}
                  className="mt-1 w-full rounded-xl border border-navy-800 bg-navy-900 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-orange-500"
                >
                  {blogCategories.map((c) => (
                    <option key={c.slug} value={c.vi}>
                      {c.vi} ({c.en})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-navy-300">Ngày phát hành</label>
                <input
                  type="date"
                  value={post.date}
                  onChange={(e) => setPost({ ...post, date: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-navy-800 bg-navy-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="text-xs font-bold text-navy-300">Ảnh bìa (Cover Image)</label>
                <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-2xl border border-navy-800 bg-navy-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="Cover" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setShowMediaModal("cover")}
                    className="absolute inset-0 flex items-center justify-center bg-navy-950/70 text-xs font-bold text-white opacity-0 transition hover:opacity-100"
                  >
                    🔄 Chọn ảnh bìa
                  </button>
                </div>
                <p className="mt-1 font-mono text-[10px] text-navy-400 truncate">{post.cover}</p>
              </div>
            </div>

            {/* Google SERP Live Simulation */}
            <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange-400">
                Google Search Preview
              </h3>
              <div className="mt-4 rounded-2xl bg-white p-4 text-left shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-white">
                    A
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-800">ANBU</p>
                    <p className="text-[10px] text-slate-500 font-mono">https://anbu.asia/{activeLang}/blog/{post.slug}</p>
                  </div>
                </div>
                <h4 className="mt-2 text-sm font-semibold text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                  {post.title[activeLang] || "Tiêu đề bài viết..."}
                </h4>
                <p className="mt-1 text-xs text-[#4d5156] line-clamp-2">
                  {post.excerpt[activeLang] || "Mô tả ngắn gọn hiển thị trên kết quả tìm kiếm Google..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Mode */}
      {activeView === "preview" && (
        <div className="mx-auto max-w-4xl rounded-3xl border border-navy-800 bg-white p-8 text-navy-900 shadow-2xl sm:p-12">
          <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-orange-600">
            <span>{post.category[activeLang]}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{calculateReadingTime()} phút đọc</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-navy-900 sm:text-4xl">
            {post.title[activeLang]}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-navy-600 border-b border-navy-100 pb-8">
            {post.excerpt[activeLang]}
          </p>

          <div className="mt-8 space-y-6">
            {post.body.map((b, i) => {
              if (b.type === "h2") {
                return <h2 key={i} className="mt-8 font-display text-2xl font-bold text-navy-900">{b.text[activeLang]}</h2>;
              }
              if (b.type === "p") {
                return <p key={i} className="text-base leading-relaxed text-navy-700">{b.text[activeLang]}</p>;
              }
              if (b.type === "quote") {
                return (
                  <blockquote key={i} className="border-l-4 border-orange-500 bg-orange-50/60 p-4 text-base italic text-navy-800 rounded-r-2xl">
                    {b.text[activeLang]}
                  </blockquote>
                );
              }
              if (b.type === "ul") {
                return (
                  <ul key={i} className="space-y-2">
                    {b.items.map((it, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2 text-base text-navy-700">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span>{it[activeLang]}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (b.type === "image") {
                return (
                  <figure key={i} className="my-6 overflow-hidden rounded-2xl border border-navy-100 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.src} alt={b.alt[activeLang]} className="w-full max-h-[480px] object-cover" />
                    {b.caption && (
                      <figcaption className="bg-white p-3 text-center text-xs text-navy-500 border-t border-navy-100">
                        {b.caption[activeLang]}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Code / JSON View Mode */}
      {activeView === "code" && (
        <div className="rounded-3xl border border-navy-800 bg-navy-950 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-navy-800">
            <h3 className="font-display text-sm font-bold text-white">Dữ liệu TypeScript JSON của bài viết</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(post, null, 2));
                alert("Đã sao chép dữ liệu JSON vào Clipboard!");
              }}
              className="rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-600"
            >
              Copy JSON Code
            </button>
          </div>
          <pre className="mt-4 max-h-[600px] overflow-auto rounded-2xl bg-navy-900/80 p-5 font-mono text-xs text-emerald-400 select-all">
            {JSON.stringify(post, null, 2)}
          </pre>
        </div>
      )}

      {/* Media Selector Modal */}
      {showMediaModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-md">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl border border-navy-800 bg-navy-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <h3 className="font-display text-base font-bold text-white">Chọn ảnh từ thư viện Media</h3>
              <button
                onClick={() => setShowMediaModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-800 text-navy-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
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

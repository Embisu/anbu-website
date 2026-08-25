"use client";

import React, { useState } from "react";
import type { Post, Block } from "@/content/posts";
import { blogCategories } from "@/content/posts";
import Icon from "@/components/Icon";
import MediaManager from "./MediaManager";
import RankMathSEO from "./RankMathSEO";

type WordPressEditorProps = {
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
        vi: "Đoạn mở đầu nêu trực diện vấn đề và giải pháp thực chiến cho các studio và nhà phát hành game tại Việt Nam và Đông Nam Á.",
        en: "Opening paragraph introducing the core operational challenge and proven framework for gaming studios across Southeast Asia.",
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

export default function WordPressEditor({ initialPost, locale, onSave, onCancel }: WordPressEditorProps) {
  const [post, setPost] = useState<Post>(initialPost ? JSON.parse(JSON.stringify(initialPost)) : defaultEmptyPost);
  const [activeLang, setActiveLang] = useState<"vi" | "en">("vi");
  const [activeView, setActiveView] = useState<"editor" | "preview" | "code">("editor");
  const [sidebarTab, setSidebarTab] = useState<"post" | "block">("post");
  const [showMediaModal, setShowMediaModal] = useState<number | "cover" | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  // Calculate words and reading time
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
    setSelectedBlockIndex(post.body.length);
  };

  const removeBlock = (index: number) => {
    const updated = [...post.body];
    updated.splice(index, 1);
    setPost({ ...post, body: updated });
    if (selectedBlockIndex === index) setSelectedBlockIndex(null);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === post.body.length - 1)) return;
    const updated = [...post.body];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPost({ ...post, body: updated });
    setSelectedBlockIndex(targetIndex);
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
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-slate-800 -m-4 sm:-m-10">
      {/* WordPress Top Navigation Header */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            title="Quay lại danh sách bài viết"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#2271b1] font-display text-xs font-black text-white">
              W
            </span>
            <span className="text-sm font-bold text-slate-800">
              {initialPost ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              Đã xuất bản (Published)
            </span>
          </div>
        </div>

        {/* Center Language & View Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setActiveLang("vi")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                activeLang === "vi" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => setActiveLang("en")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                activeLang === "en" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🇺🇸 English
            </button>
          </div>

          {/* View Mode */}
          <div className="hidden sm:flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setActiveView("editor")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                activeView === "editor" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✏️ Soạn thảo
            </button>
            <button
              onClick={() => setActiveView("preview")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                activeView === "preview" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              👁️ Xem trước
            </button>
          </div>
        </div>

        {/* Publish Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-[#2271b1] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#135e96]"
          >
            <span>💾 Cập nhật (Publish)</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-xl">
          ✓ Bài viết đã được lưu và cập nhật thành công!
        </div>
      )}

      {/* Main WordPress Content Grid */}
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
        {/* Left / Center Editor Canvas (8 or 9 cols) */}
        <div className="p-4 sm:p-8 lg:col-span-8 xl:col-span-9 space-y-6">
          {activeView === "editor" ? (
            <>
              {/* Document Paper Container */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6 max-w-4xl mx-auto">
                {/* Title Input */}
                <div>
                  <input
                    type="text"
                    value={post.title[activeLang] || ""}
                    onChange={(e) => setPost({ ...post, title: { ...post.title, [activeLang]: e.target.value } })}
                    placeholder="Thêm tiêu đề bài viết (Add Title)..."
                    className="w-full border-b border-slate-200 pb-3 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 outline-none placeholder:text-slate-300 focus:border-blue-600"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Đường dẫn cố định: <strong className="text-slate-600 font-mono">https://anbu.asia/{activeLang}/blog/{post.slug}</strong></span>
                    <span className="font-semibold">{post.title[activeLang]?.length || 0} ký tự</span>
                  </div>
                </div>

                {/* Excerpt / Tóm tắt */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Đoạn tóm tắt mở đầu (Excerpt & SEO Description)
                  </label>
                  <textarea
                    rows={2}
                    value={post.excerpt[activeLang] || ""}
                    onChange={(e) => setPost({ ...post, excerpt: { ...post.excerpt, [activeLang]: e.target.value } })}
                    placeholder="Viết đoạn giới thiệu ngắn gọn, súc tích..."
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>

                {/* Block Inserter Toolbar */}
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs">
                  <span className="px-2 font-bold text-slate-500 uppercase text-[10px]">Chèn khối:</span>
                  <button
                    onClick={() => addBlock("p")}
                    className="rounded-md bg-white border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    + Đoạn văn
                  </button>
                  <button
                    onClick={() => addBlock("h2")}
                    className="rounded-md bg-white border border-slate-200 px-3 py-1.5 font-bold text-slate-800 hover:bg-slate-100"
                  >
                    + Tiêu đề H2
                  </button>
                  <button
                    onClick={() => addBlock("image")}
                    className="rounded-md bg-blue-50 border border-blue-200 px-3 py-1.5 font-bold text-blue-700 hover:bg-blue-100"
                  >
                    + Hình ảnh
                  </button>
                  <button
                    onClick={() => addBlock("ul")}
                    className="rounded-md bg-white border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    + Danh sách (List)
                  </button>
                  <button
                    onClick={() => addBlock("quote")}
                    className="rounded-md bg-white border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    + Trích dẫn (Quote)
                  </button>
                </div>

                {/* Blocks Canvas */}
                <div className="space-y-4 pt-2">
                  {post.body.map((block, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedBlockIndex(index)}
                      className={`group relative rounded-xl border p-4 transition-all ${
                        selectedBlockIndex === index
                          ? "border-blue-500 bg-blue-50/10 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {/* Block Controls Header */}
                      <div className="mb-2 flex items-center justify-between opacity-80 group-hover:opacity-100">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                            Khối #{index + 1}: {block.type.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(index, "up"); }}
                            disabled={index === 0}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                            title="Di chuyển lên"
                          >
                            ▲
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(index, "down"); }}
                            disabled={index === post.body.length - 1}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                            title="Di chuyển xuống"
                          >
                            ▼
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeBlock(index); }}
                            className="rounded p-1 text-rose-500 hover:bg-rose-50"
                            title="Xóa khối"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Block Editors */}
                      {block.type === "p" && (
                        <textarea
                          rows={3}
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlockText(index, "text", e.target.value)}
                          placeholder="Nhập nội dung đoạn văn..."
                          className="w-full resize-y rounded-lg border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-800 outline-none focus:border-blue-600"
                        />
                      )}

                      {block.type === "h2" && (
                        <input
                          type="text"
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlockText(index, "text", e.target.value)}
                          placeholder="Nhập tiêu đề mục H2..."
                          className="w-full rounded-lg border border-slate-200 bg-white p-3 font-display text-base font-bold text-slate-900 outline-none focus:border-blue-600"
                        />
                      )}

                      {block.type === "quote" && (
                        <textarea
                          rows={2}
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlockText(index, "text", e.target.value)}
                          placeholder="Nhập câu trích dẫn..."
                          className="w-full rounded-lg border-l-4 border-orange-500 bg-orange-50/40 p-3 text-sm italic text-slate-800 outline-none"
                        />
                      )}

                      {block.type === "ul" && (
                        <div className="space-y-2">
                          {block.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                              <input
                                type="text"
                                value={item[activeLang] || ""}
                                onChange={(e) => updateListItem(index, iIdx, e.target.value)}
                                placeholder="Nội dung ý gạch đầu dòng..."
                                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-600"
                              />
                              <button
                                onClick={() => removeListItem(index, iIdx)}
                                className="text-slate-400 hover:text-rose-500 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addListItem(index)}
                            className="mt-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            + Thêm dòng mới
                          </button>
                        </div>
                      )}

                      {block.type === "image" && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 rounded-xl bg-slate-50 p-3 border border-slate-200">
                          <div className="sm:col-span-4">
                            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-300 bg-slate-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={block.src} alt="" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setShowMediaModal(index)}
                                className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-xs font-bold text-white opacity-0 transition hover:opacity-100"
                              >
                                🔄 Đổi ảnh
                              </button>
                            </div>
                            <p className="mt-1 font-mono text-[10px] text-slate-500 truncate">{block.src}</p>
                          </div>

                          <div className="space-y-3 sm:col-span-8">
                            <div>
                              <label className="text-[11px] font-bold uppercase text-slate-600">Thẻ Alt ảnh (SEO)</label>
                              <input
                                type="text"
                                value={block.alt?.[activeLang] || ""}
                                onChange={(e) => updateBlockText(index, "alt", e.target.value)}
                                placeholder="Mô tả bức ảnh chứa từ khóa..."
                                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-600"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold uppercase text-slate-600">Chú thích ảnh (Caption)</label>
                              <input
                                type="text"
                                value={block.caption?.[activeLang] || ""}
                                onChange={(e) => updateBlockText(index, "caption", e.target.value)}
                                placeholder="Chú thích hiển thị dưới ảnh..."
                                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-600"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rank Math / Yoast SEO Box (WordPress Meta Box Style) */}
              <div className="max-w-4xl mx-auto">
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
            </>
          ) : (
            /* Live Preview Canvas */
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm max-w-4xl mx-auto">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                <span>{post.category[activeLang]}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{calculateReadingTime()} phút đọc</span>
              </div>
              <h1 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {post.title[activeLang]}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 border-b border-slate-100 pb-6">
                {post.excerpt[activeLang]}
              </p>

              <div className="mt-8 space-y-6">
                {post.body.map((b, i) => {
                  if (b.type === "h2") return <h2 key={i} className="font-display text-2xl font-bold text-slate-900">{b.text[activeLang]}</h2>;
                  if (b.type === "p") return <p key={i} className="text-base leading-relaxed text-slate-700">{b.text[activeLang]}</p>;
                  if (b.type === "quote") return <blockquote key={i} className="border-l-4 border-orange-500 bg-orange-50/60 p-4 text-base italic text-slate-800 rounded-r-xl">{b.text[activeLang]}</blockquote>;
                  if (b.type === "ul") {
                    return (
                      <ul key={i} className="space-y-2">
                        {b.items.map((it, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2 text-base text-slate-700">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span>{it[activeLang]}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (b.type === "image") {
                    return (
                      <figure key={i} className="my-6 overflow-hidden rounded-xl border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.src} alt={b.alt[activeLang]} className="w-full max-h-[480px] object-cover" />
                        {b.caption && (
                          <figcaption className="bg-slate-50 p-3 text-center text-xs text-slate-500 border-t border-slate-200">
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
        </div>

        {/* WordPress Document Settings Right Sidebar (3 or 4 cols) */}
        <div className="border-l border-slate-200 bg-white p-6 lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="flex border-b border-slate-200 pb-3">
            <button
              onClick={() => setSidebarTab("post")}
              className={`flex-1 text-center text-xs font-bold pb-2 border-b-2 transition ${
                sidebarTab === "post" ? "border-[#2271b1] text-[#2271b1]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Bài viết (Post)
            </button>
            <button
              onClick={() => setSidebarTab("block")}
              className={`flex-1 text-center text-xs font-bold pb-2 border-b-2 transition ${
                sidebarTab === "block" ? "border-[#2271b1] text-[#2271b1]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Khối (Block)
            </button>
          </div>

          {/* Post Settings Tab */}
          {sidebarTab === "post" && (
            <div className="space-y-6 text-xs text-slate-700">
              {/* Status & Visibility */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="font-bold text-slate-900 uppercase text-[11px]">Trạng thái & Hiển thị</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hiển thị:</span>
                  <span className="font-bold text-blue-600">Công khai (Public)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Ngày đăng:</span>
                  <input
                    type="date"
                    value={post.date}
                    onChange={(e) => setPost({ ...post, date: e.target.value })}
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tác giả:</span>
                  <span className="font-bold text-slate-800">{post.author}</span>
                </div>
              </div>

              {/* URL Slug */}
              <div>
                <label className="font-bold uppercase text-[11px] text-slate-700">Đường dẫn tĩnh (Slug)</label>
                <input
                  type="text"
                  value={post.slug}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-xs text-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="font-bold uppercase text-[11px] text-slate-700">Chuyên mục (Categories)</label>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                  {blogCategories.map((c) => (
                    <label key={c.slug} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="post_category"
                        checked={post.category.vi === c.vi}
                        onChange={() => setPost({ ...post, category: { vi: c.vi, en: c.en } })}
                        className="text-blue-600"
                      />
                      <span className="font-medium text-slate-800">{c.vi}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="font-bold uppercase text-[11px] text-slate-700">Ảnh đại diện bài viết (Featured Image)</label>
                <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-xl border border-slate-300 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setShowMediaModal("cover")}
                    className="absolute inset-0 flex items-center justify-center bg-slate-900/60 font-bold text-white opacity-0 transition hover:opacity-100 text-xs"
                  >
                    🔄 Đổi ảnh đại diện
                  </button>
                </div>
                <p className="mt-1 font-mono text-[10px] text-slate-500 truncate">{post.cover}</p>
              </div>
            </div>
          )}

          {/* Block Settings Tab */}
          {sidebarTab === "block" && (
            <div className="text-xs text-slate-600 space-y-4">
              {selectedBlockIndex !== null ? (
                <div className="space-y-3">
                  <div className="font-bold text-slate-900">
                    Tùy chỉnh khối #{selectedBlockIndex + 1} ({post.body[selectedBlockIndex]?.type.toUpperCase()})
                  </div>
                  <p className="text-slate-500">
                    Bạn đang chỉnh sửa khối nội dung này. Sử dụng thanh công cụ bên trái hoặc các nút mũi tên để di chuyển vị trí.
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 italic">Chọn một khối nội dung bên trái để xem các tùy chỉnh chi tiết.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media Selector Modal */}
      {showMediaModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-display text-base font-bold text-slate-900">Thư viện Media ANBU (Chọn ảnh)</h3>
              <button
                onClick={() => setShowMediaModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
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

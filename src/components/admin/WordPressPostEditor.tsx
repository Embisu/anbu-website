"use client";

import React, { useState, useRef } from "react";
import type { Post } from "@/content/posts";
import { blogCategories } from "@/content/posts";
import MediaManager from "@/components/admin/MediaManager";
import RankMathSEO from "@/components/admin/RankMathSEO";
import { supabase } from "@/lib/supabase";

type WordPressPostEditorProps = {
  initialPost?: Post | null;
  locale: string;
  onSave: (post: Post) => void;
  onCancel: () => void;
};

type MediaModalTarget = {
  type: "cover" | "block" | "new_block";
  index?: number;
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
  const [mediaModalTarget, setMediaModalTarget] = useState<MediaModalTarget | null>(null);
  const [activeUrlInputBlock, setActiveUrlInputBlock] = useState<number | null>(null);
  const [tempUrlValue, setTempUrlValue] = useState("");
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Marketing Game", "LiveOps"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const toolbarFileInputRef = useRef<HTMLInputElement>(null);

  const slugifyVietnamese = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (val: string) => {
    setPost({
      ...post,
      title: { ...post.title, [activeLang]: val },
      slug: !initialPost && activeLang === "vi" ? slugifyVietnamese(val) : post.slug,
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

  // Auto Translate Vietnamese to English
  const translateText = async (text: string): Promise<string> => {
    if (!text || !text.trim()) return "";
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (!res.ok) return text;
      const data = await res.json();
      if (Array.isArray(data?.[0])) {
        return data[0].map((item: any) => item[0]).join("");
      }
      return text;
    } catch {
      return text;
    }
  };

  const handleAutoTranslateToEnglish = async () => {
    setAiNotice("🌐 Đang tự động dịch toàn bộ bài viết sang Tiếng Anh...");
    try {
      // 1. Translate Title & Excerpt
      const enTitle = post.title.vi ? await translateText(post.title.vi) : "";
      const enExcerpt = post.excerpt.vi ? await translateText(post.excerpt.vi) : "";

      // 2. Translate Blocks
      const newBody = await Promise.all(
        post.body.map(async (block) => {
          if (block.type === "p" || block.type === "h2" || block.type === "quote") {
            const enText = block.text.vi ? await translateText(block.text.vi) : "";
            return {
              ...block,
              text: { ...block.text, en: enText },
            };
          }
          if (block.type === "ul") {
            const translatedItems = await Promise.all(
              block.items.map(async (item) => {
                const enItem = item.vi ? await translateText(item.vi) : "";
                return { ...item, en: enItem };
              })
            );
            return {
              ...block,
              items: translatedItems,
            };
          }
          if (block.type === "image") {
            const enAlt = block.alt.vi ? await translateText(block.alt.vi) : "";
            const enCaption = block.caption?.vi ? await translateText(block.caption.vi) : undefined;
            return {
              ...block,
              alt: { ...block.alt, en: enAlt },
              caption: enCaption ? { ...block.caption!, en: enCaption } : block.caption,
            };
          }
          return block;
        })
      );

      setPost((prev) => ({
        ...prev,
        title: { ...prev.title, en: enTitle },
        excerpt: { ...prev.excerpt, en: enExcerpt },
        body: newBody,
      }));

      setActiveLang("en");
      setAiNotice("✅ Đã dịch xong toàn bộ bài viết sang Tiếng Anh! Đã tự động chuyển sang tab English để bạn xem lại.");
      setTimeout(() => setAiNotice(null), 5000);
    } catch (err: any) {
      console.error(err);
      setAiNotice("⚠️ Có lỗi khi dịch tự động. Bạn có thể sử dụng nút 'Sao chép Tiếng Việt sang EN'.");
      setTimeout(() => setAiNotice(null), 4000);
    }
  };

  const handleCloneViToEn = () => {
    const clonedBody = post.body.map((block) => {
      if (block.type === "p" || block.type === "h2" || block.type === "quote") {
        return { ...block, text: { ...block.text, en: block.text.vi || "" } };
      }
      if (block.type === "ul") {
        return { ...block, items: block.items.map((i) => ({ ...i, en: i.vi || "" })) };
      }
      if (block.type === "image") {
        return {
          ...block,
          alt: { ...block.alt, en: block.alt.vi || "" },
          caption: block.caption ? { ...block.caption, en: block.caption.vi || "" } : undefined,
        };
      }
      return block;
    });

    setPost({
      ...post,
      title: { ...post.title, en: post.title.vi },
      excerpt: { ...post.excerpt, en: post.excerpt.vi },
      body: clonedBody,
    });
    setActiveLang("en");
    setAiNotice("📋 Đã sao chép nội dung Tiếng Việt sang tab Tiếng Anh thành công!");
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

  const insertBlock = (
    type: "p" | "h2" | "quote" | "ul" | "image",
    atIndex?: number,
    imageSrc?: string,
    imageAlt?: string
  ) => {
    const updated = [...post.body];
    let newBlock: any;
    if (type === "p") {
      newBlock = { type: "p", text: { vi: "Nhập nội dung đoạn văn mới...", en: "New paragraph content..." } };
    } else if (type === "h2") {
      newBlock = { type: "h2", text: { vi: "Tiêu đề mục mới (Heading 2)", en: "New section title (Heading 2)" } };
    } else if (type === "quote") {
      newBlock = { type: "quote", text: { vi: "Trích dẫn số liệu hoặc nhận định chuyên gia...", en: "Key expert quote..." } };
    } else if (type === "ul") {
      newBlock = {
        type: "ul",
        items: [
          { vi: "Điểm nổi bật 1...", en: "Highlight item 1..." },
          { vi: "Điểm nổi bật 2...", en: "Highlight item 2..." },
        ],
      };
    } else if (type === "image") {
      newBlock = {
        type: "image",
        src: imageSrc || "",
        alt: { vi: imageAlt || "Mô tả hình ảnh cho SEO", en: "Image description for SEO" },
        caption: { vi: "", en: "" },
      };
    }

    const insertPos = typeof atIndex === "number" ? atIndex : updated.length;
    updated.splice(insertPos, 0, newBlock);
    setPost({ ...post, body: updated });
  };

  const addBlock = (type: "p" | "h2" | "quote" | "ul" | "image") => {
    insertBlock(type);
  };

  const handleDirectUpload = async (
    file: File,
    target: MediaModalTarget
  ) => {
    if (!file) return;
    const targetKey = target.type === "cover" ? "cover" : String(target.index ?? "new");
    setUploadingTarget(targetKey);
    setAiNotice(`⏳ Đang tải ảnh "${file.name}" (${Math.round(file.size / 1024)} KB) lên Cloud...`);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      const filePath = `${Date.now()}-${cleanName}.${ext}`;

      const { data, error } = await supabase.storage
        .from("blog-media")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("blog-media").getPublicUrl(data.path);
      const publicUrl = urlData.publicUrl;

      if (target.type === "cover") {
        setPost((prev) => ({ ...prev, cover: publicUrl }));
        setAiNotice("✅ Đã đổi ảnh đại diện bài viết thành công!");
      } else if (target.type === "block" && typeof target.index === "number") {
        const updated = [...post.body];
        const b = updated[target.index];
        if (b && b.type === "image") {
          b.src = publicUrl;
          if (!b.alt.vi || b.alt.vi === "Mô tả hình ảnh cho SEO") {
            b.alt.vi = file.name.replace(/\.[^/.]+$/, "");
          }
          setPost((prev) => ({ ...prev, body: updated }));
        }
        setAiNotice("✅ Đã cập nhật ảnh minh họa thành công!");
      } else if (target.type === "new_block") {
        insertBlock("image", target.index, publicUrl, file.name.replace(/\.[^/.]+$/, ""));
        setAiNotice("✅ Đã chèn ảnh mới vào bài viết thành công!");
      }
      setTimeout(() => setAiNotice(null), 4000);
    } catch (err: any) {
      console.error("Direct upload error:", err);
      setAiNotice(`⚠️ Lỗi khi tải ảnh: ${err.message || "Không thể tải lên"}`);
      setTimeout(() => setAiNotice(null), 5000);
    } finally {
      setUploadingTarget(null);
    }
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

    // Auto-fill English if left empty to guarantee bilingual completeness
    const titleEn = post.title.en?.trim() || post.title.vi;
    const excerptEn = post.excerpt.en?.trim() || post.excerpt.vi;

    const safeBody = post.body.map((block) => {
      if (block.type === "p" || block.type === "h2" || block.type === "quote") {
        return {
          ...block,
          text: {
            vi: block.text.vi || "",
            en: block.text.en?.trim() || block.text.vi || "",
          },
        };
      }
      if (block.type === "ul") {
        return {
          ...block,
          items: block.items.map((i) => ({
            vi: i.vi || "",
            en: i.en?.trim() || i.vi || "",
          })),
        };
      }
      if (block.type === "image") {
        return {
          ...block,
          alt: {
            vi: block.alt.vi || "",
            en: block.alt.en?.trim() || block.alt.vi || "",
          },
          caption: block.caption
            ? {
                vi: block.caption.vi || "",
                en: block.caption.en?.trim() || block.caption.vi || "",
              }
            : undefined,
        };
      }
      return block;
    });

    const finalPost: Post = {
      ...post,
      title: { vi: post.title.vi, en: titleEn },
      excerpt: { vi: post.excerpt.vi, en: excerptEn },
      body: safeBody,
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
                onClick={handleAutoTranslateToEnglish}
                className="rounded border border-emerald-600 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 transition flex items-center gap-1 shadow-sm"
              >
                <span>🌐</span> <span>Dịch tự động sang Tiếng Anh (1-Click)</span>
              </button>
              <button
                type="button"
                onClick={handleCloneViToEn}
                className="rounded border border-[#8c8f94] bg-white px-2.5 py-1 text-[11px] font-bold text-[#2c3338] hover:bg-[#f6f7f7] transition"
              >
                📋 Sao chép Tiếng Việt sang EN
              </button>
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
                  className={`rounded px-2.5 py-0.5 font-bold transition flex items-center gap-1.5 ${
                    activeLang === "en" ? "bg-[#2271b1] text-white shadow-sm" : "text-[#50575e] hover:text-black"
                  }`}
                >
                  <span>🇺🇸 English</span>
                  {!post.title.en?.trim() && (
                    <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-normal">
                      Chưa dịch
                    </span>
                  )}
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
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs text-[#2c3338] select-none">
                <div className="flex flex-wrap items-center gap-1">
                  <div className="flex items-center gap-0.5 border-r border-[#c3c4c7] pr-1.5 mr-1">
                    <button type="button" onClick={() => addBlock("p")} className="h-6 px-1.5 rounded border border-transparent font-bold hover:bg-white hover:border-[#c3c4c7]" title="Đoạn văn">¶ Đoạn văn</button>
                    <button type="button" onClick={() => addBlock("h2")} className="h-6 px-1.5 rounded border border-transparent font-bold hover:bg-white hover:border-[#c3c4c7]" title="Tiêu đề H2">H2 Tiêu đề</button>
                  </div>
                  <div className="flex items-center gap-0.5 border-r border-[#c3c4c7] pr-1.5 mr-1">
                    <button type="button" onClick={() => addBlock("ul")} className="h-6 px-1.5 rounded border border-transparent font-medium hover:bg-white hover:border-[#c3c4c7]" title="Danh sách">•≡ Danh sách</button>
                    <button type="button" onClick={() => addBlock("quote")} className="h-6 px-1.5 rounded border border-transparent font-medium hover:bg-white hover:border-[#c3c4c7]" title="Trích dẫn">“ Trích dẫn</button>
                  </div>
                </div>

                {/* Prominent Media Action Buttons in Toolbar */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMediaModalTarget({ type: "new_block" })}
                    className="flex items-center gap-1.5 rounded bg-blue-50 border border-blue-300 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-xs"
                    title="Chèn ảnh từ thư viện Media"
                  >
                    <span>🖼️</span> <span>+ Thêm Media</span>
                  </button>
                  <label
                    className="flex items-center gap-1.5 rounded bg-white border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs"
                    title="Tải ảnh trực tiếp từ máy tính"
                  >
                    <span>📤</span> <span>Tải ảnh lên</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleDirectUpload(e.target.files[0], { type: "new_block" });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Editor Workspace Canvas */}
              <div className="min-h-[420px] p-5 space-y-2">
                {/* Inserter at very top */}
                <div className="relative py-1 group/top my-1">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-dashed border-slate-200 group-hover/top:border-blue-400 transition-colors" />
                  </div>
                  <div className="relative flex justify-center opacity-0 group-hover/top:opacity-100 transition-opacity">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-md border border-blue-200 text-xs">
                      <span className="text-[11px] font-bold text-slate-700">Chèn đầu bài:</span>
                      <button type="button" onClick={() => insertBlock("p", 0)} className="rounded px-2 py-0.5 text-xs text-slate-700 hover:bg-blue-50 font-medium">¶ Đoạn văn</button>
                      <button type="button" onClick={() => insertBlock("h2", 0)} className="rounded px-2 py-0.5 text-xs text-slate-700 hover:bg-blue-50 font-medium">H2 Tiêu đề</button>
                      <button type="button" onClick={() => insertBlock("image", 0)} className="rounded px-2 py-0.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold flex items-center gap-1">🖼️ Chèn Ảnh</button>
                    </div>
                  </div>
                </div>

                {post.body.map((block, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`relative rounded-lg border transition-all p-3.5 ${
                        block.type === "image"
                          ? "border-blue-300 bg-blue-50/20 shadow-xs"
                          : block.type === "h2"
                          ? "border-slate-200 bg-white shadow-xs border-l-4 border-l-blue-600"
                          : block.type === "quote"
                          ? "border-slate-200 bg-white shadow-xs border-l-4 border-l-orange-500"
                          : block.type === "ul"
                          ? "border-slate-200 bg-white shadow-xs border-l-4 border-l-emerald-600"
                          : "border-slate-200 bg-white shadow-xs border-l-4 border-l-slate-400"
                      }`}
                    >
                      {/* Block Header Toolbar */}
                      <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            block.type === "image"
                              ? "bg-blue-100 text-blue-800"
                              : block.type === "h2"
                              ? "bg-indigo-100 text-indigo-800"
                              : block.type === "quote"
                              ? "bg-orange-100 text-orange-800"
                              : block.type === "ul"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {block.type === "image" ? "🖼️ Khối Hình ảnh" : block.type === "h2" ? "H2 Tiêu đề" : block.type === "quote" ? "“ Trích dẫn" : block.type === "ul" ? "•≡ Danh sách" : "¶ Đoạn văn"}
                          </span>
                          <span className="text-[10px] text-slate-400">#{index + 1}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveBlock(index, "up")}
                            disabled={index === 0}
                            className="rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-20 transition"
                            title="Đưa khối lên trên"
                          >
                            ▲ Lên
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(index, "down")}
                            disabled={index === post.body.length - 1}
                            className="rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-20 transition"
                            title="Đưa khối xuống dưới"
                          >
                            ▼ Xuống
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(index)}
                            className="rounded px-1.5 py-0.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition ml-1"
                            title="Xóa khối này"
                          >
                            ✕ Xóa
                          </button>
                        </div>
                      </div>

                      {block.type === "h2" && (
                        <div>
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
                        <div className="space-y-3">
                          {block.src ? (
                            <div className="space-y-3">
                              {/* Preview Container */}
                              <div className="relative group overflow-hidden rounded-lg border border-slate-200 bg-slate-900/5 max-h-80 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={block.src}
                                  alt={block.alt[activeLang] || "Preview"}
                                  className="max-h-80 w-full object-contain rounded-md"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                                  <label className="cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-md hover:bg-blue-50 transition flex items-center gap-1.5">
                                    <span>📤</span> <span>Tải ảnh mới từ máy</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          handleDirectUpload(e.target.files[0], { type: "block", index });
                                        }
                                      }}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => setMediaModalTarget({ type: "block", index })}
                                    className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-md hover:bg-blue-50 transition flex items-center gap-1.5"
                                  >
                                    <span>🖼️</span> <span>Chọn từ Thư viện</span>
                                  </button>
                                  <a
                                    href={block.src}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white transition"
                                    title="Mở ảnh gốc trong tab mới"
                                  >
                                    Xem gốc ↗
                                  </a>
                                </div>
                              </div>

                              {/* Quick Action Bar under image */}
                              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2 rounded-md border border-slate-200 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <label className="cursor-pointer rounded border border-blue-600 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition flex items-center gap-1">
                                    <span>📤</span> <span>Đổi ảnh từ máy</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          handleDirectUpload(e.target.files[0], { type: "block", index });
                                        }
                                      }}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => setMediaModalTarget({ type: "block", index })}
                                    className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
                                  >
                                    <span>🖼️</span> <span>Thư viện Media</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveUrlInputBlock(activeUrlInputBlock === index ? null : index);
                                      setTempUrlValue(block.src);
                                    }}
                                    className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                                  >
                                    🔗 Đổi URL
                                  </button>
                                </div>

                                <span className="text-[11px] text-slate-500 truncate max-w-xs font-mono">
                                  {block.src.split("/").pop()?.slice(0, 32)}
                                </span>
                              </div>

                              {/* URL Input Form if toggled */}
                              {activeUrlInputBlock === index && (
                                <div className="flex gap-2 p-2 bg-blue-50/60 rounded border border-blue-200">
                                  <input
                                    type="text"
                                    value={tempUrlValue}
                                    onChange={(e) => setTempUrlValue(e.target.value)}
                                    placeholder="Dán đường dẫn ảnh (https://...)"
                                    className="flex-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs outline-none focus:border-blue-500 font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (tempUrlValue.trim()) {
                                        const updated = [...post.body];
                                        const b = updated[index];
                                        if (b.type === "image") {
                                          b.src = tempUrlValue.trim();
                                          setPost({ ...post, body: updated });
                                        }
                                      }
                                      setActiveUrlInputBlock(null);
                                    }}
                                    className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 transition"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveUrlInputBlock(null)}
                                    className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              )}

                              {/* SEO Alt & Caption */}
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[11px] font-bold text-slate-700">
                                      Thẻ Alt (Mô tả SEO {activeLang.toUpperCase()}):
                                    </label>
                                    <span className="text-[10px] text-blue-600 font-medium">Chuẩn SEO Google</span>
                                  </div>
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
                                    placeholder="Mô tả nội dung bức ảnh cho Google..."
                                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    Ví dụ: Sơ đồ phễu chuyển đổi ASO game mobile tại Việt Nam
                                  </p>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[11px] font-bold text-slate-700">
                                      Chú thích hiển thị (Caption {activeLang.toUpperCase()}):
                                    </label>
                                    <span className="text-[10px] text-slate-400">Dưới ảnh</span>
                                  </div>
                                  <input
                                    type="text"
                                    value={block.caption ? block.caption[activeLang] || "" : ""}
                                    onChange={(e) => {
                                      const updated = [...post.body];
                                      const b = updated[index];
                                      if (b.type === "image") {
                                        if (!b.caption) b.caption = { vi: "", en: "" };
                                        b.caption[activeLang] = e.target.value;
                                        setPost({ ...post, body: updated });
                                      }
                                    }}
                                    placeholder="Dòng chú thích hiển thị ngay dưới ảnh..."
                                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    Ví dụ: Hình 1: Dữ liệu đo lường chiến dịch trong 30 ngày đầu
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Empty State / Dropzone */
                            <div
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files?.[0]) {
                                  handleDirectUpload(e.dataTransfer.files[0], { type: "block", index });
                                }
                              }}
                              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/40 p-6 text-center transition hover:bg-blue-50"
                            >
                              <div className="mb-2 text-3xl">🖼️</div>
                              <h4 className="text-sm font-bold text-slate-800">Thêm hình ảnh vào bài viết</h4>
                              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                                Kéo thả tệp ảnh vào đây hoặc chọn một trong các cách bên dưới:
                              </p>

                              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                <label className="cursor-pointer rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition flex items-center gap-1.5">
                                  <span>📤</span> <span>Tải ảnh từ máy tính</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        handleDirectUpload(e.target.files[0], { type: "block", index });
                                      }
                                    }}
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => setMediaModalTarget({ type: "block", index })}
                                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition flex items-center gap-1.5"
                                >
                                  <span>🖼️</span> <span>Chọn từ Thư viện Media</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveUrlInputBlock(index);
                                    setTempUrlValue("");
                                  }}
                                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition flex items-center gap-1"
                                >
                                  <span>🔗</span> <span>Dán link URL</span>
                                </button>
                              </div>

                              {activeUrlInputBlock === index && (
                                <div className="mt-3 flex w-full max-w-md gap-2">
                                  <input
                                    type="text"
                                    value={tempUrlValue}
                                    onChange={(e) => setTempUrlValue(e.target.value)}
                                    placeholder="Dán link ảnh (https://...)"
                                    className="flex-1 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (tempUrlValue.trim()) {
                                        const updated = [...post.body];
                                        const b = updated[index];
                                        if (b.type === "image") {
                                          b.src = tempUrlValue.trim();
                                          setPost({ ...post, body: updated });
                                        }
                                      }
                                      setActiveUrlInputBlock(null);
                                    }}
                                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                                  >
                                    Dùng ảnh
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* In-between Inserter */}
                    <div className="relative py-1 group/mid my-1">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-dashed border-slate-200 group-hover/mid:border-blue-400 transition-colors" />
                      </div>
                      <div className="relative flex justify-center opacity-0 group-hover/mid:opacity-100 transition-opacity">
                        <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-md border border-blue-200 text-xs">
                          <span className="text-[10px] font-bold text-slate-600 mr-1">+ Chèn vào đây:</span>
                          <button type="button" onClick={() => insertBlock("p", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-blue-50 font-medium">¶ Đoạn văn</button>
                          <button type="button" onClick={() => insertBlock("h2", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-blue-50 font-medium">H2 Tiêu đề</button>
                          <button type="button" onClick={() => insertBlock("image", index + 1)} className="rounded px-2 py-0.5 text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold flex items-center gap-1">🖼️ Chèn Ảnh</button>
                          <button type="button" onClick={() => insertBlock("ul", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-blue-50 font-medium">•≡ Danh sách</button>
                          <button type="button" onClick={() => insertBlock("quote", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-blue-50 font-medium">“ Trích dẫn</button>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
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
          <div className="rounded border border-[#ccd0d4] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#ccd0d4] bg-[#f6f7f7] px-3.5 py-2 text-xs font-bold text-[#1d2327] flex items-center justify-between">
              <span>Ảnh đại diện (Featured Image)</span>
              {post.cover && <span className="text-[10px] text-emerald-600 font-bold">✓ Đã thiết lập</span>}
            </div>
            <div className="p-3.5 text-xs text-[#646970] space-y-3">
              {post.cover ? (
                <div className="space-y-2">
                  <div
                    onClick={() => setMediaModalTarget({ type: "cover" })}
                    className="relative aspect-[16/10] overflow-hidden rounded border border-slate-200 bg-[#f0f0f1] cursor-pointer group shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover} alt="Cover" className="h-full w-full object-cover transition group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                      🔄 Nhấp để đổi ảnh
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <label className="flex-1 text-center cursor-pointer rounded border border-blue-600 bg-blue-50 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition">
                        <span>📤 Tải từ máy</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleDirectUpload(e.target.files[0], { type: "cover" });
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaModalTarget({ type: "cover" })}
                        className="flex-1 rounded border border-slate-300 bg-white py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        🖼️ Thư viện
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPost({ ...post, cover: "" })}
                      className="text-[11px] text-rose-600 hover:underline text-left mt-0.5"
                    >
                      🗑️ Gỡ ảnh đại diện này
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded border-2 border-dashed border-slate-300 bg-slate-50/60 p-4 text-center space-y-2">
                  <span className="text-2xl text-slate-400">🖼️</span>
                  <p className="text-[11px] text-slate-500">Chưa có ảnh đại diện cho bài viết</p>
                  <div className="flex flex-col w-full gap-1.5">
                    <label className="w-full text-center cursor-pointer rounded bg-blue-600 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition">
                      <span>📤 Tải ảnh từ máy tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleDirectUpload(e.target.files[0], { type: "cover" });
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setMediaModalTarget({ type: "cover" })}
                      className="w-full rounded border border-slate-300 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      🖼️ Chọn từ Thư viện Media
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Selector Modal */}
      {mediaModalTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white p-6 shadow-2xl border border-[#ccd0d4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#ccd0d4]">
              <div>
                <h3 className="font-display text-base font-bold text-[#1d2327]">
                  Thư viện Media ANBU (Chọn ảnh chèn vào bài)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mediaModalTarget.type === "cover"
                    ? "Đang chọn ảnh làm Ảnh đại diện bài viết"
                    : mediaModalTarget.type === "new_block"
                    ? "Đang chọn ảnh để chèn khối mới vào bài viết"
                    : `Đang chọn ảnh thay thế cho khối #${(mediaModalTarget.index ?? 0) + 1}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaModalTarget(null)}
                className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3">
              <MediaManager
                locale={locale}
                onSelectImage={(src) => {
                  if (mediaModalTarget.type === "cover") {
                    setPost((prev) => ({ ...prev, cover: src }));
                    setAiNotice("✅ Đã cập nhật ảnh đại diện thành công!");
                  } else if (mediaModalTarget.type === "new_block") {
                    insertBlock("image", mediaModalTarget.index, src);
                    setAiNotice("✅ Đã chèn khối ảnh mới vào bài viết thành công!");
                  } else if (mediaModalTarget.type === "block" && typeof mediaModalTarget.index === "number") {
                    const updated = [...post.body];
                    const block = updated[mediaModalTarget.index];
                    if (block && block.type === "image") {
                      block.src = src;
                      setPost((prev) => ({ ...prev, body: updated }));
                    }
                    setAiNotice("✅ Đã cập nhật ảnh minh họa thành công!");
                  }
                  setMediaModalTarget(null);
                  setTimeout(() => setAiNotice(null), 4000);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Post } from "@/content/posts";
import { blogCategories } from "@/content/posts";
import MediaManager from "@/components/admin/MediaManager";
import RankMathSEO from "@/components/admin/RankMathSEO";
import { supabase } from "@/lib/supabase";
import { renderRichText } from "@/lib/renderRichText";
import { translateWithGlossary, generateEnglishSlug } from "@/lib/seoGlossary";

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

// Client-side smart image compressor (Resizes to max 1920px and converts to WebP/JPEG to save 70% bandwidth)
async function compressImage(file: File): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
    return file;
  }
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1920;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            return resolve(file);
          }
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const compressedFile = new File([blob], `${baseName}.webp`, { type: "image/webp" });
          resolve(compressedFile);
        },
        "image/webp",
        0.85
      );
    };
    img.onerror = () => resolve(file);
    img.src = objectUrl;
  });
}

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

  // Instant screenshot paste from clipboard (Ctrl + V)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            setAiNotice("📥 Đã nhận diện ảnh chụp màn hình từ Clipboard (Ctrl + V)! Đang nén và chèn vào bài...");
            await handleDirectUpload(file, { type: "new_block" });
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [post.body]);

  // Auto-Save & Draft State
  const draftKey = `anbu_draft_${initialPost?.slug || "new"}`;
  const draftTimeKey = `${draftKey}_time`;
  const [autoSaveTime, setAutoSaveTime] = useState<string | null>(null);
  const [draftAvailable, setDraftAvailable] = useState<{ post: Post; time: string } | null>(null);

  // Device Preview Switcher State
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Zen Mode (Toàn màn hình) State
  const [isZenMode, setIsZenMode] = useState(false);

  // Document Outline Drawer / Navigator State
  const [showOutline, setShowOutline] = useState(false);

  // Undo / Redo History State
  const [history, setHistory] = useState<Post[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoRef = useRef(false);

  // Smart Import from Docs / Word State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importRawText, setImportRawText] = useState("");
  const [importMode, setImportMode] = useState<"append" | "replace">("append");
  const [importAutoTitle, setImportAutoTitle] = useState(true);

  // Initialize history with initial post
  useEffect(() => {
    if (history.length === 0 && post) {
      setHistory([post]);
      setHistoryIndex(0);
    }
  }, []);

  // Check for existing draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      const savedTime = localStorage.getItem(draftTimeKey);
      if (saved) {
        const parsed: Post = JSON.parse(saved);
        const isDifferent =
          parsed.title?.vi !== (initialPost?.title?.vi || "") ||
          parsed.body?.length !== (initialPost?.body?.length || 0);
        if (isDifferent && parsed.title?.vi) {
          setDraftAvailable({ post: parsed, time: savedTime || "trước đó" });
        }
      }
    } catch (e) {
      console.error("Error checking draft:", e);
    }
  }, [draftKey]);

  // Debounced auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (post.title.vi || post.body.length > 0) {
        try {
          const nowStr = new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          localStorage.setItem(draftKey, JSON.stringify(post));
          localStorage.setItem(draftTimeKey, nowStr);
          setAutoSaveTime(nowStr);
        } catch (e) {
          console.error("Error auto-saving draft:", e);
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [post, draftKey, draftTimeKey]);

  // Update history on debounced change
  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setHistory((prev) => {
        const currentSlice = prev.slice(0, historyIndex + 1);
        if (currentSlice.length > 0 && JSON.stringify(currentSlice[currentSlice.length - 1]) === JSON.stringify(post)) {
          return prev;
        }
        const nextHist = [...currentSlice, post].slice(-30);
        setHistoryIndex(nextHist.length - 1);
        return nextHist;
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [post]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      const targetState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setPost(targetState);
      setAiNotice("↩️ Đã hoàn tác thao tác (Undo)!");
      setTimeout(() => setAiNotice(null), 2500);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      const targetState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setPost(targetState);
      setAiNotice("↪️ Đã làm lại thao tác (Redo)!");
      setTimeout(() => setAiNotice(null), 2500);
    }
  };

  // Keyboard shortcut listener for Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z, and Escape for Zen Mode & Outline
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZenMode) setIsZenMode(false);
        if (showOutline) setShowOutline(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZenMode, showOutline, historyIndex, history]);

  const handleRestoreDraft = () => {
    if (draftAvailable) {
      setPost(draftAvailable.post);
      setDraftAvailable(null);
      setAiNotice(`✅ Đã khôi phục bản nháp từ lúc ${draftAvailable.time}!`);
      setTimeout(() => setAiNotice(null), 4000);
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(draftKey);
      localStorage.removeItem(draftTimeKey);
    } catch {}
    setDraftAvailable(null);
    setAiNotice("🗑️ Đã xóa bản nháp cũ.");
    setTimeout(() => setAiNotice(null), 3000);
  };

  const handleManualSaveDraft = () => {
    try {
      const nowStr = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      localStorage.setItem(draftKey, JSON.stringify(post));
      localStorage.setItem(draftTimeKey, nowStr);
      setAutoSaveTime(nowStr);
      setAiNotice(`💾 Đã lưu nháp vào bộ nhớ trình duyệt lúc ${nowStr}!`);
      setTimeout(() => setAiNotice(null), 3000);
    } catch {
      alert("Không thể lưu bản nháp vào trình duyệt.");
    }
  };

  // Smart Parse Text to Blocks
  const parseRawTextToBlocks = (raw: string) => {
    const lines = raw.replace(/\r\n/g, "\n").split("\n");
    const blocks: any[] = [];
    let detectedTitle: string | undefined = undefined;
    const stats = { h2: 0, p: 0, ul: 0, quote: 0, image: 0 };

    let currentParagraph: string[] = [];
    let currentList: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ").trim();
        if (text) {
          blocks.push({
            type: "p",
            text: { vi: text, en: "" },
          });
          stats.p++;
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        blocks.push({
          type: "ul",
          items: currentList.map((item) => ({ vi: item, en: "" })),
        });
        stats.ul++;
        currentList = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        flushParagraph();
        flushList();
        continue;
      }

      // 1. Image
      const imgMatch = line.match(/^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
      const isImgUrl = /^https?:\/\/[^\s]+\.(png|jpe?g|webp|gif|svg)(\?[^\s]*)?$/i.test(line);
      if (imgMatch || isImgUrl) {
        flushParagraph();
        flushList();
        const src = imgMatch ? imgMatch[2] : line;
        const alt = imgMatch ? imgMatch[1] : "Hình ảnh bài viết";
        blocks.push({
          type: "image",
          src,
          alt: { vi: alt, en: "" },
          caption: { vi: "", en: "" },
        });
        stats.image++;
        continue;
      }

      // 2. Quote
      if (line.startsWith(">")) {
        flushParagraph();
        flushList();
        const quoteText = line.replace(/^>\s*/, "").trim();
        if (quoteText) {
          blocks.push({
            type: "quote",
            text: { vi: quoteText, en: "" },
          });
          stats.quote++;
        }
        continue;
      }

      // 3. Markdown Headings
      const mdHeadingMatch = line.match(/^(#{1,4})\s+(.+)$/);
      if (mdHeadingMatch) {
        flushParagraph();
        flushList();
        const hText = mdHeadingMatch[2].trim();
        if (!detectedTitle && mdHeadingMatch[1].length === 1 && importAutoTitle) {
          detectedTitle = hText;
        } else {
          blocks.push({
            type: "h2",
            text: { vi: hText, en: "" },
          });
          stats.h2++;
        }
        continue;
      }

      // 4. Numbered Headings (e.g. "1. Tiêu đề", "Phần 1: Giới thiệu", "I. Tổng quan")
      const numHeadingMatch = line.match(/^(?:\d+[\.\)]|(?:Phần|Chương|Mục|Bài)\s+\d+[:\.]?|[IVXLCDM]+[\.\)])\s+(.+)$/i);
      if (numHeadingMatch && line.length < 150) {
        flushParagraph();
        flushList();
        blocks.push({
          type: "h2",
          text: { vi: line, en: "" },
        });
        stats.h2++;
        continue;
      }

      // 5. Bullet List items
      const listMatch = line.match(/^[-*+•]\s+(.+)$/);
      if (listMatch) {
        flushParagraph();
        currentList.push(listMatch[1].trim());
        continue;
      }

      // Paragraph
      if (currentList.length > 0) {
        flushList();
      }
      currentParagraph.push(line);
    }

    flushParagraph();
    flushList();

    return { title: detectedTitle, blocks, stats };
  };

  const handleExecuteImport = () => {
    if (!importRawText.trim()) return;
    const { title: detectedTitle, blocks: newBlocks, stats } = parseRawTextToBlocks(importRawText);

    if (newBlocks.length === 0) {
      alert("Không tìm thấy nội dung hợp lệ để nhập.");
      return;
    }

    let updatedTitle = post.title;
    if (detectedTitle && importAutoTitle && (!post.title.vi || post.title.vi.startsWith("Bài viết mới"))) {
      updatedTitle = { ...post.title, vi: detectedTitle };
    }

    const updatedBody = importMode === "replace" ? newBlocks : [...post.body, ...newBlocks];

    setPost((prev) => ({
      ...prev,
      title: updatedTitle,
      body: updatedBody,
    }));

    setShowImportModal(false);
    setImportRawText("");
    setAiNotice(
      `📥 Đã nhập thành công ${newBlocks.length} khối (${stats.h2} tiêu đề, ${stats.p} đoạn văn, ${stats.ul} danh sách, ${stats.image} ảnh, ${stats.quote} trích dẫn)!`
    );
    setTimeout(() => setAiNotice(null), 5000);
  };

  // Enhanced inline formatting helper with text selection support
  const applyInlineFormatting = (
    blockIndex: number,
    format: "bold" | "italic" | "link",
    itemIndex?: number
  ) => {
    const activeEl = typeof document !== "undefined" ? (document.activeElement as HTMLInputElement | HTMLTextAreaElement | null) : null;
    let selectedText = "";
    if (activeEl && (activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT")) {
      const start = activeEl.selectionStart ?? 0;
      const end = activeEl.selectionEnd ?? 0;
      if (end > start) {
        selectedText = activeEl.value.substring(start, end);
      }
    }

    const currentText =
      typeof itemIndex === "number"
        ? (post.body[blockIndex] as any).items[itemIndex][activeLang] || ""
        : (post.body[blockIndex] as any).text[activeLang] || "";

    let newText = currentText;

    if (selectedText) {
      if (format === "bold") {
        newText = currentText.replace(selectedText, `**${selectedText}**`);
      } else if (format === "italic") {
        newText = currentText.replace(selectedText, `*${selectedText}*`);
      } else if (format === "link") {
        const url = prompt("Nhập đường dẫn URL liên kết:", "https://anbu.asia");
        if (!url) return;
        newText = currentText.replace(selectedText, `[${selectedText}](${url})`);
      }
    } else {
      if (format === "bold") {
        newText = currentText ? `${currentText} **từ khóa**` : "**từ khóa in đậm**";
      } else if (format === "italic") {
        newText = currentText ? `${currentText} *từ khóa*` : "*từ khóa in nghiêng*";
      } else if (format === "link") {
        const url = prompt("Nhập đường dẫn URL liên kết:", "https://anbu.asia");
        if (!url) return;
        newText = currentText ? `${currentText} [văn bản liên kết](${url})` : `[văn bản liên kết](${url})`;
      }
    }

    if (typeof itemIndex === "number") {
      const block = post.body[blockIndex];
      if (block.type === "ol") {
        updateOrderedListItem(blockIndex, itemIndex, newText);
      } else {
        updateListItem(blockIndex, itemIndex, newText);
      }
    } else {
      updateBlock(blockIndex, newText);
    }
  };

  // Keyboard shortcut handler for textareas and inputs (Ctrl + B, Ctrl + I, Ctrl + K)
  const handleInlineKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    blockIndex: number,
    itemIndex?: number
  ) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
      e.preventDefault();
      applyInlineFormatting(blockIndex, "bold", itemIndex);
    } else if ((e.ctrlKey || e.metaKey) && (e.key === "i" || e.key === "I")) {
      e.preventDefault();
      applyInlineFormatting(blockIndex, "italic", itemIndex);
    } else if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      applyInlineFormatting(blockIndex, "link", itemIndex);
    }
  };

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
    insertBlock("faq");
    setAiNotice("✅ Đã thêm khối FAQ Schema chuyên dụng (Tự động tạo Google Rich Snippets)!");
    setTimeout(() => setAiNotice(null), 4000);
  };

  // Auto Translate Vietnamese to English with Keyword Preservation & SEO Slug Generator
  const handleAutoTranslateToEnglish = async () => {
    setAiNotice("🌐 Đang quét thuật ngữ Game Marketing & bảo toàn từ khóa SEO để dịch sang Tiếng Anh...");
    try {
      // 1. Determine focus keywords
      const titleVi = post.title.vi || "";
      const suggestedKwVi = titleVi.split(/[:\-, |]/)[0]?.trim() || "";
      const enFocusKeyword = suggestedKwVi ? await translateWithGlossary(suggestedKwVi) : undefined;

      // 2. Translate Title & Excerpt with keyword protection
      const enTitle = titleVi
        ? await translateWithGlossary(titleVi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
        : "";
      const enExcerpt = post.excerpt.vi
        ? await translateWithGlossary(post.excerpt.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
        : "";

      // 3. Generate English SEO Slug automatically
      const generatedSlugEn = generateEnglishSlug(enTitle || titleVi, enFocusKeyword);

      // 4. Translate Blocks with keyword protection
      const newBody = await Promise.all(
        post.body.map(async (block) => {
          if (block.type === "p" || block.type === "h2" || block.type === "h3" || block.type === "quote") {
            const enText = block.text.vi
              ? await translateWithGlossary(block.text.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
              : "";
            return {
              ...block,
              text: { ...block.text, en: enText },
            };
          }
          if (block.type === "ul" || block.type === "ol") {
            const translatedItems = await Promise.all(
              block.items.map(async (item) => {
                const enItem = item.vi
                  ? await translateWithGlossary(item.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
                  : "";
                return { ...item, en: enItem };
              })
            );
            return {
              ...block,
              items: translatedItems,
            };
          }
          if (block.type === "divider") {
            return { ...block };
          }
          if (block.type === "faq") {
            const translatedItems = await Promise.all(
              block.items.map(async (it) => {
                const enQ = it.question.vi
                  ? await translateWithGlossary(it.question.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
                  : "";
                const enA = it.answer.vi
                  ? await translateWithGlossary(it.answer.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
                  : "";
                return {
                  question: { vi: it.question.vi, en: enQ },
                  answer: { vi: it.answer.vi, en: enA },
                };
              })
            );
            return {
              ...block,
              items: translatedItems,
            };
          }
          if (block.type === "callout") {
            const enText = block.text.vi
              ? await translateWithGlossary(block.text.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
              : "";
            const enTitle = block.title?.vi
              ? await translateWithGlossary(block.title.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
              : undefined;
            return {
              ...block,
              title: enTitle ? { vi: block.title?.vi || "", en: enTitle } : block.title,
              text: { ...block.text, en: enText },
            };
          }
          if (block.type === "table") {
            const enCaption = block.caption?.vi
              ? await translateWithGlossary(block.caption.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
              : undefined;
            const enHeaders = await Promise.all(
              block.headers.map(async (h) => ({
                ...h,
                en: h.vi ? await translateWithGlossary(h.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword }) : "",
              }))
            );
            const enRows = await Promise.all(
              block.rows.map(async (row) =>
                Promise.all(
                  row.map(async (cell) => ({
                    ...cell,
                    en: cell.vi ? await translateWithGlossary(cell.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword }) : "",
                  }))
                )
              )
            );
            return {
              ...block,
              caption: enCaption ? { vi: block.caption?.vi || "", en: enCaption } : block.caption,
              headers: enHeaders,
              rows: enRows,
            };
          }
          if (block.type === "image") {
            const enAlt = block.alt.vi
              ? await translateWithGlossary(block.alt.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
              : "";
            const enCaption = block.caption?.vi
              ? await translateWithGlossary(block.caption.vi, { focusKeywordVi: suggestedKwVi, focusKeywordEn: enFocusKeyword })
              : undefined;
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
        slug_en: prev.slug_en || generatedSlugEn,
        title: { ...prev.title, en: enTitle },
        excerpt: { ...prev.excerpt, en: enExcerpt },
        body: newBody,
      }));

      setActiveLang("en");
      setAiNotice(
        `✅ Đã dịch xong sang Tiếng Anh & bảo toàn từ khóa chuyên ngành! Slug quốc tế: "${generatedSlugEn}". Đã chuyển sang tab English.`
      );
      setTimeout(() => setAiNotice(null), 6000);
    } catch (err: any) {
      console.error(err);
      setAiNotice("⚠️ Có lỗi khi dịch tự động. Bạn có thể thử lại hoặc sử dụng nút 'Sao chép Tiếng Việt sang EN'.");
      setTimeout(() => setAiNotice(null), 4000);
    }
  };

  const handleCloneViToEn = () => {
    const clonedBody = post.body.map((block) => {
      if (block.type === "p" || block.type === "h2" || block.type === "h3" || block.type === "quote") {
        return { ...block, text: { ...block.text, en: block.text.vi || "" } };
      }
      if (block.type === "callout") {
        return {
          ...block,
          title: block.title ? { ...block.title, en: block.title.vi || "" } : undefined,
          text: { ...block.text, en: block.text.vi || "" },
        };
      }
      if (block.type === "table") {
        return {
          ...block,
          caption: block.caption ? { ...block.caption, en: block.caption.vi || "" } : undefined,
          headers: block.headers.map((h) => ({ ...h, en: h.vi || "" })),
          rows: block.rows.map((row) => row.map((cell) => ({ ...cell, en: cell.vi || "" }))),
        };
      }
      if (block.type === "ul" || block.type === "ol") {
        return { ...block, items: block.items.map((i) => ({ ...i, en: i.vi || "" })) };
      }
      if (block.type === "divider") {
        return { ...block };
      }
      if (block.type === "faq") {
        return {
          ...block,
          items: block.items.map((it) => ({
            question: { ...it.question, en: it.question.vi || "" },
            answer: { ...it.answer, en: it.answer.vi || "" },
          })),
        };
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
    if (block.type === "p" || block.type === "h2" || block.type === "h3" || block.type === "quote") {
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

  const updateOrderedListItem = (blockIndex: number, itemIndex: number, text: string) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "ol") {
      block.items[itemIndex][activeLang] = text;
      setPost({ ...post, body: updated });
    }
  };

  const addOrderedListItem = (blockIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "ol") {
      block.items.push({ vi: `Bước ${block.items.length + 1}...`, en: `Step ${block.items.length + 1}...` });
      setPost({ ...post, body: updated });
    }
  };

  const removeOrderedListItem = (blockIndex: number, itemIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "ol" && block.items.length > 1) {
      block.items.splice(itemIndex, 1);
      setPost({ ...post, body: updated });
    }
  };

  const addFaqItem = (blockIndex: number) => {
    const updated = [...post.body];
    const b = updated[blockIndex];
    if (b && b.type === "faq") {
      b.items.push({
        question: { vi: "Câu hỏi mới...", en: "New question..." },
        answer: { vi: "Câu trả lời chi tiết...", en: "Detailed answer..." },
      });
      setPost({ ...post, body: updated });
    }
  };

  const removeFaqItem = (blockIndex: number, itemIndex: number) => {
    const updated = [...post.body];
    const b = updated[blockIndex];
    if (b && b.type === "faq" && b.items.length > 1) {
      b.items.splice(itemIndex, 1);
      setPost({ ...post, body: updated });
    }
  };

  const updateFaqItem = (
    blockIndex: number,
    itemIndex: number,
    field: "question" | "answer",
    text: string
  ) => {
    const updated = [...post.body];
    const b = updated[blockIndex];
    if (b && b.type === "faq") {
      if (!b.items[itemIndex]) {
        b.items[itemIndex] = { question: { vi: "", en: "" }, answer: { vi: "", en: "" } };
      }
      b.items[itemIndex][field][activeLang] = text;
      setPost({ ...post, body: updated });
    }
  };

  const updateCallout = (index: number, field: "text" | "title" | "variant", val: string) => {
    const updated = [...post.body];
    const block = updated[index];
    if (block && block.type === "callout") {
      if (field === "variant") {
        block.variant = val as "info" | "tip" | "warning";
      } else if (field === "title") {
        if (!block.title) block.title = { vi: "", en: "" };
        block.title[activeLang] = val;
      } else if (field === "text") {
        block.text[activeLang] = val;
      }
      setPost({ ...post, body: updated });
    }
  };

  const updateTableHeader = (blockIndex: number, colIndex: number, text: string) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "table") {
      if (!block.headers[colIndex]) block.headers[colIndex] = { vi: "", en: "" };
      block.headers[colIndex][activeLang] = text;
      setPost({ ...post, body: updated });
    }
  };

  const updateTableCell = (blockIndex: number, rowIndex: number, colIndex: number, text: string) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "table") {
      if (!block.rows[rowIndex]) block.rows[rowIndex] = [];
      if (!block.rows[rowIndex][colIndex]) block.rows[rowIndex][colIndex] = { vi: "", en: "" };
      block.rows[rowIndex][colIndex][activeLang] = text;
      setPost({ ...post, body: updated });
    }
  };

  const updateTableCaption = (blockIndex: number, text: string) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "table") {
      if (!block.caption) block.caption = { vi: "", en: "" };
      block.caption[activeLang] = text;
      setPost({ ...post, body: updated });
    }
  };

  const addTableRow = (blockIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "table") {
      const newRow = block.headers.map((_, i) => ({ vi: `Dữ liệu ${i + 1}`, en: `Data ${i + 1}` }));
      block.rows.push(newRow);
      setPost({ ...post, body: updated });
    }
  };

  const removeTableRow = (blockIndex: number, rowIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "table" && block.rows.length > 1) {
      block.rows.splice(rowIndex, 1);
      setPost({ ...post, body: updated });
    }
  };

  const addTableColumn = (blockIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "table") {
      block.headers.push({ vi: `Cột ${block.headers.length + 1}`, en: `Col ${block.headers.length + 1}` });
      block.rows.forEach((row) => row.push({ vi: "-", en: "-" }));
      setPost({ ...post, body: updated });
    }
  };

  const removeTableColumn = (blockIndex: number, colIndex: number) => {
    const updated = [...post.body];
    const block = updated[blockIndex];
    if (block && block.type === "table" && block.headers.length > 1) {
      block.headers.splice(colIndex, 1);
      block.rows.forEach((row) => row.splice(colIndex, 1));
      setPost({ ...post, body: updated });
    }
  };

  const duplicateBlock = (index: number) => {
    const updated = [...post.body];
    const target = updated[index];
    if (!target) return;
    const clone = JSON.parse(JSON.stringify(target));
    updated.splice(index + 1, 0, clone);
    setPost({ ...post, body: updated });
    setAiNotice(`📋 Đã nhân bản khối #${index + 1} thành công!`);
    setTimeout(() => setAiNotice(null), 3000);
  };

  const insertBlock = (
    type: "p" | "h2" | "h3" | "quote" | "ul" | "ol" | "divider" | "image" | "callout" | "table" | "faq",
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
    } else if (type === "h3") {
      newBlock = { type: "h3", text: { vi: "Tiêu đề phụ mục con (Heading 3)", en: "Subheading (Heading 3)" } };
    } else if (type === "quote") {
      newBlock = { type: "quote", text: { vi: "Trích dẫn số liệu hoặc nhận định chuyên gia...", en: "Key expert quote..." } };
    } else if (type === "callout") {
      newBlock = {
        type: "callout",
        variant: "info",
        title: { vi: "Lưu ý chiến lược quan trọng", en: "Key Strategic Insight" },
        text: { vi: "Nhập nội dung lưu ý, lời khuyên hoặc mẹo thực chiến tại đây...", en: "Enter actionable advice or key tip here..." },
      };
    } else if (type === "table") {
      newBlock = {
        type: "table",
        caption: { vi: "Bảng dữ liệu phân tích chi tiết", en: "Detailed comparative data table" },
        headers: [
          { vi: "Kênh / Tiêu chí", en: "Channel / Criteria" },
          { vi: "Chi phí CPI", en: "CPI Cost" },
          { vi: "Hiệu quả ROAS", en: "ROAS Efficiency" },
          { vi: "Đánh giá", en: "Assessment" },
        ],
        rows: [
          [
            { vi: "TikTok Ads", en: "TikTok Ads" },
            { vi: "$0.35 - $0.70", en: "$0.35 - $0.70" },
            { vi: "180% - 240%", en: "180% - 240%" },
            { vi: "⭐⭐⭐⭐ Tối ưu giới trẻ", en: "⭐⭐⭐⭐ High viral potential" },
          ],
          [
            { vi: "Facebook / Meta", en: "Facebook / Meta" },
            { vi: "$0.80 - $1.40", en: "$0.80 - $1.40" },
            { vi: "140% - 190%", en: "140% - 190%" },
            { vi: "⭐⭐⭐⭐ Phổ thông", en: "⭐⭐⭐⭐ Broad reach" },
          ],
        ],
      };
    } else if (type === "ul") {
      newBlock = {
        type: "ul",
        items: [
          { vi: "Điểm nổi bật 1...", en: "Highlight item 1..." },
          { vi: "Điểm nổi bật 2...", en: "Highlight item 2..." },
        ],
      };
    } else if (type === "ol") {
      newBlock = {
        type: "ol",
        items: [
          { vi: "Bước 1: Khởi động và chuẩn bị dữ liệu...", en: "Step 1: Setup and data preparation..." },
          { vi: "Bước 2: Triển khai thử nghiệm A/B Testing...", en: "Step 2: Execute A/B Testing..." },
          { vi: "Bước 3: Tối ưu hóa và mở rộng ngân sách...", en: "Step 3: Optimization and scaling..." },
        ],
      };
    } else if (type === "divider") {
      newBlock = { type: "divider" };
    } else if (type === "faq") {
      newBlock = {
        type: "faq",
        items: [
          {
            question: { vi: "Chi phí triển khai dịch vụ tại ANBU là bao nhiêu?", en: "What is the implementation cost at ANBU?" },
            answer: { vi: "Ngân sách được tối ưu linh hoạt tùy theo giai đoạn của sản phẩm game từ Soft Launch đến Full Scale.", en: "Budget is flexibly tailored according to the game product stage from Soft Launch to Full Scale." },
          },
          {
            question: { vi: "Mất bao lâu để thấy hiệu quả chiến dịch tăng trưởng?", en: "How long until we see growth campaign results?" },
            answer: { vi: "Các chỉ số CPI và chuyển đổi bước đầu thường được đo lường chính xác ngay trong 7 đến 14 ngày đầu tiên.", en: "Initial CPI and conversion metrics are typically tracked accurately within the first 7 to 14 days." },
          },
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

  const addBlock = (type: "p" | "h2" | "h3" | "quote" | "ul" | "ol" | "divider" | "image" | "callout" | "table" | "faq") => {
    insertBlock(type);
  };

  const handleDirectUpload = async (
    file: File,
    target: MediaModalTarget
  ) => {
    if (!file) return;
    const optimizedFile = await compressImage(file);
    const targetKey = target.type === "cover" ? "cover" : String(target.index ?? "new");
    setUploadingTarget(targetKey);
    setAiNotice(`⏳ Đang tối ưu & tải ảnh "${optimizedFile.name}" (${Math.round(optimizedFile.size / 1024)} KB) lên Cloud...`);

    try {
      const ext = optimizedFile.name.split(".").pop() || "webp";
      const cleanName = optimizedFile.name
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
      if (block.type === "p" || block.type === "h2" || block.type === "h3" || block.type === "quote") {
        return {
          ...block,
          text: {
            vi: block.text.vi || "",
            en: block.text.en?.trim() || block.text.vi || "",
          },
        };
      }
      if (block.type === "ul" || block.type === "ol") {
        return {
          ...block,
          items: block.items.map((i) => ({
            vi: i.vi || "",
            en: i.en?.trim() || i.vi || "",
          })),
        };
      }
      if (block.type === "faq") {
        return {
          ...block,
          items: block.items.map((item) => ({
            question: {
              vi: item.question.vi || "",
              en: item.question.en?.trim() || item.question.vi || "",
            },
            answer: {
              vi: item.answer.vi || "",
              en: item.answer.en?.trim() || item.answer.vi || "",
            },
          })),
        };
      }
      if (block.type === "callout") {
        return {
          ...block,
          variant: block.variant || "info",
          title: block.title
            ? {
                vi: block.title.vi || "",
                en: block.title.en?.trim() || block.title.vi || "",
              }
            : undefined,
          text: {
            vi: block.text.vi || "",
            en: block.text.en?.trim() || block.text.vi || "",
          },
        };
      }
      if (block.type === "table") {
        return {
          ...block,
          caption: block.caption
            ? {
                vi: block.caption.vi || "",
                en: block.caption.en?.trim() || block.caption.vi || "",
              }
            : undefined,
          headers: block.headers.map((h) => ({
            vi: h.vi || "",
            en: h.en?.trim() || h.vi || "",
          })),
          rows: block.rows.map((row) =>
            row.map((cell) => ({
              vi: cell.vi || "",
              en: cell.en?.trim() || cell.vi || "",
            }))
          ),
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

    const cleanSlugEn = post.slug_en ? generateEnglishSlug(post.slug_en) : undefined;

    const finalPost: Post = {
      ...post,
      title: { vi: post.title.vi, en: titleEn },
      excerpt: { vi: post.excerpt.vi, en: excerptEn },
      body: safeBody,
      slug: cleanSlug,
      ...(cleanSlugEn ? { slug_en: cleanSlugEn } : {}),
      readingTime,
    };

    try {
      localStorage.removeItem(draftKey);
      localStorage.removeItem(draftTimeKey);
      setDraftAvailable(null);
    } catch {}

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
    if (b.type === "p" || b.type === "h2" || b.type === "h3" || b.type === "quote") {
      return acc + (b.text[activeLang] || "").split(/\s+/).filter(Boolean).length;
    }
    if (b.type === "ul" || b.type === "ol") {
      return acc + b.items.reduce((s, it) => s + (it[activeLang] || "").split(/\s+/).filter(Boolean).length, 0);
    }
    if (b.type === "faq") {
      return (
        acc +
        b.items.reduce(
          (s, it) =>
            s +
            (it.question[activeLang] || "").split(/\s+/).filter(Boolean).length +
            (it.answer[activeLang] || "").split(/\s+/).filter(Boolean).length,
          0
        )
      );
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium" title="Hệ thống tự động lưu bản nháp vào trình duyệt sau mỗi 2.5 giây chỉnh sửa">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {autoSaveTime ? `Đã lưu ${autoSaveTime}` : "Tự động lưu nháp"}
          </span>
          <button
            type="button"
            onClick={() => setIsZenMode(true)}
            className="rounded border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-xs hover:bg-indigo-100 transition flex items-center gap-1.5"
            title="Mở không gian soạn thảo toàn màn hình không phân tâm"
          >
            <span>⛶</span> <span>Toàn màn hình</span>
          </button>
          <div className="flex items-center rounded border border-[#ccd0d4] bg-white p-0.5 shadow-xs">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="px-2 py-1 text-xs font-semibold text-[#2c3338] hover:bg-[#f6f7f7] disabled:opacity-30 transition rounded"
              title="Hoàn tác (Ctrl + Z)"
            >
              ↩️
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="px-2 py-1 text-xs font-semibold text-[#2c3338] hover:bg-[#f6f7f7] disabled:opacity-30 transition rounded"
              title="Làm lại (Ctrl + Y)"
            >
              ↪️
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowOutline(!showOutline)}
            className={`rounded border px-2.5 py-1.5 text-xs font-semibold shadow-xs transition flex items-center gap-1 ${
              showOutline
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-[#8c8f94] bg-white text-[#2c3338] hover:bg-[#f6f7f7]"
            }`}
            title="Mục lục các phân đoạn H2 & H3 trong bài viết"
          >
            <span>📑</span>
            <span>Mục lục ({post.body.filter((b) => b.type === "h2" || b.type === "h3").length})</span>
          </button>
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

      {draftAvailable && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💾</span>
            <div>
              <p className="font-bold">
                Tìm thấy bản lưu nháp lúc {draftAvailable.time} ({draftAvailable.post.title.vi || "Chưa có tiêu đề"})
              </p>
              <p className="text-[11px] text-amber-700">
                Hệ thống tự động lưu bản sửa đổi gần nhất của bạn trên máy này. Bạn có muốn khôi phục lại không?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="rounded bg-amber-600 px-3.5 py-1.5 font-bold text-white shadow-xs hover:bg-amber-700 transition cursor-pointer"
            >
              Khôi phục bản nháp
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="rounded border border-amber-400 bg-white px-3 py-1.5 font-semibold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
            >
              Bỏ qua & Xóa nháp
            </button>
          </div>
        </div>
      )}

      {/* Document Outline Quick Jump Drawer */}
      {showOutline && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <span>📑</span>
              <span>Mục lục phân đoạn bài viết (Bấm để nhảy nhanh đến khối soạn thảo):</span>
            </div>
            <button
              type="button"
              onClick={() => setShowOutline(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-0.5 rounded hover:bg-blue-100 transition"
            >
              ✕ Đóng
            </button>
          </div>
          {post.body.filter((b) => b.type === "h2" || b.type === "h3").length === 0 ? (
            <p className="text-xs text-slate-500 italic">Bài viết chưa có tiêu đề H2 hoặc H3 nào. Hãy thêm khối H2 / H3 để cấu trúc bài viết chuẩn SEO.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {post.body.map((b, idx) => {
                if (b.type !== "h2" && b.type !== "h3") return null;
                const isH3 = b.type === "h3";
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(`editor-block-${idx}`);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                        el.classList.add("ring-2", isH3 ? "ring-indigo-500" : "ring-blue-500");
                        setTimeout(() => el.classList.remove("ring-2", isH3 ? "ring-indigo-500" : "ring-blue-500"), 2000);
                      }
                    }}
                    className={`text-left rounded-md border p-2.5 text-xs font-medium transition flex items-start gap-2 shadow-xs group ${
                      isH3
                        ? "border-indigo-200 bg-indigo-50/50 text-indigo-950 ml-2 hover:bg-indigo-100/60 hover:border-indigo-400"
                        : "border-blue-200 bg-white text-blue-900 hover:bg-blue-100/60 hover:border-blue-400"
                    }`}
                  >
                    <span
                      className={`shrink-0 rounded font-mono text-[10px] px-1.5 py-0.5 font-bold ${
                        isH3 ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {isH3 ? "H3" : "H2"} #{idx + 1}
                    </span>
                    <span className="line-clamp-2 group-hover:text-blue-700">
                      {b.text[activeLang] || (isH3 ? "Tiêu đề H3 trống..." : "Tiêu đề H2 trống...")}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

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

            {/* Permalink Slug Preview & Edit (Bilingual Support) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#646970] font-mono">
              <span className="font-semibold text-[#1d2327]">
                {activeLang === "vi" ? "Đường dẫn tĩnh (VI Slug):" : "Đường dẫn tĩnh Tiếng Anh (EN Slug):"}
              </span>
              <span className="text-[#2271b1]">https://anbu.asia/{activeLang}/blog/</span>
              {activeLang === "vi" ? (
                <input
                  type="text"
                  value={post.slug}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  placeholder="slug-tieng-viet"
                  className="rounded border border-[#ccd0d4] bg-[#f6f7f7] px-2 py-0.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={post.slug_en || ""}
                    onChange={(e) => setPost({ ...post, slug_en: e.target.value })}
                    placeholder={post.slug || "english-seo-slug"}
                    className="rounded border border-[#ccd0d4] bg-[#f6f7f7] px-2 py-0.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSlug = generateEnglishSlug(post.title.en || post.title.vi || "blog-post");
                      setPost({ ...post, slug_en: newSlug });
                      setAiNotice(`🔗 Đã tự động tối ưu hóa Slug tiếng Anh: "${newSlug}"`);
                      setTimeout(() => setAiNotice(null), 3000);
                    }}
                    className="rounded border border-[#2271b1] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#2271b1] hover:bg-blue-50 transition"
                    title="Tự động sinh Slug tiếng Anh chuẩn SEO từ Tiêu đề tiếng Anh"
                  >
                    🔄 Tự sinh Slug EN
                  </button>
                </div>
              )}
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
                onClick={() => setShowImportModal(true)}
                className="rounded border border-purple-600 bg-white px-2.5 py-1 text-[11px] font-bold text-purple-700 hover:bg-purple-50 transition flex items-center gap-1 shadow-xs"
                title="Nhập và tự động nhận diện nội dung từ Google Docs, Word, Notion hoặc Markdown"
              >
                <span>📥</span> <span>Nhập từ Docs/Word</span>
              </button>
              <button
                type="button"
                onClick={handleAutoTranslateToEnglish}
                className="rounded border border-emerald-600 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 transition flex items-center gap-1 shadow-sm"
                title="Dịch bài viết sang Tiếng Anh, bảo toàn từ khóa chuyên ngành Game/ASO và sinh Slug tiếng Anh chuẩn SEO"
              >
                <span>🌐</span> <span>Dịch tự động sang Tiếng Anh (Bảo toàn SEO & Slug)</span>
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
                    <button type="button" onClick={() => addBlock("h3")} className="h-6 px-1.5 rounded border border-transparent font-bold text-indigo-700 hover:bg-white hover:border-[#c3c4c7]" title="Tiêu đề phụ H3">H3 Mục con</button>
                  </div>
                  <div className="flex items-center gap-0.5 border-r border-[#c3c4c7] pr-1.5 mr-1">
                    <button type="button" onClick={() => addBlock("ul")} className="h-6 px-1.5 rounded border border-transparent font-medium hover:bg-white hover:border-[#c3c4c7]" title="Danh sách gạch đầu dòng">•≡ Danh sách</button>
                    <button type="button" onClick={() => addBlock("ol")} className="h-6 px-1.5 rounded border border-transparent font-medium text-teal-700 hover:bg-white hover:border-[#c3c4c7]" title="Danh sách số thứ tự (1, 2, 3...)">1.2.3 Các bước</button>
                    <button type="button" onClick={() => addBlock("quote")} className="h-6 px-1.5 rounded border border-transparent font-medium hover:bg-white hover:border-[#c3c4c7]" title="Trích dẫn">“ Trích dẫn</button>
                    <button type="button" onClick={() => addBlock("divider")} className="h-6 px-1.5 rounded border border-transparent font-medium text-slate-500 hover:bg-white hover:border-[#c3c4c7]" title="Đường kẻ ngắt đoạn trực quan">— Ngắt đoạn</button>
                  </div>
                  <div className="flex items-center gap-0.5 border-r border-[#c3c4c7] pr-1.5 mr-1">
                    <button type="button" onClick={() => addBlock("callout")} className="h-6 px-1.5 rounded border border-transparent font-bold text-amber-700 hover:bg-white hover:border-[#c3c4c7]" title="Hộp lưu ý / Lời khuyên">💡 Lưu ý</button>
                    <button type="button" onClick={() => addBlock("table")} className="h-6 px-1.5 rounded border border-transparent font-bold text-purple-700 hover:bg-white hover:border-[#c3c4c7]" title="Bảng dữ liệu">📊 Bảng</button>
                    <button type="button" onClick={() => addBlock("faq")} className="h-6 px-1.5 rounded border border-transparent font-bold text-teal-700 hover:bg-white hover:border-[#c3c4c7]" title="Hỏi đáp FAQ Schema Google">❓ FAQ</button>
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
                    title="Tải ảnh trực tiếp từ máy tính (Tự động nén WebP)"
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
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-md border border-blue-200 text-xs flex-wrap justify-center">
                      <span className="text-[11px] font-bold text-slate-700">Chèn đầu bài:</span>
                      <button type="button" onClick={() => insertBlock("p", 0)} className="rounded px-2 py-0.5 text-xs text-slate-700 hover:bg-blue-50 font-medium">¶ Đoạn</button>
                      <button type="button" onClick={() => insertBlock("h2", 0)} className="rounded px-2 py-0.5 text-xs text-slate-700 hover:bg-blue-50 font-medium">H2</button>
                      <button type="button" onClick={() => insertBlock("h3", 0)} className="rounded px-2 py-0.5 text-xs text-indigo-700 hover:bg-indigo-50 font-medium">H3</button>
                      <button type="button" onClick={() => insertBlock("image", 0)} className="rounded px-2 py-0.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold flex items-center gap-1">🖼️ Ảnh</button>
                      <button type="button" onClick={() => insertBlock("ol", 0)} className="rounded px-2 py-0.5 text-xs text-teal-700 hover:bg-teal-50 font-medium">1.2.3</button>
                      <button type="button" onClick={() => insertBlock("divider", 0)} className="rounded px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-medium">—</button>
                      <button type="button" onClick={() => insertBlock("callout", 0)} className="rounded px-2 py-0.5 text-xs text-amber-700 hover:bg-amber-50 font-medium">💡 Lưu ý</button>
                      <button type="button" onClick={() => insertBlock("table", 0)} className="rounded px-2 py-0.5 text-xs text-purple-700 hover:bg-purple-50 font-medium">📊 Bảng</button>
                      <button type="button" onClick={() => insertBlock("faq", 0)} className="rounded px-2 py-0.5 text-xs text-teal-700 hover:bg-teal-50 font-medium">❓ FAQ</button>
                    </div>
                  </div>
                </div>

                {post.body.map((block, index) => (
                  <React.Fragment key={index}>
                    <div
                      id={`editor-block-${index}`}
                      className={`relative rounded-lg border transition-all p-3.5 scroll-mt-20 ${
                        block.type === "image"
                          ? "border-blue-300 bg-blue-50/20 shadow-xs"
                          : block.type === "h2"
                          ? "border-slate-200 bg-white shadow-xs border-l-4 border-l-blue-600"
                          : block.type === "h3"
                          ? "border-indigo-200 bg-indigo-50/15 shadow-xs border-l-4 border-l-indigo-500 ml-3"
                          : block.type === "quote"
                          ? "border-slate-200 bg-white shadow-xs border-l-4 border-l-orange-500"
                          : block.type === "ul"
                          ? "border-slate-200 bg-white shadow-xs border-l-4 border-l-emerald-600"
                          : block.type === "ol"
                          ? "border-slate-200 bg-white shadow-xs border-l-4 border-l-teal-600"
                          : block.type === "divider"
                          ? "border-dashed border-slate-300 bg-slate-50/50 shadow-xs"
                          : block.type === "faq"
                          ? "border-teal-300 bg-teal-50/20 shadow-xs border-l-4 border-l-teal-600"
                          : block.type === "callout"
                          ? "border-amber-300 bg-amber-50/20 shadow-xs border-l-4 border-l-amber-500"
                          : block.type === "table"
                          ? "border-purple-300 bg-purple-50/20 shadow-xs border-l-4 border-l-purple-600"
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
                              : block.type === "h3"
                              ? "bg-purple-100 text-purple-800"
                              : block.type === "quote"
                              ? "bg-orange-100 text-orange-800"
                              : block.type === "ul"
                              ? "bg-emerald-100 text-emerald-800"
                              : block.type === "ol"
                              ? "bg-teal-100 text-teal-800"
                              : block.type === "divider"
                              ? "bg-slate-200 text-slate-700"
                              : block.type === "faq"
                              ? "bg-teal-100 text-teal-900"
                              : block.type === "callout"
                              ? "bg-amber-100 text-amber-800"
                              : block.type === "table"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {block.type === "image"
                              ? "🖼️ Khối Hình ảnh"
                              : block.type === "h2"
                              ? "H2 Tiêu đề"
                              : block.type === "h3"
                              ? "H3 Mục con"
                              : block.type === "quote"
                              ? "“ Trích dẫn"
                              : block.type === "ul"
                              ? "•≡ Danh sách"
                              : block.type === "ol"
                              ? "1.2.3 Các bước"
                              : block.type === "divider"
                              ? "— Đường ngắt đoạn"
                              : block.type === "faq"
                              ? "❓ FAQ Schema"
                              : block.type === "callout"
                              ? "💡 Hộp Lưu ý"
                              : block.type === "table"
                              ? "📊 Bảng Dữ liệu"
                              : "¶ Đoạn văn"}
                          </span>
                          <span className="text-[10px] text-slate-400">#{index + 1}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => duplicateBlock(index)}
                            className="rounded px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-700 transition"
                            title="Nhân bản khối này"
                          >
                            📋 Nhân bản
                          </button>
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
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "bold")}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition"
                                title="In đậm (Ctrl+B)"
                              >
                                B
                              </button>
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "italic")}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] italic font-serif text-slate-700 hover:bg-slate-200 transition"
                                title="In nghiêng (Ctrl+I)"
                              >
                                I
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400">Tiêu đề phân đoạn bài viết</span>
                          </div>
                          <input
                            type="text"
                            value={block.text[activeLang] || ""}
                            onChange={(e) => updateBlock(index, e.target.value)}
                            onKeyDown={(e) => handleInlineKeyDown(e, index)}
                            placeholder="Nhập tiêu đề H2..."
                            className="w-full font-display text-lg font-bold text-[#1d2327] outline-none border-b border-dashed border-[#ccd0d4] pb-1"
                          />
                        </div>
                      )}

                      {block.type === "h3" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "bold")}
                                className="rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-800 hover:bg-indigo-100 transition"
                                title="In đậm (Ctrl+B)"
                              >
                                B
                              </button>
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "italic")}
                                className="rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[10px] italic font-serif text-indigo-800 hover:bg-indigo-100 transition"
                                title="In nghiêng (Ctrl+I)"
                              >
                                I
                              </button>
                            </div>
                            <span className="text-[10px] text-indigo-600 font-medium">Tiêu đề phụ cấp 3 (Mục con dưới H2)</span>
                          </div>
                          <input
                            type="text"
                            value={block.text[activeLang] || ""}
                            onChange={(e) => updateBlock(index, e.target.value)}
                            onKeyDown={(e) => handleInlineKeyDown(e, index)}
                            placeholder="Nhập tiêu đề H3..."
                            className="w-full font-display text-base font-bold text-indigo-950 outline-none border-b border-dashed border-indigo-200 pb-1"
                          />
                        </div>
                      )}

                      {block.type === "p" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "bold")}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition"
                                title="Chèn từ khóa in đậm (**từ khóa**)"
                              >
                                B
                              </button>
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "italic")}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] italic font-serif text-slate-700 hover:bg-slate-200 transition"
                                title="Chèn từ khóa in nghiêng (*từ khóa*)"
                              >
                                I
                              </button>
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "link")}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition"
                                title="Chèn đường dẫn liên kết ([văn bản](url))"
                              >
                                🔗 Link
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400">Hỗ trợ: **đậm**, *nghiêng*, [link](url)</span>
                          </div>
                          <textarea
                            rows={3}
                            value={block.text[activeLang] || ""}
                            onChange={(e) => updateBlock(index, e.target.value)}
                            onKeyDown={(e) => handleInlineKeyDown(e, index)}
                            placeholder="Nhập nội dung đoạn văn..."
                            className="w-full resize-y text-xs leading-relaxed text-[#2c3338] outline-none border-b border-dashed border-[#ccd0d4]"
                          />
                        </div>
                      )}

                      {block.type === "quote" && (
                        <div className="border-l-4 border-[#2271b1] bg-blue-50/30 p-3 rounded space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "bold")}
                                className="rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-blue-100 transition"
                                title="In đậm (Ctrl+B)"
                              >
                                B
                              </button>
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "italic")}
                                className="rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[10px] italic font-serif text-slate-700 hover:bg-blue-100 transition"
                                title="In nghiêng (Ctrl+I)"
                              >
                                I
                              </button>
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "link")}
                                className="rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition"
                                title="Chèn liên kết (Ctrl+K)"
                              >
                                🔗 Link
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400">Trích dẫn chuyên gia / số liệu</span>
                          </div>
                          <textarea
                            rows={2}
                            value={block.text[activeLang] || ""}
                            onChange={(e) => updateBlock(index, e.target.value)}
                            onKeyDown={(e) => handleInlineKeyDown(e, index)}
                            placeholder="Nhập nội dung trích dẫn..."
                            className="w-full resize-y italic text-xs leading-relaxed text-[#2c3338] outline-none bg-transparent"
                          />
                        </div>
                      )}

                      {block.type === "ul" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 px-2">
                            <span>Danh sách các điểm nổi bật</span>
                            <span>Hỗ trợ **đậm**, *nghiêng*, [link](url)</span>
                          </div>
                          <div className="space-y-1.5 pl-2">
                            {block.items.map((it, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <span className="text-[#2271b1] font-bold">•</span>
                                <input
                                  type="text"
                                  value={it[activeLang] || ""}
                                  onChange={(e) => updateListItem(index, itemIdx, e.target.value)}
                                  onKeyDown={(e) => handleInlineKeyDown(e, index, itemIdx)}
                                  className="flex-1 rounded border border-[#ccd0d4] p-1 text-xs text-[#2c3338] outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => applyInlineFormatting(index, "bold", itemIdx)}
                                  className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200"
                                  title="In đậm (Ctrl+B)"
                                >
                                  B
                                </button>
                                <button
                                  type="button"
                                  onClick={() => applyInlineFormatting(index, "link", itemIdx)}
                                  className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] text-blue-700 hover:bg-blue-100"
                                  title="Chèn link (Ctrl+K)"
                                >
                                  🔗
                                </button>
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

                      {block.type === "ol" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-teal-600 px-2">
                            <span className="font-bold">Danh sách các bước tuần tự (1, 2, 3...)</span>
                            <span>Hỗ trợ **đậm**, *nghiêng*, [link](url)</span>
                          </div>
                          <div className="space-y-1.5 pl-2">
                            {block.items.map((it, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <span className="text-teal-700 font-bold font-mono text-xs w-5 text-right">{itemIdx + 1}.</span>
                                <input
                                  type="text"
                                  value={it[activeLang] || ""}
                                  onChange={(e) => updateOrderedListItem(index, itemIdx, e.target.value)}
                                  onKeyDown={(e) => handleInlineKeyDown(e, index, itemIdx)}
                                  className="flex-1 rounded border border-[#ccd0d4] p-1 text-xs text-[#2c3338] outline-none focus:border-teal-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => applyInlineFormatting(index, "bold", itemIdx)}
                                  className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200"
                                  title="In đậm (Ctrl+B)"
                                >
                                  B
                                </button>
                                <button
                                  type="button"
                                  onClick={() => applyInlineFormatting(index, "link", itemIdx)}
                                  className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] text-blue-700 hover:bg-blue-100"
                                  title="Chèn link (Ctrl+K)"
                                >
                                  🔗
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeOrderedListItem(index, itemIdx)}
                                  className="text-slate-400 hover:text-rose-600 text-xs px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => addOrderedListItem(index)}
                            className="text-[11px] text-teal-700 hover:underline font-semibold pl-4"
                          >
                            + Thêm bước tiếp theo
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
                      {block.type === "callout" && (
                        <div className="space-y-2.5">
                          {/* Variant picker and formatting toolbar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-600">Kiểu hộp:</span>
                              <div className="inline-flex rounded border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => updateCallout(index, "variant", "info")}
                                  className={`px-2 py-0.5 rounded font-semibold transition ${
                                    (block.variant || "info") === "info"
                                      ? "bg-blue-600 text-white shadow-xs"
                                      : "text-slate-600 hover:text-blue-600"
                                  }`}
                                >
                                  ℹ️ Thông tin
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateCallout(index, "variant", "tip")}
                                  className={`px-2 py-0.5 rounded font-semibold transition ${
                                    block.variant === "tip"
                                      ? "bg-emerald-600 text-white shadow-xs"
                                      : "text-slate-600 hover:text-emerald-600"
                                  }`}
                                >
                                  💡 Lời khuyên / Mẹo
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateCallout(index, "variant", "warning")}
                                  className={`px-2 py-0.5 rounded font-semibold transition ${
                                    block.variant === "warning"
                                      ? "bg-amber-600 text-white shadow-xs"
                                      : "text-slate-600 hover:text-amber-600"
                                  }`}
                                >
                                  ⚠️ Cảnh báo
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "bold")}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition"
                                title="In đậm"
                              >
                                B
                              </button>
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "italic")}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] italic font-serif text-slate-700 hover:bg-slate-200 transition"
                                title="In nghiêng"
                              >
                                I
                              </button>
                              <button
                                type="button"
                                onClick={() => applyInlineFormatting(index, "link")}
                                className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition"
                                title="Chèn link"
                              >
                                🔗 Link
                              </button>
                            </div>
                          </div>

                          {/* Callout preview box in editor */}
                          <div
                            className={`rounded-lg border p-3 space-y-2 ${
                              (block.variant || "info") === "tip"
                                ? "border-emerald-200 bg-emerald-50/50"
                                : (block.variant || "info") === "warning"
                                ? "border-amber-200 bg-amber-50/50"
                                : "border-blue-200 bg-blue-50/50"
                            }`}
                          >
                            <input
                              type="text"
                              value={block.title ? block.title[activeLang] || "" : ""}
                              onChange={(e) => updateCallout(index, "title", e.target.value)}
                              placeholder="Tiêu đề hộp lưu ý (tùy chọn)..."
                              className="w-full font-bold text-sm text-slate-800 bg-transparent outline-none border-b border-dashed border-slate-300 pb-1"
                            />
                            <textarea
                              rows={2}
                              value={block.text[activeLang] || ""}
                              onChange={(e) => updateCallout(index, "text", e.target.value)}
                              placeholder="Nội dung lưu ý, lời khuyên hoặc mẹo thực chiến..."
                              className="w-full resize-y text-xs leading-relaxed text-slate-700 bg-transparent outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === "table" && (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-purple-900">📊 Cấu trúc Bảng dữ liệu:</span>
                              <span className="text-[11px] text-slate-500">
                                {block.headers.length} cột × {block.rows.length} dòng
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => addTableColumn(index)}
                                className="rounded border border-purple-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-50 transition"
                                title="Thêm một cột mới vào bảng"
                              >
                                + Thêm cột
                              </button>
                              <button
                                type="button"
                                onClick={() => addTableRow(index)}
                                className="rounded border border-purple-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-50 transition"
                                title="Thêm một dòng mới vào bảng"
                              >
                                + Thêm dòng
                              </button>
                            </div>
                          </div>

                          {/* Table caption input */}
                          <div>
                            <input
                              type="text"
                              value={block.caption ? block.caption[activeLang] || "" : ""}
                              onChange={(e) => updateTableCaption(index, e.target.value)}
                              placeholder="Tiêu đề / Chú thích bảng (ví dụ: Bảng 1: So sánh CPI và ROAS)..."
                              className="w-full text-xs font-semibold text-slate-700 border-b border-dashed border-slate-300 pb-1 outline-none focus:border-purple-500"
                            />
                          </div>

                          {/* Interactive Table Matrix */}
                          <div className="overflow-x-auto rounded-lg border border-purple-200 bg-white shadow-xs">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-purple-50/80 text-purple-900 border-b border-purple-200">
                                  <th className="p-2 w-10 text-center font-mono text-[10px] text-purple-400">#</th>
                                  {block.headers.map((h, colIdx) => (
                                    <th key={colIdx} className="p-2 border-r border-purple-200 last:border-r-0 min-w-[120px]">
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="text"
                                          value={h[activeLang] || ""}
                                          onChange={(e) => updateTableHeader(index, colIdx, e.target.value)}
                                          placeholder={`Tiêu đề cột ${colIdx + 1}`}
                                          className="w-full bg-white/80 border border-purple-300 rounded px-1.5 py-0.5 text-xs font-bold text-purple-950 outline-none focus:bg-white"
                                        />
                                        {block.headers.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => removeTableColumn(index, colIdx)}
                                            className="text-slate-400 hover:text-rose-600 px-1 text-[11px]"
                                            title="Xóa cột này"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </div>
                                    </th>
                                  ))}
                                  <th className="p-2 w-10 text-center font-mono text-[10px] text-purple-400">Xóa</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-purple-100">
                                {block.rows.map((row, rowIdx) => (
                                  <tr key={rowIdx} className="hover:bg-purple-50/30 transition">
                                    <td className="p-2 text-center font-mono text-[10px] text-slate-400">
                                      {rowIdx + 1}
                                    </td>
                                    {block.headers.map((_, colIdx) => {
                                      const cellVal = row[colIdx] ? row[colIdx][activeLang] || "" : "";
                                      return (
                                        <td key={colIdx} className="p-1.5 border-r border-purple-100 last:border-r-0">
                                          <input
                                            type="text"
                                            value={cellVal}
                                            onChange={(e) => updateTableCell(index, rowIdx, colIdx, e.target.value)}
                                            placeholder="Nội dung ô..."
                                            className="w-full rounded border border-slate-200 p-1 text-xs text-slate-800 outline-none focus:border-purple-500 focus:bg-white"
                                          />
                                        </td>
                                      );
                                    })}
                                    <td className="p-2 text-center">
                                      {block.rows.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => removeTableRow(index, rowIdx)}
                                          className="text-slate-400 hover:text-rose-600 font-bold text-xs"
                                          title="Xóa dòng này"
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {block.type === "divider" && (
                        <div className="py-2 text-center">
                          <div className="border-t-2 border-dashed border-slate-300 w-3/4 mx-auto my-1" />
                          <span className="text-[10px] text-slate-400 italic">Đường kẻ phân cách trực quan giữa các phân đoạn</span>
                        </div>
                      )}

                      {block.type === "faq" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs px-1">
                            <span className="font-bold text-teal-900 flex items-center gap-1.5">
                              <span>❓</span> Khối Hỏi & Đáp FAQ (Tự sinh JSON-LD FAQPage Schema chuẩn Google)
                            </span>
                            <button
                              type="button"
                              onClick={() => addFaqItem(index)}
                              className="rounded border border-teal-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-teal-700 hover:bg-teal-50 transition"
                            >
                              + Thêm câu hỏi
                            </button>
                          </div>
                          <div className="space-y-2.5">
                            {block.items.map((faqItem, fIdx) => (
                              <div key={fIdx} className="rounded-md border border-teal-200 bg-white p-2.5 space-y-2 shadow-xs">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-1">
                                    <span className="text-teal-700 font-bold text-xs">Q{fIdx + 1}:</span>
                                    <input
                                      type="text"
                                      value={faqItem.question[activeLang] || ""}
                                      onChange={(e) => updateFaqItem(index, fIdx, "question", e.target.value)}
                                      onKeyDown={(e) => handleInlineKeyDown(e, index, fIdx)}
                                      placeholder="Nhập câu hỏi thường gặp..."
                                      className="w-full font-bold text-xs text-teal-950 border-b border-teal-200 outline-none pb-0.5"
                                    />
                                  </div>
                                  {block.items.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeFaqItem(index, fIdx)}
                                      className="text-slate-400 hover:text-rose-600 text-xs px-1"
                                      title="Xóa câu hỏi này"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <span className="text-slate-500 font-bold text-xs mt-1">A:</span>
                                  <textarea
                                    rows={2}
                                    value={faqItem.answer[activeLang] || ""}
                                    onChange={(e) => updateFaqItem(index, fIdx, "answer", e.target.value)}
                                    onKeyDown={(e) => handleInlineKeyDown(e, index, fIdx)}
                                    placeholder="Nhập câu trả lời giải đáp chi tiết..."
                                    className="w-full text-xs text-slate-700 bg-slate-50/50 rounded border border-slate-200 p-1.5 outline-none focus:border-teal-500 resize-y"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* In-between Inserter */}
                    <div className="relative py-1 group/mid my-1">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-dashed border-slate-200 group-hover/mid:border-blue-400 transition-colors" />
                      </div>
                      <div className="relative flex justify-center opacity-0 group-hover/mid:opacity-100 transition-opacity">
                        <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-md border border-blue-200 text-xs flex-wrap justify-center">
                          <span className="text-[10px] font-bold text-slate-600 mr-1">+ Chèn vào đây:</span>
                          <button type="button" onClick={() => insertBlock("p", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-blue-50 font-medium">¶ Đoạn</button>
                          <button type="button" onClick={() => insertBlock("h2", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-blue-50 font-medium">H2</button>
                          <button type="button" onClick={() => insertBlock("h3", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-indigo-700 hover:bg-indigo-50 font-medium">H3</button>
                          <button type="button" onClick={() => insertBlock("image", index + 1)} className="rounded px-2 py-0.5 text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold flex items-center gap-1">🖼️ Ảnh</button>
                          <button type="button" onClick={() => insertBlock("ol", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-teal-700 hover:bg-teal-50 font-medium">1.2.3</button>
                          <button type="button" onClick={() => insertBlock("divider", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-600 hover:bg-slate-100 font-medium">—</button>
                          <button type="button" onClick={() => insertBlock("callout", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-amber-700 hover:bg-amber-50 font-medium">💡 Lưu ý</button>
                          <button type="button" onClick={() => insertBlock("table", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-purple-700 hover:bg-purple-50 font-medium">📊 Bảng</button>
                          <button type="button" onClick={() => insertBlock("faq", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-teal-700 hover:bg-teal-50 font-medium">❓ FAQ</button>
                          <button type="button" onClick={() => insertBlock("ul", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-blue-50 font-medium">•≡ Danh sách</button>
                          <button type="button" onClick={() => insertBlock("quote", index + 1)} className="rounded px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-blue-50 font-medium">“ Trích dẫn</button>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Quick Add Block Bar at Bottom */}
              <div className="flex flex-wrap items-center justify-between border-t border-[#ccd0d4] bg-[#f6f7f7] px-4 py-2 text-xs text-[#646970] gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#1d2327]">Chèn thêm khối:</span>
                  <button type="button" onClick={() => addBlock("p")} className="rounded border border-[#c3c4c7] bg-white px-2 py-0.5 hover:bg-[#f0f0f1] font-semibold text-[#2c3338]">+ Đoạn văn</button>
                  <button type="button" onClick={() => addBlock("h2")} className="rounded border border-[#c3c4c7] bg-white px-2 py-0.5 hover:bg-[#f0f0f1] font-semibold text-[#2c3338]">+ Tiêu đề H2</button>
                  <button type="button" onClick={() => addBlock("h3")} className="rounded border border-indigo-200 bg-white px-2 py-0.5 hover:bg-indigo-50 font-semibold text-indigo-700">+ Tiêu đề H3</button>
                  <button type="button" onClick={() => addBlock("ul")} className="rounded border border-[#c3c4c7] bg-white px-2 py-0.5 hover:bg-[#f0f0f1] font-semibold text-[#2c3338]">+ Danh sách</button>
                  <button type="button" onClick={() => addBlock("ol")} className="rounded border border-teal-300 bg-white px-2 py-0.5 hover:bg-teal-50 font-semibold text-teal-800">+ 1.2.3 Các bước</button>
                  <button type="button" onClick={() => addBlock("quote")} className="rounded border border-[#c3c4c7] bg-white px-2 py-0.5 hover:bg-[#f0f0f1] font-semibold text-[#2c3338]">+ Trích dẫn</button>
                  <button type="button" onClick={() => addBlock("divider")} className="rounded border border-slate-300 bg-white px-2 py-0.5 hover:bg-slate-100 font-semibold text-slate-600">+ — Ngắt đoạn</button>
                  <button type="button" onClick={() => addBlock("callout")} className="rounded border border-amber-300 bg-white px-2 py-0.5 hover:bg-amber-50 font-semibold text-amber-800">+ Hộp lưu ý</button>
                  <button type="button" onClick={() => addBlock("table")} className="rounded border border-purple-300 bg-white px-2 py-0.5 hover:bg-purple-50 font-semibold text-purple-800">+ Bảng dữ liệu</button>
                  <button type="button" onClick={() => addBlock("faq")} className="rounded border border-teal-300 bg-white px-2 py-0.5 hover:bg-teal-50 font-semibold text-teal-800">+ ❓ FAQ Schema</button>
                  <button type="button" onClick={() => addBlock("image")} className="rounded border border-[#2271b1] bg-white px-2 py-0.5 hover:bg-blue-50 font-bold text-[#2271b1]">+ Hình ảnh</button>
                </div>
                <div>
                  Tổng cộng: <strong className="text-[#1d2327]">{totalWords}</strong> từ • <strong className="text-[#1d2327]">{readingTime}</strong> phút đọc
                </div>
              </div>
            </div>
          ) : (
            /* Live Preview Canvas with Device Switcher */
            <div className="space-y-4">
              {/* Device Mode Switcher Toolbar */}
              <div className="flex flex-wrap items-center justify-between rounded-lg border border-[#ccd0d4] bg-white p-3 shadow-xs gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span>📱 Chế độ xem trước thiết bị:</span>
                  <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
                        previewDevice === "desktop"
                          ? "bg-white text-blue-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>🖥️</span> <span>Máy tính (Desktop)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("tablet")}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
                        previewDevice === "tablet"
                          ? "bg-white text-blue-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>💻</span> <span>Máy tính bảng (Tablet 768px)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
                        previewDevice === "mobile"
                          ? "bg-white text-blue-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>📱</span> <span>Điện thoại (Mobile 375px)</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Xem ngôn ngữ: <strong className="text-slate-800 uppercase">{activeLang}</strong>
                </div>
              </div>

              {/* Preview Rendering per Device */}
              {previewDevice === "mobile" ? (
                /* SMARTPHONE MOCKUP 375px */
                <div className="flex justify-center py-4 bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
                  <div className="w-[375px] max-w-full rounded-[44px] border-[10px] border-slate-900 bg-white shadow-2xl overflow-hidden flex flex-col relative">
                    {/* Dynamic Island / Status Bar */}
                    <div className="bg-slate-900 pt-3 pb-2 px-6 flex items-center justify-between text-white text-[11px] font-mono select-none">
                      <span>9:41</span>
                      <div className="w-20 h-4 bg-black rounded-full mx-auto" />
                      <div className="flex items-center gap-1 text-[10px]">
                        <span>5G</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Browser Address Bar */}
                    <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                      <span className="text-emerald-600 font-bold">🔒</span>
                      <span className="truncate">anbu.asia/{locale}/blog/{post.slug || "bai-viet"}</span>
                    </div>

                    {/* Mobile Scrollable Viewport */}
                    <div className="max-h-[600px] overflow-y-auto p-4 space-y-3.5 text-slate-800">
                      {/* Featured image */}
                      {post.cover && (
                        <div className="overflow-hidden rounded-xl border border-slate-100 shadow-xs -mx-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.cover} alt="Cover" className="w-full h-44 object-cover" />
                        </div>
                      )}

                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#f5501e]">
                        {post.category[activeLang]} • {readingTime} phút đọc
                      </div>

                      <h2 className="font-display text-xl font-bold leading-snug text-[#1d2327]">
                        {post.title[activeLang]}
                      </h2>

                      <p className="text-xs leading-relaxed text-[#50575e] border-b border-slate-100 pb-3 font-medium">
                        {post.excerpt[activeLang]}
                      </p>

                      <div className="space-y-3 pt-1">
                        {post.body.map((b, i) => {
                          if (b.type === "h2")
                            return (
                              <h3 key={i} className="font-display text-base font-bold text-[#1d2327] mt-4 pt-2 border-t border-slate-100">
                                {renderRichText(b.text[activeLang])}
                              </h3>
                            );
                          if (b.type === "h3")
                            return (
                              <h4 key={i} className="font-display text-sm font-bold text-indigo-950 mt-3 border-l-2 border-indigo-500 pl-2">
                                {renderRichText(b.text[activeLang])}
                              </h4>
                            );
                          if (b.type === "p")
                            return (
                              <p key={i} className="text-xs leading-relaxed text-[#2c3338] whitespace-pre-line">
                                {renderRichText(b.text[activeLang])}
                              </p>
                            );
                          if (b.type === "quote")
                            return (
                              <blockquote key={i} className="border-l-3 border-[#f5501e] bg-orange-50/50 p-2.5 italic text-xs text-[#2c3338] whitespace-pre-line rounded-r">
                                {renderRichText(b.text[activeLang])}
                              </blockquote>
                            );
                          if (b.type === "ul")
                            return (
                              <ul key={i} className="space-y-1.5 pl-3 list-disc text-xs text-[#2c3338]">
                                {b.items.map((it, iIdx) => (
                                  <li key={iIdx}>{renderRichText(it[activeLang])}</li>
                                ))}
                              </ul>
                            );
                          if (b.type === "ol")
                            return (
                              <ol key={i} className="space-y-1.5 pl-4 list-decimal text-xs text-[#2c3338] marker:text-teal-700 marker:font-bold">
                                {b.items.map((it, iIdx) => (
                                  <li key={iIdx}>{renderRichText(it[activeLang])}</li>
                                ))}
                              </ol>
                            );
                          if (b.type === "divider")
                            return (
                              <hr key={i} className="my-3 border-0 border-t border-dashed border-slate-300" />
                            );
                          if (b.type === "faq")
                            return (
                              <div key={i} className="my-3 rounded-lg border border-teal-200 bg-teal-50/20 p-2.5 space-y-2">
                                <div className="text-[11px] font-bold text-teal-900 flex items-center gap-1">
                                  <span>❓</span> <span>Câu hỏi thường gặp (FAQ)</span>
                                </div>
                                <div className="space-y-1.5">
                                  {b.items.map((item, fIdx) => (
                                    <details key={fIdx} className="group rounded border border-teal-200 bg-white p-2 text-xs">
                                      <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-slate-800">
                                        <span>{item.question[activeLang]}</span>
                                        <span className="text-teal-600 font-bold ml-1 transition group-open:rotate-180">▾</span>
                                      </summary>
                                      <p className="mt-1.5 pt-1.5 border-t border-slate-100 text-slate-600 leading-relaxed">
                                        {renderRichText(item.answer[activeLang])}
                                      </p>
                                    </details>
                                  ))}
                                </div>
                              </div>
                            );
                          if (b.type === "image")
                            return (
                              <figure key={i} className="my-2.5 overflow-hidden rounded-lg border border-[#eee] bg-[#fafafa]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={b.src} alt={b.alt[activeLang]} className="w-full max-h-[260px] object-cover" />
                                {b.caption && (
                                  <figcaption className="p-1.5 text-center text-[10px] text-[#646970]">
                                    {b.caption[activeLang]}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          if (b.type === "callout") {
                            const variant = b.variant || "info";
                            const icon = variant === "tip" ? "💡" : variant === "warning" ? "⚠️" : "ℹ️";
                            const bg =
                              variant === "tip"
                                ? "bg-emerald-50/80 border-emerald-500 text-emerald-950"
                                : variant === "warning"
                                ? "bg-amber-50/80 border-amber-500 text-amber-950"
                                : "bg-blue-50/80 border-blue-500 text-blue-950";
                            return (
                              <div key={i} className={`rounded-xl border-l-4 p-3 ${bg} text-xs space-y-1`}>
                                <div className="font-bold flex items-center gap-1.5 text-[11px]">
                                  <span>{icon}</span>
                                  <span>
                                    {b.title
                                      ? b.title[activeLang]
                                      : variant === "tip"
                                      ? "Mẹo chiến lược"
                                      : variant === "warning"
                                      ? "Lưu ý quan trọng"
                                      : "Thông tin hữu ích"}
                                  </span>
                                </div>
                                <div className="leading-relaxed whitespace-pre-line text-slate-800">
                                  {renderRichText(b.text[activeLang])}
                                </div>
                              </div>
                            );
                          }
                          if (b.type === "table") {
                            return (
                              <div key={i} className="my-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-[11px] divide-y divide-slate-100">
                                    {b.headers && (
                                      <thead className="bg-slate-50 font-bold text-slate-900">
                                        <tr>
                                          {b.headers.map((h, hIdx) => (
                                            <th key={hIdx} className="px-2.5 py-2 whitespace-nowrap">
                                              {renderRichText(h[activeLang])}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                    )}
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                      {b.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className="even:bg-slate-50/50">
                                          {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="px-2.5 py-2 leading-relaxed">
                                              {renderRichText(cell[activeLang])}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {b.caption && (
                                  <div className="border-t border-slate-100 bg-slate-50 px-2.5 py-1 text-center text-[10px] italic text-slate-500">
                                    {b.caption[activeLang]}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>

                    {/* Mobile Home Indicator */}
                    <div className="py-2 bg-white border-t border-slate-100 flex justify-center">
                      <div className="w-28 h-1 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                /* DESKTOP / TABLET CANVAS */
                <div
                  className={`mx-auto bg-white shadow-sm transition-all duration-300 ${
                    previewDevice === "tablet"
                      ? "max-w-[768px] rounded-2xl border-4 border-slate-700 p-6 sm:p-8"
                      : "max-w-4xl rounded border border-[#ccd0d4] p-8"
                  }`}
                >
                  {/* Cover Image in preview */}
                  {post.cover && (
                    <div className="mb-6 overflow-hidden rounded-xl border border-slate-100 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover} alt="Cover" className="w-full max-h-[380px] object-cover" />
                    </div>
                  )}

                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#f5501e]">
                    {post.category[activeLang]} • {post.date} • {readingTime} phút đọc
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1d2327]">
                    {post.title[activeLang]}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#50575e] border-b border-[#eee] pb-5">
                    {post.excerpt[activeLang]}
                  </p>

                  <div className="mt-6 space-y-4">
                    {post.body.map((b, i) => {
                      if (b.type === "h2")
                        return (
                          <h3 key={i} className="font-display text-xl font-bold text-[#1d2327] mt-6">
                            {renderRichText(b.text[activeLang])}
                          </h3>
                        );
                      if (b.type === "h3")
                        return (
                          <h4 key={i} className="font-display text-lg font-bold text-indigo-950 mt-4 border-l-3 border-indigo-500 pl-3">
                            {renderRichText(b.text[activeLang])}
                          </h4>
                        );
                      if (b.type === "p")
                        return (
                          <p key={i} className="text-sm leading-relaxed text-[#2c3338] whitespace-pre-line">
                            {renderRichText(b.text[activeLang])}
                          </p>
                        );
                      if (b.type === "quote")
                        return (
                          <blockquote key={i} className="border-l-4 border-[#f5501e] bg-orange-50/40 p-3 italic text-sm text-[#2c3338] whitespace-pre-line rounded-r">
                            {renderRichText(b.text[activeLang])}
                          </blockquote>
                        );
                      if (b.type === "ul")
                        return (
                          <ul key={i} className="space-y-1.5 pl-4 list-disc text-sm text-[#2c3338]">
                            {b.items.map((it, iIdx) => (
                              <li key={iIdx}>{renderRichText(it[activeLang])}</li>
                            ))}
                          </ul>
                        );
                      if (b.type === "ol")
                        return (
                          <ol key={i} className="space-y-1.5 pl-5 list-decimal text-sm text-[#2c3338] marker:text-[#f5501e] marker:font-bold">
                            {b.items.map((it, iIdx) => (
                              <li key={iIdx}>{renderRichText(it[activeLang])}</li>
                            ))}
                          </ol>
                        );
                      if (b.type === "divider")
                        return (
                          <hr key={i} className="my-6 border-0 border-t-2 border-dashed border-slate-200" />
                        );
                      if (b.type === "faq")
                        return (
                          <div key={i} className="my-6 rounded-xl border border-teal-200 bg-teal-50/20 p-5 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase tracking-wider">
                              <span>❓</span>
                              <span>Câu hỏi thường gặp (FAQ)</span>
                            </div>
                            <div className="space-y-2">
                              {b.items.map((item, fIdx) => (
                                <details key={fIdx} className="group rounded-lg border border-teal-200 bg-white p-3.5 text-sm transition open:shadow-xs">
                                  <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-slate-900 group-open:text-teal-700">
                                    <span>{item.question[activeLang]}</span>
                                    <span className="transition group-open:rotate-180 text-teal-600 font-bold ml-2">▾</span>
                                  </summary>
                                  <p className="mt-2.5 text-slate-700 leading-relaxed pt-2 border-t border-slate-100 whitespace-pre-line text-sm">
                                    {renderRichText(item.answer[activeLang])}
                                  </p>
                                </details>
                              ))}
                            </div>
                          </div>
                        );
                      if (b.type === "image")
                        return (
                          <figure key={i} className="my-4 overflow-hidden rounded border border-[#eee] bg-[#fafafa]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={b.src} alt={b.alt[activeLang]} className="w-full max-h-[420px] object-cover" />
                            {b.caption && (
                              <figcaption className="p-2 text-center text-xs text-[#646970]">
                                {b.caption[activeLang]}
                              </figcaption>
                            )}
                          </figure>
                        );
                      if (b.type === "callout") {
                        const variant = b.variant || "info";
                        const icon = variant === "tip" ? "💡" : variant === "warning" ? "⚠️" : "ℹ️";
                        const bg =
                          variant === "tip"
                            ? "bg-emerald-50/80 border-emerald-500 text-emerald-950"
                            : variant === "warning"
                            ? "bg-amber-50/80 border-amber-500 text-amber-950"
                            : "bg-blue-50/80 border-blue-500 text-blue-950";
                        return (
                          <aside key={i} className={`my-4 rounded-xl border-l-4 p-4 shadow-xs ${bg}`}>
                            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider">
                              <span>{icon}</span>
                              <span>
                                {b.title
                                  ? b.title[activeLang]
                                  : variant === "tip"
                                  ? "Mẹo chiến lược"
                                  : variant === "warning"
                                  ? "Lưu ý quan trọng"
                                  : "Thông tin hữu ích"}
                              </span>
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-line">
                              {renderRichText(b.text[activeLang])}
                            </div>
                          </aside>
                        );
                      }
                      if (b.type === "table") {
                        return (
                          <div key={i} className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-left text-xs sm:text-sm divide-y divide-slate-200">
                                {b.headers && (
                                  <thead className="bg-slate-100/80 text-slate-900 font-bold">
                                    <tr>
                                      {b.headers.map((h, hIdx) => (
                                        <th key={hIdx} className="px-4 py-3 whitespace-nowrap">
                                          {renderRichText(h[activeLang])}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                )}
                                <tbody className="divide-y divide-slate-100 bg-white">
                                  {b.rows.map((row, rIdx) => (
                                    <tr key={rIdx} className="even:bg-slate-50 hover:bg-slate-100/50 transition">
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="px-4 py-3 leading-relaxed">
                                          {renderRichText(cell[activeLang])}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {b.caption && (
                              <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs italic text-slate-500">
                                {b.caption[activeLang]}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
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
              if (field === "slug") {
                if (activeLang === "en") {
                  setPost({ ...post, slug_en: value });
                } else {
                  setPost({ ...post, slug: value });
                }
              }
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
                  onClick={handleManualSaveDraft}
                  className="rounded border border-[#c3c4c7] bg-[#f6f7f7] px-3 py-1 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
                  title="Lưu bản nháp vào trình duyệt ngay lập tức"
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
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Tự động lưu nháp: <strong className="text-slate-700">{autoSaveTime ? `lúc ${autoSaveTime}` : "bật"}</strong></span>
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

      {/* DISTRACTION-FREE ZEN MODE (FULLSCREEN) */}
      {isZenMode && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 text-slate-800">
          {/* Zen Top Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8 py-3 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsZenMode(false)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                <span>✕</span> <span>Thoát toàn màn hình (Esc)</span>
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="text-base">🌿</span> <span>ANBU Zen Writing Canvas</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">Ngôn ngữ:</span>
                <div className="flex rounded border border-slate-200 bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveLang("vi")}
                    className={`rounded px-2.5 py-0.5 text-xs font-bold transition ${
                      activeLang === "vi" ? "bg-blue-600 text-white" : "text-slate-600"
                    }`}
                  >
                    🇻🇳 VI
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang("en")}
                    className={`rounded px-2.5 py-0.5 text-xs font-bold transition ${
                      activeLang === "en" ? "bg-blue-600 text-white" : "text-slate-600"
                    }`}
                  >
                    🇺🇸 EN
                  </button>
                </div>
              </div>

              <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {autoSaveTime ? `Đã lưu ${autoSaveTime}` : "Tự động lưu"}
              </span>

              <span className="hidden sm:inline text-slate-500 text-xs">
                <strong>{totalWords}</strong> từ • <strong>{readingTime}</strong> phút đọc
              </span>

              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
              >
                {initialPost ? "Cập nhật" : "Xuất bản"}
              </button>
            </div>
          </div>

          {/* Zen Content Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-10">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-12 shadow-xl space-y-6">
              {/* Title */}
              <div>
                <input
                  type="text"
                  value={post.title[activeLang] || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Tiêu đề bài viết..."
                  className="w-full font-display text-2xl sm:text-3xl font-extrabold text-[#1d2327] placeholder:text-slate-300 outline-none border-b border-slate-200 pb-3"
                />
              </div>

              {/* Excerpt */}
              <div>
                <textarea
                  rows={2}
                  value={post.excerpt[activeLang] || ""}
                  onChange={(e) => setPost({ ...post, excerpt: { ...post.excerpt, [activeLang]: e.target.value } })}
                  placeholder="Tóm tắt ngắn (Excerpt)..."
                  className="w-full resize-none text-xs sm:text-sm italic text-slate-600 outline-none border-b border-slate-100 pb-2"
                />
              </div>

              {/* Blocks */}
              <div className="space-y-4 pt-2">
                {post.body.map((block, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 transition hover:border-blue-300"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-blue-700">
                        Khối #{index + 1}:{" "}
                        {block.type === "h2"
                          ? "Tiêu đề H2"
                          : block.type === "h3"
                          ? "Tiêu đề H3"
                          : block.type === "p"
                          ? "Đoạn văn"
                          : block.type === "quote"
                          ? "Trích dẫn"
                          : block.type === "ul"
                          ? "Danh sách"
                          : block.type === "ol"
                          ? "1.2.3 Các bước"
                          : block.type === "divider"
                          ? "— Đường ngắt đoạn"
                          : block.type === "faq"
                          ? "❓ FAQ Schema"
                          : block.type === "callout"
                          ? "Hộp Lưu ý"
                          : block.type === "table"
                          ? "Bảng Dữ liệu"
                          : "Hình ảnh"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => duplicateBlock(index)}
                          className="px-1.5 py-0.5 text-[11px] text-slate-500 hover:text-blue-700 font-medium"
                          title="Nhân bản khối này"
                        >
                          📋 Nhân bản
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(index, "up")}
                          disabled={index === 0}
                          className="px-1.5 py-0.5 text-[11px] text-slate-500 hover:text-black disabled:opacity-20"
                        >
                          ▲ Lên
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(index, "down")}
                          disabled={index === post.body.length - 1}
                          className="px-1.5 py-0.5 text-[11px] text-slate-500 hover:text-black disabled:opacity-20"
                        >
                          ▼ Xuống
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(index)}
                          className="px-1.5 py-0.5 text-[11px] font-bold text-rose-600 hover:text-rose-800 ml-1"
                        >
                          ✕ Xóa
                        </button>
                      </div>
                    </div>

                    {block.type === "h2" && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => applyInlineFormatting(index, "bold")}
                            className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-700"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => applyInlineFormatting(index, "italic")}
                            className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] italic font-serif text-slate-700"
                          >
                            I
                          </button>
                        </div>
                        <input
                          type="text"
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlock(index, e.target.value)}
                          onKeyDown={(e) => handleInlineKeyDown(e, index)}
                          placeholder="Tiêu đề H2..."
                          className="w-full font-display text-lg font-bold text-[#1d2327] outline-none bg-white p-2 rounded border border-slate-200"
                        />
                      </div>
                    )}

                    {block.type === "h3" && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => applyInlineFormatting(index, "bold")}
                            className="rounded border border-indigo-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-indigo-700"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => applyInlineFormatting(index, "italic")}
                            className="rounded border border-indigo-200 bg-white px-1.5 py-0.5 text-[10px] italic font-serif text-indigo-700"
                          >
                            I
                          </button>
                        </div>
                        <input
                          type="text"
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlock(index, e.target.value)}
                          onKeyDown={(e) => handleInlineKeyDown(e, index)}
                          placeholder="Tiêu đề H3..."
                          className="w-full font-display text-base font-bold text-indigo-950 outline-none bg-white p-2 rounded border border-indigo-200"
                        />
                      </div>
                    )}

                    {block.type === "p" && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => applyInlineFormatting(index, "bold")}
                            className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-700"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => applyInlineFormatting(index, "italic")}
                            className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] italic font-serif text-slate-700"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => applyInlineFormatting(index, "link")}
                            className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-blue-700"
                          >
                            🔗 Link
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlock(index, e.target.value)}
                          placeholder="Nội dung đoạn văn..."
                          className="w-full text-xs sm:text-sm leading-relaxed text-slate-800 outline-none bg-white p-2.5 rounded border border-slate-200"
                        />
                      </div>
                    )}

                    {block.type === "quote" && (
                      <div className="border-l-4 border-orange-500 bg-orange-50/40 p-3 rounded">
                        <textarea
                          rows={2}
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateBlock(index, e.target.value)}
                          placeholder="Nội dung trích dẫn..."
                          className="w-full italic text-xs sm:text-sm leading-relaxed text-slate-800 outline-none bg-transparent"
                        />
                      </div>
                    )}

                    {block.type === "callout" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateCallout(index, "variant", "info")}
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                (block.variant || "info") === "info" ? "bg-blue-600 text-white" : "text-slate-600"
                              }`}
                            >
                              ℹ️ Info
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCallout(index, "variant", "tip")}
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                block.variant === "tip" ? "bg-emerald-600 text-white" : "text-slate-600"
                              }`}
                            >
                              💡 Mẹo
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCallout(index, "variant", "warning")}
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                block.variant === "warning" ? "bg-amber-600 text-white" : "text-slate-600"
                              }`}
                            >
                              ⚠️ Cảnh báo
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => applyInlineFormatting(index, "bold")}
                              className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-700"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={() => applyInlineFormatting(index, "italic")}
                              className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] italic font-serif text-slate-700"
                            >
                              I
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={block.title ? block.title[activeLang] || "" : ""}
                          onChange={(e) => updateCallout(index, "title", e.target.value)}
                          placeholder="Tiêu đề hộp lưu ý..."
                          className="w-full font-bold text-sm bg-white p-2 rounded border border-slate-200 outline-none"
                        />
                        <textarea
                          rows={2}
                          value={block.text[activeLang] || ""}
                          onChange={(e) => updateCallout(index, "text", e.target.value)}
                          placeholder="Nội dung lưu ý..."
                          className="w-full text-xs sm:text-sm leading-relaxed text-slate-800 bg-white p-2.5 rounded border border-slate-200 outline-none"
                        />
                      </div>
                    )}

                    {block.type === "table" && (
                      <div className="space-y-2 overflow-x-auto">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-purple-800">
                            📊 Bảng: {block.headers.length} cột × {block.rows.length} dòng
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => addTableColumn(index)}
                              className="rounded border border-purple-300 bg-white px-2 py-0.5 text-xs text-purple-700"
                            >
                              + Cột
                            </button>
                            <button
                              type="button"
                              onClick={() => addTableRow(index)}
                              className="rounded border border-purple-300 bg-white px-2 py-0.5 text-xs text-purple-700"
                            >
                              + Dòng
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={block.caption ? block.caption[activeLang] || "" : ""}
                          onChange={(e) => updateTableCaption(index, e.target.value)}
                          placeholder="Chú thích bảng..."
                          className="w-full text-xs italic bg-white p-1.5 rounded border border-slate-200 outline-none"
                        />
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse bg-white rounded border border-slate-200">
                            <thead>
                              <tr className="bg-purple-50">
                                {block.headers.map((h, cIdx) => (
                                  <th key={cIdx} className="p-1 border border-slate-200 min-w-[100px]">
                                    <input
                                      type="text"
                                      value={h[activeLang] || ""}
                                      onChange={(e) => updateTableHeader(index, cIdx, e.target.value)}
                                      className="w-full font-bold text-xs p-1 outline-none bg-transparent"
                                      placeholder={`Cột ${cIdx + 1}`}
                                    />
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {block.rows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {block.headers.map((_, cIdx) => (
                                    <td key={cIdx} className="p-1 border border-slate-200">
                                      <input
                                        type="text"
                                        value={row[cIdx] ? row[cIdx][activeLang] || "" : ""}
                                        onChange={(e) => updateTableCell(index, rIdx, cIdx, e.target.value)}
                                        className="w-full text-xs p-1 outline-none bg-transparent"
                                        placeholder="Ô..."
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {block.type === "ul" && (
                      <div className="space-y-2">
                        {block.items.map((it, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2">
                            <span className="text-orange-500 font-bold">•</span>
                            <input
                              type="text"
                              value={it[activeLang] || ""}
                              onChange={(e) => updateListItem(index, itemIdx, e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, index, itemIdx)}
                              className="flex-1 rounded border border-slate-200 bg-white p-1.5 text-xs text-slate-800 outline-none"
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
                        <button
                          type="button"
                          onClick={() => addListItem(index)}
                          className="text-xs text-blue-600 hover:underline font-semibold"
                        >
                          + Thêm mục
                        </button>
                      </div>
                    )}

                    {block.type === "ol" && (
                      <div className="space-y-2">
                        {block.items.map((it, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2">
                            <span className="text-teal-600 font-bold font-mono text-xs w-5 text-right">{itemIdx + 1}.</span>
                            <input
                              type="text"
                              value={it[activeLang] || ""}
                              onChange={(e) => updateOrderedListItem(index, itemIdx, e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, index, itemIdx)}
                              className="flex-1 rounded border border-slate-200 bg-white p-1.5 text-xs text-slate-800 outline-none focus:border-teal-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeOrderedListItem(index, itemIdx)}
                              className="text-slate-400 hover:text-rose-600 text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOrderedListItem(index)}
                          className="text-xs text-teal-600 hover:underline font-semibold"
                        >
                          + Thêm bước tiếp theo
                        </button>
                      </div>
                    )}

                    {block.type === "divider" && (
                      <div className="py-2 text-center">
                        <div className="border-t-2 border-dashed border-slate-300 w-3/4 mx-auto my-1" />
                        <span className="text-[10px] text-slate-400 italic">Đường kẻ phân cách trực quan</span>
                      </div>
                    )}

                    {block.type === "faq" && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                          <span>❓ Khối Hỏi & Đáp FAQ (Google Schema)</span>
                          <button
                            type="button"
                            onClick={() => addFaqItem(index)}
                            className="rounded border border-teal-300 bg-white px-2 py-0.5 text-[11px] text-teal-700 hover:bg-teal-50"
                          >
                            + Thêm câu hỏi
                          </button>
                        </div>
                        {block.items.map((fItem, fIdx) => (
                          <div key={fIdx} className="rounded border border-teal-200 bg-white p-2.5 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={fItem.question[activeLang] || ""}
                                onChange={(e) => updateFaqItem(index, fIdx, "question", e.target.value)}
                                onKeyDown={(e) => handleInlineKeyDown(e, index, fIdx)}
                                placeholder="Câu hỏi..."
                                className="w-full font-bold text-xs text-teal-950 border-b border-teal-100 outline-none pb-0.5"
                              />
                              {block.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeFaqItem(index, fIdx)}
                                  className="text-slate-400 hover:text-rose-600 text-xs"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            <textarea
                              rows={2}
                              value={fItem.answer[activeLang] || ""}
                              onChange={(e) => updateFaqItem(index, fIdx, "answer", e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, index, fIdx)}
                              placeholder="Câu trả lời..."
                              className="w-full text-xs text-slate-700 bg-slate-50 rounded border border-slate-200 p-1 outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {block.type === "image" && (
                      <div>
                        {block.src ? (
                          <div className="space-y-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.src}
                              alt={block.alt[activeLang] || ""}
                              className="max-h-60 rounded object-contain mx-auto border"
                            />
                            <p className="text-center text-xs text-slate-500 italic">
                              {block.caption?.[activeLang] || block.alt[activeLang]}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center p-4 border border-dashed rounded text-xs text-slate-500">
                            Chưa có URL hình ảnh
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Inserter at bottom */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Chèn khối:</span>
                <button
                  type="button"
                  onClick={() => addBlock("p")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  + Đoạn văn
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("h2")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  + Tiêu đề H2
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("h3")}
                  className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 font-semibold text-indigo-700 hover:bg-indigo-50 shadow-xs"
                >
                  + Tiêu đề H3
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("callout")}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 font-bold text-amber-800 hover:bg-amber-100 shadow-xs"
                >
                  + Hộp lưu ý
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("table")}
                  className="rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 font-bold text-purple-800 hover:bg-purple-100 shadow-xs"
                >
                  + Bảng dữ liệu
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("ul")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  + Danh sách
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("ol")}
                  className="rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 font-bold text-teal-800 hover:bg-teal-100 shadow-xs"
                >
                  + 1.2.3 Các bước
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("divider")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 shadow-xs"
                >
                  + — Ngắt đoạn
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("quote")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  + Trích dẫn
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("faq")}
                  className="rounded-lg border border-teal-300 bg-white px-3 py-1.5 font-bold text-teal-800 hover:bg-teal-50 shadow-xs"
                >
                  + ❓ FAQ Schema
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("image")}
                  className="rounded-lg border border-blue-600 bg-blue-50 px-3 py-1.5 font-bold text-blue-700 hover:bg-blue-100 shadow-xs"
                >
                  + Hình ảnh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMART IMPORT MODAL (FROM DOCS / WORD / MARKDOWN) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📥</span>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Chuyển đổi thông minh từ Word, Google Docs & Markdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tự động nhận diện Tiêu đề H2, Đoạn văn, Danh sách gạch đầu dòng, Hình ảnh và Trích dẫn.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dán nội dung sao chép (Ctrl + V):
                </label>
                <textarea
                  rows={10}
                  value={importRawText}
                  onChange={(e) => setImportRawText(e.target.value)}
                  placeholder="Dán toàn bộ văn bản từ Google Docs, Word, Notion hoặc Markdown vào đây...&#10;&#10;Ví dụ:&#10;1. Tổng quan thị trường game 2026&#10;Đây là đoạn văn phân tích xu hướng...&#10;&#10;- Điểm nổi bật 1&#10;- Điểm nổi bật 2&#10;&#10;> Trích dẫn chuyên gia..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-xs leading-relaxed text-slate-800 outline-none focus:border-blue-600 font-mono"
                />
              </div>

              {/* Live Preview Stats */}
              {importRawText.trim() && (() => {
                const previewStats = parseRawTextToBlocks(importRawText);
                return (
                  <div className="rounded-lg bg-blue-50/80 border border-blue-200 p-3 text-xs text-blue-900">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <span>⚡</span> <span>Kết quả nhận diện tự động:</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2 text-center">
                      <div className="bg-white p-2 rounded border border-blue-100">
                        <span className="block text-base font-bold text-blue-700">{previewStats.stats.h2}</span>
                        <span className="text-[11px] text-slate-500">Tiêu đề H2</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-100">
                        <span className="block text-base font-bold text-blue-700">{previewStats.stats.p}</span>
                        <span className="text-[11px] text-slate-500">Đoạn văn</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-100">
                        <span className="block text-base font-bold text-blue-700">{previewStats.stats.ul}</span>
                        <span className="text-[11px] text-slate-500">Danh sách</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-100">
                        <span className="block text-base font-bold text-blue-700">{previewStats.stats.quote}</span>
                        <span className="text-[11px] text-slate-500">Trích dẫn</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-100">
                        <span className="block text-base font-bold text-blue-700">{previewStats.stats.image}</span>
                        <span className="text-[11px] text-slate-500">Hình ảnh</span>
                      </div>
                    </div>
                    {previewStats.title && (
                      <p className="mt-2 text-[11px] text-blue-800">
                        🎯 Tiêu đề phát hiện: <strong>"{previewStats.title}"</strong>
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importAutoTitle}
                    onChange={(e) => setImportAutoTitle(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Tự động đặt dòng đầu tiên / Heading 1 làm Tiêu đề bài viết (nếu tiêu đề đang trống)</span>
                </label>

                <div className="flex items-center gap-4 pt-1">
                  <span className="font-semibold text-slate-700">Chế độ chèn:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === "append"}
                      onChange={() => setImportMode("append")}
                    />
                    <span>Thêm tiếp vào cuối bài viết</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-rose-700">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === "replace"}
                      onChange={() => setImportMode("replace")}
                    />
                    <span>Ghi đè (Thay thế toàn bộ bài)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={!importRawText.trim()}
                onClick={handleExecuteImport}
                className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <span>📥</span> <span>Nhập vào bài viết</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import type { Post } from "@/content/posts";
import { blogCategories } from "@/content/posts";
import { calculatePostSeoScore } from "@/lib/seo-score";

type WordPressPostListProps = {
  posts: Post[];
  locale: string;
  onEditPost: (post: Post) => void;
  onNewPost: () => void;
  onUpdatePosts?: (posts: Post[]) => void;
};

export default function WordPressPostList({
  posts: initialPosts,
  locale,
  onEditPost,
  onNewPost,
  onUpdatePosts,
}: WordPressPostListProps) {
  const [postList, setPostList] = useState<Post[]>(initialPosts);
  const [trashedPosts, setTrashedPosts] = useState<Post[]>([]);
  const [currentTab, setCurrentTab] = useState<"all" | "published" | "drafts" | "trash">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [quickEditSlug, setQuickEditSlug] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickSlug, setQuickSlug] = useState("");
  const [quickCategory, setQuickCategory] = useState("");
  const [quickDate, setQuickDate] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    setPostList(initialPosts);
  }, [initialPosts]);

  const updateParentAndState = (updated: Post[]) => {
    setPostList(updated);
    if (onUpdatePosts) {
      onUpdatePosts(updated);
    }
  };

  const activeDataSource = currentTab === "trash" ? trashedPosts : postList;

  const filteredPosts = activeDataSource.filter((p) => {
    const matchQuery =
      p.title.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCat = selectedCategory === "all" || p.category.vi === selectedCategory;
    return matchQuery && matchCat;
  });

  const moveToTrash = (slug: string) => {
    const target = postList.find((p) => p.slug === slug);
    if (target) {
      const updated = postList.filter((p) => p.slug !== slug);
      updateParentAndState(updated);
      setTrashedPosts([target, ...trashedPosts]);
    }
  };

  const restoreFromTrash = (slug: string) => {
    const target = trashedPosts.find((p) => p.slug === slug);
    if (target) {
      setTrashedPosts(trashedPosts.filter((p) => p.slug !== slug));
      const updated = [target, ...postList];
      updateParentAndState(updated);
    }
  };

  const deletePermanently = (slug: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này không?")) {
      setTrashedPosts(trashedPosts.filter((p) => p.slug !== slug));
      fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" }).catch(console.error);
    }
  };

  const handleStartQuickEdit = (post: Post) => {
    setQuickEditSlug(post.slug);
    setQuickTitle(post.title.vi);
    setQuickSlug(post.slug);
    setQuickCategory(post.category.vi);
    setQuickDate(post.date);
  };

  const handleSaveQuickEdit = (slug: string) => {
    const updated = postList.map((p) => {
      if (p.slug === slug) {
        const foundCat = blogCategories.find((c) => c.vi === quickCategory);
        return {
          ...p,
          title: { ...p.title, vi: quickTitle },
          slug: quickSlug.trim(),
          category: foundCat ? { vi: foundCat.vi, en: foundCat.en } : p.category,
          date: quickDate,
        };
      }
      return p;
    });
    updateParentAndState(updated);
    setQuickEditSlug(null);
  };

  const copyPostCode = (post: Post) => {
    const code = JSON.stringify(post, null, 2);
    navigator.clipboard.writeText(code).then(() => {
      setCopiedSlug(post.slug);
      setTimeout(() => setCopiedSlug(null), 3000);
    });
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPosts(filteredPosts.map((p) => p.slug));
    } else {
      setSelectedPosts([]);
    }
  };

  const toggleSelectOne = (slug: string) => {
    if (selectedPosts.includes(slug)) {
      setSelectedPosts(selectedPosts.filter((s) => s !== slug));
    } else {
      setSelectedPosts([...selectedPosts, slug]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === "trash") {
      const targets = postList.filter((p) => selectedPosts.includes(p.slug));
      const remaining = postList.filter((p) => !selectedPosts.includes(p.slug));
      updateParentAndState(remaining);
      setTrashedPosts([...targets, ...trashedPosts]);
      setSelectedPosts([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Add New Action */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">Bài viết</h1>
          <button
            type="button"
            onClick={onNewPost}
            className="rounded border border-[#2271b1] bg-white px-2.5 py-1 text-xs font-bold text-[#2271b1] shadow-sm hover:bg-blue-50"
          >
            Viết bài mới
          </button>
        </div>

        {/* Search Posts Box */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded border border-[#8c8f94] bg-white px-3 py-1 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
          />
          <button
            type="button"
            className="rounded border border-[#8c8f94] bg-[#f6f7f7] px-3 py-1 text-xs font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* 2. Classic Filter Tabs (All, Published, Drafts, Trash) */}
      <div className="flex items-center gap-2 border-b border-[#c3c4c7] pb-1 text-xs text-[#646970]">
        <button
          onClick={() => setCurrentTab("all")}
          className={`${currentTab === "all" ? "font-bold text-[#1d2327]" : "text-[#2271b1] hover:underline"}`}
        >
          Tất cả <span className="text-[#646970]">({postList.length})</span>
        </button>
        <span>|</span>
        <button
          onClick={() => setCurrentTab("published")}
          className={`${currentTab === "published" ? "font-bold text-[#1d2327]" : "text-[#2271b1] hover:underline"}`}
        >
          Đã xuất bản <span className="text-[#646970]">({postList.length})</span>
        </button>
        <span>|</span>
        <button
          onClick={() => setCurrentTab("trash")}
          className={`${currentTab === "trash" ? "font-bold text-[#1d2327]" : "text-[#2271b1] hover:underline"}`}
        >
          Thùng rác <span className="text-[#646970]">({trashedPosts.length})</span>
        </button>
      </div>

      {/* 3. Bulk Actions & Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <select
            id="bulk-action-selector"
            className="rounded border border-[#8c8f94] bg-white p-1 text-xs text-[#2c3338] outline-none"
            onChange={(e) => {
              if (e.target.value) {
                handleBulkAction(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="">Hành động hàng loạt</option>
            <option value="trash">Bỏ vào thùng rác</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded border border-[#8c8f94] bg-white p-1 text-xs text-[#2c3338] outline-none"
          >
            <option value="all">Tất cả chuyên mục</option>
            {blogCategories.map((cat) => (
              <option key={cat.slug} value={cat.vi}>{cat.vi}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#646970]">
          Hiển thị <strong>{filteredPosts.length}</strong> bài viết
        </div>
      </div>

      {/* 4. WordPress Table of Posts */}
      <div className="overflow-x-auto rounded border border-[#ccd0d4] bg-white shadow-sm">
        <table className="w-full text-left text-xs text-[#2c3338]">
          <thead className="border-b border-[#ccd0d4] bg-[#f6f7f7] font-semibold text-[#1d2327]">
            <tr>
              <th className="w-8 px-3 py-2 text-center">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                  className="rounded text-[#2271b1]"
                />
              </th>
              <th className="px-3 py-2">Tiêu đề bài viết</th>
              <th className="px-3 py-2">Tác giả</th>
              <th className="px-3 py-2">Chuyên mục</th>
              <th className="px-3 py-2">Hình ảnh</th>
              <th className="px-3 py-2">Rank Math SEO</th>
              <th className="px-3 py-2">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f1]">
            {filteredPosts.map((post) => {
              const imageCount = post.body.filter((b) => b.type === "image").length;
              const isQuickEditing = quickEditSlug === post.slug;

              if (isQuickEditing) {
                /* WORDPRESS INLINE QUICK EDIT ROW */
                return (
                  <tr key={post.slug} className="bg-[#f0f6fc] border-y-2 border-[#2271b1]">
                    <td colSpan={7} className="p-4 space-y-3">
                      <div className="font-bold text-xs uppercase text-[#1d2327]">Sửa nhanh (Quick Edit)</div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#50575e]">Tiêu đề</label>
                          <input
                            type="text"
                            value={quickTitle}
                            onChange={(e) => setQuickTitle(e.target.value)}
                            className="mt-1 w-full rounded border border-[#8c8f94] bg-white p-1.5 text-xs text-[#2c3338] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#50575e]">Slug</label>
                          <input
                            type="text"
                            value={quickSlug}
                            onChange={(e) => setQuickSlug(e.target.value)}
                            className="mt-1 w-full rounded border border-[#8c8f94] bg-white p-1.5 text-xs font-mono text-[#2c3338] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#50575e]">Chuyên mục</label>
                          <select
                            value={quickCategory}
                            onChange={(e) => setQuickCategory(e.target.value)}
                            className="mt-1 w-full rounded border border-[#8c8f94] bg-white p-1.5 text-xs text-[#2c3338] outline-none"
                          >
                            {blogCategories.map((c) => (
                              <option key={c.slug} value={c.vi}>{c.vi}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleSaveQuickEdit(post.slug)}
                          className="rounded bg-[#2271b1] px-3 py-1 text-xs font-bold text-white hover:bg-[#135e96]"
                        >
                          Cập nhật
                        </button>
                        <button
                          onClick={() => setQuickEditSlug(null)}
                          className="rounded border border-[#8c8f94] bg-white px-3 py-1 text-xs text-[#2c3338] hover:bg-[#f6f7f7]"
                        >
                          Hủy bỏ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={post.slug}
                  className="hover:bg-[#f6f7f7] transition"
                >
                  <td className="px-3 py-2.5 text-center align-top">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.slug)}
                      onChange={() => toggleSelectOne(post.slug)}
                      className="rounded text-[#2271b1]"
                    />
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <button
                      onClick={() => onEditPost(post)}
                      className="font-bold text-[#2271b1] hover:text-[#135e96] text-left line-clamp-1 block text-[13px]"
                    >
                      {post.title.vi}
                    </button>
                    {/* Hover Action Links (Classic WordPress row-actions) */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#2271b1] mt-1">
                      {currentTab === "trash" ? (
                        <>
                          <button onClick={() => restoreFromTrash(post.slug)} className="hover:underline text-[#2e7d32] font-bold">Phục hồi</button>
                          <span className="text-[#a7aaad]">|</span>
                          <button onClick={() => deletePermanently(post.slug)} className="hover:underline text-[#d63638] font-bold">Xóa vĩnh viễn</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => onEditPost(post)} className="hover:underline font-semibold">Chỉnh sửa</button>
                          <span className="text-[#a7aaad]">|</span>
                          <button onClick={() => handleStartQuickEdit(post)} className="hover:underline text-[#646970]">Sửa nhanh</button>
                          <span className="text-[#a7aaad]">|</span>
                          <button onClick={() => moveToTrash(post.slug)} className="text-[#d63638] hover:underline">Thùng rác</button>
                          <span className="text-[#a7aaad]">|</span>
                          <a
                            href={`/${locale}/blog/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline font-bold text-[#00a32a]"
                          >
                            Xem bài viết ↗
                          </a>
                          <span className="text-[#a7aaad]">|</span>
                          <button
                            type="button"
                            onClick={() => copyPostCode(post)}
                            className="hover:underline text-[#646970]"
                          >
                            {copiedSlug === post.slug ? "✓ Đã chép code" : "Chép JSON"}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 align-top text-[#646970]">{post.author}</td>
                  <td className="px-3 py-2.5 align-top">
                    <span className="rounded bg-[#f0f0f1] px-2 py-0.5 font-medium text-[#2c3338]">
                      {post.category.vi}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-top text-center text-[#646970]">
                    📷 {imageCount} ảnh
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    {(() => {
                      const { score } = calculatePostSeoScore(post, locale as any);
                      const badgeBg = score >= 80 ? "bg-[#d1e7dd] text-[#0f5132]" : score >= 60 ? "bg-[#fff3cd] text-[#664d03]" : "bg-[#f8d7da] text-[#842029]";
                      return (
                        <div className="flex items-center gap-1.5">
                          <span className={`rounded px-1.5 py-0.5 font-bold text-[11px] ${badgeBg}`}>
                            {score}/100
                          </span>
                          <span className="text-[10px] text-[#646970] hidden sm:inline">Rank Math</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-2.5 align-top text-[#646970] text-[11px] whitespace-nowrap">
                    Đã xuất bản<br />
                    <strong>{post.date}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

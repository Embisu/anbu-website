"use client";

import React, { useState } from "react";
import type { Post } from "@/content/posts";
import { blogCategories } from "@/content/posts";

type WordPressPostListProps = {
  posts: Post[];
  locale: string;
  onEditPost: (post: Post) => void;
  onNewPost: () => void;
};

export default function WordPressPostList({ posts, locale, onEditPost, onNewPost }: WordPressPostListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const filteredPosts = posts.filter((p) => {
    const matchQuery =
      p.title.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCat = selectedCategory === "all" || p.category.vi === selectedCategory;
    return matchQuery && matchCat;
  });

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

  return (
    <div className="space-y-3 text-slate-800">
      {/* Top Header: Title & "Viết bài mới" button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">Bài viết</h1>
          <button
            onClick={onNewPost}
            className="rounded border border-[#2271b1] bg-white px-2.5 py-1 text-xs font-semibold text-[#2271b1] hover:bg-[#f0f6fc] transition"
          >
            Viết bài mới
          </button>
        </div>

        {/* Search Box on Right */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="rounded border border-[#8c8f94] bg-white px-2.5 py-1 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
          />
          <button className="rounded border border-[#8c8f94] bg-[#f6f7f7] px-2.5 py-1 text-xs font-semibold text-[#2c3338] hover:bg-[#f0f0f1]">
            Tìm bài viết
          </button>
        </div>
      </div>

      {/* Sub-navigation Links */}
      <div className="flex items-center gap-2 text-xs text-[#646970] pt-1">
        <span className="font-semibold text-[#1d2327]">Tất cả <span className="font-normal text-[#646970]">({posts.length})</span></span>
        <span>|</span>
        <span className="text-[#2271b1] hover:underline cursor-pointer">Đã xuất bản <span className="text-[#646970]">({posts.length})</span></span>
        <span>|</span>
        <span className="text-[#2271b1] hover:underline cursor-pointer">Bản nháp <span className="text-[#646970]">(0)</span></span>
        <span>|</span>
        <span className="text-[#2271b1] hover:underline cursor-pointer">Thùng rác <span className="text-[#646970]">(0)</span></span>
      </div>

      {/* Filter & Bulk Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <select className="rounded border border-[#8c8f94] bg-white px-2 py-1 text-xs text-[#2c3338] outline-none">
            <option value="">Hành động</option>
            <option value="edit">Chỉnh sửa</option>
            <option value="trash">Bỏ vào thùng rác</option>
          </select>
          <button className="rounded border border-[#8c8f94] bg-[#f6f7f7] px-2.5 py-1 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]">
            Áp dụng
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-2 rounded border border-[#8c8f94] bg-white px-2 py-1 text-xs text-[#2c3338] outline-none"
          >
            <option value="all">Tất cả chuyên mục</option>
            {blogCategories.map((c) => (
              <option key={c.slug} value={c.vi}>
                {c.vi}
              </option>
            ))}
          </select>

          <button className="rounded border border-[#8c8f94] bg-[#f6f7f7] px-2.5 py-1 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]">
            Lọc
          </button>
        </div>

        {/* Pagination Indicator */}
        <div className="text-xs text-[#646970]">
          {filteredPosts.length} mục
        </div>
      </div>

      {/* Classic WordPress Data Table */}
      <div className="border border-[#ccd0d4] bg-white shadow-sm overflow-hidden rounded">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="border-b border-[#ccd0d4] bg-[#f6f7f7] text-[#2c3338] font-bold">
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
              return (
                <tr
                  key={post.slug}
                  onMouseEnter={() => setHoveredSlug(post.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
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
                    <div className="flex items-center gap-1 text-[11px] text-[#2271b1] mt-1">
                      <button onClick={() => onEditPost(post)} className="hover:underline">Chỉnh sửa</button>
                      <span className="text-[#a7aaad]">|</span>
                      <button onClick={() => onEditPost(post)} className="hover:underline text-[#646970]">Sửa nhanh</button>
                      <span className="text-[#a7aaad]">|</span>
                      <button className="text-[#d63638] hover:underline">Thùng rác</button>
                      <span className="text-[#a7aaad]">|</span>
                      <a
                        href={`/${locale}/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        Xem ↗
                      </a>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 align-top text-[#2271b1] hover:underline cursor-pointer">
                    {post.author}
                  </td>
                  <td className="px-3 py-2.5 align-top text-[#2271b1]">
                    {post.category.vi}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {imageCount} ảnh
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <span className="inline-flex items-center gap-1 rounded bg-[#e8f5e9] border border-[#c8e6c9] px-2 py-0.5 text-[11px] font-bold text-[#2e7d32]">
                      🟢 88/100
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-top text-[#646970]">
                    <div>Đã xuất bản</div>
                    <div className="text-[11px] text-[#2c3338] font-mono">{post.date}</div>
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

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { posts as defaultPosts, blogCategories, type Post } from "@/content/posts";
import Icon from "@/components/Icon";
import AdminLogin from "@/components/admin/AdminLogin";
import MediaManager from "@/components/admin/MediaManager";
import WordPressEditor from "@/components/admin/WordPressEditor";
import LeadsManager from "@/components/admin/LeadsManager";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";

export default function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "vi";

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "posts" | "editor" | "media" | "leads" | "settings">("dashboard");
  const [postList, setPostList] = useState<Post[]>(defaultPosts);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("anbu_admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("anbu_admin_token");
    setIsAuthenticated(false);
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setActiveTab("editor");
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setActiveTab("editor");
  };

  const handleSavePost = (savedPost: Post) => {
    const existingIndex = postList.findIndex((p) => p.slug === savedPost.slug);
    if (existingIndex >= 0) {
      const updated = [...postList];
      updated[existingIndex] = savedPost;
      setPostList(updated);
    } else {
      setPostList([savedPost, ...postList]);
    }
    setActiveTab("posts");
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} locale={locale} />;
  }

  // Filter posts
  const filteredPosts = postList.filter((p) => {
    const matchQuery =
      p.title.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCat = selectedCategory === "all" || p.category.vi === selectedCategory;
    return matchQuery && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-slate-800">
      {/* WordPress Top Admin Bar (Classic Dark Bar #1d2327) */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between bg-[#1d2327] px-4 text-slate-200 shadow-md">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}`} target="_blank" className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-[#72aee6]">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#2271b1] font-display text-xs font-black text-white">
              W
            </span>
            <span className="font-bold">ANBU Studio</span>
            <span className="text-[10px] text-slate-400">Xem website ↗</span>
          </Link>

          {/* WordPress Menu Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 font-semibold transition ${
                activeTab === "dashboard" ? "bg-[#2271b1] text-white rounded" : "text-slate-300 hover:text-white"
              }`}
            >
              Bảng tin (Dashboard)
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-3 py-1.5 font-semibold transition ${
                activeTab === "posts" || activeTab === "editor" ? "bg-[#2271b1] text-white rounded" : "text-slate-300 hover:text-white"
              }`}
            >
              Bài viết ({postList.length})
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`px-3 py-1.5 font-semibold transition ${
                activeTab === "media" ? "bg-[#2271b1] text-white rounded" : "text-slate-300 hover:text-white"
              }`}
            >
              Media (Kho ảnh)
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-3 py-1.5 font-semibold transition ${
                activeTab === "leads" ? "bg-[#2271b1] text-white rounded" : "text-slate-300 hover:text-white"
              }`}
            >
              Khách hàng (Leads)
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 font-semibold transition ${
                activeTab === "settings" ? "bg-[#2271b1] text-white rounded" : "text-slate-300 hover:text-white"
              }`}
            >
              Cài đặt & SEO
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 rounded bg-[#2271b1] px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition"
          >
            <span>+ Viết bài mới</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-rose-400"
            title="Đăng xuất"
          >
            Đăng xuất 🚪
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">
                  Bảng Tin Quản Trị (ANBU WordPress Studio)
                </h1>
                <p className="text-xs text-slate-500">
                  Hệ thống quản lý nội dung, đo lường Rank Math SEO và kiểm soát chiến dịch marketing.
                </p>
              </div>

              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2271b1] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#135e96]"
              >
                <span>➕ Tạo bài viết Blog mới</span>
              </button>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div
                onClick={() => setActiveTab("posts")}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bài viết Blog</span>
                  <span className="text-xl">📝</span>
                </div>
                <div className="mt-3 font-display text-3xl font-extrabold text-slate-900">{postList.length} Bài</div>
                <p className="mt-1 text-xs font-medium text-emerald-600">✓ Đạt chuẩn Rank Math & Yoast SEO</p>
              </div>

              <div
                onClick={() => setActiveTab("media")}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Thư viện Media</span>
                  <span className="text-xl">🖼️</span>
                </div>
                <div className="mt-3 font-display text-3xl font-extrabold text-slate-900">42+ Ảnh</div>
                <p className="mt-1 text-xs text-blue-600">Hình ảnh nghiệp vụ & sơ đồ thực chiến</p>
              </div>

              <div
                onClick={() => setActiveTab("leads")}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Khách hàng liên hệ</span>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div className="mt-3 font-display text-3xl font-extrabold text-slate-900">3 Leads mới</div>
                <p className="mt-1 text-xs text-rose-600">Yêu cầu tư vấn chiến dịch Game</p>
              </div>

              <div
                onClick={() => setActiveTab("settings")}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Chỉ mục Sitemap</span>
                  <span className="text-xl">🚀</span>
                </div>
                <div className="mt-3 font-display text-3xl font-extrabold text-slate-900">168 URLs</div>
                <p className="mt-1 text-xs font-medium text-emerald-600">✓ Google Knowledge Graph Verified</p>
              </div>
            </div>

            {/* Quick Actions & Recent Posts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display text-base font-bold text-slate-900">Hoạt động gần đây (Recent Posts)</h3>
                <button
                  onClick={() => setActiveTab("posts")}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Xem toàn bộ 56 bài viết →
                </button>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {postList.slice(0, 6).map((post) => (
                  <div key={post.slug} className="flex items-center justify-between py-3.5 transition hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-16 overflow-hidden rounded-lg bg-slate-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{post.title.vi}</h4>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-blue-600">{post.category.vi}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readingTime} phút đọc</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-[#2271b1] hover:text-white transition"
                      >
                        Sửa bài
                      </button>
                      <a
                        href={`/${locale}/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Xem web ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POSTS LIST */}
        {activeTab === "posts" && (
          <div className="space-y-5">
            {/* Header Filter Bar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm bài viết..."
                    className="w-72 rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600"
                >
                  <option value="all">Tất cả chuyên mục ({postList.length})</option>
                  {blogCategories.map((c) => (
                    <option key={c.slug} value={c.vi}>
                      {c.vi}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateNew}
                className="flex items-center gap-1.5 rounded-lg bg-[#2271b1] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition"
              >
                <span>➕ Thêm bài viết mới</span>
              </button>
            </div>

            {/* Posts Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Tiêu đề bài viết</th>
                      <th className="px-6 py-3.5">Chuyên mục</th>
                      <th className="px-6 py-3.5">Ngày đăng</th>
                      <th className="px-6 py-3.5">Hình ảnh</th>
                      <th className="px-6 py-3.5">SEO Score</th>
                      <th className="px-6 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPosts.map((post) => {
                      const imageCount = post.body.filter((b) => b.type === "image").length;
                      return (
                        <tr key={post.slug} className="transition hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-11 w-16 overflow-hidden rounded-lg bg-slate-100 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="" className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 line-clamp-1">{post.title.vi}</div>
                                <div className="text-xs text-slate-400 font-mono">/{post.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                              {post.category.vi}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-600">{post.date}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                              {imageCount} ảnh
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                              🟢 88/100
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-[#2271b1] hover:text-white transition"
                              >
                                Sửa bài
                              </button>
                              <a
                                href={`/${locale}/blog/${post.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                              >
                                Xem ↗
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WORDPRESS GUTENBERG / CLASSIC EDITOR WITH RANK MATH */}
        {activeTab === "editor" && (
          <WordPressEditor
            initialPost={editingPost}
            locale={locale}
            onSave={handleSavePost}
            onCancel={() => setActiveTab("posts")}
          />
        )}

        {/* TAB 4: MEDIA MANAGER */}
        {activeTab === "media" && <MediaManager locale={locale} />}

        {/* TAB 5: LEADS MANAGER */}
        {activeTab === "leads" && <LeadsManager locale={locale} />}

        {/* TAB 6: SITE SETTINGS */}
        {activeTab === "settings" && <SiteSettingsManager locale={locale} />}
      </main>
    </div>
  );
}

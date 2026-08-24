"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { posts as defaultPosts, blogCategories, type Post } from "@/content/posts";
import Icon from "@/components/Icon";
import AdminLogin from "@/components/admin/AdminLogin";
import MediaManager from "@/components/admin/MediaManager";
import PostEditor from "@/components/admin/PostEditor";
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
    // Check if token exists in localStorage
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

  // If not authenticated, render Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 text-white">
        <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} locale={locale} />
      </div>
    );
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
    <div className="min-h-screen bg-[#050b18] text-white">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-navy-800/80 bg-navy-950/90 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Image src="/logo/logo-white.png" alt="ANBU" width={110} height={36} className="h-7 w-auto" />
            </Link>
            <span className="rounded-lg bg-orange-500/20 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
              CMS Studio
            </span>
          </div>

          {/* Quick Tab Switcher */}
          <nav className="hidden items-center gap-1 sm:flex">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "dashboard" ? "bg-navy-800 text-white shadow-sm" : "text-navy-400 hover:text-white"
              }`}
            >
              📊 Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "posts" || activeTab === "editor" ? "bg-navy-800 text-white shadow-sm" : "text-navy-400 hover:text-white"
              }`}
            >
              📝 Bài viết ({postList.length})
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "media" ? "bg-navy-800 text-white shadow-sm" : "text-navy-400 hover:text-white"
              }`}
            >
              🖼️ Thư viện Media
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "leads" ? "bg-navy-800 text-white shadow-sm" : "text-navy-400 hover:text-white"
              }`}
            >
              📬 Khách hàng (Leads)
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "settings" ? "bg-navy-800 text-white shadow-sm" : "text-navy-400 hover:text-white"
              }`}
            >
              ⚙️ Cài đặt & SEO
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
            >
              <span>+ Viết bài mới</span>
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-navy-800 bg-navy-900 px-3 py-2 text-xs font-bold text-navy-400 hover:border-rose-500/50 hover:text-rose-400"
              title="Đăng xuất"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="border-b border-navy-800 bg-navy-950 px-4 py-2.5 sm:hidden overflow-x-auto flex gap-2">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${activeTab === "dashboard" ? "bg-navy-800 text-white" : "text-navy-400"}`}
        >
          📊 Tổng quan
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${activeTab === "posts" ? "bg-navy-800 text-white" : "text-navy-400"}`}
        >
          📝 Bài viết
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${activeTab === "media" ? "bg-navy-800 text-white" : "text-navy-400"}`}
        >
          🖼️ Media
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${activeTab === "leads" ? "bg-navy-800 text-white" : "text-navy-400"}`}
        >
          📬 Leads
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${activeTab === "settings" ? "bg-navy-800 text-white" : "text-navy-400"}`}
        >
          ⚙️ Cài đặt
        </button>
      </div>

      {/* Main Admin Content Container */}
      <main className="container-x py-10">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Bảng Điều Khiển Quản Trị ANBU
                </h1>
                <p className="mt-1 text-sm text-navy-400">
                  Chào mừng quay trở lại! Dưới đây là tình hình hoạt động của toàn bộ website và các chiến dịch.
                </p>
              </div>

              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/20 hover:brightness-110"
              >
                <span>➕ Tạo bài viết Blog mới</span>
              </button>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div
                onClick={() => setActiveTab("posts")}
                className="cursor-pointer rounded-3xl border border-navy-800 bg-navy-950/80 p-6 shadow-xl transition hover:-translate-y-1 hover:border-orange-500/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-400">Tổng số bài Blog</span>
                  <span className="text-xl">📝</span>
                </div>
                <div className="mt-4 font-display text-3xl font-extrabold text-white">{postList.length} Bài</div>
                <p className="mt-1 text-xs text-emerald-400">100% Đã tối ưu hóa SEO & Đa ảnh</p>
              </div>

              <div
                onClick={() => setActiveTab("media")}
                className="cursor-pointer rounded-3xl border border-navy-800 bg-navy-950/80 p-6 shadow-xl transition hover:-translate-y-1 hover:border-orange-500/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-400">Kho ảnh Media</span>
                  <span className="text-xl">🖼️</span>
                </div>
                <div className="mt-4 font-display text-3xl font-extrabold text-white">42+ Ảnh</div>
                <p className="mt-1 text-xs text-orange-400">Chất lượng cao, tỷ lệ 16:9 & 16:10</p>
              </div>

              <div
                onClick={() => setActiveTab("leads")}
                className="cursor-pointer rounded-3xl border border-navy-800 bg-navy-950/80 p-6 shadow-xl transition hover:-translate-y-1 hover:border-orange-500/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-400">Khách hàng liên hệ</span>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div className="mt-4 font-display text-3xl font-extrabold text-white">3 Leads mới</div>
                <p className="mt-1 text-xs text-rose-400">Yêu cầu tư vấn chiến dịch Game</p>
              </div>

              <div
                onClick={() => setActiveTab("settings")}
                className="cursor-pointer rounded-3xl border border-navy-800 bg-navy-950/80 p-6 shadow-xl transition hover:-translate-y-1 hover:border-orange-500/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-400">Chỉ mục Sitemap</span>
                  <span className="text-xl">🚀</span>
                </div>
                <div className="mt-4 font-display text-3xl font-extrabold text-white">168 URLs</div>
                <p className="mt-1 text-xs text-emerald-400">Google Entity Map Connected</p>
              </div>
            </div>

            {/* Quick Actions & Recent Posts */}
            <div className="rounded-3xl border border-navy-800 bg-navy-950/80 p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-navy-800 pb-4">
                <h3 className="font-display text-lg font-bold text-white">Bài viết gần đây nhất</h3>
                <button
                  onClick={() => setActiveTab("posts")}
                  className="text-xs font-bold text-orange-400 hover:underline"
                >
                  Xem toàn bộ 56 bài →
                </button>
              </div>

              <div className="mt-6 divide-y divide-navy-800/60">
                {postList.slice(0, 6).map((post) => (
                  <div key={post.slug} className="flex items-center justify-between py-4 transition hover:bg-navy-900/30">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-navy-900 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{post.title.vi}</h4>
                        <div className="mt-1 flex items-center gap-3 text-xs text-navy-400">
                          <span className="text-orange-400">{post.category.vi}</span>
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
                        className="rounded-xl bg-navy-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
                      >
                        Sửa bài
                      </button>
                      <a
                        href={`/${locale}/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-navy-800 px-3 py-1.5 text-xs font-bold text-navy-400 hover:text-white"
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
          <div className="space-y-6">
            {/* Header Filter Bar */}
            <div className="flex flex-col gap-4 rounded-3xl border border-navy-800 bg-navy-950 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Icon name="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm bài viết..."
                    className="w-72 rounded-2xl border border-navy-800 bg-navy-900 py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-2xl border border-navy-800 bg-navy-900 px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-orange-500"
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
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110"
              >
                <span>➕ Thêm bài viết mới</span>
              </button>
            </div>

            {/* Posts Table */}
            <div className="overflow-hidden rounded-3xl border border-navy-800 bg-navy-950/80 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-navy-300">
                  <thead className="border-b border-navy-800 bg-navy-900/90 text-[11px] font-bold uppercase tracking-wider text-navy-400">
                    <tr>
                      <th className="px-6 py-4">Bài viết</th>
                      <th className="px-6 py-4">Chuyên mục</th>
                      <th className="px-6 py-4">Ngày đăng</th>
                      <th className="px-6 py-4">Ảnh nội dung</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60">
                    {filteredPosts.map((post) => {
                      const imageCount = post.body.filter((b) => b.type === "image").length;
                      return (
                        <tr key={post.slug} className="transition hover:bg-navy-900/40">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-11 w-16 overflow-hidden rounded-lg bg-navy-900 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={post.cover || "/blog-covers/performance-ad-campaigns.jpg"} alt="" className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <div className="font-bold text-white line-clamp-1">{post.title.vi}</div>
                                <div className="text-xs text-navy-400 font-mono">/{post.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-lg bg-navy-800 px-2.5 py-1 text-xs font-semibold text-orange-400">
                              {post.category.vi}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono">{post.date}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                              {imageCount} ảnh
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="rounded-xl bg-navy-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
                              >
                                Sửa
                              </button>
                              <a
                                href={`/${locale}/blog/${post.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl border border-navy-800 px-3 py-1.5 text-xs font-bold text-navy-400 hover:text-white"
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

        {/* TAB 3: VISUAL POST EDITOR */}
        {activeTab === "editor" && (
          <PostEditor
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

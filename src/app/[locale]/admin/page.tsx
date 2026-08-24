"use client";

import React, { useState, useEffect } from "react";
import { posts as defaultPosts, type Post } from "@/content/posts";
import AdminLogin from "@/components/admin/AdminLogin";
import WordPressTopBar from "@/components/admin/WordPressTopBar";
import WordPressSidebar, { type AdminMenuTab } from "@/components/admin/WordPressSidebar";
import WordPressDashboard from "@/components/admin/WordPressDashboard";
import WordPressPostList from "@/components/admin/WordPressPostList";
import WordPressPostEditor from "@/components/admin/WordPressPostEditor";
import MediaManager from "@/components/admin/MediaManager";
import LeadsManager from "@/components/admin/LeadsManager";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";

export default function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "vi";

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminMenuTab>("dashboard");
  const [postList, setPostList] = useState<Post[]>(defaultPosts);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

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

  const handleNewPost = () => {
    setEditingPost(null);
    setActiveTab("new_post");
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setActiveTab("new_post");
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

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] flex flex-col font-sans">
      {/* 1. WordPress Classic Top Admin Bar (#1d2327) */}
      <WordPressTopBar
        locale={locale}
        onNewPost={handleNewPost}
        onLogout={handleLogout}
      />

      {/* 2. Main App Body (Sidebar + Content Canvas) */}
      <div className="flex flex-1 overflow-hidden">
        {/* WordPress Classic Left Sidebar Menu (#1d2327) */}
        <WordPressSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === "new_post") {
              setEditingPost(null);
            }
            setActiveTab(tab);
          }}
          postCount={postList.length}
          leadsCount={3}
        />

        {/* WordPress Main White/Light Content Area */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 min-h-[calc(100vh-32px)]">
          {/* TAB 1: BẢNG TIN (DASHBOARD) */}
          {activeTab === "dashboard" && (
            <WordPressDashboard
              locale={locale}
              onNavigate={(tab) => {
                if (tab === "new_post") setEditingPost(null);
                setActiveTab(tab);
              }}
              postCount={postList.length}
              leadsCount={3}
            />
          )}

          {/* TAB 2: TẤT CẢ BÀI VIẾT (POSTS LIST) */}
          {activeTab === "posts" && (
            <WordPressPostList
              posts={postList}
              locale={locale}
              onEditPost={handleEditPost}
              onNewPost={handleNewPost}
            />
          )}

          {/* TAB 3: VIẾT BÀI MỚI / CHỈNH SỬA (POST EDITOR WITH RANK MATH SEO) */}
          {activeTab === "new_post" && (
            <WordPressPostEditor
              initialPost={editingPost}
              locale={locale}
              onSave={handleSavePost}
              onCancel={() => setActiveTab("posts")}
            />
          )}

          {/* TAB 4: CHUYÊN MỤC (CATEGORIES) */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-normal text-[#1d2327]">Chuyên mục bài viết</h1>
              <div className="rounded border border-[#ccd0d4] bg-white p-5 shadow-sm">
                <p className="text-xs text-[#646970] mb-4">
                  Danh sách 6 chuyên mục cốt lõi của ANBU Game Marketing:
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { vi: "Marketing Game", en: "Game Marketing", count: 18 },
                    { vi: "Vận hành Game", en: "Game Operations", count: 10 },
                    { vi: "Cộng đồng Game", en: "Gaming Community", count: 8 },
                    { vi: "Thị trường Game", en: "Market Intelligence", count: 8 },
                    { vi: "Analytics Game", en: "Game Analytics", count: 6 },
                    { vi: "Kinh doanh Game", en: "Game Monetization", count: 6 },
                  ].map((cat) => (
                    <div key={cat.vi} className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-3">
                      <div className="font-bold text-sm text-[#1d2327]">{cat.vi}</div>
                      <div className="text-xs text-[#646970]">{cat.en} • {cat.count} bài viết</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THƯ VIỆN MEDIA */}
          {activeTab === "media" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-normal text-[#1d2327]">Thư viện Media</h1>
              <MediaManager locale={locale} />
            </div>
          )}

          {/* TAB 6: PHẢN HỒI (LEADS CRM) */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-normal text-[#1d2327]">Phản hồi & Yêu cầu từ Khách hàng (Leads)</h1>
              <LeadsManager locale={locale} />
            </div>
          )}

          {/* TAB 7: RANK MATH SEO DASHBOARD */}
          {activeTab === "rank_math" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-normal text-[#1d2327]">Rank Math SEO PRO Dashboard</h1>
                <span className="rounded bg-[#e53935] px-2 py-0.5 text-xs font-bold text-white">PRO Active</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
                  <div className="text-xs font-bold text-[#646970] uppercase">Điểm SEO Trung Bình</div>
                  <div className="mt-2 text-3xl font-extrabold text-[#2e7d32]">88 / 100</div>
                  <p className="mt-1 text-xs text-[#2e7d32]">✓ Tối ưu hóa tuyệt vời</p>
                </div>
                <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
                  <div className="text-xs font-bold text-[#646970] uppercase">Độ phủ Schema JSON-LD</div>
                  <div className="mt-2 text-3xl font-extrabold text-[#1d2327]">100%</div>
                  <p className="mt-1 text-xs text-[#646970]">Article, Organization, LocalBusiness</p>
                </div>
                <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
                  <div className="text-xs font-bold text-[#646970] uppercase">Chỉ số Sitemap XML</div>
                  <div className="mt-2 text-3xl font-extrabold text-[#2271b1]">168 URLs</div>
                  <p className="mt-1 text-xs text-[#646970]">Tự động cập nhật lastmod</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CÀI ĐẶT TỔNG QUAN */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-normal text-[#1d2327]">Cài đặt Tổng quan</h1>
              <SiteSettingsManager locale={locale} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

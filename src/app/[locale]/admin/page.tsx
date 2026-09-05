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
import CommentsManager from "@/components/admin/CommentsManager";
import LeadsManager from "@/components/admin/LeadsManager";
import UsersManager from "@/components/admin/UsersManager";
import RankMathSiteAudit from "@/components/admin/RankMathSiteAudit";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import { calculatePostSeoScore } from "@/lib/seo-score";

export default function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "vi";

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminMenuTab>("dashboard");
  const [postList, setPostList] = useState<Post[]>(defaultPosts);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<{ username: string; name: string; role: string } | null>(null);
  const [pendingCommentsCount, setPendingCommentsCount] = useState<number>(0);
  const [publishNotice, setPublishNotice] = useState<{
    slug: string;
    title: string;
    githubSynced?: boolean;
    commitUrl?: string;
    error?: string;
    loading?: boolean;
  } | null>(null);

  // Load custom posts from localStorage & API on mount
  useEffect(() => {
    const token = localStorage.getItem("anbu_admin_token");
    const savedUser = localStorage.getItem("anbu_admin_user");
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }

    try {
      const savedCustomPosts = localStorage.getItem("anbu_custom_posts");
      if (savedCustomPosts) {
        const custom: Post[] = JSON.parse(savedCustomPosts);
        if (Array.isArray(custom) && custom.length > 0) {
          // Merge: custom posts take precedence if same slug, else prepend
          const combined = [...custom];
          defaultPosts.forEach((dp) => {
            if (!combined.some((cp) => cp.slug === dp.slug)) {
              combined.push(dp);
            }
          });
          setPostList(combined);
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Sync with API in background
    fetch("/api/admin/posts")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && Array.isArray(data.posts) && data.posts.length > 0) {
          setPostList((prev) => {
            const merged = [...data.posts];
            prev.forEach((p) => {
              if (!merged.some((m: Post) => m.slug === p.slug)) {
                merged.push(p);
              }
            });
            return merged;
          });
        }
      })
      .catch(() => {});

    // Fetch pending comments count for badge
    fetch("/api/comments?status=pending")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && Array.isArray(data.comments)) {
          setPendingCommentsCount(data.comments.length);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("anbu_admin_token");
    localStorage.removeItem("anbu_admin_user");
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setPublishNotice(null);
    setActiveTab("new_post");
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setPublishNotice(null);
    setActiveTab("new_post");
  };

  const handleSavePost = (savedPost: Post) => {
    const existingIndex = postList.findIndex((p) => p.slug === savedPost.slug);
    let updatedList: Post[];
    if (existingIndex >= 0) {
      updatedList = [...postList];
      updatedList[existingIndex] = savedPost;
    } else {
      updatedList = [savedPost, ...postList];
    }
    setPostList(updatedList);

    // 1. Persist custom posts in localStorage
    try {
      const savedCustom = localStorage.getItem("anbu_custom_posts");
      let customArr: Post[] = savedCustom ? JSON.parse(savedCustom) : [];
      const cIdx = customArr.findIndex((p) => p.slug === savedPost.slug);
      if (cIdx >= 0) {
        customArr[cIdx] = savedPost;
      } else {
        customArr.unshift(savedPost);
      }
      localStorage.setItem("anbu_custom_posts", JSON.stringify(customArr));
    } catch (e) {
      console.error(e);
    }

    // 2. Persist to API
    fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: savedPost }),
    }).catch(console.error);

    // 3. Try to Auto-Publish to GitHub
    const githubToken = localStorage.getItem("anbu_github_token") || "";
    setPublishNotice({
      slug: savedPost.slug,
      title: savedPost.title.vi || savedPost.title.en,
      loading: true,
    });

    fetch("/api/admin/posts/github-publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: savedPost, token: githubToken || undefined }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setPublishNotice({
            slug: savedPost.slug,
            title: savedPost.title.vi || savedPost.title.en,
            githubSynced: true,
            commitUrl: data.commitUrl,
            loading: false,
          });
        } else {
          setPublishNotice({
            slug: savedPost.slug,
            title: savedPost.title.vi || savedPost.title.en,
            githubSynced: false,
            error: data.error,
            loading: false,
          });
        }
      })
      .catch((err) => {
        setPublishNotice({
          slug: savedPost.slug,
          title: savedPost.title.vi || savedPost.title.en,
          githubSynced: false,
          error: err.message,
          loading: false,
        });
      });

    setActiveTab("posts");
  };

  const handleUpdatePostList = (newList: Post[]) => {
    setPostList(newList);
    try {
      const customOnly = newList.filter((p) => !defaultPosts.some((dp) => dp.slug === p.slug));
      localStorage.setItem("anbu_custom_posts", JSON.stringify(customOnly));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={(token, user) => {
          setIsAuthenticated(true);
          setCurrentUser(user);
        }}
        locale={locale}
      />
    );
  }

  const avgScore = Math.round(
    postList.reduce((acc, p) => acc + calculatePostSeoScore(p, locale as any).score, 0) / (postList.length || 1)
  );

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] flex flex-col font-sans">
      {/* 1. WordPress Classic Top Admin Bar (#1d2327) */}
      <WordPressTopBar
        locale={locale}
        avgScore={avgScore}
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
            setPublishNotice(null);
            setActiveTab(tab);
          }}
          postCount={postList.length}
          leadsCount={3}
          commentsCount={pendingCommentsCount}
        />

        {/* WordPress Main White/Light Content Area */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 min-h-[calc(100vh-32px)]">
          {/* Publish Success Notice Banner */}
          {publishNotice && activeTab === "posts" && (
            <div
              className={`mb-5 rounded border-l-4 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in ${
                publishNotice.loading
                  ? "border-blue-500 bg-blue-50/80"
                  : publishNotice.githubSynced
                  ? "border-emerald-500 bg-emerald-50/90"
                  : "border-amber-500 bg-amber-50/90"
              }`}
            >
              <div>
                {publishNotice.loading ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <p className="font-bold text-xs sm:text-sm text-blue-900">
                      Đang tự động đẩy bài viết "{publishNotice.title}" lên GitHub & kích hoạt Cloudflare...
                    </p>
                  </div>
                ) : publishNotice.githubSynced ? (
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-emerald-900">
                      ✅ Đã tự động xuất bản lên GitHub & kích hoạt Cloudflare Pages!
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Bài viết "{publishNotice.title}" sẽ hiển thị cho 100% người dùng trên toàn cầu sau ~1 phút.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-amber-900">
                      ⚡ Bài viết đã được lưu trên máy của bạn.
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {publishNotice.error
                        ? `Lỗi đẩy GitHub: ${publishNotice.error}`
                        : "Để tự động xuất hiện trên mọi thiết bị toàn cầu, hãy vào Cài đặt Tổng quan nhập GitHub Token."}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/${locale}/blog/${publishNotice.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-[#2271b1] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition inline-flex items-center gap-1"
                >
                  Xem bài viết ↗
                </a>
                {!publishNotice.githubSynced && !publishNotice.loading && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("settings")}
                    className="rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs font-bold text-[#2c3338] hover:bg-[#f0f0f1]"
                  >
                    Cài đặt GitHub Token
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPublishNotice(null)}
                  className="text-xs text-[#646970] hover:text-[#1d2327] px-2 py-1"
                >
                  Đóng ✕
                </button>
              </div>
            </div>
          )}

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
              onUpdatePosts={handleUpdatePostList}
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

          {/* TAB 5.5: QUẢN LÝ BÌNH LUẬN (COMMENTS MODERATION) */}
          {activeTab === "comments" && (
            <CommentsManager locale={locale} />
          )}

          {/* TAB 6: PHẢN HỒI (LEADS CRM) */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-normal text-[#1d2327]">Phản hồi & Yêu cầu từ Khách hàng (Leads)</h1>
              <LeadsManager locale={locale} />
            </div>
          )}

          {/* TAB 7: RANK MATH SEO AUDIT & ADVISOR */}
          {activeTab === "rank_math" && (
            <RankMathSiteAudit
              posts={postList}
              locale={locale}
              onEditPost={handleEditPost}
            />
          )}

          {/* TAB 8: THÀNH VIÊN (USERS MANAGEMENT) */}
          {activeTab === "users" && (
            <UsersManager locale={locale} />
          )}

          {/* TAB 9: CÀI ĐẶT TỔNG QUAN */}
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

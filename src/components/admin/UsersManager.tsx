"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/adminFetch";

export type AdminRole = "administrator" | "editor" | "author" | "contributor";

export type AdminUser = {
  id: string;
  username: string;
  displayName: string;
  jobTitle?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  socials?: { facebook?: string; telegram?: string };
  role: AdminRole;
  postsCount?: number;
  createdAt: string;
  /** "system" = one of the 3 break-glass accounts (Cloudflare Secret password, not editable here).
   *  "d1" = a real team member stored in Cloudflare D1 — fully editable, real login. */
  source: "system" | "d1";
};

// The 3 break-glass system accounts always exist; their passwords live in
// Cloudflare Pages Secrets (ADMIN_PASSWORD/EDITOR_PASSWORD/AUTHOR_PASSWORD),
// never in this UI or any database.
const SYSTEM_USERS: AdminUser[] = [
  {
    id: "system-admin",
    username: "admin",
    displayName: "ANBU Team (Chuyên gia Game Marketing)",
    jobTitle: "Head of Marketing & Operations",
    bio: "Chuyên gia hoạch định chiến lược Go-To-Market, User Acquisition và tối ưu hóa LiveOps cho các tựa game mobile tại Việt Nam và Đông Nam Á.",
    avatar: "/blog-covers/team-strategy-meeting.jpg",
    email: "contact@anbu.asia",
    role: "administrator",
    postsCount: 42,
    socials: { facebook: "https://facebook.com/anbu.asia", telegram: "https://t.me/anbu_asia" },
    createdAt: "2026-01-01",
    source: "system",
  },
  {
    id: "system-editor",
    username: "editor",
    displayName: "Ban Biên Tập ANBU Studio",
    jobTitle: "Senior Game Editorial Lead",
    bio: "Phụ trách kiểm duyệt chất lượng nội dung phân tích chuyên sâu, trích dẫn số liệu thị trường và chuẩn hóa SEO E-E-A-T.",
    avatar: "/blog-covers/content-editorial-writing.jpg",
    email: "editorial@anbu.asia",
    role: "editor",
    postsCount: 14,
    socials: { facebook: "https://facebook.com/anbu.asia" },
    createdAt: "2026-03-15",
    source: "system",
  },
  {
    id: "system-author",
    username: "author",
    displayName: "ANBU UA & LiveOps Specialist",
    jobTitle: "User Acquisition Specialist",
    bio: "Tập trung phân tích CPI/ROAS, chiến lược A/B testing sáng tạo trên TikTok/Meta Ads và xây dựng cộng đồng Discord cho game.",
    avatar: "/blog-covers/creative-testing-lab.jpg",
    email: "writer@anbu.asia",
    role: "author",
    postsCount: 6,
    createdAt: "2026-05-20",
    source: "system",
  },
];

function mapD1User(row: any): AdminUser {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    jobTitle: row.job_title || undefined,
    bio: row.bio || undefined,
    avatar: row.avatar || undefined,
    email: row.email || undefined,
    socials: { facebook: row.facebook || undefined, telegram: row.telegram || undefined },
    role: row.role,
    createdAt: String(row.created_at || "").slice(0, 10),
    source: "d1",
  };
}

export default function UsersManager({ locale }: { locale: string }) {
  const [d1Users, setD1Users] = useState<AdminUser[]>([]);
  const [dbAvailable, setDbAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "profile" | "add">("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser>(SYSTEM_USERS[0]);
  const [toast, setToast] = useState<string | null>(null);

  const users = [...SYSTEM_USERS, ...d1Users];

  // Form fields for new user
  const [newUsername, setNewUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newJobTitle, setNewJobTitle] = useState("Game Marketing Specialist");
  const [newRole, setNewRole] = useState<AdminRole>("editor");

  // Profile Edit fields
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileJobTitle, setProfileJobTitle] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileFacebook, setProfileFacebook] = useState("");
  const [profileTelegram, setProfileTelegram] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/users");
      const data = await res.json();
      if (data.ok) {
        setD1Users((data.users || []).map(mapD1User));
        setDbAvailable(data.dbAvailable !== false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenEditProfile = (u: AdminUser) => {
    setSelectedUser(u);
    setProfileDisplayName(u.displayName);
    setProfileJobTitle(u.jobTitle || "");
    setProfileBio(u.bio || "");
    setProfileAvatar(u.avatar || "");
    setProfileEmail(u.email || "");
    setProfilePassword("");
    setProfileFacebook(u.socials?.facebook || "");
    setProfileTelegram(u.socials?.telegram || "");
    setError(null);
    setActiveTab("profile");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser.source === "system") return; // no form fields submit for system accounts (read-only below)

    setSaving(true);
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/users/${encodeURIComponent(selectedUser.username)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: profilePassword.trim() || undefined,
          displayName: profileDisplayName.trim(),
          jobTitle: profileJobTitle.trim(),
          bio: profileBio.trim(),
          avatar: profileAvatar.trim(),
          email: profileEmail.trim(),
          facebook: profileFacebook.trim(),
          telegram: profileTelegram.trim(),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Lỗi lưu hồ sơ");

      await loadUsers();
      showNotification(
        `Đã lưu hồ sơ "${selectedUser.username}" thành công!` +
          (profilePassword.trim() ? " Mật khẩu mới có hiệu lực ngay từ lần đăng nhập tiếp theo." : "")
      );
      setActiveTab("all");
    } catch (err: any) {
      setError(err.message || "Lỗi lưu hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername.trim(),
          password: newPassword.trim(),
          role: newRole,
          displayName: newName.trim() || newUsername.trim(),
          jobTitle: newJobTitle.trim(),
          email: newEmail.trim(),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Lỗi tạo thành viên");

      await loadUsers();
      showNotification(`Đã tạo thành viên "${newName.trim() || newUsername.trim()}" thành công! Họ có thể đăng nhập ngay bằng mật khẩu vừa đặt.`);
      setActiveTab("all");
      setNewUsername("");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message || "Lỗi tạo thành viên");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (u: AdminUser) => {
    if (u.source === "system") return;
    if (!confirm(`Bạn có chắc chắn muốn xóa thành viên "${u.username}" không? Họ sẽ mất quyền đăng nhập ngay lập tức.`)) return;

    try {
      const res = await adminFetch(`/api/admin/users/${encodeURIComponent(u.username)}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Lỗi xóa thành viên");
      await loadUsers();
      showNotification(`Đã xóa thành viên "${u.username}"!`);
    } catch (err: any) {
      alert(err.message || "Lỗi xóa thành viên");
    }
  };

  const getRoleLabel = (r: AdminRole) => {
    switch (r) {
      case "administrator":
        return { label: "Quản trị viên (Admin)", color: "bg-purple-100 text-purple-800 border-purple-200" };
      case "editor":
        return { label: "Biên tập viên (Editor)", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "author":
        return { label: "Tác giả (Author)", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      default:
        return { label: "Cộng tác viên", color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">Thành viên (Users & Team)</h1>
          <button
            onClick={() => setActiveTab("add")}
            className="rounded border border-[#2271b1] bg-white px-2.5 py-1 text-xs font-semibold text-[#2271b1] hover:bg-[#f0f6fc] transition"
          >
            Thêm mới thành viên
          </button>
        </div>
        <div className="text-xs text-[#646970]">
          Tổng cộng: <strong>{users.length}</strong> thành viên{loading ? " (đang tải...)" : ""}
        </div>
      </div>

      {!dbAvailable && (
        <div className="rounded border border-rose-300 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
          ⚠️ Chưa kết nối được D1 database (ADMIN_DB). Chỉ 3 tài khoản hệ thống hoạt động; thêm/sửa thành viên mới sẽ bị lỗi.
        </div>
      )}

      {toast && (
        <div className="rounded border-l-4 border-emerald-500 bg-white p-3 shadow-sm text-xs font-bold text-emerald-800">
          ✓ {toast}
        </div>
      )}
      {error && (
        <div className="rounded border-l-4 border-rose-500 bg-white p-3 shadow-sm text-xs font-bold text-rose-800">
          ✕ {error}
        </div>
      )}

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-[#ccd0d4] text-xs font-semibold">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 border-b-2 transition ${
            activeTab === "all"
              ? "border-[#2271b1] text-[#1d2327] font-bold bg-white"
              : "border-transparent text-[#646970] hover:text-[#1d2327]"
          }`}
        >
          Tất cả thành viên ({users.length})
        </button>
        <button
          onClick={() => handleOpenEditProfile(selectedUser || users[0])}
          className={`px-4 py-2 border-b-2 transition ${
            activeTab === "profile"
              ? "border-[#2271b1] text-[#1d2327] font-bold bg-white"
              : "border-transparent text-[#646970] hover:text-[#1d2327]"
          }`}
        >
          👤 Tùy chỉnh Hồ sơ cá nhân (Custom Profile)
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 border-b-2 transition ${
            activeTab === "add"
              ? "border-[#2271b1] text-[#1d2327] font-bold bg-white"
              : "border-transparent text-[#646970] hover:text-[#1d2327]"
          }`}
        >
          ➕ Thêm thành viên mới
        </button>
      </div>

      {/* TAB 1: ALL USERS LIST */}
      {activeTab === "all" && (
        <div className="space-y-4">
          <div className="border border-[#ccd0d4] bg-white shadow-sm overflow-hidden rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-[#ccd0d4] bg-[#f6f7f7] text-[#2c3338] font-bold">
                <tr>
                  <th className="px-4 py-2.5">Ảnh & Tên đăng nhập</th>
                  <th className="px-4 py-2.5">Tên hiển thị & Chức danh</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Vai trò (Role)</th>
                  <th className="px-4 py-2.5">Bài viết</th>
                  <th className="px-4 py-2.5 text-right">Tùy chỉnh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f1]">
                {users.map((u) => {
                  const roleInfo = getRoleLabel(u.role);
                  return (
                    <tr key={u.id} className="hover:bg-[#f6f7f7] transition">
                      <td className="px-4 py-3 font-mono font-bold text-[#2271b1] flex items-center gap-2.5">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#ccd0d4] bg-[#3c434a] shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={u.avatar || "/blog-covers/creator-program.jpg"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            {u.username}
                            {u.source === "system" && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500" title="Mật khẩu qua Cloudflare Secret">
                                HỆ THỐNG
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#646970] font-sans font-normal">Tạo: {u.createdAt}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#1d2327]">{u.displayName}</div>
                        <div className="text-[11px] text-[#646970]">{u.jobTitle || "Game Marketing"}</div>
                      </td>
                      <td className="px-4 py-3 text-[#646970] font-mono">{u.email || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-bold ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#2271b1]">{u.postsCount != null ? `${u.postsCount} bài` : "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProfile(u)}
                            className="rounded border border-[#2271b1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-[#f0f6fc]"
                          >
                            ✏️ Tùy chỉnh
                          </button>
                          {u.source === "d1" && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="rounded border border-[#d63638] bg-white px-2 py-1 text-[11px] font-semibold text-[#d63638] hover:bg-rose-50"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM USER PROFILE (WordPress Edit Profile Page) */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-6 text-xs text-[#2c3338]">
          <div className="border-b border-[#ccd0d4] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1d2327]">
                Tùy Chỉnh Hồ Sơ Thành Viên: <span className="text-[#2271b1] font-mono">{selectedUser.username}</span>
              </h3>
              <p className="text-[11px] text-[#646970]">
                {selectedUser.source === "system"
                  ? "Tài khoản hệ thống — hồ sơ cố định, không chỉnh sửa được từ đây"
                  : "Chỉnh sửa tên hiển thị tác giả, tiểu sử, ảnh đại diện và mật khẩu đăng nhập"}
              </p>
            </div>
            <span className="rounded bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-blue-800">
              Vai trò: {selectedUser.role.toUpperCase()}
            </span>
          </div>

          {selectedUser.source === "system" ? (
            <div className="rounded border border-amber-300 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
              ⚠️ Đây là 1 trong 3 tài khoản hệ thống (admin/editor/author). Tên hiển thị, tiểu sử và mật khẩu của tài
              khoản này được cấu hình cố định trong code và Cloudflare Secrets — không sửa được qua giao diện này.
              Muốn đổi mật khẩu: vào Cloudflare Dashboard → Settings → Variables and secrets.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Username (Read only) */}
              <div>
                <label className="block font-bold text-[#50575e] mb-1">Tên đăng nhập (Username):</label>
                <input
                  type="text"
                  readOnly
                  value={selectedUser.username}
                  className="w-full rounded border border-[#ccd0d4] bg-slate-100 p-2 font-mono text-xs text-[#646970] outline-none cursor-not-allowed"
                />
                <p className="mt-0.5 text-[10px] text-[#646970]">Tên người dùng không thể thay đổi.</p>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-[#50575e] mb-1">Email liên hệ:</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* Public Display Name */}
              <div>
                <label className="block font-bold text-[#50575e] mb-1">
                  Tên hiển thị công khai trên bài viết (Display Name Publicly as):
                </label>
                <input
                  type="text"
                  value={profileDisplayName}
                  onChange={(e) => setProfileDisplayName(e.target.value)}
                  placeholder="ví dụ: ANBU Team, Nguyễn Hoàng Linh (UA Lead)..."
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
                <p className="mt-0.5 text-[10px] text-[#646970]">Tên này sẽ xuất hiện ở mục tác giả của bài viết blog.</p>
              </div>

              {/* Job Title */}
              <div>
                <label className="block font-bold text-[#50575e] mb-1">Chức danh chuyên môn (Job Title):</label>
                <input
                  type="text"
                  value={profileJobTitle}
                  onChange={(e) => setProfileJobTitle(e.target.value)}
                  placeholder="ví dụ: Head of Game Marketing, Senior Content Lead..."
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block font-bold text-[#50575e] mb-1">Ảnh đại diện Avatar (URL ảnh):</label>
                <input
                  type="text"
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  placeholder="/blog-covers/team-strategy-meeting.jpg hoặc link ảnh"
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs font-mono text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* Password — real, D1-backed */}
              <div>
                <label className="block font-bold text-[#50575e] mb-1">Đổi mật khẩu đăng nhập:</label>
                <input
                  type="text"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  placeholder="Để trống nếu không đổi. Nhập mật khẩu mới (tối thiểu 8 ký tự)..."
                  className="w-full rounded border border-[#8c8f94] p-2 font-mono text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* Bio / Giới thiệu */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-[#50575e] mb-1">
                  Tiểu sử / Giới thiệu tác giả (Biographical Info):
                </label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Viết một đoạn giới thiệu ngắn về kinh nghiệm và chuyên môn của tác giả trong ngành Game..."
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* Social Links */}
              <div>
                <label className="block font-bold text-[#50575e] mb-1">Link mạng xã hội (Facebook / Telegram):</label>
                <input
                  type="text"
                  value={profileFacebook}
                  onChange={(e) => setProfileFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#ccd0d4]">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="rounded border border-[#8c8f94] bg-white px-4 py-2 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
            >
              Quay lại danh sách
            </button>
            {selectedUser.source === "d1" && (
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-[#2271b1] px-5 py-2 font-bold text-white shadow-sm hover:bg-[#135e96] transition disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi hồ sơ (Update Profile)"}
              </button>
            )}
          </div>
        </form>
      )}

      {/* TAB 3: ADD NEW USER */}
      {activeTab === "add" && (
        <form onSubmit={handleCreateUser} className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-4 text-xs text-[#2c3338] max-w-2xl">
          <div className="border-b border-[#ccd0d4] pb-3">
            <h3 className="text-base font-bold text-[#1d2327]">Thêm Thành Viên Mới Vào Đội Ngũ ANBU</h3>
            <p className="text-[11px] text-[#646970]">Tạo tài khoản đăng nhập thật, lưu trong Cloudflare D1 (mật khẩu được băm, không lưu dạng văn bản thô)</p>
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Tên đăng nhập (Username - bắt buộc):</label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
              placeholder="ví dụ: linh.nguyen, quang.tran"
              className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Tên hiển thị (Display Name):</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="ví dụ: Nguyễn Hoàng Linh (Content Lead)"
              className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Chức danh (Job Title):</label>
            <input
              type="text"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              placeholder="ví dụ: UA & Performance Ads Lead"
              className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Email:</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="linh.nguyen@anbu.asia"
              className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Mật khẩu đăng nhập (bắt buộc, tối thiểu 8 ký tự):</label>
            <input
              type="text"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Đặt mật khẩu đăng nhập cho thành viên này..."
              className="w-full rounded border border-[#8c8f94] p-2 font-mono text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Vai trò (Role & Permissions):</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as AdminRole)}
              className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            >
              <option value="administrator">Quản trị viên (Administrator), Toàn quyền hệ thống</option>
              <option value="editor">Biên tập viên (Editor), Quản lý & xuất bản tất cả bài viết</option>
              <option value="author">Tác giả (Author), Tự viết & xuất bản bài viết của mình</option>
              <option value="contributor">Cộng tác viên (Contributor), Soạn bài nháp gửi duyệt</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#ccd0d4]">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="rounded border border-[#8c8f94] px-4 py-2 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-[#2271b1] px-5 py-2 font-bold text-white shadow-sm hover:bg-[#135e96] transition disabled:opacity-50"
            >
              {saving ? "Đang tạo..." : "Thêm thành viên mới (Add User)"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

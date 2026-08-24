"use client";

import React, { useState, useEffect } from "react";

export type AdminUser = {
  id: string;
  username: string;
  name: string;
  displayName: string;
  jobTitle?: string;
  bio?: string;
  avatar?: string;
  email: string;
  socials?: { facebook?: string; linkedin?: string; telegram?: string };
  role: "administrator" | "editor" | "author" | "contributor";
  postsCount: number;
  password?: string;
  createdAt: string;
};

const defaultUsers: AdminUser[] = [
  {
    id: "user-1",
    username: "admin",
    name: "ANBU Master Admin",
    displayName: "ANBU Team (Chuyên gia Game Marketing)",
    jobTitle: "Head of Marketing & Operations",
    bio: "Chuyên gia hoạch định chiến lược Go-To-Market, User Acquisition và tối ưu hóa LiveOps cho các tựa game mobile tại Việt Nam và Đông Nam Á.",
    avatar: "/blog-covers/team-strategy-meeting.jpg",
    email: "contact@anbu.asia",
    role: "administrator",
    postsCount: 42,
    password: "anbu@2026",
    socials: { facebook: "https://facebook.com/anbu.asia", telegram: "https://t.me/anbu_asia" },
    createdAt: "2026-01-01",
  },
  {
    id: "user-2",
    username: "editor",
    name: "Ban Biên Tập ANBU",
    displayName: "Ban Biên Tập ANBU Studio",
    jobTitle: "Senior Game Editorial Lead",
    bio: "Phụ trách kiểm duyệt chất lượng nội dung phân tích chuyên sâu, trích dẫn số liệu thị trường và chuẩn hóa SEO E-E-A-T.",
    avatar: "/blog-covers/content-editorial-writing.jpg",
    email: "editorial@anbu.asia",
    role: "editor",
    postsCount: 14,
    password: "editor@anbu2026",
    socials: { facebook: "https://facebook.com/anbu.asia" },
    createdAt: "2026-03-15",
  },
  {
    id: "user-3",
    username: "author",
    name: "Tác giả Game Marketing",
    displayName: "ANBU UA & LiveOps Specialist",
    jobTitle: "User Acquisition Specialist",
    bio: "Tập trung phân tích CPI/ROAS, chiến lược A/B testing sáng tạo trên TikTok/Meta Ads và xây dựng cộng đồng Discord cho game.",
    avatar: "/blog-covers/creative-testing-lab.jpg",
    email: "writer@anbu.asia",
    role: "author",
    postsCount: 6,
    password: "author@anbu2026",
    createdAt: "2026-05-20",
  },
];

export default function UsersManager({ locale }: { locale: string }) {
  const [users, setUsers] = useState<AdminUser[]>(defaultUsers);
  const [activeTab, setActiveTab] = useState<"all" | "profile" | "add">("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser>(defaultUsers[0]);
  const [toast, setToast] = useState<string | null>(null);

  // Form fields for new user
  const [newUsername, setNewUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newJobTitle, setNewJobTitle] = useState("Game Marketing Specialist");
  const [newRole, setNewRole] = useState<AdminUser["role"]>("editor");

  // Profile Edit fields
  const [profileName, setProfileName] = useState("");
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileJobTitle, setProfileJobTitle] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileFacebook, setProfileFacebook] = useState("");
  const [profileTelegram, setProfileTelegram] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("anbu_custom_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
          setSelectedUser(parsed[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveUsersToStorage = (updatedList: AdminUser[]) => {
    setUsers(updatedList);
    localStorage.setItem("anbu_custom_users", JSON.stringify(updatedList));
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenEditProfile = (u: AdminUser) => {
    setSelectedUser(u);
    setProfileName(u.name);
    setProfileDisplayName(u.displayName || u.name);
    setProfileJobTitle(u.jobTitle || "");
    setProfileBio(u.bio || "");
    setProfileAvatar(u.avatar || "");
    setProfileEmail(u.email);
    setProfilePassword(u.password || "");
    setProfileFacebook(u.socials?.facebook || "");
    setProfileTelegram(u.socials?.telegram || "");
    setActiveTab("profile");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = users.map((u) => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          name: profileName.trim() || u.name,
          displayName: profileDisplayName.trim() || u.displayName,
          jobTitle: profileJobTitle.trim(),
          bio: profileBio.trim(),
          avatar: profileAvatar.trim() || u.avatar,
          email: profileEmail.trim() || u.email,
          password: profilePassword.trim() || u.password,
          socials: {
            facebook: profileFacebook.trim(),
            telegram: profileTelegram.trim(),
          },
        };
      }
      return u;
    });

    saveUsersToStorage(updated);
    showNotification(`Đã lưu tùy chỉnh hồ sơ thành viên "${selectedUser.username}" thành công!`);
    setActiveTab("all");
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;

    if (users.some((u) => u.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      alert("Tên người dùng này đã tồn tại! Vui lòng chọn tên khác.");
      return;
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      username: newUsername.trim().toLowerCase(),
      name: newName.trim() || newUsername.trim(),
      displayName: newName.trim() || newUsername.trim(),
      jobTitle: newJobTitle.trim(),
      email: newEmail.trim() || `${newUsername.trim()}@anbu.asia`,
      role: newRole,
      password: newPassword.trim(),
      postsCount: 0,
      avatar: "/blog-covers/creator-program.jpg",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [...users, newUser];
    saveUsersToStorage(updated);
    showNotification(`Đã tạo thành viên "${newUser.name}" thành công! Họ có thể đăng nhập ngay.`);
    setActiveTab("all");
    setNewUsername("");
    setNewName("");
    setNewEmail("");
    setNewPassword("");
  };

  const handleDeleteUser = (id: string, username: string) => {
    if (username === "admin") {
      alert("Không thể xóa tài khoản Quản trị viên gốc (admin)!");
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên "${username}" không?`)) {
      const updated = users.filter((u) => u.id !== id);
      saveUsersToStorage(updated);
      showNotification(`Đã xóa thành viên "${username}"!`);
    }
  };

  const getRoleLabel = (r: AdminUser["role"]) => {
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
          Tổng cộng: <strong>{users.length}</strong> thành viên
        </div>
      </div>

      {toast && (
        <div className="rounded border-l-4 border-emerald-500 bg-white p-3 shadow-sm text-xs font-bold text-emerald-800">
          ✓ {toast}
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
          onClick={() => {
            handleOpenEditProfile(selectedUser || users[0]);
          }}
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
                          <div>{u.username}</div>
                          <div className="text-[10px] text-[#646970] font-sans font-normal">Tạo: {u.createdAt}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#1d2327]">{u.displayName || u.name}</div>
                        <div className="text-[11px] text-[#646970]">{u.jobTitle || "Game Marketing"}</div>
                      </td>
                      <td className="px-4 py-3 text-[#646970] font-mono">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-bold ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#2271b1]">{u.postsCount} bài</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProfile(u)}
                            className="rounded border border-[#2271b1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-[#f0f6fc]"
                          >
                            ✏️ Tùy chỉnh
                          </button>
                          {u.username !== "admin" && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.username)}
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
                Chỉnh sửa tên hiển thị tác giả, tiểu sử, ảnh đại diện và mật khẩu đăng nhập
              </p>
            </div>
            <span className="rounded bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-blue-800">
              Vai trò: {selectedUser.role.toUpperCase()}
            </span>
          </div>

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

            {/* Full Name */}
            <div>
              <label className="block font-bold text-[#50575e] mb-1">Họ và Tên đầy đủ:</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
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

            {/* Password */}
            <div>
              <label className="block font-bold text-[#50575e] mb-1">Mật khẩu đăng nhập mới:</label>
              <input
                type="text"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                placeholder="Nhập mật khẩu mới nếu muốn thay đổi..."
                className="w-full rounded border border-[#8c8f94] p-2 font-mono text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
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

          <div className="flex items-center justify-between pt-4 border-t border-[#ccd0d4]">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="rounded border border-[#8c8f94] bg-white px-4 py-2 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
            >
              Quay lại danh sách
            </button>
            <button
              type="submit"
              className="rounded bg-[#2271b1] px-5 py-2 font-bold text-white shadow-sm hover:bg-[#135e96] transition"
            >
              Lưu thay đổi hồ sơ (Update Profile)
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: ADD NEW USER */}
      {activeTab === "add" && (
        <form onSubmit={handleCreateUser} className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-4 text-xs text-[#2c3338] max-w-2xl">
          <div className="border-b border-[#ccd0d4] pb-3">
            <h3 className="text-base font-bold text-[#1d2327]">Thêm Thành Viên Mới Vào Đội Ngũ ANBU</h3>
            <p className="text-[11px] text-[#646970]">Tạo tài khoản và cấp quyền truy cập quản trị cho nhân sự hoặc cộng tác viên</p>
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
            <label className="block font-bold text-[#50575e] mb-1">Mật khẩu khởi tạo (bắt buộc):</label>
            <input
              type="text"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tạo mật khẩu đăng nhập..."
              className="w-full rounded border border-[#8c8f94] p-2 font-mono text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Vai trò (Role & Permissions):</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as AdminUser["role"])}
              className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
            >
              <option value="administrator">Quản trị viên (Administrator) — Toàn quyền hệ thống</option>
              <option value="editor">Biên tập viên (Editor) — Quản lý & xuất bản tất cả bài viết</option>
              <option value="author">Tác giả (Author) — Tự viết & xuất bản bài viết của mình</option>
              <option value="contributor">Cộng tác viên (Contributor) — Soạn bài nháp gửi duyệt</option>
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
              className="rounded bg-[#2271b1] px-5 py-2 font-bold text-white shadow-sm hover:bg-[#135e96] transition"
            >
              Thêm thành viên mới (Add User)
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

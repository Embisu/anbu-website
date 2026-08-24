"use client";

import React, { useState, useEffect } from "react";

export type AdminUser = {
  id: string;
  username: string;
  name: string;
  email: string;
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
    email: "contact@anbu.asia",
    role: "administrator",
    postsCount: 42,
    password: "anbu@2026",
    createdAt: "2026-01-01",
  },
  {
    id: "user-2",
    username: "editor",
    name: "Ban Biên Tập ANBU",
    email: "editorial@anbu.asia",
    role: "editor",
    postsCount: 14,
    password: "editor@anbu2026",
    createdAt: "2026-03-15",
  },
  {
    id: "user-3",
    username: "author",
    name: "Tác giả Game Marketing",
    email: "writer@anbu.asia",
    role: "author",
    postsCount: 6,
    password: "author@anbu2026",
    createdAt: "2026-05-20",
  },
];

export default function UsersManager({ locale }: { locale: string }) {
  const [users, setUsers] = useState<AdminUser[]>(defaultUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form fields for new user
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminUser["role"]>("editor");

  useEffect(() => {
    const saved = localStorage.getItem("anbu_custom_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
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

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    if (users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      alert("Tên người dùng này đã tồn tại! Vui lòng chọn tên khác.");
      return;
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      username: username.trim().toLowerCase(),
      name: name.trim() || username.trim(),
      email: email.trim() || `${username.trim()}@anbu.asia`,
      role,
      password: password.trim(),
      postsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [...users, newUser];
    saveUsersToStorage(updated);
    setShowAddModal(false);
    resetForm();
    showNotification(`Đã tạo thành viên "${newUser.name}" thành công! Họ có thể đăng nhập ngay.`);
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

  const resetForm = () => {
    setUsername("");
    setName("");
    setEmail("");
    setPassword("");
    setRole("editor");
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const getRoleLabel = (r: AdminUser["role"]) => {
    switch (r) {
      case "administrator":
        return { label: "Quản trị viên", color: "bg-purple-100 text-purple-800 border-purple-200" };
      case "editor":
        return { label: "Biên tập viên", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "author":
        return { label: "Tác giả", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      default:
        return { label: "Cộng tác viên", color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">Thành viên (Users)</h1>
          <button
            onClick={() => setShowAddModal(true)}
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

      {/* Users Table (WordPress Style) */}
      <div className="border border-[#ccd0d4] bg-white shadow-sm overflow-hidden rounded">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="border-b border-[#ccd0d4] bg-[#f6f7f7] text-[#2c3338] font-bold">
            <tr>
              <th className="px-4 py-2.5">Tên đăng nhập</th>
              <th className="px-4 py-2.5">Tên hiển thị</th>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Vai trò (Role)</th>
              <th className="px-4 py-2.5">Bài viết</th>
              <th className="px-4 py-2.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f1]">
            {users.map((u) => {
              const roleInfo = getRoleLabel(u.role);
              return (
                <tr key={u.id} className="hover:bg-[#f6f7f7] transition">
                  <td className="px-4 py-3 font-mono font-bold text-[#2271b1] flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3c434a] text-white text-[10px] font-sans">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{u.username}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#1d2327]">{u.name}</td>
                  <td className="px-4 py-3 text-[#646970]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-bold ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#2271b1]">{u.postsCount} bài</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          const newPass = prompt(`Đặt mật khẩu mới cho ${u.username}:`, u.password || "");
                          if (newPass && newPass.trim()) {
                            const updated = users.map((user) =>
                              user.id === u.id ? { ...user, password: newPass.trim() } : user
                            );
                            saveUsersToStorage(updated);
                            showNotification(`Đã đổi mật khẩu cho ${u.username}!`);
                          }
                        }}
                        className="rounded border border-[#ccd0d4] bg-white px-2 py-1 text-[11px] font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
                      >
                        Đổi MK
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

      {/* Role explanation card */}
      <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm text-xs text-[#646970] space-y-2">
        <h4 className="font-bold text-[#1d2327] uppercase text-[11px]">Phân quyền vai trò trong ANBU Studio:</h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2.5">
            <strong className="text-purple-700 block">👑 Quản trị viên:</strong>
            Toàn quyền truy cập mọi tính năng, cài đặt hệ thống, thêm xóa thành viên và xuất bản bài viết.
          </div>
          <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2.5">
            <strong className="text-blue-700 block">✍️ Biên tập viên:</strong>
            Có quyền viết bài mới, chỉnh sửa và xuất bản tất cả bài viết của bất kỳ thành viên nào.
          </div>
          <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2.5">
            <strong className="text-emerald-700 block">📝 Tác giả:</strong>
            Có quyền tự viết bài, chỉnh sửa và xuất bản các bài viết của chính mình.
          </div>
          <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2.5">
            <strong className="text-slate-700 block">👥 Cộng tác viên:</strong>
            Có quyền viết và quản lý bài nháp nhưng không được quyền trực tiếp xuất bản.
          </div>
        </div>
      </div>

      {/* Modal Add New User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded border border-[#ccd0d4] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ccd0d4] pb-3">
              <h3 className="text-base font-bold text-[#1d2327]">Thêm Thành Viên Mới (Add New User)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#50575e] mb-1">
                  Tên người dùng (bắt buộc, không dấu):
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  placeholder="ví dụ: linh.nguyen, designer_anbu"
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#50575e] mb-1">Tên hiển thị (Display Name):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ví dụ: Nguyễn Hoàng Linh (Content Lead)"
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#50575e] mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="linh.nguyen@anbu.asia"
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#50575e] mb-1">Mật khẩu truy cập (bắt buộc):</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tạo mật khẩu cho thành viên..."
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs font-mono text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#50575e] mb-1">Vai trò (Role):</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminUser["role"])}
                  className="w-full rounded border border-[#8c8f94] p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                >
                  <option value="administrator">Quản trị viên (Administrator) - Toàn quyền</option>
                  <option value="editor">Biên tập viên (Editor) - Quản lý tất cả bài viết</option>
                  <option value="author">Tác giả (Author) - Viết và xuất bản bài viết của mình</option>
                  <option value="contributor">Cộng tác viên (Contributor) - Viết bài nháp</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ccd0d4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded border border-[#8c8f94] px-3 py-1.5 font-semibold text-[#2c3338] hover:bg-[#f0f0f1]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#2271b1] px-4 py-1.5 font-bold text-white hover:bg-[#135e96] transition"
                >
                  Thêm thành viên mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";

type AdminLoginProps = {
  onLoginSuccess: (token: string, user: { username: string; name: string; role: string }) => void;
  locale: string;
};

export default function AdminLogin({ onLoginSuccess, locale }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    // Get any locally added team members from localStorage to pass to auth endpoint
    let customUsers: any[] = [];
    try {
      const saved = localStorage.getItem("anbu_custom_users");
      if (saved) customUsers = JSON.parse(saved);
    } catch (err) {
      console.error(err);
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          customUsers,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok && data.token) {
        localStorage.setItem("anbu_admin_token", data.token);
        localStorage.setItem("anbu_admin_user", JSON.stringify(data.user));
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.error || (locale === "vi" ? "Mật khẩu không chính xác. Vui lòng thử lại!" : "Incorrect password. Please try again!"));
      }
    } catch {
      setError(locale === "vi" ? "Lỗi kết nối máy chủ. Vui lòng thử lại!" : "Connection error. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f0f1] px-4 py-12 text-slate-800">
      <div className="w-full max-w-sm rounded border border-[#ccd0d4] bg-white p-8 shadow-sm">
        {/* WordPress W Logo */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2271b1] text-3xl font-black text-white shadow-sm font-display">
            W
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-[#1d2327]">
            ANBU Studio CMS
          </h2>
          <p className="text-xs text-[#646970]">
            Cổng đăng nhập Quản trị & Biên tập nội dung
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded border-l-4 border-[#d63638] bg-[#fcf0f1] p-3 text-xs font-semibold text-[#d63638]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#50575e] mb-1">
              Tên người dùng hoặc Địa chỉ Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin, editor, hoặc email..."
              className="w-full rounded border border-[#8c8f94] bg-white p-2 text-sm text-[#2c3338] outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#50575e]">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#2271b1] hover:underline"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              required
              className="w-full rounded border border-[#8c8f94] bg-white p-2 text-sm text-[#2c3338] outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#646970]">
              <input type="checkbox" defaultChecked className="rounded text-[#2271b1]" />
              <span>Tự động đăng nhập</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#2271b1] py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition disabled:opacity-50"
          >
            {loading ? "Đang xác thực..." : "Đăng nhập vào Hệ thống"}
          </button>
        </form>

        <div className="mt-6 border-t border-[#f0f0f1] pt-4 text-center text-[11px] text-[#646970] space-y-1">
          <p>Tài khoản Quản trị: <strong className="text-[#1d2327]">admin</strong> / <strong className="text-[#1d2327]">anbu@2026</strong></p>
          <p>Tài khoản Biên tập: <strong className="text-[#1d2327]">editor</strong> / <strong className="text-[#1d2327]">editor@anbu2026</strong></p>
        </div>
      </div>
    </div>
  );
}

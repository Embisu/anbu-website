"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
        setError(data.error || (locale === "vi" ? "Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại!" : "Incorrect credentials. Please try again!"));
      }
    } catch {
      setError(locale === "vi" ? "Lỗi kết nối máy chủ. Vui lòng thử lại!" : "Connection error. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B14] px-4 py-12 text-slate-100 font-sans select-none">
      {/* Dynamic Ambient Cyber Lighting */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#f5501e]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      
      {/* Subtle Background Grid Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main Glassmorphic Login Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-auto items-center justify-center">
            <Image
              src="/logo/logo-white.png"
              alt="ANBU Studio"
              width={140}
              height={46}
              priority
              className="h-9 w-auto object-contain drop-shadow-md"
            />
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-[11px] font-bold text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            ANBU Management Portal
          </div>
          <h1 className="mt-2 text-xl font-display font-extrabold text-white tracking-wide">
            Cổng Quản Trị & Xuất Bản
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hệ thống quản trị nội dung & tối ưu SEO chiến lược
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-950/50 p-3 text-xs font-semibold text-rose-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 text-xs">
              Tên người dùng hoặc Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập username hoặc email..."
                required
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-300 text-xs">
                Mật khẩu bảo mật
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-orange-400 hover:text-orange-300 transition"
              >
                {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-xs hover:text-slate-300">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-white/20 bg-black/40 text-orange-500 focus:ring-orange-500"
              />
              <span>Ghi nhớ phiên đăng nhập</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#f5501e] to-[#ff7043] py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 hover:from-[#e53935] hover:to-[#f5501e] transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Đang xác thực bảo mật..." : "Đăng Nhập Vào Hệ Thống →"}
          </button>
        </form>

        {/* Footer & Back Link */}
        <div className="mt-8 border-t border-white/10 pt-5 text-center text-[11px] text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-slate-400">
            <span>🔒</span>
            <span>256-Bit Encrypted Edge Portal • ANBU Digital Intelligence</span>
          </div>
          <div>
            <Link
              href={`/${locale}`}
              className="text-slate-400 hover:text-orange-400 transition underline underline-offset-4"
            >
              ← Quay lại trang chủ ANBU
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

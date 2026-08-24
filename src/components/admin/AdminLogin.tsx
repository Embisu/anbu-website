"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type AdminLoginProps = {
  onLoginSuccess: (token: string, user: { username: string; name: string; role: string }) => void;
  locale: string;
};

export default function AdminLogin({ onLoginSuccess, locale }: AdminLoginProps) {
  const isEn = locale === "en";
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
        setError(data.error || (isEn ? "Invalid username or password. Please try again!" : "Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại!"));
      }
    } catch {
      setError(isEn ? "Server connection error. Please try again!" : "Lỗi kết nối máy chủ. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050811] px-4 py-12 text-slate-100 font-sans select-none">
      {/* High-Energy Cyberpunk Gaming Glowing Orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#f5501e]/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange-600/5 blur-[160px]" />
      
      {/* Background Matrix Grid Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main Glassmorphic Cyber Gaming Login Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 p-8 sm:p-10 shadow-[0_0_50px_-12px_rgba(245,80,30,0.25)] backdrop-blur-2xl">
        {/* Top Glowing Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-auto items-center justify-center">
            <Image
              src="/logo/logo-white.png"
              alt="ANBU Studio"
              width={150}
              height={50}
              priority
              className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(245,80,30,0.5)]"
            />
          </div>
          
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3.5 py-1 text-[11px] font-bold text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
            {isEn ? "ANBU Management Portal" : "Cổng Quản Trị ANBU Studio"}
          </div>

          <h1 className="mt-2.5 text-xl font-display font-extrabold text-white tracking-wide">
            {isEn ? "Content & SEO Control Hub" : "Quản Trị Nội Dung & SEO"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isEn ? "Game Marketing & Community Intelligence" : "Hệ thống quản trị và xuất bản nội dung chiến lược"}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3.5 text-xs font-semibold text-rose-300 flex items-center gap-2 shadow-inner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 text-xs">
              {isEn ? "Username or Email Address" : "Tên người dùng hoặc Email"}
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isEn ? "admin, editor, or email..." : "admin, editor, hoặc email..."}
                required
                autoFocus
                className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-300 text-xs">
                {isEn ? "Security Password" : "Mật khẩu bảo mật"}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition"
              >
                {showPassword ? (isEn ? "Hide Password" : "Ẩn mật khẩu") : (isEn ? "Show Password" : "Hiện mật khẩu")}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-xs hover:text-slate-300">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-white/20 bg-black/50 text-orange-500 focus:ring-orange-500"
              />
              <span>{isEn ? "Remember session" : "Ghi nhớ phiên đăng nhập"}</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#f5501e] via-[#ea580c] to-[#ff7043] py-3.5 text-sm font-extrabold text-white shadow-xl shadow-orange-950/50 hover:brightness-110 transition-all transform active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {loading 
              ? (isEn ? "Authenticating..." : "Đang xác thực bảo mật...") 
              : (isEn ? "Sign In to Management Portal →" : "Đăng Nhập Vào Hệ Thống →")}
          </button>
        </form>

        {/* Footer & Back Link */}
        <div className="mt-8 border-t border-white/10 pt-5 text-center text-[11px] text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-slate-400">
            <span>🔒</span>
            <span>256-Bit Encrypted Edge Portal • ANBU Digital</span>
          </div>
          <div>
            <Link
              href={`/${locale}`}
              className="text-slate-400 hover:text-orange-400 transition underline underline-offset-4"
            >
              {isEn ? "← Back to ANBU Homepage" : "← Quay lại trang chủ ANBU"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

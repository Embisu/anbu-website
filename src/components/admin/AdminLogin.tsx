"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

type AdminLoginProps = {
  onLoginSuccess: (token: string, user: { username: string; name: string; role: string }) => void;
  locale: string;
};

export default function AdminLogin({ onLoginSuccess, locale }: AdminLoginProps) {
  const isEn = locale === "en";
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchLanguage = (newLocale: "vi" | "en") => {
    if (newLocale === locale) return;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

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
        setError(
          data.error ||
            (isEn
              ? "Invalid credentials. Please verify your username and password."
              : "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại!")
        );
      }
    } catch {
      setError(
        isEn
          ? "Server connection error. Please try again!"
          : "Lỗi kết nối máy chủ bảo mật. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-[#040711] px-4 py-6 text-slate-100 font-sans select-none">
      {/* 1. VIBRANT CYBERNETIC AMBIENT GLOWS */}
      <div className="pointer-events-none absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#f5501e]/25 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-48 h-[650px] w-[650px] rounded-full bg-[#0066ff]/20 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[750px] w-[750px] rounded-full bg-[#f5501e]/8 blur-[200px]" />

      {/* Cyberpunk Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* 2. TOP FLOATING NAVBAR */}
      <header className="relative z-10 flex w-full max-w-6xl items-center justify-between py-2">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/60 px-4 py-1.5 backdrop-blur-md transition hover:border-orange-500/50 hover:bg-slate-900/90"
        >
          <span className="text-orange-400 transition group-hover:-translate-x-0.5">←</span>
          <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
            {isEn ? "Back to ANBU.ASIA" : "Trang chủ ANBU.ASIA"}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* System Status Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>{isEn ? "Edge System Online" : "Hệ Thống Sẵn Sàng"}</span>
          </div>

          {/* Language Switcher */}
          <div className="flex rounded-full border border-white/10 bg-slate-900/80 p-0.5 backdrop-blur-md text-xs">
            <button
              type="button"
              onClick={() => switchLanguage("vi")}
              className={`rounded-full px-2.5 py-1 font-bold transition ${
                !isEn
                  ? "bg-[#f5501e] text-white shadow-[0_0_12px_rgba(245,80,30,0.6)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🇻🇳 VI
            </button>
            <button
              type="button"
              onClick={() => switchLanguage("en")}
              className={`rounded-full px-2.5 py-1 font-bold transition ${
                isEn
                  ? "bg-[#f5501e] text-white shadow-[0_0_12px_rgba(245,80,30,0.6)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        </div>
      </header>

      {/* 3. CENTER LOGIN PORTAL CARD */}
      <main className="relative z-10 my-auto flex w-full max-w-md flex-col items-center">
        {/* Glowing Decorative Outer Ring */}
        <div className="relative w-full rounded-[28px] p-[1.5px] bg-gradient-to-b from-orange-500/60 via-white/10 to-blue-500/40 shadow-[0_0_60px_-15px_rgba(245,80,30,0.3)]">
          {/* Main Card Container */}
          <div className="w-full rounded-[26px] bg-[#0b101e]/95 p-8 sm:p-10 backdrop-blur-2xl">
            {/* ANBU Brand Header */}
            <div className="text-center mb-7">
              <div className="mx-auto flex h-16 w-auto items-center justify-center">
                <Image
                  src="/logo/logo-white.png"
                  alt="ANBU Studio"
                  width={160}
                  height={54}
                  priority
                  className="h-11 w-auto object-contain drop-shadow-[0_0_20px_rgba(245,80,30,0.7)] transition-transform hover:scale-105"
                />
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3.5 py-1 text-[11px] font-bold text-orange-400 tracking-wide uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-ping" />
                <span>{isEn ? "Game Marketing Command Center" : "Biệt Đội Marketing Cho Game"}</span>
              </div>

              <h1 className="mt-3 font-display text-xl font-black text-white tracking-wide">
                {isEn ? "ANBU STUDIO CMS" : "HỆ THỐNG QUẢN TRỊ ANBU"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {isEn ? "Secure Edge Publishing & Strategic SEO Hub" : "Cổng Đăng Nhập Quản Trị & Xuất Bản Nội Dung"}
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 rounded-xl border border-rose-500/40 bg-rose-950/70 p-3.5 text-xs font-semibold text-rose-200 flex items-center gap-2.5 shadow-lg">
                <span className="text-base">🚨</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Username Input */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 text-xs">
                  {isEn ? "Username or Email Address" : "Tên đăng nhập hoặc Email"}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 text-sm">👤</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isEn ? "Enter username or email..." : "Nhập username hoặc email..."}
                    required
                    autoFocus
                    className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#f5501e] focus:bg-black/80 focus:ring-2 focus:ring-[#f5501e]/30 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-300 text-xs">
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
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 text-sm">🔑</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#f5501e] focus:bg-black/80 focus:ring-2 focus:ring-[#f5501e]/30 font-medium font-mono"
                  />
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-xs hover:text-slate-200">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-white/20 bg-black/60 text-[#f5501e] focus:ring-[#f5501e]"
                  />
                  <span>{isEn ? "Keep me signed in" : "Ghi nhớ phiên làm việc"}</span>
                </label>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#f5501e] via-[#ff6d00] to-[#f5501e] bg-[length:200%_auto] py-3.5 text-sm font-black text-white shadow-[0_10px_25px_-5px_rgba(245,80,30,0.6)] transition-all duration-300 hover:bg-[position:right_center] hover:shadow-[0_12px_30px_-5px_rgba(245,80,30,0.8)] active:scale-[0.99] disabled:opacity-50 mt-3"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide uppercase font-display text-xs sm:text-sm">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>{isEn ? "Authenticating Edge Token..." : "Đang Xác Thực Bảo Mật..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{isEn ? "Access ANBU Workspace" : "Đăng Nhập Vào Hệ Thống"}</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 4. SECURITY FOOTER */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 pt-4 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-orange-400">🛡️</span>
          <span>Cloudflare Edge Zero-Trust Architecture</span>
        </div>
        <span className="hidden sm:inline text-slate-700">•</span>
        <div>© 2026 ANBU Studio. All rights reserved.</div>
      </footer>
    </div>
  );
}

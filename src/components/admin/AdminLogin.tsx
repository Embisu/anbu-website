"use client";

import React, { useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";

type AdminLoginProps = {
  onLoginSuccess: (token: string) => void;
  locale: string;
};

export default function AdminLogin({ onLoginSuccess, locale }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.ok && data.token) {
        localStorage.setItem("anbu_admin_token", data.token);
        onLoginSuccess(data.token);
      } else {
        setError(locale === "vi" ? "Mật khẩu không chính xác. Vui lòng thử lại!" : "Incorrect password. Please try again!");
      }
    } catch {
      setError(locale === "vi" ? "Lỗi kết nối. Vui lòng thử lại!" : "Connection error. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-navy-800/60 bg-navy-950/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_0_30px_rgba(245,80,30,0.4)]">
            <Icon name="bolt" className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            ANBU Studio CMS
          </h1>
          <p className="mt-2 text-sm text-navy-300">
            {locale === "vi"
              ? "Bảng điều khiển quản trị nội dung & Marketing Game"
              : "Game Marketing & Content Management Portal"}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-center text-sm font-medium text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-300">
              {locale === "vi" ? "Mật khẩu quản trị (Admin Password)" : "Admin Password"}
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={locale === "vi" ? "Nhập mật khẩu..." : "Enter password..."}
                required
                className="w-full rounded-2xl border border-navy-800 bg-navy-900/90 px-4 py-3.5 pr-12 text-sm font-medium text-white placeholder-navy-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-navy-400">
              {locale === "vi" ? "Mật khẩu mặc định: anbu@2026" : "Default password: anbu@2026"}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? (
              <span>{locale === "vi" ? "Đang xác thực..." : "Authenticating..."}</span>
            ) : (
              <>
                <span>{locale === "vi" ? "Đăng nhập Quản trị" : "Sign In to Admin"}</span>
                <Icon name="arrow" className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-navy-800/80 pt-6 text-center text-xs text-navy-400">
          <p>© {new Date().getFullYear()} ANBU Marketing & Communications</p>
        </div>
      </div>
    </div>
  );
}

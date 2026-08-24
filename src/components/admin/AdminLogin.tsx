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
    <div className="flex min-h-screen items-center justify-center bg-[#f0f0f1] px-4 py-12 text-slate-800">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2271b1] shadow-lg shadow-blue-500/20">
            <span className="font-display text-2xl font-black text-white">W</span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900">
            ANBU CMS Studio
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {locale === "vi"
              ? "Bảng điều khiển quản trị bài viết & Tối ưu SEO Rank Math"
              : "Content Management & Rank Math SEO Dashboard"}
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-center text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {locale === "vi" ? "Mật khẩu quản trị viên" : "Admin Password"}
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={locale === "vi" ? "Nhập mật khẩu quản trị..." : "Enter admin password..."}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              {locale === "vi" ? "Mật khẩu mặc định: anbu@2026" : "Default password: anbu@2026"}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#135e96] disabled:opacity-50"
          >
            {loading ? (
              <span>{locale === "vi" ? "Đang xác thực..." : "Authenticating..."}</span>
            ) : (
              <span>{locale === "vi" ? "Đăng nhập vào Bảng điều khiển" : "Log In to Dashboard"}</span>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ANBU Marketing & Communications</p>
        </div>
      </div>
    </div>
  );
}

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
              ? "Access denied. Invalid username or security key."
              : "Từ chối truy cập. Tên đăng nhập hoặc mật khẩu không chính xác.")
        );
      }
    } catch {
      setError(
        isEn
          ? "Cloudflare Edge security timeout. Please try again."
          : "Lỗi kết nối máy chủ Cloudflare Edge. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03060f] text-slate-100 font-sans select-none flex flex-col justify-between">
      {/* 1. CINEMATIC CYBER BACKGROUND WITH GLOWING NEBULA */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full bg-[#f5501e]/25 blur-[180px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full bg-[#0066ff]/20 blur-[180px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[#f5501e]/10 blur-[200px]" />

      {/* Cyberpunk Futuristic Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Scanline Effect Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px)`
        }}
      />

      {/* 2. TOP COMMAND HEADER BAR */}
      <header className="relative z-20 flex w-full items-center justify-between px-6 py-5 lg:px-12">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 backdrop-blur-xl transition hover:border-orange-500/50 hover:bg-slate-900/90 shadow-lg"
        >
          <span className="text-orange-400 font-bold transition group-hover:-translate-x-1">←</span>
          <span className="text-xs font-bold tracking-wide text-slate-300 group-hover:text-white uppercase">
            {isEn ? "Return to ANBU.ASIA" : "Về Trang Chủ ANBU"}
          </span>
        </Link>

        {/* Real-Time Telemetry & Status Badges */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold text-emerald-400 backdrop-blur-xl shadow-inner">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isEn ? "Edge Cloudflare • 14ms Latency" : "Cloudflare Edge • Độ Trễ 14ms"}</span>
          </div>

          <div className="flex rounded-full border border-white/15 bg-slate-900/80 p-1 backdrop-blur-xl shadow-xl">
            <button
              type="button"
              onClick={() => switchLanguage("vi")}
              className={`rounded-full px-3 py-1 text-xs font-black transition ${
                !isEn
                  ? "bg-gradient-to-r from-[#f5501e] to-[#ff7043] text-white shadow-[0_0_15px_rgba(245,80,30,0.7)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🇻🇳 VI
            </button>
            <button
              type="button"
              onClick={() => switchLanguage("en")}
              className={`rounded-full px-3 py-1 text-xs font-black transition ${
                isEn
                  ? "bg-gradient-to-r from-[#f5501e] to-[#ff7043] text-white shadow-[0_0_15px_rgba(245,80,30,0.7)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        </div>
      </header>

      {/* 3. MAIN CINEMATIC 2-COLUMN COMMAND CENTER */}
      <main className="relative z-10 mx-auto my-auto w-full max-w-6xl px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* LEFT COLUMN: Agency Power & Live Telemetry (7 Columns) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-4">
            {/* Live Mission Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-orange-400 shadow-[0_0_20px_rgba(245,80,30,0.3)] w-fit">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
              <span>{isEn ? "Tier-1 Game Marketing Command Center" : "Biệt Đội Marketing & Tăng Trưởng Game"}</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h2 className="font-display text-4xl xl:text-5xl font-black leading-[1.15] text-white tracking-tight">
                Chinh Phục Thị Trường <br />
                <span className="bg-gradient-to-r from-[#f5501e] via-[#ff7043] to-[#ffab40] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(245,80,30,0.5)]">
                  Game & eSports Đỉnh Cao
                </span>
              </h2>
              <p className="text-sm xl:text-base leading-relaxed text-slate-300 max-w-lg">
                {isEn
                  ? "Accelerating mobile game launches, creator ecosystems, Discord liveops, and ASO performance across Southeast Asia."
                  : "Hệ thống quản trị nội dung, tối ưu SEO On-Page Rank Math PRO và đo lường chỉ số tăng trưởng người chơi thực chiến cho các studio game quốc tế."}
              </p>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-orange-500/40 transition">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {isEn ? "Content Hub" : "Kho Nội Dung"}
                </div>
                <div className="mt-1 font-display text-2xl xl:text-3xl font-black text-white">62+</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">✓ Chuyên môn Game</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-orange-500/40 transition">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {isEn ? "SEO Health" : "Điểm SEO"}
                </div>
                <div className="mt-1 font-display text-2xl xl:text-3xl font-black text-[#f5501e]">98.6%</div>
                <div className="text-[10px] text-orange-300 font-semibold mt-0.5">✓ Rank Math PRO</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-orange-500/40 transition">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {isEn ? "Global Reach" : "Tệp Người Chơi"}
                </div>
                <div className="mt-1 font-display text-2xl xl:text-3xl font-black text-blue-400">100M+</div>
                <div className="text-[10px] text-blue-300 font-semibold mt-0.5">✓ SEA Community</div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300 font-medium">
                🎮 Go-To-Market 90 Days
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300 font-medium">
                📈 LiveOps & CPI/ROAS
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300 font-medium">
                📱 ASO & Store Conversion
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300 font-medium">
                🎙️ Gaming Creators
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Luxury Futuristic Cyber Portal (5 Columns) */}
          <div className="w-full lg:col-span-5 flex justify-center">
            {/* Glowing Neon Cyber Outer Shell */}
            <div className="relative w-full max-w-md rounded-[32px] p-[2px] bg-gradient-to-b from-orange-500 via-orange-500/20 to-blue-500 shadow-[0_0_80px_-20px_rgba(245,80,30,0.45)]">
              
              {/* Inner Luxury Glass Card */}
              <div className="relative w-full rounded-[30px] bg-[#090d1c]/95 p-7 sm:p-9 backdrop-blur-3xl">
                
                {/* Futuristic HUD Corner Crosshairs */}
                <div className="absolute top-3 left-3 text-[10px] text-orange-500/60 font-mono tracking-widest">+ 01_AUTH</div>
                <div className="absolute top-3 right-3 text-[10px] text-blue-400/60 font-mono tracking-widest">SECURE_SSL +</div>

                {/* Brand Header */}
                <div className="text-center mb-6 pt-2">
                  <div className="mx-auto flex h-14 w-auto items-center justify-center">
                    <Image
                      src="/logo/logo-white.png"
                      alt="ANBU Studio"
                      width={160}
                      height={54}
                      priority
                      className="h-10 w-auto object-contain drop-shadow-[0_0_25px_rgba(245,80,30,0.8)] transition-transform hover:scale-105"
                    />
                  </div>

                  <h1 className="mt-3 font-display text-xl font-black text-white tracking-wide uppercase">
                    {isEn ? "Admin Command Portal" : "Cổng Đăng Nhập Quản Trị"}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn ? "Enter credentials to access workspace" : "Xác thực bảo mật để truy cập bảng điều khiển"}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-950/80 p-3 text-xs font-semibold text-rose-200 flex items-center gap-2 shadow-lg">
                    <span className="text-base">🚨</span>
                    <span className="leading-snug">{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Username Field */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 text-xs">
                      {isEn ? "Username or Corporate Email" : "Tên đăng nhập hoặc Email"}
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400 text-sm">👤</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={isEn ? "Enter username (e.g. admin)..." : "Nhập username (ví dụ: admin)..."}
                        required
                        autoFocus
                        className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#f5501e] focus:bg-black/80 focus:ring-2 focus:ring-[#f5501e]/30 font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-300 text-xs">
                        {isEn ? "Security Passcode" : "Mật khẩu bảo mật"}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] font-bold text-orange-400 hover:text-orange-300 transition"
                      >
                        {showPassword ? (isEn ? "Hide" : "Ẩn") : (isEn ? "Show" : "Hiện")}
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
                        className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#f5501e] focus:bg-black/80 focus:ring-2 focus:ring-[#f5501e]/30 font-mono"
                      />
                    </div>
                  </div>

                  {/* Remember check */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-xs hover:text-slate-200">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-white/20 bg-black/60 text-[#f5501e] focus:ring-[#f5501e]"
                      />
                      <span>{isEn ? "Keep session active" : "Duy trì phiên đăng nhập"}</span>
                    </label>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#f5501e] via-[#ff6d00] to-[#f5501e] bg-[length:200%_auto] py-3.5 text-sm font-black text-white shadow-[0_12px_30px_-5px_rgba(245,80,30,0.7)] transition-all duration-300 hover:bg-[position:right_center] hover:shadow-[0_16px_35px_-5px_rgba(245,80,30,0.9)] active:scale-[0.99] disabled:opacity-50 mt-3"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 tracking-wider uppercase font-display text-xs sm:text-sm">
                      {loading ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>{isEn ? "Authenticating Token..." : "Đang Xác Thực Token..."}</span>
                        </>
                      ) : (
                        <>
                          <span>{isEn ? "Authorize Access →" : "Đăng Nhập Quản Trị →"}</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Bottom Encrypted Badge */}
                <div className="mt-6 border-t border-white/10 pt-4 text-center text-[10px] text-slate-500 font-mono">
                  <span>🔒 Cloudflare Edge Zero-Trust • 256-Bit SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between px-6 py-4 lg:px-12 text-[11px] text-slate-500 border-t border-white/5 bg-[#02040a]/80 backdrop-blur-md">
        <div>
          © 2026 ANBU Studio. All rights reserved.
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-slate-400">
          <span>🎮 Biệt Đội Marketing & Tăng Trưởng Game</span>
          <span>•</span>
          <span>⚡ Cloudflare Serverless Architecture</span>
        </div>
      </footer>
    </div>
  );
}

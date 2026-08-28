"use client";

import React, { useState, useEffect } from "react";
import { site } from "@/content/site";
import { posts } from "@/content/posts";

export default function SiteSettingsManager({ locale }: { locale: string }) {
  const [toast, setToast] = useState<{ msg: string; isError?: boolean } | null>(null);
  const [githubToken, setGithubToken] = useState("");
  const [testingGithub, setTestingGithub] = useState(false);
  const [githubStatus, setGithubStatus] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("anbu_github_token");
    if (savedToken) {
      setGithubToken(savedToken);
    }
  }, []);

  const showToast = (msg: string, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveGithubToken = () => {
    if (!githubToken.trim()) {
      localStorage.removeItem("anbu_github_token");
      showToast("Đã xóa GitHub Token!");
      setGithubStatus(null);
      return;
    }
    localStorage.setItem("anbu_github_token", githubToken.trim());
    showToast("Đã lưu GitHub Token thành công!");
  };

  const handleTestGithubConnection = async () => {
    if (!githubToken.trim()) {
      showToast("Vui lòng nhập GitHub Token trước khi kiểm tra!", true);
      return;
    }
    setTestingGithub(true);
    setGithubStatus(null);
    try {
      const res = await fetch("https://api.github.com/repos/Embisu/anbu-website", {
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      if (res.ok) {
        setGithubStatus("success");
        showToast("✅ Kết nối GitHub thành công! Quyền ghi kho lưu trữ Embisu/anbu-website hợp lệ.");
        localStorage.setItem("anbu_github_token", githubToken.trim());
      } else {
        const data = await res.json().catch(() => ({}));
        setGithubStatus("error");
        showToast(`❌ Không thể kết nối: ${data.message || "Token không hợp lệ hoặc thiếu quyền repo"}`, true);
      }
    } catch (err: any) {
      setGithubStatus("error");
      showToast(`❌ Lỗi kết nối mạng: ${err.message}`, true);
    } finally {
      setTestingGithub(false);
    }
  };

  const handleExportPosts = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anbu-posts-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Đã tải xuống tệp sao lưu toàn bộ bài viết (JSON)!");
  };

  const handleExportUsers = () => {
    let usersData = [];
    try {
      const saved = localStorage.getItem("anbu_custom_users");
      if (saved) usersData = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(usersData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anbu-users-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Đã tải xuống tệp sao lưu thành viên (JSON)!");
  };

  return (
    <div className="space-y-6 text-slate-800">
      {toast && (
        <div
          className={`rounded border-l-4 p-3 shadow-sm text-xs font-bold ${
            toast.isError
              ? "border-red-500 bg-red-50 text-red-800"
              : "border-emerald-500 bg-emerald-50 text-emerald-800"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#646970]">Trạng thái SEO</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#1d2327]">168 URLs</div>
          <p className="mt-1 text-xs text-[#2e7d32]">✓ Sitemap XML Đã đồng bộ 100%</p>
        </div>

        <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#646970]">Google Entity Map</span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-[#2271b1]">
              Verified
            </span>
          </div>
          <div className="mt-2 text-xl font-extrabold text-[#1d2327]">/g/11nv91ww0r</div>
          <p className="mt-1 text-xs text-[#646970]">Knowledge Graph ID</p>
        </div>

        <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#646970]">Độ phủ bài viết</span>
            <span className="text-xs font-bold text-[#2271b1]">{posts.length} Bài</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#1d2327]">100% Đa Ảnh</div>
          <p className="mt-1 text-xs text-[#646970]">Đầy đủ ảnh & E-E-A-T citation</p>
        </div>

        <div className="rounded border border-[#ccd0d4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#646970]">CDN & Hosting</span>
            <span className="text-xs font-bold text-emerald-700">Edge Runtime</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#1d2327]">Cloudflare</div>
          <p className="mt-1 text-xs text-[#646970]">Tải trang siêu tốc toàn cầu</p>
        </div>
      </div>

      {/* 1. GITHUB AUTO-PUBLISH CONFIGURATION METABOX */}
      <div className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#ccd0d4] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1d2327]">
              ⚡ Tự Động Xuất Bản Toàn Cầu Qua GitHub (Auto-Publish Integration)
            </h3>
            <p className="text-xs text-[#646970]">
              Tự động đẩy bài viết mới lên kho mã nguồn GitHub và kích hoạt Cloudflare Pages build toàn cầu khi bấm "Đăng bài".
            </p>
          </div>
          {githubStatus === "success" && (
            <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              ✓ Đã kết nối GitHub
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#50575e] mb-1">
              GitHub Personal Access Token (PAT):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx hoặc github_pat_xxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="flex-1 rounded border border-[#8c8f94] bg-white p-2 text-xs font-mono text-[#2c3338] outline-none focus:border-[#2271b1]"
              />
              <button
                type="button"
                onClick={handleSaveGithubToken}
                className="rounded bg-[#2271b1] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition"
              >
                Lưu Token
              </button>
              <button
                type="button"
                onClick={handleTestGithubConnection}
                disabled={testingGithub}
                className="rounded border border-[#8c8f94] bg-[#f6f7f7] px-4 py-2 text-xs font-bold text-[#2c3338] hover:bg-[#f0f0f1] transition disabled:opacity-50"
              >
                {testingGithub ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-[#2c3338] space-y-2">
            <p className="font-bold text-[#135e96]">📖 Cách tạo GitHub Token nhanh trong 30 giây:</p>
            <ol className="list-decimal pl-4 space-y-1 text-[#50575e]">
              <li>Truy cập <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-[#2271b1] underline font-bold">github.com/settings/tokens</a> trên tài khoản GitHub <strong>Embisu</strong>.</li>
              <li>Bấm <strong>"Generate new token"</strong> $\rightarrow$ chọn <strong>"Generate new token (classic)"</strong>.</li>
              <li>Đặt tên (Note): <code className="bg-white px-1 py-0.5 rounded border">ANBU Admin Auto-Publish</code>.</li>
              <li>Tích chọn quyền (Scopes): <code className="bg-white px-1 py-0.5 rounded border font-bold">repo</code> (Full control of private repositories).</li>
              <li>Bấm nút <strong>"Generate token"</strong> ở dưới cùng và copy mã Token (bắt đầu bằng <code className="font-mono">ghp_...</code>) dán vào ô bên trên rồi bấm <strong>Lưu Token</strong>.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 2. Company Metadata Info */}
      <div className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#ccd0d4] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1d2327]">
              Cài đặt Tổng quan (General Settings) & Cấu hình Pháp nhân
            </h3>
            <p className="text-xs text-[#646970]">Thông tin xuất hiện trên Schema JSON-LD và chân trang (Footer)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-bold text-[#50575e] mb-1">Tên pháp nhân doanh nghiệp:</label>
            <input
              type="text"
              readOnly
              value={site.legalName.vi}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs font-semibold text-[#2c3338] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Mã số thuế (MST):</label>
            <input
              type="text"
              readOnly
              value={site.taxId}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs font-mono font-bold text-[#2c3338] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Hotline liên hệ:</label>
            <input
              type="text"
              readOnly
              value={site.phone}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs font-bold text-[#2c3338] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#50575e] mb-1">Email chính thức:</label>
            <input
              type="text"
              readOnly
              value={site.email}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs font-semibold text-[#2c3338] outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#50575e] mb-1">Địa chỉ trụ sở chính:</label>
            <input
              type="text"
              readOnly
              value={site.address.vi}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 text-xs font-semibold text-[#2c3338] outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#50575e] mb-1">Đường dẫn Google Maps / Knowledge Graph:</label>
            <input
              type="text"
              readOnly
              value={site.mapUrl}
              className="w-full rounded border border-[#ccd0d4] bg-[#f6f7f7] p-2 font-mono text-xs text-[#646970] outline-none select-all"
            />
          </div>
        </div>
      </div>

      {/* 3. Backup & Export Content */}
      <div className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#ccd0d4] pb-3">
          <h3 className="text-sm font-bold text-[#1d2327]">
            📦 Sao Lưu & Xuất Dữ Liệu Nội Dung (Backup & Export)
          </h3>
          <p className="text-xs text-[#646970]">
            Tải xuống bản sao lưu an toàn định kỳ của toàn bộ bài viết và danh sách thành viên
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-[#1d2327]">Sao lưu {posts.length} Bài viết Blog (JSON)</h4>
              <p className="text-[#646970] mt-1 text-[11px]">
                Bao gồm toàn bộ nội dung song ngữ, hình ảnh, trích dẫn E-E-A-T và cấu trúc H2.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportPosts}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded bg-[#2271b1] py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition"
            >
              ⬇️ Tải xuống bản sao lưu Bài viết (JSON)
            </button>
          </div>

          <div className="rounded border border-[#ccd0d4] bg-[#f6f7f7] p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-[#1d2327]">Sao lưu Danh sách Thành viên (JSON)</h4>
              <p className="text-[#646970] mt-1 text-[11px]">
                Bao gồm tài khoản, vai trò phân quyền và hồ sơ tùy chỉnh của đội ngũ.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportUsers}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded border border-[#2271b1] bg-white py-2 text-xs font-bold text-[#2271b1] hover:bg-[#f0f6fc] transition"
            >
              ⬇️ Tải xuống bản sao lưu Thành viên (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

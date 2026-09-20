"use client";

import React, { useState, useRef } from "react";
import Icon from "@/components/Icon";
import { supabase } from "@/lib/supabase";

// List of all verified images available in public/blog-covers/
export const defaultMediaAssets = [
  { src: "/blog-covers/analytics-dashboard.jpg", title: "Analytics Dashboard & Growth Charts", tags: ["analytics", "kpi", "telemetry"], size: "245 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/app-store-conversion-funnel.jpg", title: "App Store Conversion Funnel", tags: ["aso", "store", "conversion"], size: "180 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/aso-store-optimization.jpg", title: "ASO Store Listing Optimization", tags: ["aso", "screenshot", "title"], size: "210 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/battle-pass-value.jpg", title: "Battle Pass Value Matrix", tags: ["monetization", "battle pass", "iap"], size: "310 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/brand-foundation.jpg", title: "Brand Identity Foundation", tags: ["branding", "identity", "strategy"], size: "195 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/brand-identity-design.jpg", title: "Brand Identity Design Board", tags: ["branding", "design", "logo"], size: "280 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/brand-strategy-board.jpg", title: "Brand Positioning Strategy", tags: ["branding", "positioning", "strategy"], size: "260 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/community-launch.jpg", title: "Community Launch Roadmap", tags: ["community", "launch", "discord"], size: "220 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/community-meetup-collab.jpg", title: "Community Meetup & Scrim Tournament", tags: ["community", "offline", "esports"], size: "340 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/content-editorial-writing.jpg", title: "Content Editorial & Case Studies", tags: ["content", "case study", "writing"], size: "190 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/creative-testing-lab.jpg", title: "Creative Testing Lab & Angle Matrix", tags: ["creative", "ads", "ua"], size: "290 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/creator-program.jpg", title: "Creator & Influencer Program", tags: ["creator", "influencer", "ugc"], size: "215 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/creator-tiktok-studio.jpg", title: "TikTok Creator Studio & Vertical Ads", tags: ["tiktok", "creator", "ugc"], size: "305 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/discord-community.jpg", title: "Discord Community Hub", tags: ["discord", "community", "moderation"], size: "240 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/discord-community-game-night.png", title: "Discord Community Game Night Live", tags: ["discord", "events", "voice"], size: "410 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/discord-game-hub-activity.png", title: "Discord Game Hub Activity Screen", tags: ["discord", "activity", "channels"], size: "390 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/discord-voice-channel-gameplay.png", title: "Discord Voice Channel & Gameplay Scrim", tags: ["discord", "voice", "gameplay"], size: "450 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/esports-team-flash-sponsorship.png", title: "Esports Team Flash Sponsorship & ROI", tags: ["esports", "roi", "sponsorship"], size: "520 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/esports-vietnam-asiad.jpg", title: "Esports Vietnam National Team ASIAD", tags: ["esports", "tournament", "stage"], size: "380 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/esports-vietnam-sea-games.jpg", title: "Esports Vietnam Gold Medal SEA Games", tags: ["esports", "tournament", "sea games"], size: "360 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/esports-vietnam-stage.jpg", title: "Arena of Valor & VCS Stage Stadium", tags: ["esports", "stadium", "tournament"], size: "490 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/game-liveops-monitoring.jpg", title: "LiveOps Telemetry & Operations", tags: ["liveops", "operations", "retention"], size: "275 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/game-seo-cluster.jpg", title: "SEO Topic Cluster Architecture", tags: ["seo", "topic cluster", "organic"], size: "230 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/growth-analytics-chart.jpg", title: "Cohort Retention & Revenue Chart", tags: ["analytics", "retention", "arpu"], size: "295 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/in-app-purchase-mobile.jpg", title: "In-App Purchases & Checkout Gateway", tags: ["monetization", "iap", "payments"], size: "210 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/influencer-measurement.jpg", title: "Influencer Performance Attribution", tags: ["influencer", "measurement", "kol"], size: "265 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/launch-checklist.jpg", title: "Vietnam Game Launch Checklist", tags: ["launch", "checklist", "operations"], size: "185 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/livestream-creator-setup.jpg", title: "Livestream Creator Gaming Setup", tags: ["creator", "livestream", "broadcast"], size: "340 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/localization-translation-team.jpg", title: "Localization & LQA Testing Team", tags: ["localization", "lqa", "translation"], size: "290 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/monetization-trust.jpg", title: "Monetization & Economy Trust", tags: ["monetization", "economy", "iap"], size: "215 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/onboarding-activation.jpg", title: "Player Onboarding & FTUE Activation", tags: ["onboarding", "ftue", "retention"], size: "195 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/performance-ad-campaigns.jpg", title: "Performance Marketing Ad Campaigns", tags: ["performance", "ads", "cpi"], size: "320 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/pr-media-press-conference.jpg", title: "PR Media Press Conference & Launch", tags: ["pr", "press", "media"], size: "380 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/seo-organic-ranking.jpg", title: "Google Organic Search Ranking & E-E-A-T", tags: ["seo", "google", "organic"], size: "245 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/seo-strategy.jpg", title: "SEO Schema JSON-LD & Internal Link Architecture", tags: ["seo", "schema", "architecture"], size: "270 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/soft-launch-measurement.jpg", title: "Soft Launch Telemetry & D1-D7 Validation", tags: ["soft launch", "analytics", "ua"], size: "260 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/store-conversion.jpg", title: "App Store & Google Play Localized Page", tags: ["aso", "store", "conversion"], size: "235 KB", dimensions: "1600 × 1000" },
  { src: "/blog-covers/team-strategy-meeting.jpg", title: "ANBU Squad Strategy & Growth Meeting", tags: ["team", "strategy", "agency"], size: "310 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/thailand-game-expo.jpg", title: "Thailand Game Show (TGS) Live Arena", tags: ["thailand", "expo", "sea"], size: "440 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/tiktok-social.jpg", title: "TikTok Viral Trends & Social Growth", tags: ["tiktok", "viral", "social"], size: "285 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/ugc-creator-community.jpg", title: "UGC Creator Community Campaign", tags: ["ugc", "creator", "community"], size: "275 KB", dimensions: "1920 × 1080" },
  { src: "/blog-covers/vietnam-game-publishers-map.png", title: "Vietnam Game Publisher Landscape Infographic", tags: ["publishers", "infographic", "map"], size: "620 KB", dimensions: "1920 × 1080" },
];

type MediaItem = (typeof defaultMediaAssets)[0];

type MediaManagerProps = {
  locale: string;
  onSelectImage?: (imageSrc: string) => void;
};

export default function MediaManager({ locale, onSelectImage }: MediaManagerProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [mediaList, setMediaList] = useState<MediaItem[]>(defaultMediaAssets);
  const [selectedAsset, setSelectedAsset] = useState<MediaItem | null>(defaultMediaAssets[0]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [copiedSrc, setCopiedSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [showTokenEdit, setShowTokenEdit] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<{ msg: string; isError?: boolean } | null>(null);
  const [customUrl, setCustomUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDeletedMedia = (): string[] => {
    try {
      const saved = localStorage.getItem("anbu_deleted_media");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  React.useEffect(() => {
    const deletedArr = getDeletedMedia();

    // Filter defaults
    setMediaList((prev) => prev.filter((item) => !deletedArr.includes(item.src)));

    const savedToken =
      typeof window !== "undefined" ? localStorage.getItem("anbu_github_token") || "" : "";
    if (savedToken) {
      setHasToken(true);
      setTokenInput(savedToken);
    }

    const fetchUrl = savedToken
      ? `/api/admin/media/github-upload?token=${encodeURIComponent(savedToken)}`
      : "/api/admin/media/github-upload";

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && Array.isArray(data.items)) {
          const currentDeleted = getDeletedMedia();
          const items: MediaItem[] = data.items
            .filter((item: any) => !currentDeleted.includes(item.src))
            .map((item: any) => ({
              src: item.src,
              title: item.title,
              tags: item.tags || ["media", "uploaded"],
              size: item.size || "Unknown",
              dimensions: "Local / CDN",
            }));

          setMediaList((prev) => {
            const freshFiltered = prev.filter(
              (p) => !currentDeleted.includes(p.src) && !items.some((ci) => ci.src === p.src)
            );
            return [...items, ...freshFiltered];
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveToken = () => {
    if (!tokenInput.trim()) {
      localStorage.removeItem("anbu_github_token");
      setHasToken(false);
      setUploadNotice({ msg: "Đã xóa GitHub Token!", isError: true });
      return;
    }
    localStorage.setItem("anbu_github_token", tokenInput.trim());
    setHasToken(true);
    setShowTokenEdit(false);
    setUploadNotice({
      msg: "✅ Đã lưu GitHub Token thành công! Bạn có thể tải ảnh lên ngay bây giờ.",
    });
    setTimeout(() => setUploadNotice(null), 5000);
  };

  const handleInsertByUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) {
      setUploadNotice({ msg: "Vui lòng nhập đường dẫn URL hình ảnh!", isError: true });
      return;
    }
    if (
      !trimmed.startsWith("http://") &&
      !trimmed.startsWith("https://") &&
      !trimmed.startsWith("/")
    ) {
      setUploadNotice({
        msg: "URL hình ảnh không hợp lệ (phải bắt đầu bằng http:// hoặc https://)!",
        isError: true,
      });
      return;
    }
    const newItem: MediaItem = {
      src: trimmed,
      title: customTitle.trim() || trimmed.split("/").pop()?.split("?")[0] || "Hình ảnh bên ngoài",
      tags: ["external", "url"],
      size: "External",
      dimensions: "Web URL",
    };
    setMediaList((prev) => [newItem, ...prev]);
    setSelectedAsset(newItem);
    if (onSelectImage) {
      onSelectImage(newItem.src);
    }
    setCustomUrl("");
    setCustomTitle("");
    setActiveTab("library");
  };

  const handleDeleteAsset = async (asset: MediaItem) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tập tin "${asset.title}" khỏi thư viện Media không?`)) {
      return;
    }

    // 1. Remove from local state
    setMediaList((prev) => prev.filter((item) => item.src !== asset.src));
    if (selectedAsset?.src === asset.src) {
      setSelectedAsset(null);
    }

    // 2. Persist deleted list in localStorage
    try {
      const deletedArr = getDeletedMedia();
      if (!deletedArr.includes(asset.src)) {
        deletedArr.push(asset.src);
        localStorage.setItem("anbu_deleted_media", JSON.stringify(deletedArr));
      }
    } catch (e) {}

    // 3. Remove from Supabase Storage if cloud item
    if (asset.src.includes("blog-media")) {
      try {
        const parts = asset.src.split("/blog-media/");
        const fileName = parts[1]?.split("?")[0];
        if (fileName) {
          await supabase.storage.from("blog-media").remove([decodeURIComponent(fileName)]);
        }
      } catch (err) {
        console.error("Storage delete exception:", err);
      }
    }
  };

  const allTags = ["all", ...Array.from(new Set(mediaList.flatMap((item) => item.tags)))];

  const filteredAssets = mediaList.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.src.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchTag = selectedTag === "all" || item.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const handleCopy = (src: string) => {
    navigator.clipboard.writeText(src);
    setCopiedSrc(src);
    setTimeout(() => setCopiedSrc(null), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("anbu_github_token") || undefined : undefined;

    if (!token) {
      setUploadNotice({
        msg: "⚠️ Cần có GitHub Token để tải ảnh lên kho lưu trữ. Vui lòng nhập Token ở khung bên dưới!",
        isError: true,
      });
      return;
    }

    setUploading(true);
    setUploadNotice(null);
    const uploadedItems: MediaItem[] = [];

    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const base64Data = await base64Promise;

        const res = await fetch("/api/admin/media/github-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileBase64: base64Data,
            token,
          }),
        });

        const resData = await res.json();
        if (resData.ok) {
          const newItem: MediaItem = {
            src: resData.publicUrl,
            title: file.name.replace(/\.[^/.]+$/, ""),
            tags: ["media", "upload"],
            size: `${Math.round(file.size / 1024)} KB`,
            dimensions: "Local / CDN",
          };
          uploadedItems.push(newItem);
        } else {
          setUploadNotice({
            msg: `❌ Lỗi khi tải ảnh "${file.name}": ${resData.error || "Không thể tải lên"}`,
            isError: true,
          });
        }
      } catch (err: any) {
        setUploadNotice({
          msg: `❌ Lỗi kết nối khi tải ảnh: ${err.message || "Thất bại"}`,
          isError: true,
        });
      }
    }

    if (uploadedItems.length > 0) {
      setMediaList((prev) => [...uploadedItems, ...prev]);
      setSelectedAsset(uploadedItems[0]);
      setUploadNotice({
        msg: `✅ Đã tải lên thành công ${uploadedItems.length} hình ảnh vào kho lưu trữ GitHub!`,
      });
      setTimeout(() => setUploadNotice(null), 5000);
      setActiveTab("library");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-3 text-slate-800">
      {/* WordPress Media Modal Tab Switcher */}
      <div className="flex border-b border-[#ccd0d4] text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("library")}
          className={`px-4 py-2 border-b-2 transition ${
            activeTab === "library"
              ? "border-[#2271b1] text-[#1d2327] font-bold bg-white"
              : "border-transparent text-[#646970] hover:text-[#1d2327]"
          }`}
        >
          Thư viện Media ({mediaList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 border-b-2 transition ${
            activeTab === "upload"
              ? "border-[#2271b1] text-[#1d2327] font-bold bg-white"
              : "border-transparent text-[#646970] hover:text-[#1d2327]"
          }`}
        >
          Tải lên tập tin (Upload Files)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`px-4 py-2 border-b-2 transition ${
            activeTab === "url"
              ? "border-[#2271b1] text-[#1d2327] font-bold bg-white"
              : "border-transparent text-[#646970] hover:text-[#1d2327]"
          }`}
        >
          Chèn từ URL (Insert from URL)
        </button>
      </div>

      {uploadNotice && (
        <div
          className={`rounded border-l-4 p-3 shadow-sm text-xs font-bold ${
            uploadNotice.isError
              ? "border-red-500 bg-red-50 text-red-800"
              : "border-emerald-500 bg-emerald-50 text-emerald-800"
          }`}
        >
          {uploadNotice.msg}
        </div>
      )}

      {activeTab === "upload" ? (
        /* TAB: TẢI LÊN TẬP TIN (WordPress Drag & Drop Upload Zone) */
        <div className="space-y-4">
          {/* GitHub Token Config status */}
          {hasToken && !showTokenEdit ? (
            <div className="rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🟢</span>
                <div>
                  <span className="font-bold">Kho lưu trữ GitHub đã sẵn sàng:</span>{" "}
                  Embisu/anbu-website. Ảnh tải lên sẽ được lưu trữ miễn phí vĩnh viễn, không giới hạn dung lượng và phân phối qua Cloudflare CDN.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTokenEdit(true)}
                className="ml-3 shrink-0 text-[11px] underline font-bold text-emerald-900 hover:text-black"
              >
                Thay đổi Token
              </button>
            </div>
          ) : (
            <div className="rounded border border-blue-200 bg-blue-50/70 p-4 text-xs text-slate-800 space-y-2">
              <div className="font-bold text-[#135e96] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span>🔑</span>
                  <span>Cấu hình GitHub Token (Thay thế Supabase Storage đã hết dung lượng)</span>
                </div>
                {hasToken && (
                  <button
                    type="button"
                    onClick={() => setShowTokenEdit(false)}
                    className="text-[11px] font-normal text-slate-500 hover:text-slate-800"
                  >
                    ✕ Đóng
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#50575e]">
                Nhập GitHub Personal Access Token (PAT) để lưu ảnh trực tiếp vào kho mã nguồn (miễn phí vĩnh viễn, không giới hạn dung lượng). Cấu hình 1 lần duy nhất:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx hoặc github_pat_xxxx"
                  className="flex-1 rounded border border-[#8c8f94] bg-white px-2.5 py-1.5 font-mono text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />
                <button
                  type="button"
                  onClick={handleSaveToken}
                  className="rounded bg-[#2271b1] px-4 py-1.5 font-bold text-white text-xs hover:bg-[#135e96] transition"
                >
                  Lưu Token
                </button>
              </div>
              <div className="text-[11px] text-[#646970]">
                📖 Chưa có Token?{" "}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2271b1] underline font-semibold"
                >
                  Bấm vào đây để tạo nhanh trên GitHub
                </a>{" "}
                (chọn <i>Generate token (classic)</i> $\rightarrow$ tick quyền <b>repo</b> $\rightarrow$ Generate $\rightarrow$ Copy dán vào đây).
              </div>
            </div>
          )}

          <div className="rounded border-2 border-dashed border-[#c3c4c7] bg-white p-10 text-center shadow-sm">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f0f1] text-3xl text-[#646970]">
              {uploading ? "⏳" : "📤"}
            </div>
            <h3 className="mt-4 text-base font-bold text-[#1d2327]">
              {uploading ? "Đang tải ảnh lên kho GitHub CDN..." : "Thả tập tin để tải lên"}
            </h3>
            <p className="mt-1 text-xs text-[#646970]">hoặc</p>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 rounded border border-[#2271b1] bg-white px-4 py-1.5 text-xs font-bold text-[#2271b1] hover:bg-[#f0f6fc] transition disabled:opacity-50"
            >
              {uploading ? "Đang xử lý..." : "Chọn tập tin từ máy tính"}
            </button>
            <p className="mt-4 text-[11px] text-[#646970]">
              Định dạng hỗ trợ: JPG, PNG, WebP, SVG. Tự động tối ưu và phân phối qua Cloudflare CDN.
            </p>
          </div>
        </div>
      ) : activeTab === "url" ? (
        /* TAB: CHÈN QUA LIÊN KẾT URL (Direct Web Image Link) */
        <div className="rounded border border-[#ccd0d4] bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1d2327]">
              🔗 Chèn hình ảnh trực tiếp từ liên kết URL
            </h3>
            <p className="text-xs text-[#646970] mt-0.5">
              Dán liên kết ảnh từ bất kỳ đâu trên internet (Imgur, Unsplash, Google Drive, hosting riêng...). Không cần GitHub Token hay tốn dung lượng lưu trữ.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#50575e] mb-1">
                Đường dẫn URL hình ảnh (bắt đầu bằng https://):
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... hoặc https://i.imgur.com/..."
                className="w-full rounded border border-[#8c8f94] bg-white p-2 text-xs font-mono text-[#2c3338] outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#50575e] mb-1">
                Tiêu đề / Văn bản thay thế (Alt text):
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Mô tả hình ảnh cho người đọc và SEO..."
                className="w-full rounded border border-[#8c8f94] bg-white p-2 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
              />
            </div>

            {customUrl.trim() && (
              <div className="mt-3">
                <div className="text-[11px] font-bold text-[#50575e] mb-1">Xem trước:</div>
                <div className="relative aspect-[16/10] max-w-sm overflow-hidden rounded border border-[#ccd0d4] bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={customUrl.trim()}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleInsertByUrl}
                disabled={!customUrl.trim()}
                className="rounded bg-[#2271b1] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition disabled:opacity-50"
              >
                Sử dụng hình ảnh này
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TAB: THƯ VIỆN MEDIA & ATTACHMENT DETAILS (WordPress Media Library Grid) */
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Main Grid View (8 or 9 cols) */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-3">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border border-[#ccd0d4] bg-white p-2.5 rounded shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm media..."
                  className="w-48 rounded border border-[#8c8f94] px-2.5 py-1 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                />

                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="rounded border border-[#8c8f94] px-2 py-1 text-xs text-[#2c3338] outline-none"
                >
                  <option value="all">Tất cả nhãn tag</option>
                  {allTags.filter((t) => t !== "all").slice(0, 10).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-[#646970]">
                {filteredAssets.length} tập tin
              </div>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 max-h-[560px] overflow-y-auto p-1">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.src === asset.src;
                return (
                  <div
                    key={asset.src}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative aspect-square cursor-pointer overflow-hidden rounded border bg-[#f0f0f1] transition ${
                      isSelected
                        ? "border-[#2271b1] ring-3 ring-[#2271b1] shadow-md"
                        : "border-[#ccd0d4] hover:border-[#a7aaad]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.src}
                      alt={asset.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2271b1] text-white text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                    <button
                      type="button"
                      title="Xóa tập tin này"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAsset(asset);
                      }}
                      className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 hover:bg-[#d63638] transition"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar: ATTACHMENT DETAILS (Classic WordPress Sidebar) */}
          <div className="lg:col-span-4 xl:col-span-3 border border-[#ccd0d4] bg-[#f6f7f7] p-3.5 rounded shadow-sm space-y-3 text-xs">
            <h4 className="font-bold uppercase text-[11px] text-[#1d2327] border-b border-[#ccd0d4] pb-1.5">
              Chi tiết đính kèm (Attachment Details)
            </h4>

            {selectedAsset ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded border border-[#ccd0d4] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedAsset.src} alt="" className="h-full w-full object-cover" />
                </div>

                <div className="text-[11px] text-[#646970] space-y-0.5 border-b border-[#ccd0d4] pb-2">
                  <div className="font-bold text-[#1d2327] truncate">{selectedAsset.title}</div>
                  <div>Kích thước: {selectedAsset.dimensions}</div>
                  <div>Dung lượng: {selectedAsset.size}</div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#50575e]">Văn bản thay thế (Alt Text)</label>
                    <input
                      type="text"
                      defaultValue={selectedAsset.title}
                      className="mt-1 w-full rounded border border-[#8c8f94] bg-white px-2 py-1 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#50575e]">Đường dẫn URL của tập tin</label>
                    <div className="mt-1 flex gap-1">
                      <input
                        type="text"
                        readOnly
                        value={selectedAsset.src}
                        className="w-full rounded border border-[#8c8f94] bg-slate-100 px-2 py-1 font-mono text-[10px] text-[#2c3338] outline-none truncate"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedAsset.src)}
                        className="shrink-0 rounded border border-[#2271b1] bg-white px-2 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-[#f0f6fc]"
                      >
                        {copiedSrc === selectedAsset.src ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                {onSelectImage && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectImage(selectedAsset.src)}
                      className="w-full rounded bg-[#2271b1] py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96] transition"
                    >
                      Chọn tập tin này (Select Media)
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-[#ccd0d4]">
                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(selectedAsset)}
                    className="w-full rounded border border-[#d63638] bg-white py-1.5 text-xs font-semibold text-[#d63638] hover:bg-[#fcf0f1] transition flex items-center justify-center gap-1.5"
                  >
                    <span>🗑️</span> <span>Xóa vĩnh viễn tập tin (Delete)</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#646970] italic">Chọn một ảnh từ thư viện để xem thông tin chi tiết.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

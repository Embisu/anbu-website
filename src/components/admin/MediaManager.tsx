"use client";

import React, { useState, useRef } from "react";
import Icon from "@/components/Icon";

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
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [mediaList, setMediaList] = useState<MediaItem[]>(defaultMediaAssets);
  const [selectedAsset, setSelectedAsset] = useState<MediaItem | null>(defaultMediaAssets[0]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [copiedSrc, setCopiedSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newItem: MediaItem = {
          src: dataUrl,
          title: file.name.replace(/\.[^/.]+$/, ""),
          tags: ["upload", "new"],
          size: `${Math.round(file.size / 1024)} KB`,
          dimensions: "Tùy chỉnh (Custom)",
        };
        setMediaList((prev) => [newItem, ...prev]);
        setSelectedAsset(newItem);
        setActiveTab("library");
      };
      reader.readAsDataURL(file);
    });
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
      </div>

      {activeTab === "upload" ? (
        /* TAB: TẢI LÊN TẬP TIN (WordPress Drag & Drop Upload Zone) */
        <div className="rounded border-2 border-dashed border-[#c3c4c7] bg-white p-12 text-center shadow-sm">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f0f1] text-3xl text-[#646970]">
            📤
          </div>
          <h3 className="mt-4 text-base font-bold text-[#1d2327]">Thả tập tin để tải lên</h3>
          <p className="mt-1 text-xs text-[#646970]">hoặc</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 rounded border border-[#2271b1] bg-white px-4 py-1.5 text-xs font-bold text-[#2271b1] hover:bg-[#f0f6fc] transition"
          >
            Chọn tập tin
          </button>
          <p className="mt-4 text-[11px] text-[#646970]">
            Kích thước tập tin tải lên tối đa: 64 MB. Định dạng hỗ trợ: JPG, PNG, WebP, SVG.
          </p>
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

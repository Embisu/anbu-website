"use client";

import React, { useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";

// List of all verified images available in public/blog-covers/
export const verifiedMediaAssets = [
  { src: "/blog-covers/analytics-dashboard.jpg", title: "Analytics Dashboard & Growth Charts", tags: ["analytics", "kpi", "telemetry"] },
  { src: "/blog-covers/app-store-conversion-funnel.jpg", title: "App Store Conversion Funnel", tags: ["aso", "store", "conversion"] },
  { src: "/blog-covers/aso-store-optimization.jpg", title: "ASO Store Listing Optimization", tags: ["aso", "screenshot", "title"] },
  { src: "/blog-covers/battle-pass-value.jpg", title: "Battle Pass Value Matrix", tags: ["monetization", "battle pass", "iap"] },
  { src: "/blog-covers/brand-foundation.jpg", title: "Brand Identity Foundation", tags: ["branding", "identity", "strategy"] },
  { src: "/blog-covers/brand-identity-design.jpg", title: "Brand Identity Design Board", tags: ["branding", "design", "logo"] },
  { src: "/blog-covers/brand-strategy-board.jpg", title: "Brand Positioning Strategy", tags: ["branding", "positioning", "strategy"] },
  { src: "/blog-covers/community-launch.jpg", title: "Community Launch Roadmap", tags: ["community", "launch", "discord"] },
  { src: "/blog-covers/community-meetup-collab.jpg", title: "Community Meetup & Scrim Tournament", tags: ["community", "offline", "esports"] },
  { src: "/blog-covers/content-editorial-writing.jpg", title: "Content Editorial & Case Studies", tags: ["content", "case study", "writing"] },
  { src: "/blog-covers/creative-testing-lab.jpg", title: "Creative Testing Lab & Angle Matrix", tags: ["creative", "ads", "ua"] },
  { src: "/blog-covers/creator-program.jpg", title: "Creator & Influencer Program", tags: ["creator", "influencer", "ugc"] },
  { src: "/blog-covers/creator-tiktok-studio.jpg", title: "TikTok Creator Studio & Vertical Ads", tags: ["tiktok", "creator", "ugc"] },
  { src: "/blog-covers/discord-community.jpg", title: "Discord Community Hub", tags: ["discord", "community", "moderation"] },
  { src: "/blog-covers/discord-community-game-night.png", title: "Discord Community Game Night Live", tags: ["discord", "events", "voice"] },
  { src: "/blog-covers/discord-game-hub-activity.png", title: "Discord Game Hub Activity Screen", tags: ["discord", "activity", "channels"] },
  { src: "/blog-covers/discord-voice-channel-gameplay.png", title: "Discord Voice Channel & Gameplay Scrim", tags: ["discord", "voice", "gameplay"] },
  { src: "/blog-covers/esports-team-flash-sponsorship.png", title: "Esports Team Flash Sponsorship & ROI", tags: ["esports", "roi", "sponsorship"] },
  { src: "/blog-covers/esports-vietnam-asiad.jpg", title: "Esports Vietnam National Team ASIAD", tags: ["esports", "tournament", "stage"] },
  { src: "/blog-covers/esports-vietnam-sea-games.jpg", title: "Esports Vietnam Gold Medal SEA Games", tags: ["esports", "tournament", "sea games"] },
  { src: "/blog-covers/esports-vietnam-stage.jpg", title: "Arena of Valor & VCS Stage Stadium", tags: ["esports", "stadium", "tournament"] },
  { src: "/blog-covers/game-liveops-monitoring.jpg", title: "LiveOps Telemetry & Operations", tags: ["liveops", "operations", "retention"] },
  { src: "/blog-covers/game-seo-cluster.jpg", title: "SEO Topic Cluster Architecture", tags: ["seo", "topic cluster", "organic"] },
  { src: "/blog-covers/growth-analytics-chart.jpg", title: "Cohort Retention & Revenue Chart", tags: ["analytics", "retention", "arpu"] },
  { src: "/blog-covers/in-app-purchase-mobile.jpg", title: "In-App Purchases & Checkout Gateway", tags: ["monetization", "iap", "payments"] },
  { src: "/blog-covers/influencer-measurement.jpg", title: "Influencer Performance Attribution", tags: ["influencer", "measurement", "kol"] },
  { src: "/blog-covers/launch-checklist.jpg", title: "Vietnam Game Launch Checklist", tags: ["launch", "checklist", "operations"] },
  { src: "/blog-covers/livestream-creator-setup.jpg", title: "Livestream Creator Gaming Setup", tags: ["creator", "livestream", "broadcast"] },
  { src: "/blog-covers/localization-translation-team.jpg", title: "Localization & LQA Testing Team", tags: ["localization", "lqa", "translation"] },
  { src: "/blog-covers/monetization-trust.jpg", title: "Monetization & Economy Trust", tags: ["monetization", "economy", "iap"] },
  { src: "/blog-covers/onboarding-activation.jpg", title: "Player Onboarding & FTUE Activation", tags: ["onboarding", "ftue", "retention"] },
  { src: "/blog-covers/performance-ad-campaigns.jpg", title: "Performance Marketing Ad Campaigns", tags: ["performance", "ads", "cpi"] },
  { src: "/blog-covers/pr-media-press-conference.jpg", title: "PR Media Press Conference & Launch", tags: ["pr", "press", "media"] },
  { src: "/blog-covers/seo-organic-ranking.jpg", title: "Google Organic Search Ranking & E-E-A-T", tags: ["seo", "google", "organic"] },
  { src: "/blog-covers/seo-strategy.jpg", title: "SEO Schema JSON-LD & Internal Link Architecture", tags: ["seo", "schema", "architecture"] },
  { src: "/blog-covers/soft-launch-measurement.jpg", title: "Soft Launch Telemetry & D1-D7 Validation", tags: ["soft launch", "analytics", "ua"] },
  { src: "/blog-covers/store-conversion.jpg", title: "App Store & Google Play Localized Page", tags: ["aso", "store", "conversion"] },
  { src: "/blog-covers/team-strategy-meeting.jpg", title: "ANBU Squad Strategy & Growth Meeting", tags: ["team", "strategy", "agency"] },
  { src: "/blog-covers/thailand-game-expo.jpg", title: "Thailand Game Show (TGS) Live Arena", tags: ["thailand", "expo", "sea"] },
  { src: "/blog-covers/tiktok-social.jpg", title: "TikTok Viral Trends & Social Growth", tags: ["tiktok", "viral", "social"] },
  { src: "/blog-covers/ugc-creator-community.jpg", title: "UGC Creator Community Campaign", tags: ["ugc", "creator", "community"] },
  { src: "/blog-covers/vietnam-game-publishers-map.png", title: "Vietnam Game Publisher Landscape Infographic", tags: ["publishers", "infographic", "map"] },
];

type MediaManagerProps = {
  locale: string;
  onSelectImage?: (imageSrc: string) => void;
};

export default function MediaManager({ locale, onSelectImage }: MediaManagerProps) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [copiedSrc, setCopiedSrc] = useState<string | null>(null);

  const allTags = ["all", ...Array.from(new Set(verifiedMediaAssets.flatMap((item) => item.tags)))];

  const filteredAssets = verifiedMediaAssets.filter((item) => {
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

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-navy-800/80 bg-navy-900/60 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === "vi" ? "Tìm kiếm ảnh theo từ khóa (discord, store, tiktok, ads...)" : "Search media by keyword..."}
              className="w-full rounded-2xl border border-navy-800 bg-navy-950/80 py-3.5 pl-12 pr-4 text-sm text-white placeholder-navy-500 outline-none transition focus:border-orange-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="shrink-0 text-xs font-semibold text-navy-400">
            {locale === "vi" ? "Tổng cộng:" : "Total:"} <strong className="text-white">{filteredAssets.length}</strong> ảnh
          </span>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2">
        {allTags.slice(0, 14).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${
              selectedTag === tag
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                : "border border-navy-800 bg-navy-900/40 text-navy-300 hover:border-navy-700 hover:text-white"
            }`}
          >
            {tag === "all" ? (locale === "vi" ? "Tất cả" : "All") : tag}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.src}
            className="group relative overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/50 transition-all hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.src}
                alt={asset.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60 group-hover:opacity-40" />

              {/* Action Buttons overlay */}
              <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                {onSelectImage && (
                  <button
                    onClick={() => onSelectImage(asset.src)}
                    className="rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-orange-600"
                  >
                    {locale === "vi" ? "Chọn ảnh" : "Select"}
                  </button>
                )}
                <button
                  onClick={() => handleCopy(asset.src)}
                  className="rounded-xl bg-navy-900/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-navy-800"
                  title="Copy path"
                >
                  {copiedSrc === asset.src ? "✓ Copied" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="p-4">
              <h4 className="line-clamp-1 font-display text-sm font-bold text-white group-hover:text-orange-400">
                {asset.title}
              </h4>
              <p className="mt-1 font-mono text-[11px] text-navy-400 select-all">{asset.src}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {asset.tags.map((t) => (
                  <span key={t} className="rounded-md bg-navy-800/80 px-2 py-0.5 text-[10px] font-medium text-navy-300">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

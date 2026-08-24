import type { SceneVariant } from "./Scene";

const serviceImages: Record<string, string> = {
  "influencer-marketing": "influencer-marketing",
  "game-app-marketing": "game-app-marketing",
  "brand-strategy": "brand-strategy",
  "creative-design": "creative-design",
  "performance-marketing": "performance-marketing",
  "seo-content": "seo-content",
  "web-development": "web-development",
  "social-media": "social-media",
};

const postImages: Partial<Record<SceneVariant, string>> = {
  influencer: "community-3d.png",
  game: "game-app",
  branding: "branding",
  performance: "performance-3d.png",
  seo: "analytics-3d.png",
  web: "analytics-3d.png",
  social: "community-3d.png",
};

export function editorialImageForService(slug: string) {
  return `/services-chibi/${serviceImages[slug] ?? "brand-strategy"}.jpg`;
}

export function editorialImageForPost(variant: SceneVariant) {
  const image = postImages[variant] ?? "social";
  return `/blog-covers/${image}${image.endsWith(".png") ? "" : ".jpg"}`;
}

const topicCovers = [
  "analytics-dashboard.jpg", "aso-store-optimization.jpg", "battle-pass-value.jpg",
  "brand-foundation.jpg", "community-launch.jpg", "creative-testing-lab.jpg",
  "creator-influencer.jpg", "discord-community.jpg", "game-pr-vietnam.jpg",
  "game-seo-cluster.jpg", "influencer-measurement.jpg", "launch-checklist.jpg",
  "monetization-trust.jpg", "onboarding-activation.jpg", "retention-return.jpg",
  "seo-strategy.jpg", "soft-launch-measurement.jpg", "store-conversion.jpg",
  "tiktok-social.jpg", "vietnam-game-publishers-map.png", "vietnam-game-saturation.png",
  "analytics-3d.png", "community-3d.png", "performance-3d.png",
];

// Real editorial photography downloaded from Unsplash (see public/blog-covers/REAL-SOURCES.txt).
// Keep a deterministic, topic-aware assignment so every post gets a stable real image.
const realCoverPool = [
  "real-mobile-gaming.jpg", "real-game-console.jpg", "real-game-event.jpg", "real-phone-app.jpg",
  "real-analytics.jpg", "real-social.jpg", "real-team.jpg", "real-brand.jpg", "real-thailand.jpg",
  "real-vietnam.jpg", "real-content.jpg",
];

function stableIndex(slug: string, size: number) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return size ? hash % size : 0;
}

function realCoverForSlug(slug: string) {
  const s = slug.toLowerCase();
  const choose = (images: string[]) => `/blog-covers/${images[stableIndex(slug, images.length)]}`;
  // Exact editorial assignments come first so related keywords never make two cards share a cover.
  const slugCovers: Record<string, string> = {
  "ban-do-nha-phat-hanh-game-viet-nam": "publishers/vng-cookierun.jpg",
    "thi-truong-game-viet-nam-bao-hoa-chien-luoc-tang-truong": "vietnam-game-saturation.png",
    "marketing-game-app-toi-uu-cpi-roas": "real-phone-app.jpg",
    "influencer-marketing-chon-kol-koc-dung-cach": "creator-influencer.jpg",
    "chien-luoc-noi-dung-tiktok-cho-thuong-hieu": "tiktok-social.jpg",
    "seo-2026-huong-dan-toan-dien": "seo-strategy.jpg",
    "xay-dung-thuong-hieu-tu-con-so-0": "real-xay-dung-thuong-hieu-tu-con-so-0.jpg",
    "performance-marketing-toi-uu-ngan-sach": "performance.jpg",
    "aso-game-mobile-viet-nam": "aso-store-optimization.jpg",
    "soft-launch-game-mobile-viet-nam": "soft-launch-measurement.jpg",
    "xay-dung-cong-dong-game-mobile-viet-nam": "community-launch.jpg",
    "ugc-game-mobile-cach-kich-hoat-nguoi-choi": "creator-program.jpg",
    "retention-game-mobile-tang-d1-d7-d30": "retention-return.jpg",
    "liveops-game-mobile-lich-su-kien-giu-nguoi-choi": "real-game-event.jpg",
    "localization-game-mobile-viet-nam": "real-vietnam.jpg",
    "user-acquisition-game-mobile-kenh-quang-cao": "user-acquisition-3d.png",
    "monetization-game-mobile-iap-battle-pass": "monetization-trust.jpg",
    "do-luong-game-mobile-cpi-ltv-roas": "real-analytics-game.jpg",
    "ra-mat-game-mobile-viet-nam-checklist": "launch-checklist.jpg",
    "creative-testing-game-mobile-quang-cao": "creative-testing-lab.jpg",
    "pr-game-mobile-viet-nam-ra-mat": "game-pr-vietnam.jpg",
    "influencer-game-mobile-do-luong-hieu-qua": "influencer-measurement.jpg",
    "app-store-conversion-rate-game-mobile": "store-conversion.jpg",
    "community-launch-game-mobile-90-ngay": "community-3d.png",
    "soft-launch-game-mobile-do-gi-truoc-global-launch": "real-game-console.jpg",
    "game-mobile-ugc-creator-program": "creator-influencer.jpg",
    "seo-game-mobile-topic-cluster": "game-seo-cluster.jpg",
    "game-mobile-onboarding-tang-activation": "onboarding-activation.jpg",
    "battle-pass-game-mobile-thiet-ke-gia-tri": "battle-pass-value.jpg",
    "quang-cao-game-mobile-viet-nam-ke-hoach-ngan-sach": "real-marketing-game.jpg",
    "tiktok-marketing-cho-game-mobile-viet-nam": "real-social.jpg",
    "pheu-marketing-game-mobile-tu-nhan-biet-den-retention": "performance-3d.png",
    "thanh-toan-game-mobile-viet-nam-tang-conversion": "game-app.jpg",
    "community-manager-game-mobile-kpi": "real-team.jpg",
    "localization-game-mobile-chi-phi-va-quy-trinh": "real-content.jpg",
    "creative-strategy-game-mobile-test-hook": "creative-testing.jpg",
    "game-marketing-b2b-case-study-viet-nam": "game-pr-vietnam.jpg",
    "mobile-game-user-acquisition-vietnam-benchmark": "real-analytics.jpg",
    "aso-game-mobile-title-description-screenshot": "aso-store-optimization.jpg",
    "game-mobile-retention-push-notification": "real-mobile-gaming.jpg",
    "game-mobile-influencer-brief-mau": "creator-program.jpg",
    "monetization-game-mobile-arppu-arpu": "monetization-3d.png",
    "game-mobile-analytics-dashboard-can-co": "analytics-dashboard.jpg",
    "game-mobile-community-discord-viet-nam": "discord-community.jpg",
    "marketing-game-mobile-mua-tet-viet-nam": "real-vietnam.jpg",
    "seo-game-marketing-viet-nam-internal-link": "seo.jpg",
    "ab-test-store-listing-game-mobile": "creative-testing-lab.jpg",
    "game-marketing-localization-vietnam-keyword": "real-content.jpg",
    "game-mobile-user-acquisition-creative-fatigue": "creative-fatigue-3d.png",
    "game-community-moderation-vietnam": "moderation-3d.png",
    "ai-search-seo-game-marketing": "ai-search-3d.png",
    "game-launch-marketing-thailand": "real-thailand.jpg",
    "app-review-management-game-vietnam": "app-reviews-3d.png",
    "micro-influencer-game-campaign-vietnam": "influencer-3d.png",
    "aso-localization-vietnam-mobile-game": "real-game-console.jpg",
    "esports-sponsorship-vietnam-roi": "esports-vietnam-stage.jpg",
    "lich-su-qua-trinh-phat-trien-esports-viet-nam": "esports-vietnam-sea-games.jpg",
  };
  if (slugCovers[slug]) return `/blog-covers/${slugCovers[slug]}`;
    if (s.includes("esports")) return choose(["esports-vietnam-sea-games.jpg", "esports-vietnam-asiad.jpg", "esports-vietnam-stage.jpg"]);
  if (s.includes("thailand")) return choose(["real-thailand.jpg", "real-game-event.jpg", "real-content.jpg"]);
  if (s.includes("analytics") || s.includes("cpi") || s.includes("roas") || s.includes("arppu")) return choose(["real-analytics.jpg", "real-content.jpg", "real-mobile-gaming.jpg", "real-phone-app.jpg"]);
  if (s.includes("tiktok") || s.includes("social") || s.includes("influencer") || s.includes("ugc")) return choose(["real-social.jpg", "real-team.jpg", "real-content.jpg", "real-mobile-gaming.jpg"]);
  if (s.includes("brand") || s.includes("localization")) return choose(["real-brand.jpg", "real-vietnam.jpg", "real-content.jpg"]);
  if (s.includes("seo") || s.includes("keyword") || s.includes("internal-link")) return choose(["real-content.jpg", "real-analytics.jpg", "real-brand.jpg", "real-vietnam.jpg"]);
  if (s.includes("community") || s.includes("discord") || s.includes("moderation")) return choose(["real-team.jpg", "real-social.jpg", "real-game-event.jpg"]);
  if (s.includes("phone") || s.includes("app") || s.includes("aso") || s.includes("store")) return choose(["real-phone-app.jpg", "real-mobile-gaming.jpg", "real-game-console.jpg", "real-content.jpg"]);
  if (s.includes("thị-trường") || s.includes("thi-truong") || s.includes("vietnam") || s.includes("viet-nam")) return choose(["real-vietnam.jpg", "real-game-event.jpg", "real-brand.jpg", "real-mobile-gaming.jpg"]);
  return choose(realCoverPool);
}

function coverForSlug(slug: string) {
  const s = slug.toLowerCase();
  const exact: Array<[string, string]> = [
    ["app-review-management-game-vietnam", "app-reviews-3d.png"], ["game-mobile-user-acquisition-creative-fatigue", "creative-fatigue-3d.png"], ["ai-search-seo-game-marketing", "ai-search-3d.png"], ["game-community-moderation-vietnam", "moderation-3d.png"],
    ["user-acquisition-game-mobile-kenh", "user-acquisition-3d.png"], ["mobile-game-user-acquisition-vietnam-benchmark", "performance.jpg"], ["game-mobile-user-acquisition-creative-fatigue", "creative-testing.jpg"],
    ["app-review-management-game-vietnam", "game-pr-vietnam.jpg"], ["community-manager-game-mobile-kpi", "community-launch.jpg"],
    ["chien-luoc-aso-game-mobile-tang-tai", "store-conversion.jpg"], ["aso-game-mobile-title-description", "aso-store-optimization.jpg"],
    ["community-launch-game-mobile-90", "community-3d.png"], ["liveops-game-mobile", "retention-3d.png"],
    ["creative-strategy-game-mobile", "creative-testing.jpg"], ["creative-testing-game-mobile", "creative-testing-lab.jpg"],
    ["game-mobile-ugc-creator-program", "creator-influencer.jpg"], ["ugc-game-mobile-cach", "creator-program.jpg"],
    ["community-manager-game-mobile-kpi", "community-launch.jpg"], ["game-community-moderation-vietnam", "community-3d.png"],
    ["game-marketing-localization-vietnam-keyword", "vietnam-game-saturation.png"], ["seo-game-mobile-topic-cluster", "game-seo-cluster.jpg"],
    ["game-launch-viet-nam-checklist-30", "launch-3d.png"], ["game-mobile-soft-launch-thi-truong", "soft-launch-measurement.jpg"], ["soft-launch-game-mobile-viet-nam", "launch-checklist.jpg"],
    ["marketing-game-app-toi-uu-cpi-roas", "performance.jpg"], ["do-luong-game-mobile-cpi-ltv-roas", "analytics-3d.png"],
    ["pheu-marketing-game-mobile", "performance-3d.png"], ["game-mobile-retention-push", "retention-return.jpg"],
    ["seo-game-marketing-viet-nam-internal", "seo-strategy.jpg"], ["ai-search-seo-game-marketing", "game-seo-cluster.jpg"], ["seo-2026-huong-dan", "seo.jpg"],
    ["ab-test-store-listing", "creative-testing.jpg"], ["app-store-conversion-rate", "store-conversion.jpg"],
    ["tiktok-marketing-cho", "social.jpg"], ["chien-luoc-noi-dung-tiktok", "tiktok-social.jpg"],
    ["localization-game-mobile-viet-nam", "vietnam-game-publishers-map.png"], ["localization-game-mobile-chi-phi", "branding.jpg"],
    ["marketing-game-mobile-mua-tet", "tiktok-social.jpg"], ["thi-truong-game-viet-nam-bao-hoa", "vietnam-game-saturation.png"],
    ["retention", "retention-3d.png"], ["liveops", "community-launch.jpg"], ["push-notification", "retention-return.jpg"],
    ["influencer", "influencer-3d.png"], ["creator", "creator-influencer.jpg"], ["ugc", "creator-program.jpg"], ["tiktok", "tiktok-social.jpg"],
    ["community", "discord-community.jpg"], ["discord", "discord-community.jpg"], ["moderation", "community-launch.jpg"],
    ["aso", "aso-store-optimization.jpg"], ["store-listing", "store-conversion.jpg"], ["conversion-rate", "store-conversion.jpg"],
    ["onboarding", "onboarding-activation.jpg"], ["activation", "onboarding-activation.jpg"], ["battle-pass", "battle-pass-value.jpg"],
    ["monetization", "monetization-3d.png"], ["arppu", "monetization-trust.jpg"], ["payment", "monetization-trust.jpg"],
    ["launch", "launch-3d.png"], ["soft-launch", "soft-launch-measurement.jpg"], ["pr-game", "game-pr-vietnam.jpg"],
    ["analytics", "analytics-dashboard.jpg"], ["dashboard", "analytics-dashboard.jpg"], ["cpi", "performance-3d.png"], ["roas", "performance-3d.png"],
    ["user-acquisition", "analytics-dashboard.jpg"], ["creative-fatigue", "creative-testing.jpg"], ["marketing-b2b", "game-pr-vietnam.jpg"],
    ["seo", "seo-strategy.jpg"], ["search", "game-seo-cluster.jpg"], ["keyword", "game-seo-cluster.jpg"], ["internal-link", "game-seo-cluster.jpg"],
    ["branding", "brand-foundation.jpg"], ["brand", "brand-foundation.jpg"], ["localization", "vietnam-game-publishers-map.png"], ["tet", "vietnam-game-saturation.png"],
    ["creative", "creative-testing-lab.jpg"], ["ab-test", "creative-testing.jpg"], ["testing", "creative-testing-lab.jpg"],
  ];
  const matched = exact.find(([key]) => s.includes(key));
  if (matched) return `/blog-covers/${matched[1]}`;
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return `/blog-covers/${topicCovers[hash % topicCovers.length]}`;
}

export function editorialImageForPostData(post: { slug?: string; variant: SceneVariant; cover?: string }) {
  // Always prioritize the explicit cover defined in the post
  if (post.cover) return post.cover;
  return post.slug ? realCoverForSlug(post.slug) : editorialImageForPost(post.variant);
}

export default function EditorialMedia({
  src,
  alt,
  className = "",
  focal = "center",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  focal?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={1200}
      height={675}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: focal }}
    />
  );
}

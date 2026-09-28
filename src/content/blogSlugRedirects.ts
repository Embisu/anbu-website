// Lightweight vi -> en slug map for blog posts whose slug differs by locale.
// Kept as its own small file (instead of importing the full posts.ts, which
// also carries every post body) so middleware.ts can use it on every request
// without bundling megabytes of article content into the edge middleware.
//
// Regenerate whenever a post's slug or slug_en changes (derived from
// src/content/posts.ts — every entry here must stay in sync with the
// corresponding post's `slug` / `slug_en` fields).

export const blogViToEnSlug: Record<string, string> = {
  "ban-do-nha-phat-hanh-game-viet-nam": "vietnam-s-game-publisher-landscape-established-leaders-emerging",
  "thi-truong-game-viet-nam-bao-hoa-chien-luoc-tang-truong": "vietnam-s-mobile-gaming-landscape-why-quality-flight",
  "marketing-game-app-toi-uu-cpi-roas": "mobile-game-app-marketing-practical-cpi-roas-ltv",
  "influencer-marketing-chon-kol-koc-dung-cach": "influencer-marketing-choosing-right-gaming-kols-kocs-vanity",
  "chien-luoc-noi-dung-tiktok-cho-thuong-hieu": "tiktok-content-strategy-gaming-brands-mastering-first-3",
  "seo-2026-huong-dan-toan-dien": "seo-2026-complete-playbook-ai-search-google-e-e-a-t",
  "xay-dung-thuong-hieu-tu-con-so-0": "building-brand-scratch-5-foundational-steps-mindshare-dominance",
  "performance-marketing-toi-uu-ngan-sach": "performance-marketing-budget-optimization-ltv-cac-control",
  "aso-game-mobile-viet-nam": "mobile-game-aso-vietnam-strategic-organic-app-store",
  "soft-launch-game-mobile-viet-nam": "mobile-game-soft-launch-vietnam-technical-testing-risk",
  "xay-dung-cong-dong-game-mobile-viet-nam": "building-mobile-gaming-communities-vietnam-facebook-groups-liveops",
  "ugc-game-mobile-cach-kich-hoat-nguoi-choi": "ugc-mobile-games-turning-passionate-players-content-creators",
  "retention-game-mobile-tang-d1-d7-d30": "optimizing-mobile-game-retention-9-proven-formulas-d1",
  "liveops-game-mobile-lich-su-kien-giu-nguoi-choi": "mobile-game-liveops-designing-year-round-event-calendars-that",
  "localization-game-mobile-viet-nam": "mobile-game-localization-vietnam-bridging-language-gamer-culture",
  "monetization-game-mobile-iap-battle-pass": "mobile-game-monetization-combining-iap-battle-pass-rewarded",
  "do-luong-game-mobile-cpi-ltv-roas": "mobile-game-analytics-building-unified-dashboards-cpi-ltv",
  "ra-mat-game-mobile-viet-nam-checklist": "launching-mobile-game-vietnam-complete-checklist-licensing-your",
  "creative-testing-game-mobile-quang-cao": "mobile-game-creative-testing-3-step-process-winning-ads",
  "pr-game-mobile-viet-nam-ra-mat": "mobile-game-pr-vietnam-media-storytelling-launch-strategy",
  "influencer-game-mobile-do-luong-hieu-qua": "measuring-influencer-marketing-mobile-games-beyond-vanity-views",
  "app-store-conversion-rate-game-mobile": "improving-app-store-google-play-conversion-rates-3-second",
  "community-launch-game-mobile-90-ngay": "90-day-community-playbook-launching-sustaining-mobile-game-retention",
  "soft-launch-game-mobile-do-gi-truoc-global-launch": "mobile-game-soft-launch-4-golden-metric-clusters",
  "game-mobile-ugc-creator-program": "mobile-game-creator-programs-engineering-self-sustaining-ugc-ecosystem",
  "seo-game-mobile-topic-cluster": "mobile-game-seo-building-topic-clusters-dominate-search",
  "game-mobile-onboarding-tang-activation": "mobile-game-onboarding-5-golden-rules-maximize-first-session",
  "tiktok-marketing-cho-game-mobile-viet-nam": "mobile-game-tiktok-marketing-2-second-hook-frameworks-viral",
  "pheu-marketing-game-mobile-tu-nhan-biet-den-retention": "full-funnel-mobile-game-marketing-playbook-first-impression-d30",
  "thanh-toan-game-mobile-viet-nam-tang-conversion": "mobile-game-payment-gateways-vietnam-minimizing-friction-lifting",
  "community-manager-game-mobile-kpi": "mobile-game-community-manager-kpis-health-telemetry-long-term",
  "localization-game-mobile-chi-phi-va-quy-trinh": "mobile-game-localization-costs-lqa-workflows-eliminating-hidden",
  "game-marketing-b2b-case-study-viet-nam": "publishing-credible-game-marketing-case-studies-empirical-b2b",
  "mobile-game-user-acquisition-vietnam-benchmark": "vietnam-mobile-game-user-acquisition-benchmarks-2026-cpi",
  "game-mobile-retention-push-notification": "mobile-game-push-notifications-re-engaging-lapsed-players-spam",
  "game-mobile-influencer-brief-mau": "mobile-game-influencer-brief-template-empowering-authentic-creator",
  "monetization-game-mobile-arppu-arpu": "mobile-game-arpu-vs-arppu-decoding-monetization-models",
  "game-mobile-analytics-dashboard-can-co": "mobile-game-analytics-dashboard-10-core-metrics-growth",
  "game-mobile-community-discord-viet-nam": "building-running-gaming-discord-community-vietnam-practical-playbook",
  "marketing-game-mobile-mua-tet-viet-nam": "tet-gaming-marketing-vietnam-cultural-liveops-revenue-acceleration",
  "seo-game-marketing-viet-nam-internal-link": "internal-linking-game-websites-building-seo-topic-clusters",
  "ab-test-store-listing-game-mobile": "mobile-game-store-listing-b-tests-what-test",
  "game-marketing-localization-vietnam-keyword": "game-keyword-slang-localization-vietnam-decoding-gamer-vernacular",
  "game-mobile-user-acquisition-creative-fatigue": "overcoming-creative-fatigue-mobile-game-ua-3-early",
  "game-community-moderation-vietnam": "game-community-moderation-vietnam-safe-discussion-spaces-crisis",
  "ai-search-seo-game-marketing": "game-marketing-seo-ai-search-how-win-citations",
  "game-launch-marketing-thailand": "mobile-game-launch-thailand-southeast-asian-market-entry",
  "app-review-management-game-vietnam": "managing-mobile-game-app-reviews-vietnam-growth",
  "micro-influencer-game-campaign-vietnam": "micro-influencer-playbook-mobile-games-vietnam-maximizing-conversions-budget",
  "aso-localization-vietnam-mobile-game": "mobile-game-aso-localization-vietnam-keyword-slang-metadata",
  "esports-sponsorship-vietnam-roi": "measuring-esports-sponsorship-roi-vietnam-practical-guide-brands",
};

export const blogEnToViSlug: Record<string, string> = Object.fromEntries(
  Object.entries(blogViToEnSlug).map(([vi, en]) => [en, vi])
);

// Slugs of posts that were merged into another post (topic-cluster
// de-duplication) and no longer exist in posts.ts. Maps the old slug
// (vi or en form) directly to the surviving post's slug in the SAME
// locale, so old indexed URLs 308-redirect to the merged content instead
// of 404ing. Add both the old vi slug and old slug_en whenever a post is
// deleted this way.
export const mergedPostRedirects: Record<string, string> = {
  "battle-pass-game-mobile-thiet-ke-gia-tri": "monetization-game-mobile-iap-battle-pass",
  "designing-mobile-game-battle-passes-balancing-in-app-revenue": "mobile-game-monetization-combining-iap-battle-pass-rewarded",
  "creative-strategy-game-mobile-test-hook": "creative-testing-game-mobile-quang-cao",
  "mobile-game-creative-strategy-modular-hook-testing-framework": "mobile-game-creative-testing-3-step-process-winning-ads",
  "aso-game-mobile-title-description-screenshot": "aso-game-mobile-viet-nam",
  "mobile-game-aso-optimization-title-description-first-3": "mobile-game-aso-vietnam-strategic-organic-app-store",
  "user-acquisition-game-mobile-kenh-quang-cao": "marketing-game-app-toi-uu-cpi-roas",
  "mobile-game-user-acquisition-channel-selection-strategy-budget": "mobile-game-app-marketing-practical-cpi-roas-ltv",
  "quang-cao-game-mobile-viet-nam-ke-hoach-ngan-sach": "marketing-game-app-toi-uu-cpi-roas",
  "mobile-game-advertising-vietnam-3-phase-budget-allocation-strategy": "mobile-game-app-marketing-practical-cpi-roas-ltv",
};

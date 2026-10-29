// Lightweight vi -> en slug map for blog posts whose slug differs by locale.
// Kept as its own small file (instead of importing the full posts.ts, which
// also carries every post body) so middleware.ts can use it on every request
// without bundling megabytes of article content into the edge middleware.
//
// Regenerate whenever a post's slug or slug_en changes (derived from
// src/content/posts.ts — every entry here must stay in sync with the
// corresponding post's `slug` / `slug_en` fields).

export const blogViToEnSlug: Record<string, string> = {
  "ban-do-nha-phat-hanh-game-viet-nam": "vietnam-game-publisher-landscape-established-leaders-emerging-partners",
  "thi-truong-game-viet-nam-bao-hoa-chien-luoc-tang-truong": "vietnam-mobile-gaming-landscape-quality-over-saturation-2026",
  "marketing-game-app-toi-uu-cpi-roas": "mobile-game-app-marketing-practical-cpi-roas-ltv",
  "influencer-marketing-chon-kol-koc-dung-cach": "influencer-marketing-choosing-gaming-kols-kocs-without-vanity-metrics",
  "chien-luoc-noi-dung-tiktok-cho-thuong-hieu": "tiktok-content-strategy-gaming-brands-first-3-seconds",
  "seo-2026-huong-dan-toan-dien": "seo-2026-complete-playbook-ai-search-google-e-e-a-t",
  "xay-dung-thuong-hieu-tu-con-so-0": "building-brand-scratch-5-foundational-steps-mindshare-dominance",
  "performance-marketing-toi-uu-ngan-sach": "performance-marketing-budget-optimization-ltv-cac-control",
  "aso-game-mobile-viet-nam": "mobile-game-aso-vietnam-strategic-organic-app-store",
  "soft-launch-game-mobile-viet-nam": "mobile-game-soft-launch-vietnam-technical-testing-risk",
  "xay-dung-cong-dong-game-mobile-viet-nam": "building-mobile-gaming-communities-vietnam-facebook-groups-liveops",
  "ugc-game-mobile-cach-kich-hoat-nguoi-choi": "ugc-mobile-games-turning-passionate-players-content-creators",
  "retention-game-mobile-tang-d1-d7-d30": "optimizing-mobile-game-retention-9-formulas-d1-d7-d30",
  "liveops-game-mobile-lich-su-kien-giu-nguoi-choi": "mobile-game-liveops-year-round-event-calendars-retain-players",
  "ban-dia-hoa-game-mobile-tai-viet-nam": "mobile-game-localization-vietnam-bridging-language-gamer-culture",
  "chien-luoc-monetization-game-mobile-iap-battle-pass": "mobile-game-monetization-combining-iap-battle-pass-rewarded",
  "do-luong-game-mobile-cpi-ltv-roas": "mobile-game-analytics-building-unified-dashboards-cpi-ltv",
  "ra-mat-game-mobile-viet-nam-checklist": "launching-mobile-game-vietnam-checklist-licensing-to-first-90-days",
  "creative-testing-game-mobile-quang-cao": "mobile-game-creative-testing-3-step-process-winning-ads",
  "pr-game-mobile-viet-nam-ra-mat": "mobile-game-pr-vietnam-media-storytelling-launch-strategy",
  "influencer-game-mobile-do-luong-hieu-qua": "measuring-influencer-marketing-mobile-games-beyond-vanity-views",
  "tang-ty-le-chuyen-doi-trang-app-store-google-play": "improving-app-store-google-play-conversion-rates-3-second-rule",
  "community-launch-game-mobile-90-ngay": "90-day-community-playbook-launching-sustaining-mobile-game-retention",
  "soft-launch-game-mobile-do-gi-truoc-global-launch": "mobile-game-soft-launch-4-golden-metric-clusters",
  "chuong-trinh-creator-ugc-game-mobile": "mobile-game-creator-programs-engineering-self-sustaining-ugc-ecosystem",
  "seo-game-mobile-xay-dung-topic-cluster": "mobile-game-seo-building-topic-clusters-dominate-search",
  "game-mobile-onboarding-tang-activation": "mobile-game-onboarding-5-golden-rules-maximize-first-session",
  "tiktok-marketing-cho-game-mobile-viet-nam": "mobile-game-tiktok-marketing-2-second-hook-frameworks-viral",
  "pheu-marketing-game-mobile-tu-nhan-biet-den-retention": "full-funnel-mobile-game-marketing-playbook-first-impression-d30",
  "thanh-toan-game-mobile-viet-nam-tang-conversion": "mobile-game-payment-gateways-vietnam-minimizing-friction-lifting",
  "bo-kpi-cho-community-manager-game-mobile": "mobile-game-community-manager-kpis-health-telemetry-long-term",
  "ban-dia-hoa-game-mobile-chi-phi-va-quy-trinh": "mobile-game-localization-costs-lqa-workflows-hidden-expense-traps",
  "game-marketing-b2b-case-study-viet-nam": "publishing-credible-game-marketing-case-studies-empirical-b2b",
  "bo-benchmark-user-acquisition-game-mobile-tai-viet-nam-2026": "vietnam-mobile-game-user-acquisition-benchmarks-2026-cpi",
  "toi-uu-push-notification-game-mobile": "mobile-game-push-notifications-re-engaging-lapsed-players-spam",
  "game-mobile-influencer-brief-mau": "mobile-game-influencer-brief-template-empowering-authentic-creator",
  "phan-tich-arpu-va-arppu-game-mobile": "mobile-game-arpu-vs-arppu-decoding-monetization-models",
  "game-mobile-analytics-dashboard-can-co": "mobile-game-analytics-dashboard-10-core-metrics-growth",
  "game-mobile-community-discord-viet-nam": "building-running-gaming-discord-community-vietnam-practical-playbook",
  "marketing-game-mobile-mua-tet-viet-nam": "tet-gaming-marketing-vietnam-cultural-liveops-revenue-acceleration",
  "seo-game-marketing-viet-nam-internal-link": "internal-linking-game-websites-building-seo-topic-clusters",
  "ab-test-store-listing-game-mobile-nen-thu-gi": "mobile-game-store-listing-ab-tests-what-to-test",
  "ban-dia-hoa-tu-khoa-va-tieng-long-game-tai-viet-nam": "game-keyword-slang-localization-vietnam-decoding-gamer-vernacular",
  "xu-ly-creative-fatigue-quang-cao-game-mobile": "overcoming-creative-fatigue-mobile-game-ua-early-warning-signals",
  "kiem-duyet-va-quan-tri-cong-dong-game-tai-viet-nam": "game-community-moderation-vietnam-safe-discussion-spaces-crisis",
  "seo-game-marketing-trong-ky-nguyen-ai-search": "game-marketing-seo-ai-search-how-win-citations",
  "chien-luoc-phat-hanh-game-mobile-tai-thai-lan": "mobile-game-launch-thailand-southeast-asian-market-entry",
  "quan-ly-review-app-game-tai-viet-nam": "managing-mobile-game-app-reviews-vietnam-growth",
  "chien-dich-micro-influencer-cho-game-mobile": "micro-influencer-playbook-mobile-games-vietnam-maximizing-conversions-budget",
  "aso-ban-dia-hoa-game-mobile-tai-viet-nam": "mobile-game-aso-localization-vietnam-keyword-slang-metadata",
  "do-roi-tai-tro-esports-tai-viet-nam": "measuring-esports-sponsorship-roi-vietnam-practical-guide-brands",
  "game-content-marketing-thailand-chien-luoc-noi-dung-tiep-can-game-thu-thai-lan": "game-content-marketing-thailand-engaging-thai-gamers",
  "liveops-sau-khi-game-ra-mat-lam-the-nao-de-giu-chan-game-thu-thai-lan": "liveops-post-launch-how-to-retain-thai-gamers",
  "gaming-brand-partnership-thailand-chien-luoc-hop-tac-thuong-hieu-trong-thi-truong-game-thai-lan": "gaming-brand-partnership-thailand-strategic-collaboration",
  "nghien-cuu-xa-hoi-hoc-co-y-nghia-gi-trong-marketing-game": "sociological-research-in-game-marketing",
  "game-mobile-promotion-cach-quang-ba-game-mobile-hieu-qua-tai-viet-nam": "mobile-game-promotion-how-to-promote-games-in-vietnam",
  "kol-trong-nganh-game-vai-tro-va-cach-xay-dung-chien-luoc-hieu-qua": "kols-in-gaming-industry-strategic-playbook",
  "thi-truong-game-viet-nam-va-nhung-thay-doi-trong-cach-tiep-can-nguoi-choi": "vietnam-gaming-market-evolving-player-acquisition",
  "game-publishing-in-vietnam-nhung-bai-toan-can-giai-truoc-khi-dau-tu-marketing": "game-publishing-in-vietnam-challenges-before-investing-in-marketing",
  "game-audience-research-thailand-hieu-game-thu-thai-lan-de-tang-hieu-qua-marketing": "game-audience-research-thailand-understanding-thai-gamers",
  "vi-sao-game-thu-tai-game-nhung-khong-o-lai": "why-do-players-download-games-but-not-stay",
  "esports-tai-viet-nam-dang-mo-ra-co-hoi-gi-cho-thuong-hieu": "what-opportunities-does-esports-in-vietnam-offer-brands",
  "vietnam-gaming-market-toan-canh-co-hoi-nha-phat-hanh": "vietnam-gaming-market-overview-opportunities-publishers",
  "thi-truong-game-viet-nam-2026-co-hoi-tang-truong-o-dau": "vietnam-gaming-market-2026-where-are-the-growth-opportunities",
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
  // Renamed posts (Vietnamese-slug cleanup / tidied EN slugs): old slug (vi or en) -> current vi slug.
  "game-mobile-ugc-creator-program": "chuong-trinh-creator-ugc-game-mobile",
  "kpi-community-manager-game-mobile": "bo-kpi-cho-community-manager-game-mobile",
  // Renamed posts (Vietnamese-slug cleanup / tidied EN slugs): old slug (vi or en) -> current vi slug.
  "mobile-game-user-acquisition-vietnam-benchmark": "bo-benchmark-user-acquisition-game-mobile-tai-viet-nam-2026",
  "ab-test-store-listing-game-mobile": "ab-test-store-listing-game-mobile-nen-thu-gi",
  "game-marketing-localization-vietnam-keyword": "ban-dia-hoa-tu-khoa-va-tieng-long-game-tai-viet-nam",
  "game-mobile-user-acquisition-creative-fatigue": "xu-ly-creative-fatigue-quang-cao-game-mobile",
  "game-community-moderation-vietnam": "kiem-duyet-va-quan-tri-cong-dong-game-tai-viet-nam",
  "ai-search-seo-game-marketing": "seo-game-marketing-trong-ky-nguyen-ai-search",
  "game-launch-marketing-thailand": "chien-luoc-phat-hanh-game-mobile-tai-thai-lan",
  "app-review-management-game-vietnam": "quan-ly-review-app-game-tai-viet-nam",
  "micro-influencer-game-campaign-vietnam": "chien-dich-micro-influencer-cho-game-mobile",
  "aso-localization-vietnam-mobile-game": "aso-ban-dia-hoa-game-mobile-tai-viet-nam",
  "esports-sponsorship-vietnam-roi": "do-roi-tai-tro-esports-tai-viet-nam",
  "app-store-conversion-rate-game-mobile": "tang-ty-le-chuyen-doi-trang-app-store-google-play",
  "monetization-game-mobile-arppu-arpu": "phan-tich-arpu-va-arppu-game-mobile",
  "seo-game-mobile-topic-cluster": "seo-game-mobile-xay-dung-topic-cluster",
  "game-mobile-retention-push-notification": "toi-uu-push-notification-game-mobile",
  "community-manager-game-mobile-kpi": "bo-kpi-cho-community-manager-game-mobile",
  "monetization-game-mobile-iap-battle-pass": "chien-luoc-monetization-game-mobile-iap-battle-pass",
  "localization-game-mobile-viet-nam": "ban-dia-hoa-game-mobile-tai-viet-nam",
  "localization-game-mobile-chi-phi-va-quy-trinh": "ban-dia-hoa-game-mobile-chi-phi-va-quy-trinh",
  "vietnam-s-game-publisher-landscape-established-leaders-emerging": "ban-do-nha-phat-hanh-game-viet-nam",
  "vietnam-s-mobile-gaming-landscape-why-quality-flight": "thi-truong-game-viet-nam-bao-hoa-chien-luoc-tang-truong",
  "influencer-marketing-choosing-right-gaming-kols-kocs-vanity": "influencer-marketing-chon-kol-koc-dung-cach",
  "tiktok-content-strategy-gaming-brands-mastering-first-3": "chien-luoc-noi-dung-tiktok-cho-thuong-hieu",
  "optimizing-mobile-game-retention-9-proven-formulas-d1": "retention-game-mobile-tang-d1-d7-d30",
  "mobile-game-liveops-designing-year-round-event-calendars-that": "liveops-game-mobile-lich-su-kien-giu-nguoi-choi",
  "launching-mobile-game-vietnam-complete-checklist-licensing-your": "ra-mat-game-mobile-viet-nam-checklist",
  "improving-app-store-google-play-conversion-rates-3-second": "tang-ty-le-chuyen-doi-trang-app-store-google-play",
  "mobile-game-localization-costs-lqa-workflows-eliminating-hidden": "ban-dia-hoa-game-mobile-chi-phi-va-quy-trinh",
  "mobile-game-store-listing-b-tests-what-test": "ab-test-store-listing-game-mobile-nen-thu-gi",
  "overcoming-creative-fatigue-mobile-game-ua-3-early": "xu-ly-creative-fatigue-quang-cao-game-mobile",
  "battle-pass-game-mobile-thiet-ke-gia-tri": "chien-luoc-monetization-game-mobile-iap-battle-pass",
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

/** The canonical slug of a post in a given locale (EN falls back to the redirect map, then the VI slug). */
export function blogSlugForLocale(post: { slug: string; slug_en?: string }, locale: string): string {
  return locale === "en" ? post.slug_en || blogViToEnSlug[post.slug] || post.slug : post.slug;
}

/**
 * Resolves a redirect target (which may be written as a vi or an en slug) to
 * the slug that belongs to the requested locale, so a renamed/merged post
 * redirects in ONE hop instead of bouncing through the locale-fix redirect.
 */
export function resolveRedirectTarget(target: string, locale: string): string {
  if (blogViToEnSlug[target]) return locale === "en" ? blogViToEnSlug[target] : target;
  if (blogEnToViSlug[target]) return locale === "vi" ? blogEnToViSlug[target] : target;
  return target;
}

/**
 * Rewrites an internal blog URL (e.g. "/en/blog/<vi-slug>") to the canonical slug of
 * the locale in the URL, so links written with the "wrong" slug skip the 308 hop.
 */
export function localizeBlogPath(url: string): string {
  const m = url.match(/^\/(vi|en)\/blog\/([^/?#]+)(.*)$/);
  if (!m) return url;
  const [, locale, slug, rest] = m;
  const target = resolveRedirectTarget(mergedPostRedirects[slug] ?? slug, locale);
  return `/${locale}/blog/${target}${rest}`;
}

import type { Post } from "./posts";

/**
 * Topical map between the blog (outer content) and the commercial pages (core content).
 * Each post is tied to the one or two service pages it is genuinely about, plus up to two case
 * studies that show that service in practice. The rules read the post slug, which already
 * names the topic, so a new post is mapped without extra data entry.
 */
export type PostRelation = { services: string[]; projects: string[] };

const RULES: { re: RegExp; service: string }[] = [
  { re: /publisher|publishing|ban-do-nha-phat-hanh|co-hoi-nha-phat-hanh/, service: "publisher-search" },
  { re: /(^|-)seo(-|$)|internal-link|topic-cluster|ai-search/, service: "seo-content" },
  { re: /esports/, service: "esports-gaming-marketing-sea" },
  { re: /thai-lan|thailand/, service: "esports-gaming-marketing-sea" },
  { re: /xay-dung-thuong-hieu|brand-strategy/, service: "brand-strategy" },
  { re: /kol|koc|influencer|creator|ugc|micro|brief/, service: "influencer-marketing" },
  { re: /tiktok|noi-dung|creative-(?!testing|fatigue)/, service: "creative-design" },
  { re: /cong-dong|community|discord|kiem-duyet|review-app/, service: "social-media" },
  {
    re: /cpi|roas|ltv|arpu|benchmark|analytics|do-luong|performance|monetization|thanh-toan|retention|push|onboarding|creative-testing|creative-fatigue|promotion|aso|app-store|ab-test|conversion|pheu|user-acquisition/,
    service: "performance-marketing",
  },
  { re: /launch|ra-mat|soft-launch|pr-game|ban-dia-hoa|localiz|checklist|liveops|tet|phat-hanh|thi-truong|market|nghien-cuu|vi-sao|case-study/, service: "game-app-marketing" },
];

/** Case studies that show each service in practice (slugs of /work pages). */
const CASES: Record<string, string[]> = {
  "influencer-marketing": ["mu-vinh-du-game", "summoners-war-revival"],
  "game-app-marketing": ["mu-vinh-du-game", "honkai-impact-3-birthday"],
  "performance-marketing": ["summoners-war-revival", "honkai-impact-3-birthday"],
  "social-media": ["douluo-soul-master-duel", "onmyoji-arena"],
  "creative-design": ["goi-ta-dai-chuong-quy", "honkai-impact-3-birthday"],
  "esports-gaming-marketing-sea": ["honkai-impact-3-birthday", "onmyoji-arena"],
};

export function relationsForSlug(slug: string): PostRelation {
  const s = slug.toLowerCase();
  const services: string[] = [];
  for (const rule of RULES) {
    if (rule.re.test(s) && !services.includes(rule.service)) services.push(rule.service);
    if (services.length === 2) break;
  }
  if (!services.length) services.push("game-app-marketing");
  return { services, projects: CASES[services[0]] ?? [] };
}

/** Posts that belong to a service page: those where it is the main topic first, then secondary ones. */
export function postsForService(all: Post[], service: string, limit = 4): Post[] {
  const primary: Post[] = [];
  const secondary: Post[] = [];
  for (const p of all) {
    const r = relationsForSlug(p.slug);
    if (r.services[0] === service) primary.push(p);
    else if (r.services[1] === service) secondary.push(p);
  }
  const byDate = (a: Post, b: Post) => (a.date < b.date ? 1 : -1);
  return [...primary.sort(byDate), ...secondary.sort(byDate)].slice(0, limit);
}

import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Bot nào bị chặn toàn site: crawler thu thập nội dung để TRAIN model AI,
 * scraper dữ liệu hàng loạt, và vài bot không mang lại traffic cho thị trường VN.
 *
 * Cloudflare cũng tự chèn khối "Managed content" tương tự vào đầu robots.txt,
 * nhưng khối đó nằm ngoài repo. Danh sách này là nguồn chuẩn trong code,
 * để rule vẫn còn nếu đổi hosting hoặc tắt tính năng đó.
 */
const BLOCKED_BOTS = [
  // AI training / dataset crawlers
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "GoogleOther",
  "Google-CloudVertexBot",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "Bytespider",
  "CCBot",
  "Diffbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "MistralAI-Training",
  "omgili",
  "omgilibot",
  "ImagesiftBot",
  "Timpibot",
  "PanguBot",
  "VelenPublicWebCrawler",
  "KimiBot",
  "Kangaroo Bot",
  // Scraper / thu thập dữ liệu thương mại
  "PetalBot",
  "Baiduspider",
  "AwarioRssBot",
  "AwarioSmartBot",
  "magpie-crawler",
  "SemrushBot-SWA",
  "ICC-Crawler",
  "FishBot",
  "NavuBot",
  "WARDBot",
  "BorderxBot",
  "Cotoyogi",
  "QualifiedBot",
  "CitibotSiteCrawler",
  "atlassian-bot",
];

/**
 * Cố ý KHÔNG chặn (cần cho SEO và hiển thị trong câu trả lời AI):
 * Googlebot, Bingbot, Applebot, DuckDuckBot, OAI-SearchBot, ChatGPT-User,
 * PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User.
 * Các bot này rơi vào rule "*" bên dưới.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*/admin", "/admin"],
      },
      {
        userAgent: BLOCKED_BOTS,
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

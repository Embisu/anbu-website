import type { Post } from "@/content/posts";

export type SeoAuditResult = {
  score: number;
  badgeColor: string; // Tailwind class
  textColor: string;
  dotColor: string;
  ratingLabel: { vi: string; en: string };
  wordCount: number;
  imageCount: number;
  h2Count: number;
  titleLength: number;
  hasNumberInTitle: boolean;
  hasList: boolean;
  hasSources: boolean;
};

/**
 * Calculates a real, deterministic Rank Math SEO score based on actual post content,
 * word count, image richness, heading structure, citations, and title optimization.
 */
export function calculatePostSeoScore(post: Post, lang: "vi" | "en" = "vi"): SeoAuditResult {
  const currentTitle = post.title[lang] || post.title.vi || "";
  const currentExcerpt = post.excerpt[lang] || post.excerpt.vi || "";
  const titleLength = currentTitle.length;

  // Extract all text content
  const fullText = post.body
    .map((b) => {
      if (b.type === "p" || b.type === "h2" || b.type === "quote") return b.text[lang] || b.text.vi || "";
      if (b.type === "ul") return b.items.map((it) => it[lang] || it.vi || "").join(" ");
      return "";
    })
    .join(" ");

  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
  const imageCount = post.body.filter((b) => b.type === "image").length;
  const h2Count = post.body.filter((b) => b.type === "h2").length;
  const hasList = post.body.some((b) => b.type === "ul");
  const hasNumberInTitle = /\d+/.test(currentTitle);
  const hasSources = Boolean(post.sources && post.sources.length > 0);

  let score = 20; // Base score for having an article structure

  // 1. Title Analysis (Max 15 pts)
  if (titleLength >= 40 && titleLength <= 75) {
    score += 10;
  } else if (titleLength >= 25 && titleLength <= 90) {
    score += 6;
  } else {
    score += 2;
  }

  if (hasNumberInTitle) {
    score += 5;
  }

  // 2. Content Length & In-Depth Analysis (Max 25 pts)
  if (wordCount >= 1000) {
    score += 25;
  } else if (wordCount >= 700) {
    score += 20;
  } else if (wordCount >= 450) {
    score += 15;
  } else if (wordCount >= 250) {
    score += 10;
  } else {
    score += 5;
  }

  // 3. Media & Visual Evidence Richness (Max 20 pts)
  if (imageCount >= 5) {
    score += 20;
  } else if (imageCount >= 3) {
    score += 16;
  } else if (imageCount >= 2) {
    score += 12;
  } else if (imageCount >= 1) {
    score += 6;
  }

  // 4. Subheadings & Structure Hierarchy (Max 10 pts)
  if (h2Count >= 4) {
    score += 10;
  } else if (h2Count >= 2) {
    score += 7;
  } else if (h2Count === 1) {
    score += 4;
  }

  // 5. Readability & Lists (Max 5 pts)
  if (hasList) {
    score += 5;
  }

  // 6. Excerpt / Meta Description (Max 5 pts)
  if (currentExcerpt.length >= 100 && currentExcerpt.length <= 180) {
    score += 5;
  } else if (currentExcerpt.length > 0) {
    score += 3;
  }

  // 7. E-E-A-T Citations (Max 5 pts)
  if (hasSources) {
    score += 5;
  }

  // Cap score at 100
  if (score > 100) score = 100;

  // Determine badge styling and rating label
  let badgeColor = "bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]";
  let dotColor = "🟢";
  let textColor = "text-[#2e7d32]";
  let ratingLabel = { vi: "Xuất sắc (Great)", en: "Great" };

  if (score < 60) {
    badgeColor = "bg-[#ffebee] border-[#ffcdd2] text-[#c62828]";
    dotColor = "🔴";
    textColor = "text-[#c62828]";
    ratingLabel = { vi: "Cần cải thiện (Poor)", en: "Poor" };
  } else if (score < 80) {
    badgeColor = "bg-[#fff8e1] border-[#ffecb3] text-[#f57f17]";
    dotColor = "🟡";
    textColor = "text-[#f57f17]";
    ratingLabel = { vi: "Khá tốt (Good)", en: "Good" };
  }

  return {
    score,
    badgeColor,
    textColor,
    dotColor,
    ratingLabel,
    wordCount,
    imageCount,
    h2Count,
    titleLength,
    hasNumberInTitle,
    hasList,
    hasSources,
  };
}

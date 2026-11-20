import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { site } from "@/content/site";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://anbu.asia").replace(/\/$/, "");

/** Build hreflang alternates for a given path (path starts with "/" or is ""). */
export function languageAlternates(path = "") {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${siteUrl}/${loc}${clean}`;
  }
  languages["x-default"] = `${siteUrl}/vi${clean}`;
  return languages;
}

/** BreadcrumbList structured data, improves how the page shows in search results. */
export function breadcrumbLd(items: { name: string; path: string }[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => {
      const cleanPath = !it.path || it.path === "/" ? "" : (it.path.startsWith("/") ? it.path : `/${it.path}`);
      return {
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: `${siteUrl}/${locale}${cleanPath}`,
      };
    }),
  };
}

/** FAQPage structured data, can earn rich FAQ snippets on Google. */
export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BlogPosting structured data for articles. */
export function articleLd({
  title,
  description,
  date,
  author,
  image,
  url,
}: {
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
  url: string;
}) {
  const now = new Date();
  const parsedDate = new Date(date);
  const safeDate = !isNaN(parsedDate.getTime()) && parsedDate > now ? now.toISOString() : date;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: safeDate,
    dateModified: safeDate,
    image: image || `${siteUrl}/og/og-default.png`,
    author: { "@type": "Organization", name: author || "ANBU" },
    publisher: {
      "@type": "Organization",
      name: "ANBU",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/** Keep meta descriptions within what Google shows (~160 chars): prefer a sentence end, else a word end. */
export function trimDescription(text: string, max = 160): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (sentence >= 90) return cut.slice(0, sentence + 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > 90 ? space : cut.length).replace(/[,;:\-–]+$/, "")}…`;
}

/**
 * Fits a page title into ~60 characters (Google truncates around that length).
 * "Brand | tagline" titles keep the brand; other titles are cut at a natural separator
 * (colon, dash, question mark) when that keeps most of the title, otherwise at a word boundary.
 */
export function shortenTitle(title: string, max = 60): string {
  const t = title.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const pipe = t.indexOf(" | ");
  if (pipe >= 3 && pipe <= 40) return t.slice(0, pipe).trim();
  let best = -1;
  for (const sep of [": ", " – ", " — ", " - ", "? "]) {
    let i = t.indexOf(sep);
    while (i !== -1) {
      const end = sep === "? " ? i + 1 : i;
      if (end >= 28 && end <= max && end > best) best = end;
      i = t.indexOf(sep, i + 1);
    }
  }
  if (best > 0) return t.slice(0, best).trim();
  const cut = t.slice(0, max + 1);
  const space = cut.lastIndexOf(" ");
  const out = (space > 25 ? cut.slice(0, space) : t.slice(0, max)).trim();
  return out
    .replace(/(?:\s+(?:và|của|cho|với|tại|trong|để|the|and|to|of|in|for|with|a|an|&|before|after))+$/i, "")
    .replace(/[,;:\-–|]+$/, "")
    .trim();
}

/** <title> value: brand suffix (" | ANBU") when it fits within 60 characters, otherwise the title alone. */
function pageTitle(cleanTitle: string): string | { absolute: string } {
  const short = shortenTitle(cleanTitle, 60);
  return short.length + 7 <= 60 ? short : { absolute: short };
}

type BuildMetaArgs = {
  locale: Locale;
  path?: string; // without locale, starts with "/"
  title: string;
  seoTitle?: string; // overrides the auto-shortened <title>
  description: string;
  image?: string;
  type?: "website" | "article";
  alternatesLanguages?: Record<string, string>;
};

export function buildMetadata({
  locale,
  path = "",
  title,
  seoTitle,
  description,
  image = "/og/og-default.png",
  type = "website",
  alternatesLanguages,
}: BuildMetaArgs): Metadata {
  description = trimDescription(description);
  const isHome = path === "" || path === "/";
  // Strip duplicate trailing brand suffix if page title already ends with | ANBU or | ANBU Agency
  const cleanTitle = title.replace(/\s*[|\-–]\s*ANBU(?:\s+Agency)?\s*$/i, "").trim();
  const metaTitle = isHome ? { absolute: title } : pageTitle(seoTitle ? seoTitle.trim() : cleanTitle);
  const fullTitle = isHome ? title : `${cleanTitle} | ${site.name}`;
  const url = `${siteUrl}/${locale}${path === "/" ? "" : path}`;
  const absoluteImage = image.startsWith("http")
    ? image
    : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;

  return {
    title: metaTitle,
    description,
    alternates: {
      canonical: url,
      languages: alternatesLanguages || languageAlternates(path),
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      images: [{ url: absoluteImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteImage],
    },
  };
}


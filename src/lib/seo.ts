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

/** BreadcrumbList structured data — improves how the page shows in search results. */
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

/** FAQPage structured data — can earn rich FAQ snippets on Google. */
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

type BuildMetaArgs = {
  locale: Locale;
  path?: string; // without locale, starts with "/"
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
};

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  image = "/og/og-default.png",
  type = "website",
}: BuildMetaArgs): Metadata {
  // Keep search snippets compact without changing the visible H1 on the page.
  // Truncating at a word boundary avoids mid-word ellipses on mobile results.
  const compactTitle = title.length > 60
    ? `${title.slice(0, 57).replace(/\s+\S*$/, "").trim()}...`
    : title;
  const url = `${siteUrl}/${locale}${path === "/" ? "" : path}`;
  return {
    title: compactTitle,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      url,
      title: compactTitle,
      description,
      siteName: site.name,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: compactTitle,
      description,
      images: [image],
    },
  };
}

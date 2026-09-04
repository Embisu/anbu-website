import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { posts, blogCategories } from "@/content/posts";
import { siteUrl } from "@/lib/seo";
import { fetchSupabasePosts } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/services", "/work", "/about", "/blog", "/contact", "/privacy", "/terms"];
  const now = new Date();

  const supaPosts = await fetchSupabasePosts().catch(() => []);
  const allPosts = [...supaPosts];
  posts.forEach((p) => {
    if (!allPosts.some((ap) => ap.slug === p.slug)) {
      allPosts.push(p);
    }
  });

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${p}`,
        lastModified: now,
        changeFrequency: p === "" || p === "/blog" ? "weekly" : "monthly",
        priority: p === "" ? 1 : 0.7,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${p}`])),
            "x-default": `${siteUrl}/vi${p}`,
          },
        },
      });
    }
    for (const s of services) {
      const path = `/services/${s.slug}`;
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
            "x-default": `${siteUrl}/vi${path}`,
          },
        },
      });
    }
    for (const pr of projects) {
      const path = `/work/${pr.slug}`;
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
            "x-default": `${siteUrl}/vi${path}`,
          },
        },
      });
    }
    for (const po of allPosts) {
      const path = `/blog/${po.slug}`;
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(po.date),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
            "x-default": `${siteUrl}/vi${path}`,
          },
        },
      });
    }
    for (const category of blogCategories) {
      const path = `/blog/category/${category.slug}`;
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
            "x-default": `${siteUrl}/vi${path}`,
          },
        },
      });
    }
  }

  return entries;
}

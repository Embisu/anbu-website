"use client";

import React, { useEffect, useState } from "react";
import type { Post } from "@/content/posts";
import { categoryForPost } from "@/content/posts";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { PostCard } from "@/components/cards";
import Reveal from "@/components/Reveal";

import { MOJIBAKE } from "@/lib/postIntegrity";
export default function ClientBlogList({
  initialPosts,
  locale,
  dict,
  categorySlug,
  excludeSlug,
}: {
  initialPosts: Post[];
  locale: Locale;
  dict: Dictionary;
  categorySlug?: string;
  excludeSlug?: string;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    let isMounted = true;

    const getDeletedSlugs = (): string[] => {
      try {
        const saved = localStorage.getItem("anbu_deleted_slugs");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    };

    const isCorrupted = (p: Post) => {
      const title = p.title?.vi || "";
      const slug = p.slug || "";
      return MOJIBAKE.test(title) || MOJIBAKE.test(slug);
    };

    const filterPosts = (arr: Post[]) => {
      let filtered = categorySlug ? arr.filter((p) => categoryForPost(p) === categorySlug) : arr;
      if (excludeSlug) {
        filtered = filtered.filter((p) => p.slug !== excludeSlug);
      }
      return filtered;
    };

    const syncBlogList = () => {
      if (!isMounted) return;
      const deletedSlugs = getDeletedSlugs();

      // Merge posts saved locally by the admin on this browser (not yet
      // picked up by the static build) with the server-rendered initialPosts,
      // honoring deletions and filtering out corrupted entries.
      let custom: Post[] = [];
      try {
        const saved = localStorage.getItem("anbu_custom_posts");
        if (saved) {
          const parsed: Post[] = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            custom = parsed.filter((p) => !isCorrupted(p) && !deletedSlugs.includes(p.slug));
            if (custom.length !== parsed.length) {
              localStorage.setItem("anbu_custom_posts", JSON.stringify(custom));
            }
          }
        }
      } catch (e) {}

      const merged = [...custom];
      initialPosts.forEach((ip) => {
        if (!merged.some((mp) => mp.slug === ip.slug) && !deletedSlugs.includes(ip.slug) && !isCorrupted(ip)) {
          merged.push(ip);
        }
      });
      setPosts(filterPosts(merged));
    };

    syncBlogList();

    const handleUpdateEvent = () => syncBlogList();
    window.addEventListener("anbu_posts_updated", handleUpdateEvent);
    window.addEventListener("storage", handleUpdateEvent);

    return () => {
      isMounted = false;
      window.removeEventListener("anbu_posts_updated", handleUpdateEvent);
      window.removeEventListener("storage", handleUpdateEvent);
    };
  }, [initialPosts, categorySlug]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <Reveal key={post.slug} delay={(i % 3) * 70}>
          <PostCard post={post} locale={locale} readLabel={dict.blogSection.read} readTimeLabel={dict.blogSection.readTime} />
        </Reveal>
      ))}
    </div>
  );
}

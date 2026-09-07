"use client";

import React, { useEffect, useState } from "react";
import type { Post } from "@/content/posts";
import { categoryForPost } from "@/content/posts";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { PostCard } from "@/components/cards";
import Reveal from "@/components/Reveal";
import { fetchSupabasePosts } from "@/lib/supabase";

export default function ClientBlogList({
  initialPosts,
  locale,
  dict,
  categorySlug,
}: {
  initialPosts: Post[];
  locale: Locale;
  dict: Dictionary;
  categorySlug?: string;
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
      return /[\u00C0-\u00FF]{2,}|ThÃ|trÃ|ViÃ/.test(title) || /[\u00C0-\u00FF]{2,}|ThÃ|trÃ|ViÃ/.test(slug);
    };

    const syncBlogList = () => {
      const deletedSlugs = getDeletedSlugs();

      // 1. Instant check & clean localStorage
      try {
        const saved = localStorage.getItem("anbu_custom_posts");
        if (saved) {
          const custom: Post[] = JSON.parse(saved);
          if (Array.isArray(custom)) {
            const cleaned = custom.filter((p) => !isCorrupted(p) && !deletedSlugs.includes(p.slug));
            if (cleaned.length !== custom.length) {
              localStorage.setItem("anbu_custom_posts", JSON.stringify(cleaned));
            }
            if (cleaned.length > 0) {
              const merged = [...cleaned];
              initialPosts.forEach((ip) => {
                if (!merged.some((mp) => mp.slug === ip.slug) && !deletedSlugs.includes(ip.slug)) {
                  merged.push(ip);
                }
              });
              const filtered = categorySlug
                ? merged.filter((p) => categoryForPost(p) === categorySlug)
                : merged;
              setPosts(filtered);
            }
          }
        }
      } catch (e) {}

      // 2. Fetch from Supabase for all visitors globally
      fetchSupabasePosts()
        .then((supaPosts) => {
          if (!isMounted) return;
          const currentDeleted = getDeletedSlugs();
          const activeSupa = (supaPosts || []).filter((p) => !isCorrupted(p) && !currentDeleted.includes(p.slug));
          const merged = [...activeSupa];
          initialPosts.forEach((ip) => {
            if (!merged.some((mp) => mp.slug === ip.slug) && !currentDeleted.includes(ip.slug) && !isCorrupted(ip)) {
              merged.push(ip);
            }
          });
          const filtered = categorySlug
            ? merged.filter((p) => categoryForPost(p) === categorySlug)
            : merged;
          setPosts(filtered);
        })
        .catch(() => {});
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

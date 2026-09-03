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

    // 1. Instant check localStorage
    try {
      const saved = localStorage.getItem("anbu_custom_posts");
      if (saved) {
        const custom: Post[] = JSON.parse(saved);
        if (Array.isArray(custom) && custom.length > 0) {
          const merged = [...custom];
          initialPosts.forEach((ip) => {
            if (!merged.some((mp) => mp.slug === ip.slug)) {
              merged.push(ip);
            }
          });
          const filtered = categorySlug
            ? merged.filter((p) => categoryForPost(p) === categorySlug)
            : merged;
          setPosts(filtered);
        }
      }
    } catch (e) {}

    // 2. Fetch from Supabase for all visitors globally
    fetchSupabasePosts()
      .then((supaPosts) => {
        if (!isMounted) return;
        if (supaPosts && supaPosts.length > 0) {
          const merged = [...supaPosts];
          initialPosts.forEach((ip) => {
            if (!merged.some((mp) => mp.slug === ip.slug)) {
              merged.push(ip);
            }
          });
          const filtered = categorySlug
            ? merged.filter((p) => categoryForPost(p) === categorySlug)
            : merged;
          setPosts(filtered);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
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

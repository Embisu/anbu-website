"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Post, Block } from "@/content/posts";
import { posts as defaultPosts } from "@/content/posts";
import { t } from "@/content/site";
import { localePath, formatDate } from "@/lib/utils";
import Icon from "./Icon";
import CTASection from "./CTASection";
import EditorialMedia, { editorialImageForPostData } from "./EditorialMedia";
import { fetchSupabasePostBySlug } from "@/lib/supabase";
import JsonLd from "./JsonLd";
import { siteUrl, breadcrumbLd, articleLd } from "@/lib/seo";

export default function ClientCustomPostViewer({
  slug,
  locale,
  dict,
}: {
  slug: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try to find in localStorage (anbu_custom_posts or all posts saved by admin)
    try {
      const saved = localStorage.getItem("anbu_custom_posts");
      if (saved) {
        const customPosts: Post[] = JSON.parse(saved);
        const match = customPosts.find((p) => p.slug === slug);
        if (match) {
          setPost(match);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Query both API and Supabase directly for 100% reliability
    Promise.allSettled([
      fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`).then((res) => (res.ok ? res.json() : null)),
      fetchSupabasePostBySlug(slug),
    ])
      .then(([apiRes, supaRes]) => {
        if (apiRes.status === "fulfilled" && apiRes.value?.ok && apiRes.value?.post) {
          setPost(apiRes.value.post);
        } else if (supaRes.status === "fulfilled" && supaRes.value) {
          setPost(supaRes.value);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-x py-24 text-center">
        <div className="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-navy-500">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-x py-24 text-center">
        <span className="text-5xl font-extrabold text-orange-500">404</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-navy-800 sm:text-3xl">
          {locale === "vi" ? "Không tìm thấy bài viết" : "Post Not Found"}
        </h1>
        <p className="mt-2 text-sm text-navy-500">
          {locale === "vi"
            ? "Bài viết này chưa được xuất bản hoặc đường dẫn không chính xác."
            : "This post has not been published or the URL is invalid."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={localePath(locale, "/blog")} className="btn-primary">
            {dict.blogSection.back}
          </Link>
          <Link href={localePath(locale, "/admin")} className="btn-ghost">
            Trang Quản trị (Admin)
          </Link>
        </div>
      </div>
    );
  }

  const toc = post.body
    .map((block, index) => (block.type === "h2" ? { id: `section-${index}`, title: t(block.text, locale) } : null))
    .filter((item): item is { id: string; title: string } => item !== null);

  const related = defaultPosts.slice(0, 3);

  const breadcrumbs = breadcrumbLd(
    [
      { name: locale === "vi" ? "Trang chủ" : "Home", path: "/" },
      { name: locale === "vi" ? "Kiến thức" : "Blog", path: "/blog" },
      { name: t(post.title, locale), path: `/blog/${post.slug}` },
    ],
    locale
  );

  const articleSchema = articleLd({
    title: t(post.title, locale),
    description: t(post.excerpt, locale),
    date: post.date,
    author: post.author,
    image: `${siteUrl}${editorialImageForPostData(post)}`,
    url: `${siteUrl}/${locale}/blog/${post.slug}`,
  });

  return (
    <article>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={articleSchema} />
      {/* Admin Preview Badge */}
      <div className="border-b border-orange-200 bg-orange-50 px-4 py-2.5 text-center text-xs font-semibold text-orange-800">
        ✨ {locale === "vi" ? "Bài viết được xuất bản từ Trang Quản trị ANBU" : "Article published via ANBU Admin"}
        <span className="ml-2 font-mono text-[11px] text-orange-600">({post.slug})</span>
      </div>

      <header className={`relative overflow-hidden bg-gradient-to-br ${post.color || "from-navy-900 to-orange-600"} text-white`}>
        <EditorialMedia
          src={editorialImageForPostData(post)}
          alt={t(post.title, locale)}
          className="pointer-events-none absolute inset-0 opacity-45"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-navy-900/35" />
        <div className="container-x relative py-10 sm:py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Link href={localePath(locale, "/blog")} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/80 hover:text-white">
              <Icon name="arrow" className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-180" />
              {dict.blogSection.back}
            </Link>
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80">
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                {t(post.category, locale)}
              </span>
              <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              <span>·</span>
              <span>{post.readingTime} {dict.blogSection.readTime}</span>
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-white/75">
              {locale === "vi" ? "Biên soạn bởi" : "Written by"} {post.author}
            </p>
            <h1 className="text-balance mt-4 sm:mt-5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
              {t(post.title, locale)}
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-white/90">{t(post.excerpt, locale)}</p>
          </div>
        </div>
      </header>

      <div className="container-x py-8 sm:py-14 md:py-16">
        <div className="mx-auto grid max-w-[1320px] items-start gap-8 xl:grid-cols-[220px_minmax(0,768px)_220px]">
          {/* Left Sidebar on XL screens */}
          <aside className="sticky top-28 hidden xl:block">
            <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                {locale === "vi" ? "Đang đọc" : "You are reading"}
              </p>
              <p className="mt-3 text-sm font-bold leading-relaxed text-navy-800">{t(post.category, locale)}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-navy-50">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
              </div>
              <dl className="mt-5 space-y-3 border-t border-navy-100 pt-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-navy-400">{locale === "vi" ? "Thời gian" : "Read time"}</dt>
                  <dd className="font-semibold text-navy-700">{post.readingTime} {dict.blogSection.readTime}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-navy-400">{locale === "vi" ? "Biên soạn" : "Author"}</dt>
                  <dd className="font-semibold text-navy-700">{post.author}</dd>
                </div>
              </dl>
            </div>
          </aside>

          {/* Main Article Content */}
          <div className="min-w-0">
            {toc.length > 1 && (
              <details className="group mb-8 sm:mb-10 rounded-2xl sm:rounded-3xl border border-navy-100 bg-cloud p-4 sm:p-6" open>
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base sm:text-lg font-bold text-navy-800 select-none">
                  <span>{locale === "vi" ? "Nội dung chính" : "In this article"}</span>
                  <span className="text-xs sm:text-sm font-semibold text-orange-600 transition-transform duration-200 group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <ol className="mt-3 sm:mt-4 space-y-2 border-t border-navy-100/70 pt-3">
                  {toc.map((item, index) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="flex gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium leading-relaxed text-navy-600 hover:text-orange-600">
                        <span className="text-orange-500 font-bold">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="space-y-6">
              {post.body.map((block, i) => {
                if (block.type === "h2") {
                  return (
                    <h2 key={i} id={`section-${i}`} className="scroll-mt-20 sm:scroll-mt-24 mt-7 sm:mt-10 font-display text-xl sm:text-2xl font-bold text-navy-800">
                      {t(block.text, locale)}
                    </h2>
                  );
                }
                if (block.type === "p") {
                  return (
                    <p key={i} className="mt-3.5 sm:mt-5 text-base sm:text-lg leading-relaxed text-navy-600 whitespace-pre-line">
                      {t(block.text, locale)}
                    </p>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote key={i} className="my-6 sm:my-8 rounded-2xl border-l-4 border-orange-500 bg-cloud p-4 sm:p-6 text-base sm:text-lg font-medium italic text-navy-700">
                      {t(block.text, locale)}
                    </blockquote>
                  );
                }
                if (block.type === "ul") {
                  return (
                    <ul key={i} className="mt-3.5 sm:mt-5 space-y-2 sm:space-y-2.5">
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2.5 sm:gap-3 text-base sm:text-lg leading-relaxed text-navy-600">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                          <span>{t(item, locale)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "image") {
                  return (
                    <figure key={i} className="my-6 sm:my-8 overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100/80 bg-slate-900/[0.02] shadow-sm">
                      <div className="flex w-full items-center justify-center bg-slate-50/80 p-1 sm:p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={block.src}
                          alt={t(block.alt, locale)}
                          className="h-auto max-h-[500px] sm:max-h-[640px] w-full rounded-xl sm:rounded-2xl object-contain md:max-h-[720px]"
                          loading="lazy"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="border-t border-navy-100/60 bg-white px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm leading-relaxed text-navy-600">
                          {t(block.caption, locale)}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                return null;
              })}
            </div>

            <aside className="mt-12 rounded-3xl bg-navy-900 p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                {locale === "vi" ? "Trao đổi cùng ANBU" : "Talk to ANBU"}
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold">
                {locale === "vi" ? "Bạn đang chuẩn bị một chiến dịch tương tự?" : "Planning a similar campaign?"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {locale === "vi"
                  ? "Chia sẻ mục tiêu, thị trường và ngân sách dự kiến. Đội ngũ ANBU sẽ đề xuất hướng triển khai phù hợp."
                  : "Share your goal, market and expected budget. The ANBU team will recommend a practical direction."}
              </p>
              <Link href={localePath(locale, "/contact")} className="btn-primary mt-5">
                {locale === "vi" ? "Nhận tư vấn chiến dịch" : "Get campaign advice"}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </aside>
          </div>

          {/* Right Sidebar on XL screens */}
          <aside className="sticky top-28 hidden xl:block">
            <div className="overflow-hidden rounded-3xl bg-navy-900 p-5 text-white shadow-lg">
              <span className="inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-300">
                Publisher Search
              </span>
              <h3 className="mt-3 font-display text-base font-bold leading-snug">
                {locale === "vi" ? "Tra cứu nhà phát hành & thị trường" : "Find game publishers in Vietnam"}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/75">
                {locale === "vi"
                  ? "Xem dữ liệu đối tác, kênh marketing và năng lực phát hành tại Việt Nam."
                  : "Explore verified partner data, channels and publishing capabilities."}
              </p>
              <Link
                href={localePath(locale, "/contact")}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300"
              >
                {locale === "vi" ? "Kết nối đối tác" : "Connect with partners"} →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <CTASection locale={locale} dict={dict} />
    </article>
  );
}

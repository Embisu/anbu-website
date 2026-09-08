"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Post, Block, L10n } from "@/content/posts";
import { posts as defaultPosts } from "@/content/posts";
import { t } from "@/content/site";
import { localePath, formatDate } from "@/lib/utils";
import Icon from "./Icon";
import CTASection from "./CTASection";
import EditorialMedia, { editorialImageForPostData } from "./EditorialMedia";
import { fetchSupabasePostBySlug } from "@/lib/supabase";
import JsonLd from "./JsonLd";
import { siteUrl, breadcrumbLd, articleLd } from "@/lib/seo";
import PostComments from "./PostComments";
import { renderRichText } from "@/lib/renderRichText";

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
    // Check if explicitly marked deleted
    try {
      const savedDeleted = localStorage.getItem("anbu_deleted_slugs");
      if (savedDeleted) {
        const deletedArr: string[] = JSON.parse(savedDeleted);
        if (deletedArr.includes(slug)) {
          setPost(null);
          setLoading(false);
          return;
        }
      }
    } catch (e) {}

    // 1. Try to find in localStorage (anbu_custom_posts or all posts saved by admin)
    try {
      const saved = localStorage.getItem("anbu_custom_posts");
      if (saved) {
        const customPosts: Post[] = JSON.parse(saved);
        const match = customPosts.find((p) => p.slug === slug);
        if (match) {
          const hasMojibake =
            /[\u00C0-\u00FF]{2,}|ThÃ|trÃ|ViÃ/.test(match.title?.vi || "") ||
            /[\u00C0-\u00FF]{2,}|ThÃ|trÃ|ViÃ/.test(match.slug || "");
          if (!hasMojibake) {
            setPost(match);
            setLoading(false);
            return;
          }
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
        } else {
          setPost(null);
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

  const faqBlocks = post.body.filter((b) => b.type === "faq") as Array<{
    type: "faq";
    items: { question: L10n; answer: L10n }[];
  }>;
  const allFaqItems = faqBlocks.flatMap((b) => b.items);
  const faqSchema =
    allFaqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: allFaqItems.map((item) => ({
            "@type": "Question",
            name: t(item.question, locale),
            acceptedAnswer: {
              "@type": "Answer",
              text: t(item.answer, locale),
            },
          })),
        }
      : null;

  return (
    <article>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      {/* Bilingual Translation Notice for English Readers */}
      {locale === "en" && (!post.title.en?.trim() || post.title.en === post.title.vi) && (
        <div className="border-b border-blue-200 bg-blue-50 px-4 py-2 text-center text-xs text-blue-900 flex flex-wrap items-center justify-center gap-2">
          <span>🇻🇳 This article is currently available in Vietnamese.</span>
          <Link href={`/vi/blog/${post.slug}`} className="font-bold underline text-blue-700 hover:text-blue-900">
            Đọc bản gốc Tiếng Việt
          </Link>
          <span>·</span>
          <a
            href={`https://translate.google.com/translate?sl=vi&tl=en&u=${encodeURIComponent(`${siteUrl}/vi/blog/${post.slug}`)}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold underline text-blue-700 hover:text-blue-900"
          >
            Translate with Google ↗
          </a>
        </div>
      )}

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
                      {renderRichText(t(block.text, locale))}
                    </h2>
                  );
                }
                if (block.type === "p") {
                  return (
                    <p key={i} className="mt-3.5 sm:mt-5 text-base sm:text-lg leading-relaxed text-navy-600 whitespace-pre-line">
                      {renderRichText(t(block.text, locale))}
                    </p>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote key={i} className="my-6 sm:my-8 rounded-2xl border-l-4 border-orange-500 bg-cloud p-4 sm:p-6 text-base sm:text-lg font-medium italic text-navy-700 whitespace-pre-line">
                      {renderRichText(t(block.text, locale))}
                    </blockquote>
                  );
                }
                if (block.type === "ul") {
                  return (
                    <ul key={i} className="mt-3.5 sm:mt-5 space-y-2 sm:space-y-2.5">
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2.5 sm:gap-3 text-base sm:text-lg leading-relaxed text-navy-600">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                          <span>{renderRichText(t(item, locale))}</span>
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
                if (block.type === "callout") {
                  const variant = block.variant || "info";
                  const styles = {
                    tip: { bg: "bg-emerald-50/80 border-emerald-500 text-emerald-950", icon: "💡", badge: locale === "vi" ? "Mẹo chiến lược" : "Pro Tip" },
                    warning: { bg: "bg-amber-50/80 border-amber-500 text-amber-950", icon: "⚠️", badge: locale === "vi" ? "Lưu ý quan trọng" : "Important Note" },
                    info: { bg: "bg-blue-50/80 border-blue-500 text-blue-950", icon: "ℹ️", badge: locale === "vi" ? "Thông tin hữu ích" : "Key Insight" },
                  }[variant];
                  return (
                    <aside key={i} className={`my-6 sm:my-8 rounded-2xl border-l-4 p-4 sm:p-6 shadow-xs ${styles.bg}`}>
                      <div className="flex items-center gap-2 mb-2 font-display text-xs sm:text-sm font-bold uppercase tracking-wider">
                        <span>{styles.icon}</span>
                        <span>{block.title ? t(block.title, locale) : styles.badge}</span>
                      </div>
                      <div className="text-base sm:text-lg leading-relaxed whitespace-pre-line">
                        {renderRichText(t(block.text, locale))}
                      </div>
                    </aside>
                  );
                }
                if (block.type === "table") {
                  return (
                    <div key={i} className="my-6 sm:my-8 overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100/80 bg-white shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-xs sm:text-sm text-navy-700 divide-y divide-navy-100">
                          {block.headers && block.headers.length > 0 && (
                            <thead className="bg-navy-50/80 text-navy-900 font-bold font-display">
                              <tr>
                                {block.headers.map((h, hIdx) => (
                                  <th key={hIdx} className="px-4 py-3 sm:px-5 sm:py-3.5 whitespace-nowrap">
                                    {renderRichText(t(h, locale))}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody className="divide-y divide-navy-100/60 bg-white">
                            {block.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="even:bg-cloud/30 hover:bg-navy-50/40 transition">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-4 py-3 sm:px-5 sm:py-3.5 leading-relaxed">
                                    {renderRichText(t(cell, locale))}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {block.caption && (
                        <div className="border-t border-navy-100/60 bg-slate-50 px-4 py-2 text-center text-[11px] sm:text-xs italic text-navy-500">
                          {t(block.caption, locale)}
                        </div>
                      )}
                    </div>
                  );
                }
                if (block.type === "h3") {
                  return (
                    <h3 key={i} id={`section-${i}`} className="scroll-mt-20 sm:scroll-mt-24 mt-6 sm:mt-8 font-display text-lg sm:text-xl font-bold text-navy-800 border-l-3 border-orange-400 pl-3">
                      {renderRichText(t(block.text, locale))}
                    </h3>
                  );
                }
                if (block.type === "ol") {
                  return (
                    <ol key={i} className="mt-3.5 sm:mt-5 space-y-2 sm:space-y-2.5 list-decimal list-inside text-base sm:text-lg leading-relaxed text-navy-600 pl-1">
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="pl-1">
                          <span>{renderRichText(t(item, locale))}</span>
                        </li>
                      ))}
                    </ol>
                  );
                }
                if (block.type === "divider") {
                  return <hr key={i} className="my-8 sm:my-12 border-t-2 border-dashed border-navy-100" />;
                }
                if (block.type === "faq") {
                  return (
                    <div key={i} className="my-8 sm:my-10 space-y-3 rounded-2xl border border-navy-100/80 bg-slate-50/60 p-5 sm:p-7 shadow-xs">
                      <div className="flex items-center gap-2 mb-4 font-display text-base sm:text-lg font-bold text-navy-900">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 text-sm">❓</span>
                        <span>{locale === "vi" ? "Câu hỏi thường gặp (FAQ)" : "Frequently Asked Questions (FAQ)"}</span>
                      </div>
                      <div className="space-y-3">
                        {block.items.map((it, idx) => (
                          <details key={idx} className="group rounded-xl border border-navy-100/80 bg-white p-4 shadow-xs transition hover:border-orange-300 open:bg-orange-50/20 open:border-orange-300">
                            <summary className="cursor-pointer font-display font-bold text-navy-900 list-none flex items-center justify-between gap-3 text-sm sm:text-base select-none">
                              <span>{renderRichText(t(it.question, locale))}</span>
                              <span className="shrink-0 transition-transform duration-200 group-open:rotate-180 text-orange-500 font-mono text-sm">▼</span>
                            </summary>
                            <div className="mt-3 pt-3 border-t border-navy-100/50 text-sm sm:text-base leading-relaxed text-navy-600 whitespace-pre-line">
                              {renderRichText(t(it.answer, locale))}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
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

            {/* Reader Comments & Discussion */}
            <PostComments postSlug={post.slug} locale={locale} />
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

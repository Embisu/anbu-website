import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { posts, blogCategories } from "@/content/posts";
import { buildMetadata } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { PostCard } from "@/components/cards";
import Link from "next/link";
import { localePath } from "@/lib/utils";
import EditorialMedia, { editorialImageForPostData } from "@/components/EditorialMedia";
import { site, t } from "@/content/site";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const isVi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/blog",
    title: isVi ? "Kiến thức Marketing, KOL/KOC, Game & SEO" : "Marketing, KOL/KOC, Game & SEO Insights",
    description: isVi
      ? "Kiến thức và xu hướng mới nhất về thương hiệu, marketing, SEO và công nghệ từ đội ngũ ANBU."
      : "The latest knowledge and trends on branding, marketing, SEO and technology from the ANBU team.",
  });
}

import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, siteUrl } from "@/lib/seo";

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const sorted = [...posts].sort((a, b) => {
    const featuredSlug = "lich-su-qua-trinh-phat-trien-esports-viet-nam";
    if (a.slug === featuredSlug) return -1;
    if (b.slug === featuredSlug) return 1;
    return +new Date(b.date) - +new Date(a.date);
  });

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: locale === "vi" ? "Kiến thức Marketing & Game của ANBU" : "ANBU Marketing & Game Insights",
    url: `${siteUrl}/${locale}/blog`,
    description: locale === "vi" ? "Kho tri thức và cẩm nang phân tích chuyên sâu về thị trường game, TikTok, Influencer Marketing và SEO từ ANBU." : "In-depth insights, benchmarks, and strategies on mobile gaming, TikTok, influencer marketing, and SEO from ANBU.",
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
      logo: `${siteUrl}/logo/logo.png`,
    },
  };

  const breadcrumbs = breadcrumbLd(
    [
      { name: locale === "vi" ? "Trang chủ" : "Home", path: "/" },
      { name: locale === "vi" ? "Kiến thức chuyên sâu" : "Insights & Blog", path: "/blog" },
    ],
    locale
  );

  return (
    <>
      <JsonLd data={blogLd} />
      <JsonLd data={breadcrumbs} />
      <PageHero eyebrow={dict.blogSection.eyebrow} title={dict.blogSection.title} subtitle={dict.blogSection.subtitle} />
      <section className="container-x pt-10"><div className="flex flex-wrap gap-3">{blogCategories.map((category) => <Link key={category.slug} href={localePath(locale, `/blog/category/${category.slug}`)} className="rounded-full border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 transition hover:border-orange-400 hover:text-orange-600">{locale === "vi" ? category.vi : category.en}</Link>)}</div></section>
      {sorted[0] && (
        <section className="container-x pt-16 sm:pt-20">
          <Reveal>
            <Link href={localePath(locale, `/blog/${sorted[0].slug}`)} className="group grid overflow-hidden rounded-3xl bg-navy-900 lg:grid-cols-2">
              <div className="relative min-h-72 overflow-hidden">
                <EditorialMedia src={editorialImageForPostData(sorted[0])} alt={t(sorted[0].title, locale)} className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900/20" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">{locale === "vi" ? "Bài đọc nổi bật" : "Featured insight"}</span>
                <h2 className="text-balance mt-4 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">{t(sorted[0].title, locale)}</h2>
                <p className="mt-4 leading-relaxed text-navy-100">{t(sorted[0].excerpt, locale)}</p>
                <span className="mt-7 inline-flex items-center gap-2 font-semibold text-white group-hover:text-orange-300">{dict.blogSection.read} →</span>
              </div>
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-5 border-b border-navy-100 pb-12 md:grid-cols-3">
            {[
              [locale === "vi" ? "Có khung tư duy" : "Built on frameworks", locale === "vi" ? "Mỗi bài giúp bạn hiểu cách ra quyết định, không chỉ tổng hợp xu hướng." : "Each article helps you make decisions, not merely follow trends."],
              [locale === "vi" ? "Có thể áp dụng" : "Made to apply", locale === "vi" ? "Checklist, câu hỏi và mô hình được viết để đội ngũ có thể dùng ngay." : "Checklists, questions and models your team can use immediately."],
              [locale === "vi" ? "Từ kinh nghiệm triển khai" : "From execution", locale === "vi" ? "Góc nhìn bám sát những vấn đề thường gặp khi vận hành chiến dịch." : "Perspectives grounded in recurring campaign realities."],
            ].map(([title, body], index) => (
              <Reveal key={title} delay={index * 60}>
                <div className="flex gap-4">
                  <span className="font-display text-lg font-extrabold text-orange-500">0{index + 1}</span>
                  <div><h3 className="font-display font-bold text-navy-800">{title}</h3><p className="mt-2 text-sm leading-relaxed text-navy-500">{body}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}
      <section className="container-x py-16 sm:py-20">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div><span className="eyebrow">{locale === "vi" ? "Thư viện kiến thức" : "Insight library"}</span><h2 className="mt-3 font-display text-2xl font-bold text-navy-800">{locale === "vi" ? "Đọc theo bài toán bạn đang giải" : "Read for the problem you're solving"}</h2></div>
            <span className="hidden text-sm text-navy-400 sm:block">{posts.length} {locale === "vi" ? "bài chuyên sâu" : "in-depth articles"}</span>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.slice(1).map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 70}>
              <PostCard post={post} locale={locale} readLabel={dict.blogSection.read} readTimeLabel={dict.blogSection.readTime} />
            </Reveal>
          ))}
        </div>
      </section>
      <CTASection locale={locale} dict={dict} />
    </>
  );
}

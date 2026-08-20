import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogCategories, categoryForPost, posts } from "@/content/posts";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { t } from "@/content/site";
import { FeaturedPost, PostCard } from "@/components/cards";
import { getDictionary } from "@/i18n/dictionaries";
import PageHero from "@/components/PageHero";

export function generateStaticParams() {
  return ["vi", "en"].flatMap((locale) => blogCategories.map((category) => ({ locale, category: category.slug })));
}

export async function generateMetadata({ params }: { params: { locale: string; category: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const category = blogCategories.find((item) => item.slug === params.category);
  if (!category) return {};
  const name = locale === "vi" ? category.vi : category.en;
  return buildMetadata({ locale, path: `/blog/category/${category.slug}`, title: `${name} | ANBU`, description: locale === "vi" ? `Các bài viết chuyên sâu về ${name.toLowerCase()} từ ANBU.` : `In-depth ${name.toLowerCase()} insights from ANBU.` });
}

import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export default async function BlogCategoryPage({ params }: { params: { locale: string; category: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const category = blogCategories.find((item) => item.slug === params.category);
  if (!category) notFound();
  const dict = await getDictionary(locale);
  const categoryPosts = posts.filter((post) => categoryForPost(post) === params.category).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const name = locale === "vi" ? category.vi : category.en;
  const [featured, ...remainingPosts] = categoryPosts;

  const breadcrumbs = breadcrumbLd(
    [
      { name: locale === "vi" ? "Trang chủ" : "Home", path: "/" },
      { name: locale === "vi" ? "Kiến thức" : "Blog", path: "/blog" },
      { name, path: `/blog/category/${category.slug}` },
    ],
    locale
  );

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHero eyebrow={locale === "vi" ? "Chuyên mục" : "Category"} title={name} subtitle={locale === "vi" ? `Tuyển tập bài viết giúp đội ngũ game giải quyết bài toán ${name.toLowerCase()}.` : `Practical insights for teams solving ${name.toLowerCase()} challenges.`} />
      <section className="container-x py-16 sm:py-20">
        {featured && <FeaturedPost post={featured} locale={locale} label={locale === "vi" ? "Bài đọc nổi bật" : "Featured read"} readLabel={dict.blogSection.read} />}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{remainingPosts.map((post) => <PostCard key={post.slug} post={post} locale={locale} readLabel={dict.blogSection.read} readTimeLabel={dict.blogSection.readTime} />)}</div>
      </section>
    </>
  );
}

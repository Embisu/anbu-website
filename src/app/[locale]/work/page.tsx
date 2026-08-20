import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { projects } from "@/content/projects";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import WorkGrid from "@/components/WorkGrid";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const isVi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/work",
    title: isVi ? "Dự án Marketing Game, KOL/KOC & Thương hiệu" : "Game, KOL/KOC & Brand Marketing Work",
    description: isVi
      ? "Các dự án tiêu biểu của ANBU trong game, ứng dụng, influencer và thương hiệu — từ chiến lược đến triển khai đa thị trường."
      : "Selected ANBU work across games, apps, influencer and brand marketing — from strategy to multi-market execution.",
  });
}

import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export default async function WorkPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  const breadcrumbs = breadcrumbLd(
    [
      { name: locale === "vi" ? "Trang chủ" : "Home", path: "/" },
      { name: locale === "vi" ? "Dự án tiêu biểu" : "Case Studies", path: "/work" },
    ],
    locale
  );

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHero eyebrow={dict.workSection.eyebrow} title={dict.workSection.title} subtitle={dict.workSection.subtitle} />
      <section className="border-b border-navy-100 bg-cloud">
        <div className="container-x grid gap-8 py-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow">{locale === "vi" ? "Không chỉ là gallery" : "More than a gallery"}</span>
            <h2 className="text-balance mt-3 font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">
              {locale === "vi" ? "Mỗi dự án là một lựa chọn chiến lược" : "Every project is a strategic choice"}
            </h2>
          </Reveal>
          <Reveal delay={70} className="lg:col-span-7">
            <p className="leading-relaxed text-navy-500">
              {locale === "vi"
                ? "Chúng tôi trình bày portfolio theo bối cảnh, insight, vai trò của ANBU và cách triển khai — để bạn nhìn thấy tư duy phía sau hình ảnh. Với các dự án chưa có dữ liệu công khai được xác nhận, trang chỉ mô tả phạm vi công việc và không tự gán số liệu thành tích."
                : "Our portfolio explains the context, insight, ANBU's role and execution so you can see the thinking behind the visuals. Where verified public performance data is unavailable, we describe scope without assigning unsupported results."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[locale === "vi" ? "Ra mắt thị trường" : "Market launch", "KOL/KOC", "Social & Community", locale === "vi" ? "Bản địa hóa" : "Localization", "Integrated Marketing"].map((label) => (
                <span key={label} className="rounded-full border border-navy-100 bg-white px-3 py-1.5 text-xs font-semibold text-navy-600">{label}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="container-x py-16 sm:py-20">
        <WorkGrid projects={projects} locale={locale} view={dict.workSection.view} />
      </section>
      <CTASection locale={locale} dict={dict} />
    </>
  );
}

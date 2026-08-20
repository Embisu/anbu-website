import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site, t } from "@/content/site";
import { values } from "@/content/values";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import ClientWall from "@/components/ClientWall";
import TeamGrid from "@/components/TeamGrid";
import { MarkWatermark } from "@/components/Illustration";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const isVi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/about",
    title: isVi ? "Về ANBU" : "About ANBU",
    description: isVi
      ? "ANBU là đối tác tăng trưởng của bạn — kết hợp sáng tạo và dữ liệu để xây thương hiệu bền vững."
      : "ANBU is your growth partner — combining creativity and data to build durable brands.",
  });
}

import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, siteUrl } from "@/lib/seo";

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  const stats = [
    { value: site.stats.projects, label: dict.hero.stat1 },
    { value: site.stats.clients, label: dict.hero.stat2 },
    { value: site.stats.years, label: dict.hero.stat3 },
    { value: site.stats.markets, label: dict.hero.stat4 },
  ];

  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: locale === "vi" ? "Về ANBU" : "About ANBU",
    url: `${siteUrl}/${locale}/about`,
    description: locale === "vi" ? "ANBU là đối tác tăng trưởng của bạn — kết hợp sáng tạo và dữ liệu để xây thương hiệu bền vững." : "ANBU is your growth partner — combining creativity and data to build durable brands.",
    mainEntity: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
      logo: `${siteUrl}/logo/logo.png`,
    },
  };

  const breadcrumbs = breadcrumbLd(
    [
      { name: locale === "vi" ? "Trang chủ" : "Home", path: "/" },
      { name: locale === "vi" ? "Về chúng tôi" : "About Us", path: "/about" },
    ],
    locale
  );

  return (
    <>
      <JsonLd data={aboutLd} />
      <JsonLd data={breadcrumbs} />
      <PageHero eyebrow={dict.about.eyebrow} title={dict.about.title} subtitle={dict.about.lead} />

      {/* Stats */}
      <section className="container-x -mt-10 relative">
        <Reveal className="grid grid-cols-2 gap-4 rounded-3xl border border-navy-100 bg-white p-6 shadow-[0_24px_60px_-24px_rgba(1,47,135,0.22)] sm:grid-cols-4 sm:p-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-extrabold text-navy-700 sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-navy-500 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Story */}
      <section className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow">{dict.about.eyebrow}</span>
          <h2 className="text-balance mt-3 font-display text-3xl font-extrabold leading-tight text-navy-800 sm:text-4xl">
            {dict.about.storyTitle}
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-navy-600">
            <p>{dict.about.story1}</p>
            <p>{dict.about.story2}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Image src="/about-anbu-squad.png" alt={locale === "vi" ? "Minh họa đội ngũ ANBU đưa game vào thị trường Việt Nam" : "ANBU squad helping game brands enter Vietnam"} width={1536} height={1024} className="w-full rounded-3xl" />
        </Reveal>
      </section>

      {/* Founder's note */}
      <section className="container-x pb-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-navy-900 p-8 text-white sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
            <MarkWatermark className="-bottom-10 right-4 h-56 w-56 rotate-12" />
            <div className="relative">
              <span className="eyebrow">{dict.about.founderEyebrow}</span>
              <Icon name="quote" className="mt-4 h-10 w-10 text-orange-500" />
              <blockquote className="mt-4 max-w-3xl font-display text-xl font-semibold leading-relaxed sm:text-2xl">
                “{dict.about.founderNote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 font-display text-lg font-extrabold text-white">
                  PĐ
                </span>
                <span>
                  <span className="block font-display text-base font-bold text-white">{dict.about.founderName}</span>
                  <span className="block text-sm text-navy-200">{dict.about.founderRole}</span>
                </span>
              </figcaption>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="bg-cloud py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow={dict.about.eyebrow} title={dict.about.valuesTitle} center />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="h-full rounded-3xl border border-navy-100 bg-white p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                    <Icon name={v.icon as any} className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-800">{t(v.title, locale)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">{t(v.description, locale)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team — ANBU Squad */}
      <section className="container-x py-16 sm:py-20">
        <SectionHeading eyebrow={dict.about.squadEyebrow} title={dict.about.teamTitle} subtitle={dict.about.teamSubtitle} center />
        <Reveal className="mt-12">
          <TeamGrid />
        </Reveal>

        {/* Capabilities */}
        <Reveal className="mt-14">
          <div className="rounded-3xl border border-navy-100 bg-cloud p-7 sm:p-9">
            <h3 className="text-center font-display text-lg font-bold text-navy-800">{dict.about.expertiseTitle}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <div key={s.slug} className="flex items-center gap-2.5 rounded-2xl bg-white p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Icon name={s.icon as any} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-navy-700">{t(s.title, locale)}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <ClientWall locale={locale} dict={dict} max={20} />

      <CTASection locale={locale} dict={dict} />
    </>
  );
}

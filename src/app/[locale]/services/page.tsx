import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { services } from "@/content/services";
import { t, site } from "@/content/site";
import { processSteps } from "@/content/process";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { localePath } from "@/lib/utils";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import EditorialMedia, { editorialImageForService } from "@/components/EditorialMedia";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const isVi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/services",
    title: isVi ? "Dịch vụ Marketing, KOL/KOC, Game & Thương hiệu" : "Marketing, KOL/KOC, Game & Brand Services",
    description: isVi
      ? "Chiến lược thương hiệu, sáng tạo, marketing hiệu suất, SEO, phát triển web và social, mọi năng lực trong một đội ngũ."
      : "Brand strategy, creative, performance marketing, SEO, web development and social, every capability in one team.",
  });
}

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t(s.title, locale),
      url: `${siteUrl}/${locale}/services/${s.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListLd} />
      <PageHero
        eyebrow={dict.servicesSection.eyebrow}
        title={dict.servicesSection.title}
        subtitle={dict.servicesSection.subtitle}
      />

      <section className="container-x py-10 sm:py-16 lg:py-20">
        <div className="grid gap-6 sm:gap-8">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 60}>
              <div className="grid gap-5 sm:gap-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100/70 bg-white p-4 sm:p-7 lg:grid-cols-12 lg:p-8">
                <div className="relative h-44 sm:h-56 overflow-hidden rounded-xl sm:rounded-2xl bg-navy-900 lg:col-span-4 lg:h-full lg:min-h-72">
                  <EditorialMedia
                    src={editorialImageForService(service.slug)}
                    alt={t(service.title, locale)}
                    className="absolute inset-0 transition-transform duration-500 [@media(hover:hover)]:hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
                </div>
                <div className="lg:col-span-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <Icon name={service.icon as any} className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h2 className="text-balance mt-3.5 sm:mt-5 font-display text-xl sm:text-2xl font-extrabold text-navy-800">{t(service.title, locale)}</h2>
                  <p className="mt-1.5 sm:mt-2 font-medium text-orange-600 text-sm sm:text-base">{t(service.tagline, locale)}</p>
                  <p className="mt-2.5 sm:mt-4 text-sm leading-relaxed text-navy-500">{t(service.description, locale)}</p>
                  <Link
                    href={localePath(locale, `/services/${service.slug}`)}
                    className="mt-4 sm:mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-orange-600"
                  >
                    {dict.servicesSection.learnMore}
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
                <div className="lg:col-span-4">
                  <div className="grid gap-2.5 sm:gap-3">
                    {service.features.map((f, fi) => (
                      <div key={fi} className="flex items-start gap-2.5 rounded-xl sm:rounded-2xl bg-cloud p-3 sm:p-4">
                        <span className="mt-0.5 flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                          <Icon name="check" className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-navy-700">{t(f, locale)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process recap */}
      <section className="bg-cloud py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow={dict.process.eyebrow} title={dict.process.title} subtitle={dict.process.subtitle} center />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.no} delay={i * 80}>
                <div className="rounded-3xl border border-navy-100 bg-white p-6">
                  <span className="font-display text-4xl font-extrabold text-orange-500">{step.no}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-navy-800">{t(step.title, locale)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">{t(step.description, locale)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-16 sm:pt-20">
        <CTASection locale={locale} dict={dict} />
      </div>
    </>
  );
}

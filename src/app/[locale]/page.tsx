import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site, t } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { clients } from "@/content/clients";
import { posts } from "@/content/posts";
import { localePath } from "@/lib/utils";
import { buildMetadata, faqLd } from "@/lib/seo";
import { fetchSupabasePosts } from "@/lib/supabase";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import CountUp from "@/components/CountUp";
import WhyUs from "@/components/WhyUs";
import FaqAccordion from "@/components/FaqAccordion";
import { faqs } from "@/content/faq";
import ProjectMedia from "@/components/ProjectMedia";
import EditorialMedia, { editorialImageForService } from "@/components/EditorialMedia";
import VideoLightbox from "@/components/VideoLightbox";
import WorkGallery from "@/components/WorkGallery";
import { videoBySlug } from "@/content/media";
import { ServiceCard, ProjectCard, PostCard } from "@/components/cards";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const isVi = locale === "vi";
  return buildMetadata({
    locale,
    path: "",
    title: isVi
      ? "ANBU Agency | Biệt đội Community & Game Marketing tại Việt Nam"
      : "ANBU Agency | Community & Game Marketing Agency in Vietnam",
    description: isVi
      ? "ANBU Agency chuyên cung cấp giải pháp Marketing game, Community, KOL KOC và phát hành game tại Việt Nam và Đông Nam Á cho các đối tác quốc tế."
      : "ANBU Agency is a specialized game marketing and community agency helping global game publishers and brands launch in Vietnam and Southeast Asia.",
  });
}

// Real client logos for the hero marquee (subset keeps it light).
const marqueeLogos = clients.slice(0, 14);

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  const stats = [
    { value: site.stats.projects, label: dict.hero.stat1 },
    { value: site.stats.clients, label: dict.hero.stat2 },
    { value: site.stats.years, label: dict.hero.stat3 },
    { value: t(site.stats.markets, locale), label: dict.hero.stat4 },
  ];

  const supaPosts = await fetchSupabasePosts().catch(() => []);
  const allHomePosts = [...supaPosts];
  posts.forEach((p) => {
    if (!allHomePosts.some((ap) => ap.slug === p.slug)) {
      allHomePosts.push(p);
    }
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[32rem] w-[32rem] rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-96 w-96 rounded-full bg-navy-200/40 blur-3xl" />

        <div className="container-x relative grid items-center gap-8 py-10 sm:gap-12 sm:py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs sm:text-sm font-semibold text-orange-700">
                <span className="inline-flex h-2 w-2 rounded-full bg-orange-500" />
                {dict.hero.badge}
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="text-balance mt-4 sm:mt-6 font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-navy-800 sm:text-5xl lg:text-6xl">
                {dict.hero.titleLead} <span className="text-gradient">{dict.hero.titleHighlight}</span> {dict.hero.titleTail}
              </h1>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-3.5 sm:mt-6 max-w-xl text-base leading-relaxed text-navy-500 sm:text-lg">{dict.hero.subtitle}</p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-6 sm:mt-9 flex flex-wrap gap-2.5 sm:gap-3">
                <Link href={localePath(locale, "/contact")} className="btn-primary">
                  {dict.hero.ctaPrimary}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <Link href={localePath(locale, "/work")} className="btn-ghost">
                  {dict.hero.ctaSecondary}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-4 border-t border-navy-100/80 pt-6 sm:flex sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-5 sm:pt-8">
                {stats.map((s) => (
                  <div key={s.label} className="min-w-[110px]">
                    <CountUp
                      value={s.value}
                      className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy-800"
                    />
                    <div className="mt-1 text-xs font-medium text-navy-500 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120} className="relative">
              <div className="relative mx-auto max-w-md lg:mr-0">
                <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(circle_at_70%_30%,rgba(245,80,30,0.22),transparent_62%)]" />

                {/* Real campaign work */}
                <div className="relative space-y-4 sm:space-y-5">
                  {/* Featured work, plays the recap video inline */}
                  <VideoLightbox
                    url={videoBySlug["honkai-impact-3-birthday"]}
                    ariaLabel={dict.hero.watchRecap}
                    className="group block w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-left shadow-[0_24px_60px_-20px_rgba(1,47,135,0.4)] ring-1 ring-navy-100 sm:animate-float sm:ml-8"
                  >
                    <div className="relative aspect-video">
                      <ProjectMedia slug="honkai-impact-3-birthday" variant="game" alt="Honkai Impact 3" priority />
                      <div className="absolute inset-0 bg-navy-900/10 transition-colors group-hover:bg-navy-900/25" />
                      <span className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full bg-black/55 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                        {dict.hero.watchRecap}
                      </span>
                      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 sm:h-14 sm:w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 sm:h-6 sm:w-6 text-orange-600" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
                      <span className="leading-tight">
                        <span className="block font-display text-sm font-bold text-navy-800">Honkai Impact 3</span>
                        <span className="block text-xs text-navy-500">miHoYo · Game Marketing &amp; OOH</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold text-orange-600">
                        20M+ reach
                      </span>
                    </div>
                  </VideoLightbox>

                  {/* Second work on tablet/desktop */}
                  <div className="ml-auto hidden w-11/12 overflow-hidden rounded-3xl bg-white shadow-[0_34px_75px_-28px_rgba(1,47,135,0.5)] ring-1 ring-navy-100 sm:block sm:w-4/5 sm:-rotate-2">
                    <div className="aspect-video">
                      <ProjectMedia slug="shopee-beauty-club" variant="social" alt="Shopee Beauty Club" />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="leading-tight">
                        <span className="block font-display text-xs font-bold text-navy-800">Shopee Beauty Club</span>
                        <span className="block text-[10px] text-navy-500">E-commerce &amp; Social</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-600">
                        100M+ views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Client logos: unified responsive marquee, no DOM duplication */}
        <div className="border-y border-navy-100/70 bg-white/60 py-5 sm:py-6">
          <p className="container-x text-center text-xs font-semibold uppercase tracking-widest text-navy-400">
            {dict.logos.title}
          </p>

          <div className="group mask-fade-x mt-4 sm:mt-6 overflow-hidden flex">
            <div className="flex shrink-0 animate-marquee-slow items-center gap-8 sm:gap-12 pr-8 sm:pr-12 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
              {[...marqueeLogos, ...marqueeLogos].map((c, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${c.name}-${i}`}
                  src={c.file}
                  alt={i < marqueeLogos.length ? c.name : ""}
                  aria-hidden={i >= marqueeLogos.length || undefined}
                  loading="lazy"
                  className="h-6 sm:h-8 w-auto max-w-[95px] sm:max-w-[130px] shrink-0 object-contain opacity-85 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORK GALLERY, cinematic strip of real campaign visuals */}
      <div className="hidden sm:block">
        <WorkGallery locale={locale} />
      </div>

      {/* 1. FEATURED CASE STUDIES - immediate credibility and proof */}
      <section className="container-x py-10 sm:py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <SectionHeading eyebrow={dict.workSection.eyebrow} title={dict.workSection.title} subtitle={dict.workSection.subtitle} />
          <Reveal>
            <Link href={localePath(locale, "/work")} className="link-underline hidden text-sm sm:inline-block">
              {dict.workSection.all} →
            </Link>
          </Reveal>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, i) => (
            <Reveal key={project.slug} delay={i * 60}>
              <ProjectCard project={project} locale={locale} view={dict.workSection.view} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href={localePath(locale, "/work")} className="link-underline text-sm font-semibold">
            {dict.workSection.all} →
          </Link>
        </div>
      </section>

      {/* 2. SERVICES */}
      <section className="border-t border-navy-100 bg-cloud py-10 sm:py-20 lg:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <SectionHeading eyebrow={dict.servicesSection.eyebrow} title={dict.servicesSection.title} subtitle={dict.servicesSection.subtitle} />
            <Reveal>
              <Link href={localePath(locale, "/services")} className="link-underline hidden text-sm sm:inline-block">
                {dict.servicesSection.all} →
              </Link>
            </Reveal>
          </div>
          <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Featured (bento) tile */}
            <Reveal className="sm:col-span-2 lg:col-span-2">
              <Link
                href={localePath(locale, `/services/${services[0].slug}`)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_28px_70px_-24px_rgba(1,47,135,0.3)] md:flex-row"
              >
                <div className="relative h-40 overflow-hidden bg-orange-50 sm:h-44 md:h-auto md:w-1/2">
                  <EditorialMedia
                    src={editorialImageForService(services[0].slug)}
                    alt={t(services[0].title, locale)}
                    className="absolute inset-0 transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.03]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-950/20 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <div className="absolute left-3.5 top-3.5 sm:left-4 sm:top-4 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white/95 text-orange-600 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                    <Icon name={services[0].icon as any} className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center p-5 sm:p-7">
                  <span className="inline-flex w-fit rounded-full bg-orange-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold uppercase tracking-wide text-orange-600">
                    {dict.servicesSection.eyebrow}
                  </span>
                  <h3 className="mt-2.5 sm:mt-3 font-display text-xl sm:text-2xl font-extrabold text-navy-800">{t(services[0].title, locale)}</h3>
                  <p className="mt-1.5 sm:mt-2 font-medium text-orange-600 text-sm sm:text-base">{t(services[0].tagline, locale)}</p>
                  <p className="mt-2.5 sm:mt-3 text-sm leading-relaxed text-navy-500">{t(services[0].description, locale)}</p>
                  <span className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 transition-colors group-hover:text-orange-600">
                    {dict.servicesSection.learnMore}
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>

            {services.slice(1, 5).map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <ServiceCard service={service} locale={locale} learnMore={dict.servicesSection.learnMore} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href={localePath(locale, "/services")} className="link-underline text-sm font-semibold">
              {dict.servicesSection.all} →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHY US */}
      <WhyUs locale={locale} dict={dict} />

      {/* 4. BLOG & PERSPECTIVES */}
      <section className="container-x py-10 sm:py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <SectionHeading eyebrow={dict.blogSection.eyebrow} title={dict.blogSection.title} subtitle={dict.blogSection.subtitle} />
          <Reveal>
            <Link href={localePath(locale, "/blog")} className="link-underline hidden text-sm sm:inline-block">
              {dict.blogSection.all} →
            </Link>
          </Reveal>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 md:grid-cols-3">
          {allHomePosts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 60} className={i === 2 ? "max-sm:hidden" : ""}>
              <PostCard post={post} locale={locale} readLabel={dict.blogSection.read} readTimeLabel={dict.blogSection.readTime} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href={localePath(locale, "/blog")} className="link-underline text-sm font-semibold">
            {dict.blogSection.all} →
          </Link>
        </div>
      </section>

      {/* 5. FAQ - all 6 items rendered, in sync with JSON-LD schema */}
      <JsonLd data={faqLd(faqs.map((f) => ({ q: t(f.q, locale), a: t(f.a, locale) })))} />
      <section className="bg-cloud py-10 sm:py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} subtitle={dict.faq.subtitle} center />
          <div className="mx-auto mt-8 sm:mt-12 max-w-3xl">
            <FaqAccordion items={faqs.map((f) => ({ q: t(f.q, locale), a: t(f.a, locale) }))} />
          </div>
        </div>
      </section>

      {/* 6. CONVERSION CTA */}
      <CTASection locale={locale} dict={dict} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site, t } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { clients } from "@/content/clients";
import { posts } from "@/content/posts";
import { processSteps } from "@/content/process";
import { localePath } from "@/lib/utils";
import { buildMetadata, faqLd } from "@/lib/seo";
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
import { MarkWatermark } from "@/components/Illustration";
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
      ? "ANBU | Biệt đội Community và Marketing cho game"
      : "ANBU | Community and Game Marketing",
    description: isVi
      ? "ANBU giúp game, ứng dụng và thương hiệu quốc tế ra mắt tại Việt Nam bằng KOL KOC, social, cộng đồng, PR và paid media tích hợp."
      : "ANBU helps games, apps and international brands launch in Vietnam through integrated creators, social, community, PR and paid media.",
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
    { value: site.stats.markets, label: dict.hero.stat4 },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[32rem] w-[32rem] rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-96 w-96 rounded-full bg-navy-200/40 blur-3xl" />

        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700">
                <span className="inline-flex h-2 w-2 rounded-full bg-orange-500" />
                {dict.hero.badge}
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="text-balance mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-800 sm:text-5xl lg:text-6xl">
                {dict.hero.titleLead} <span className="text-gradient">{dict.hero.titleHighlight}</span> {dict.hero.titleTail}
              </h1>
            </Reveal>
            <Reveal delay={110}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-500">{dict.hero.subtitle}</p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-9 flex flex-wrap gap-3">
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
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-navy-100 pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <CountUp
                      value={s.value}
                      className="font-display text-2xl font-extrabold text-navy-800 sm:text-3xl"
                    />
                    <div className="mt-0.5 text-xs font-medium text-navy-500">{s.label}</div>
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
                <div className="relative space-y-5">
                  {/* Featured work — plays the recap video inline */}
                  <VideoLightbox
                    url={videoBySlug["honkai-impact-3-birthday"]}
                    ariaLabel={dict.hero.watchRecap}
                    className="group block w-full animate-float overflow-hidden rounded-3xl bg-white text-left shadow-[0_34px_75px_-28px_rgba(1,47,135,0.5)] ring-1 ring-navy-100 sm:ml-8"
                  >
                    <div className="relative aspect-video">
                      <ProjectMedia slug="honkai-impact-3-birthday" variant="game" alt="Honkai Impact 3" priority />
                      <div className="absolute inset-0 bg-navy-900/10 transition-colors group-hover:bg-navy-900/25" />
                      <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                        {dict.hero.watchRecap}
                      </span>
                      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 text-orange-600" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                      <span className="leading-tight">
                        <span className="block font-display text-sm font-bold text-navy-800">Honkai Impact 3</span>
                        <span className="block text-xs text-navy-500">miHoYo · Game Marketing &amp; OOH</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                        20M+ reach
                      </span>
                    </div>
                  </VideoLightbox>

                  {/* Second work — offset + tilted so the pair doesn't look uniform (static; only one card floats) */}
                  <div className="ml-auto w-11/12 overflow-hidden rounded-3xl bg-white shadow-[0_34px_75px_-28px_rgba(1,47,135,0.5)] ring-1 ring-navy-100 sm:w-4/5 sm:-rotate-2">
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

        {/* Client logos — static grid on mobile, slow pause-on-hover marquee on larger screens */}
        <div className="border-y border-navy-100/70 bg-white/60 py-6">
          <p className="container-x text-center text-xs font-semibold uppercase tracking-widest text-navy-400">
            {dict.logos.title}
          </p>

          {/* Mobile: calm static grid (no motion) */}
          <div className="container-x mt-6 grid grid-cols-3 items-center gap-x-6 gap-y-6 sm:hidden">
            {marqueeLogos.slice(0, 9).map((c, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={c.file}
                alt={c.name}
                loading="lazy"
                className="mx-auto h-7 w-auto max-w-[104px] object-contain opacity-90 grayscale"
              />
            ))}
          </div>

          {/* Tablet/desktop: slow marquee, pauses on hover or keyboard focus */}
          <div className="group mask-fade-x mt-6 hidden overflow-hidden sm:flex">
            <div className="flex shrink-0 animate-marquee-slow items-center gap-12 pr-12 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
              {[...marqueeLogos, ...marqueeLogos].map((c, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={c.file}
                  alt={i < marqueeLogos.length ? c.name : ""}
                  aria-hidden={i >= marqueeLogos.length || undefined}
                  loading="lazy"
                  className="h-8 w-auto max-w-[130px] shrink-0 object-contain opacity-90 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORK GALLERY — cinematic strip of real campaign visuals (hidden on mobile to keep the page calm/short) */}
      <div className="hidden sm:block">
        <WorkGallery locale={locale} />
      </div>

      {/* SERVICES */}
      <section className="container-x py-14 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={dict.servicesSection.eyebrow} title={dict.servicesSection.title} subtitle={dict.servicesSection.subtitle} />
          <Reveal>
            <Link href={localePath(locale, "/services")} className="link-underline hidden text-sm sm:inline-block">
              {dict.servicesSection.all} →
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Featured (bento) tile */}
          <Reveal className="sm:col-span-2 lg:col-span-2">
            <Link
              href={localePath(locale, `/services/${services[0].slug}`)}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_28px_70px_-24px_rgba(1,47,135,0.3)] md:flex-row"
            >
              <div className="relative h-44 overflow-hidden bg-orange-50 md:h-auto md:w-1/2">
                <EditorialMedia
                  src={editorialImageForService(services[0].slug)}
                  alt={t(services[0].title, locale)}
                  className="absolute inset-0 transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.03]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950/20 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-orange-600 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                  <Icon name={services[0].icon as any} className="h-6 w-6" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center p-7">
                <span className="inline-flex w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-600">
                  {dict.servicesSection.eyebrow}
                </span>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-navy-800">{t(services[0].title, locale)}</h3>
                <p className="mt-2 font-medium text-orange-600">{t(services[0].tagline, locale)}</p>
                <p className="mt-3 text-sm leading-relaxed text-navy-500">{t(services[0].description, locale)}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 transition-colors group-hover:text-orange-600">
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
        <div className="mt-10 text-center sm:hidden">
          <Link href={localePath(locale, "/services")} className="link-underline text-sm font-semibold">
            {dict.servicesSection.all} →
          </Link>
        </div>
      </section>

      {/* LAUNCH EXPERTISE */}
      <section className="border-y border-navy-100 bg-cloud py-14 sm:py-24">
        <div className="container-x grid items-start gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="eyebrow">{locale === "vi" ? "Thế mạnh cốt lõi" : "Core expertise"}</span>
            <h2 className="text-balance mt-4 font-display text-3xl font-extrabold leading-tight text-navy-800 sm:text-4xl">
              {locale === "vi" ? "Biến một ngày ra mắt thành đà tăng trưởng dài hơn" : "Turn launch day into longer-term momentum"}
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-navy-500">
              {locale === "vi"
                ? "ANBU đặc biệt phù hợp với các thương hiệu game, ứng dụng và sản phẩm quốc tế cần bước vào Việt Nam. Chúng tôi kết nối KOL/KOC, social, cộng đồng, báo chí và paid media thành một câu chuyện ra mắt thống nhất — thay vì những hạng mục rời rạc."
                : "ANBU is built for games, apps and international products entering Vietnam. We connect creators, social, community, press and paid media into one launch story instead of isolated activities."}
            </p>
            <Link href={localePath(locale, "/services/game-app-marketing")} className="btn-ghost mt-7">
              {locale === "vi" ? "Khám phá năng lực ra mắt" : "Explore launch marketing"}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {[
              {
                no: "01",
                title: locale === "vi" ? "Tìm lý do để thị trường quan tâm" : "Find the reason to care",
                body: locale === "vi" ? "Chắt lọc lợi thế sản phẩm thành một góc kể phù hợp văn hóa, hành vi và ngôn ngữ của người dùng Việt." : "Translate product strengths into a story grounded in Vietnamese culture, behavior and language.",
              },
              {
                no: "02",
                title: locale === "vi" ? "Giao đúng vai cho từng creator" : "Give every creator a job",
                body: locale === "vi" ? "Phân tầng KOL/KOC theo nhiệm vụ: tạo chú ý, giải thích trải nghiệm, xác nhận niềm tin hoặc kích hoạt cộng đồng." : "Layer creators by role: attract attention, explain the experience, build trust or activate communities.",
              },
              {
                no: "03",
                title: locale === "vi" ? "Dàn dựng nhịp chiến dịch" : "Engineer campaign rhythm",
                body: locale === "vi" ? "Kết nối teaser, reveal, launch và sustain để thương hiệu luôn có điều mới đáng nói trong từng giai đoạn." : "Connect teaser, reveal, launch and sustain so the brand always has something timely to say.",
              },
              {
                no: "04",
                title: locale === "vi" ? "Đọc tín hiệu và khuếch đại" : "Read signals and amplify",
                body: locale === "vi" ? "Theo dõi phản hồi nội dung và cộng đồng để điều chỉnh thông điệp, creator mix và nhịp phân phối." : "Use content and community signals to refine messages, creator mix and distribution cadence.",
              },
            ].map((item, index) => (
              <Reveal key={item.no} delay={index * 60}>
                <article className="h-full rounded-3xl border border-navy-100 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                  <span className="font-display text-sm font-extrabold text-orange-500">{item.no}</span>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-800">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-500">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <WhyUs locale={locale} dict={dict} />

      {/* PROCESS */}
      <section className="relative overflow-hidden bg-navy-900 py-14 sm:py-24">
        <MarkWatermark className="-right-16 top-10 h-80 w-80 rotate-12" />
        <div className="container-x relative">
          <SectionHeading eyebrow={dict.process.eyebrow} title={dict.process.title} subtitle={dict.process.subtitle} light />
          <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute left-8 right-8 top-[52px] z-0 hidden h-0.5 bg-gradient-to-r from-orange-500/0 via-navy-500 to-orange-500/0 lg:block" />
            {processSteps.map((step, i) => (
              <Reveal key={step.no} delay={i * 80}>
                <div className="group relative z-10 h-full rounded-3xl border border-white/10 bg-navy-800 p-6 transition-colors duration-300 hover:border-orange-500/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 font-display text-xl font-extrabold text-white shadow-[0_12px_28px_-8px_rgba(245,80,30,0.6)]">
                    {step.no}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">{t(step.title, locale)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-200">{t(step.description, locale)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section className="container-x py-14 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={dict.workSection.eyebrow} title={dict.workSection.title} subtitle={dict.workSection.subtitle} />
          <Reveal>
            <Link href={localePath(locale, "/work")} className="link-underline hidden text-sm sm:inline-block">
              {dict.workSection.all} →
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, i) => (
            <Reveal key={project.slug} delay={i * 60}>
              <ProjectCard project={project} locale={locale} view={dict.workSection.view} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center sm:hidden">
          <Link href={localePath(locale, "/work")} className="link-underline text-sm font-semibold">
            {dict.workSection.all} →
          </Link>
        </div>
      </section>

      {/* BLOG */}
      <section className="container-x py-14 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={dict.blogSection.eyebrow} title={dict.blogSection.title} subtitle={dict.blogSection.subtitle} />
          <Reveal>
            <Link href={localePath(locale, "/blog")} className="link-underline hidden text-sm sm:inline-block">
              {dict.blogSection.all} →
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 60} className={i === 2 ? "max-sm:hidden" : ""}>
              <PostCard post={post} locale={locale} readLabel={dict.blogSection.read} readTimeLabel={dict.blogSection.readTime} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <JsonLd data={faqLd(faqs.map((f) => ({ q: t(f.q, locale), a: t(f.a, locale) })))} />
      <section className="bg-cloud py-14 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} subtitle={dict.faq.subtitle} center />
          <div className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={faqs.slice(0, 4).map((f) => ({ q: t(f.q, locale), a: t(f.a, locale) }))} />
          </div>
        </div>
      </section>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}

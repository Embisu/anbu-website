import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { services, getService } from "@/content/services";
import { serviceNarrativeBySlug } from "@/content/serviceNarrative";
import { projects } from "@/content/projects";
import { t } from "@/content/site";
import { buildMetadata, siteUrl, breadcrumbLd } from "@/lib/seo";
import { localePath } from "@/lib/utils";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import EditorialMedia, { editorialImageForService } from "@/components/EditorialMedia";
import { ProjectCard } from "@/components/cards";

const serviceSeoMeta: Record<string, Partial<Record<Locale, { title: string; description: string }>>> = {
  "game-app-marketing": {
    vi: {
      title: "Agency Game Marketing & Launch Game Chuyên Nghiệp",
      description: "ANBU giúp studio game lập kế hoạch launch, user acquisition, KOL/KOC, PR và tối ưu CPI, ROAS tại Việt Nam và Đông Nam Á.",
    },
    en: {
      title: "Game Marketing Agency Vietnam & SEA",
      description: "Launch your game in Vietnam and Southeast Asia with ANBU's user acquisition, creator, PR, CPI and ROAS optimization strategy.",
    },
  },
  "influencer-marketing": {
    vi: {
      title: "Dịch vụ Booking KOL/KOC Game & Influencer Marketing",
      description: "Dịch vụ booking KOL, KOC và gaming influencer của ANBU giúp game tiếp cận đúng cộng đồng, tăng nhận diện, lượt cài đặt và chuyển đổi tại Việt Nam.",
    },
    en: {
      title: "Gaming Influencer & KOL Marketing Agency Vietnam",
      description: "Reach gaming audiences in Vietnam with ANBU's KOL, KOC and influencer campaigns built for awareness, installs and measurable conversions.",
    },
  },
  "esports-gaming-marketing-sea": {
    vi: {
      title: "Dịch Vụ Esports Marketing & Gaming Creator Đông Nam Á",
      description: "ANBU triển khai esports marketing và gaming creator campaigns tại Đông Nam Á, từ casting, livestream, launch PR đến community activation.",
    },
    en: {
      title: "Esports Marketing & Gaming Creator Agency in Southeast Asia",
      description: "Grow your game across Southeast Asia with esports marketing, gaming creators, launch PR and community activation from ANBU.",
    },
  },
  "brand-strategy": {
    vi: {
      title: "Dịch Vụ Brand Strategy Cho Game Và Thương Hiệu",
      description: "ANBU xây dựng chiến lược thương hiệu, định vị và thông điệp giúp game và doanh nghiệp nổi bật tại Việt Nam và Đông Nam Á.",
    },
    en: {
      title: "Brand Strategy Agency for Games and Brands",
      description: "Build a clear brand position, message and growth direction for games and consumer brands in Vietnam and Southeast Asia.",
    },
  },
  "creative-design": {
    vi: {
      title: "Dịch Vụ Creative Design Cho Game Và App",
      description: "ANBU phát triển concept, key visual và nội dung sáng tạo giúp game và app thu hút người chơi trong từng điểm chạm.",
    },
    en: {
      title: "Creative Design Agency for Games and Apps",
      description: "Create distinctive concepts, key visuals and campaign assets for games and apps entering Vietnam and Southeast Asia.",
    },
  },
  "performance-marketing": {
    vi: {
      title: "Dịch Vụ Performance Marketing Cho Game",
      description: "Tối ưu user acquisition, CPI, ROAS và chất lượng người chơi bằng chiến lược performance marketing theo dữ liệu.",
    },
    en: {
      title: "Performance Marketing Agency for Games",
      description: "Grow game installs and revenue with data-led user acquisition, CPI, ROAS and performance marketing across Southeast Asia.",
    },
  },
  "seo-content": {
    vi: {
      title: "Dịch Vụ SEO Content Cho Game Và Doanh Nghiệp",
      description: "ANBU xây dựng nội dung SEO chuyên sâu, topic cluster và internal link giúp thương hiệu tăng khả năng được tìm thấy trên Google.",
    },
    en: {
      title: "SEO Content Agency for Games and Businesses",
      description: "Build search visibility with strategic SEO content, topic clusters and internal linking for games and businesses.",
    },
  },
  "web-development": {
    vi: {
      title: "Dịch Vụ Web Development Cho Game Và App",
      description: "ANBU thiết kế và phát triển website nhanh, rõ ràng và tối ưu chuyển đổi cho game, app và thương hiệu quốc tế.",
    },
    en: {
      title: "Web Development Agency for Games and Apps",
      description: "Launch fast, conversion-focused websites for games, apps and international brands entering Vietnam and Southeast Asia.",
    },
  },
  "social-media": {
    vi: {
      title: "Dịch Vụ Social Media Marketing Cho Game",
      description: "Xây dựng nội dung, cộng đồng và lịch social media giúp game duy trì tương tác và tăng trưởng bền vững tại Việt Nam.",
    },
    en: {
      title: "Social Media Marketing Agency for Games",
      description: "Build an active gaming audience with social content, community management and channel strategy in Vietnam and Southeast Asia.",
    },
  },
};

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const service = getService(params.slug);
  if (!service) return {};
  const seo = serviceSeoMeta[service.slug]?.[locale];
  return buildMetadata({
    locale,
    path: `/services/${service.slug}`,
    title: seo?.title ?? t(service.title, locale),
    description: seo?.description ?? t(service.description, locale),
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const service = getService(params.slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const narrative = serviceNarrativeBySlug[service.slug];
  const relatedProjects = projects
    .filter((project) => project.services.some((item) => {
      const normalized = item.toLowerCase();
      if (service.slug === "influencer-marketing") return /influencer|kol|koc/.test(normalized);
      if (service.slug === "game-app-marketing") return /game|user acquisition|community/.test(normalized);
      if (service.slug === "esports-gaming-marketing-sea") return /influencer|kol|koc|game|esports|community/.test(normalized);
      if (service.slug === "brand-strategy") return /brand|strategy|position/.test(normalized);
      if (service.slug === "creative-design") return /creative|design|content/.test(normalized);
      if (service.slug === "performance-marketing") return /performance|acquisition|media/.test(normalized);
      if (service.slug === "social-media") return /social|community/.test(normalized);
      return false;
    }))
    .slice(0, 3);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t(service.title, locale),
    description: t(service.description, locale),
    provider: { "@type": "Organization", name: "ANBU", url: siteUrl },
    areaServed: ["VN", "TH", "PH", "ID", "MY", "SG"],
    url: `${siteUrl}/${locale}/services/${service.slug}`,
  };

  return (
    <>
      <JsonLd
        data={[
          serviceLd,
          breadcrumbLd(
            [
              { name: "ANBU", path: "" },
              { name: dict.nav.services, path: "/services" },
              { name: t(service.title, locale), path: `/services/${service.slug}` },
            ],
            locale
          ),
        ]}
      />

      <section className="relative overflow-hidden border-b border-navy-100/70 bg-cloud">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="relative h-60 w-80 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-600 to-orange-600 shadow-[0_30px_70px_-25px_rgba(1,47,135,0.5)]">
            <EditorialMedia
              src={editorialImageForService(service.slug)}
              alt={t(service.title, locale)}
              className="absolute inset-0"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/35 via-transparent to-orange-500/15" />
          </div>
        </div>
        <div className="container-x relative py-16 sm:py-20">
          <Reveal className="max-w-3xl lg:max-w-2xl">
            <nav className="mb-6 flex items-center gap-2 text-sm text-navy-400">
              <Link href={localePath(locale, "/services")} className="hover:text-orange-600">{dict.nav.services}</Link>
              <span>/</span>
              <span className="text-navy-600">{t(service.title, locale)}</span>
            </nav>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Icon name={service.icon as any} className="h-7 w-7" />
            </div>
            <h1 className="text-balance mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-navy-800 sm:text-5xl">
              {t(service.title, locale)}
            </h1>
            <p className="mt-4 text-lg font-medium text-orange-600">{t(service.tagline, locale)}</p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-500">{t(service.description, locale)}</p>
            <Link href={localePath(locale, "/contact")} className="btn-primary mt-8">
              {service.slug === "game-app-marketing"
                ? (locale === "vi" ? "Nhận tư vấn launch plan" : "Discuss your launch plan")
                : dict.nav.cta}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            {service.slug === "esports-gaming-marketing-sea" && (
              <Link href={localePath(locale, "/blog/game-launch-marketing-thailand")} className="mt-4 inline-flex text-sm font-semibold text-navy-700 hover:text-orange-600">
                {locale === "vi" ? "Đọc playbook ra mắt game tại Thái Lan →" : "Read the Thailand game launch playbook →"}
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-navy-800">
            {locale === "vi" ? "Chúng tôi làm gì" : "What we do"}
          </h2>
          <ul className="mt-6 space-y-3">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <span className="font-medium text-navy-700">{t(f, locale)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-2xl font-bold text-navy-800">
            {locale === "vi" ? "Bạn nhận được" : "What you get"}
          </h2>
          <div className="mt-6 space-y-3">
            {service.deliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-navy-900 p-5 text-white">
                <span className="font-display text-xl font-extrabold text-orange-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semibold">{t(d, locale)}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {narrative && (
        <>
          <section className="border-y border-navy-100 bg-cloud py-16 sm:py-20">
            <div className="container-x grid gap-8 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <span className="eyebrow">{locale === "vi" ? "Khi nào nên chọn" : "When it fits"}</span>
                <h2 className="text-balance mt-4 font-display text-3xl font-extrabold text-navy-800">
                  {locale === "vi" ? `Dịch vụ này phù hợp nếu bạn đang…` : "This service fits when you are…"}
                </h2>
                <ul className="mt-7 space-y-4">
                  {narrative.fitFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-navy-600">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">{index + 1}</span>
                      <span className="leading-relaxed">{t(item, locale)}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={80} className="lg:col-span-7">
                <div className="h-full rounded-3xl bg-navy-900 p-7 text-white sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                    {locale === "vi" ? "Những nút thắt chúng tôi thường giải quyết" : "Common problems we solve"}
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {narrative.problems.map((problem, index) => (
                      <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <span className="font-display text-2xl font-extrabold text-orange-500">0{index + 1}</span>
                        <p className="mt-3 text-sm leading-relaxed text-navy-100">{t(problem, locale)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="container-x py-16 sm:py-24">
            <Reveal className="max-w-3xl">
              <span className="eyebrow">{locale === "vi" ? "Phương pháp ANBU" : "The ANBU method"}</span>
              <h2 className="text-balance mt-4 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
                {locale === "vi" ? "Từ một yêu cầu rời rạc đến hệ thống có thể vận hành" : "From a loose brief to an operating system"}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {narrative.method.map((step, index) => (
                <Reveal key={index} delay={index * 70}>
                  <article className="h-full rounded-3xl border border-navy-100 bg-white p-7 shadow-sm">
                    <span className="font-display text-5xl font-extrabold text-orange-100">0{index + 1}</span>
                    <h3 className="mt-4 font-display text-xl font-bold text-navy-800">{t(step.title, locale)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-500">{t(step.description, locale)}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <blockquote className="mt-8 rounded-3xl border-l-4 border-orange-500 bg-orange-50 px-7 py-6 font-display text-lg font-semibold leading-relaxed text-navy-800 sm:text-xl">
                “{t(narrative.promise, locale)}”
              </blockquote>
            </Reveal>
          </section>
        </>
      )}

      {relatedProjects.length > 0 && (
        <section className="bg-cloud py-16 sm:py-20">
          <div className="container-x">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">{locale === "vi" ? "Dự án liên quan" : "Related work"}</span>
                <h2 className="mt-3 font-display text-2xl font-bold text-navy-800 sm:text-3xl">
                  {locale === "vi" ? "Xem cách năng lực này đi vào thực tế" : "See this capability in action"}
                </h2>
              </div>
              <Link href={localePath(locale, "/work")} className="link-underline text-sm font-semibold">
                {dict.workSection.all} →
              </Link>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={locale} view={dict.workSection.view} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other services */}
      <section className="container-x py-16 sm:py-20">
        <h2 className="font-display text-2xl font-bold text-navy-800">
          {locale === "vi" ? "Dịch vụ khác" : "Other services"}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {others.map((s) => (
            <Link
              key={s.slug}
              href={localePath(locale, `/services/${s.slug}`)}
              className="card card-hover group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white">
                <Icon name={s.icon as any} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-800">{t(s.title, locale)}</h3>
              <p className="mt-2 text-sm text-navy-500">{t(s.tagline, locale)}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="pt-16 sm:pt-20">
        <CTASection locale={locale} dict={dict} />
      </div>
    </>
  );
}

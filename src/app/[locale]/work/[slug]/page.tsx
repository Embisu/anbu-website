import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { projects, getProject } from "@/content/projects";
import { approachBySlug } from "@/content/projectApproach";
import { projectNarrativeBySlug } from "@/content/projectNarrative";
import { videoBySlug } from "@/content/media";
import { getService } from "@/content/services";
import { t } from "@/content/site";
import { buildMetadata, siteUrl, breadcrumbLd } from "@/lib/seo";
import { localePath } from "@/lib/utils";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { variantForProject } from "@/components/Scene";
import { ProjectHeroMedia } from "@/components/ProjectMedia";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const project = getProject(params.slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: `/work/${project.slug}`,
    title: `${project.client} | ${t(project.title, locale)}`,
    description: t(project.cover, locale),
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const project = getProject(params.slug);
  if (!project) notFound();
  const narrative = projectNarrativeBySlug[project.slug];

  const caseLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: t(project.title, locale),
    about: project.client,
    url: `${siteUrl}/${locale}/work/${project.slug}`,
    ...(project.year ? { dateCreated: project.year } : {}),
    creator: { "@type": "Organization", name: "ANBU" },
  };

  return (
    <>
      <JsonLd
        data={[
          caseLd,
          breadcrumbLd(
            [
              { name: "ANBU", path: "" },
              { name: dict.nav.work, path: "/work" },
              { name: t(project.title, locale), path: `/work/${project.slug}` },
            ],
            locale
          ),
        ]}
      />

      <section className={`relative overflow-hidden bg-gradient-to-br ${project.color} text-white`}>
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <ProjectHeroMedia
          slug={project.slug}
          variant={variantForProject(project.services[0])}
              alt={`${project.client} | ${t(project.title, locale)}`}
          fit={project.fit}
        />
        <div className="container-x relative py-16 sm:py-24">
          <Reveal className="max-w-3xl">
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
              <Link href={localePath(locale, "/work")} className="hover:text-white">{dict.nav.work}</Link>
              <span>/</span>
              <span>{project.client}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider">
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">{t(project.category, locale)}</span>
              {project.year && (
                <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">{project.year}</span>
              )}
            </div>
            <h1 className="text-balance mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t(project.title, locale)}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">{t(project.cover, locale)}</p>
            {project.overview && (
              <p className="mt-5 max-w-2xl rounded-2xl border border-white/20 bg-black/15 px-4 py-3 text-sm leading-relaxed text-white/80 backdrop-blur-sm">
              {locale === "vi"
                  ? "Tổng quan năng lực dự án. Phạm vi chi tiết và số liệu đã xác minh được chia sẻ trong hồ sơ năng lực hoặc khi trao đổi trực tiếp."
                  : "Project capability overview. Detailed scope and verified performance data are shared in our credentials deck or during a direct consultation."}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Results */}
      <section className="container-x -mt-10 relative">
        <Reveal className="rounded-3xl border border-navy-100 bg-white p-6 shadow-[0_24px_60px_-24px_rgba(1,47,135,0.25)] sm:p-8">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-navy-400">
            {project.overview
              ? locale === "vi"
                ? "Hạng mục ANBU triển khai"
                : "ANBU campaign scope"
              : dict.workSection.result}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {project.results.map((r) => (
              <div key={`${r.value}-${t(r.label, locale)}`} className="text-center">
                <div className="font-display text-4xl font-extrabold text-orange-600">{r.value}</div>
                <div className="mt-1 text-sm font-medium text-navy-500">{t(r.label, locale)}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Recap video, embedded inline */}
      {videoBySlug[project.slug] && (
        <section className="container-x pt-16 sm:pt-20">
          <Reveal>
            <h2 className="eyebrow">{dict.workSection.recap}</h2>
            <div className="mt-4 overflow-hidden rounded-3xl bg-navy-900 shadow-[0_30px_70px_-30px_rgba(1,47,135,0.5)]">
              <div className="aspect-video">
                <iframe
                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                    videoBySlug[project.slug]
                  )}&show_text=false&width=1280`}
                  title={dict.workSection.recap}
                  className="h-full w-full"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <section className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-3">
        <Reveal className="lg:col-span-2 space-y-10">
          {project.context && (
            <div>
              <h2 className="eyebrow">{locale === "vi" ? "Bối cảnh dự án" : "Project context"}</h2>
              <p className="mt-3 text-lg leading-relaxed text-navy-600">{t(project.context, locale)}</p>
            </div>
          )}
          {narrative && (
            <div className="rounded-3xl border border-orange-100 bg-orange-50/60 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                {locale === "vi" ? "Insight định hướng" : "Guiding insight"}
              </p>
              <p className="mt-4 text-xl font-medium leading-relaxed text-navy-800">
                {t(narrative.insight, locale)}
              </p>
            </div>
          )}
          <div>
            <h2 className="eyebrow">{dict.workSection.challenge}</h2>
            <p className="mt-3 text-lg leading-relaxed text-navy-600">{t(project.challenge, locale)}</p>
          </div>
          <div>
            <h2 className="eyebrow">{dict.workSection.solution}</h2>
            <p className="mt-3 text-lg leading-relaxed text-navy-600">{t(project.solution, locale)}</p>
          </div>
          {approachBySlug[project.slug] && (
            <div>
              <h2 className="eyebrow">{dict.workSection.approach}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-navy-500">
                {locale === "vi"
                  ? "Từ insight đến thực thi, mỗi đầu việc được thiết kế để giải quyết một vai trò cụ thể trong hành trình ra mắt và tăng trưởng."
                  : "From insight to execution, every workstream was designed to play a specific role in the launch and growth journey."}
              </p>
              <ol className="mt-5 space-y-3">
                {approachBySlug[project.slug].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 font-display text-xs font-bold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-navy-700">{t(item, locale)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {narrative && (
            <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-7 text-white sm:p-9">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-500/20 blur-2xl" />
              <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                {locale === "vi" ? "Điều đọng lại" : "The lasting idea"}
              </p>
              <p className="relative mt-4 text-xl font-medium leading-relaxed text-white/90">
                {t(narrative.takeaway, locale)}
              </p>
            </div>
          )}
        </Reveal>

        <Reveal delay={100}>
          <div className="rounded-3xl border border-navy-100 bg-cloud p-7">
            <h3 className="font-display text-lg font-bold text-navy-800">{dict.workSection.services}</h3>
            <ul className="mt-4 space-y-2">
              {project.services.map((slug) => {
                const s = getService(slug);
                if (!s) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={localePath(locale, `/services/${slug}`)}
                      className="flex items-center gap-2.5 rounded-2xl bg-white p-3 text-sm font-semibold text-navy-700 transition-colors hover:text-orange-600"
                    >
                      <Icon name={s.icon as any} className="h-5 w-5 text-orange-500" />
                      {t(s.title, locale)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </section>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}

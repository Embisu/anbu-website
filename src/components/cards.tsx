import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { t } from "@/content/site";
import type { Service } from "@/content/services";
import type { Project } from "@/content/projects";
import type { Post } from "@/content/posts";
import { localePath, formatDate } from "@/lib/utils";
import Icon from "./Icon";
import { variantForProject, gradientForServiceIcon } from "./Scene";
import ProjectMedia from "./ProjectMedia";
import EditorialMedia, { editorialImageForPostData, editorialImageForService } from "./EditorialMedia";

export function ServiceCard({
  service,
  locale,
  learnMore,
}: {
  service: Service;
  locale: Locale;
  learnMore: string;
}) {
  return (
    <Link
      href={localePath(locale, `/services/${service.slug}`)}
      className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_60px_-20px_rgba(1,47,135,0.25)]"
    >
      <div className={`relative h-32 sm:h-36 overflow-hidden bg-gradient-to-br ${gradientForServiceIcon(service.icon)}`}>
        <EditorialMedia
          src={editorialImageForService(service.slug)}
          alt={t(service.title, locale)}
          className="absolute inset-0 transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/55 via-navy-900/15 to-transparent" />
        {/* shine sweep on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <div className="absolute left-3.5 top-3.5 sm:left-4 sm:top-4 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white/95 text-orange-600 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          <Icon name={service.icon as any} className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-lg sm:text-xl font-bold text-navy-800">{t(service.title, locale)}</h3>
        <p className="mt-1.5 sm:mt-2 flex-1 text-sm leading-relaxed text-navy-500">{t(service.tagline, locale)}</p>
        <span className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 transition-colors group-hover:text-orange-600">
          {learnMore}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function ProjectCard({
  project,
  locale,
  view,
}: {
  project: Project;
  locale: Locale;
  view: string;
}) {
  return (
    <Link
      href={localePath(locale, `/work/${project.slug}`)}
      className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(1,47,135,0.28)]"
    >
      <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${project.color}`}>
        <div className="absolute inset-0 bg-grid opacity-20" />
        <ProjectMedia
          slug={project.slug}
          variant={variantForProject(project.services[0])}
          alt={`${project.client}, ${t(project.title, locale)}`}
          focal={project.focal}
          fit={project.fit}
          className="absolute inset-0 opacity-95 transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs backdrop-blur-sm">{t(project.category, locale)}</span>
            {project.year && <span>{project.year}</span>}
          </div>
          <p className="font-display text-xl sm:text-2xl font-extrabold leading-tight drop-shadow-md">{project.client}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-base sm:text-lg font-bold text-navy-800">{t(project.title, locale)}</h3>
        <p className="mt-1.5 sm:mt-2 flex-1 text-sm leading-relaxed text-navy-500">{t(project.cover, locale)}</p>
        <span className="mt-3.5 sm:mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
          {view}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function PostCard({
  post,
  locale,
  readLabel,
  readTimeLabel,
}: {
  post: Post;
  locale: Locale;
  readLabel: string;
  readTimeLabel: string;
}) {
  return (
    <Link
      href={localePath(locale, `/blog/${post.slug}`)}
      className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(1,47,135,0.22)]"
    >
      <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${post.color}`}>
        <EditorialMedia
          src={editorialImageForPostData(post)}
          alt={t(post.title, locale)}
          className="absolute inset-0 transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-navy-950/10" />
        <span className="absolute left-3.5 top-3.5 sm:left-5 sm:top-5 z-10 rounded-full bg-white/90 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-navy-700 backdrop-blur-sm">
          {t(post.category, locale)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-navy-400">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <span>·</span>
          <span>{post.readingTime} {readTimeLabel}</span>
        </div>
        <h3 className="mt-2.5 sm:mt-3 font-display text-base sm:text-lg font-bold leading-snug text-navy-800 group-hover:text-orange-600 line-clamp-2">
          {t(post.title, locale)}
        </h3>
        <p className="mt-1.5 sm:mt-2 flex-1 text-sm leading-relaxed text-navy-500 line-clamp-3">{t(post.excerpt, locale)}</p>
        <span className="mt-3.5 sm:mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 group-hover:text-orange-600">
          {readLabel}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function FeaturedPost({
  post,
  locale,
  label,
  readLabel,
}: {
  post: Post;
  locale: Locale;
  label: string;
  readLabel: string;
}) {
  return (
    <Link
      href={localePath(locale, `/blog/${post.slug}`)}
      className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-navy-950 text-white shadow-[0_24px_70px_-28px_rgba(1,23,70,0.6)] transition-all duration-300 hover:shadow-[0_32px_90px_-20px_rgba(1,23,70,0.85)] sm:min-h-[480px] sm:rounded-[2rem] lg:min-h-[520px]"
    >
      {/* Background Poster Image */}
      <div className="absolute inset-0 overflow-hidden">
        <EditorialMedia
          src={editorialImageForPostData(post)}
          alt={t(post.title, locale)}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 [@media(hover:hover)]:group-hover:scale-[1.03]"
          priority
        />
        {/* Gradient Overlay for crystal clear readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-950/25 sm:from-navy-950 sm:via-navy-950/65 sm:to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-3xl space-y-3 p-6 sm:space-y-4 sm:p-10 lg:p-14">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <span className="rounded-full bg-orange-500/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-md">
            {label}
          </span>
          <span className="text-xs font-semibold text-white/80 drop-shadow-sm">
            {t(post.category, locale)}
            {post.readingTime ? ` • ${post.readingTime} ${locale === "vi" ? "phút đọc" : "min read"}` : ""}
          </span>
        </div>

        <h2 className="font-display text-2xl font-extrabold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] transition-colors group-hover:text-orange-200 sm:text-3xl lg:text-4xl">
          {t(post.title, locale)}
        </h2>

        <p className="line-clamp-2 max-w-2xl text-sm font-normal leading-relaxed text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] sm:line-clamp-3 sm:text-base">
          {t(post.excerpt, locale)}
        </p>

        <div className="pt-1 sm:pt-2">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 drop-shadow-sm transition-colors group-hover:text-orange-300 sm:text-base">
            {readLabel}
            <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

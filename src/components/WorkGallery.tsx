import type { Locale } from "@/i18n/config";
import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import { t } from "@/content/site";
import { localePath } from "@/lib/utils";
import ProjectMedia from "./ProjectMedia";
import { variantForProject } from "./Scene";

function Card({ p, locale, clone = false }: { p: Project; locale: Locale; clone?: boolean }) {
  return (
    <Link
      href={localePath(locale, `/work/${p.slug}`)}
      aria-hidden={clone || undefined}
      tabIndex={clone ? -1 : undefined}
      className="group relative aspect-video w-[280px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:w-[400px]"
    >
      <ProjectMedia
        slug={p.slug}
        variant={variantForProject(p.services[0])}
        alt={`${p.client} — ${t(p.title, locale)}`}
        focal={p.focal}
        fit={p.fit}
        className="absolute inset-0 transition-transform duration-700 [@media(hover:hover)]:group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent opacity-90 transition-opacity group-hover:opacity-70" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <span className="leading-tight">
          <span className="block font-display text-sm font-bold text-white drop-shadow">{p.client}</span>
          <span className="block text-[11px] text-white/70">{t(p.category, locale)}</span>
        </span>
        <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          {p.results[0].value}
        </span>
      </div>
    </Link>
  );
}

function Row({ items, locale, anim }: { items: Project[]; locale: Locale; anim: string }) {
  const loop = [...items, ...items];
  return (
    <div className="mask-fade-x flex">
      <div
        className={`flex shrink-0 gap-4 pr-4 ${anim} group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]`}
      >
        {loop.map((p, i) => (
          <Card key={`${p.slug}-${i}`} p={p} locale={locale} clone={i >= items.length} />
        ))}
      </div>
    </div>
  );
}

// Full-bleed, two rows of real campaign work scrolling in opposite directions.
export default function WorkGallery({ locale }: { locale: Locale }) {
  const featured = projects.slice(0, 12);
  const half = Math.ceil(featured.length / 2);
  const rowA = featured.slice(0, half);
  const rowB = featured.slice(half);

  return (
    <section className="group space-y-4 overflow-hidden bg-navy-900 py-6">
      <Row items={rowA} locale={locale} anim="animate-marquee-slow" />
      <Row items={rowB} locale={locale} anim="animate-marquee-rev" />
    </section>
  );
}

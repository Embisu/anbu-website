import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getService } from "@/content/services";
import { getProject } from "@/content/projects";
import { relationsForSlug } from "@/content/postRelations";
import { t } from "@/content/site";
import { localePath } from "@/lib/utils";

/** Contextual links from an article (outer content) to the services and case studies it is about (core content). */
export default function PostServiceLinks({ slug, locale }: { slug: string; locale: Locale }) {
  const vi = locale === "vi";
  const rel = relationsForSlug(slug);
  const services = rel.services.map((s) => getService(s)).filter(Boolean) as NonNullable<ReturnType<typeof getService>>[];
  const projects = rel.projects.map((p) => getProject(p)).filter(Boolean) as NonNullable<ReturnType<typeof getProject>>[];
  if (!services.length) return null;

  return (
    <section aria-labelledby="post-services-title" className="mt-12 rounded-3xl border border-navy-100 bg-white p-6 sm:p-8">
      <h2 id="post-services-title" className="font-display text-xl font-bold text-navy-800">
        {vi ? "ANBU hỗ trợ gì cho chủ đề này" : "How ANBU can help with this topic"}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <li key={s.slug} className="rounded-2xl bg-cloud p-5">
            <Link href={localePath(locale, `/services/${s.slug}`)} className="font-display text-base font-bold text-navy-800 hover:text-orange-600">
              {t(s.title, locale)}
            </Link>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{t(s.tagline, locale)}</p>
          </li>
        ))}
      </ul>
      {projects.length > 0 && (
        <p className="mt-5 text-sm leading-relaxed text-navy-500">
          {vi ? "Xem cách làm trong thực tế: " : "See it in practice: "}
          {projects.map((p, i) => (
            <span key={p.slug}>
              {i > 0 && " · "}
              <Link href={localePath(locale, `/work/${p.slug}`)} className="font-semibold text-orange-600 hover:underline">
                {p.client} ({t(p.category, locale)})
              </Link>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}

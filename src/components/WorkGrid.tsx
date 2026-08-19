"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Project } from "@/content/projects";
import { ProjectCard } from "./cards";

type FilterKey = "all" | "game" | "influencer" | "social" | "brand" | "performance";

const filters: { key: FilterKey; vi: string; en: string }[] = [
  { key: "all", vi: "Tất cả", en: "All" },
  { key: "game", vi: "Game & App", en: "Game & App" },
  { key: "influencer", vi: "KOL/KOC", en: "KOL/KOC" },
  { key: "social", vi: "Social", en: "Social" },
  { key: "brand", vi: "Thương hiệu & Sáng tạo", en: "Brand & Creative" },
  { key: "performance", vi: "Performance", en: "Performance" },
];

function matches(project: Project, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "game") return project.services.includes("game-app-marketing");
  if (filter === "influencer") return project.services.includes("influencer-marketing");
  if (filter === "social") return project.services.includes("social-media");
  if (filter === "brand") {
    return project.services.some((service) => service === "brand-strategy" || service === "creative-design");
  }
  return project.services.includes("performance-marketing");
}

export default function WorkGrid({
  projects,
  locale,
  view,
}: {
  projects: Project[];
  locale: Locale;
  view: string;
}) {
  const [active, setActive] = useState<FilterKey>("all");
  const visible = projects.filter((project) => matches(project, active));
  const featuredSlugs = ["honkai-impact-3-birthday", "douluo-soul-master-duel", "nguyet-mong", "focallure", "shopee-beauty-club"];
  const featured = projects.filter((project) => featuredSlugs.includes(project.slug));
  const remaining = active === "all" ? visible.filter((project) => !featuredSlugs.includes(project.slug)) : visible;

  return (
    <>
      {active === "all" && (
        <section className="mb-14">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="eyebrow">{locale === "vi" ? "Case study chủ lực" : "Flagship case studies"}</span>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">
                {locale === "vi" ? "Những chiến dịch thể hiện rõ nhất cách ANBU làm việc" : "Campaigns that best represent how ANBU works"}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-navy-500">
              {locale === "vi" ? "Được chọn theo độ đa dạng ngành hàng, bài toán ra mắt và vai trò của KOL/KOC trong chiến dịch." : "Selected for their mix of categories, launch challenges and creator roles."}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} view={view} />)}
          </div>
        </section>
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-navy-800">{locale === "vi" ? "Khám phá toàn bộ dự án" : "Explore all work"}</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label={locale === "vi" ? "Lọc dự án" : "Filter work"}>
        {filters.map((filter) => {
          const selected = filter.key === active;
          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(filter.key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                selected
                  ? "border-navy-800 bg-navy-800 text-white"
                  : "border-navy-100 bg-white text-navy-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {filter[locale]}
            </button>
          );
        })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {locale === "vi" ? `${visible.length} dự án` : `${visible.length} projects`}
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {remaining.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} view={view} />
        ))}
      </div>
    </>
  );
}

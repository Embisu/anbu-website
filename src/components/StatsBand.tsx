import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import SectionHeading from "./SectionHeading";
import Icon from "./Icon";
import { MarkWatermark } from "./Illustration";

export default function StatsBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  void locale;
  const stats = [
    { value: site.stats.projects, label: dict.hero.stat1, icon: "spark" as const },
    { value: site.stats.clients, label: dict.hero.stat2, icon: "heart" as const },
    { value: site.stats.years, label: dict.hero.stat3, icon: "shield" as const },
    { value: site.stats.markets, label: dict.hero.stat4, icon: "star" as const },
  ];

  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-navy-600/40 blur-3xl" />
      <MarkWatermark className="-left-16 top-1/2 h-80 w-80 -translate-y-1/2 -rotate-12" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow={dict.impact.eyebrow}
          title={dict.impact.title}
          subtitle={dict.impact.subtitle}
          center
          light
        />

        <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-navy-800/70 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
                <CountUp
                  value={s.value}
                  className="mt-5 block font-display text-4xl font-extrabold text-white sm:text-5xl"
                />
                <div className="mt-2 text-sm font-medium text-navy-100">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

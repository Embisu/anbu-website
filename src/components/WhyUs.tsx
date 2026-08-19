import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { t } from "@/content/site";
import { reasons } from "@/content/whyus";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Icon from "./Icon";

export default function WhyUs({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeading eyebrow={dict.whyus.eyebrow} title={dict.whyus.title} subtitle={dict.whyus.subtitle} center />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="group h-full rounded-3xl border border-navy-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_60px_-24px_rgba(1,47,135,0.22)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_12px_28px_-10px_rgba(245,80,30,0.6)]">
                <Icon name={r.icon as any} className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-navy-800">{t(r.title, locale)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{t(r.desc, locale)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

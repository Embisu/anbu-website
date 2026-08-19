import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site, t } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";

const budgetRangesByLocale = {
  vi: ["< 50 triệu", "50 – 150 triệu", "150 – 500 triệu", "> 500 triệu"],
  en: ["< 50M VND", "50 – 150M VND", "150 – 500M VND", "> 500M VND"],
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const isVi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/contact",
    title: isVi ? "Liên hệ tư vấn chiến dịch Marketing" : "Book a Marketing Campaign Consultation",
    description: isVi
      ? "Liên hệ ANBU để bắt đầu dự án của bạn. Chúng tôi phản hồi trong vòng 24 giờ làm việc."
      : "Contact ANBU to start your project. We reply within one business day.",
  });
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const c = dict.contact;

  const infos = [
    { icon: "pin" as const, label: c.office, value: t(site.address, locale), href: undefined },
    { icon: "mail" as const, label: c.email, value: site.email, href: `mailto:${site.email}` },
    { icon: "phone" as const, label: c.phone, value: site.phone, href: site.phoneHref },
    { icon: "clock" as const, label: c.hours, value: c.hoursValue, href: undefined },
  ];

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

      {/* Get started steps */}
      <section className="container-x pt-16 sm:pt-20">
        <div className="text-center">
          <span className="eyebrow">{dict.getStarted.eyebrow}</span>
          <h2 className="text-balance mt-3 font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">{dict.getStarted.title}</h2>
        </div>
        <div className="relative mt-10 grid gap-6 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-8 right-8 top-9 hidden h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-300 to-orange-500/0 sm:block" />
          {dict.getStarted.steps.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="relative h-full rounded-3xl border border-navy-100 bg-white p-6 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 font-display text-xl font-extrabold text-white shadow-[0_12px_28px_-8px_rgba(245,80,30,0.6)]">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 className="font-display text-2xl font-bold text-navy-800">{c.infoTitle}</h2>
          <div className="mt-6 space-y-4">
            {infos.map((info) => (
              <div key={info.label} className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Icon name={info.icon} className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-navy-400">{info.label}</div>
                  {info.href ? (
                    <a href={info.href} className="mt-1 block font-semibold text-navy-800 hover:text-orange-600">{info.value}</a>
                  ) : (
                    <div className="mt-1 font-semibold text-navy-800">{info.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="text-sm font-semibold text-navy-700">{c.followUs}</div>
            <div className="mt-3 flex gap-2.5">
              {Object.entries(site.social).map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ANBU on ${name.charAt(0).toUpperCase() + name.slice(1)}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 text-navy-600 transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <Icon name={name as any} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7">
          <div className="flex h-full flex-col justify-center rounded-3xl bg-navy-900 p-8 text-white shadow-[0_30px_70px_-30px_rgba(1,47,135,0.65)] sm:p-12">
            <span className="eyebrow w-fit bg-white/10 text-orange-300">{locale === "vi" ? "Trao đổi trực tiếp" : "Contact us directly"}</span>
            <h2 className="mt-5 text-balance font-display text-3xl font-extrabold sm:text-4xl">
              {locale === "vi" ? "Gửi brief trực tiếp cho ANBU" : "Send your brief directly to ANBU"}
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-navy-100">
              {locale === "vi"
                ? "Hãy gửi mục tiêu, thời gian dự kiến và phạm vi chiến dịch qua email. ANBU sẽ phản hồi để cùng bạn làm rõ bài toán và đề xuất hướng triển khai phù hợp."
                : "Email us your objectives, expected timeline and campaign scope. ANBU will reply to clarify the brief and recommend a suitable approach."}
            </p>
            <a href={`mailto:${site.email}`} className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-orange-500 px-6 py-3.5 font-display font-bold text-white transition hover:bg-orange-600">
              <Icon name="mail" className="h-5 w-5" />{site.email}
            </a>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a href={site.zalo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-4 py-2 font-semibold hover:border-white/50">Zalo</a>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-4 py-2 font-semibold hover:border-white/50">WhatsApp</a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

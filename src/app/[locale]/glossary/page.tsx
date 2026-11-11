import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { glossaryGroups, glossaryTermCount, type GlossaryTerm } from "@/content/glossary";
import { localizeBlogPath } from "@/content/blogSlugRedirects";
import { t } from "@/content/site";
import { buildMetadata, breadcrumbLd, siteUrl } from "@/lib/seo";
import { localePath } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const vi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/glossary",
    title: vi
      ? "Từ điển thuật ngữ Game Marketing: CPI, ROAS, KOL, KOC, LiveOps | ANBU"
      : "Game Marketing Glossary: CPI, ROAS, KOL, KOC, LiveOps | ANBU",
    description: vi
      ? `${glossaryTermCount} thuật ngữ game marketing giải thích ngắn gọn, từ chỉ số CPI, ROAS, retention đến KOL, KOC, seeding, LiveOps và giấy phép G1 tại Việt Nam.`
      : `${glossaryTermCount} game marketing terms in plain language, from CPI, ROAS and retention to KOL, KOC, seeding, LiveOps and Vietnam's G1 license.`,
  });
}

const termName = (term: GlossaryTerm, locale: Locale) => (typeof term.term === "string" ? term.term : t(term.term, locale));

export default async function GlossaryPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const vi = locale === "vi";

  const setUrl = `${siteUrl}/${locale}/glossary`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": `${setUrl}#set`,
      name: vi ? "Từ điển thuật ngữ Game Marketing" : "Game Marketing Glossary",
      url: setUrl,
      inLanguage: locale,
      publisher: { "@type": "Organization", name: "ANBU", url: siteUrl },
      hasDefinedTerm: glossaryGroups.flatMap((g) =>
        g.terms.map((term) => ({
          "@type": "DefinedTerm",
          "@id": `${setUrl}#${term.id}`,
          name: termName(term, locale),
          description: t(term.def, locale),
          url: `${setUrl}#${term.id}`,
          inDefinedTermSet: `${setUrl}#set`,
        }))
      ),
    },
    breadcrumbLd(
      [
        { name: vi ? "Trang chủ" : "Home", path: "/" },
        { name: vi ? "Từ điển thuật ngữ" : "Glossary", path: "/glossary" },
      ],
      locale
    ),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        eyebrow={vi ? "Từ điển" : "Glossary"}
        title={vi ? "Từ điển thuật ngữ Game Marketing" : "Game Marketing Glossary"}
        subtitle={
          vi
            ? "Giải thích ngắn gọn các thuật ngữ thường gặp khi ra mắt và vận hành game tại Việt Nam và Đông Nam Á, viết bằng ngôn ngữ dễ hiểu."
            : "Plain-language explanations of the terms you meet when launching and running games in Vietnam and Southeast Asia."
        }
      />

      <div className="container-x py-12 sm:py-16">
        <nav aria-label={vi ? "Nhóm thuật ngữ" : "Glossary groups"} className="flex flex-wrap gap-2">
          {glossaryGroups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-navy-100 bg-white px-4 py-2 text-sm font-semibold text-navy-700 transition-colors hover:border-orange-300 hover:text-orange-700"
            >
              {t(g.title, locale)}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-16">
          {glossaryGroups.map((group) => (
            <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-28">
              <Reveal>
                <h2 id={`${group.id}-title`} className="font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">
                  {t(group.title, locale)}
                </h2>
              </Reveal>
              <dl className="mt-6 grid gap-4 md:grid-cols-2">
                {group.terms.map((term) => (
                  <Reveal key={term.id}>
                    <div id={term.id} className="h-full scroll-mt-28 rounded-3xl border border-navy-100 bg-white p-6">
                      <dt>
                        <span className="font-display text-xl font-bold text-navy-800">{termName(term, locale)}</span>
                        {term.full && <span className="mt-1 block text-xs font-semibold text-orange-600">{t(term.full, locale)}</span>}
                      </dt>
                      <dd className="mt-3 text-sm leading-relaxed text-navy-500">
                        {t(term.def, locale)}
                        {(term.post || term.href) && (
                          <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                            {term.post && (
                              <Link
                                href={localizeBlogPath(localePath(locale, `/blog/${term.post}`))}
                                className="font-semibold text-orange-600 hover:underline"
                              >
                                {vi ? "Đọc thêm" : "Read more"}
                                <span className="sr-only"> {termName(term, locale)}</span> →
                              </Link>
                            )}
                            {term.href && (
                              <a
                                href={term.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-navy-600 hover:text-orange-600 hover:underline"
                              >
                                {vi ? "Văn bản gốc" : "Original text"} <span aria-hidden="true">↗</span>
                              </a>
                            )}
                          </span>
                        )}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <p className="mt-14 max-w-3xl text-xs leading-relaxed text-navy-400">
          {vi
            ? "Định nghĩa mang tính tổng quát theo cách dùng phổ biến trong ngành, không phải tư vấn pháp lý hay cam kết kết quả. Bạn thấy thuật ngữ nào còn thiếu? Hãy báo cho chúng tôi qua trang Liên hệ."
            : "Definitions are general industry usage, not legal advice or a promise of results. Missing a term? Let us know through the Contact page."}
        </p>
      </div>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}

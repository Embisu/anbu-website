import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site, t, type L10n } from "@/content/site";
import { buildMetadata, breadcrumbLd, siteUrl } from "@/lib/seo";
import { localePath } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";

const l = (vi: string, en: string): L10n => ({ vi, en });

const sections: { id: string; title: L10n; body: L10n[] }[] = [
  {
    id: "sources",
    title: l("Số liệu và nguồn", "Figures and sources"),
    body: [
      l(
        "Chúng tôi chỉ nêu số liệu khi có nguồn công khai hoặc do ANBU xác nhận. Mỗi bài viết liệt kê nguồn tham khảo ở cuối bài, kèm liên kết khi có.",
        "We only state figures that have a public source or that ANBU has confirmed. Each article lists its references at the end, with links where available."
      ),
      l(
        "Khi số liệu đến từ một báo cáo hoặc bài báo, chúng tôi ghi rõ đơn vị công bố và thời điểm của số liệu để bạn tự kiểm tra.",
        "When a figure comes from a report or news article, we name the publisher and the period it covers so you can check it yourself."
      ),
    ],
  },
  {
    id: "numbers",
    title: l("Cách ghi các con số", "How we label numbers"),
    body: [
      l(
        "Số liệu công khai được làm tròn xuống, không làm tròn lên. Lượt xem video là số của cả video, không chỉ phần nhắc tới game. Số liệu ghi “của game” mô tả sản phẩm, không phải kết quả riêng của ANBU.",
        "Public figures are rounded down, never up. Video views are whole-video counts, not just the part that features the game. Figures marked “game-level” describe the product, not ANBU's own results."
      ),
    ],
  },
  {
    id: "work",
    title: l("Dự án và kết quả", "Projects and results"),
    body: [
      l(
        "Dự án chưa có số liệu xác minh được sẽ được trình bày ở dạng tổng quan, không kèm con số kết quả. Hình ảnh key art và tên game thuộc về nhà phát hành.",
        "Projects without verified figures are shown as overviews, without result numbers. Key art and game names belong to their publishers."
      ),
    ],
  },
  {
    id: "opinion",
    title: l("Nhận định và khuyến nghị", "Analysis and recommendations"),
    body: [
      l(
        "Phần nhận định, khuyến nghị và quan điểm là đánh giá của đội ngũ ANBU, không phải số liệu từ nguồn bên ngoài và không phải cam kết về kết quả.",
        "Analysis, recommendations and opinions are the ANBU team's own view. They are not figures from an outside source and not a promise of results."
      ),
    ],
  },
  {
    id: "authors",
    title: l("Tác giả", "Authors"),
    body: [
      l(
        "Bài viết do đội ngũ ANBU biên soạn. Khi một bài do cá nhân hoặc cộng tác viên viết, tên tác giả được ghi ngay trên bài.",
        "Articles are written by the ANBU team. When an article is written by an individual or a contributor, the author's name appears on the article."
      ),
    ],
  },
  {
    id: "corrections",
    title: l("Cập nhật và chỉnh sửa", "Updates and corrections"),
    body: [
      l(
        "Khi phát hiện số liệu sai hoặc đã thay đổi, chúng tôi chỉnh lại nội dung và ghi ngày cập nhật trên bài. Nếu bạn thấy một lỗi hoặc một thông tin cần cập nhật, hãy báo cho chúng tôi qua trang Liên hệ hoặc email bên dưới.",
        "When we find a wrong or outdated figure, we correct the article and show the update date on it. If you spot an error or something that needs updating, tell us through the Contact page or the email below."
      ),
    ],
  },
];

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const vi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/editorial-policy",
    title: vi ? "Nguyên tắc biên tập: nguồn, số liệu và chỉnh sửa" : "Editorial policy: sources, figures and corrections",
    description: vi
      ? "Cách ANBU dùng nguồn và số liệu trong bài viết, cách ghi lượt xem và số liệu của game, ai là tác giả và cách báo lỗi để chúng tôi cập nhật."
      : "How ANBU uses sources and figures in its articles, how views and game-level numbers are labeled, who writes the articles and how to report an error.",
  });
}

export default async function EditorialPolicyPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const vi = locale === "vi";
  const url = `${siteUrl}/${locale}/editorial-policy`;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#page`,
      url,
      name: vi ? "Nguyên tắc biên tập" : "Editorial policy",
      inLanguage: locale,
      isPartOf: { "@id": `${siteUrl}/#website` },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    breadcrumbLd(
      [
        { name: vi ? "Trang chủ" : "Home", path: "/" },
        { name: vi ? "Nguyên tắc biên tập" : "Editorial policy", path: "/editorial-policy" },
      ],
      locale
    ),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        eyebrow={vi ? "Minh bạch" : "Transparency"}
        title={vi ? "Nguyên tắc biên tập của ANBU" : "ANBU's editorial policy"}
        subtitle={
          vi
            ? "Cách chúng tôi dùng nguồn, ghi số liệu, nhận trách nhiệm về nội dung và sửa lỗi khi cần."
            : "How we use sources, label figures, take responsibility for our content and fix mistakes."
        }
      />

      <div className="container-x max-w-3xl py-12 sm:py-16">
        <div className="space-y-10">
          {sections.map((s) => (
            <Reveal key={s.id}>
              <section id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-28">
                <h2 id={`${s.id}-title`} className="font-display text-2xl font-extrabold text-navy-800">
                  {t(s.title, locale)}
                </h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 leading-relaxed text-navy-600">
                    {t(p, locale)}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 text-sm text-navy-500">
          {vi ? "Báo lỗi hoặc đề nghị cập nhật: " : "Report an error or request an update: "}
          <a href={`mailto:${site.email}`} className="font-semibold text-orange-600 hover:underline">
            {site.email}
          </a>
          {" · "}
          <Link href={localePath(locale, "/contact")} className="font-semibold text-orange-600 hover:underline">
            {vi ? "Trang Liên hệ" : "Contact page"}
          </Link>
        </p>
      </div>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { processSteps } from "@/content/process";
import { t, type L10n } from "@/content/site";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { localePath } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";

const l = (vi: string, en: string): L10n => ({ vi, en });

const models: { title: L10n; fit: L10n; text: L10n; items: L10n[] }[] = [
  {
    title: l("Dự án theo giai đoạn", "Phased project"),
    fit: l("Phù hợp khi có mốc ra mắt rõ ràng", "Fits a clear launch date"),
    text: l(
      "Phạm vi cố định cho một chuỗi mốc như đăng ký trước, thử nghiệm và ra mắt. Mỗi giai đoạn có đầu việc, người phụ trách và chỉ số thống nhất từ trước.",
      "A fixed scope for a run of milestones such as pre-registration, beta and launch. Each phase has agreed tasks, owners and metrics up front."
    ),
    items: [
      l("Kế hoạch ra mắt và lịch nội dung", "Launch plan and content calendar"),
      l("Triển khai creator, PR và cộng đồng theo mốc", "Creator, PR and community delivery by milestone"),
      l("Báo cáo tổng kết kèm bài học", "Wrap-up report with learnings"),
    ],
  },
  {
    title: l("Đồng hành hằng tháng", "Monthly retainer"),
    fit: l("Phù hợp với game đang vận hành", "Fits a live game"),
    text: l(
      "Duy trì hiện diện liên tục sau ra mắt: quản lý cộng đồng, nội dung, làm việc với creator và phối hợp sự kiện LiveOps.",
      "Keeping a steady presence after launch: community management, content, creator work and LiveOps event coordination."
    ),
    items: [
      l("Vận hành fanpage, group và kênh cộng đồng", "Fanpage, group and community-channel operations"),
      l("Lịch nội dung và sự kiện theo tháng", "Monthly content and event calendar"),
      l("Báo cáo hằng tháng với chỉ số đã chốt", "Monthly report on agreed metrics"),
    ],
  },
  {
    title: l("Tư vấn gia nhập thị trường", "Market-entry advisory"),
    fit: l("Phù hợp khi chưa có đối tác tại Việt Nam", "Fits studios without a Vietnam partner"),
    text: l(
      "Đánh giá sản phẩm với thị trường, lập shortlist đối tác phát hành và vạch lộ trình ra mắt trước khi đổ ngân sách marketing.",
      "Assessing the product against the market, shortlisting publishing partners and mapping the launch route before marketing spend."
    ),
    items: [
      l("Bản đánh giá mức phù hợp thị trường", "Market-fit brief"),
      l("Shortlist đối tác và tiêu chí chọn", "Partner shortlist and selection criteria"),
      l("Lộ trình ra mắt sơ bộ", "Preliminary launch roadmap"),
    ],
  },
];

const timeline: { date: string; vi: string; en: string }[] = [
  {
    date: "25/03/2022",
    vi: "Mở đăng ký trước. Báo game đưa tin về combo quà đăng ký sớm.",
    en: "Pre-registration opens. Gaming press covers the early-sign-up gift combo.",
  },
  {
    date: "05/04/2022",
    vi: "Đăng ký trước cán mốc 300.000 (số liệu của game, theo XemGame).",
    en: "Pre-registration passes 300,000 (game-level figure, per XemGame).",
  },
  {
    date: "21/04/2022",
    vi: "Open Beta mở cửa, kèm giftcode cho người chơi.",
    en: "Open Beta opens, with giftcodes for players.",
  },
  {
    date: "25/04 – 01/05/2022",
    vi: "Bài hướng dẫn tân thủ và top đội hình giữ cuộc thảo luận sau Open Beta.",
    en: "Beginner-tips and top-lineup guides keep the conversation going after Open Beta.",
  },
];

const needs: L10n[] = [
  l("Bản chơi thử hoặc liên kết cửa hàng, cùng tài liệu mô tả game", "A playable build or store link, plus a game overview"),
  l("Thị trường mục tiêu và mục tiêu kinh doanh của đợt ra mắt", "Target markets and the business goals of the launch"),
  l("Tài sản thương hiệu (logo, key art) và quyền sử dụng", "Brand assets (logo, key art) and usage rights"),
  l("Người phê duyệt nội dung và đầu mối làm việc", "A content approver and a day-to-day contact"),
  l("Tình trạng giấy phép phát hành tại Việt Nam, nếu đã có", "Vietnam publishing-license status, if you already have it"),
];

const gets: L10n[] = [
  l("Đề xuất có phạm vi, mốc thời gian và chỉ số rõ ràng", "A proposal with scope, milestones and metrics"),
  l("Một đầu mối cho creator, PR, cộng đồng và nội dung", "One owner across creators, PR, community and content"),
  l("Cập nhật định kỳ và bảng theo dõi dùng chung", "Regular updates and a shared tracker"),
  l("Báo cáo tách rõ số liệu công khai và số liệu từ dashboard của bạn", "Reports that separate public figures from your own dashboard data"),
];

const faqs: { q: L10n; a: L10n }[] = [
  {
    q: l("Chi phí một chiến dịch khoảng bao nhiêu?", "How much does a campaign cost?"),
    a: l(
      "Chi phí phụ thuộc vào phạm vi, thị trường và thời lượng. Sau buổi trao đổi đầu tiên, chúng tôi gửi đề xuất kèm dự trù ngân sách rõ ràng.",
      "Cost depends on scope, markets and duration. After an initial call we send a proposal with a clear budget estimate."
    ),
  },
  {
    q: l("ANBU có lo giấy phép phát hành game tại Việt Nam không?", "Does ANBU handle game publishing licenses in Vietnam?"),
    a: l(
      "Giấy phép (ví dụ giấy phép G1 theo Nghị định 147/2024/NĐ-CP) thuộc trách nhiệm của đơn vị phát hành được cấp phép. Chúng tôi giúp bạn nắm các yêu cầu vận hành, lập kế hoạch ra mắt phù hợp và kết nối đối tác. Vấn đề pháp lý cụ thể nên được luật sư xác nhận.",
      "Licenses (for example the G1 license under Decree 147/2024/NĐ-CP) are the responsibility of the licensed publisher. We help you understand the operating requirements, plan the launch and connect partners. Specific legal questions should be confirmed by a lawyer."
    ),
  },
  {
    q: l("Bao lâu thì chuẩn bị xong để ra mắt?", "How long does it take to get launch-ready?"),
    a: l(
      "Tùy giấy phép, bản địa hóa, thanh toán và kế hoạch đăng ký trước. Mốc thực tế được chốt sau bước Khám phá, khi chúng tôi đã biết sản phẩm đang ở đâu.",
      "It depends on licensing, localization, payments and the pre-registration plan. Realistic dates are set after the Discover step, once we know where the product stands."
    ),
  },
  {
    q: l("ANBU làm việc ở những thị trường nào?", "Which markets does ANBU work in?"),
    a: l(
      "Tập trung vào Việt Nam và Thái Lan, mở rộng sang các thị trường Đông Nam Á khác theo từng dự án.",
      "We focus on Vietnam and Thailand and extend to other Southeast Asian markets project by project."
    ),
  },
  {
    q: l("Kết quả được đo và báo cáo như thế nào?", "How are results measured and reported?"),
    a: l(
      "Chỉ số được thống nhất từ đầu. Chúng tôi tách số liệu công khai (như lượt xem của cả video) khỏi số liệu cần dữ liệu từ dashboard của bạn (như cài đặt, retention), và ghi rõ nguồn cùng phạm vi của từng con số.",
      "Metrics are agreed up front. We keep public figures (such as whole-video views) separate from numbers that need your dashboard data (such as installs and retention), and state the source and scope of each figure."
    ),
  },
  {
    q: l("ANBU có cam kết số lượt cài đặt hoặc doanh thu không?", "Does ANBU guarantee installs or revenue?"),
    a: l(
      "Không. Kết quả phụ thuộc vào sản phẩm, thị trường và nhiều yếu tố ngoài tầm kiểm soát của agency. Chúng tôi cam kết quy trình minh bạch, kế hoạch rõ ràng và báo cáo trung thực.",
      "No. Results depend on the product, the market and factors outside an agency's control. We commit to a transparent process, a clear plan and honest reporting."
    ),
  },
  {
    q: l("Làm việc bằng ngôn ngữ nào?", "What languages do you work in?"),
    a: l("Tiếng Việt và tiếng Anh.", "Vietnamese and English."),
  },
];

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const vi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/how-we-work",
    title: vi
      ? "Cách ANBU làm việc: Quy trình & hình thức hợp tác cho game | ANBU"
      : "How ANBU Works: Process & Engagement Models for Games | ANBU",
    description: vi
      ? "Quy trình 4 bước, ba hình thức hợp tác, ví dụ lịch triển khai một chiến dịch thật và các câu hỏi thường gặp khi hợp tác với ANBU để ra mắt game tại Việt Nam."
      : "A 4-step process, three engagement models, a real campaign timeline and answers to common questions about working with ANBU to launch a game in Vietnam.",
  });
}

export default async function HowWeWorkPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const vi = locale === "vi";

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: t(f.q, locale),
      acceptedAnswer: { "@type": "Answer", text: t(f.a, locale) },
    })),
  };
  const crumbs = breadcrumbLd(
    [
      { name: vi ? "Trang chủ" : "Home", path: "/" },
      { name: vi ? "Cách chúng tôi làm việc" : "How we work", path: "/how-we-work" },
    ],
    locale
  );

  return (
    <>
      <JsonLd data={[faqLd, crumbs]} />
      <PageHero
        eyebrow={vi ? "Cách chúng tôi làm việc" : "How we work"}
        title={vi ? "Từ buổi trao đổi đầu tiên đến báo cáo cuối: ANBU làm việc như thế nào" : "From first call to final report: how ANBU works"}
        subtitle={
          vi
            ? "Quy trình bốn bước, ba hình thức hợp tác thường gặp và những gì chúng tôi cần từ bạn để bắt đầu."
            : "A four-step process, three common engagement models and what we need from you to get started."
        }
      />

      <section className="container-x py-14 sm:py-20">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">{vi ? "Quy trình" : "Process"}</span>
          <h2 className="text-balance mt-3 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
            {vi ? "Bốn bước, mục tiêu thống nhất từ đầu" : "Four steps, goals agreed up front"}
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <Reveal key={s.no} delay={i * 60}>
              <li className="h-full rounded-3xl border border-navy-100 bg-white p-6">
                <span className="font-display text-4xl font-extrabold text-orange-200" aria-hidden="true">{s.no}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-navy-800">{t(s.title, locale)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{t(s.description, locale)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-y border-navy-100 bg-cloud py-14 sm:py-20">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">{vi ? "Hình thức hợp tác" : "Engagement models"}</span>
            <h2 className="text-balance mt-3 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
              {vi ? "Chọn cách hợp tác phù hợp với giai đoạn của game" : "Pick the model that fits your game's stage"}
            </h2>
            <p className="mt-4 text-navy-500">
              {vi
                ? "Phạm vi và chi phí được chốt trong đề xuất sau buổi trao đổi đầu tiên, tùy mục tiêu và thị trường."
                : "Scope and cost are set in the proposal after the first call, depending on goals and markets."}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {models.map((m, i) => (
              <Reveal key={i} delay={i * 70}>
                <article className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">{t(m.fit, locale)}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-navy-800">{t(m.title, locale)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-500">{t(m.text, locale)}</p>
                  <ul className="mt-5 space-y-2 text-sm text-navy-700">
                    {m.items.map((it, j) => (
                      <li key={j} className="flex gap-2">
                        <span aria-hidden="true" className="mt-0.5 text-orange-500">✓</span>
                        <span>{t(it, locale)}</span>
                      </li>
                    ))}
                  </ul>
                  {i === 2 && (
                    <Link href={localePath(locale, "/services/publisher-search")} className="mt-auto pt-6 text-sm font-semibold text-orange-600 hover:underline">
                      {vi ? "Xem dịch vụ tìm nhà phát hành" : "See the publisher-search service"} →
                    </Link>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow">{vi ? "Ví dụ thực tế" : "A real example"}</span>
            <h2 className="text-balance mt-3 font-display text-3xl font-extrabold text-navy-800">
              {vi ? "Đấu La Đại Lục: Hồn Sư Đối Quyết, từ đăng ký trước đến Open Beta" : "Soul Master Duel: from pre-registration to Open Beta"}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-500">
              {vi
                ? "Chiến dịch cho game do Funtap phát hành tại Việt Nam, chạy từ 25/03 đến 21/04/2022, gồm báo chí, creator YouTube và Facebook, quản lý cộng đồng, seeding và giftcode."
                : "A campaign for the game Funtap published in Vietnam, running from 25 Mar to 21 Apr 2022, combining press, YouTube and Facebook creators, community management, seeding and giftcodes."}
            </p>
            <Link href={localePath(locale, "/work/douluo-soul-master-duel")} className="mt-5 inline-flex text-sm font-semibold text-orange-600 hover:underline">
              {vi ? "Xem trang dự án" : "View the project page"} →
            </Link>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-7">
            <ol className="space-y-3">
              {timeline.map((row) => (
                <li key={row.date} className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-4 sm:p-5">
                  <span className="w-28 shrink-0 font-display text-sm font-extrabold text-orange-600 sm:w-36">{row.date}</span>
                  <span className="text-sm leading-relaxed text-navy-600">{vi ? row.vi : row.en}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs italic leading-relaxed text-navy-400">
              {vi
                ? "Mốc thời gian lấy từ các bài báo công khai. Số liệu ghi “của game” là chỉ số của sản phẩm, không phải kết quả riêng của ANBU."
                : "Dates come from public press articles. Figures marked “game-level” describe the product, not ANBU's own results."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cloud py-14 sm:py-20">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-navy-100 bg-white p-7">
              <h2 className="font-display text-2xl font-bold text-navy-800">{vi ? "Chúng tôi cần gì từ bạn" : "What we need from you"}</h2>
              <ul className="mt-5 space-y-3">
                {needs.map((n, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-navy-600">
                    <span aria-hidden="true" className="mt-0.5 text-orange-500">●</span>
                    <span>{t(n, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="h-full rounded-3xl bg-navy-900 p-7 text-white">
              <h2 className="font-display text-2xl font-bold">{vi ? "Bạn nhận được" : "What you get"}</h2>
              <ul className="mt-5 space-y-3">
                {gets.map((g, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-navy-100">
                    <span aria-hidden="true" className="mt-0.5 text-orange-400">✓</span>
                    <span>{t(g, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">FAQ</span>
          <h2 className="text-balance mt-3 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
            {vi ? "Câu hỏi thường gặp khi hợp tác" : "Common questions about working together"}
          </h2>
        </Reveal>
        <div className="mt-8 max-w-3xl">
          <FaqAccordion items={faqs.map((f) => ({ q: t(f.q, locale), a: t(f.a, locale) }))} />
        </div>
        <p className="mt-8 text-sm text-navy-500">
          {vi ? "Gặp thuật ngữ chưa quen? Xem " : "Unfamiliar term? See the "}
          <Link href={localePath(locale, "/glossary")} className="font-semibold text-orange-600 hover:underline">
            {vi ? "từ điển thuật ngữ game marketing" : "game marketing glossary"}
          </Link>
          .
        </p>
      </section>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}

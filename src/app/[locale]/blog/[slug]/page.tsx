import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, defaultLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { posts, getPost, type Block } from "@/content/posts";
import { postDeepDiveBySlug } from "@/content/postDeepDive";
import { t } from "@/content/site";
import { buildMetadata, siteUrl, breadcrumbLd } from "@/lib/seo";
import { localePath, formatDate } from "@/lib/utils";
import Icon from "@/components/Icon";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import EditorialMedia, { editorialImageForPostData } from "@/components/EditorialMedia";
import { PostCard } from "@/components/cards";

export function generateStaticParams() {
  return locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const post = getPost(params.slug);
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: t(post.title, locale),
    description: t(post.excerpt, locale),
    type: "article",
  });
}

function BlockRenderer({ block, locale, headingId }: { block: Block; locale: Locale; headingId?: string }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={headingId} className="scroll-mt-24 mt-10 font-display text-2xl font-bold text-navy-800">
          {t(block.text, locale)}
        </h2>
      );
    case "p":
      return <p className="mt-5 text-lg leading-relaxed text-navy-600">{t(block.text, locale)}</p>;
    case "quote":
      return (
        <blockquote className="my-8 rounded-2xl border-l-4 border-orange-500 bg-cloud p-6 text-lg font-medium italic text-navy-700">
          {t(block.text, locale)}
        </blockquote>
      );
    case "ul":
      return (
        <ul className="mt-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-lg leading-relaxed text-navy-600">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
              {t(item, locale)}
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <figure className="my-8 overflow-hidden rounded-3xl border border-navy-100 bg-cloud shadow-sm">
          <EditorialMedia
            src={block.src}
            alt={t(block.alt, locale)}
            className="aspect-[16/9] w-full object-cover"
          />
          {block.caption && (
            <figcaption className="border-t border-navy-100/60 bg-white/70 px-5 py-3 text-sm leading-relaxed text-navy-500">
              {t(block.caption, locale)}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

function inlineEditorialImage(slug: string, index: number) {
  type Copy = { vi: string; en: string };
  type Pool = { match: string[]; images: string[]; alt: Copy; captions: Copy[] };
  const generic: Copy = { vi: "Ảnh minh họa cho nội dung bài viết", en: "Editorial image illustrating this article" };
  const pools: Pool[] = [
    {
      match: ["esports"],
      images: ["/blog-covers/esports-vietnam-sea-games.jpg", "/blog-covers/esports-vietnam-asiad.jpg", "/blog-covers/esports-vietnam-stage.jpg"],
      alt: { vi: "Đội tuyển esports Việt Nam tại các giải đấu khu vực và quốc tế", en: "Vietnamese esports teams at regional and international tournaments" },
      captions: [
        { vi: "Đội tuyển esports Việt Nam tại SEA Games, cột mốc đưa thể thao điện tử đến sân chơi thể thao khu vực.", en: "Vietnamese esports players at the SEA Games, a milestone for esports in regional sport." },
        { vi: "Đội tuyển Việt Nam tại đấu trường esports quốc tế, cho thấy vị thế ngày càng rõ của tuyển thủ Việt.", en: "Vietnamese players on an international esports stage, showing the country’s growing competitive presence." },
        { vi: "Sân khấu và lễ trao huy chương esports tại SEA Games, nơi thành tích tuyển thủ kết nối với người hâm mộ.", en: "An esports stage and SEA Games medal ceremony connecting player achievement with fans." },
      ],
    },
    { match: ["thailand"], images: ["/blog-covers/real-thailand.jpg", "/blog-covers/real-game-event.jpg", "/blog-covers/real-content.jpg"], alt: { vi: "Chiến lược ra mắt game và bản địa hóa thị trường Thái Lan", en: "Game launch strategy and localization for Thailand" }, captions: [
      { vi: "Bản đồ kênh truyền thông trong kế hoạch ra mắt game tại thị trường Thái Lan.", en: "A channel map for launching a game in the Thailand market." },
      { vi: "Creator và cộng đồng game trong chiến dịch bản địa hóa nội dung tại Thái Lan.", en: "Creators and gaming communities supporting localized content in Thailand." },
      { vi: "Nội dung bản địa hóa giúp game quốc tế tiếp cận đúng người chơi Thái Lan.", en: "Localized content helping an international game reach Thai players." },
    ] },
    { match: ["analytics", "cpi", "roas", "arppu"], images: ["/blog-covers/real-analytics.jpg", "/blog-covers/real-content.jpg", "/blog-covers/real-mobile-gaming.jpg"], alt: { vi: "Bảng dữ liệu phân tích người chơi và hiệu quả marketing game", en: "Player analytics and game marketing performance dashboard" }, captions: [
      { vi: "Bảng phân tích funnel người chơi dùng để theo dõi CPI, ROAS và doanh thu game.", en: "A player-funnel dashboard tracking CPI, ROAS and game revenue." },
      { vi: "Dữ liệu chiến dịch giúp đội ngũ marketing game đọc đúng hành vi người chơi.", en: "Campaign data helping game marketers understand player behavior." },
      { vi: "Thiết bị di động và dữ liệu hành vi trong quá trình đo lường tăng trưởng game.", en: "Mobile devices and behavioral data used to measure game growth." },
    ] },
    { match: ["community", "discord", "moderation"], images: ["/blog-covers/real-team.jpg", "/blog-covers/real-social.jpg", "/blog-covers/real-game-event.jpg"], alt: { vi: "Hoạt động cộng đồng, creator và tương tác của người chơi game", en: "Gaming community, creator activity and player engagement" }, captions: [
      { vi: "Đội ngũ vận hành và cộng đồng game phối hợp để chăm sóc trải nghiệm người chơi.", en: "Operations teams and gaming communities working together for player experience." },
      { vi: "Tương tác social và creator giúp xây dựng cộng đồng game bền vững.", en: "Social and creator engagement supporting a sustainable game community." },
      { vi: "Sự kiện game kết nối người chơi, creator và thương hiệu trong cùng một trải nghiệm.", en: "A game event connecting players, creators and brands in one experience." },
    ] },
    { match: ["aso", "store", "app", "mobile"], images: ["/blog-covers/real-phone-app.jpg", "/blog-covers/real-mobile-gaming.jpg", "/blog-covers/real-game-console.jpg"], alt: { vi: "Trải nghiệm game trên thiết bị di động và tối ưu trang cửa hàng", en: "Mobile game experience and app store optimization" }, captions: [
      { vi: "Trang cửa hàng ứng dụng trên điện thoại được tối ưu để tăng lượt cài đặt game.", en: "A mobile app store page optimized to increase game installs." },
      { vi: "Trải nghiệm người chơi trên thiết bị di động trong hành trình từ quảng cáo đến cài đặt.", en: "The mobile player journey from ad exposure to game install." },
      { vi: "Thiết bị và nền tảng chơi game mobile trong chiến lược tăng trưởng ứng dụng.", en: "Mobile devices and platforms in an app growth strategy." },
    ] },
    { match: ["seo", "keyword", "link", "content"], images: ["/blog-covers/real-content.jpg", "/blog-covers/real-analytics.jpg", "/blog-covers/real-brand.jpg"], alt: { vi: "Nghiên cứu nội dung, từ khóa và cấu trúc SEO cho website game", en: "Content research, keywords and SEO structure for a game website" }, captions: [
      { vi: "Nội dung và cấu trúc trang giúp website game được công cụ tìm kiếm hiểu rõ hơn.", en: "Content and page structure helping search engines understand a game website." },
      { vi: "Bảng dữ liệu nghiên cứu từ khóa và hiệu quả SEO cho chiến dịch marketing game.", en: "Keyword research and SEO performance data for game marketing." },
      { vi: "Hệ thống nhận diện thương hiệu hỗ trợ nội dung nhất quán trên website.", en: "A brand system supporting consistent content across a website." },
    ] },
    { match: ["brand", "localization", "tet"], images: ["/blog-covers/real-brand.jpg", "/blog-covers/real-vietnam.jpg", "/blog-covers/real-social.jpg"], alt: { vi: "Xây dựng thương hiệu và nội dung phù hợp với người chơi Việt Nam", en: "Brand building and content for Vietnamese players" }, captions: [
      { vi: "Hệ thống nhận diện thương hiệu trong chiến lược marketing game tại Việt Nam.", en: "A brand identity system for game marketing in Vietnam." },
      { vi: "Bản địa hóa nội dung và hình ảnh để game phù hợp với người chơi Việt Nam.", en: "Localized content and visuals designed for Vietnamese players." },
      { vi: "Nội dung social được điều chỉnh theo văn hóa và hành vi cộng đồng game.", en: "Social content adapted to gaming culture and community behavior." },
    ] },
  ];
  const lower = slug.toLowerCase();
  const exactEditorial: Record<string, Pool> = {
    "ban-do-nha-phat-hanh-game-viet-nam": {
      match: [],
      images: [
        "/blog-covers/publishers/vng-logo.png",
        "/blog-covers/publishers/vng-cookierun.jpg",
        "/blog-covers/publishers/funtap-logo.jpg",
        "/blog-covers/publishers/funtap-game.jpg",
        "/blog-covers/publishers/joygames-game.png",
        "/blog-covers/publishers/gosu-event.jpg",
        "/blog-covers/publishers/vplay-game.jpg",
      ],
      alt: { vi: "Bản đồ nhà phát hành game Việt Nam và hoạt động của các đội ngũ phát hành", en: "Vietnam game publisher landscape and publishing teams" },
      captions: [
        { vi: "Logo VNGGames từ trang thương hiệu chính thức của VNGGames.", en: "VNGGames logo from the official VNGGames brand page." },
        { vi: "Hình ảnh tựa game CookieRun trên hệ sinh thái VNGGames.", en: "CookieRun game artwork from the VNGGames ecosystem." },
        { vi: "Logo Funtap lấy từ website chính thức của nhà phát hành.", en: "Funtap logo sourced from the publisher's official website." },
        { vi: "Hình ảnh game trên hệ sinh thái Funtap, minh họa danh mục sản phẩm của nhà phát hành.", en: "Game artwork from the Funtap ecosystem, illustrating the publisher's portfolio." },
        { vi: "Hình ảnh tựa game Pixel Đại Chiến trên website chính thức JoyGames.", en: "Pixel Dai Chien artwork from the official JoyGames website." },
        { vi: "Hình ảnh hoạt động cộng đồng và sự kiện trên website chính thức GOSU.", en: "Community and event activity from the official GOSU website." },
        { vi: "Hình ảnh game trên landing page chính thức của VPlay.", en: "Game artwork from an official VPlay landing page." },
      ],
    },
  };
  const exactPool = exactEditorial[slug];
  if (exactPool) {
    const imageIndex = index % exactPool.images.length;
    return { src: exactPool.images[imageIndex], alt: exactPool.alt, caption: exactPool.captions[imageIndex] ?? generic };
  }
  const pool = pools.find((item) => item.match.some((term) => lower.includes(term))) ?? {
    images: ["/blog-covers/real-mobile-gaming.jpg", "/blog-covers/real-game-event.jpg", "/blog-covers/real-content.jpg"],
    alt: { vi: "Minh họa hoạt động marketing và vận hành sản phẩm game", en: "Illustration of game marketing and product operations" },
    captions: [
      { vi: "Hình ảnh minh họa hoạt động marketing và vận hành sản phẩm game.", en: "Editorial image showing game marketing and product operations." },
      { vi: "Đội ngũ và cộng đồng trong quá trình phát triển sản phẩm game.", en: "Teams and communities during game product development." },
      { vi: "Nội dung và dữ liệu hỗ trợ quyết định tăng trưởng game.", en: "Content and data supporting game growth decisions." },
    ],
  };
  const imageIndex = index % pool.images.length;
  return { src: pool.images[imageIndex], alt: pool.alt, caption: pool.captions[imageIndex] ?? generic };
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = [
    ...posts.filter((p) => p.slug !== post.slug && p.category.vi === post.category.vi),
    ...posts.filter((p) => p.slug !== post.slug && p.category.vi !== post.category.vi),
  ].slice(0, 3);
  const serviceByCategory: Record<string, string> = {
    "Marketing Game": "game-app-marketing",
    "Performance Marketing": "performance-marketing",
    "Cộng đồng Game": "social-media",
    "Analytics Game": "performance-marketing",
    "Kinh doanh Game": "game-app-marketing",
    "Thị trường Game": "game-app-marketing",
    "Esports Việt Nam": "esports-gaming-marketing-sea",
    "Vận hành Game": "game-app-marketing",
  };
  const relatedService = serviceByCategory[post.category.vi] ?? "game-app-marketing";
  const linkedService = post.slug === "game-launch-marketing-thailand" ? "esports-gaming-marketing-sea" : relatedService;
  const serviceAnchor = locale === "vi"
    ? linkedService === "influencer-marketing" ? "Xem dịch vụ booking KOL KOC và creator"
      : linkedService === "performance-marketing" ? "Xem dịch vụ performance marketing cho game"
      : "Xem dịch vụ marketing và launch game"
    : linkedService === "influencer-marketing" ? "Explore KOL KOC and creator marketing"
      : linkedService === "performance-marketing" ? "Explore performance marketing for games"
      : "Explore game marketing and launch support";
  const toc = post.body
    .concat(postDeepDiveBySlug[post.slug] ?? [])
    .map((block, index) => (block.type === "h2" ? { id: `section-${index}`, title: t(block.text, locale) } : null))
    .filter((item): item is { id: string; title: string } => item !== null);
  const articleBlocks = post.body.concat(postDeepDiveBySlug[post.slug] ?? []);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: t(post.title, locale),
    description: t(post.excerpt, locale),
    datePublished: post.date,
    dateModified: post.date,
    image: `${siteUrl}${editorialImageForPostData(post)}`,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "ANBU",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo/logo.png` },
    },
    mainEntityOfPage: `${siteUrl}/${locale}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(
            [
              { name: "ANBU", path: "" },
              { name: dict.nav.blog, path: "/blog" },
              { name: t(post.title, locale), path: `/blog/${post.slug}` },
            ],
            locale
          ),
        ]}
      />

      <article>
        <header className={`relative overflow-hidden bg-gradient-to-br ${post.color} text-white`}>
          <EditorialMedia
            src={editorialImageForPostData(post)}
            alt={t(post.title, locale)}
            className="pointer-events-none absolute inset-0 opacity-45"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-navy-900/35" />
          <div className="container-x relative py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <Link href={localePath(locale, "/blog")} className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
                {dict.blogSection.back}
              </Link>
              <div className="mt-6 flex items-center gap-3 text-sm text-white/80">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  {t(post.category, locale)}
                </span>
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                <span>·</span>
                <span>{post.readingTime} {dict.blogSection.readTime}</span>
              </div>
              <p className="mt-4 text-sm font-medium text-white/75">
                {locale === "vi" ? "Biên soạn bởi" : "Written by"} {post.author}
              </p>
              <h1 className="text-balance mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                {t(post.title, locale)}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-white/90">{t(post.excerpt, locale)}</p>
            </div>
          </div>
        </header>

        <div className="container-x py-14 sm:py-16">
          <div className="mx-auto grid max-w-[1320px] items-start gap-8 xl:grid-cols-[220px_minmax(0,768px)_220px]">
            <aside className="sticky top-28 hidden xl:block">
              <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                  {locale === "vi" ? "Đang đọc" : "You are reading"}
                </p>
                <p className="mt-3 text-sm font-bold leading-relaxed text-navy-800">{t(post.category, locale)}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-navy-50">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
                </div>
                <dl className="mt-5 space-y-3 border-t border-navy-100 pt-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-navy-400">{locale === "vi" ? "Thời gian" : "Read time"}</dt>
                    <dd className="font-semibold text-navy-700">{post.readingTime} {dict.blogSection.readTime}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-navy-400">{locale === "vi" ? "Biên soạn" : "Author"}</dt>
                    <dd className="font-semibold text-navy-700">ANBU</dd>
                  </div>
                </dl>
              </div>
              <div className="mt-4 rounded-3xl bg-cloud p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-500">
                  {locale === "vi" ? "Chia sẻ bài viết" : "Share article"}
                </p>
                <div className="mt-3 grid gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/${locale}/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-navy-700 transition hover:text-orange-600"
                  >
                    Facebook ↗
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteUrl}/${locale}/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-navy-700 transition hover:text-orange-600"
                  >
                    LinkedIn ↗
                  </a>
                </div>
              </div>
              <div className="mt-4 rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                  {locale === "vi" ? "Đọc tiếp" : "Keep reading"}
                </p>
                <div className="mt-4 space-y-4">
                  {related.slice(0, 2).map((item, index) => (
                    <Link key={item.slug} href={localePath(locale, `/blog/${item.slug}`)} className="group block border-b border-navy-100 pb-4 last:border-0 last:pb-0">
                      <span className="text-[11px] font-bold text-orange-500">0{index + 1}</span>
                      <h3 className="mt-1 text-sm font-bold leading-snug text-navy-800 transition group-hover:text-orange-600">
                        {t(item.title, locale)}
                      </h3>
                      <span className="mt-2 inline-flex text-xs font-semibold text-navy-400 group-hover:text-orange-500">
                        {item.readingTime} {dict.blogSection.readTime} →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            <div className="min-w-0">
            {toc.length > 1 && (
              <nav aria-label={locale === "vi" ? "Mục lục bài viết" : "Table of contents"} className="mb-10 rounded-3xl border border-navy-100 bg-cloud p-6">
                <h2 className="font-display text-lg font-bold text-navy-800">
                  {locale === "vi" ? "Nội dung chính" : "In this article"}
                </h2>
                <ol className="mt-4 space-y-2">
                  {toc.map((item, index) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="flex gap-3 text-sm font-medium leading-relaxed text-navy-600 hover:text-orange-600">
                        <span className="text-orange-500">{String(index + 1).padStart(2, "0")}</span>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            {(() => {
              const hasExplicitImages = articleBlocks.some((b) => b.type === "image");
              return articleBlocks.map((block, i) => {
                const shouldInsertImage = !hasExplicitImages && (i === 1 || (i > 1 && i % 5 === 0)) && i < articleBlocks.length - 1;
                const image = shouldInsertImage ? inlineEditorialImage(post.slug, Math.floor(i / 5)) : null;
                return (
                  <div key={i}>
                    <BlockRenderer block={block} locale={locale} headingId={block.type === "h2" ? `section-${i}` : undefined} />
                    {image ? (
                      <figure className="my-10 overflow-hidden rounded-3xl border border-navy-100 bg-cloud shadow-sm">
                        <EditorialMedia
                          src={image.src}
                          alt={`${image.alt[locale]}. ${t(post.title, locale)}`}
                          className="aspect-[16/9] w-full object-cover"
                        />
                        <figcaption className="px-5 py-3 text-sm leading-relaxed text-navy-500">
                          {image.caption[locale]}
                        </figcaption>
                      </figure>
                    ) : null}
                  </div>
                );
              });
            })()}
            {post.sources?.length ? (
              <aside className="mt-10 rounded-3xl border border-navy-100 bg-cloud p-6">
                <h2 className="font-display text-lg font-bold text-navy-800">
                  {locale === "vi" ? "Nguồn tham khảo chính thức" : "Official references"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">
                  {locale === "vi"
                    ? "Các thông tin thị trường và pháp lý trong bài được đối chiếu từ các nguồn dưới đây."
                    : "Market and regulatory information in this article was checked against the sources below."}
                </p>
                <ul className="mt-4 space-y-3">
                  {post.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 text-sm font-semibold text-navy-700 underline decoration-orange-300 underline-offset-4 hover:text-orange-600">
                        <span aria-hidden="true">↗</span>
                        {source.label[locale]}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
            <aside className="mt-12 rounded-3xl bg-navy-900 p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                {locale === "vi" ? "Trao đổi cùng ANBU" : "Talk to ANBU"}
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold">
                {locale === "vi" ? "Bạn đang chuẩn bị một chiến dịch tương tự?" : "Planning a similar campaign?"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {locale === "vi"
                  ? "Chia sẻ mục tiêu, thị trường và ngân sách dự kiến. Đội ngũ ANBU sẽ đề xuất hướng triển khai phù hợp."
                  : "Share your goal, market and expected budget. The ANBU team will recommend a practical direction."}
              </p>
              <Link href={localePath(locale, "/contact")} className="btn-primary mt-5">
                {locale === "vi" ? "Nhận tư vấn chiến dịch" : "Get campaign advice"}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </aside>
            <aside className="mt-5 rounded-3xl border border-orange-100 bg-orange-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                {locale === "vi" ? "Dịch vụ liên quan" : "Related service"}
              </p>
              <Link href={localePath(locale, `/services/${linkedService}`)} className="mt-3 inline-flex items-center gap-2 font-bold text-navy-800 hover:text-orange-600">
                {serviceAnchor} <span aria-hidden="true">→</span>
              </Link>
            </aside>
            </div>

            <aside className="sticky top-28 hidden xl:block">
              <div className="overflow-hidden rounded-3xl bg-navy-900 p-5 text-white shadow-lg">
                <span className="inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-300">
                  Publisher Search
                </span>
                <h2 className="mt-4 font-display text-xl font-bold leading-tight">
                  {locale === "vi" ? "Cần tìm nhà phát hành tại Việt Nam?" : "Looking for a publisher in Vietnam?"}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {locale === "vi"
                    ? "ANBU hỗ trợ đánh giá sản phẩm, lập shortlist, kết nối đối tác và điều phối kế hoạch ra mắt."
                    : "ANBU helps assess the title, build a shortlist, connect partners and coordinate market launch."}
                </p>
                <Link href={localePath(locale, "/contact")} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-300 hover:text-white">
                  {locale === "vi" ? "Trao đổi với ANBU" : "Talk to ANBU"} <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="mt-4 rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                  {locale === "vi" ? "Có thể bạn quan tâm" : "You may also like"}
                </p>
                <div className="mt-4 space-y-4">
                  {related.slice(2, 3).map((item) => (
                    <Link key={item.slug} href={localePath(locale, `/blog/${item.slug}`)} className="group block">
                      <div className="overflow-hidden rounded-2xl bg-navy-50">
                        <EditorialMedia src={editorialImageForPostData(item)} alt={t(item.title, locale)} className="aspect-[16/10] transition duration-300 group-hover:scale-105" />
                      </div>
                      <h3 className="mt-3 text-sm font-bold leading-snug text-navy-800 transition group-hover:text-orange-600">
                        {t(item.title, locale)}
                      </h3>
                      <span className="mt-2 inline-flex text-xs font-semibold text-navy-400 group-hover:text-orange-500">
                        {locale === "vi" ? "Đọc bài" : "Read article"} →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="container-x pb-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-navy-800">{dict.blogSection.related}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} locale={locale} readLabel={dict.blogSection.read} readTimeLabel={dict.blogSection.readTime} />
            ))}
          </div>
        </div>
      </section>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}

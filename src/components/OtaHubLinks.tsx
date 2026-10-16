import Icon from "./Icon";
import ResilientImage from "./ResilientImage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Item = { href: string; label: string; tag: string; img: string; note?: string };

const IMG = "https://otahub.asia";

const content = {
  vi: {
    eyebrow: "Hệ sinh thái ANBU",
    title: "Tin và phân tích từ OtaHub",
    intro: "OtaHub là trang tin game, anime và manga do ANBU vận hành. Một số bài đáng đọc gần đây:",
    items: [
      {
        href: "https://otahub.asia/cktg-2026-boc-tham-khi-nao-lich-thi-dau-theo-gio-viet-nam",
        img: `${IMG}/assets/img/cktg-2026-boc-tham-worlds-draw-show.jpg`,
        label: "Lịch thi đấu Chung kết thế giới LMHT 2026 theo giờ Việt Nam",
        tag: "Esports",
        note: "Play-In, vòng Thụy Sĩ, tứ kết, bán kết và chung kết.",
      },
      {
        href: "https://otahub.asia/choi-gi",
        img: `${IMG}/og-image-v4.png`,
        label: "Gợi ý chơi gì, xem gì, đọc gì hôm nay",
        tag: "Gợi ý",
        note: "Chọn tâm trạng để nhận gợi ý kèm review và điểm số.",
      },
      {
        href: "https://otahub.asia/dem-nguoc-gta-6",
        img: `${IMG}/assets/img/gta6/og-vi.jpg`,
        label: "Đếm ngược GTA 6 và những điều cần biết trước ngày ra mắt 19/11",
        tag: "Game mới",
      },
      {
        href: "https://otahub.asia/giftcode",
        img: `${IMG}/assets/img/giftcode-tong-hop-hero.jpg`,
        label: "Tổng hợp giftcode game mới nhất, cập nhật mỗi thứ Hai",
        tag: "Giftcode",
      },
      {
        href: "https://otahub.asia/death-stranding-2-review",
        img: `${IMG}/assets/img/9c68ea445d-death-stranding-2-on-the-beach-review-hero.jpg`,
        label: "Review Death Stranding 2: chiến đấu tốt hơn, vẫn kén người chơi",
        tag: "Review",
      },
    ] as Item[],
    allHref: "https://otahub.asia/",
    allLabel: "Xem toàn bộ tin và bài đánh giá tại OtaHub",
    allHint: "Game · Anime · Manga",
  },
  en: {
    eyebrow: "ANBU ecosystem",
    title: "News and analysis from OtaHub",
    intro: "OtaHub is a gaming, anime and manga news site run by ANBU. Recent articles worth reading:",
    items: [
      {
        href: "https://otahub.asia/en/worlds-2026-draw-when-schedule-vietnam-time",
        img: `${IMG}/assets/img/cktg-2026-boc-tham-worlds-draw-show.jpg`,
        label: "Worlds 2026 schedule in Vietnam time",
        tag: "Esports",
        note: "Play-In, Swiss Stage, quarterfinals, semifinals and the final.",
      },
      {
        href: "https://otahub.asia/en/choi-gi",
        img: `${IMG}/og-image-v4.png`,
        label: "What to play, watch or read today",
        tag: "Picks",
        note: "Pick a mood and get a recommendation with a review and score.",
      },
      {
        href: "https://otahub.asia/en/gta-6-countdown",
        img: `${IMG}/assets/img/gta6/og-en.jpg`,
        label: "GTA 6 countdown and what to know before November 19",
        tag: "New release",
      },
      {
        href: "https://otahub.asia/en/game-codes",
        img: `${IMG}/assets/img/giftcode-tong-hop-hero.jpg`,
        label: "Latest game gift codes, updated every Monday",
        tag: "Gift codes",
      },
      {
        href: "https://otahub.asia/en/death-stranding-2-review",
        img: `${IMG}/assets/img/9c68ea445d-death-stranding-2-on-the-beach-review-hero.jpg`,
        label: "Death Stranding 2 review: better combat, still not for everyone",
        tag: "Review",
      },
    ] as Item[],
    allHref: "https://otahub.asia/en/",
    allLabel: "Browse all news and reviews at OtaHub",
    allHint: "Games · Anime · Manga",
  },
};

// Homepage-only editorial links to OtaHub (same ecosystem). Plain followed links:
// each card's title is the anchor, stretched over the whole card so it is fully clickable.
export default function OtaHubLinks({ locale }: { locale: string }) {
  const c = locale === "vi" ? content.vi : content.en;
  return (
    <section className="otahub-links container-x py-10 sm:py-20 lg:py-24">
      <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.intro} />

      <ul className="mt-8 grid list-none gap-5 p-0 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {c.items.map((item, i) => (
          <li key={item.href}>
            <Reveal delay={i * 60} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_28px_70px_-24px_rgba(1,47,135,0.3)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-navy-50">
                  <ResilientImage
                    src={item.img}
                    alt={item.label}
                    width={1200}
                    height={675}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/25 via-transparent to-transparent" />
                  <span className="absolute left-3.5 top-3.5 inline-flex rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-800 shadow-sm backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-lg font-extrabold leading-snug text-navy-800 sm:text-xl">
                    <a
                      href={item.href}
                      className="after:absolute after:inset-0 after:content-[''] transition-colors group-hover:text-orange-600"
                    >
                      {item.label}
                    </a>
                  </h3>
                  {item.note && <p className="mt-2.5 text-sm leading-relaxed text-navy-500">{item.note}</p>}
                  <span
                    aria-hidden="true"
                    className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-navy-700 transition-colors group-hover:text-orange-600"
                  >
                    OtaHub
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            </Reveal>
          </li>
        ))}

        <li>
          <Reveal delay={c.items.length * 60} className="h-full">
            <article className="group relative flex h-full min-h-[11rem] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 p-5 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-24px_rgba(1,47,135,0.5)] sm:p-6">
              <span className="text-xs font-bold uppercase tracking-wide text-orange-400">{c.allHint}</span>
              <div>
                <h3 className="mt-6 font-display text-lg font-extrabold leading-snug sm:text-xl">
                  <a href={c.allHref} className="after:absolute after:inset-0 after:content-['']">
                    {c.allLabel}
                  </a>
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white transition-transform group-hover:translate-x-1"
                >
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
              </div>
            </article>
          </Reveal>
        </li>
      </ul>
    </section>
  );
}

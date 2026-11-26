import Icon from "./Icon";
import ResilientImage from "./ResilientImage";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Item = { href: string; label: string; tag: string; img: string; date: string };

const OTAHUB = "https://otahub.asia";

// Top articles by all-time views, from OtaHub's own ranking (GET https://otahub.asia/api/trending -> "all",
// snapshot 20/11/2026; VI and EN counts are combined, so both locales share the same ranking).
// The "GTA 6 countdown" article (#1 by views) is left out on purpose: it is tied to the 19/11 launch date, which has passed.
// `img` uses OtaHub's pre-built 640px thumbnails (/assets/img/_t/<file>.webp); the Apothecary Diaries cover has no
// thumbnail, so it uses the original. To refresh: re-fetch the API above and replace the list.
const thumb = (file: string) => `${OTAHUB}/assets/img/_t/${file}.webp`;
const full = (file: string) => `${OTAHUB}/assets/img/${file}`;

const content = {
  vi: {
    eyebrow: "Hệ sinh thái ANBU",
    title: "Bài được đọc nhiều nhất trên OtaHub",
    intro: "OtaHub là trang tin game, anime và manga do ANBU vận hành. Đây là những bài độc giả mở đọc nhiều nhất.",
    rankLabel: "Hạng",
    readLabel: "Đọc bài",
    items: [
      {
        href: `${OTAHUB}/kairosoft-la-ai-tu-game-pc-mien-phi-den-game-dev-story`,
        img: thumb("kairosoft-game-dev-story-van-phong.jpg"),
        label: "Kairosoft là ai? Từ game miễn phí trên PC đến Game Dev Story",
        tag: "Game",
        date: "2026-10-10",
      },
      {
        href: `${OTAHUB}/duoc-su-tu-su-gia-the-cua-mieu-mieu-dac-biet-toi-muc-nao`,
        img: full("uploads/ky72wdn3-untitled2-3.avif"),
        label: "Dược Sư Tự Sự: Miêu Miêu là con ai mà gia thế đặc biệt vậy?",
        tag: "Chuyên sâu",
        date: "2026-10-08",
      },
      {
        href: `${OTAHUB}/xuong-phep-thuat-vi-sao-khong-dung-phep-thuat-chua-khuyet-tat`,
        img: thumb("xuong-phep-thuat-khuyet-tat-hero.jpg"),
        label: "Xưởng Phép Thuật nhìn người khuyết tật như thế nào?",
        tag: "Chuyên sâu",
        date: "2026-10-13",
      },
      {
        href: `${OTAHUB}/himmel-frieren-tinh-cam-khong-loi-tuong-nhan-thap-dong-ho`,
        img: thumb("frieren-himmel-nhan-mirror-lotus-thap-dong-ho-hero.jpg"),
        label: "Himmel và Frieren: một đời không nói yêu, một đời học cách thấu hiểu",
        tag: "Anime",
        date: "2026-10-09",
      },
      {
        href: `${OTAHUB}/1-in-8-billion-game-mo-phong-cuoc-doi-tren-trinh-duyet`,
        img: thumb("1-in-8-billion-hero.png"),
        label: "1 in 8 Billion: thử sống một cuộc đời ngẫu nhiên ngay trên trình duyệt",
        tag: "Game",
        date: "2026-10-12",
      },
      {
        href: `${OTAHUB}/black-clover-phan-biet-giai-cap`,
        img: thumb("black-clover-phan-biet-giai-cap-hero.jpg"),
        label: "Tại sao Black Clover luôn nhắc đến phân biệt giai cấp?",
        tag: "Chuyên sâu",
        date: "2026-10-06",
      },
    ] as Item[],
    allHref: `${OTAHUB}/`,
    allLabel: "Xem toàn bộ tin và bài đánh giá tại OtaHub",
    allHint: "Game · Anime · Manga",
    allCta: "Đến OtaHub",
  },
  en: {
    eyebrow: "ANBU ecosystem",
    title: "Most-read articles on OtaHub",
    intro: "OtaHub is a gaming, anime and manga news site run by ANBU. These are the articles readers open the most.",
    rankLabel: "Rank",
    readLabel: "Read article",
    items: [
      {
        href: `${OTAHUB}/en/who-is-kairosoft-from-free-pc-games-to-game-dev-story`,
        img: thumb("kairosoft-game-dev-story-van-phong.jpg"),
        label: "Who is Kairosoft? From free PC games to Game Dev Story",
        tag: "Gaming",
        date: "2026-10-10",
      },
      {
        href: `${OTAHUB}/en/apothecary-diaries-maomao-parents-family-background`,
        img: full("uploads/ky72wdn3-untitled2-3.avif"),
        label: "The Apothecary Diaries: Who Are Maomao's Parents, Really?",
        tag: "In-depth",
        date: "2026-10-08",
      },
      {
        href: `${OTAHUB}/en/why-witch-hat-atelier-does-not-cure-disability-with-magic`,
        img: thumb("xuong-phep-thuat-khuyet-tat-hero.jpg"),
        label: "How Witch Hat Atelier portrays disability",
        tag: "In-depth",
        date: "2026-10-13",
      },
      {
        href: `${OTAHUB}/en/himmel-frieren-silent-love-statue-ring-clock-tower`,
        img: thumb("frieren-himmel-nhan-mirror-lotus-thap-dong-ho-hero.jpg"),
        label: "Himmel and Frieren: One Life of Silent Love, One Learning to Understand",
        tag: "Anime",
        date: "2026-10-09",
      },
      {
        href: `${OTAHUB}/en/1-in-8-billion-browser-life-simulation-how-to-play`,
        img: thumb("1-in-8-billion-hero.png"),
        label: "1 in 8 Billion lets you live a random life in your browser",
        tag: "Gaming",
        date: "2026-10-12",
      },
      {
        href: `${OTAHUB}/en/black-clover-class-discrimination-explained`,
        img: thumb("black-clover-phan-biet-giai-cap-hero.jpg"),
        label: "Why Does Black Clover Keep Talking About Class Discrimination?",
        tag: "In-depth",
        date: "2026-10-06",
      },
    ] as Item[],
    allHref: `${OTAHUB}/en/`,
    allLabel: "Browse all news and reviews at OtaHub",
    allHint: "Games · Anime · Manga",
    allCta: "Go to OtaHub",
  },
};

function formatDate(iso: string, locale: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: locale === "vi" ? "2-digit" : "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Homepage-only editorial links to OtaHub (same ecosystem). Plain followed links:
// each card's title is the anchor, stretched over the whole card so it is fully clickable.
// Mobile: compact horizontal rows (6 tall cards would be a very long scroll); sm+: vertical cards in a grid.
export default function OtaHubLinks({ locale }: { locale: string }) {
  const c = locale === "vi" ? content.vi : content.en;
  return (
    <section className="otahub-links container-x py-10 sm:py-20 lg:py-24">
      <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.intro} />

      <ol className="mt-8 grid list-none gap-3.5 p-0 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {c.items.map((item, i) => (
          <li key={item.href}>
            <Reveal delay={i * 60} className="h-full">
              <article className="group relative flex h-full min-h-[7.5rem] flex-row overflow-hidden rounded-2xl border border-navy-100/70 bg-white transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-400 hover:border-orange-200 sm:min-h-0 sm:flex-col sm:hover:-translate-y-1 sm:hover:shadow-[0_28px_70px_-24px_rgba(1,47,135,0.3)]">
                <div className="relative w-[8.5rem] shrink-0 overflow-hidden bg-navy-50 sm:aspect-[16/9] sm:w-full">
                  <ResilientImage
                    src={item.img}
                    alt=""
                    width={1200}
                    height={675}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 via-transparent to-transparent" />
                  <span
                    aria-label={`${c.rankLabel} ${i + 1}`}
                    className={`absolute left-2 top-2 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-2 font-display text-xs font-extrabold text-white shadow-md sm:left-3.5 sm:top-3.5 sm:h-8 sm:min-w-[2rem] sm:text-sm ${
                      i === 0 ? "bg-orange-600" : "bg-navy-800/90 backdrop-blur-sm"
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <span className="absolute bottom-3.5 left-3.5 hidden rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-800 shadow-sm backdrop-blur-sm sm:inline-flex">
                    {item.tag}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-6">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wide text-orange-600 sm:hidden">
                    {item.tag}
                  </span>
                  <h3 className="mt-1 font-display text-[0.9375rem] font-extrabold leading-snug text-navy-800 transition-colors group-hover:text-orange-600 sm:mt-0 sm:text-xl">
                    <a
                      href={item.href}
                      className="line-clamp-3 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                    >
                      {item.label}
                    </a>
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs text-navy-500 sm:pt-5 sm:text-sm">
                    <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
                    <span
                      aria-hidden="true"
                      className="hidden items-center gap-1.5 font-semibold text-navy-700 transition-colors group-hover:text-orange-600 sm:inline-flex"
                    >
                      {c.readLabel}
                      <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-6 sm:mt-8">
        <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 p-5 text-white transition-shadow duration-300 focus-within:ring-2 focus-within:ring-orange-400 hover:shadow-[0_28px_70px_-24px_rgba(1,47,135,0.5)] sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-orange-400">{c.allHint}</span>
            <p className="mt-1.5 font-display text-lg font-extrabold leading-snug sm:text-xl">
              <a href={c.allHref} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                {c.allLabel}
              </a>
            </p>
          </div>
          <span
            aria-hidden="true"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-orange-600"
          >
            {c.allCta}
            <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Reveal>
    </section>
  );
}

type Item = { href: string; label: string; note?: string };

const content = {
  vi: {
    title: "Tin và phân tích từ OtaHub",
    intro: "OtaHub là trang tin game, anime và manga do ANBU vận hành. Một số bài đáng đọc gần đây:",
    items: [
      {
        href: "https://otahub.asia/cktg-2026-boc-tham-khi-nao-lich-thi-dau-theo-gio-viet-nam",
        label: "Lịch thi đấu Chung kết thế giới LMHT 2026 theo giờ Việt Nam",
        note: ": Play-In, vòng Thụy Sĩ, tứ kết, bán kết và chung kết.",
      },
      {
        href: "https://otahub.asia/choi-gi",
        label: "Gợi ý chơi gì, xem gì, đọc gì hôm nay",
        note: ": chọn tâm trạng để nhận gợi ý kèm review và điểm số.",
      },
      {
        href: "https://otahub.asia/dem-nguoc-gta-6",
        label: "Đếm ngược GTA 6 và những điều cần biết trước ngày ra mắt 19/11",
        note: ".",
      },
      {
        href: "https://otahub.asia/giftcode",
        label: "Tổng hợp giftcode game mới nhất, cập nhật mỗi thứ Hai",
        note: ".",
      },
      {
        href: "https://otahub.asia/death-stranding-2-review",
        label: "Review Death Stranding 2: chiến đấu tốt hơn, vẫn kén người chơi",
        note: ".",
      },
    ] as Item[],
    allHref: "https://otahub.asia/",
    allLabel: "Xem toàn bộ tin và bài đánh giá tại OtaHub",
  },
  en: {
    title: "News and analysis from OtaHub",
    intro: "OtaHub is a gaming, anime and manga news site run by ANBU. Recent articles worth reading:",
    items: [
      {
        href: "https://otahub.asia/en/worlds-2026-draw-when-schedule-vietnam-time",
        label: "Worlds 2026 schedule in Vietnam time",
        note: ": Play-In, Swiss Stage, quarterfinals, semifinals and the final.",
      },
      {
        href: "https://otahub.asia/en/choi-gi",
        label: "What to play, watch or read today",
        note: ": pick a mood and get a recommendation with a review and score.",
      },
      {
        href: "https://otahub.asia/en/gta-6-countdown",
        label: "GTA 6 countdown and what to know before November 19",
        note: ".",
      },
      {
        href: "https://otahub.asia/en/game-codes",
        label: "Latest game gift codes, updated every Monday",
        note: ".",
      },
      {
        href: "https://otahub.asia/en/death-stranding-2-review",
        label: "Death Stranding 2 review: better combat, still not for everyone",
        note: ".",
      },
    ] as Item[],
    allHref: "https://otahub.asia/en/",
    allLabel: "Browse all news and reviews at OtaHub",
  },
};

// Homepage-only editorial links to OtaHub (same ecosystem). Plain followed links.
export default function OtaHubLinks({ locale }: { locale: string }) {
  const c = locale === "vi" ? content.vi : content.en;
  return (
    <section className="otahub-links container-x py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-xl font-extrabold text-navy-800 sm:text-2xl">{c.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-navy-500 sm:text-base">{c.intro}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-navy-500 sm:text-base">
          {c.items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="link-underline font-semibold text-navy-700">
                {item.label}
              </a>
              {item.note}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm sm:text-base">
          <a href={c.allHref} className="link-underline font-semibold text-navy-700">
            {c.allLabel}
          </a>
          .
        </p>
      </div>
    </section>
  );
}

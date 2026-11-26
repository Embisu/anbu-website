import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { localePath } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";

type Sample = {
  file: string; // /work/creative/<file>.mp4 and .jpg poster
  ratio: "1:1" | "16:9";
  lang: string;
  title: { vi: string; en: string };
  text: { vi: string; en: string };
};

type Group = {
  id: string;
  title: { vi: string; en: string };
  intro: { vi: string; en: string };
  samples: Sample[];
  projectSlug?: string;
};

const groups: Group[] = [
  {
    id: "genz-the-last-war",
    title: { vi: "GenZ: The Last War", en: "GenZ: The Last War" },
    intro: {
      vi: "Ba bản cắt quảng cáo hiệu suất với giao diện chơi game dựng sẵn, cùng một thẻ kết thúc ưu đãi “Free VIP 5 & 300 summons”.",
      en: "Three performance ad cuts with fake-gameplay UI, all closing on the same “Free VIP 5 & 300 summons” offer card.",
    },
    samples: [
      {
        file: "genz-the-last-war-1",
        ratio: "1:1",
        lang: "English",
        title: { vi: "Lộ diện anh hùng & bảng phần thưởng", en: "Hero reveal & reward panel" },
        text: {
          vi: "Anh hùng 5 sao bước lên sân khấu trong khi bảng phần thưởng đầy dần, rồi cắt sang thẻ ưu đãi.",
          en: "A five-star hero takes the stage while the reward panel fills with loot, then cuts to the offer card.",
        },
      },
      {
        file: "genz-the-last-war-2",
        ratio: "1:1",
        lang: "English",
        title: { vi: "Trình diễn kỹ năng", en: "Skill showcase" },
        text: {
          vi: "Hiệu ứng kỹ năng mạnh trên sân khấu khoa học viễn tưởng neon, dẫn tới thẻ ưu đãi.",
          en: "Big-impact skill effects on a neon sci-fi stage, building to the offer card.",
        },
      },
      {
        file: "genz-the-last-war-wide",
        ratio: "16:9",
        lang: "English",
        title: { vi: "Trận đấu toàn đội", en: "Squad battle" },
        text: {
          vi: "Một trận đánh nhiều đợt cả đội ở khung ngang, kết bằng ưu đãi và badge App Store / Google Play.",
          en: "A full-squad wave fight in widescreen, ending on the offer and App Store / Google Play badges.",
        },
      },
    ],
  },
  {
    id: "pirate-war",
    title: { vi: "Pirate War 海賊大戰", en: "Pirate War 海賊大戰" },
    intro: {
      vi: "Quảng cáo cho game di động chủ đề One Piece, mở bằng vòng quay gacha và kết bằng thẻ chữ Hán phồn thể.",
      en: "An ad for a One Piece-themed mobile game, opening on a gacha wheel and closing on a Traditional Chinese end card.",
    },
    samples: [
      {
        file: "pirate-war",
        ratio: "1:1",
        lang: "繁體中文",
        title: { vi: "Vòng quay gacha & đối đầu Gear 4", en: "Gacha wheel & Gear 4 showdown" },
        text: {
          vi: "Vòng quay chọn anh hùng, cảnh đánh cắt nhanh và thẻ kết thúc có logo game cùng lời nhắc tìm kiếm.",
          en: "A hero-draw wheel, a rapid-cut fight and an end card with the game logo and a search prompt.",
        },
      },
    ],
  },
  {
    id: "pixel-dai-chien",
    title: { vi: "Pixel Đại Chiến", en: "Pixel Đại Chiến" },
    intro: {
      vi: "Hai clip giả giao diện chơi game cho game đấu tướng pixel đầu tiên tại Việt Nam.",
      en: "Two fake-gameplay UI clips for the first pixel hero-battler in Vietnam.",
    },
    samples: [
      {
        file: "pixel-dai-chien-map",
        ratio: "16:9",
        lang: "Tiếng Việt",
        title: { vi: "Clip chiến đấu theo bản đồ", en: "Map-based battle clip" },
        text: {
          vi: "Những trận đấu trên các bản đồ phong cách anime kèm minimap, lần lượt qua nhiều anh hùng crossover trước thẻ kết thúc.",
          en: "Fights across anime-style maps with a mini-map overlay, cycling through crossover heroes before the end card.",
        },
      },
      {
        file: "pixel-dai-chien-ui",
        ratio: "16:9",
        lang: "Tiếng Việt",
        title: { vi: "Màn pixel kiểu Mario × lộ diện anh hùng", en: "Retro platformer × hero reveal" },
        text: {
          vi: "Màn pixel kiểu Mario chuyển sang “Round 2” và màn lộ diện Sung Jin-Woo, rồi tới bàn chơi trong game và badge cửa hàng.",
          en: "A Mario-style pixel stage opens into a “Round 2” transition and a Sung Jin-Woo reveal, then the in-game board and store badges.",
        },
      },
    ],
  },
  {
    id: "demon-king-legend",
    title: { vi: "Demon King: Legend", en: "Demon King: Legend" },
    intro: {
      vi: "Quảng cáo cho game chủ đề Demon Slayer, mở bằng một câu hỏi để gợi tò mò.",
      en: "An ad for a Demon Slayer-themed game that opens with a question to spark curiosity.",
    },
    samples: [
      {
        file: "demon-king-legend",
        ratio: "16:9",
        lang: "Tiếng Việt",
        title: { vi: "“Ai là kẻ mạnh nhất?”", en: "“Who is the strongest?”" },
        text: {
          vi: "Màn lộ diện thẻ anh hùng mở đầu trận đánh cắt nhanh có hiệu ứng kỹ năng lớn, kết bằng thẻ có link web và badge cửa hàng.",
          en: "A hero-card reveal opens a fast-cut battle with big skill effects, closing on an end card with the site link and store badges.",
        },
      },
    ],
  },
  {
    id: "production-and-ooh",
    title: { vi: "Sản xuất & OOH", en: "Production & OOH" },
    intro: {
      vi: "Phim quảng cáo live-action và phim tổng kết chiến dịch OOH. Phần đầy đủ nằm trong trang dự án tương ứng.",
      en: "A live-action ad film and an OOH campaign recap. The full cases live on their project pages.",
    },
    samples: [
      {
        file: "mu-vinh-du-ad",
        ratio: "16:9",
        lang: "Tiếng Việt",
        title: { vi: "MU: Vinh Dự — phim quảng cáo live-action", en: "MU: Vinh Dự — live-action ad film" },
        text: {
          vi: "Tiểu phẩm hài có nhân vật hóa trang, cắt vào cảnh chơi game để giải thích lớp nhân vật và chiến đấu tự động.",
          en: "A comedic skit with costumed characters, cutting to in-game footage that explains class choice and auto-combat.",
        },
      },
      {
        file: "honkai-3rd-anniversary-ooh",
        ratio: "16:9",
        lang: "Multi-language",
        title: { vi: "Honkai Impact 3rd — tổng kết OOH sinh nhật 3 năm", en: "Honkai Impact 3rd — 3rd Anniversary OOH recap" },
        text: {
          vi: "Phim tổng kết các điểm OOH tại sáu thành phố Đông Nam Á.",
          en: "A recap film of out-of-home sites across six Southeast Asian cities.",
        },
      },
    ],
  },
];

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const isVi = locale === "vi";
  return buildMetadata({
    locale,
    path: "/work/creative",
    title: isVi
      ? "Mẫu Creative: Video quảng cáo game, phim production & OOH | ANBU Agency"
      : "Creative Samples: Game Video Ads, Production Films & OOH | ANBU Agency",
    description: isVi
      ? "Các mẫu creative do ANBU thực hiện: video quảng cáo hiệu suất với giao diện chơi game dựng sẵn, phim quảng cáo live-action và phim tổng kết OOH."
      : "Creative samples by ANBU: performance video ads with fake-gameplay UI, live-action ad films and OOH recap films.",
  });
}

export default async function CreativeSamplesPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const vi = locale === "vi";

  const breadcrumbs = breadcrumbLd(
    [
      { name: vi ? "Trang chủ" : "Home", path: "/" },
      { name: dict.nav.work, path: "/work" },
      { name: vi ? "Mẫu creative" : "Creative samples", path: "/work/creative" },
    ],
    locale
  );

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PageHero
        eyebrow={vi ? "Creative" : "Creative"}
        title={vi ? "Mẫu creative: từ video quảng cáo đến phim production" : "Creative samples: from video ads to production films"}
        subtitle={
          vi
            ? "Ngoài media và creator, ANBU tự làm cả creative: video quảng cáo hiệu suất với giao diện chơi game dựng sẵn, phim live-action và phim tổng kết OOH, bằng tiếng Anh, tiếng Trung phồn thể và tiếng Việt."
            : "Beyond media and creators, ANBU makes the creative itself: performance video ads with fake-gameplay UI, live-action films and OOH recaps, in English, Traditional Chinese and Vietnamese."
        }
      />

      <div className="container-x space-y-16 py-12 sm:space-y-20 sm:py-16">
        {groups.map((group) => (
          <section key={group.id} id={group.id}>
            <Reveal>
              <h2 className="font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">
                {group.title[locale]}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-500 sm:text-base">{group.intro[locale]}</p>
            </Reveal>
            <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.samples.map((s) => (
                <Reveal key={s.file}>
                  <figure className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-[0_18px_50px_-30px_rgba(1,47,135,0.35)]">
                    <div className={`${s.ratio === "1:1" ? "aspect-square" : "aspect-video"} bg-navy-900`}>
                      <video
                        controls
                        playsInline
                        preload="none"
                        poster={`/work/creative/${s.file}.jpg`}
                        className="h-full w-full object-cover"
                        aria-label={s.title[locale]}
                      >
                        <source src={`/work/creative/${s.file}.mp4`} type="video/mp4" />
                      </video>
                    </div>
                    <figcaption className="p-5">
                      <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">{s.ratio}</span>
                        <span className="rounded-full bg-navy-50 px-2.5 py-1 text-navy-600">{s.lang}</span>
                      </div>
                      <p className="mt-3 font-display text-base font-bold text-navy-800">{s.title[locale]}</p>
                      <p className="mt-1 text-sm leading-relaxed text-navy-500">{s.text[locale]}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            {group.id === "production-and-ooh" && (
              <p className="mt-5 text-sm text-navy-500">
                <Link href={localePath(locale, "/work/mu-vinh-du-game")} className="font-semibold text-orange-600 hover:underline">
                  MU: Vinh Dự
                </Link>
                {" · "}
                <Link href={localePath(locale, "/work/honkai-impact-3-birthday")} className="font-semibold text-orange-600 hover:underline">
                  Honkai Impact 3
                </Link>
              </p>
            )}
          </section>
        ))}
      </div>

      <CTASection locale={locale} dict={dict} />
    </>
  );
}

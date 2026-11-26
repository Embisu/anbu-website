import type { L10n } from "./site";

/**
 * Verifiable supporting material for each case study: public reach signals,
 * creators, press coverage and campaign media. Figures are public numbers
 * (or taken from the campaign report where noted) and are rounded DOWN.
 * Video views are whole-video counts. Last checked: Nov 2026.
 */

const l = (vi: string, en: string): L10n => ({ vi, en });

export type EvidenceSignal = { value: string; label: L10n; note?: L10n };
export type EvidenceLink = { label: string | L10n; url: string };
export type EvidenceCreator = {
  name: string;
  platform: string;
  audience?: string; // e.g. "37.1K subscribers"
  views?: string; // e.g. "~14.9K views"
  reach?: string;
  clicks?: string;
  note?: L10n;
  links: EvidenceLink[];
};
export type EvidencePress = { outlet: string; date: string; title: L10n; url: string };
export type EvidenceScope = { title: L10n; items: { title: L10n; text: L10n }[] };
export type EvidenceMedia = {
  type: "video" | "image";
  src: string;
  poster?: string;
  ratio: "16:9" | "1:1";
  title: L10n;
  caption?: L10n;
};
export type ProjectEvidence = {
  signals?: EvidenceSignal[];
  signalsNote?: L10n;
  creators?: EvidenceCreator[];
  press?: EvidencePress[];
  scope?: EvidenceScope[];
  media?: EvidenceMedia[];
};

const press = (outlet: string, date: string, vi: string, en: string, url: string): EvidencePress => ({
  outlet,
  date,
  title: l(vi, en),
  url,
});

export const projectEvidenceBySlug: Record<string, ProjectEvidence> = {
  // ───────────────────────────────────────── Summoners War: Chronicles
  "summoners-war-chronicles": {
    creators: [
      {
        name: "Tokyo Gaming",
        platform: "Facebook Live",
        note: l("Livestream #1 kèm bài CTA bonus · 10/03/2023", "Livestream #1 with bonus CTA post · 10 Mar 2023"),
        links: [
          { label: "Livestream", url: "https://www.facebook.com/PH.TokyoGaming/videos/151825584442499/" },
          { label: "CTA", url: "https://www.facebook.com/photo?fbid=626531449487865" },
        ],
      },
      {
        name: "OMG Network",
        platform: "Facebook Live",
        note: l("Livestream #1 kèm bài thông báo Bonus 1 · 11/03/2023", "Livestream #1 with Bonus 1 announcement post · 11 Mar 2023"),
        links: [
          { label: "Livestream", url: "https://www.facebook.com/omgnetworkph/videos/903944990927459/" },
          {
            label: "Bonus 1",
            url: "https://www.facebook.com/omgnetworkph/posts/pfbid0gncwEJ8gyBNz1MsmF27xyDe5PT76yixKGosRrPmtCcLWoPdV3xqFpZA48i7j",
          },
        ],
      },
      {
        name: "鬼眼丹丹Evy",
        platform: "Facebook Live",
        note: l("Livestream #1 · 11/03/2023", "Livestream #1 · 11 Mar 2023"),
        links: [{ label: "Livestream", url: "https://www.facebook.com/watch/live/?ref=watch_permalink&v=222545410179751" }],
      },
      {
        name: "Hailey哈雷z",
        platform: "Facebook Live",
        note: l("Livestream #1 · 13/03/2023", "Livestream #1 · 13 Mar 2023"),
        links: [{ label: "Livestream", url: "https://www.facebook.com/watch/live/?ref=watch_permalink&v=594758629337279" }],
      },
      {
        name: "KristianPHYT",
        platform: "Facebook Reel",
        note: l("Reel giới thiệu game", "Game introduction reel"),
        links: [{ label: "Reel", url: "https://www.facebook.com/reel/636458181145585" }],
      },
      {
        name: "King Spade",
        platform: "YouTube",
        audience: "37.1K subscribers",
        views: "~2K views",
        note: l(
          "“11 Things You Should Know for One Punch Man x Summoners War Chronicles” · 28/04/2023",
          "“11 Things You Should Know for One Punch Man x Summoners War Chronicles” · 28 Apr 2023"
        ),
        links: [{ label: "Video", url: "https://youtu.be/FpXmZucZz9s" }],
      },
    ],
  },

  // ───────────────────────────────────────── MapleStory R: Evolution
  "maplestory-r-evolution": {
    signals: [
      {
        value: "14K+",
        label: l("Lượt xem video Review Game", "Views on the Review Game video"),
        note: l("Kênh YouTube 227K subscriber", "YouTube channel with 227K subscribers"),
      },
    ],
    creators: [
      {
        name: "Review Game",
        platform: "YouTube",
        audience: "227K subscribers",
        views: "~14.9K views",
        note: l(
          "Video trải nghiệm bản tiếng Việt ngày ra mắt",
          "Launch-time hands-on of the Vietnamese edition"
        ),
        links: [{ label: "Video", url: "https://youtu.be/-4q0MP31RJw" }],
      },
      {
        name: "Thủy Tiên",
        platform: "Streamer",
        note: l(
          "Chơi trực tiếp trên điện thoại, giới thiệu ưu đãi và quà tặng. Link video gốc không còn truy cập được.",
          "Live phone gameplay presenting launch offers and gifts. The original video link is no longer available."
        ),
        links: [],
      },
      {
        name: "@liah.24",
        platform: "TikTok",
        note: l("Video TikTok trải nghiệm game", "TikTok gameplay video"),
        links: [{ label: "TikTok", url: "https://www.tiktok.com/@liah.24/video/7309696758198635777" }],
      },
      {
        name: "@thneroblox",
        platform: "TikTok",
        note: l("Video TikTok trải nghiệm game", "TikTok gameplay video"),
        links: [{ label: "TikTok", url: "https://www.tiktok.com/@thneroblox/video/7309804975159332104" }],
      },
    ],
    press: [
      press(
        "2Game",
        "2023-07-19",
        "MapleStory R: Evolution – Phiên bản được cải tiến sáng tạo với nhiều tính năng mới",
        "MapleStory R: Evolution – an inventive upgrade with many new features",
        "https://2game.vn/maplestory-r-evolution-phien-ban-duoc-cai-tien-sang-tao-voi-nhieu-tinh-nang-moi-post384552.html"
      ),
      press(
        "GameK",
        "2023-12-07",
        "MapleStory R: Evolution chính thức ra mắt tại Việt Nam, mang đến cho người chơi những chuyến phiêu lưu hấp dẫn, cùng với nhiều ưu đãi khi mở máy chủ!",
        "MapleStory R: Evolution officially launches in Vietnam with new adventures and launch-server perks",
        "https://gamek.vn/maplestory-r-evolution-chinh-thuc-ra-mat-tai-viet-nam-mang-den-cho-nguoi-choi-nhung-chuyen-phieu-luu-hap-dan-cung-voi-nhieu-uu-dai-khi-mo-may-chu-178231207123602311.chn"
      ),
      press(
        "XemGame",
        "2023-12-08",
        "Trải nghiệm MapleStory R: Evolution: Đồ họa cute, hệ thống và tính năng bài bản, có chiều sâu",
        "Hands-on MapleStory R: Evolution – cute visuals, well-built systems with real depth",
        "https://www.xemgame.com/trai-nghiem-maplestory-r-evolution-post516880.html"
      ),
    ],
  },

  // ───────────────────────────────────────── Life Makeover
  "life-makeover": {
    signals: [
      {
        value: "2M+",
        label: l("Lượt đăng ký trước tại Việt Nam", "Pre-registrations in Vietnam"),
        note: l(
          "Trước ngày ra mắt 10/05/2023 · số liệu của game, theo GameK",
          "Before the 10 May 2023 launch · game-level figure, per GameK"
        ),
      },
      {
        value: "780K+",
        label: l("Lượt xem video meGAME", "Views on the meGAME video"),
        note: l(
          "Kênh 2.57M subscriber · số của cả video, có đoạn giới thiệu Life Makeover",
          "Channel with 2.57M subscribers · whole-video count, includes a Life Makeover segment"
        ),
      },
    ],
    creators: [
      {
        name: "meGAME",
        platform: "YouTube",
        audience: "2.57M subscribers",
        views: "~780K views",
        note: l(
          "Video về game mobile tuổi thơ, kèm đoạn giới thiệu Life Makeover và link đăng ký sớm · 24/03/2023",
          "Video on childhood mobile games with a Life Makeover segment and early-access link · 24 Mar 2023"
        ),
        links: [{ label: "Video", url: "https://youtu.be/28_xUOUw0vg" }],
      },
    ],
    press: [
      press("Thể thao & Văn hóa", "2023-01-14", "Life Makeover - Game thời trang mô phỏng cuộc sống chính thức mở đăng ký!", "Life Makeover – the life-simulation fashion game opens pre-registration", "https://thethaovanhoa.vn/life-makeover-game-thoi-trang-mo-phong-cuoc-song-chinh-thuc-mo-dang-ky-20230113235245326.htm"),
      press("GameK", "2023-04-28", "Life Makeover vượt 2 triệu lượt đăng ký trước ngày ra mắt vào mùng 10 tháng 5", "Life Makeover passes 2 million pre-registrations before its 10 May launch", "https://gamek.vn/life-makeover-vuot-2-trieu-luot-dang-ky-truoc-ngay-ra-mat-vao-mung-10-thang-5-178230427211725365.chn"),
      press("GameK", "2023-05-10", "Cùng trải nghiệm thế giới ảo bất tận của Tựa Game Mô Phỏng - Life Makeover", "Explore the endless virtual world of the simulation game Life Makeover", "https://gamek.vn/cung-trai-nghiem-the-gioi-ao-bat-tan-cua-tua-game-mo-phong-life-makeover-178230509164840526.chn"),
      press("ELLE Vietnam", "2023-05-10", "Life Makeover: Cùng bạn bè bước vào thế giới thời trang ảo", "Life Makeover: step into the virtual fashion world with friends", "https://www.elle.vn/trai-nghiem/life-makeover-game-thoi-trang/"),
      press("XemGame", "2023-05-31", "Life Makeover ra mắt Big Update đầu tiên “Hồng Đêm Mơ Mộng”", "Life Makeover releases its first Big Update, “Dreamy Night Rose”", "https://www.xemgame.com/life-makeover-ra-mat-big-update-dau-tien-hong-dem-mo-mong-post497790.html"),
      press("GameK", "2023-08-04", "Trải nghiệm những khả năng vô hạn trong Life Makeover với đôi cánh ước mơ", "Endless possibilities in Life Makeover with the Wings of Dreams update", "https://gamek.vn/trai-nghiem-nhung-kha-nang-vo-han-trong-life-makeover-voi-doi-canh-uoc-mo-178230804110125792.chn"),
    ],
  },

  // ───────────────────────────────────────── Soul Land: Soul Master Duel
  "douluo-soul-master-duel": {
    signals: [
      { value: "800K+", label: l("Lượt xem video KOL", "Creator video views"), note: l("Per Official ~690K · Misthy ~113K · Thảo Nari ~4.6K", "Per Official ~690K · Misthy ~113K · Thảo Nari ~4.6K") },
      {
        value: "300K+",
        label: l("Lượt đăng ký trước", "Pre-registrations"),
        note: l("Mốc ngày 05/04/2022 · số liệu của game, theo XemGame", "Milestone on 5 Apr 2022 · game-level figure, per XemGame"),
      },
      { value: "1.4M+", label: l("Subscriber hai kênh YouTube", "Subscribers across two YouTube channels"), note: l("Per Official 885K + Misthy 519K", "Per Official 885K + Misthy 519K") },
    ],
    creators: [
      {
        name: "Per Official",
        platform: "YouTube",
        audience: "885K subscribers",
        views: "~690K views",
        note: l("“Cup kiến thức Đấu La Đại Lục Mở Rộng”", "“Soul Land Expanded Knowledge Cup”"),
        links: [{ label: "Video", url: "https://youtu.be/BYim1DhGg6k" }],
      },
      {
        name: "MISTHY PLAY",
        platform: "YouTube",
        audience: "519K subscribers",
        views: "~113K views",
        note: l("Misthy lần đầu chơi Đấu La Đại Lục, quay tướng may mắn", "Misthy plays Soul Land for the first time with a lucky summon"),
        links: [{ label: "Video", url: "https://youtu.be/ftK3RY5bRqw" }],
      },
      {
        name: "Thảo Nari",
        platform: "Facebook",
        views: "~4.6K views · 1.4K reactions",
        note: l("Video kèm link tải game và giftcode riêng", "Video with download link and a creator-specific giftcode"),
        links: [{ label: "Video", url: "https://www.facebook.com/share/v/1G1QKmMzni/" }],
      },
    ],
    press: [
      press("GameK", "2022-03-25", "Đấu La Đại Lục chính thức mở đăng ký tải game trước, nhanh tay sẽ nhận được combo quà cực khủng này!", "Soul Land opens pre-registration — grab the huge gift combo", "https://gamek.vn/dau-la-dai-luc-chinh-thuc-mo-dang-ky-tai-game-truoc-nhanh-tay-se-nhan-duoc-combo-qua-cuc-khung-nay-20220325104817985.chn"),
      press("XemGame", "2022-04-05", "Đấu La Đại Lục: Hồn Sư Đối Quyết Funtap cán mốc 300.000 lượt đăng ký", "Soul Land: Soul Master Duel by Funtap hits 300,000 pre-registrations", "https://www.xemgame.com/dau-la-dai-luc-hon-su-doi-quyet-funtap-co-300-nghin-luot-dang-ky-truoc-post448862.html"),
      press("GameK", "2022-04-21", "Đấu La Đại Lục – Hồn Sư Đối Quyết chính thức Open Beta hôm nay, chiêu đãi Hồn Sư loạt GIFTCODE cực HOT!", "Soul Master Duel opens Open Beta today with hot giftcodes", "https://gamek.vn/dau-la-dai-luc-hon-su-doi-quyet-chinh-thuc-open-beta-hom-nay-chieu-dai-hon-su-loat-giftcode-cuc-hot-20220420161347936.chn"),
      press("XemGame", "2022-04-25", "3 mẹo mà các tân thủ của Đấu La Đại Lục: Hồn Sư Đối Quyết Funtap luôn phải ghi nhớ", "3 tips every Soul Master Duel newcomer should remember", "https://www.xemgame.com/3-meo-tan-thu-dau-la-dai-luc-hon-su-doi-quyet-funtap-ghi-nho-post451593.html"),
      press("XemGame", "2022-05-01", "Top đội hình hữu dụng nhất trong Đấu La Đại Lục: Hồn Sư Đối Quyết", "Top most useful lineups in Soul Master Duel", "https://www.xemgame.com/top-doi-hinh-huu-dung-nhat-trong-dau-la-dai-luc-hon-su-doi-quyet-post452677.html"),
    ],
    scope: [
      {
        title: l("Quản lý cộng đồng", "Community management"),
        items: [
          { title: l("Vận hành fanpage & group", "Fanpage & group operations"), text: l("Trả lời hằng ngày và giữ nhịp đăng bài đều từ đăng ký trước đến Open Beta.", "Daily replies and a steady posting rhythm from pre-registration through Open Beta.") },
          { title: l("Giftcode & minigame", "Giftcodes & mini-games"), text: l("Giftcode riêng theo từng creator (như VN999 trong bài của Thảo Nari) và minigame giữ chân người chơi.", "Creator-specific giftcodes (like VN999 in Thảo Nari's post) and mini-games that keep players coming back.") },
          { title: l("Kiểm duyệt & phản hồi", "Moderation & feedback"), text: l("Giữ thảo luận lành mạnh, tổng hợp phản hồi và lỗi người chơi gửi lại cho nhà phát hành.", "Keeping conversations healthy and turning player feedback and bug reports into notes for the publisher.") },
        ],
      },
      {
        title: l("Seeding", "Seeding"),
        items: [
          { title: l("Seeding group & diễn đàn", "Group & forum seeding"), text: l("Chia sẻ trải nghiệm tự nhiên ở từng mốc: đăng ký trước, Open Beta, cập nhật.", "Natural experience-sharing at every milestone — pre-registration, Open Beta, updates.") },
          { title: l("Seeding nội dung hướng dẫn", "Guide-style seeding"), text: l("Mẹo tân thủ và top đội hình, bám theo chủ đề các bài XemGame để kéo dài độ phủ.", "Beginner tips and top lineups that mirror the XemGame articles, stretching their reach.") },
          { title: l("Khuếch đại creator & báo chí", "Amplifying creators & press"), text: l("Đưa video creator và bài báo trở lại cộng đồng để tăng lượt xem, lượt đăng ký.", "Feeding creator videos and press coverage back into the community for more views and sign-ups.") },
        ],
      },
    ],
  },

  // ───────────────────────────────────────── Epic War: Thrones
  "epic-war-thrones": {
    signals: [
      { value: "120K+", label: l("Lượt xem video KOL", "Creator video views"), note: l("Game Cực Hay ~106K · Akari Gaming ~8.6K · Moon Su ~5.5K", "Game Cực Hay ~106K · Akari Gaming ~8.6K · Moon Su ~5.5K") },
      { value: "1M+", label: l("Subscriber ba kênh YouTube", "Subscribers across three YouTube channels"), note: l("Tiềm năng tiếp cận, không phải số người xem", "Potential reach, not viewers") },
    ],
    creators: [
      { name: "Game Cực Hay", platform: "YouTube", audience: "615K subscribers", views: "~106K views", note: l("“Epic War: Thrones có đáng chơi?” · 26/09/2021", "“Is Epic War: Thrones worth playing?” · 26 Sep 2021"), links: [{ label: "Video", url: "https://youtu.be/KcdOT5ZftFc" }] },
      { name: "Akari Gaming", platform: "YouTube", audience: "310K subscribers", views: "~8.6K views", note: l("Game chiến thuật Tam Quốc đồ họa cực khủng", "Three Kingdoms strategy game with stunning graphics"), links: [{ label: "Video", url: "https://youtu.be/vx8U_yF30TE" }] },
      { name: "Moon Su", platform: "YouTube", audience: "100K subscribers", views: "~5.5K views", note: l("Hồng Đồ Chi Hạ chính thức ra mắt tại Việt Nam", "Hồng Đồ Chi Hạ officially launches in Vietnam"), links: [{ label: "Video", url: "https://youtu.be/VjvO72Uk7G0" }] },
    ],
    press: [
      press("Thanh Niên", "2021-02-01", "‘Siêu phẩm’ Hồng Đồ Chi Hạ chuẩn bị ra mắt phiên bản quốc tế", "‘Masterpiece’ Hồng Đồ Chi Hạ prepares an international release", "https://thanhnien.vn/sieu-pham-hong-do-chi-ha-chuan-bi-ra-mat-phien-ban-quoc-te-1851149056.htm"),
      press("Thanh Niên", "2021-02-19", "‘Bom tấn’ Hồng Đồ Chi Hạ sắp có phiên bản hỗ trợ tiếng Việt", "‘Blockbuster’ Hồng Đồ Chi Hạ gets a Vietnamese-language version soon", "https://thanhnien.vn/bom-tan-hong-do-chi-ha-sap-co-phien-ban-ho-tro-tieng-viet-1851149137.htm"),
      press("2Game", "2021-04-06", "Đánh giá Epic War: Thrones - Siêu phẩm chiến thuật với lối chơi cực khó", "Epic War: Thrones review — a strategy masterpiece with brutal difficulty", "https://2game.vn/danh-gia-epic-war-thrones-sieu-pham-chien-thuat-voi-loi-choi-cuc-kho-post299914.html"),
      press("2Game", "2021-04-25", "Epic War: Thrones và những đạo lý quan trọng để làm bá chủ Tam Quốc", "Epic War: Thrones and the key principles for ruling the Three Kingdoms", "https://2game.vn/epic-war-thrones-va-nhung-dao-ly-quan-trong-de-lam-ba-chu-tam-quoc-post302108.html"),
      press("GameK", "2021-11-03", "Hồng Đồ Chi Hạ - Epic War ra mắt thị trường Việt, cùng bạn tranh bá xưng vương!", "Hồng Đồ Chi Hạ – Epic War launches in Vietnam: fight for supremacy", "https://gamek.vn/hong-do-chi-ha-epic-war-ra-mat-thi-truong-viet-cung-ban-tranh-ba-xung-vuong-20211028103814649.chn"),
    ],
  },

  // ───────────────────────────────────────── Silkroad Origin Mobile
  "silkroad-origin-mobile": {
    signals: [
      {
        value: "1M+",
        label: l("Người chơi trong 6 tháng đầu tại Đông Nam Á", "Players within 6 months of the Southeast Asia launch"),
        note: l("Số liệu do nhà phát hành công bố, theo VnExpress 02/2025 · số của game", "Publisher-reported, per VnExpress (Feb 2025) · game-level figure"),
      },
    ],
    press: [
      press("XemGame", "2021-02-01", "Silkroad Mobile chính thức mở cửa Closed Beta vào ngày hôm nay 01/02", "Silkroad Mobile opens Closed Beta today, 1 Feb", "https://www.xemgame.com/silkroad-mobile-closed-beta-mo-cua-post398197.html"),
      press("VnExpress", "2024-07-03", "Gosu phát hành Con đường tơ lụa mobile tại Đông Nam Á", "GOSU publishes Silkroad Mobile across Southeast Asia", "https://vnexpress.net/gosu-phat-hanh-con-duong-to-lua-mobile-tai-dong-nam-a-4765650.html"),
      press("XemGame", "2024-07-03", "Silkroad Origin Mobile: GOSU mang Con Đường Tơ Lụa Huyền Thoại quay lại", "Silkroad Origin Mobile: GOSU brings the legendary Silk Road back", "https://www.xemgame.com/silkroad-origin-mobile-gosu-mang-con-duong-to-lua-huyen-thoai-quay-lai-post535276.html"),
      press("VnExpress", "2025-02-11", "Game Con Đường Tơ Lụa mobile phát hành tại Việt Nam", "Silkroad mobile game launches in Vietnam", "https://vnexpress.net/game-con-duong-to-lua-mobile-phat-hanh-tai-viet-nam-4847402.html"),
      press("CafeBiz", "2025-02-13", "Huyền Thoại Lữ Khách: Khi hồi ức Silkroad Online sống lại trong cộng đồng game thủ Việt", "Huyền Thoại Lữ Khách: when Silkroad Online memories come alive in the Vietnamese gaming community", "https://cafebiz.vn/huyen-thoai-lu-khach-khi-hoi-uc-silkroad-online-song-lai-trong-cong-dong-game-thu-viet-176250213092131562.chn"),
    ],
    scope: [
      {
        title: l("Quản lý cộng đồng (CMM)", "Community management (CMM)"),
        items: [
          { title: l("Kênh cộng đồng chính thức", "Official community channels"), text: l("Vận hành fanpage và group suốt giai đoạn ra mắt tại Việt Nam: bài đăng hằng ngày, trả lời và thông báo sự kiện.", "Running the fanpage and groups through the Vietnam launch — daily posts, replies and event announcements.") },
          { title: l("Gắn kết bằng hoài niệm", "Nostalgia-led engagement"), text: l("Nội dung chạm vào ký ức Silkroad Online để kéo người chơi cũ quay lại.", "Content that plays on memories of Silkroad Online to bring lapsed players back.") },
          { title: l("Kiểm duyệt & vòng phản hồi người chơi", "Moderation & player-support loop"), text: l("Kiểm duyệt thảo luận và chuyển phản hồi, vấn đề của người chơi cho nhà phát hành.", "Moderating discussion and passing player feedback and issues to the publisher.") },
        ],
      },
      {
        title: l("Hỗ trợ ra mắt", "Launch support"),
        items: [
          { title: l("Đồng bộ báo chí & cộng đồng", "Press & community alignment"), text: l("Giữ thông báo, báo chí và bài đăng cộng đồng cùng nhịp ở từng cột mốc.", "Keeping announcements, press and community posts in step at every milestone.") },
          { title: l("Sự kiện & giveaway", "Events & giveaways"), text: l("Sự kiện và giveaway cộng đồng để duy trì độ sôi động sau ra mắt.", "Community events and giveaways to keep activity high after launch.") },
        ],
      },
    ],
  },

  // ───────────────────────────────────────── AFK Arena
  "afk-arena": {
    scope: [
      {
        title: l("Cách làm nội dung", "Content approach"),
        items: [
          { title: l("Khung thương hiệu thống nhất", "A consistent branded frame"), text: l("Gameplay của streamer được đặt trong khung có key art, giftcode hiển thị trên màn hình và badge App Store / Google Play.", "Streamer gameplay sits in a frame with key art, an on-screen giftcode and App Store / Google Play badges.") },
          { title: l("Giftcode làm nút chuyển đổi", "Giftcode as the conversion driver"), text: l("Mã quà cho người xem một lý do để cài và chơi ngay hôm nay.", "The giftcode gives viewers a reason to install and play today, not someday.") },
          { title: l("Có phụ đề", "Subtitled"), text: l("Video gameplay có phụ đề để xem được cả khi tắt tiếng.", "Gameplay walkthroughs carry subtitles so they work with the sound off.") },
        ],
      },
    ],
  },

  // ───────────────────────────────────────── Honkai Impact 3
  "honkai-impact-3-birthday": {
    signals: [
      {
        value: "7",
        label: l("Điểm OOH trong video tổng kết", "OOH sites in the recap film"),
        note: l(
          "Bangkok, TP.HCM, Hà Nội, Kuala Lumpur, Jakarta (2 điểm), Singapore",
          "Bangkok, Ho Chi Minh City, Hanoi, Kuala Lumpur, Jakarta (2 sites), Singapore"
        ),
      },
      { value: "6", label: l("Thành phố", "Cities"), note: l("Thái Lan · Việt Nam · Malaysia · Indonesia · Singapore", "Thailand · Vietnam · Malaysia · Indonesia · Singapore") },
      { value: "5", label: l("Quốc gia", "Countries") },
    ],
    signalsNote: l(
      "Đếm từ video tổng kết chiến dịch. Con số 20M+ tiếp cận ở đầu trang là số liệu của chiến dịch do ANBU xác nhận.",
      "Counted from the campaign recap film. The 20M+ reach figure at the top of this page is the campaign result confirmed by ANBU."
    ),
    scope: [
      {
        title: l("Sự kiện offline tại Việt Nam", "Vietnam offline event"),
        items: [
          { title: l("Chuẩn bị quà cho sự kiện", "Event gift preparation"), text: l("Lên kế hoạch và chuẩn bị quà cho sự kiện offline tại Việt Nam trong khuôn khổ chiến dịch sinh nhật 3 năm.", "Planning and preparing the gifts for the Vietnam event as part of the 3rd-anniversary campaign.") },
        ],
      },
    ],
    media: [
      {
        type: "video",
        src: "/work/creative/honkai-3rd-anniversary-ooh.mp4",
        poster: "/work/creative/honkai-3rd-anniversary-ooh.jpg",
        ratio: "16:9",
        title: l("Video tổng kết OOH sinh nhật 3 năm", "3rd Anniversary OOH recap film"),
        caption: l("Các điểm OOH tại sáu thành phố Đông Nam Á.", "OOH sites across six Southeast Asian cities."),
      },
    ],
  },

  // ───────────────────────────────────────── MU Vinh Dự
  "mu-vinh-du-game": {
    signals: [
      {
        value: "13M+",
        label: l("Lượt xem video KOL", "Creator video views"),
        note: l("THỎ BẢY MÀU ~12.7M · meGAME ~511K · Nam MG ~14.6K · số của cả video", "THỎ BẢY MÀU ~12.7M · meGAME ~511K · Nam MG ~14.6K · whole-video counts"),
      },
      { value: "5.5M+", label: l("Subscriber ba kênh YouTube", "Subscribers across three YouTube channels"), note: l("THỎ BẢY MÀU 2.94M · meGAME 2.57M · Nam MG 70.9K", "THỎ BẢY MÀU 2.94M · meGAME 2.57M · Nam MG 70.9K") },
    ],
    creators: [
      { name: "THỎ BẢY MÀU", platform: "YouTube", audience: "2.94M subscribers", views: "~12.7M views", note: l("Tiểu phẩm hài có thương hiệu “Trung tâm giác ngộ Internet” · 26/12/2021", "Branded comedy sketch “Internet Enlightenment Center” · 26 Dec 2021"), links: [{ label: "Video", url: "https://youtu.be/gpnbrmk1nbE" }] },
      { name: "meGAME", platform: "YouTube", audience: "2.57M subscribers", views: "~511K views", note: l("“Cà khịa game: MU Vinh Dự – từ huyền thoại thành game mobile rác?” · 19/11/2021", "“Game Roast: MU Vinh Dự – from legend to junk mobile game?” · 19 Nov 2021"), links: [{ label: "Video", url: "https://youtu.be/61KtrpHLelI" }] },
      { name: "Nam MG", platform: "YouTube", audience: "70.9K subscribers", views: "~14.6K views", note: l("Hướng dẫn chọn đội hình cơ bản cho người mới · 22/10/2021", "Basic lineup guide for new players · 22 Oct 2021"), links: [{ label: "Video", url: "https://youtu.be/q-pajfbz5AU" }] },
    ],
    press: [
      press("2Game", "2021-09-29", "MU: Vinh Dự Funtap sẽ nâng tầm trải nghiệm chiến đấu lên tầm cao mới", "MU: Vinh Dự by Funtap will take the combat experience to a new level", "https://2game.vn/mu-vinh-du-funtap-se-nang-tam-trai-nghiem-chien-dau-len-mot-tam-cao-moi-post318492.html"),
      press("2Game", "2021-10-23", "MU: Vinh Dự Funtap giành được nhiều lời khen có cánh ngay trong ngày ra mắt", "MU: Vinh Dự by Funtap earns plenty of praise on launch day", "https://2game.vn/mu-vinh-du-funtap-gianh-duoc-nhieu-loi-khen-co-canh-trong-ngay-ra-mat-post320970.html"),
      press("GameK", "2021-10-25", "Trải nghiệm Mu Vinh Dự - Gameplay đậm chất cày cuốc, tính năng huyền thoại", "Hands-on MU: Vinh Dự — grind-heavy gameplay with legendary features", "https://gamek.vn/trai-nghiem-mu-vinh-du-gameplay-dam-chat-cay-cuoc-tinh-nang-huyen-thoai-20211024134743283.chn"),
    ],
    media: [
      {
        type: "video",
        src: "/work/creative/mu-vinh-du-ad.mp4",
        poster: "/work/creative/mu-vinh-du-ad.jpg",
        ratio: "16:9",
        title: l("Phim quảng cáo live-action MU: Vinh Dự", "MU: Vinh Dự live-action ad film"),
        caption: l("Tiểu phẩm hài với nhân vật hóa trang, cắt vào cảnh chơi game để giải thích lớp nhân vật và chiến đấu tự động.", "A comedic live-action ad with costumed characters, cutting to in-game footage to explain class choice and auto-combat."),
      },
    ],
  },

  // ───────────────────────────────────────── Gọi Ta Đại Chưởng Quỹ
  "goi-ta-dai-chuong-quy": {
    signals: [
      {
        value: "3M+",
        label: l("Lượt xem video KOL", "Creator video views"),
        note: l("BlvckVines ~1.37M · meGAME ~894K · Lê Bảo ~543K · AS Mobile ~170K · số của cả video", "BlvckVines ~1.37M · meGAME ~894K · Lê Bảo ~543K · AS Mobile ~170K · whole-video counts"),
      },
      { value: "11M+", label: l("Subscriber sáu kênh YouTube", "Subscribers across six YouTube channels"), note: l("AS Mobile 5.65M · meGAME 2.57M · Lê Bảo 1.67M · Win.D TV 703K · BlvckVines 680K · Top Game Online 235K", "AS Mobile 5.65M · meGAME 2.57M · Lê Bảo 1.67M · Win.D TV 703K · BlvckVines 680K · Top Game Online 235K") },
    ],
    creators: [
      { name: "BlvckVines Official", platform: "YouTube", audience: "680K subscribers", views: "~1.37M views", note: l("“Ông bán bánh mì bị phản bội” · 31/07/2021", "“The Bread Seller Gets Betrayed” · 31 Jul 2021"), links: [{ label: "Video", url: "https://youtu.be/5kLsrUfXZk8" }] },
      { name: "meGAME", platform: "YouTube", audience: "2.57M subscribers", views: "~894K views", note: l("“Review khịa: Gọi Ta Là Đại Chưởng Quỹ – quảng cáo có lừa?” · 11/08/2021", "“Savage Review: Gọi Ta Là Đại Chưởng Quỹ – are the ads lying?” · 11 Aug 2021"), links: [{ label: "Video", url: "https://youtu.be/OMsRG4L5Qb8" }] },
      { name: "Lê Bảo Official", platform: "YouTube", audience: "1.67M subscribers", views: "~543K views", note: l("“Ở nhà nhưng vẫn giàu? Lê Bảo làm gì vậy?” · 30/07/2021", "“Staying home but still rich? What is Lê Bảo up to?” · 30 Jul 2021"), links: [{ label: "Video", url: "https://youtu.be/diaiW48mk1g" }] },
      { name: "AS Mobile", platform: "YouTube", audience: "5.65M subscribers", views: "~170K views", note: l("“Cùng AS Mobile làm phi vụ kinh doanh lớn nhất Việt Nam” · 30/07/2021", "“Pulling off Vietnam's biggest business deal with AS Mobile” · 30 Jul 2021"), links: [{ label: "Video", url: "https://youtu.be/TZVRSRT3JkU" }] },
      { name: "Top Game Online", platform: "YouTube", audience: "235K subscribers", views: "~41K + ~3.5K views", note: l("Hai video trải nghiệm và cảm nhận · 06–07/2021", "Two hands-on and impressions videos · Jun–Jul 2021"), links: [{ label: l("Trải nghiệm", "Hands-on"), url: "https://youtu.be/Z6iYUZP8S0w" }, { label: l("Cảm nhận", "Impressions"), url: "https://youtu.be/ICsxmMGmW3k" }] },
      { name: "Win.D TV", platform: "YouTube", audience: "703K subscribers", views: "~10.6K views", note: l("“Game chiến lược kinh doanh – ở nhà chơi mùa dịch là hết bài” · 31/07/2021", "“Business strategy game – the perfect way to spend the pandemic at home” · 31 Jul 2021"), links: [{ label: "Video", url: "https://youtu.be/5MTQdurM50c" }] },
    ],
    press: [
      press("GameK", "2021-11-05", "Gọi Ta Đại Chưởng Quỹ update phiên bản mới, kết hợp cùng bộ anime kinh điển “Tiểu đầu bếp cung đình”", "Gọi Ta Đại Chưởng Quỹ updates with a new version, crossing over with the classic anime “Tiểu đầu bếp cung đình”", "https://gamek.vn/goi-ta-dai-chuong-quy-update-phien-ban-moi-ket-hop-cung-bo-anime-kinh-dien-tieu-dau-bep-cung-dinh-20211103164010963.chn"),
    ],
    media: [
      {
        type: "image",
        src: "/work/goi-ta-nhu-hexi.webp",
        ratio: "16:9",
        title: l("Hợp tác nhân vật: Như Hexi trong game", "Character collaboration: Như Hexi in the game"),
        caption: l("Hình ảnh của Như Hexi trở thành nhân vật mỹ nhân mùa Giáng sinh trong game.", "Như Hexi's likeness became a Christmas-season beauty character in the game."),
      },
    ],
  },

  // ───────────────────────────────────────── MU Vượt Thời Đại
  "mu-vuot-thoi-dai": {
    signals: [
      { value: "800K+", label: l("Reach cộng dồn", "Summed post reach"), note: l("Bài ảnh CTA + video CTA trên Facebook", "Image CTA + video CTA on Facebook") },
      { value: "130K+", label: l("Lượt xem video", "Video views"), note: l("Facebook, YouTube, TikTok, Instagram", "Facebook, YouTube, TikTok, Instagram") },
      { value: "~24K", label: l("Lượt click vào link tải", "Clicks to the download link"), note: l("Khoảng 3% trên reach", "About 3% of reach") },
    ],
    signalsNote: l(
      "Số liệu từ báo cáo chiến dịch. Reach cộng dồn theo từng bài nên có thể trùng người xem giữa các bài.",
      "Figures from the campaign report. Reach is summed per post and may overlap between posts."
    ),
    creators: [
      { name: "Bác Gấu", platform: "Facebook", reach: "427,614", views: "57,025", clicks: "12,235", links: [{ label: "Video", url: "https://www.facebook.com/HQ.BacGau/posts/924811895021994" }, { label: l("Ảnh CTA", "CTA photo"), url: "https://www.facebook.com/HQ.BacGau/posts/929950137841503" }] },
      { name: "Thảo Nari", platform: "Facebook, Instagram", reach: "143,496", views: "15,616", clicks: "4,048", links: [{ label: "Instagram", url: "https://www.instagram.com/p/CJdpC70hXt_/" }, { label: "Facebook", url: "https://www.facebook.com/235201580316414/posts/1095706887599208/" }, { label: l("Ảnh CTA", "CTA photo"), url: "https://www.facebook.com/box.ThaoNari/posts/1086613705175193" }] },
      { name: "Quang Cuốn", platform: "Facebook, YouTube", reach: "67,891", views: "26,413", clicks: "2,932", links: [{ label: "YouTube", url: "https://youtu.be/OFSno2Osr8Q" }, { label: "Facebook", url: "https://www.facebook.com/gaming/OfficialQuangCuon/videos/4096738290356047/" }] },
      { name: "Mèo Sao Hỏa", platform: "Facebook, Instagram", reach: "75,769", views: "6,047", clicks: "2,209", links: [{ label: "Instagram", url: "https://www.instagram.com/p/CJdj3K_DyVr/" }, { label: "Facebook", url: "https://www.facebook.com/1819296208369620/posts/2585602161739017/" }, { label: l("Ảnh CTA", "CTA photo"), url: "https://www.facebook.com/box.MeoSaoHoa/posts/2575491662750067" }] },
      { name: "Hảo Thỏ", platform: "Facebook, Instagram", reach: "65,644", views: "6,292", clicks: "1,660", links: [{ label: "Instagram", url: "https://www.instagram.com/p/CJdof0CgJto/" }, { label: "Facebook", url: "https://www.facebook.com/1024804167715049/posts/1598486167013510/" }, { label: l("Ảnh CTA", "CTA photo"), url: "https://www.facebook.com/Box.HaoRabbit/posts/1584517045077089" }] },
      { name: "Thụt TV", platform: "Facebook, YouTube", reach: "32,871", views: "11,927", clicks: "913", links: [{ label: "Facebook", url: "https://www.facebook.com/gaming/Box.ThutTV/videos/732012377442068/" }] },
      { name: "Hải Mõm", platform: "YouTube, Facebook", views: "9,660 views", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=rlH7RuTtDbY" }] },
      { name: "Linh Ka", platform: "Facebook", links: [{ label: "Facebook", url: "https://www.facebook.com/100007001463483/videos/2916687481907939/" }, { label: l("Ảnh CTA", "CTA photo"), url: "https://www.facebook.com/story.php?story_fbid=2906367072939980&id=100007001463483" }] },
      { name: "Linh Nhi", platform: "Instagram, TikTok", views: "1,990 views", links: [{ label: "Instagram", url: "https://www.instagram.com/p/CJdiqeIhjaP/" }, { label: "TikTok", url: "https://vt.tiktok.com/ZS7aknXx/" }] },
    ],
  },
};

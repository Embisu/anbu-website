import type { L10n } from "./site";

/**
 * Plain-language definitions of the terms that appear across ANBU's game marketing
 * content. Definitions are general industry usage (no figures, no claims about ANBU).
 * `post` is the Vietnamese slug of an existing blog article; links are localized at render time.
 */
export type GlossaryTerm = {
  id: string;
  term: string | L10n;
  full?: L10n;
  def: L10n;
  post?: string;
  href?: string;
};

export type GlossaryGroup = { id: string; title: L10n; terms: GlossaryTerm[] };

const l = (vi: string, en: string): L10n => ({ vi, en });

export const glossaryGroups: GlossaryGroup[] = [
  {
    id: "metrics",
    title: l("Chỉ số & đo lường", "Metrics & measurement"),
    terms: [
      {
        id: "ua",
        term: "UA",
        full: l("User Acquisition", "User Acquisition"),
        def: l(
          "Hoạt động thu hút người chơi mới bằng quảng cáo trả phí và các kênh khác. Hiệu quả được đánh giá bằng cả chi phí lẫn chất lượng người chơi nhận về, không chỉ số lượng.",
          "Bringing in new players through paid advertising and other channels. Performance is judged by both cost and the quality of the players acquired, not volume alone."
        ),
        post: "xu-ly-creative-fatigue-quang-cao-game-mobile",
      },
      {
        id: "cpi",
        term: "CPI",
        full: l("Cost Per Install", "Cost Per Install"),
        def: l(
          "Chi phí trung bình cho mỗi lượt cài đặt, tính bằng tổng chi phí quảng cáo chia cho số lượt cài. CPI thấp chưa chắc là người chơi tốt, nên cần đọc cùng retention và doanh thu.",
          "Average cost per install: total ad spend divided by installs. A low CPI does not guarantee good players, so read it alongside retention and revenue."
        ),
        post: "tiktok-marketing-trends-game-mobile-viet-nam-noi-dung-viral-toi-uu-cpi",
      },
      {
        id: "cpa",
        term: "CPA",
        full: l("Cost Per Action / Acquisition", "Cost Per Action / Acquisition"),
        def: l(
          "Chi phí cho mỗi hành động mục tiêu, ví dụ đăng ký, lần mua đầu tiên hoặc lần nạp đầu tiên. Hành động được chọn càng sâu trong phễu thì tín hiệu càng sát doanh thu.",
          "Cost per target action, such as a sign-up, first purchase or first top-up. The deeper in the funnel the action sits, the closer the signal is to revenue."
        ),
      },
      {
        id: "roas",
        term: "ROAS",
        full: l("Return On Ad Spend", "Return On Ad Spend"),
        def: l(
          "Doanh thu quy cho quảng cáo chia cho chi phí quảng cáo trong một cửa sổ attribution đã chọn. ROAS 2,0 nghĩa là mỗi 1 đồng chi tạo ra 2 đồng doanh thu trong cửa sổ đó.",
          "Revenue attributed to ads divided by ad spend within a chosen attribution window. A ROAS of 2.0 means every 1 spent returned 2 in revenue within that window."
        ),
        post: "tiktok-marketing-trends-game-mobile-viet-nam-noi-dung-viral-toi-uu-cpi",
      },
      {
        id: "ltv",
        term: "LTV",
        full: l("Lifetime Value", "Lifetime Value"),
        def: l(
          "Doanh thu (hoặc lợi nhuận) kỳ vọng từ một người chơi trong toàn bộ vòng đời. Thường được ước tính theo cohort và dùng để quyết định mức CPI có thể chấp nhận.",
          "Expected revenue (or profit) from a player over their whole lifetime. Usually estimated per cohort and used to decide an acceptable CPI."
        ),
      },
      {
        id: "arpu",
        term: "ARPU / ARPPU",
        full: l("Average Revenue Per User / Per Paying User", "Average Revenue Per User / Per Paying User"),
        def: l(
          "ARPU là doanh thu trung bình trên mỗi người dùng; ARPPU là doanh thu trung bình trên mỗi người dùng có trả phí. Hai chỉ số cho thấy giá trị người chơi và mức chi tiêu của nhóm trả phí.",
          "ARPU is average revenue per user; ARPPU is average revenue per paying user. Together they show player value and how much the paying group spends."
        ),
      },
      {
        id: "dau-mau",
        term: "DAU / MAU",
        full: l("Daily / Monthly Active Users", "Daily / Monthly Active Users"),
        def: l(
          "Số người chơi hoạt động mỗi ngày và mỗi tháng. Tỷ lệ DAU/MAU thường được dùng để ước lượng mức độ gắn bó của người chơi với game.",
          "The number of players active each day and each month. The DAU/MAU ratio is commonly used to gauge how sticky a game is."
        ),
      },
      {
        id: "retention",
        term: "Retention (D1/D7/D30)",
        def: l(
          "Tỷ lệ người chơi quay lại sau 1, 7 hoặc 30 ngày kể từ ngày cài đặt. Đây là thước đo trung thực nhất về việc game có giữ được người chơi hay không.",
          "The share of players who return 1, 7 or 30 days after installing. It is the most honest measure of whether a game keeps its players."
        ),
        post: "retention-game-mobile-tang-d1-d7-d30",
      },
      {
        id: "cohort",
        term: "Cohort",
        def: l(
          "Nhóm người chơi cùng cài đặt trong một khoảng thời gian hoặc từ cùng một nguồn. Phân tích theo cohort cho phép so sánh chất lượng giữa các kênh và các đợt chiến dịch.",
          "A group of players who installed in the same period or from the same source. Cohort analysis lets you compare quality across channels and campaign waves."
        ),
      },
      {
        id: "iap",
        term: "IAP",
        full: l("In-App Purchase", "In-App Purchase"),
        def: l(
          "Giao dịch mua bên trong game, như gói nạp, vật phẩm hoặc thẻ tháng. Với nhiều game mobile, IAP là nguồn doanh thu chính.",
          "A purchase made inside the game, such as top-up packs, items or a monthly pass. For many mobile games, IAP is the main revenue source."
        ),
      },
      {
        id: "mmp",
        term: "MMP / Attribution",
        full: l("Mobile Measurement Partner", "Mobile Measurement Partner"),
        def: l(
          "Công cụ bên thứ ba (ví dụ Adjust, AppsFlyer) gán lượt cài đặt và sự kiện trong game về đúng kênh quảng cáo. Nhờ đó có thể so sánh hiệu quả giữa các nguồn.",
          "A third-party tool (for example Adjust or AppsFlyer) that attributes installs and in-game events to the right ad channel, so sources can be compared."
        ),
      },
      {
        id: "aso",
        term: "ASO",
        full: l("App Store Optimization", "App Store Optimization"),
        def: l(
          "Tối ưu trang game trên App Store và Google Play (tên, từ khóa, biểu tượng, ảnh chụp, mô tả) để tăng khả năng được tìm thấy và tỷ lệ chuyển đổi cài đặt.",
          "Optimizing a game's App Store and Google Play page (title, keywords, icon, screenshots, description) to improve discoverability and install conversion."
        ),
        post: "aso-game-mobile-viet-nam",
      },
    ],
  },
  {
    id: "creators",
    title: l("Creator & cộng đồng", "Creators & community"),
    terms: [
      {
        id: "kol",
        term: "KOL",
        full: l("Key Opinion Leader", "Key Opinion Leader"),
        def: l(
          "Người có sức ảnh hưởng lớn trong một lĩnh vực, như streamer hay YouTuber game, có tệp người theo dõi rộng và tiếng nói được tin cậy trong cộng đồng.",
          "A person with strong influence in a field, such as a game streamer or YouTuber, with a broad following and a trusted voice in the community."
        ),
        post: "kol-trong-nganh-game-vai-tro-va-cach-xay-dung-chien-luoc-hieu-qua",
      },
      {
        id: "koc",
        term: "KOC",
        full: l("Key Opinion Consumer", "Key Opinion Consumer"),
        def: l(
          "Người dùng hoặc người chơi thật chia sẻ trải nghiệm của chính họ. Quy mô nhỏ hơn KOL nhưng thường được tin cậy hơn vì nội dung gần với trải nghiệm thật.",
          "A real user or player sharing their own experience. Smaller in reach than a KOL but often more trusted because the content feels close to real use."
        ),
        post: "influencer-marketing-chon-kol-koc-dung-cach",
      },
      {
        id: "micro-influencer",
        term: "Micro-influencer / Micro-KOC",
        def: l(
          "Creator có cộng đồng nhỏ (thường vài nghìn đến vài chục nghìn người theo dõi) nhưng tương tác tốt. Thường được kết hợp theo nhóm để phủ nhiều ngách người chơi với ngân sách vừa phải.",
          "A creator with a small community (typically a few thousand to a few tens of thousands of followers) but strong engagement. Often combined in groups to cover many player niches on a modest budget."
        ),
        post: "chien-dich-micro-influencer-cho-game-mobile",
      },
      {
        id: "ugc",
        term: "UGC",
        full: l("User-Generated Content", "User-Generated Content"),
        def: l(
          "Nội dung do chính người chơi tạo ra, như clip gameplay, meme hay bài đánh giá. UGC giúp game được nhắc đến tự nhiên và có thể được tái sử dụng làm nội dung quảng cáo khi có sự cho phép.",
          "Content made by players themselves, such as gameplay clips, memes or reviews. UGC keeps a game in natural conversation and, with permission, can be reused as ad content."
        ),
      },
      {
        id: "seeding",
        term: "Seeding",
        def: l(
          "Đưa nội dung và chủ đề thảo luận vào các nhóm, diễn đàn và mạng xã hội một cách tự nhiên để khơi gợi cuộc trò chuyện, thay vì quảng cáo trực diện.",
          "Introducing content and discussion topics into groups, forums and social channels in a natural way to spark conversation, rather than advertising head-on."
        ),
      },
      {
        id: "cmm",
        term: "CMM",
        full: l("Community Management", "Community Management"),
        def: l(
          "Vận hành cộng đồng chính thức của game: trả lời người chơi, đăng thông báo và sự kiện, kiểm duyệt thảo luận và chuyển phản hồi cho đội phát triển.",
          "Running a game's official community: replying to players, posting announcements and events, moderating discussion and relaying feedback to the development team."
        ),
        post: "xay-dung-cong-dong-game-mobile-viet-nam",
      },
      {
        id: "giftcode",
        term: "Giftcode",
        def: l(
          "Mã quà tặng trong game, người chơi nhập để nhận vật phẩm. Thường dùng làm lý do để cài đặt, quay lại hoặc tham gia sự kiện, và có thể gắn mã riêng cho từng creator để đo hiệu quả.",
          "An in-game gift code that players redeem for items. Often used as a reason to install, return or join an event, and can be issued per creator to measure results."
        ),
      },
      {
        id: "always-on",
        term: "Always-on",
        def: l(
          "Cách vận hành kênh liên tục sau khi game ra mắt, thay vì chỉ dồn lực vào một đợt cao điểm. Mục tiêu là giữ hiện diện, sự kiện và cộng đồng ổn định theo thời gian.",
          "Running channels continuously after launch instead of concentrating effort in a single peak. The aim is steady presence, events and community over time."
        ),
        post: "toi-uu-kenh-game-tai-thai-lan-chien-luoc-always-on",
      },
    ],
  },
  {
    id: "launch",
    title: l("Ra mắt & vận hành", "Launch & operations"),
    terms: [
      {
        id: "pre-registration",
        term: l("Đăng ký trước", "Pre-registration"),
        full: l("Pre-registration", "Pre-registration"),
        def: l(
          "Giai đoạn người chơi đăng ký quan tâm trước ngày ra mắt (qua cửa hàng ứng dụng hoặc trang đích), thường kèm quà ra mắt. Giúp đo mức quan tâm và tạo lượng người chơi ban đầu.",
          "The stage where players register interest before launch (via the app store or a landing page), usually with launch rewards. It helps gauge demand and builds an initial player base."
        ),
        post: "community-launch-game-mobile-90-ngay",
      },
      {
        id: "beta",
        term: "CBT / OBT",
        full: l("Closed / Open Beta Test", "Closed / Open Beta Test"),
        def: l(
          "Các đợt thử nghiệm trước khi ra mắt chính thức. Closed Beta giới hạn người tham gia; Open Beta mở rộng cho đông đảo người chơi để kiểm tra tải hệ thống và thu thập phản hồi.",
          "Test phases before the official launch. Closed Beta limits participants; Open Beta opens to a wider audience to stress-test systems and collect feedback."
        ),
      },
      {
        id: "soft-launch",
        term: "Soft launch",
        def: l(
          "Ra mắt thử ở một vài thị trường nhỏ trước khi ra mắt toàn cầu hoặc toàn khu vực để kiểm tra retention, doanh thu và vận hành.",
          "Launching in a few smaller markets before a global or regional release to test retention, revenue and operations."
        ),
      },
      {
        id: "liveops",
        term: "LiveOps",
        full: l("Live Operations", "Live Operations"),
        def: l(
          "Vận hành game đang chạy: lịch sự kiện, cập nhật, ưu đãi và giao tiếp với người chơi để giữ chân và duy trì doanh thu sau ra mắt.",
          "Running a live game: event calendars, updates, offers and player communication to retain players and sustain revenue after launch."
        ),
        post: "liveops-game-mobile-lich-su-kien-giu-nguoi-choi",
      },
      {
        id: "localization",
        term: "Localization",
        full: l("Bản địa hóa", "Localization"),
        def: l(
          "Điều chỉnh game và nội dung marketing cho thị trường địa phương, gồm ngôn ngữ, tên vật phẩm, giao diện, sự kiện, cửa hàng ứng dụng và cả cách nói của game thủ, không chỉ dịch văn bản.",
          "Adapting a game and its marketing to a local market, covering language, item names, UI, events, store listings and gamer slang, not just translating text."
        ),
        post: "ban-dia-hoa-game-mobile-tai-viet-nam",
      },
      {
        id: "pr",
        term: "Launch PR",
        def: l(
          "Truyền thông báo chí quanh các mốc ra mắt (thông báo, đăng ký trước, beta, ra mắt, cập nhật lớn) để tăng độ tin cậy và độ phủ trên báo game và báo đại chúng.",
          "Press communication around launch milestones (announcement, pre-registration, beta, launch, major updates) to build credibility and reach in gaming and mainstream media."
        ),
        post: "pr-game-mobile-viet-nam-ra-mat",
      },
      {
        id: "ooh",
        term: "OOH",
        full: l("Out-Of-Home", "Out-Of-Home"),
        def: l(
          "Quảng cáo ngoài trời và trong không gian công cộng, như màn hình LED ở trung tâm thương mại hoặc màn hình trong cửa hàng.",
          "Advertising in outdoor and public spaces, such as mall LED screens or in-store displays."
        ),
      },
      {
        id: "g1",
        term: l("Giấy phép G1 (Việt Nam)", "G1 license (Vietnam)"),
        full: l("Giấy phép dịch vụ trò chơi điện tử G1", "G1 online game service license"),
        def: l(
          "Theo Nghị định 147/2024/NĐ-CP, nhà phát hành cung cấp game có tương tác giữa người chơi (nhóm G1) tại Việt Nam cần giấy phép cung cấp dịch vụ G1, và từng game cần có quyết định phát hành tương ứng. Đây là mô tả tổng quát; hãy tham vấn luật sư và đối chiếu văn bản gốc.",
          "Under Decree 147/2024/NĐ-CP, a publisher offering games with player-to-player interaction (the G1 group) in Vietnam needs a G1 service license, and each title needs its own release decision. This is a general summary; consult a lawyer and check the original text."
        ),
        post: "game-publishing-in-vietnam-nhung-bai-toan-can-giai-truoc-khi-dau-tu-marketing",
        href: "https://vanban.chinhphu.vn/?docid=211654&pageid=27160",
      },
    ],
  },
  {
    id: "tiktok-ads",
    title: l("Quảng cáo & creative", "Advertising & creative"),
    terms: [
      {
        id: "spark-ads",
        term: "Spark Ads",
        def: l(
          "Định dạng của TikTok cho phép chạy quảng cáo từ chính bài đăng TikTok sẵn có (của thương hiệu hoặc creator), vẫn giữ lượt xem, thích, bình luận và chia sẻ trên bài gốc.",
          "A TikTok format that lets you run ads from an existing TikTok post (from the brand or a creator) while keeping the views, likes, comments and shares on the original post."
        ),
        post: "tiktok-marketing-trends-game-mobile-viet-nam-noi-dung-viral-toi-uu-cpi",
      },
      {
        id: "aeo",
        term: "AEO",
        full: l("App Event Optimization", "App Event Optimization"),
        def: l(
          "Cách tối ưu chiến dịch theo một sự kiện trong ứng dụng (như đăng ký hoặc mua hàng) thay vì chỉ theo lượt cài đặt, để hệ thống tìm nhóm người dùng có khả năng thực hiện sự kiện đó cao hơn.",
          "Optimizing a campaign toward an in-app event (such as sign-up or purchase) instead of installs alone, so the system finds users more likely to complete that event."
        ),
        post: "tiktok-marketing-trends-game-mobile-viet-nam-noi-dung-viral-toi-uu-cpi",
      },
      {
        id: "topview",
        term: "TopView",
        def: l(
          "Vị trí quảng cáo video toàn màn hình hiển thị ngay khi người dùng mở TikTok, thường dùng cho mục tiêu nhận diện ở ngày ra mắt hoặc đợt cao điểm.",
          "A full-screen video ad placement shown when a user first opens TikTok, typically used for awareness on launch day or at campaign peaks."
        ),
      },
      {
        id: "creative-testing",
        term: "Creative testing",
        def: l(
          "Thử nghiệm có hệ thống nhiều phiên bản nội dung quảng cáo (ý tưởng, mở đầu, lời kêu gọi) để biết phiên bản nào hiệu quả trước khi tăng ngân sách.",
          "Systematically testing multiple versions of ad content (concept, hook, call to action) to learn which works before scaling spend."
        ),
        post: "creative-testing-game-mobile-quang-cao",
      },
      {
        id: "creative-fatigue",
        term: "Creative fatigue",
        def: l(
          "Hiện tượng một mẫu quảng cáo giảm hiệu quả vì người xem đã thấy quá nhiều lần, thể hiện qua CTR giảm và CPI tăng. Cần làm mới creative để xử lý.",
          "When an ad loses effectiveness because viewers have seen it too often, showing up as falling CTR and rising CPI. Refreshing the creative is the usual fix."
        ),
        post: "xu-ly-creative-fatigue-quang-cao-game-mobile",
      },
    ],
  },
];

export const glossaryTermCount = glossaryGroups.reduce((n, g) => n + g.terms.length, 0);

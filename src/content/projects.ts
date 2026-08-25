import type { L10n } from "./site";

export type Project = {
  slug: string;
  client: string;
  title: L10n;
  category: L10n;
  year: string;
  color: string; // gradient theme
  cover: L10n; // short cover text / summary
  context?: L10n;
  challenge: L10n;
  solution: L10n;
  results: { value: string; label: L10n }[];
  sources?: { label: L10n; url: string }[];
  services: string[]; // service slugs
  /** Optional object-position focal point for the thumbnail, e.g. "center top". Defaults to center. */
  focal?: string;
  /** Preserve portrait or square official artwork inside landscape cards. */
  fit?: "cover" | "contain";
  /** Portfolio overview without public, verified performance metrics. */
  overview?: boolean;
};

export const projects: Project[] = [
  {
    slug: "shopee-beauty-club",
    client: "Shopee",
    title: {
      vi: "Ra mắt Shopee Beauty Club, chiến dịch viral",
      en: "Launching Shopee Beauty Club, a viral campaign",
    },
    category: { vi: "E-commerce & Social", en: "E-commerce & Social" },
    year: "2020 – 2021",
    color: "from-orange-500 to-orange-700",
    cover: {
      vi: "Hơn 100 triệu lượt xem hashtag và lượng thành viên đăng ký vượt xa KPI đề ra.",
      en: "Over 100 million hashtag views and member sign-ups blowing past the target KPI.",
    },
    challenge: {
      vi: "Ra mắt một câu lạc bộ làm đẹp mới của Shopee và tạo được độ phủ cùng lượng thành viên đăng ký lớn trong thời gian ngắn.",
      en: "Launch Shopee's new beauty club and drive massive reach and membership sign-ups in a short window.",
    },
    solution: {
      vi: "Chúng tôi lên kế hoạch truyền thông và dự trù ngân sách, xây dựng ý tưởng từ kịch bản đến lựa chọn KOLs cho từng video quảng bá, triển khai đa nền tảng Shopee, TikTok, Instagram và Facebook.",
      en: "We planned the media and budget, built ideas from script to KOL selection for each promo video, and executed across Shopee, TikTok, Instagram and Facebook.",
    },
    results: [
      { value: "100M+", label: { vi: "Lượt xem hashtag / 1 năm", en: "Hashtag views in one year" } },
      { value: "Vượt KPI", label: { vi: "Thành viên đăng ký", en: "Membership sign-ups" } },
      { value: "4", label: { vi: "Nền tảng triển khai", en: "Platforms activated" } },
    ],
    services: ["social-media", "influencer-marketing", "performance-marketing"],
  },
  {
    slug: "honkai-impact-3-birthday",
    client: "Honkai Impact 3 (miHoYo)",
    title: {
      vi: "Chiến dịch sinh nhật phủ sóng Đông Nam Á",
      en: "A birthday campaign across Southeast Asia",
    },
    category: { vi: "Game Marketing & OOH", en: "Game Marketing & OOH" },
    year: "2020",
    color: "from-navy-600 to-navy-800",
    cover: {
      vi: "Kết hợp OOH và mạng xã hội, tiếp cận hơn 20 triệu người trên toàn Đông Nam Á.",
      en: "Blending OOH and social to reach over 20 million people across Southeast Asia.",
    },
    challenge: {
      vi: "Tổ chức chiến dịch sinh nhật 3 năm quy mô khu vực, vừa tạo tiếng vang online vừa hiện diện mạnh mẽ ngoài trời trên toàn Đông Nam Á.",
      en: "Run a region-wide 3rd-anniversary campaign that made noise online while owning outdoor presence across Southeast Asia.",
    },
    solution: {
      vi: "Chúng tôi lên kế hoạch và dự trù ngân sách, lựa chọn các điểm tổ chức offline và vị trí đặt biển LED trên toàn khu vực, đồng thời xây dựng ý tưởng cho video tổng kết chiến dịch.",
      en: "We planned and budgeted the campaign, selected offline venues and LED billboard placements across the region, and crafted the campaign wrap-up video.",
    },
    results: [
      { value: "20M+", label: { vi: "Người tiếp cận toàn ĐNÁ", en: "People reached across SEA" } },
      { value: "OOH", label: { vi: "Biển LED toàn khu vực", en: "LED billboards region-wide" } },
      { value: "#1", label: { vi: "Khẳng định vị thế dòng game", en: "Reaffirmed category leadership" } },
    ],
    services: ["game-app-marketing", "performance-marketing", "creative-design"],
  },
  {
    slug: "momo-influencer",
    client: "MoMo",
    title: {
      vi: "Chiến dịch Influencer cho siêu ứng dụng tài chính",
      en: "Influencer campaign for a fintech super-app",
    },
    category: { vi: "Influencer Marketing", en: "Influencer Marketing" },
    year: "2019",
    color: "from-orange-400 to-navy-600",
    cover: {
      vi: "Hơn 20 KOLs, tiếp cận trên 5 triệu lượt xem và tăng mạnh nhận diện thương hiệu.",
      en: "20+ KOLs, over 5 million views reached and a strong lift in brand awareness.",
    },
    challenge: {
      vi: "Tăng nhận diện cho ví MoMo giữa một thị trường ví điện tử ngày càng đông đúc.",
      en: "Grow awareness for the MoMo wallet in an increasingly crowded e-wallet market.",
    },
    solution: {
      vi: "Chúng tôi lên kế hoạch ý tưởng và dự trù ngân sách, đề xuất và tuyển chọn hơn 20 KOLs/influencers lớn nhỏ phù hợp, quản lý chiến dịch và theo dõi chỉ số đến khi hoàn thành báo cáo.",
      en: "We planned the ideas and budget, proposed and selected 20+ fitting KOLs/influencers, managed the campaign and tracked metrics through to final reporting.",
    },
    results: [
      { value: "5M+", label: { vi: "Lượt xem trên mạng xã hội", en: "Views on social media" } },
      { value: "20+", label: { vi: "KOLs & influencers", en: "KOLs & influencers" } },
      { value: "↑", label: { vi: "Nhận diện thương hiệu", en: "Brand awareness" } },
    ],
    services: ["influencer-marketing", "social-media"],
  },
  {
    slug: "mu-vinh-du-game",
    client: "MU Vinh Dự",
    title: {
      vi: "Truyền thông ra mắt game top doanh thu",
      en: "Launch marketing for a top-grossing game",
    },
    category: { vi: "Game Marketing", en: "Game Marketing" },
    year: "2021",
    color: "from-navy-700 to-orange-500",
    cover: {
      vi: "Lọt Top 10 game có doanh thu cao nhất năm, video KOL đạt hơn 10 triệu lượt xem.",
      en: "A Top 10 highest-grossing game of the year, a KOL video hitting 10M+ views.",
    },
    challenge: {
      vi: "Đưa một tựa game MMORPG mới bùng nổ tại thị trường Việt Nam giữa lúc cạnh tranh gay gắt.",
      en: "Make a new MMORPG explode in the Vietnamese market amid fierce competition.",
    },
    solution: {
      vi: "Chúng tôi đảm nhận chính mảng truyền thông và marketing tại Việt Nam: xây dựng ý tưởng từ kịch bản, tuyển chọn KOLs cho từng video, lên bài và thông cáo báo chí, xin giấy phép cho game.",
      en: "We led communications and marketing in Vietnam: idea and script development, KOL selection per video, articles and press releases, and game licensing.",
    },
    results: [
      { value: "Top 10", label: { vi: "Game doanh thu cao nhất 2021", en: "Highest-grossing games of 2021" } },
      { value: "10M+", label: { vi: "Lượt xem video KOL / 3 tháng", en: "KOL video views in 3 months" } },
      { value: "Viral", label: { vi: "Cái tên hot làng game", en: "A hot name in gaming" } },
    ],
    services: ["game-app-marketing", "influencer-marketing", "social-media"],
  },
  {
    slug: "summoners-war-revival",
    client: "Summoners War (Com2uS)",
    title: {
      vi: "Hồi sinh game tại Đông Nam Á & Brazil",
      en: "Reviving a game across SEA & Brazil",
    },
    category: { vi: "Influencer & User Acquisition", en: "Influencer & User Acquisition" },
    year: "2022",
    color: "from-orange-500 to-navy-700",
    cover: {
      vi: "Đưa Summoners War trở lại Top 10 game doanh thu tốt nhất Google Play khu vực Đông Nam Á.",
      en: "Bringing Summoners War back into the Top 10 grossing games on Google Play in Southeast Asia.",
    },
    challenge: {
      vi: "Hồi sinh một tựa game đình đám đang suy giảm nặng về lượng người chơi tại Đông Nam Á.",
      en: "Revive a once-hit game suffering a heavy decline in players across Southeast Asia.",
    },
    solution: {
      vi: "Chúng tôi phụ trách influencer marketing tại Đông Nam Á và Brazil, quản lý dự án và đảm bảo tiến độ, xây dựng ý tưởng cho toàn bộ video quảng bá, theo dõi dữ liệu và đề xuất cải thiện cho các dự án tiếp theo.",
      en: "We ran influencer marketing across SEA and Brazil, managed the project timeline, built ideas for all promo videos, and tracked data to recommend improvements for future projects.",
    },
    results: [
      { value: "Top 10", label: { vi: "Doanh thu Google Play ĐNÁ", en: "Grossing on Google Play SEA" } },
      { value: "2", label: { vi: "Khu vực triển khai (ĐNÁ, Brazil)", en: "Regions activated (SEA, Brazil)" } },
      { value: "↑", label: { vi: "Người chơi quay trở lại", en: "Players returning" } },
    ],
    services: ["game-app-marketing", "influencer-marketing"],
  },
  {
    slug: "dibao-ev",
    client: "Dibao",
    title: {
      vi: "Đưa xe điện Dibao thành best-seller",
      en: "Turning Dibao e-bikes into a best-seller",
    },
    category: { vi: "Influencer & Branding", en: "Influencer & Branding" },
    year: "2020",
    color: "from-orange-400 to-orange-600",
    cover: {
      vi: "Hợp tác cùng ca sĩ Amee, video quảng bá đạt hơn 200K lượt xem trong 1 tháng.",
      en: "Partnering with artist Amee, a promo video hitting 200K+ views in one month.",
    },
    challenge: {
      vi: "Đưa một hãng xe điện gần như chưa ai biết đến trở thành cái tên được ưa chuộng trên thị trường.",
      en: "Turn a nearly unknown e-bike brand into a market favorite.",
    },
    solution: {
      vi: "Chúng tôi lên kế hoạch và dự trù ngân sách, tuyển chọn KOLs/KOCs, làm việc với Amee cho vai trò đại diện hình ảnh và xây dựng ý tưởng cho video quảng cáo, quản lý chiến dịch và theo dõi chỉ số.",
      en: "We planned and budgeted, selected KOLs/KOCs, worked with Amee as brand ambassador and built the ad video concept, then managed the campaign and tracked metrics.",
    },
    results: [
      { value: "200K+", label: { vi: "Lượt xem video / 1 tháng", en: "Video views in one month" } },
      { value: "Best-seller", label: { vi: "Từ vô danh thành dẫn đầu", en: "From unknown to leader" } },
      { value: "↑↑", label: { vi: "Doanh số tăng mạnh", en: "Sales surged" } },
    ],
    services: ["influencer-marketing", "social-media", "creative-design"],
  },
  {
    slug: "nguyet-mong",
    client: "Nguyệt Mộng",
    title: {
      vi: "Kể câu chuyện định mệnh bằng một chiến dịch ra mắt giàu cảm xúc",
      en: "Telling a story of destiny through an emotion-led game launch",
    },
    category: { vi: "Game Launch & Integrated Marketing", en: "Game Launch & Integrated Marketing" },
    year: "2025",
    color: "from-indigo-950 via-violet-800 to-amber-500",
    cover: {
      vi: "ANBU triển khai KOL/KOC, social và nội dung ra mắt để đưa thế giới cổ phong của Nguyệt Mộng đến gần cộng đồng game thủ Việt Nam.",
      en: "ANBU activated KOL/KOC, social and launch content to introduce Nguyệt Mộng's historical-fantasy world to Vietnamese gamers.",
    },
    context: {
      vi: "Trong giai đoạn Nguyệt Mộng ra mắt tại Việt Nam, ANBU phụ trách xây dựng hướng truyền thông bám sát ba thế mạnh của sản phẩm: cốt truyện cổ phong giàu cảm xúc, dàn nhân vật có chiều sâu và gameplay chiến thuật thẻ tướng. Trọng tâm là tạo một hành trình nội dung liền mạch từ nhận biết, tò mò đến trải nghiệm game.",
      en: "For the Vietnam launch, ANBU shaped communications around three product strengths: emotional historical-fantasy storytelling, distinctive characters and tactical card gameplay. The campaign built a continuous journey from awareness and curiosity to game discovery.",
    },
    challenge: {
      vi: "Thách thức không chỉ là giới thiệu một game thẻ tướng mới, mà còn phải truyền tải đồng thời ba lớp trải nghiệm: câu chuyện quyền đấu giàu cảm xúc, hệ thống nhân vật có chiều sâu và gameplay chiến thuật. Thông điệp cần đủ lãng mạn để thu hút nhóm yêu anime, cổ phong và thời trang, nhưng vẫn đủ rõ ràng về chiến thuật để thuyết phục người chơi RPG.",
      en: "The challenge was larger than introducing another card RPG: communications had to express three layers at once, emotional political drama, deep character relationships and tactical gameplay. The message needed enough romance for anime, historical-fantasy and fashion audiences while remaining strategically credible to RPG players.",
    },
    solution: {
      vi: "ANBU xây chiến dịch theo trục “Thề ước đã giao, khởi đầu định mệnh”, tuyển chọn KOL/KOC phù hợp với nhóm anime, cổ phong và gaming; đồng thời phát triển briefing, tuyến nội dung và lịch social theo từng giai đoạn ra mắt. Video trải nghiệm, nội dung nhân vật, hướng dẫn đội hình và hoạt động cộng đồng được kết nối thành một câu chuyện thống nhất, sau đó khuếch đại bằng PR và thảo luận trên các kênh game.",
      en: "ANBU built the campaign around “The vow is made, destiny begins,” selecting KOL/KOC across anime, historical-fantasy and gaming audiences while developing briefs, content pillars and a phased social calendar. Reviews, character stories, team guides and community activations formed one launch narrative, amplified through PR and gaming conversations.",
    },
    results: [
      { value: "KOL/KOC", label: { vi: "Booking & quản lý nội dung", en: "Booking and content management" } },
      { value: "Social", label: { vi: "Phủ nội dung theo hành trình ra mắt", en: "Phased launch content" } },
      { value: "PR Launch", label: { vi: "Khuếch đại thảo luận cộng đồng", en: "Community conversation amplification" } },
    ],
    services: ["game-app-marketing", "social-media", "influencer-marketing", "creative-design"],
    focal: "center",
  },
  {
    slug: "focallure",
    client: "FOCALLURE",
    title: {
      vi: "Biến mỹ phẩm giá dễ tiếp cận thành lựa chọn đáng tin của Gen Z",
      en: "Turning accessible beauty into a trusted Gen Z choice",
    },
    category: { vi: "Beauty Influencer & Social Commerce", en: "Beauty Influencer & Social Commerce" },
    year: "2021",
    color: "from-stone-950 via-amber-900 to-rose-500",
    cover: {
      vi: "ANBU đồng hành cùng FOCALLURE trong giai đoạn ra mắt tại Việt Nam bằng chiến lược beauty KOL/KOC, social review và nội dung thúc đẩy mua hàng.",
      en: "ANBU supported FOCALLURE's Vietnam launch through beauty KOL/KOC, social reviews and purchase-driving content.",
    },
    context: {
      vi: "Khi FOCALLURE gia nhập thị trường Việt Nam, ANBU nhận bài toán bản địa hóa một thương hiệu mỹ phẩm mới cho nhóm Gen Z yêu làm đẹp và quan tâm đến giá trị sản phẩm. Chiến dịch cần vừa tạo nhận biết, vừa giải đáp trực quan về màu sắc, chất liệu và trải nghiệm sử dụng để xây dựng niềm tin trước quyết định mua.",
      en: "As FOCALLURE entered Vietnam, ANBU localized the new beauty brand for value-conscious Gen Z audiences. The campaign had to build awareness while showing color, texture and product experience clearly enough to create trust before purchase.",
    },
    challenge: {
      vi: "Mỹ phẩm là ngành hàng người dùng cần nhìn thấy màu sắc, chất liệu và hiệu quả thật trước khi mua. Quảng cáo thương hiệu đơn thuần khó giải quyết nghi ngại “sản phẩm thực tế đến tay sẽ như thế nào”, trong khi mỗi nền tảng lại đòi hỏi một định dạng và nhịp nội dung khác nhau.",
      en: "Beauty buyers need to see real color, texture and performance before purchasing. Conventional brand advertising could not answer “what will the product really look like on me?”, while every social platform demanded a different format and content rhythm.",
    },
    solution: {
      vi: "ANBU xây dựng danh sách beauty KOL/KOC theo nhóm nội dung và tệp người xem, phụ trách booking, briefing, duyệt kịch bản và điều phối lịch đăng. YouTube tập trung review và tutorial có chiều sâu; Facebook ưu tiên swatch, album và short clip; Instagram, TikTok khai thác unboxing, before–after và video biến hình. Các điểm chạm social được nối với thông điệp sale để vừa tạo thảo luận, vừa hỗ trợ chuyển đổi trong giai đoạn ra mắt.",
      en: "ANBU mapped beauty KOL/KOC by content strength and audience, managing booking, briefing, script review and publishing schedules. YouTube carried deeper reviews and tutorials; Facebook focused on swatches, albums and short clips; Instagram and TikTok used unboxing, before–after and transformation formats. Social touchpoints connected with sale messaging to support both conversation and conversion.",
    },
    results: [
      { value: "KOL/KOC", label: { vi: "Beauty review & tutorial", en: "Beauty reviews and tutorials" } },
      { value: "4", label: { vi: "Kênh social triển khai", en: "Social channels activated" } },
      { value: "Launch", label: { vi: "Nhận biết, tin tưởng & chuyển đổi", en: "Awareness, trust and conversion" } },
    ],
    services: ["influencer-marketing", "social-media", "performance-marketing"],
    fit: "contain",
  },
  {
    slug: "douluo-soul-master-duel",
    client: "Đấu La Đại Lục: Hồn Sư Đối Quyết",
    title: {
      vi: "Đưa thế giới Hồn Sư đến gần hơn với cộng đồng game thủ",
      en: "Bringing the Soul Master universe closer to gaming communities",
    },
    category: { vi: "Game Marketing & Community", en: "Game Marketing & Community" },
    year: "",
    color: "from-navy-900 to-orange-600",
    cover: {
      vi: "ANBU triển khai chiến dịch KOL/KOC, social và PR ra mắt, kết nối cộng đồng yêu nguyên tác với nhóm người chơi game thẻ tướng tại Việt Nam.",
      en: "ANBU delivered a KOL/KOC, social and launch PR campaign connecting IP fans with Vietnam's card-game audience.",
    },
    context: {
      vi: "Trong giai đoạn thương hiệu đưa Đấu La Đại Lục: Hồn Sư Đối Quyết vào Việt Nam, ANBU tập trung chuyển lợi thế IP, đồ họa 3D và hệ thống Hồn Sư thành những chủ đề nội dung dễ theo dõi. Chiến dịch phải thỏa mãn fan nguyên tác nhưng vẫn mở một lối vào rõ ràng cho người chơi mới.",
      en: "As Soul Land: Soul Master Duel entered Vietnam, ANBU translated its IP, 3D presentation and Soul Master system into accessible content themes. The launch needed to satisfy established fans while creating a clear entry point for new players.",
    },
    challenge: {
      vi: "Chuyển sự quan tâm dành cho nguyên tác thành động lực khám phá game, đồng thời giúp người chơi mới dễ tiếp cận hệ thống Hồn Sư và đội hình.",
      en: "Turn interest in the source universe into game discovery while making its Soul Master and team systems approachable to new players.",
    },
    solution: {
      vi: "ANBU định hướng KOL/KOC theo ba lớp: creator am hiểu nguyên tác kể lại thế giới và nhân vật; gaming creator giải thích hệ thống Hồn Sư, kỹ năng và đội hình; community creator tạo thảo luận bằng thử thách chiến thuật và khoảnh khắc quay tướng. Nội dung được triển khai từ video trải nghiệm, hướng dẫn nhập môn đến short-form bắt trend, giúp chiến dịch vừa giữ chất IP vừa tạo đường vào game rõ ràng cho người chơi mới.",
      en: "ANBU structured creators in three layers: IP-fluent voices for world and character storytelling; gaming creators for Soul Master, skill and lineup education; and community creators for tactical challenges and summon moments. Reviews, beginner guides and trend-led short-form content kept the IP authentic while giving new players a clear path into the game.",
    },
    results: [
      { value: "KOL/KOC", label: { vi: "Creator theo IP, gaming & community", en: "IP, gaming and community creators" } },
      { value: "Social", label: { vi: "Nội dung từ nhận biết đến nhập môn", en: "Awareness-to-onboarding content" } },
      { value: "PR Launch", label: { vi: "Khuếch đại ngày ra mắt", en: "Launch-day amplification" } },
    ],
    services: ["game-app-marketing", "influencer-marketing", "social-media"],
    focal: "62% center",
    fit: "contain",
    overview: true,
  },
  {
    slug: "goi-ta-dai-chuong-quy",
    client: "Gọi Ta Đại Chưởng Quỹ",
    title: {
      vi: "Biến hành trình kinh doanh cổ trang thành nội dung dễ lan truyền",
      en: "Turning an ancient trading journey into shareable entertainment",
    },
    category: { vi: "Game Marketing & Creative", en: "Game Marketing & Creative" },
    year: "",
    color: "from-orange-700 to-navy-900",
    cover: {
      vi: "Hướng nội dung gần gũi và dí dỏm giúp trải nghiệm quản lý thương hội dễ tiếp cận với người chơi casual.",
      en: "A witty, approachable content direction that makes merchant management engaging for casual players.",
    },
    challenge: {
      vi: "Truyền tải một hệ thống kinh doanh có nhiều lớp tính năng mà không khiến nội dung trở nên nặng tính hướng dẫn.",
      en: "Communicate a layered business-management system without making the content feel instructional or complex.",
    },
    solution: {
      vi: "Các tính năng được chuyển hóa thành tình huống kinh doanh, câu chuyện thăng tiến và thử thách quản lý phù hợp với video ngắn và nội dung creator.",
      en: "Features are reframed as trading situations, progression stories and management challenges designed for short-form and creator content.",
    },
    results: [
      { value: "Story", label: { vi: "Hành trình từ tiểu thương", en: "Merchant progression narrative" } },
      { value: "Social", label: { vi: "Định dạng nội dung dễ chia sẻ", en: "Shareable social formats" } },
      { value: "Creator", label: { vi: "Ý tưởng phù hợp KOL/KOC", en: "Creator-ready concepts" } },
    ],
    services: ["game-app-marketing", "creative-design", "influencer-marketing"],
    focal: "66% center",
    overview: true,
  },
  {
    slug: "thien-tai-kinh-doanh",
    client: "Thiên Tài Kinh Doanh",
    title: {
      vi: "Kích hoạt tinh thần doanh nhân trong mỗi người chơi",
      en: "Unlocking the entrepreneur in every player",
    },
    category: { vi: "Game Marketing & Social", en: "Game Marketing & Social" },
    year: "",
    color: "from-navy-800 to-orange-500",
    cover: {
      vi: "Định vị trò chơi như hành trình ra quyết định, phát triển tài sản và xây dựng một đế chế kinh doanh.",
      en: "Positioning the game as a journey of decisions, asset growth and building a business empire.",
    },
    challenge: {
      vi: "Tạo khác biệt trong nhóm game mô phỏng kinh doanh và làm cho cơ chế quản lý hấp dẫn ngay từ điểm chạm đầu tiên.",
      en: "Stand out in the business-simulation category and make management mechanics compelling from the first touchpoint.",
    },
    solution: {
      vi: "Khai thác insight “nếu bạn là người điều hành”, kết hợp thử thách ra quyết định, nội dung phát triển từ con số không và thành tựu cộng đồng.",
      en: "Use the 'what would you do as the boss?' insight through decision challenges, zero-to-empire stories and community achievements.",
    },
    results: [
      { value: "Positioning", label: { vi: "Tư duy người điều hành", en: "Owner mindset" } },
      { value: "Short-form", label: { vi: "Tình huống quyết định nhanh", en: "Fast decision scenarios" } },
      { value: "Community", label: { vi: "Thành tựu & cạnh tranh", en: "Achievements and competition" } },
    ],
    services: ["game-app-marketing", "social-media", "creative-design"],
    fit: "contain",
    overview: true,
  },
  {
    slug: "tam-quoc-cong-thanh-thien-ha",
    client: "Tam Quốc Công Thành Thiên Hạ",
    title: {
      vi: "Khơi dậy cuộc chiến chiến thuật trong cộng đồng Tam Quốc",
      en: "Igniting strategic warfare for Three Kingdoms communities",
    },
    category: { vi: "Strategy Game Marketing", en: "Strategy Game Marketing" },
    year: "",
    color: "from-navy-950 to-orange-700",
    cover: {
      vi: "Hướng truyền thông tập trung vào công thành, liên minh và tư duy điều binh trên chiến trường quy mô lớn.",
      en: "A communications direction centered on siege warfare, alliances and large-scale battlefield strategy.",
    },
    challenge: {
      vi: "Tạo khác biệt giữa nhiều sản phẩm cùng chủ đề Tam Quốc bằng cách thể hiện rõ chiều sâu chiến thuật và sức mạnh cộng đồng.",
      en: "Differentiate within a crowded Three Kingdoms category by expressing strategic depth and the power of alliances.",
    },
    solution: {
      vi: "Nội dung làm nổi bật quy mô công thành, cách phối hợp liên minh, xây dựng đội hình và những quyết định có thể thay đổi cục diện.",
      en: "Content highlights siege scale, alliance coordination, formation building and decisions that can reshape the battlefield.",
    },
    results: [
      { value: "Siege", label: { vi: "Trọng tâm công thành", en: "Siege-led positioning" } },
      { value: "Alliance", label: { vi: "Sức mạnh cộng đồng", en: "Community power" } },
      { value: "Strategy", label: { vi: "Nội dung đội hình & chiến thuật", en: "Formation and tactics content" } },
    ],
    services: ["game-app-marketing", "social-media", "influencer-marketing"],
    focal: "65% center",
    overview: true,
  },
  {
    slug: "mu-vuot-thoi-dai",
    client: "MU Vượt Thời Đại",
    title: {
      vi: "Làm mới tinh thần MU cho một thế hệ người chơi mới",
      en: "Refreshing the MU spirit for a new generation",
    },
    category: { vi: "Integrated Game Marketing", en: "Integrated Game Marketing" },
    year: "",
    color: "from-navy-900 via-indigo-800 to-orange-600",
    cover: {
      vi: "Kết nối giá trị hoài niệm của MU với những trải nghiệm phù hợp kỳ vọng của người chơi hiện đại.",
      en: "Connecting MU nostalgia with experiences shaped for modern player expectations.",
    },
    challenge: {
      vi: "Tạo cảm giác quen thuộc cho cộng đồng lâu năm nhưng không để thông điệp chỉ dựa vào hoài niệm.",
      en: "Feel familiar to veteran communities without letting the message rely on nostalgia alone.",
    },
    solution: {
      vi: "Hướng nội dung kết nối ký ức chiến đấu, nghề nghiệp và bang hội với trải nghiệm mới, creator đa thế hệ và các điểm khám phá rõ ràng.",
      en: "Connect memories of combat, classes and guilds with new experiences, cross-generation creators and clear discovery points.",
    },
    results: [
      { value: "Legacy", label: { vi: "Giữ tinh thần MU", en: "Preserving the MU spirit" } },
      { value: "Refresh", label: { vi: "Làm mới câu chuyện", en: "A refreshed narrative" } },
      { value: "Guild", label: { vi: "Kích hoạt cộng đồng", en: "Community activation" } },
    ],
    services: ["game-app-marketing", "influencer-marketing", "social-media"],
    overview: true,
  },
  {
    slug: "football-master-2",
    client: "Football Master 2",
    title: {
      vi: "Đưa tư duy quản lý bóng đá vào cuộc cạnh tranh cộng đồng",
      en: "Turning football management into community competition",
    },
    category: { vi: "Sports Game Marketing", en: "Sports Game Marketing" },
    year: "",
    color: "from-emerald-800 to-navy-900",
    cover: {
      vi: "ANBU kết hợp KOL bóng đá, gaming creator và social content để đưa trải nghiệm quản lý đội hình vào các cuộc trò chuyện của người hâm mộ Việt Nam.",
      en: "ANBU combined football KOLs, gaming creators and social content to bring squad management into Vietnamese fan conversations.",
    },
    context: {
      vi: "Trong chiến dịch đưa Football Master 2 tiếp cận người chơi Việt Nam, ANBU khai thác trải nghiệm quản lý câu lạc bộ, xây dựng đội hình và thi đấu 3D như chất liệu để KOL kể chuyện. Nội dung được gắn với nhịp thảo luận bóng đá thực tế, giúp game xuất hiện tự nhiên thay vì chỉ như một quảng cáo cài đặt.",
      en: "For Football Master 2's Vietnam campaign, ANBU used club management, squad building and 3D matches as creator storytelling material. Content followed real football conversation, allowing the game to appear naturally rather than as a conventional install ad.",
    },
    challenge: {
      vi: "Biến cơ chế quản lý đội hình thành nội dung dễ tiếp cận và đủ cảm xúc để tham gia các cuộc trò chuyện bóng đá.",
      en: "Make squad-management mechanics accessible and emotional enough to join real football conversations.",
    },
    solution: {
      vi: "ANBU kết hợp KOL bóng đá, streamer và gaming creator theo lịch thi đấu thực tế. Các định dạng gồm thử thách xây đội theo ngân sách, tranh luận cầu thủ, dự đoán kết quả, phân tích chiến thuật và livestream đối đầu. Mỗi creator được giao một góc nội dung phù hợp với chuyên môn để thông điệp sản phẩm xuất hiện tự nhiên trong cuộc trò chuyện của người hâm mộ.",
      en: "ANBU combined football KOLs, streamers and gaming creators around the real match calendar. Formats included budget squad challenges, player debates, predictions, tactical analysis and head-to-head livestreams. Each creator received an expertise-led angle so the product appeared naturally in fan conversations.",
    },
    results: [
      { value: "KOL/KOC", label: { vi: "Bóng đá, gaming & livestream", en: "Football, gaming and livestream" } },
      { value: "Social", label: { vi: "Bám lịch thi đấu & chủ đề nóng", en: "Match-calendar and topical content" } },
      { value: "Community", label: { vi: "Thử thách đội hình & tranh luận", en: "Squad challenges and debates" } },
    ],
    services: ["game-app-marketing", "influencer-marketing", "social-media"],
    overview: true,
  },
  {
    slug: "life-makeover",
    client: "Life Makeover",
    title: {
      vi: "Biến thời trang và cá tính thành một thế giới để khám phá",
      en: "Turning fashion and identity into a world to explore",
    },
    category: { vi: "Lifestyle Game Marketing", en: "Lifestyle Game Marketing" },
    year: "",
    color: "from-violet-500 to-orange-400",
    cover: {
      vi: "ANBU triển khai creator-first marketing, kết nối thời trang, làm đẹp và lifestyle để giới thiệu Life Makeover đến cộng đồng người chơi Việt Nam.",
      en: "ANBU delivered creator-first marketing across fashion, beauty and lifestyle to introduce Life Makeover to Vietnamese audiences.",
    },
    context: {
      vi: "Life Makeover có nhiều lớp trải nghiệm từ tùy chỉnh nhân vật, thiết kế trang phục đến xây dựng không gian sống. ANBU biến các tính năng này thành chất liệu sáng tạo phù hợp với từng nhóm fashion, beauty và lifestyle creator, qua đó mở rộng cuộc trò chuyện ra ngoài cộng đồng game truyền thống.",
      en: "Life Makeover spans avatar customization, outfit creation and home design. ANBU translated these features into creator-ready ideas for fashion, beauty and lifestyle audiences, expanding conversation beyond conventional gaming communities.",
    },
    challenge: {
      vi: "Thể hiện chiều sâu trải nghiệm mà không giới hạn sản phẩm trong hình ảnh một game thời trang thông thường.",
      en: "Show the depth of the experience without reducing it to a conventional fashion game.",
    },
    solution: {
      vi: "ANBU định hướng creator theo ba nhóm: fashion KOL tạo lookbook và thử thách phối đồ; beauty creator khai thác tùy chỉnh khuôn mặt, tóc và makeup; lifestyle creator kể câu chuyện về căn nhà và cuộc sống mơ ước. Nội dung ưu tiên before–after, visual transition, thử thách theo chủ đề và UGC để biến tính năng trong game thành chất liệu thể hiện bản thân ngoài mạng xã hội.",
      en: "ANBU mapped creators into three groups: fashion KOLs for lookbooks and styling challenges; beauty creators for face, hair and makeup customization; and lifestyle creators for dream-home storytelling. Before–after edits, visual transitions, themed challenges and UGC turned in-game features into social self-expression.",
    },
    results: [
      { value: "KOL/KOC", label: { vi: "Fashion, beauty & lifestyle", en: "Fashion, beauty and lifestyle" } },
      { value: "3", label: { vi: "Nhóm creator chiến lược", en: "Strategic creator groups" } },
      { value: "Social", label: { vi: "Lookbook, transition & UGC", en: "Lookbooks, transitions and UGC" } },
    ],
    services: ["game-app-marketing", "influencer-marketing", "social-media"],
    focal: "62% center",
    overview: true,
  },
  {
    slug: "onmyoji-arena",
    client: "Onmyoji Arena",
    title: {
      vi: "Kết nối mỹ thuật Âm Dương Sư với trải nghiệm MOBA cạnh tranh",
      en: "Connecting Onmyoji aesthetics with competitive MOBA play",
    },
    category: { vi: "MOBA Marketing & Community", en: "MOBA Marketing & Community" },
    year: "",
    color: "from-indigo-900 to-orange-500",
    cover: {
      vi: "ANBU kết hợp gaming KOL, streamer và social community để lan tỏa bản sắc Âm Dương Sư trong giai đoạn Onmyoji Arena tiếp cận thị trường Việt Nam.",
      en: "ANBU combined gaming KOLs, streamers and social community content as Onmyoji Arena expanded in Vietnam.",
    },
    context: {
      vi: "Onmyoji Arena bước vào nhóm MOBA cạnh tranh với lợi thế mỹ thuật 3D, hệ thống thức thần đa dạng và bản sắc Á Đông rõ nét. ANBU dùng chính sự khác biệt này để xây tuyến nội dung KOL vừa có tính hướng dẫn, vừa đủ tính giải trí và thảo luận để duy trì cộng đồng.",
      en: "Onmyoji Arena competes in a crowded MOBA category through distinctive 3D art, a varied shikigami roster and a strong East Asian identity. ANBU used those differences to create KOL content balancing education, entertainment and sustained community discussion.",
    },
    challenge: {
      vi: "Tạo khác biệt trong thị trường MOBA cạnh tranh trong khi vẫn giữ được bản sắc riêng của thế giới Âm Dương Sư.",
      en: "Stand out in a competitive MOBA market while preserving the identity of the Onmyoji universe.",
    },
    solution: {
      vi: "ANBU định hướng gaming KOL, streamer và community creator theo vai trò thức thần, trình độ người chơi và định dạng nền tảng. Chuỗi nội dung kết hợp hướng dẫn nhập môn, phân tích meta, highlight kỹ năng, livestream leo hạng và thử thách cộng đồng. Cách tiếp cận này giúp người mới hiểu game nhanh hơn, đồng thời tạo đủ chiều sâu để người chơi lâu năm tiếp tục thảo luận.",
      en: "ANBU organized gaming KOLs, streamers and community creators by shikigami role, player skill level and platform format. Content combined beginner education, meta analysis, skill highlights, ranked livestreams and community challenges, helping newcomers understand the game while sustaining veteran conversation.",
    },
    results: [
      { value: "KOL/KOC", label: { vi: "Gaming, streamer & community", en: "Gaming, streamers and community" } },
      { value: "Social", label: { vi: "Nhập môn, meta & highlight", en: "Onboarding, meta and highlights" } },
      { value: "Community", label: { vi: "Livestream & thử thách leo hạng", en: "Livestreams and ranked challenges" } },
    ],
    services: ["game-app-marketing", "influencer-marketing", "social-media"],
    overview: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// Brands ANBU's team has worked with (used in the homepage marquee).
export const brands = [
  "MoMo",
  "Shopee",
  "Com2uS",
  "Honkai Impact 3",
  "Dibao",
  "MU Vinh Dự",
  "Summoners War",
  "Đấu La Đại Lục",
  "Gọi Ta Đại Chưởng Quỹ",
  "Thiên Tài Kinh Doanh",
  "Tam Quốc Công Thành Thiên Hạ",
  "MU Vượt Thời Đại",
  "Football Master 2",
  "Life Makeover",
  "Onmyoji Arena",
  "Nguyệt Mộng",
  "Focallure",
  "HEPCO",
];

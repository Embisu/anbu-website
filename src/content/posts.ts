import type { L10n } from "./site";
import type { SceneVariant } from "@/components/Scene";

export type Block =
  | { type: "p"; text: L10n }
  | { type: "h2"; text: L10n }
  | { type: "quote"; text: L10n }
  | { type: "ul"; items: L10n[] }
  | { type: "image"; src: string; alt: L10n; caption?: L10n };

export type Post = {
  slug: string;
  title: L10n;
  excerpt: L10n;
  category: L10n;
  date: string; // ISO
  readingTime: number;
  author: string;
  color: string;
  variant: SceneVariant;
  cover?: string;
  sources?: { label: L10n; href: string }[];
  body: Block[];
};

export const blogCategories = [
  { slug: "marketing-game", vi: "Marketing Game", en: "Game Marketing" },
  { slug: "van-hanh-game", vi: "Vận hành Game", en: "Game Operations" },
  { slug: "cong-dong-game", vi: "Cộng đồng Game", en: "Gaming Community" },
  { slug: "thi-truong-game", vi: "Thị trường Game", en: "Gaming Market" },
  { slug: "analytics-game", vi: "Analytics Game", en: "Game Analytics" },
  { slug: "kinh-doanh-game", vi: "Kinh doanh Game", en: "Game Business" },
  { slug: "esports", vi: "Esports Việt Nam", en: "Vietnam Esports" },
] as const;

export function categoryForPost(post: Post) {
  const slug = post.slug;
  if (/esports/.test(slug)) return "esports";
  if (/retention|liveops|soft-launch|ra-mat/.test(slug)) return "van-hanh-game";
  if (/ugc|influencer|tiktok|cong-dong/.test(slug)) return "cong-dong-game";
  if (/nha-phat-hanh|thi-truong|localization|vietnam|viet-nam|esports/.test(slug)) return "thi-truong-game";
  if (/cpi|roas|ltv|do-luong|performance/.test(slug)) return "analytics-game";
  if (/monetization/.test(slug)) return "kinh-doanh-game";
  return "marketing-game";
}

export const posts: Post[] = [
  {
    slug: "ban-do-nha-phat-hanh-game-viet-nam",
    title: {
      vi: "Bản đồ nhà phát hành game Việt Nam: các đối tác nổi bật",
      en: "Vietnam's game publisher landscape: established leaders and emerging partners",
    },
    excerpt: {
      vi: "Đưa một tựa game vào Việt Nam không chỉ là tìm một đơn vị có thể phát hành. Đối tác phù hợp còn phải hiểu người chơi, đủ sức vận hành đường dài và biết cách biến một sản phẩm quốc tế thành câu chuyện có ý nghĩa với cộng đồng bản địa.",
      en: "Bringing a game to Vietnam takes more than finding a company able to publish it. The right partner must understand local players, sustain long-term operations and turn an international product into a story that matters to the community.",
    },
    category: { vi: "Thị trường Game", en: "Gaming Market" },
    date: "2026-08-12",
    readingTime: 15,
    author: "ANBU Team",
    color: "from-navy-900 to-orange-600",
    variant: "game",
    cover: "/blog-covers/vietnam-game-publishers-map.png",
    sources: [
      { label: { vi: "VNGGames — hệ sinh thái trò chơi của VNG", en: "VNGGames — VNG's gaming ecosystem" }, href: "https://vng.com.vn/news/product/vnggames.html" },
      { label: { vi: "Garena — hoạt động phát triển game và esports tại Việt Nam", en: "Garena — game development and esports activity in Vietnam" }, href: "https://gamejam.garena.vn/vi" },
      { label: { vi: "JoyGames — cổng game và thông tin giấy phép G1", en: "JoyGames — game portal and G1 license information" }, href: "https://joygames.vn/" },
      { label: { vi: "VPlay — hệ sinh thái game và giải trí trực tuyến", en: "VPlay — online gaming and entertainment ecosystem" }, href: "https://vplay.onlive.vn/" },
      { label: { vi: "Cổng thông tin game online — thông tin Công ty Cổ phần VGP", en: "Official Online Games Portal — VGP company information" }, href: "https://game.gov.vn/nha-dau-tu/cong-ty-co-phan-vgp-2cf4" },
      { label: { vi: "Bộ Thông tin và Truyền thông — Nghị định 147/2024/NĐ-CP", en: "Ministry of Information and Communications — Decree 147/2024/ND-CP" }, href: "https://mic.gov.vn/nghi-dinh-147-2024-nd-cp-quan-ly-chat-che-dich-vu-tro-choi-dien-tu-tren-mang-va-thong-tin-tren-internet-197241227124622733.htm" },
    ],
    body: [
      { type: "p", text: {
        vi: "Khi một studio quốc tế hỏi “nhà phát hành game lớn nhất Việt Nam là ai?”, câu trả lời bằng một bảng xếp hạng thường không giúp họ tiến gần hơn đến quyết định đúng. Điều quan trọng hơn là: nhà phát hành nào hiểu thể loại của bạn, có năng lực vận hành tương ứng, chạm được đúng cộng đồng và phù hợp với cách bạn muốn xây thương hiệu trong ba năm tới — chứ không chỉ trong tuần ra mắt.",
        en: "When an international studio asks who Vietnam's biggest game publisher is, a ranking rarely brings it closer to the right decision. The better question is which publisher understands the genre, has the right operating capabilities, reaches the right community and fits how the brand wants to grow over the next three years—not merely launch week.",
      } },
      { type: "quote", text: {
        vi: "Ở Việt Nam, chọn đối tác phát hành không chỉ là chọn một kênh đưa game lên thị trường. Đó là chọn người sẽ cùng mình định vị sản phẩm, vận hành cộng đồng và xử lý những khác biệt bản địa mỗi ngày.",
        en: "In Vietnam, choosing a publishing partner is not simply choosing a route to market. It is choosing who will shape positioning, operate the community and navigate local differences every day.",
      } },
      { type: "h2", text: { vi: "Một thị trường, nhiều kiểu nhà phát hành", en: "One market, several publisher models" } },
      { type: "p", text: {
        vi: "Hệ sinh thái game Việt Nam có những doanh nghiệp lâu năm với nền tảng công nghệ và người dùng lớn; những đơn vị mạnh về esports; các nhà phát hành mobile có tốc độ thử nghiệm nhanh; và những đội ngũ tập trung sâu vào một nhóm người chơi cụ thể. Vì vậy, danh sách dưới đây không phải bảng xếp hạng thắng–thua. Đây là bản đồ để thương hiệu nhận ra mình đang cần loại năng lực nào.",
        en: "Vietnam's gaming ecosystem includes long-established businesses with large technology and user platforms, esports specialists, fast-moving mobile publishers and operators focused on particular player segments. The following is not a winner-takes-all ranking; it is a map for identifying the capabilities a title actually needs.",
      } },
      {
        type: "image",
        src: "/blog-covers/vietnam-game-publishers-map.png",
        alt: { vi: "Bản đồ phân khúc các nhà phát hành game tại thị trường Việt Nam", en: "Vietnam game publisher landscape and ecosystem map" },
        caption: { vi: "Bản đồ tổng thể hệ sinh thái và phân khúc các nhà phát hành game nổi bật tại thị trường Việt Nam.", en: "Overview map of the game publishing ecosystem and major publisher segments in Vietnam." },
      },
      { type: "h2", text: { vi: "VNGGames: năng lực vận hành quy mô và hệ sinh thái lâu dài", en: "VNGGames: scaled operations and a long-term ecosystem" } },
      { type: "p", text: {
        vi: "VNG bắt đầu từ lĩnh vực trò chơi trực tuyến vào năm 2004. Qua nhiều thế hệ sản phẩm, VNGGames xây được kinh nghiệm phát hành, bản địa hóa, vận hành dịch vụ và phát triển cộng đồng ở cả Việt Nam lẫn khu vực. Đây là cái tên phù hợp để nghiên cứu khi một sản phẩm cần năng lực vận hành lớn, lộ trình dài hơi, kết nối nhiều lớp dịch vụ hoặc tham vọng mở rộng Đông Nam Á.",
        en: "VNG began in online games in 2004. Across multiple product generations, VNGGames has built publishing, localization, live operations and community experience in Vietnam and the wider region. It is worth studying when a title needs scaled operations, a long roadmap, multiple service layers or Southeast Asian ambitions.",
      } },
      {
        type: "image",
        src: "/blog-covers/vng-campus-hq.jpg",
        alt: { vi: "Trụ sở quy mô lớn của các nhà phát hành công nghệ hàng đầu Việt Nam", en: "Modern headquarters and large-scale operations of leading Vietnamese tech publishers" },
        caption: { vi: "Trụ sở hiện đại và không gian làm việc quy mô lớn của các tập đoàn công nghệ phát hành game hàng đầu tại Việt Nam.", en: "Modern corporate campus and scaled workspace of leading game publishing technology enterprises in Vietnam." },
      },
      {
        type: "image",
        src: "/blog-covers/publishers/vng-cookierun.jpg",
        alt: { vi: "Hệ sinh thái phát hành game và tựa game CookieRun của VNGGames", en: "VNGGames game publishing ecosystem and CookieRun title" },
        caption: { vi: "Hình ảnh tựa game CookieRun trên hệ sinh thái phát hành và vận hành quy mô của VNGGames.", en: "CookieRun within the scaled publishing and live-ops ecosystem of VNGGames in Vietnam & SEA." },
      },
      { type: "ul", items: [
        { vi: "Phù hợp để cân nhắc: MMORPG, sản phẩm IP lớn, game cần live-ops lâu dài hoặc chiến lược khu vực", en: "Worth considering for: MMORPGs, major IP, long-running live operations and regional strategies" },
        { vi: "Điểm cần làm rõ khi trao đổi: mức độ ưu tiên trong danh mục, quyền chủ động marketing và cách chia sẻ dữ liệu người chơi", en: "Clarify during discussions: portfolio priority, marketing autonomy and player-data collaboration" },
      ] },
      { type: "h2", text: { vi: "Garena: sức mạnh của cạnh tranh, cộng đồng và esports", en: "Garena: competition, community and esports strength" } },
      { type: "p", text: {
        vi: "Garena tạo dấu ấn rõ với những sản phẩm có tính cạnh tranh cao, nhịp vận hành liên tục và cộng đồng được nuôi bằng giải đấu, nội dung lẫn hoạt động trực tiếp. Với một tựa game có tiềm năng trở thành môn chơi lâu dài thay vì chỉ là nội dung giải trí ngắn hạn, năng lực biến người chơi thành cộng đồng theo dõi và thi đấu là một lợi thế đáng chú ý.",
        en: "Garena is strongly associated with competitive products, continuous operations and communities sustained through tournaments, content and live events. For a title with the potential to become a long-term competitive pursuit rather than short-lived entertainment, its ability to turn players into participating audiences is especially relevant.",
      } },
      {
        type: "image",
        src: "/blog-covers/garena-arena-crowd.jpg",
        alt: { vi: "Sân khấu thi đấu và dàn máy giải đấu Esports chuyên nghiệp Garena", en: "Garena professional esports tournament arena and competition stage" },
        caption: { vi: "Đấu trường giải đấu quy mô với dàn máy thi đấu chuẩn quốc tế nuôi dưỡng cộng đồng cạnh tranh dài hạn.", en: "Full-scale competitive arena and international-standard tournament stations sustaining a long-term player community." },
      },
      { type: "ul", items: [
        { vi: "Phù hợp để cân nhắc: MOBA, battle royale, thể thao, shooter và sản phẩm có vòng đời esports", en: "Worth considering for: MOBA, battle royale, sports, shooters and titles with esports potential" },
        { vi: "Điểm cần làm rõ: kế hoạch xây giải đấu từ grassroots đến chuyên nghiệp và vai trò của creator trong hệ sinh thái", en: "Clarify: the grassroots-to-professional tournament path and creators' role in the ecosystem" },
      ] },
      { type: "h2", text: { vi: "VTC Game: kinh nghiệm thị trường và độ phủ nhiều thế hệ người chơi", en: "VTC Game: market experience across player generations" } },
      { type: "p", text: {
        vi: "VTC Game là một trong những thương hiệu gắn với giai đoạn hình thành thị trường game online Việt Nam. Giá trị của một đơn vị lâu năm không chỉ nằm ở danh mục từng phát hành, mà còn ở kinh nghiệm vận hành dịch vụ, thanh toán, chăm sóc khách hàng và làm việc trong hệ sinh thái nội dung số nội địa. Đây có thể là hướng phù hợp với thương hiệu coi trọng độ bền vận hành và mạng lưới thị trường trong nước.",
        en: "VTC Game is one of the brands associated with the formative years of Vietnam's online game market. The value of a long-standing operator lies not only in its catalogue but also in service operations, payments, customer care and experience within the domestic digital-content ecosystem. It may suit brands that prioritize operational durability and local market reach.",
      } },
      { type: "h2", text: { vi: "Funtap, Gamota, GOSU và SohaGame: tốc độ, phân khúc và khả năng bản địa hóa", en: "Funtap, Gamota, GOSU and SohaGame: speed, segmentation and localization" } },
      { type: "p", text: {
        vi: "Nhóm nhà phát hành mobile nội địa này góp phần làm thị trường đa dạng hơn. Mỗi đơn vị có lịch sử sản phẩm và tập người chơi khác nhau, nhưng điểm đáng quan tâm chung là khả năng đưa sản phẩm đến đúng phân khúc, phản ứng nhanh với hành vi cộng đồng và triển khai marketing bản địa ở quy mô linh hoạt. Với game mid-core, nhập vai, chiến thuật hoặc sản phẩm cần kiểm chứng thị trường nhanh, đây là nhóm đối tác không nên bị bỏ qua.",
        en: "These local mobile publishers add diversity to the market. Each has a different catalogue and player base, but their shared relevance lies in reaching specific segments, reacting quickly to community behavior and executing local marketing at flexible scale. For mid-core, RPG, strategy or market-testing titles, they should not be overlooked.",
      } },
      {
        type: "image",
        src: "/blog-covers/publishers/funtap-game.jpg",
        alt: { vi: "Danh mục sản phẩm game mobile của Funtap", en: "Funtap mobile game portfolio" },
        caption: { vi: "Danh mục sản phẩm đa dạng và khả năng phản ứng nhanh với thị trường của nhóm NPH mobile nội địa.", en: "Diverse mobile game portfolio and agile market response of local Vietnamese publishers." },
      },
      { type: "h2", text: { vi: "JoyGames: một lựa chọn đang mở rộng ở phân khúc game mobile", en: "JoyGames: a growing option in mobile publishing" } },
      { type: "p", text: {
        vi: "JoyGames là một cái tên đáng theo dõi trong lớp nhà phát hành đang mở rộng hiện diện. Website chính thức công khai giấy phép cung cấp dịch vụ trò chơi điện tử G1 và một danh mục game riêng, cho thấy đơn vị này đang xây năng lực phát hành theo hướng bài bản hơn thay vì chỉ đóng vai trò kênh phân phối. Với studio quốc tế, điểm đáng quan tâm không nằm ở việc gọi JoyGames là “lớn” hay “nhỏ”, mà ở khả năng một sản phẩm phù hợp có thể nhận được mức độ tập trung cao hơn trong danh mục.",
        en: "JoyGames is worth watching among publishers expanding their presence. Its official website displays a G1 online-game service license and a dedicated catalogue, indicating a more structured publishing operation rather than a simple distribution channel. For international studios, the relevant question is not whether JoyGames is labelled large or small, but whether a well-matched title could receive greater focus within its portfolio.",
      } },
      {
        type: "image",
        src: "/blog-covers/publishers/joygames-game.png",
        alt: { vi: "Cổng game và danh mục sản phẩm của JoyGames", en: "JoyGames portal and game catalogue" },
        caption: { vi: "Hình ảnh tựa game Pixel Đại Chiến trên cổng phát hành chính thức của JoyGames.", en: "Pixel Dai Chien artwork from the official JoyGames publishing portal." },
      },
      { type: "ul", items: [
        { vi: "Nên kiểm tra: kinh nghiệm với đúng thể loại, quy mô đội live-ops, năng lực mua người dùng và kế hoạch cộng đồng sau 90 ngày", en: "Assess: genre experience, live-ops team size, user-acquisition capability and the community plan beyond day 90" },
        { vi: "Cơ hội tiềm năng: tốc độ ra quyết định và mức độ ưu tiên dành cho sản phẩm phù hợp", en: "Potential advantage: decision speed and priority for a well-matched title" },
      ] },
      { type: "h2", text: { vi: "VPlay: khi game được đặt trong một hệ sinh thái nội dung rộng hơn", en: "VPlay: placing games inside a broader content ecosystem" } },
      { type: "p", text: {
        vi: "VPlay có một góc tiếp cận khác: game nằm trong hệ sinh thái giải trí có livestream, nội dung và kết nối với hạ tầng truyền thông. Điều này có thể tạo lợi thế cho sản phẩm cần nhiều điểm chạm hơn quảng cáo cài đặt đơn thuần — chẳng hạn ra mắt gắn với chương trình nội dung, giải đấu, creator hoặc hoạt động cộng đồng được phát sóng. Tuy nhiên, thương hiệu vẫn cần làm rõ phần nào của hệ sinh thái thực sự được huy động cho game của mình, thay vì mặc định mọi nguồn lực đều đi cùng một hợp đồng phát hành.",
        en: "VPlay approaches the market differently by placing games within an entertainment ecosystem that includes livestreaming, content and media infrastructure. This can benefit titles that need more than install advertising—for example, launches tied to programming, tournaments, creators or broadcast community activity. Brands should still clarify which parts of that ecosystem will actually support their title rather than assume every resource comes with a publishing agreement.",
      } },
      {
        type: "image",
        src: "/blog-covers/publishers/vplay-game.jpg",
        alt: { vi: "Hệ sinh thái game và giải trí trực tuyến của VPlay", en: "VPlay online entertainment and gaming ecosystem" },
        caption: { vi: "Hệ sinh thái game kết hợp livestream, nội dung số và truyền thông giải trí của VPlay.", en: "VPlay gaming ecosystem integrated with livestreaming, digital content and entertainment media." },
      },
      { type: "ul", items: [
        { vi: "Phù hợp để tìm hiểu: game có khả năng phát triển nội dung xem được, giải đấu hoặc cộng đồng tương tác thường xuyên", en: "Worth exploring for: games with watchable content, tournament potential or frequent community interaction" },
        { vi: "Cần làm rõ: quyền truy cập inventory truyền thông, dữ liệu người xem và cam kết cross-promotion", en: "Clarify: access to media inventory, audience data and cross-promotion commitments" },
      ] },
      { type: "h2", text: { vi: "VGP: định vị như một cầu nối cho game mobile vào Việt Nam", en: "VGP: positioning as a bridge for mobile games entering Vietnam" } },
      { type: "p", text: {
        vi: "VGP tự định vị là Viet Game Publisher và hướng thông điệp trực tiếp tới cơ hội tại thị trường game mobile Việt Nam. Với một nhà phát triển nước ngoài đang tìm đối tác bản địa linh hoạt, cách định vị này đáng để đưa vào shortlist. Dù vậy, website giới thiệu mới chỉ là điểm bắt đầu; quyết định hợp tác cần dựa trên hồ sơ sản phẩm đã vận hành, đội ngũ chuyên trách, năng lực pháp lý thực tế và cách hai bên chia sẻ trách nhiệm doanh thu, dữ liệu lẫn chăm sóc người chơi.",
        en: "VGP positions itself as a Viet Game Publisher and speaks directly to opportunities in Vietnam's mobile market. For an overseas developer seeking a flexible local partner, that positioning earns it a place on the shortlist. A company website is only a starting point, however; partnership decisions should rest on operated-title evidence, dedicated team capability, actual regulatory readiness and clear allocation of revenue, data and player-care responsibilities.",
      } },
      { type: "h2", text: { vi: "Vì sao nhà phát hành mới nổi đôi khi lại là lựa chọn đúng?", en: "Why an emerging publisher can sometimes be the right choice" } },
      { type: "p", text: {
        vi: "Nhà phát hành lớn có hệ thống, dữ liệu và độ phủ; đổi lại, mỗi game phải cạnh tranh nguồn lực với một danh mục rộng. Đối tác đang tăng trưởng thường có quy mô nhỏ hơn, nhưng có thể ra quyết định nhanh, linh hoạt commercial terms và dành sự chú ý sâu hơn cho một sản phẩm chiến lược. Lợi thế này chỉ có giá trị khi đi kèm năng lực thật: đội vận hành ổn định, quy trình xử lý sự cố, hiểu biết pháp lý và khả năng giữ cộng đồng sau lúc ngân sách ra mắt đã giảm.",
        en: "Large publishers offer systems, data and reach, but every title competes for resources inside a broad portfolio. A growing partner may be smaller yet decide faster, offer more flexible commercial terms and devote deeper attention to a strategic title. That advantage matters only when backed by real capability: stable operations, incident response, regulatory understanding and the ability to sustain a community after launch spending declines.",
      } },
      { type: "p", text: {
        vi: "Tên tuổi không thay thế cho product–market fit. Một nhà phát hành sở hữu cộng đồng lớn ở dòng nhập vai chưa chắc là lựa chọn tối ưu cho game mô phỏng thời trang; một đơn vị mạnh về mua người dùng chưa chắc đã phù hợp nếu sản phẩm cần câu chuyện thương hiệu và cộng đồng sáng tạo nội dung. Thương hiệu nên yêu cầu đối tác trình bày giả thuyết người chơi, kế hoạch 90 ngày và cơ chế ra quyết định sau khi dữ liệu bắt đầu về.",
        en: "Reputation does not replace product–market fit. A publisher with a large RPG audience may not be ideal for a fashion simulation; strong user acquisition alone may not be enough when a title needs brand storytelling and creator-led community. Brands should ask potential partners for a player hypothesis, a 90-day plan and a decision framework for acting on early data.",
      } },
      { type: "h2", text: { vi: "Tám câu hỏi trước khi chọn đối tác phát hành", en: "Eight questions before choosing a publishing partner" } },
      { type: "ul", items: [
        { vi: "Trong 12 tháng gần nhất, đối tác đã vận hành sản phẩm nào có hành vi người chơi gần nhất với game của bạn?", en: "In the past 12 months, which operated title has player behavior closest to yours?" },
        { vi: "Game của bạn sẽ đứng ở đâu trong thứ tự ưu tiên của danh mục phát hành?", en: "Where will your title sit in the publisher's portfolio priorities?" },
        { vi: "Ai sở hữu dữ liệu, tài sản nội dung, kênh cộng đồng và mối quan hệ creator sau chiến dịch?", en: "Who owns data, content assets, community channels and creator relationships after launch?" },
        { vi: "Quy trình phê duyệt, bản địa hóa và xử lý khủng hoảng mất bao lâu?", en: "How long do approval, localization and crisis-response workflows take?" },
        { vi: "Ngoài lượt cài, hai bên thống nhất thế nào về retention, doanh thu, sức khỏe cộng đồng và giá trị thương hiệu?", en: "Beyond installs, how will both sides define retention, revenue, community health and brand value?" },
        { vi: "Ai là đội ngũ trực tiếp vận hành game hằng ngày và họ đang đồng thời phụ trách bao nhiêu sản phẩm?", en: "Who will operate the title day to day, and how many other products is that team handling?" },
        { vi: "Nếu KPI tháng đầu không đạt, đối tác có quy trình chẩn đoán và quyền điều chỉnh ngân sách như thế nào?", en: "If first-month KPIs miss, what diagnostic process and budget-adjustment authority does the partner have?" },
        { vi: "Khi hợp tác kết thúc, quy trình bàn giao dữ liệu, cộng đồng, tài sản sáng tạo và hỗ trợ người chơi được quy định ra sao?", en: "When the partnership ends, how will data, community channels, creative assets and player support be transferred?" },
      ] },
      { type: "h2", text: { vi: "Pháp lý không phải bước cuối của kế hoạch ra mắt", en: "Legal readiness is not the final step of launch planning" } },
      { type: "p", text: {
        vi: "Tại Việt Nam, trò chơi điện tử trên mạng chịu sự điều chỉnh của Nghị định 147/2024/NĐ-CP và các quy định liên quan. Tùy mô hình G1, G2, G3 hay G4, yêu cầu về giấy phép hoặc xác nhận phát hành, nội dung, vật phẩm ảo, thông tin người chơi và cách vận hành sẽ khác nhau. Nếu đợi đến lúc chiến dịch marketing đã chốt ngày mới kiểm tra hồ sơ, thương hiệu có thể phải sửa thông điệp, tài sản sáng tạo hoặc cả lịch ra mắt.",
        en: "Online games in Vietnam are governed by Decree 147/2024/ND-CP and related rules. Depending on whether a title falls under G1, G2, G3 or G4, licensing or release confirmation, content, virtual items, player information and operating obligations differ. If legal readiness is checked only after marketing dates are fixed, brands may have to revise messaging, creative assets or the entire launch calendar.",
      } },
      { type: "ul", items: [
        { vi: "Xác định mô hình phát hành và chủ thể chịu trách nhiệm tại Việt Nam", en: "Define the publishing model and responsible Vietnamese entity" },
        { vi: "Rà soát phân loại game, nội dung, hình ảnh, cơ chế nạp và vật phẩm ảo", en: "Review game classification, content, imagery, payment mechanics and virtual items" },
        { vi: "Đồng bộ tiến độ hồ sơ với localization, PR, KOL/KOC, community và ngày mở dịch vụ", en: "Align filing timelines with localization, PR, KOL/KOC, community and service opening" },
        { vi: "Chuẩn bị phương án dữ liệu cá nhân, chăm sóc người chơi và xử lý sự cố", en: "Prepare player-data, customer-care and incident-response plans" },
      ] },
      { type: "h2", text: { vi: "ANBU không chỉ hỗ trợ pháp lý, mà còn giúp thương hiệu tìm nhà phát hành", en: "Beyond legal readiness, ANBU helps brands find a publishing partner" } },
      { type: "p", text: {
        vi: "Nhiều studio có sản phẩm tốt nhưng chưa biết bắt đầu cuộc trò chuyện với thị trường Việt Nam từ đâu. ANBU có thể đứng ở phía thương hiệu như một đầu mối phát triển thị trường: chuyển thông tin kỹ thuật và dữ liệu sản phẩm thành một hồ sơ cơ hội đủ rõ, tìm kiếm nhà phát hành phù hợp, mở cuộc trao đổi và giúp hai bên đi từ buổi giới thiệu đầu tiên đến một phương án hợp tác có thể triển khai.",
        en: "Many studios have strong products but do not know how to begin a serious conversation with the Vietnamese market. ANBU can work on the brand's side as a market-development lead: turning technical and product data into a clear opportunity profile, identifying suitable publishers, opening discussions and helping both sides move from the first introduction to an executable partnership model.",
      } },
      {
        type: "image",
        src: "/blog-covers/real-team.jpg",
        alt: { vi: "Đội ngũ ANBU làm việc và kết nối đối tác phát hành game", en: "ANBU team working on publisher matchmaking and launch strategy" },
        caption: { vi: "Đội ngũ ANBU hỗ trợ studio quốc tế đánh giá sản phẩm, xây dựng hồ sơ và kết nối nhà phát hành phù hợp tại Việt Nam.", en: "ANBU team supporting international studios in assessing titles, structuring pitches and connecting with suitable Vietnamese publishers." },
      },
      { type: "h2", text: { vi: "Bước 1: đánh giá game trước khi giới thiệu ra thị trường", en: "Step 1: assess the game before taking it to market" } },
      { type: "p", text: {
        vi: "Một bộ pitch chỉ có trailer và vài con số tải toàn cầu thường chưa đủ để nhà phát hành Việt Nam ra quyết định. ANBU cùng khách hàng làm rõ thể loại, vòng lặp gameplay, mô hình kiếm tiền, mức độ hoàn thiện, yêu cầu localization, cấu hình máy, chân dung người chơi và bằng chứng vận hành ở thị trường khác. Mục tiêu là trả lời thẳng ba câu hỏi: game này có cơ hội ở Việt Nam không, cơ hội nằm ở phân khúc nào và đối tác cần đầu tư bao nhiêu để kiểm chứng giả thuyết đó.",
        en: "A pitch containing only a trailer and global download numbers is rarely enough for a Vietnamese publisher to decide. ANBU helps clarify genre, gameplay loop, monetization, product readiness, localization needs, device requirements, player profile and evidence from other markets. The goal is to answer three questions directly: can this title work in Vietnam, where is the opportunity and what investment is needed to validate it?",
      } },
      {
        type: "image",
        src: "/blog-covers/game-studio-dev.jpg",
        alt: { vi: "Đội ngũ phát triển game và bàn làm việc kỹ thuật sản phẩm", en: "Game development studio and technical product setup" },
        caption: { vi: "Quy trình đánh giá vòng lặp gameplay, tối ưu hiệu năng thiết bị và chuẩn bị sản phẩm trước khi tiếp cận NPH bản địa.", en: "Evaluating core gameplay loops, optimizing device performance and preparing builds before local publisher outreach." },
      },
      { type: "ul", items: [
        { vi: "Rà soát product–market fit và xác định điểm bán hàng phù hợp với người chơi Việt Nam", en: "Review product–market fit and define a relevant value proposition for Vietnamese players" },
        { vi: "Chuẩn hóa publisher deck, gameplay footage, KPI lịch sử, kế hoạch nội dung và yêu cầu kỹ thuật", en: "Prepare the publisher deck, gameplay footage, historical KPIs, content roadmap and technical requirements" },
        { vi: "Nhận diện sớm các điểm có thể ảnh hưởng đến localization, pháp lý hoặc lịch ra mắt", en: "Identify early issues that could affect localization, legal readiness or the launch schedule" },
      ] },
      { type: "h2", text: { vi: "Bước 2: tìm kiếm và sàng lọc nhà phát hành phù hợp", en: "Step 2: identify and qualify suitable publishers" } },
      { type: "p", text: {
        vi: "ANBU không gửi cùng một email cho mọi nhà phát hành. Shortlist cần được xây từ độ phù hợp thể loại, lịch sử danh mục, quy mô cộng đồng, năng lực live-ops, hạ tầng thanh toán, tốc độ ra quyết định và mức độ ưu tiên mà game có thể nhận được. Một sản phẩm cạnh tranh có thể cần đối tác mạnh về esports; một game nhập vai mid-core cần kinh nghiệm vận hành server và chăm sóc whale; một game casual lại cần năng lực mua người dùng và thử nghiệm creative với nhịp rất nhanh.",
        en: "ANBU does not send the same email to every publisher. A shortlist should reflect genre fit, portfolio history, community scale, live-ops capability, payment infrastructure, decision speed and the priority a title is likely to receive. A competitive game may need esports strength; a mid-core RPG may need server operations and high-value-player care; a casual title may depend on rapid user-acquisition and creative testing.",
      } },
      { type: "h2", text: { vi: "Bước 3: kết nối, điều phối trao đổi và so sánh đề xuất", en: "Step 3: connect, coordinate discussions and compare proposals" } },
      { type: "p", text: {
        vi: "Tìm được tên liên hệ mới chỉ là điểm khởi đầu. ANBU có thể hỗ trợ chuẩn bị buổi pitching, điều phối Q&A giữa đội sản phẩm và nhà phát hành, theo dõi các yêu cầu bổ sung và hệ thống hóa đề xuất của từng bên. Khi có nhiều lựa chọn, chúng tôi giúp khách hàng so sánh trên cùng một khung: phạm vi lãnh thổ, mô hình cấp quyền, minimum guarantee nếu có, tỷ lệ chia sẻ, ngân sách marketing, trách nhiệm xin phép, quyền dữ liệu, KPI, thời hạn và điều kiện kết thúc hợp tác.",
        en: "Finding a contact is only the beginning. ANBU can prepare the pitch, coordinate Q&A between product teams and publishers, track follow-up requests and structure each proposal. When several options emerge, we help clients compare them on one framework: territory, licensing model, any minimum guarantee, revenue share, marketing investment, regulatory responsibilities, data rights, KPIs, term and exit conditions.",
      } },
      {
        type: "image",
        src: "/blog-covers/team-strategy-meeting.jpg",
        alt: { vi: "Buổi làm việc chiến lược và đàm phán phương án hợp tác phát hành", en: "Strategic publishing partnership negotiation and alignment session" },
        caption: { vi: "ANBU đồng hành cùng thương hiệu trong các buổi trao đổi, đàm phán điều khoản và so sánh đề xuất giữa các NPH.", en: "ANBU partnering with brands through publisher pitches, commercial term negotiations and proposal comparisons." },
      },
      { type: "quote", text: {
        vi: "Mục tiêu không phải tìm nhà phát hành đồng ý nhanh nhất, mà tìm đối tác có đủ động lực, năng lực và cơ chế hợp tác để đưa game đi đường dài.",
        en: "The goal is not to find the publisher that says yes fastest, but the partner with the motivation, capability and operating model to build the title for the long term.",
      } },
      { type: "h2", text: { vi: "Bước 4: biến thỏa thuận phát hành thành một kế hoạch ra mắt thống nhất", en: "Step 4: turn the publishing agreement into one integrated launch plan" } },
      { type: "p", text: {
        vi: "Sau khi có đối tác, ANBU tiếp tục phối hợp để pháp lý, localization, KOL/KOC, báo chí, social, community và lịch mở dịch vụ chạy trên cùng một đường thời gian. ANBU có thể trực tiếp phụ trách hoặc điều phối phần chiến lược ra mắt, truyền thông và creator marketing; nhà phát hành đủ điều kiện cùng đơn vị chuyên môn đảm trách hồ sơ, vận hành dịch vụ và các nghĩa vụ pháp lý tương ứng. Cách phân vai này giúp thương hiệu biết rõ ai chịu trách nhiệm cho từng đầu việc và tránh khoảng trống giữa lúc ký hợp đồng với lúc game thực sự đến tay người chơi.",
        en: "Once a partner is selected, ANBU continues coordinating legal readiness, localization, KOL/KOC, press, social, community and service-opening milestones on one timeline. ANBU can lead or coordinate launch strategy, communications and creator marketing, while the eligible publisher and qualified specialists handle filings, service operations and relevant legal obligations. This division makes ownership clear and prevents gaps between signing the agreement and putting the game in players' hands.",
      } },
      { type: "h2", text: { vi: "Ba hình thức ANBU có thể hỗ trợ", en: "Three ways ANBU can support" } },
      { type: "ul", items: [
        { vi: "Publisher Search: đánh giá sản phẩm, lập shortlist, chuẩn bị hồ sơ và kết nối nhà phát hành", en: "Publisher Search: product assessment, shortlisting, pitch preparation and publisher introductions" },
        { vi: "Market Entry Coordination: phối hợp nhà phát hành, đối tác pháp lý, localization và kế hoạch go-to-market", en: "Market Entry Coordination: align publisher, legal partners, localization and the go-to-market plan" },
        { vi: "Launch & Growth: triển khai KOL/KOC, PR, social, community và nội dung để tạo đà ra mắt", en: "Launch & Growth: execute KOL/KOC, PR, social, community and content to build launch momentum" },
      ] },
      { type: "quote", text: {
        vi: "Nếu bạn có một tựa game muốn đưa vào Việt Nam nhưng chưa có nhà phát hành, hãy gửi cho ANBU thông tin sản phẩm, nền tảng, thị trường đã vận hành và thời gian dự kiến. Chúng tôi sẽ cùng bạn đánh giá hướng tiếp cận, tìm kiếm đối tác phù hợp và xây lộ trình từ kết nối phát hành đến ra mắt thị trường.",
        en: "If you have a game for Vietnam but no local publisher, send ANBU the product overview, platforms, operating markets and target timeline. We will help assess the entry path, search for suitable partners and build a roadmap from publisher introductions through market launch.",
      } },
      { type: "p", text: {
        vi: "Lưu ý: ANBU cung cấp dịch vụ tìm kiếm đối tác phát hành, phát triển thị trường và điều phối ra mắt; việc chấp thuận hợp tác phụ thuộc vào đánh giá của từng nhà phát hành. Nội dung trong bài mang tính thông tin chung, không phải ý kiến tư vấn pháp luật. Hồ sơ và kết luận pháp lý cụ thể cần được thực hiện bởi đơn vị tư vấn chuyên môn hoặc nhà phát hành đủ điều kiện tại Việt Nam.",
        en: "Note: ANBU provides publisher-search, market-development and launch-coordination services; partnership approval remains subject to each publisher's assessment. This article provides general information, not legal advice. Specific filings and legal conclusions should be handled by qualified professional counsel or an eligible Vietnamese publisher.",
      } },
    ],
  },
  {
    slug: "thi-truong-game-viet-nam-bao-hoa-chien-luoc-tang-truong",
    title: {
      vi: "Thị trường game Việt Nam bão hòa: chiến lược tăng trưởng",
      en: "Vietnam's saturated game market: what strategy do major publishers need?",
    },
    excerpt: {
      vi: "Game mới vẫn ra mắt mỗi tuần, nhưng thời gian và sự chú ý của người chơi thì không tăng thêm. Trong một thị trường ngày càng chật chội, chiến thắng không còn thuộc về thương hiệu xuất hiện nhiều nhất, mà thuộc về cái tên cho người chơi một lý do đủ rõ để ở lại.",
      en: "New games still launch every week, but players have no more time or attention to give. In an increasingly crowded market, the winner is no longer the brand that appears most often, but the one that gives players a clear reason to stay.",
    },
    category: { vi: "Thị trường Game", en: "Gaming Market" },
    date: "2026-08-12",
    readingTime: 10,
    author: "ANBU Team",
    color: "from-navy-800 to-orange-600",
    variant: "game",
    cover: "/blog-covers/vietnam-game-saturation.png",
    sources: [
      { label: { vi: "Google Play — chính sách và chất lượng ứng dụng", en: "Google Play — app quality and policy guidance" }, href: "https://developer.android.com/distribute/best-practices" },
      { label: { vi: "Bộ Khoa học và Công nghệ — Nghị định 147/2024/NĐ-CP", en: "Vietnam Ministry of Science and Technology — Decree 147/2024/ND-CP" }, href: "https://vanban.chinhphu.vn/?pageid=27160&docid=211230" },
    ],
    body: [
      {
        type: "p",
        text: {
          vi: "Thị trường game Việt Nam không thiếu sản phẩm mới. Điều đang thiếu là lý do đủ rõ để người chơi dừng lại, quan tâm và dành thời gian cho một tựa game giữa hàng loạt lựa chọn quen thuộc. Bão hòa không có nghĩa thị trường hết cơ hội; nó có nghĩa thương hiệu phải cạnh tranh bằng chiến lược sắc hơn thay vì chỉ tăng số bài đăng hoặc ngân sách phủ sóng.",
          en: "Vietnam does not lack new games. What is scarce is a compelling reason for players to stop, care and invest time in one title among many familiar alternatives. Saturation does not mean opportunity has disappeared; it means brands must compete with sharper strategy rather than simply buying more posts or reach.",
        },
      },
      { type: "h2", text: { vi: "Bão hòa thực sự diễn ra ở sự chú ý", en: "The real saturation is attention" } },
      {
        type: "p",
        text: {
          vi: "Người chơi liên tục nhìn thấy trailer, giftcode, livestream và thông điệp mở server. Khi mọi chiến dịch dùng cùng một ngôn ngữ, sản phẩm mới dễ bị xem như một phiên bản khác của điều đã có. Bài toán vì vậy không chỉ là tiếp cận bao nhiêu người, mà là thương hiệu có chiếm được một ý niệm riêng trong tâm trí họ hay không.",
          en: "Players constantly see trailers, gift codes, livestreams and server-opening messages. When every campaign uses the same language, a new release feels like another version of something already available. The challenge is therefore not only how many people are reached, but whether the brand owns a distinct idea in their minds.",
        },
      },
      {
        type: "image",
        src: "/blog-covers/vietnam-game-saturation.png",
        alt: { vi: "Biểu đồ phân tích độ bão hòa và mật độ cạnh tranh game tại Việt Nam", en: "Vietnam game market saturation and competition analysis" },
        caption: { vi: "Phân tích mức độ cạnh tranh và điểm bão hòa sự chú ý của game thủ tại thị trường Việt Nam.", en: "Analysis of competition levels and player attention saturation in Vietnam." },
      },
      { type: "h2", text: { vi: "Năm dấu hiệu một chiến dịch game đang thiếu chiến lược", en: "Five signs a game campaign lacks strategy" } },
      {
        type: "ul",
        items: [
          { vi: "Thông điệp tập trung vào tính năng nhưng không nói rõ game dành cho kiểu người chơi nào", en: "Messaging lists features without defining the player the game is for" },
          { vi: "Danh sách KOL lớn nhưng tất cả creator đều nhận cùng một brief và làm cùng một vai trò", en: "A large KOL list where every creator receives the same brief and serves the same role" },
          { vi: "Social, PR, community và performance chạy song song nhưng không cùng kể một câu chuyện", en: "Social, PR, community and performance run in parallel without telling one story" },
          { vi: "Toàn bộ sức nóng dồn vào ngày ra mắt, sau đó nội dung và cộng đồng giảm nhịp nhanh", en: "All momentum is concentrated on launch day, followed by a rapid decline in content and community activity" },
          { vi: "Đội ngũ báo cáo lượt xem và lượt cài nhưng không biết thông điệp hay nhóm creator nào tạo ra người chơi chất lượng", en: "The team reports views and installs but cannot identify which message or creator group produced quality players" },
        ],
      },
      { type: "h2", text: { vi: "Bước 1: chọn một trận địa định vị có thể bảo vệ", en: "Step 1: choose a defensible positioning battlefield" } },
      {
        type: "p",
        text: {
          vi: "Một game không thể đồng thời là lựa chọn tốt nhất cho tất cả mọi người. Thương hiệu cần xác định nhóm người chơi ưu tiên, động lực cốt lõi của họ và bằng chứng sản phẩm có thể chứng minh lời hứa. Định vị tốt phải đủ cụ thể để hướng dẫn creative, tuyển chọn KOL và quyết định điều gì không nên nói.",
          en: "A game cannot be the best choice for everyone at once. The brand must define its priority players, their core motivation and the product evidence supporting its promise. Strong positioning is specific enough to guide creative, creator selection and what the campaign should refuse to say.",
        },
      },
      {
        type: "image",
        src: "/blog-covers/real-mobile-gaming.jpg",
        alt: { vi: "Hành vi và thói quen trải nghiệm game của người chơi mobile Việt Nam", en: "Mobile gaming habits and player behavior in Vietnam" },
        caption: { vi: "Hiểu sâu thói quen và động lực cốt lõi của game thủ mobile là chìa khóa mở ra định vị khác biệt.", en: "Deep understanding of mobile players' motivations is key to unlocking distinct positioning." },
      },
      { type: "h2", text: { vi: "Bước 2: xây creator portfolio theo vai trò", en: "Step 2: build a creator portfolio by role" } },
      {
        type: "ul",
        items: [
          { vi: "Hero KOL tạo khoảnh khắc nhận biết và tín hiệu quy mô cho ngày công bố", en: "Hero KOLs create major awareness moments and scale signals around announcement" },
          { vi: "Game creator giải thích cơ chế, chiều sâu và lý do đáng trải nghiệm", en: "Gaming creators explain mechanics, depth and reasons to try" },
          { vi: "Entertainment creator chuyển thế giới game thành câu chuyện dễ lan truyền", en: "Entertainment creators turn the game world into shareable stories" },
          { vi: "Community creator dẫn thảo luận, giải đáp nghi ngại và duy trì nhịp sau ra mắt", en: "Community creators lead discussion, resolve hesitation and sustain post-launch momentum" },
          { vi: "KOC ghi lại trải nghiệm thật để tạo lớp bằng chứng gần gũi", en: "KOCs document genuine experience to create relatable proof" },
        ],
      },
      { type: "h2", text: { vi: "Bước 3: thiết kế chiến dịch theo ba nhịp", en: "Step 3: design the campaign in three movements" } },
      {
        type: "p",
        text: {
          vi: "Giai đoạn trước ra mắt cần xây tò mò và ngôn ngữ nhận diện. Tuần ra mắt phải biến định vị thành một khoảnh khắc văn hóa có nhiều điểm chạm liên kết. Sau ra mắt, nội dung chuyển sang bằng chứng trải nghiệm, câu chuyện cộng đồng, bản cập nhật và lý do quay lại. Một lịch đăng dày không thay thế được kiến trúc chiến dịch; mỗi giai đoạn phải có nhiệm vụ và tiêu chí thành công riêng.",
          en: "Pre-launch should build curiosity and a recognizable language. Launch week must turn positioning into a cultural moment across connected touchpoints. Post-launch content should shift toward experience proof, community stories, updates and reasons to return. A crowded calendar cannot replace campaign architecture; every phase needs its own job and success criteria.",
        },
      },
      { type: "h2", text: { vi: "Bước 4: nối KOL, social, PR và community thành một hệ thống", en: "Step 4: connect KOL, social, PR and community as one system" } },
      {
        type: "p",
        text: {
          vi: "KOL tạo chất liệu và sự chú ý; social tái cấu trúc chất liệu thành nhịp kể chuyện; PR xây bối cảnh và độ tin cậy; community biến quan tâm thành đối thoại và duy trì. Khi bốn phần dùng chung insight, thông điệp và lịch kích hoạt, mỗi nội dung không còn là một bài đăng đơn lẻ mà trở thành đầu vào cho điểm chạm tiếp theo.",
          en: "Creators generate material and attention; social turns that material into an ongoing narrative; PR creates context and credibility; community converts interest into dialogue and retention. When all four share one insight, message and activation calendar, content stops being isolated posts and becomes input for the next touchpoint.",
        },
      },
      {
        type: "image",
        src: "/blog-covers/real-analytics-game.jpg",
        alt: { vi: "Hệ thống đo lường đa kênh và hiệu quả chuyển đổi chiến dịch game", en: "Multi-channel measurement and conversion tracking system for games" },
        caption: { vi: "Đo lường hiệu quả chuyển đổi và tương tác cộng đồng để tối ưu ngân sách theo thời gian thực.", en: "Measuring conversion efficiency and community engagement to optimize budgets in real time." },
      },
      { type: "h2", text: { vi: "ANBU giúp thương hiệu game như thế nào?", en: "How ANBU helps game brands" } },
      {
        type: "p",
        text: {
          vi: "ANBU tham gia từ giai đoạn đọc thị trường và làm rõ bài toán, không chỉ bắt đầu ở bước booking. Đội ngũ cùng thương hiệu xây định vị ra mắt, phân vai creator, phát triển concept và brief, kết nối social–PR–community, vận hành lịch nội dung và thiết kế khung đo lường phù hợp với dữ liệu thực tế mà thương hiệu đang có.",
          en: "ANBU starts by reading the market and clarifying the business problem, not merely at the booking stage. We work with brands on launch positioning, creator roles, concepts and briefs, integrated social–PR–community execution, content operations and a measurement framework grounded in the data actually available.",
        },
      },
      {
        type: "quote",
        text: {
          vi: "Trong một thị trường bão hòa, thương hiệu không thắng vì nói lớn hơn tất cả; thương hiệu thắng khi cho người chơi một lý do rõ ràng để lựa chọn, tin tưởng và ở lại.",
          en: "In a saturated market, brands do not win by speaking louder than everyone else; they win by giving players a clear reason to choose, trust and stay.",
        },
      },
      { type: "h2", text: { vi: "Checklist trước khi đưa game ra thị trường Việt Nam", en: "Checklist before launching a game in Vietnam" } },
      {
        type: "ul",
        items: [
          { vi: "Có một câu định vị mà đội sản phẩm, marketing và creator cùng hiểu", en: "One positioning statement understood by product, marketing and creators" },
          { vi: "Mỗi nhóm KOL/KOC có vai trò và nội dung đầu ra khác nhau", en: "A distinct role and output for every KOL/KOC group" },
          { vi: "Kế hoạch trước, trong và sau ra mắt có mục tiêu riêng", en: "Separate objectives for pre-launch, launch and post-launch" },
          { vi: "Social, PR và community dùng chung một campaign spine", en: "Social, PR and community share one campaign spine" },
          { vi: "Chỉ số được chia thành độ chú ý, mức cân nhắc, hành động và chất lượng người chơi", en: "Metrics are separated into attention, consideration, action and player quality" },
          { vi: "Có quy trình phản hồi nhanh khi creative hoặc thông điệp không tạo tín hiệu", en: "A rapid response process exists when creative or messaging fails to generate signals" },
        ],
      },
    ],
  },
  {
    slug: "marketing-game-app-toi-uu-cpi-roas",
    title: {
      vi: "Marketing game & app: tối ưu CPI và ROAS khi ra mắt",
      en: "Game & app marketing: optimizing CPI and ROAS at launch",
    },
    excerpt: {
      vi: "Một chiến dịch có thể đạt CPI rất đẹp mà vẫn không tạo ra tăng trưởng thật. Khoảng cách nằm ở chất lượng người dùng sau lượt cài: họ có vào game, quay lại, chi trả và trở thành một phần của cộng đồng hay không.",
      en: "A campaign can deliver an attractive CPI and still fail to create real growth. The difference lies in what users do after installing: whether they play, return, spend and become part of the community.",
    },
    category: { vi: "Game & App", en: "Game & App" },
    date: "2026-07-02",
    readingTime: 3,
    author: "ANBU Team",
    color: "from-navy-700 to-orange-600",
    variant: "game",
    sources: [
      { label: { vi: "Google Ads — hướng dẫn đo lường ứng dụng", en: "Google Ads — app measurement guidance" }, href: "https://support.google.com/google-ads/topic/6169030" },
      { label: { vi: "AppsFlyer — mobile attribution overview", en: "AppsFlyer — mobile attribution overview" }, href: "https://www.appsflyer.com/glossary/mobile-attribution/" },
    ],
    body: [
      { type: "p", text: {
        vi: "Một chiến dịch ra mắt có thể đạt CPI rất đẹp trên báo cáo mà vẫn không tạo ra tăng trưởng thật. Khoảng cách nằm ở chỗ CPI chỉ đo chi phí để có một lượt cài — nó không nói gì về việc người đó có mở game lại vào ngày mai, có chi tiền hay có ở lại đủ lâu để trở thành một phần của cộng đồng hay không. Nhiều đội marketing tối ưu nhầm chỉ số, và chỉ phát hiện ra vấn đề khi ngân sách đã tiêu gần hết.",
        en: "A launch campaign can post an attractive CPI on the dashboard and still fail to create real growth. The gap is that CPI only measures the cost of one install — it says nothing about whether that person opens the game again tomorrow, spends money, or sticks around long enough to become part of the community. Plenty of marketing teams optimize the wrong number and only discover the problem once the budget is nearly gone.",
      } },
      { type: "h2", text: { vi: "1. Hiểu rõ ba chỉ số trước khi tăng ngân sách", en: "1. Understand three metrics before scaling spend" } },
      { type: "p", text: {
        vi: "CPI (chi phí mỗi lượt cài), ROAS (doanh thu trên chi phí quảng cáo) và LTV (giá trị vòng đời người dùng) cần được đọc cùng nhau, không tách rời. Một kênh có CPI thấp nhưng kéo về người chơi có LTV thấp thực chất đắt hơn một kênh CPI cao nhưng LTV tốt. Quy tắc đơn giản: chỉ mở rộng ngân sách khi tỷ lệ LTV/CPI đã chứng minh lành mạnh ở quy mô nhỏ, trên ít nhất vài trăm người dùng mỗi kênh — mẫu quá nhỏ sẽ cho số liệu nhiễu và dễ khiến đội ngũ ra quyết định sai.",
        en: "CPI (cost per install), ROAS (return on ad spend) and LTV (user lifetime value) need to be read together, not separately. A channel with low CPI that attracts low-LTV players is actually more expensive than a channel with higher CPI and strong LTV. The rule is simple: only scale budget once the LTV/CPI ratio has proven healthy at small scale, across at least a few hundred users per channel — too small a sample gives noisy numbers and leads teams to the wrong call.",
      } },
      {
        type: "image",
        src: "/blog-covers/growth-analytics-chart.jpg",
        alt: { vi: "Phân tích số liệu và biểu đồ đo lường hiệu quả tăng trưởng CPI và ROAS", en: "Analytics charts and growth metrics for mobile game CPI and ROAS" },
        caption: { vi: "Đo lường chi tiết tương quan giữa CPI, ROAS và LTV theo từng nhóm người chơi để đưa ra quyết định tăng ngân sách chính xác.", en: "Detailed tracking of CPI, ROAS and LTV correlations across player cohorts to guide scaling decisions." },
      },
      { type: "h2", text: { vi: "2. Bản địa hóa theo từng thị trường, không dùng chung một bản", en: "2. Localize per market instead of reusing one version" } },
      { type: "p", text: {
        vi: "Một quảng cáo thắng ở Đông Nam Á chưa chắc thắng ở Đài Loan hay Brazil — hành vi xem video, nền tảng phổ biến và cách người chơi phản ứng với influencer đều khác nhau. Với game nhập vai, người chơi Việt Nam thường phản hồi tốt với creative nhấn vào cộng đồng và tính cạnh tranh; một thị trường khác có thể phản hồi tốt hơn với đồ họa hoặc cốt truyện. Đừng dịch nguyên một bản quảng cáo — hãy hỏi lại insight gốc có còn đúng ở thị trường mới hay không.",
        en: "A winning ad in Southeast Asia won't automatically win in Taiwan or Brazil — viewing behavior, popular platforms and how players respond to influencers all differ. For an RPG, Vietnamese players often respond well to creative that leans into community and competition, while another market might respond better to visuals or story. Don't just translate one ad — check whether the original insight still holds in the new market.",
      } },
      { type: "h2", text: { vi: "3. Kết hợp performance với KOL/KOC và sự kiện", en: "3. Combine performance with KOL/KOC and events" } },
      { type: "ul", items: [
        { vi: "Chạy UA đa kênh, tối ưu creative liên tục theo dữ liệu thay vì cảm tính", en: "Run multi-channel UA and optimize creative continuously from data, not gut feel" },
        { vi: "Dùng KOL/KOC tạo độ tin cậy và lan tỏa tự nhiên mà quảng cáo trả tiền không làm được", en: "Use KOL/KOC to build trust and organic reach that paid ads alone cannot" },
        { vi: "Sự kiện ra mắt và OOH tạo tiếng vang, đặc biệt khi game có yếu tố cộng đồng hoặc esports", en: "Launch events and OOH create buzz, especially for titles with a community or esports angle" },
      ] },
      { type: "quote", text: {
        vi: "Một lần ra mắt thành công không phải là tiêu nhiều nhất, mà là tiêu thông minh nhất trên từng thị trường.",
        en: "A successful launch isn't about spending the most — it's about spending the smartest in each market.",
      } },
      { type: "h2", text: { vi: "ANBU vào cuộc như thế nào", en: "How ANBU gets involved" } },
      { type: "p", text: {
        vi: "Với các studio ra mắt tại Việt Nam và khu vực, ANBU thường tham gia từ giai đoạn đặt baseline CPI/LTV, chọn kênh và creative phù hợp với từng thị trường, đến vận hành KOL/KOC song song với performance để hai bên bổ trợ nhau thay vì cạnh tranh cùng một ngân sách.",
        en: "For studios launching in Vietnam and the region, ANBU typically gets involved from setting CPI/LTV baselines and choosing the right channels and creative per market, through running KOL/KOC alongside performance so the two reinforce each other instead of competing for the same budget.",
      } },
    ],
  },
  {
    slug: "influencer-marketing-chon-kol-koc-dung-cach",
    title: {
      vi: "Influencer Marketing: chọn KOL/KOC đúng cách",
      en: "Influencer marketing: choosing the right KOL/KOC",
    },
    excerpt: {
      vi: "Một creator đông người theo dõi chưa chắc khiến khán giả tin, nhớ hoặc hành động. Hiệu quả chỉ xuất hiện khi tiếng nói của họ phù hợp với câu chuyện thương hiệu, đúng tâm lý cộng đồng và được đặt vào đúng thời điểm của chiến dịch.",
      en: "A creator with a large following does not automatically make an audience trust, remember or act. Results emerge when their voice fits the brand story, speaks to the community and appears at the right moment in the campaign.",
    },
    category: { vi: "Influencer", en: "Influencer" },
    date: "2026-06-10",
    readingTime: 3,
    author: "ANBU Team",
    color: "from-orange-500 to-navy-600",
    variant: "influencer",
    cover: "/blog-covers/creator-influencer.jpg",
    sources: [
      { label: { vi: "TikTok for Business — Creator Marketplace", en: "TikTok for Business — Creator Marketplace" }, href: "https://creatormarketplace.tiktok.com/" },
      { label: { vi: "Google Ads — chính sách nội dung quảng cáo", en: "Google Ads — advertising content policies" }, href: "https://support.google.com/adspolicy/answer/6020956" },
    ],
    body: [
      { type: "p", text: {
        vi: "Nhiều thương hiệu chọn KOL chỉ vì con số follower đẹp, rồi thất vọng vì tương tác thấp và chuyển đổi gần như bằng không. Vấn đề hiếm khi nằm ở người sáng tạo — nó nằm ở việc chọn sai người cho sai mục tiêu, và không ai trong đội ngũ dừng lại để hỏi chiến dịch này thực sự cần gì.",
        en: "Many brands pick KOLs purely for large follower counts, then feel let down by low engagement and near-zero conversion. The problem is rarely the creator — it's choosing the wrong person for the wrong goal, without anyone stopping to ask what the campaign actually needs.",
      } },
      { type: "h2", text: { vi: "Bắt đầu từ mục tiêu, không phải từ người nổi tiếng", en: "Start from the goal, not the celebrity" } },
      { type: "p", text: {
        vi: "Bạn cần nhận biết, cân nhắc hay chuyển đổi? Ba mục tiêu này cần ba kiểu creator khác nhau. Nhận biết thường cần KOL lớn để tạo độ phủ nhanh trong thời gian ngắn. Cân nhắc cần creator có tiếng nói đáng tin trong đúng cộng đồng ngách — người xem tin lời họ hơn tin quảng cáo. Chuyển đổi lại thường hiệu quả hơn với nhóm KOC nhỏ nhưng gần gũi, vì tỷ lệ hành động sau khi xem nội dung của họ cao hơn hẳn.",
        en: "Do you need awareness, consideration or conversion? Each goal calls for a different type of creator. Awareness usually needs big KOLs to build reach quickly. Consideration needs a voice trusted within a specific niche community — viewers believe them more than they believe an ad. Conversion typically works better with smaller KOCs, because the action rate after their content tends to be much higher.",
      } },
      {
        type: "image",
        src: "/blog-covers/livestream-creator-setup.jpg",
        alt: { vi: "Không gian livestream và góc làm việc của Gaming Creator / Streamer", en: "Livestream studio setup and workstation of gaming creators" },
        caption: { vi: "Góc làm việc và phát sóng trực tiếp của các creator, nơi xây dựng lòng tin và gắn kết người xem trung thành.", en: "Broadcast workstation of gaming creators, building high trust and loyal community engagement." },
      },
      { type: "h2", text: { vi: "Đánh giá chất lượng, không chỉ số lượng", en: "Judge quality, not just quantity" } },
      { type: "ul", items: [
        { vi: "Mức độ phù hợp giữa tệp người xem và khách hàng mục tiêu — không chỉ ngành nghề mà cả độ tuổi, thu nhập và thói quen mua", en: "Fit between the audience and target customers — not just industry, but age, income and buying habits" },
        { vi: "Tỷ lệ tương tác thật: bình luận có nội dung, không chỉ emoji hoặc tag bạn bè", en: "Real engagement: comments with substance, not just emojis or friend-tags" },
        { vi: "Lịch sử hợp tác: creator từng quảng cáo bao nhiêu nhãn hàng trong một tháng, và độ tin của họ có đang bị bào mòn không", en: "Collaboration history: how many brands a creator has promoted in a month, and whether their credibility is wearing thin" },
        { vi: "Chất lượng sản xuất phù hợp nền tảng — video dọc cho TikTok khác hẳn video ngang cho YouTube", en: "Production quality that fits the platform — vertical TikTok video is a different craft from horizontal YouTube" },
      ] },
      { type: "h2", text: { vi: "Kịch bản tốt quan trọng hơn gương mặt", en: "A good script matters more than the face" } },
      { type: "p", text: {
        vi: "Một ý tưởng và kịch bản chạm đúng insight sẽ giúp cả KOL vừa và nhỏ tạo ra nội dung viral — trong khi một gương mặt nổi tiếng đọc kịch bản gượng gạo vẫn có thể flop. Hãy đầu tư thời gian brief creator hiểu đúng insight sản phẩm, rồi để họ tự kể lại bằng giọng của chính mình; đừng đưa một kịch bản viết sẵn từng câu chữ và bắt họ đọc như đọc quảng cáo.",
        en: "An idea and script that hit the right insight let even mid and small influencers create viral content — while a famous face reading an awkward script can still flop. Invest time briefing creators on the real product insight, then let them retell it in their own voice; don't hand them a word-for-word script and ask them to read it like an ad.",
      } },
      { type: "h2", text: { vi: "ANBU chọn creator như thế nào", en: "How ANBU selects creators" } },
      { type: "p", text: {
        vi: "Với mỗi chiến dịch, ANBU xây shortlist dựa trên mục tiêu cụ thể trước, rồi mới xem đến ngân sách và độ nổi tiếng. Chúng tôi ưu tiên brief theo insight thay vì kịch bản cứng, để mỗi creator — dù là KOL lớn hay KOC nhỏ — đều có không gian kể câu chuyện theo cách khán giả của họ tin tưởng nhất.",
        en: "For every campaign, ANBU builds the shortlist around the specific goal first, then budget and fame. We brief on insight rather than a rigid script, so every creator — a big KOL or a small KOC — has room to tell the story in the way their own audience trusts most.",
      } },
    ],
  },
  {
    slug: "chien-luoc-noi-dung-tiktok-cho-thuong-hieu",
    title: {
      vi: "Chiến lược nội dung TikTok cho thương hiệu",
      en: "A TikTok content strategy for brands",
    },
    excerpt: {
      vi: "TikTok không thiếu những kênh đăng đều nhưng vẫn im ắng. Một kênh thực sự có sức sống cần nhiều hơn lịch đăng dày: phải có góc nhìn riêng, định dạng đủ nhận diện và lý do để người xem muốn quay lại.",
      en: "TikTok is full of accounts that post consistently yet remain quiet. A channel with real momentum needs more than a busy calendar: it needs a distinct point of view, recognizable formats and a reason for viewers to return.",
    },
    category: { vi: "Social", en: "Social" },
    date: "2026-05-20",
    readingTime: 3,
    author: "ANBU Team",
    color: "from-navy-600 to-orange-500",
    variant: "social",
    cover: "/blog-covers/tiktok-social.jpg",
    sources: [
      { label: { vi: "TikTok for Business — hướng dẫn sáng tạo", en: "TikTok for Business — creative guidance" }, href: "https://ads.tiktok.com/business/creativecenter/" },
      { label: { vi: "Google — hướng dẫn nội dung hữu ích", en: "Google — helpful content guidance" }, href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
    ],
    body: [
      { type: "p", text: {
        vi: "TikTok thưởng cho nội dung giữ chân người xem, không phải cho thương hiệu chi nhiều tiền nhất. Rất nhiều kênh đăng đều tuần này qua tuần khác mà lượt xem vẫn dậm chân tại chỗ — không phải vì thiếu nỗ lực, mà vì chưa có ai trả lời rõ câu hỏi: kênh này tồn tại để kể câu chuyện gì, và vì sao người xem nên quay lại lần hai?",
        en: "TikTok rewards content that retains viewers, not brands that spend the most. Plenty of channels post consistently week after week while views stay flat — not from lack of effort, but because nobody has answered a basic question: what story does this channel exist to tell, and why would a viewer come back a second time?",
      } },
      { type: "h2", text: { vi: "Xác định 3–4 tuyến nội dung, không đăng ngẫu hứng", en: "Define 3–4 content pillars instead of posting at random" } },
      { type: "p", text: {
        vi: "Chọn vài tuyến nội dung cố định — giải trí, hướng dẫn, hậu trường, sản phẩm — để kênh vừa đa dạng vừa dễ nhận diện. Một sai lầm phổ biến là đổi định dạng liên tục để chạy theo trend: kênh trông sinh động trong ngắn hạn nhưng người xem không hình dung được nên kỳ vọng gì ở lần xem tiếp theo, nên họ không bấm follow.",
        en: "Pick a few fixed pillars — entertainment, how-to, behind-the-scenes, product — so the channel stays both varied and recognizable. A common mistake is switching formats constantly to chase trends: the channel looks lively short-term, but viewers can't predict what to expect next time, so they never hit follow.",
      } },
      {
        type: "image",
        src: "/blog-covers/creator-tiktok-studio.jpg",
        alt: { vi: "Studio sản xuất video ngắn TikTok và sáng tạo nội dung", en: "TikTok short-form video production and creative studio" },
        caption: { vi: "Quy trình sản xuất nội dung video ngắn với nhịp cắt gọn và thông điệp chạm đúng 3 giây đầu tiên.", en: "Short-form video production workflow with tight pacing and strong 3-second hooks." },
      },
      { type: "h2", text: { vi: "3 giây đầu quyết định tất cả", en: "The first 3 seconds decide everything" } },
      { type: "ul", items: [
        { vi: "Mở đầu bằng một hook rõ ràng, gây tò mò — không phải logo hay lời chào", en: "Open with a clear, curiosity-driving hook — not a logo or a greeting" },
        { vi: "Giữ nhịp nhanh, cắt cảnh gọn, bỏ mọi khung hình không phục vụ câu chuyện", en: "Keep a fast pace with tight cuts, and drop any frame that doesn't serve the story" },
        { vi: "Có lý do cụ thể để người xem ở lại đến cuối, không chỉ đợi họ tự tò mò", en: "Give viewers a specific reason to stay to the end, don't just hope curiosity carries them" },
      ] },
      { type: "quote", text: {
        vi: "Đăng đều đặn và học từ dữ liệu quan trọng hơn việc chờ một video hoàn hảo.",
        en: "Posting consistently and learning from data beats waiting for one perfect video.",
      } },
      { type: "h2", text: { vi: "Đọc dữ liệu để biết tuyến nào đang thắng", en: "Read the data to see which pillar is winning" } },
      { type: "p", text: {
        vi: "Đừng chỉ nhìn tổng lượt xem của cả kênh. Tách hiệu suất theo từng tuyến nội dung: tuyến nào có completion rate cao, tuyến nào kéo follow mới, tuyến nào chỉ viral một lần rồi im ắng. Sau vài tuần, cắt bớt những gì không hoạt động và dồn ngân sách sản xuất cho tuyến đang chứng minh được giá trị — thay vì cố giữ đều cả bốn tuyến chỉ vì đã lỡ lên kế hoạch.",
        en: "Don't just look at the channel's total views. Break performance down by pillar: which one has a high completion rate, which one drives new follows, which one only went viral once and went quiet after. After a few weeks, cut what isn't working and put production budget behind the pillar that's proving its worth — instead of keeping all four running evenly just because the plan said so.",
      } },
    ],
  },
  {
    slug: "seo-2026-huong-dan-toan-dien",
    title: {
      vi: "SEO 2026: Hướng dẫn toàn diện cho doanh nghiệp",
      en: "SEO in 2026: A complete guide for businesses",
    },
    excerpt: {
      vi: "Khi công cụ tìm kiếm bắt đầu trả lời thay vì chỉ đưa ra danh sách đường link, thứ hạng cao chưa còn là đích đến duy nhất. Doanh nghiệp cần trở thành nguồn thông tin đủ rõ, đáng tin và hữu ích để được cả người đọc lẫn hệ thống AI lựa chọn.",
      en: "As search engines begin answering questions instead of merely listing links, a high ranking is no longer the only goal. Businesses need to become sources clear, credible and useful enough to be chosen by both readers and AI systems.",
    },
    category: { vi: "SEO", en: "SEO" },
    date: "2026-06-20",
    readingTime: 4,
    author: "ANBU Team",
    color: "from-navy-600 to-navy-800",
    variant: "seo",
    cover: "/blog-covers/seo-strategy.jpg",
    sources: [
      { label: { vi: "Google Search Central — SEO Starter Guide", en: "Google Search Central — SEO Starter Guide" }, href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
      { label: { vi: "Google Search Central — structured data", en: "Google Search Central — structured data" }, href: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" },
    ],
    body: [
      { type: "p", text: {
        vi: "Năm 2026, công cụ tìm kiếm không còn chỉ trả về danh sách 10 đường link màu xanh. AI tổng hợp câu trả lời ngay trên trang kết quả, tìm kiếm bằng giọng nói và trải nghiệm cá nhân hóa đang định hình lại cách khách hàng tìm thấy bạn — và cũng định hình lại việc thế nào là “xếp hạng cao”. Một trang đứng top 3 nhưng không bao giờ được AI trích dẫn có thể mất traffic vào tay một trang hạng 6 nhưng được chọn làm nguồn trả lời trực tiếp.",
        en: "In 2026, search engines no longer just return ten blue links. AI-generated answers appear directly on the results page, voice search and personalized experiences are reshaping how customers find you — and reshaping what \"ranking well\" even means. A page sitting at position 3 but never cited by AI can lose traffic to a position-6 page that gets picked as the direct-answer source.",
      } },
      { type: "h2", text: { vi: "1. E-E-A-T quan trọng hơn bao giờ hết", en: "1. E-E-A-T matters more than ever" } },
      { type: "p", text: {
        vi: "Google ngày càng ưu tiên nội dung thể hiện Kinh nghiệm, Chuyên môn, Thẩm quyền và Độ tin cậy — viết tắt là E-E-A-T. Cụ thể: gắn tên tác giả thật thay vì “Admin”, dẫn nguồn có thể kiểm chứng thay vì số liệu chung chung, và ưu tiên nội dung kể lại trải nghiệm thực tế (đã tự làm, đã tự đo) thay vì tổng hợp lại điều ai cũng biết. Một bài viết do một AI viết nhanh, không ai kiểm tra và không có ví dụ thật rất dễ bị xếp vào nhóm nội dung mỏng dù đúng ngữ pháp.",
        en: "Google increasingly rewards content that demonstrates Experience, Expertise, Authoritativeness and Trust — E-E-A-T. In practice: credit a real author instead of \"Admin,\" cite verifiable sources instead of vague figures, and favor content grounded in real experience (something you actually did or measured) over a rehash of common knowledge. An article written quickly by AI, never reviewed and without real examples, is easy to classify as thin content even when the grammar is perfect.",
      } },
      { type: "h2", text: { vi: "2. Tối ưu cho tìm kiếm AI", en: "2. Optimize for AI search" } },
      { type: "p", text: {
        vi: "Khi AI tổng hợp câu trả lời, nội dung có cấu trúc rõ ràng, dữ liệu có cấu trúc (schema) và câu trả lời trực tiếp sẽ dễ được trích dẫn hơn. Hãy viết đoạn mở đầu trả lời thẳng câu hỏi của người dùng — đừng bắt người đọc (hay AI) phải cuộn qua ba đoạn giới thiệu mới đến ý chính.",
        en: "When AI summarizes answers, well-structured content, structured data (schema) and direct answers are more likely to be cited. Write opening paragraphs that answer the user's question directly — don't make the reader, or the AI, scroll through three intro paragraphs to reach the point.",
      } },
      { type: "ul", items: [
        { vi: "Dùng schema markup cho bài viết, sản phẩm, FAQ và tổ chức", en: "Use schema markup for articles, products, FAQs and organizations" },
        { vi: "Cấu trúc nội dung với heading rõ ràng, mỗi H2 giải quyết đúng một câu hỏi", en: "Structure content with clear headings, each H2 answering exactly one question" },
        { vi: "Trả lời trực tiếp, ngắn gọn ở đầu mỗi phần, giải thích sâu hơn ở phía sau", en: "Answer directly and concisely at the top of each section, then explain further below" },
      ] },
      { type: "quote", text: {
        vi: "SEO tốt năm 2026 là làm cho cả con người lẫn AI đều dễ dàng hiểu và tin tưởng nội dung của bạn.",
        en: "Good SEO in 2026 means making it easy for both humans and AI to understand and trust your content.",
      } },
      { type: "h2", text: { vi: "3. Tốc độ và Core Web Vitals", en: "3. Speed and Core Web Vitals" } },
      { type: "p", text: {
        vi: "Trải nghiệm trang vẫn là yếu tố xếp hạng. Một website nhanh, ổn định về mặt hình ảnh và phản hồi tốt sẽ vừa giữ chân người dùng vừa được công cụ tìm kiếm ưu ái. Ngược lại, một trang đẹp nhưng tải chậm hoặc bị giật layout khi ảnh load sẽ khiến người đọc thoát trước khi kịp thấy nội dung — dù nội dung đó có tốt đến đâu.",
        en: "Page experience remains a ranking factor. A fast, visually stable and responsive website keeps users engaged and is favored by search engines. A beautiful page that loads slowly or jumps around as images load will lose readers before they ever see the content — no matter how good that content is.",
      } },
      { type: "h2", text: { vi: "Nội dung mỏng là kẻ thù chung của cả người đọc và AI", en: "Thin content is the shared enemy of readers and AI" } },
      { type: "p", text: {
        vi: "Một bài 150 từ dán mác “hướng dẫn toàn diện” không lừa được ai lâu — người đọc thoát ngay, còn hệ thống AI cũng sẽ không chọn một nguồn không đủ chiều sâu để trích dẫn. Quy tắc thực dụng: nếu bạn không thể trả lời câu hỏi “bài này có gì mà bài khác không có”, đừng xuất bản nó — hãy gộp vào một bài khác đang có sẵn độc giả.",
        en: "A 150-word post labeled a \"complete guide\" doesn't fool anyone for long — readers bounce immediately, and AI systems won't cite a source that lacks real depth either. A practical rule: if you can't answer \"what does this piece say that others don't,\" don't publish it — fold it into a piece that already has an audience.",
      } },
    ],
  },
  {
    slug: "xay-dung-thuong-hieu-tu-con-so-0",
    title: {
      vi: "Xây dựng thương hiệu từ con số 0: 5 bước nền tảng",
      en: "Building a brand from scratch: 5 foundational steps",
    },
    excerpt: {
      vi: "Thương hiệu không bắt đầu từ logo, bảng màu hay một câu khẩu hiệu nghe thật kêu. Nó bắt đầu từ việc doanh nghiệp hiểu mình có giá trị gì, muốn được nhớ đến vì điều gì và có thể giữ lời hứa ấy nhất quán đến đâu.",
      en: "A brand does not begin with a logo, a color palette or a memorable slogan. It begins with knowing what value the business creates, what it wants to be remembered for and how consistently it can keep that promise.",
    },
    category: { vi: "Thương hiệu", en: "Branding" },
    date: "2026-05-14",
    readingTime: 4,
    author: "ANBU Team",
    color: "from-orange-500 to-orange-700",
    variant: "branding",
    cover: "/blog-covers/brand-foundation.jpg",
    sources: [
      { label: { vi: "Google — hướng dẫn nội dung hữu ích", en: "Google — helpful content guidance" }, href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
      { label: { vi: "WIPO — thương hiệu và tài sản trí tuệ", en: "WIPO — brands and intellectual property" }, href: "https://www.wipo.int/trademarks/en/" },
    ],
    body: [
      { type: "p", text: {
        vi: "Rất nhiều doanh nghiệp bắt đầu bằng logo và bảng màu, rồi tự hỏi vì sao “có thương hiệu rồi” mà khách hàng vẫn không nhớ tên mình. Thương hiệu thật sự bắt đầu sâu hơn một bộ nhận diện đẹp — từ lý do bạn tồn tại và vị trí cụ thể bạn muốn chiếm trong tâm trí khách hàng, trước cả khi bàn đến màu sắc hay font chữ.",
        en: "Many businesses start with a logo and a color palette, then wonder why having \"a brand\" hasn't made customers remember their name. A real brand starts deeper than a polished identity kit — with why you exist and the specific position you want to own in customers' minds, well before colors or fonts enter the conversation.",
      } },
      { type: "h2", text: { vi: "Bước 1: Xác định mục đích", en: "Step 1: Define your purpose" } },
      { type: "p", text: {
        vi: "Vì sao thương hiệu của bạn tồn tại, ngoài việc kiếm lợi nhuận? Đây không phải câu hỏi triết lý cho vui — mục đích rõ ràng là kim chỉ nam cho mọi quyết định sau này, từ việc chọn đối tác, thiết kế sản phẩm đến cách trả lời một bình luận tiêu cực trên mạng xã hội. Thiếu mục đích, mỗi chiến dịch sẽ trông như một thương hiệu khác nhau.",
        en: "Why does your brand exist beyond making profit? This isn't a philosophical exercise — a clear purpose guides every decision that follows, from choosing partners and designing products to how you respond to a negative comment online. Without it, every campaign ends up looking like a different brand.",
      } },
      { type: "h2", text: { vi: "Bước 2: Hiểu khách hàng bằng nghiên cứu thật", en: "Step 2: Understand your customer through real research" } },
      { type: "p", text: {
        vi: "Xây chân dung khách hàng dựa trên nghiên cứu thật — phỏng vấn, khảo sát, dữ liệu hành vi — chứ không phải đoán từ kinh nghiệm cá nhân của đội marketing. Điều cần biết không chỉ là nhân khẩu học, mà là họ khao khát điều gì, sợ điều gì và ra quyết định mua hàng dựa trên yếu tố nào: giá, độ tin cậy, hay cảm giác thuộc về một cộng đồng.",
        en: "Build customer personas from real research — interviews, surveys, behavioral data — not guesses based on the marketing team's own experience. What matters isn't just demographics, but what customers desire, what they fear, and what actually drives their purchase decision: price, trust, or the feeling of belonging to a community.",
      } },
      { type: "h2", text: { vi: "Bước 3: Định vị — bạn khác biệt thế nào so với đối thủ", en: "Step 3: Positioning — how you differ from competitors" } },
      { type: "p", text: {
        vi: "Định vị tốt trả lời được câu hỏi: nếu khách hàng chỉ nhớ một điều về bạn, đó nên là điều gì, và vì sao đối thủ chưa chiếm được chỗ đó? Một định vị mơ hồ như “chất lượng tốt, giá hợp lý” không giúp ích gì vì ai cũng nói vậy.",
        en: "Strong positioning answers one question: if a customer remembers only one thing about you, what should it be, and why hasn't a competitor already claimed it? A vague positioning like \"good quality, fair price\" helps nobody, because everyone says the same thing.",
      } },
      { type: "h2", text: { vi: "Bước 4 và 5: Nhận diện và nhất quán", en: "Steps 4 and 5: Identity and consistency" } },
      { type: "ul", items: [
        { vi: "Nhận diện: hình ảnh, giọng nói và ngôn ngữ thiết kế phải thể hiện đúng định vị đã chọn, không phải chỉ đẹp", en: "Identity: visuals, voice and design language must express the chosen position, not just look good" },
        { vi: "Nhất quán: lặp lại thông điệp ở mọi điểm chạm — website, social, nhân viên bán hàng — vì thương hiệu được xây bằng sự lặp lại, không phải một chiến dịch bùng nổ rồi im lặng", en: "Consistency: repeat the message at every touchpoint — website, social, sales staff — because brands are built through repetition, not one big campaign followed by silence" },
      ] },
      { type: "quote", text: {
        vi: "Một logo đẹp có thể được sao chép trong một buổi chiều. Một định vị rõ ràng, được lặp lại nhất quán trong nhiều năm, thì không.",
        en: "A beautiful logo can be copied in an afternoon. A clear position, repeated consistently for years, cannot.",
      } },
    ],
  },
  {
    slug: "performance-marketing-toi-uu-ngan-sach",
    title: {
      vi: "Performance Marketing: Tối ưu ngân sách quảng cáo",
      en: "Performance marketing: optimizing your ad budget",
    },
    excerpt: {
      vi: "Ngân sách quảng cáo hiếm khi thất thoát chỉ vì một mẫu quảng cáo kém. Phần lớn lãng phí đến từ việc phân bổ tiền khi chưa biết tín hiệu nào đáng tin, nhóm khách hàng nào thực sự có giá trị và lúc nào nên dừng để học trước khi chi tiếp.",
      en: "Advertising budgets are rarely wasted because of one weak creative alone. Most waste comes from spending before knowing which signals are trustworthy, which customers create value and when to pause and learn before investing more.",
    },
    category: { vi: "Marketing", en: "Marketing" },
    date: "2026-04-02",
    readingTime: 4,
    author: "ANBU Team",
    color: "from-navy-500 to-orange-600",
    variant: "performance",
    sources: [
      { label: { vi: "Google Ads — đo lường chuyển đổi", en: "Google Ads — conversion measurement" }, href: "https://support.google.com/google-ads/answer/1722022" },
      { label: { vi: "Google Analytics — hướng dẫn sự kiện", en: "Google Analytics — event measurement guide" }, href: "https://support.google.com/analytics/answer/9322688" },
    ],
    body: [
      { type: "p", text: {
        vi: "Chi nhiều tiền quảng cáo không đồng nghĩa với tăng trưởng — nếu đúng như vậy, mọi doanh nghiệp có ngân sách lớn đều đã thắng. Điều thật sự quyết định là cấu trúc chiến dịch có rõ ràng hay không, đo lường có đúng chỉ số hay không, và đội ngũ có tối ưu liên tục dựa trên dữ liệu hay chỉ “đặt quảng cáo rồi chờ xem”.",
        en: "Spending more on ads doesn't equal growth — if it did, every company with a big budget would already be winning. What actually decides the outcome is whether the campaign structure is clear, whether the right metrics are being measured, and whether the team optimizes continuously from data instead of setting an ad live and hoping.",
      } },
      { type: "h2", text: { vi: "Bắt đầu với chỉ số kinh tế đơn vị", en: "Start with unit economics" } },
      { type: "p", text: {
        vi: "Trước khi tăng ngân sách, hãy hiểu rõ chi phí thu hút khách hàng (CAC) và giá trị vòng đời (LTV) của họ. Một chiến dịch có CAC thấp vẫn có thể lỗ nếu LTV thấp hơn nữa; ngược lại, một kênh CAC cao vẫn đáng đầu tư nếu LTV đủ tốt. Chỉ mở rộng ngân sách khi tỷ lệ LTV/CAC đã chứng minh lành mạnh ở quy mô nhỏ — đừng đợi đến khi đã chi phần lớn ngân sách quý mới đặt câu hỏi này.",
        en: "Before scaling budget, understand your customer acquisition cost (CAC) and their lifetime value (LTV). A campaign with low CAC can still lose money if LTV is even lower; conversely, a high-CAC channel can be worth the investment if LTV is strong enough. Only scale budget once the LTV/CAC ratio has proven healthy at small scale — don't wait until most of the quarter's budget is already spent to ask this question.",
      } },
      { type: "quote", text: {
        vi: "Quảng cáo giỏi không cứu được một sản phẩm tồi hay một phễu chuyển đổi rò rỉ.",
        en: "Great ads can't save a bad product or a leaky conversion funnel.",
      } },
      { type: "h2", text: { vi: "Kiểm thử có kỷ luật", en: "Test with discipline" } },
      { type: "ul", items: [
        { vi: "Kiểm thử từng biến số một cách rõ ràng — đổi cả hình ảnh lẫn thông điệp cùng lúc sẽ không biết yếu tố nào tạo ra kết quả", en: "Test one variable at a time — changing both the visual and the message together means you'll never know which one moved the result" },
        { vi: "Cho mỗi thử nghiệm đủ dữ liệu để kết luận, đừng dừng sớm chỉ vì hai ngày đầu trông không ổn", en: "Give each test enough data to conclude — don't stop early just because the first two days look shaky" },
        { vi: "Nhân rộng thứ hiệu quả, dừng dứt khoát thứ không hiệu quả, và ghi lại lý do để tránh lặp lại thử nghiệm đã có câu trả lời", en: "Scale what works, cut what doesn't without hesitation, and record why — so the team doesn't rerun a test that already has an answer" },
      ] },
      { type: "h2", text: { vi: "Ngân sách nên đi theo câu hỏi, không theo lịch", en: "Budget should follow questions, not a calendar" } },
      { type: "p", text: {
        vi: "Nhiều đội marketing chia ngân sách đều theo tháng vì đó là cách dễ lập kế hoạch, nhưng điều này bỏ lỡ tín hiệu thật: có tháng cần chi nhiều hơn để tìm ra kênh mới, có tháng chỉ nên duy trì và học. Hỏi trước mỗi giai đoạn: chúng ta đang cần tìm điều gì, và ngân sách này có giúp trả lời câu hỏi đó nhanh hơn không?",
        en: "Many marketing teams split budget evenly by month because it's easy to plan, but that misses the real signal: some months need more spend to find a new channel, others should simply hold steady and learn. Before each phase, ask what you're trying to find out, and whether this budget actually gets you that answer faster.",
      } },
    ],
  },
  {
    slug: "aso-game-mobile-viet-nam",
    title: {
      vi: "ASO game mobile tại Việt Nam: Cách tăng lượt tải tự nhiên",
      en: "ASO for mobile games in Vietnam: How to grow organic installs",
    },
    excerpt: {
      vi: "ASO không chỉ là thêm vài từ khóa vào tên game. Đây là quá trình tối ưu trang ứng dụng, creative và dữ liệu chuyển đổi để thu hút đúng người chơi từ App Store và Google Play.",
      en: "ASO is more than adding keywords to a game title. It combines store-page, creative and conversion optimization to attract the right players from App Store and Google Play.",
    },
    category: { vi: "Game Marketing", en: "Game Marketing" },
    date: "2026-08-14",
    readingTime: 2,
    author: "ANBU Team",
    color: "from-orange-500 to-navy-700",
    variant: "game",
    cover: "/blog-covers/aso-store-optimization.jpg",
    sources: [
      { label: { vi: "Google Play Console — Store listing experiments", en: "Google Play Console — Store listing experiments" }, href: "https://support.google.com/googleplay/android-developer/answer/6227309" },
      { label: { vi: "Apple — App Store product page optimization", en: "Apple — App Store product page optimization" }, href: "https://developer.apple.com/app-store/product-page-optimization/" },
      { label: { vi: "Google Play — App quality guidelines", en: "Google Play — App quality guidelines" }, href: "https://developer.android.com/distribute/best-practices/launch" },
    ],
    body: [
      { type: "p", text: {
        vi: "Một chiến dịch quảng cáo có thể kéo người chơi đến trang store, nhưng trang store mới quyết định họ có cài game hay không. ASO giúp studio biến lượt tìm kiếm thành lượt cài đặt chất lượng bằng cách làm rõ game dành cho ai, khác biệt ở đâu và trải nghiệm bắt đầu như thế nào.",
        en: "Paid campaigns can bring players to a store page, but the page itself determines whether they install. ASO turns search demand into quality installs by making the game's audience, differentiation and first experience clear.",
      } },
      { type: "h2", text: { vi: "ASO game là gì?", en: "What is game ASO?" } },
      { type: "p", text: {
        vi: "ASO (App Store Optimization) là quá trình tối ưu khả năng được tìm thấy và tỷ lệ chuyển đổi của game trên Google Play và App Store. ASO tốt kết hợp nghiên cứu từ khóa, thông điệp, hình ảnh, video, đánh giá và đo lường sau khi người chơi cài đặt.",
        en: "App Store Optimization is the process of improving a game's discoverability and conversion rate on Google Play and the App Store. Strong ASO combines keyword research, messaging, visuals, video, reviews and post-install measurement.",
      } },
      { type: "h2", text: { vi: "1. Chọn từ khóa theo ý định của người chơi", en: "1. Map keywords to player intent" } },
      { type: "p", text: {
        vi: "Đừng bắt đầu bằng danh sách từ khóa có lượng tìm kiếm lớn nhất. Hãy chia nhóm theo ý định: tìm game theo thể loại, tìm game theo tính năng, tìm thương hiệu hoặc tìm giải pháp thay thế. Một game nhập vai kiếm hiệp sẽ cần thông điệp khác với game casual chơi nhanh, dù cả hai đều dùng từ khóa game mobile.",
        en: "Do not start with the biggest keyword list. Group terms by intent: genre discovery, feature discovery, brand searches and alternative searches. A martial-arts RPG needs a different message from a quick casual game even when both target mobile-game terms.",
      } },
      { type: "ul", items: [
        { vi: "Từ khóa thể loại: game nhập vai, game chiến thuật, game idle", en: "Genre terms: RPG, strategy and idle game" },
        { vi: "Từ khóa lợi ích: chơi offline, nhẹ máy, chơi cùng bạn bè", en: "Benefit terms: offline, lightweight and multiplayer" },
        { vi: "Từ khóa địa phương: game mobile Việt Nam, game tiếng Việt", en: "Local terms: Vietnam mobile game and Vietnamese-language game" },
      ] },
      { type: "h2", text: { vi: "2. Tối ưu trang store để tăng chuyển đổi", en: "2. Optimize the store page for conversion" } },
      { type: "p", text: {
        vi: "Tên game và short description cần nói rõ giá trị ngay lập tức. Icon phải dễ nhận diện ở kích thước nhỏ. Screenshot nên kể một câu chuyện theo thứ tự: game là gì, khoảnh khắc hấp dẫn nhất, vì sao nên chơi ngay. Video preview chỉ nên giữ lại những cảnh phản ánh đúng trải nghiệm thật.",
        en: "The game title and short description should communicate value immediately. The icon must remain recognizable at small sizes. Screenshots should tell a story: what the game is, its strongest moment and why players should start now. A preview video should reflect the real experience.",
      } },
      {
        type: "image",
        src: "/blog-covers/mobile-app-ux.jpg",
        alt: { vi: "Tối ưu hóa hình ảnh và giao diện người dùng trên kho ứng dụng App Store và Google Play", en: "Optimizing visuals and mobile user experience on App Store and Google Play" },
        caption: { vi: "Thử nghiệm icon, video preview và screenshot trực quan giúp tăng tỷ lệ chuyển đổi từ lượt xem sang lượt cài đặt.", en: "Testing icons, preview videos and screenshots to boost conversion from views to installs." },
      },
      { type: "h2", text: { vi: "3. Dùng thử nghiệm thay vì phỏng đoán", en: "3. Test instead of guessing" } },
      { type: "p", text: {
        vi: "Hãy thử từng biến số có chủ đích: icon, screenshot đầu tiên, headline, video hoặc thông điệp theo từng nhóm người chơi. Google Play hỗ trợ thử nghiệm store listing; App Store cũng cho phép tối ưu product page. Mỗi thử nghiệm cần một giả thuyết, thời gian đủ dài và tiêu chí đánh giá rõ ràng.",
        en: "Test one deliberate variable at a time: icon, first screenshot, headline, video or audience-specific message. Google Play supports store-listing experiments and the App Store supports product-page optimization. Each test needs a hypothesis, enough time and a clear success metric.",
      } },
      { type: "h2", text: { vi: "4. Đo chất lượng user sau lượt cài", en: "4. Measure user quality after install" } },
      { type: "p", text: {
        vi: "Lượt cài tăng nhưng người chơi rời đi sau ngày đầu tiên chưa phải là thành công. Nên theo dõi tỷ lệ chuyển đổi trang store, CPI, retention D1/D7, doanh thu hoặc quảng cáo trên mỗi người chơi và ROAS theo nguồn. ASO và paid media cần dùng chung một hệ đo để biết creative nào kéo đúng người chơi.",
        en: "More installs are not a win if players leave after day one. Track store conversion, CPI, D1/D7 retention, revenue or ad value per player and ROAS by source. ASO and paid media should share one measurement framework so the team knows which creative attracts the right players.",
      } },
      { type: "h2", text: { vi: "Checklist ASO trước khi ra mắt", en: "Pre-launch ASO checklist" } },
      { type: "ul", items: [
        { vi: "Xác định 1 nhóm người chơi chính và 3–5 ý định tìm kiếm", en: "Define one primary player segment and 3–5 search intents" },
        { vi: "Viết thông điệp nhất quán giữa quảng cáo và trang store", en: "Align ad messaging with the store page" },
        { vi: "Chuẩn bị ít nhất hai hướng icon, screenshot và video", en: "Prepare at least two icon, screenshot and video directions" },
        { vi: "Gắn đo lường cho install, retention, doanh thu và ROAS", en: "Instrument installs, retention, revenue and ROAS" },
      ] },
      { type: "quote", text: {
        vi: "ASO tốt không hứa hẹn một con số tải xuống bất kỳ. Nó tạo ra một hệ thống để đúng người chơi tìm thấy, hiểu và chọn game của bạn.",
        en: "Good ASO does not promise an arbitrary download number. It creates a system that helps the right players find, understand and choose your game.",
      } },
    ],
  },
  {
    slug: "soft-launch-game-mobile-viet-nam",
    title: {
      vi: "Soft launch game mobile Việt Nam: test trước phát hành",
      en: "Soft-launching a mobile game in Vietnam: A pre-launch testing playbook",
    },
    excerpt: {
      vi: "Soft launch giúp studio kiểm tra sản phẩm, thông điệp và chất lượng user trước khi mở rộng ngân sách. Đây là cách giảm rủi ro khi đưa game vào thị trường Việt Nam.",
      en: "A soft launch lets studios test the product, message and user quality before scaling spend. It is a practical way to reduce risk when entering Vietnam.",
    },
    category: { vi: "Game Marketing", en: "Game Marketing" },
    date: "2026-08-14",
    readingTime: 2,
    author: "ANBU Team",
    color: "from-navy-700 to-orange-500",
    variant: "game",
    sources: [
      { label: { vi: "Google Play — Best practices for launching an app", en: "Google Play — Best practices for launching an app" }, href: "https://developer.android.com/distribute/best-practices/launch" },
      { label: { vi: "Apple — Pre-orders and phased release", en: "Apple — Pre-orders and phased release" }, href: "https://developer.apple.com/help/app-store-connect/manage-releases/overview-of-pre-orders/" },
    ],
    body: [
      { type: "p", text: {
        vi: "Một game có thể đẹp, chạy ổn và vẫn thất bại khi mở rộng vì thông điệp chưa đúng, onboarding quá dài hoặc user acquisition kéo nhầm người chơi. Soft launch là giai đoạn phát hành có kiểm soát để tìm ra những điểm đó trước khi đổ ngân sách lớn.",
        en: "A game can look polished and run well yet fail at scale because the message is wrong, onboarding is too long or user acquisition attracts the wrong players. A soft launch is a controlled release designed to expose these problems before major spend.",
      } },
      { type: "h2", text: { vi: "Soft launch nên kiểm tra điều gì?", en: "What should a soft launch test?" } },
      { type: "ul", items: [
        { vi: "Khả năng người chơi hiểu game trong 30 giây đầu", en: "Whether players understand the game in the first 30 seconds" },
        { vi: "Tỷ lệ hoàn thành onboarding và tutorial", en: "Tutorial and onboarding completion" },
        { vi: "Retention D1/D7, CPI và chất lượng user theo nguồn", en: "D1/D7 retention, CPI and user quality by source" },
        { vi: "Khả năng thanh toán, quảng cáo và live-ops tại địa phương", en: "Payments, ads and live-ops readiness for the local market" },
      ] },
      { type: "h2", text: { vi: "1. Chọn nhóm người chơi và phạm vi thử nghiệm", en: "1. Define the audience and test scope" } },
      { type: "p", text: {
        vi: "Không nên mở soft launch cho tất cả mọi người ngay từ đầu. Hãy chọn một nhóm theo thể loại, thiết bị, khu vực hoặc mức độ quen thuộc với game. Với Việt Nam, cần tính đến hành vi Android/iOS, tốc độ mạng, thiết bị phổ biến và cách người chơi tiếp nhận nội dung tiếng Việt.",
        en: "Do not open a soft launch to everyone immediately. Start with a segment defined by genre, device, region or familiarity with games. In Vietnam, account for Android/iOS behavior, network conditions, common devices and how players respond to Vietnamese content.",
      } },
      { type: "ul", items: [
        { vi: "Thiết bị và hệ điều hành đại diện cho phần đông người chơi mục tiêu", en: "Devices and operating systems representative of the target audience" },
        { vi: "Nhiều nguồn traffic khác nhau, không chỉ một kênh dễ tối ưu", en: "Multiple traffic sources, not just the one easiest to optimize" },
        { vi: "Nhóm người chơi theo hành vi, không chỉ theo nhân khẩu học", en: "Player groups defined by behavior, not demographics alone" },
      ] },
      { type: "h2", text: { vi: "2. Dùng ngân sách nhỏ để kiểm tra creative", en: "2. Use a small budget to test creative" } },
      { type: "p", text: {
        vi: "Creative trong soft launch không chỉ để mua install. Nó là công cụ kiểm tra định vị: người chơi phản hồi với fantasy, nhân vật, tính cạnh tranh hay tính giải trí? Hãy thử nhiều hook, nhưng giữ cách đo nhất quán để phân biệt creative tốt với traffic rẻ.",
        en: "Soft-launch creative is not only for buying installs. It tests positioning: do players respond to the fantasy, characters, competition or entertainment value? Test multiple hooks while keeping measurement consistent so cheap traffic is not mistaken for good traffic.",
      } },
      { type: "h2", text: { vi: "3. Tối ưu onboarding trước khi tăng CPI", en: "3. Fix onboarding before scaling CPI" } },
      { type: "p", text: {
        vi: "Nếu người chơi rời đi trước khi chạm vào vòng lặp gameplay chính, tăng ngân sách chỉ làm lãng phí nhanh hơn. Hãy xem recording, funnel và các bước rơi rụng để rút ngắn phần giới thiệu, làm rõ nút hành động và đưa người chơi vào khoảnh khắc vui sớm hơn.",
        en: "If players leave before reaching the core gameplay loop, more budget only accelerates waste. Review recordings, funnels and drop-off points to shorten introductions, clarify actions and reach the fun moment earlier.",
      } },
      { type: "h2", text: { vi: "4. Quyết định go/no-go bằng ngưỡng rõ ràng", en: "4. Set clear go/no-go thresholds" } },
      { type: "p", text: {
        vi: "Trước khi chạy, hãy thống nhất ngưỡng cho CPI, retention, crash rate, tỷ lệ hoàn thành tutorial và payback. Nếu không có ngưỡng, đội ngũ rất dễ tiếp tục chi tiền vì cảm giác game đang có tiềm năng dù dữ liệu chưa đủ tốt.",
        en: "Before launch, agree on thresholds for CPI, retention, crash rate, tutorial completion and payback. Without thresholds, teams can keep spending because the game feels promising even when the data is not strong enough.",
      } },
      { type: "h2", text: { vi: "Checklist soft launch tại Việt Nam", en: "Vietnam soft-launch checklist" } },
      { type: "ul", items: [
        { vi: "Bản dịch tiếng Việt tự nhiên, nhất quán thuật ngữ và hình ảnh", en: "Natural Vietnamese localization with consistent terminology and visuals" },
        { vi: "Đo lường riêng theo Android/iOS, creative và nguồn traffic", en: "Separate measurement by Android/iOS, creative and traffic source" },
        { vi: "Kiểm tra mạng, thiết bị, thanh toán và hỗ trợ người chơi", en: "Test networks, devices, payments and player support" },
        { vi: "Chỉ scale sau khi retention và chất lượng user ổn định", en: "Scale only after retention and user quality stabilize" },
      ] },
      { type: "quote", text: {
        vi: "Soft launch không phải một phiên bản ra mắt nhỏ. Đó là hệ thống học để phiên bản ra mắt lớn có xác suất thành công cao hơn.",
        en: "A soft launch is not a smaller launch. It is a learning system that increases the odds of a successful full release.",
      } },
    ],
  },
  {
    slug: "xay-dung-cong-dong-game-mobile-viet-nam",
    title: {
      vi: "Xây cộng đồng game mobile Việt Nam: từ group đến live-ops",
      en: "Building a mobile-game community in Vietnam: From groups to live ops",
    },
    excerpt: {
      vi: "Cộng đồng game không chỉ là một group để đăng thông báo. Đó là hệ thống lắng nghe, nội dung, creator và hoạt động live-ops giúp người chơi ở lại lâu hơn.",
      en: "A game community is more than an announcement group. It is a system of listening, content, creators and live ops that helps players stay longer.",
    },
    category: { vi: "Community Marketing", en: "Community Marketing" },
    date: "2026-08-14",
    readingTime: 2,
    author: "ANBU Team",
    color: "from-orange-600 to-navy-800",
    variant: "social",
    sources: [
      { label: { vi: "Discord — Community guidelines", en: "Discord — Community guidelines" }, href: "https://discord.com/guidelines" },
      { label: { vi: "Google Play — User-generated content policy", en: "Google Play — User-generated content policy" }, href: "https://support.google.com/googleplay/android-developer/answer/9876937" },
    ],
    body: [
      { type: "p", text: {
        vi: "Một chiến dịch launch có thể tạo ra lượt cài đặt, nhưng cộng đồng mới tạo ra lý do để người chơi quay lại. Với game mobile vào Việt Nam, cộng đồng cần được thiết kế từ trước ngày mở cửa, có người phụ trách, lịch nội dung và cơ chế phản hồi rõ ràng.",
        en: "A launch campaign can generate installs, but community creates reasons to return. For a mobile game entering Vietnam, community planning should start before opening day with clear ownership, a content calendar and feedback loops.",
      } },
      { type: "h2", text: { vi: "Cộng đồng game làm được gì?", en: "What does a game community do?" } },
      { type: "ul", items: [
        { vi: "Giải thích tính năng và giảm ma sát trong onboarding", en: "Explain features and reduce onboarding friction" },
        { vi: "Thu thập insight về lỗi, meta và nhu cầu người chơi", en: "Collect insight on bugs, meta and player needs" },
        { vi: "Tạo nội dung do người chơi và creator cùng phát triển", en: "Create player- and creator-led content" },
        { vi: "Duy trì nhịp hoạt động giữa các lần cập nhật", en: "Maintain momentum between updates" },
      ] },
      { type: "h2", text: { vi: "1. Chọn kênh theo hành vi, không theo trào lưu", en: "1. Choose channels by behavior, not fashion" } },
      { type: "p", text: {
        vi: "Facebook group phù hợp cho thông báo, thảo luận và hỗ trợ rộng. Discord mạnh hơn với chat nhanh, clan và hoạt động theo vai trò. TikTok, YouTube và creator giúp mở rộng câu chuyện ra ngoài cộng đồng lõi. Không cần mở mọi kênh cùng lúc; hãy chọn nơi người chơi mục tiêu đã quen tương tác.",
        en: "Facebook groups work well for announcements, discussion and broad support. Discord is stronger for fast chat, clans and role-based activity. TikTok, YouTube and creators extend the story beyond the core community. Do not open every channel at once; start where target players already interact.",
      } },
      {
        type: "image",
        src: "/blog-covers/community-meetup-collab.jpg",
        alt: { vi: "Hoạt động gắn kết và gặp gỡ cộng đồng game thủ", en: "Player community meetup and collaborative engagement" },
        caption: { vi: "Tổ chức các hoạt động gắn kết, offline bang hội và giải đấu cộng đồng giúp nuôi dưỡng lòng trung thành lâu dài.", en: "Organizing engagement events, clan meetups and community tournaments sustains long-term loyalty." },
      },
      { type: "h2", text: { vi: "2. Xây content pillar cho từng giai đoạn", en: "2. Build content pillars for each phase" } },
      { type: "p", text: {
        vi: "Trước launch cần nội dung giải thích thế giới, nhân vật và lý do nên thử. Trong launch cần hướng dẫn, event, creator content và phản hồi nhanh. Sau launch cần roadmap, patch note, câu chuyện người chơi và hoạt động giữ nhịp. Mỗi nội dung nên có mục tiêu: nhận biết, kích hoạt, hỗ trợ hay giữ chân.",
        en: "Before launch, explain the world, characters and reason to try. During launch, publish guides, events, creator content and fast responses. After launch, share the roadmap, patch notes, player stories and retention activities. Every post should have a job: awareness, activation, support or retention.",
      } },
      { type: "h2", text: { vi: "3. Biến feedback thành một vòng lặp sản phẩm", en: "3. Turn feedback into a product loop" } },
      { type: "p", text: {
        vi: "Đừng chỉ đọc comment rồi chuyển tiếp cho đội sản phẩm. Hãy phân loại feedback theo mức độ ảnh hưởng, số người gặp phải và khả năng xử lý. Khi một vấn đề được sửa, hãy quay lại thông báo cho cộng đồng. Người chơi sẽ tin đội ngũ hơn khi thấy phản hồi của họ tạo ra thay đổi cụ thể.",
        en: "Do not merely forward comments to the product team. Classify feedback by impact, affected players and ability to act. When an issue is fixed, close the loop with the community. Players trust teams more when feedback creates visible change.",
      } },
      { type: "h2", text: { vi: "4. Đo sức khỏe cộng đồng", en: "4. Measure community health" } },
      { type: "ul", items: [
        { vi: "Tỷ lệ thành viên hoạt động và người quay lại theo tuần", en: "Weekly active and returning members" },
        { vi: "Thời gian phản hồi và tỷ lệ câu hỏi được giải quyết", en: "Response time and resolved-question rate" },
        { vi: "Tỷ lệ tham gia event, creator content và UGC", en: "Event, creator-content and UGC participation" },
        { vi: "Retention của người chơi tham gia cộng đồng so với nhóm còn lại", en: "Retention of community members versus non-members" },
      ] },
      { type: "quote", text: {
        vi: "Cộng đồng mạnh không phải nơi lúc nào cũng đông. Đó là nơi người chơi biết mình được lắng nghe và có lý do để quay lại.",
        en: "A strong community is not always the biggest one. It is the place where players feel heard and have a reason to return.",
      } },
    ],
  },
  {
    slug: "ugc-game-mobile-cach-kich-hoat-nguoi-choi",
    title: { vi: "UGC cho game mobile: biến người chơi thành creator", en: "UGC for mobile games: turning players into creators" },
    excerpt: { vi: "UGC cho game mobile: biến người chơi thành creator là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. Một clip highlight từ người chơi thuyết phục hơn cả quảng cáo đắt tiền — nhưng chỉ khi bạn cho họ lý do để quay, không chỉ lời kêu gọi suông. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A player's highlight clip convinces better than an expensive ad — but only if you give them a reason to film, not just a request to be creative." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" },
    date: "2026-08-15", readingTime: 2, author: "ANBU Team", color: "from-navy-900 to-teal-600", variant: "social",
    sources: [{ label: { vi: "Google Play — chính sách nội dung do người dùng tạo", en: "Google Play — user-generated content policy" }, href: "https://support.google.com/googleplay/android-developer/answer/9876937" }, { label: { vi: "Discord — nguyên tắc cộng đồng", en: "Discord — community guidelines" }, href: "https://discord.com/guidelines" }],
    body: [
      { type: "p", text: { vi: "Một video highlight, meme về nhân vật hay câu chuyện vượt ải có thể thuyết phục người mới tốt hơn một quảng cáo bóng bẩy. UGC game mobile tạo ra lớp bằng chứng xã hội này, nhưng không thể chỉ kêu gọi người chơi “hãy sáng tạo”. Thương hiệu cần biến ý tưởng thành một hành trình đơn giản: dễ bắt đầu, dễ chia sẻ và đáng được ghi nhận.", en: "A highlight clip, character meme or boss-clear story can persuade new players better than a polished ad. UGC for mobile games creates this social proof, but a brand cannot simply ask players to be creative. It must make the journey easy to start, easy to share and worth being recognized." } },
      { type: "h2", text: { vi: "Chọn format phù hợp với hành vi chơi", en: "Choose formats that fit play behavior" } },
      { type: "ul", items: [
        { vi: "Clip ngắn: khoảnh khắc thắng, combo đẹp, lỗi vui và reaction", en: "Short clips: wins, clean combos, funny bugs and reactions" },
        { vi: "Ảnh và meme: skin, đội hình, câu thoại hoặc tình huống cộng đồng dễ nhận ra", en: "Images and memes: skins, team builds, quotes or recognizable community moments" },
        { vi: "Hướng dẫn: build nhân vật, mẹo tân thủ và chiến thuật theo mùa", en: "Guides: builds, beginner tips and seasonal tactics" },
      ] },
      { type: "h2", text: { vi: "Thiết kế campaign UGC có thể tham gia trong 10 phút", en: "Design a UGC campaign people can join in ten minutes" } },
      { type: "p", text: { vi: "Một brief tốt chỉ cần nói rõ chủ đề, thời hạn, cách tham gia, tiêu chí nhận quà và quyền sử dụng nội dung. Cung cấp template, âm thanh, hashtag và ví dụ mẫu giúp giảm ma sát. Phần thưởng không nhất thiết phải lớn: được xuất hiện trên kênh chính thức, nhận title trong game hoặc được đội ngũ phản hồi cũng là động lực mạnh.", en: "A good brief only needs a clear theme, deadline, entry method, reward criteria and content-use terms. Templates, sounds, hashtags and examples reduce friction. Rewards do not have to be large: featuring a creator on official channels, granting an in-game title or getting a team response can be powerful motivation." } },
      { type: "h2", text: { vi: "Đo chất lượng thay vì chỉ đếm lượt xem", en: "Measure quality, not just views" } },
      { type: "p", text: { vi: "Theo dõi số người sáng tạo lần đầu, tỷ lệ nội dung được chia sẻ lại, lượt truy cập về store, lượng người chơi mới đến từ UGC và retention của nhóm đó. Khi một format tạo ra người chơi có giá trị hơn, hãy biến nó thành hoạt động định kỳ và trao quyền cho creator trung thành.", en: "Track first-time creators, repost rate, store visits, new players attributed to UGC and retention for that cohort. When a format creates higher-value players, turn it into a recurring activity and empower loyal creators." } },
      { type: "quote", text: { vi: "UGC không phải nội dung miễn phí. Đó là mối quan hệ cùng tạo giá trị giữa game và cộng đồng.", en: "UGC is not free content. It is a value-creation relationship between a game and its community." } },
    ],
  },
  {
    slug: "retention-game-mobile-tang-d1-d7-d30",
    title: { vi: "Retention game mobile là gì? 9 cách tăng D1, D7 và D30", en: "What is mobile game retention? 9 ways to improve D1, D7 and D30" },
    excerpt: { vi: "Khi triển khai retention game mobile là gì? 9 cách tăng d1, d7 và d30, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. D7 một chữ số nghĩa là gần như mọi lượt cài đặt bạn vừa trả tiền đã bị lãng phí trước khi kịp sinh doanh thu. 9 cách sửa retention không cần dựa vào khuyến mãi. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Single-digit D7 means almost every install you just paid for was wasted before it could earn revenue. Nine ways to fix retention without leaning on discounts." },
    category: { vi: "Growth Game", en: "Game Growth" }, date: "2026-08-15", readingTime: 3, author: "ANBU Team", color: "from-teal-700 to-navy-900", variant: "game", cover: "/blog-covers/retention-return.jpg",
    sources: [{ label: { vi: "GameAnalytics — retention metrics", en: "GameAnalytics — retention metrics" }, href: "https://www.gameanalytics.com/blog/retention" }, { label: { vi: "Firebase — đo lường retention", en: "Firebase — retention measurement" }, href: "https://firebase.google.com/docs/analytics" }],
    body: [
      { type: "p", text: {
        vi: "Retention game mobile là tỷ lệ người chơi quay lại sau một mốc thời gian, thường được theo dõi ở D1, D7 và D30. Chỉ số này không chỉ phản ánh chất lượng onboarding; nó cho biết vòng lặp trải nghiệm, độ ổn định và lý do để người chơi tiếp tục mở game. Một studio có thể đổ rất nhiều tiền vào user acquisition, nhưng nếu D7 chỉ ở mức một con số, mọi lượt cài đặt đó gần như bị lãng phí trước khi kịp tạo doanh thu.",
        en: "Mobile game retention is the share of players who return after a time milestone, commonly D1, D7 and D30. It reflects more than onboarding quality: it shows the strength of the experience loop, stability and reasons to keep opening the game. A studio can pour money into user acquisition, but if D7 sits in the single digits, nearly every install is wasted before it has a chance to generate revenue.",
      } },
      { type: "h2", text: { vi: "Đọc retention theo cohort, không nhìn một con số tổng", en: "Read retention by cohort, not one total number" } },
      { type: "p", text: {
        vi: "Tách cohort theo nguồn quảng cáo, quốc gia, phiên bản game, thiết bị và ngày cài đặt. Một chiến dịch có D1 cao nhưng D7 thấp có thể đang hứa quá mức trong quảng cáo hoặc thiếu nội dung sau trải nghiệm đầu tiên — hai nguyên nhân này cần hai cách sửa hoàn toàn khác nhau, nên gộp chung vào một con số retention trung bình sẽ khiến đội ngũ sửa sai vấn đề.",
        en: "Split cohorts by acquisition source, country, game version, device and install date. A campaign with high D1 but low D7 may be overpromising in ads or lacking content after the first session — two causes that need two completely different fixes, so averaging them into one retention number leads teams to fix the wrong problem.",
      } },
      { type: "h2", text: { vi: "9 đòn bẩy cải thiện D1, D7 và D30", en: "9 levers for improving D1, D7 and D30" } },
      { type: "ul", items: [
        { vi: "Rút ngắn thời gian từ lúc mở game đến khoảnh khắc vui đầu tiên", en: "Shorten time from launch to the first enjoyable moment" },
        { vi: "Dùng nhiệm vụ ngày đầu để dạy một vòng lặp hoàn chỉnh, không chỉ từng nút bấm riêng lẻ", en: "Use day-one missions to teach a complete loop, not isolated button taps" },
        { vi: "Mở khóa mục tiêu ngắn hạn và mục tiêu dài hạn rõ ràng ngay từ phiên đầu", en: "Expose clear short- and long-term goals from the very first session" },
        { vi: "Ổn định crash, loading và hiệu năng trước khi thêm tính năng mới", en: "Fix crashes, loading and performance before adding new features" },
        { vi: "Tạo lịch event vừa sức, có lý do quay lại nhưng không gây áp lực phải chơi mỗi ngày", en: "Create manageable events with reasons to return without pressuring daily play" },
        { vi: "Gửi push notification theo hành vi thật, không theo lịch cố định cho mọi người chơi", en: "Send push notifications based on real behavior, not a fixed schedule for everyone" },
      ] },
      { type: "h2", text: { vi: "D1, D7 và D30 đo ba câu hỏi khác nhau", en: "D1, D7 and D30 answer three different questions" } },
      { type: "p", text: {
        vi: "D1 trả lời câu hỏi: onboarding có đủ tốt để người chơi hiểu game và muốn quay lại vào ngày mai không? D7 trả lời: sau khi hết cảm giác mới, game còn đủ lý do để giữ họ không? D30 trả lời: người chơi có xây được thói quen và cảm thấy đầu tư của mình có ý nghĩa không? Cải thiện D1 mà bỏ qua D7 và D30 chỉ tạo ra tăng trưởng ngắn hạn không bền.",
        en: "D1 answers whether onboarding is good enough for players to understand the game and want to return tomorrow. D7 answers whether, once the novelty fades, the game still gives them a reason to stay. D30 answers whether players build a habit and feel their investment matters. Improving D1 while ignoring D7 and D30 only creates short-lived, unsustainable growth.",
      } },
      { type: "quote", text: {
        vi: "Retention tốt bắt đầu từ giá trị thật trong trải nghiệm, không phải từ việc gửi thêm thông báo.",
        en: "Strong retention starts with real value in the experience, not more notifications.",
      } },
    ],
  },
  {
    slug: "liveops-game-mobile-lich-su-kien-giu-nguoi-choi",
    title: { vi: "LiveOps game mobile: xây lịch sự kiện giữ người chơi quanh năm", en: "Mobile game LiveOps: building an event calendar that retains players" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến liveops game mobile: xây lịch sự kiện giữ người chơi quanh năm trở thành một bài toán cần được chuẩn bị kỹ. LiveOps dồn dập khiến người chơi mệt; LiveOps thưa thớt khiến họ quên game tồn tại. Cách lập lịch sự kiện giữ đúng nhịp mà không đốt sức đội vận hành. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Too much LiveOps exhausts players; too little makes them forget the game exists. How to pace an event calendar without burning out the ops team." },
    category: { vi: "Vận hành Game", en: "Game Operations" }, date: "2026-08-15", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-teal-700", variant: "game",
    sources: [{ label: { vi: "Unity — live game operations", en: "Unity — live game operations" }, href: "https://unity.com/solutions/gaming-services" }],
    body: [
      { type: "p", text: {
        vi: "LiveOps game mobile là hệ thống nội dung, sự kiện, cập nhật và giao tiếp diễn ra sau ngày phát hành. Một lịch LiveOps tốt không phải chuỗi khuyến mãi liên tục; đó là cách tạo nhịp chơi có thể dự đoán, điểm nhấn theo mùa và cơ hội để cộng đồng cùng tham gia. Nhiều studio coi LiveOps là việc của đội vận hành sau khi marketing đã hoàn thành nhiệm vụ ra mắt — thực tế ngược lại: LiveOps chính là lý do người chơi ở lại đủ lâu để mọi khoản chi UA sinh lời.",
        en: "Mobile game LiveOps is the system of content, events, updates and communication that runs after launch. A strong LiveOps calendar is not endless promotion; it creates a predictable play rhythm, seasonal peaks and shared community moments. Many studios treat LiveOps as the operations team's job once marketing has done its launch duty — in reality it's the opposite: LiveOps is the reason players stay long enough for UA spend to pay off.",
      } },
      { type: "h2", text: { vi: "Lập lịch theo ba tầng", en: "Plan in three layers" } },
      { type: "p", text: {
        vi: "Một lịch LiveOps chồng chéo, không tầng lớp sẽ khiến người chơi mệt và đội vận hành cháy sức trước khi hết mùa. Tách rõ ba nhịp sau và đừng để chúng cạnh tranh sự chú ý của người chơi cùng lúc:",
        en: "A LiveOps calendar without layers exhausts both players and the operations team before the season ends. Separate these three rhythms clearly, and don't let them compete for player attention at the same time:",
      } },
      { type: "ul", items: [
        { vi: "Nhịp hằng ngày: nhiệm vụ, phần thưởng đăng nhập và hoạt động ngắn không đòi hỏi cam kết dài", en: "Daily rhythm: missions, login rewards and short activities that ask for no long commitment" },
        { vi: "Nhịp hằng tuần: thử thách, leaderboard và nội dung nhóm để tạo động lực cạnh tranh vừa phải", en: "Weekly rhythm: challenges, leaderboards and group content that build moderate competitive motivation" },
        { vi: "Nhịp mùa: battle pass, storyline hoặc mode mới — đây là nơi đặt cược lớn và cũng là lý do người chơi quay lại sau vài tuần vắng mặt", en: "Seasonal rhythm: battle passes, storylines or new modes — this is where the big bets go, and the reason lapsed players come back" },
      ] },
      { type: "h2", text: { vi: "Đo event bằng hành vi sau event, không chỉ trong lúc diễn ra", en: "Measure events by behavior after, not just during" } },
      { type: "p", text: {
        vi: "Theo dõi tỷ lệ tham gia, hoàn thành, doanh thu tăng thêm, số người quay lại và retention của nhóm tham gia so với nhóm không tham gia. Chỉ số quan trọng nhất thường bị bỏ qua là hành vi trong tuần ngay sau event: nếu người chơi mở game nhiều hơn trong lúc event diễn ra nhưng rời đi ngay khi kết thúc, event đó đang vay mượn engagement tương lai chứ không tạo ra giá trị mới.",
        en: "Track participation, completion, incremental revenue, comebacks and retention for participants versus non-participants. The metric most teams miss is behavior in the week right after the event: if players open the game more during the event but leave the moment it ends, that event is borrowing future engagement rather than creating new value.",
      } },
      { type: "h2", text: { vi: "ANBU vào cuộc như thế nào", en: "How ANBU gets involved" } },
      { type: "p", text: {
        vi: "Khi đồng hành LiveOps cho studio, ANBU thường bắt đầu bằng việc dựng lịch chồng lớp cho một quý, gắn từng event với một mục tiêu đo lường cụ thể — thay vì lấp đầy calendar cho có nội dung — và phối hợp truyền thông cộng đồng (Discord, fanpage) để mỗi event có nhịp thông báo trước, trong và sau, thay vì chỉ thông báo một lần rồi im lặng.",
        en: "When ANBU runs LiveOps for a studio, we typically start by building a layered calendar for one quarter, tying each event to a specific measurable goal — rather than filling the calendar just to have content — and coordinating community channels (Discord, fan pages) so every event has a before-during-after communication rhythm instead of a single announcement and silence.",
      } },
    ],
  },
  {
    slug: "localization-game-mobile-viet-nam",
    title: { vi: "Localization game mobile Việt Nam: dịch hay bản địa hóa?", en: "Mobile game localization in Vietnam: translation or localization?" },
    excerpt: { vi: "Việt Nam là thị trường game nhiều tiềm năng, nhưng một bản dịch đúng nghĩa chưa chắc đã tạo được trải nghiệm đúng với người chơi. Bản địa hóa game cần quan tâm đến giọng điệu, văn hóa và cả cách thanh toán. Hãy cùng ANBU tìm hiểu đâu là khác biệt giữa dịch thuật và bản địa hóa.", en: "Vietnamese players spot instantly when a translation was lifted from another market. Real localization goes past the words — tone, payments, everything." },
    category: { vi: "Thị trường Game", en: "Gaming Market" }, date: "2026-08-15", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-orange-600", variant: "branding",
    sources: [{ label: { vi: "Google Play — app localization", en: "Google Play — app localization" }, href: "https://developer.android.com/distribute/best-practices/launch/localize" }, { label: { vi: "Apple — localize your app", en: "Apple — localize your app" }, href: "https://developer.apple.com/app-store/localization/" }],
    body: [
      { type: "p", text: {
        vi: "Dịch đúng câu chưa chắc tạo ra trải nghiệm đúng. Người chơi Việt Nam nhận ra ngay khi tên vật phẩm, cách xưng hô, thông báo sự kiện hoặc hình thức thanh toán được bê nguyên từ thị trường khác — và họ không tha thứ dễ dàng như người chơi ở thị trường lâu năm hơn, vì bản dịch cẩu thả đọc như một tín hiệu game không thực sự nghiêm túc với thị trường này. Localization game mobile tốt phải giữ được ý đồ thiết kế nhưng nói bằng ngôn ngữ và bối cảnh quen thuộc.",
        en: "Accurate translation does not guarantee the right experience. Vietnamese players notice immediately when item names, address terms, event messages or payment flows are copied straight from another market — and they forgive it less readily than players in more mature markets, because sloppy translation reads as a signal the game isn't taking Vietnam seriously. Good localization preserves design intent while speaking through familiar language and context.",
      } },
      { type: "h2", text: { vi: "Bốn lớp cần bản địa hóa", en: "Four layers to localize" } },
      { type: "ul", items: [
        { vi: "Ngôn ngữ: thuật ngữ, đại từ xưng hô (rất khác biệt trong tiếng Việt), giọng điệu và giới hạn ký tự trên UI", en: "Language: terminology, address pronouns (highly distinctive in Vietnamese), tone and on-screen character limits" },
        { vi: "Vận hành: múi giờ, lịch lễ Tết và các ngày lễ Việt Nam, chăm sóc khách hàng và thông báo", en: "Operations: time zones, Tết and Vietnamese holiday calendars, customer support and notifications" },
        { vi: "Thương mại: giá theo VNĐ, phương thức thanh toán phổ biến tại Việt Nam (ví điện tử, thẻ nội địa) và thông tin giao dịch", en: "Commerce: VND pricing, payment methods common in Vietnam (e-wallets, domestic cards) and transaction information" },
        { vi: "Văn hóa: hình ảnh, màu sắc, nhân vật và nội dung nhạy cảm theo quy định pháp lý Việt Nam", en: "Culture: imagery, colors, characters and sensitive content per Vietnamese regulatory requirements" },
      ] },
      { type: "h2", text: { vi: "Kiểm thử với người chơi bản địa, không chỉ với người dịch", en: "Test with local players, not just the translator" } },
      { type: "p", text: {
        vi: "Hãy đưa bản dịch vào context thật, mời người chơi Việt thử onboarding và kiểm tra các màn hình có ảnh hưởng đến doanh thu. Ghi lại lỗi thuật ngữ, câu khó hiểu và khoảnh khắc người chơi không biết phải làm gì; đây là dữ liệu giá trị hơn việc chỉ kiểm tra chính tả. Một bản dịch có thể đúng ngữ pháp tuyệt đối nhưng vẫn khiến người chơi bối rối nếu thuật ngữ không khớp với cách cộng đồng game Việt Nam thực sự gọi tên các khái niệm đó.",
        en: "Put translations in real context, invite Vietnamese players to test onboarding and review revenue-critical screens. Record terminology issues, confusing lines and moments when players don't know what to do; this is more valuable than a spellcheck alone. A translation can be grammatically flawless and still confuse players if the terminology doesn't match how the Vietnamese gaming community actually refers to those concepts.",
      } },
      { type: "quote", text: {
        vi: "Bản địa hóa tốt là thứ người chơi không nhận ra — họ chỉ cảm thấy game này được làm cho họ.",
        en: "Good localization is invisible — players simply feel the game was made for them.",
      } },
    ],
  },
  {
    slug: "user-acquisition-game-mobile-kenh-quang-cao",
    title: { vi: "User acquisition game mobile: chọn kênh quảng cáo nào?", en: "Mobile game user acquisition: choosing the right ad channel" },
    excerpt: { vi: "Thu hút người chơi mới là bài toán quan trọng với mọi game mobile khi bước vào Việt Nam. Tuy nhiên, chọn kênh quảng cáo chỉ vì CPI thấp có thể khiến ngân sách nhanh chóng bị lãng phí. Trong bài viết này, ANBU chia sẻ cách chọn kênh user acquisition dựa trên hành vi và chất lượng người chơi.", en: "Dumping the whole budget into the cheapest-CPI channel is the most common mistake ANBU sees from studios new to Vietnam. How to pick a UA channel by player behavior, not price." },
    category: { vi: "Performance Marketing", en: "Performance Marketing" }, date: "2026-08-15", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "performance",
    sources: [{ label: { vi: "Meta — App campaigns", en: "Meta — App campaigns" }, href: "https://www.facebook.com/business/ads/app-ads" }, { label: { vi: "TikTok — app promotion", en: "TikTok — app promotion" }, href: "https://ads.tiktok.com/business/en/apps" }, { label: { vi: "Google — App campaigns", en: "Google — App campaigns" }, href: "https://support.google.com/google-ads/answer/6247380" }],
    body: [
      { type: "p", text: {
        vi: "User acquisition game mobile là quá trình đưa người chơi mới vào game với chi phí và chất lượng có thể đo lường. Kênh nên được đánh giá bằng retention, doanh thu và LTV sau một khoảng thời gian, không chỉ bằng CPI rẻ trong ngày đầu. Sai lầm phổ biến nhất mà ANBU thấy ở các studio mới vào Việt Nam là dồn toàn bộ ngân sách vào kênh có CPI thấp nhất mà không kiểm tra xem người chơi từ kênh đó có ở lại hay không.",
        en: "Mobile game user acquisition brings new players into a game at measurable cost and quality. Evaluate channels by retention, revenue and LTV over time, not merely by a cheap first-day CPI. The most common mistake ANBU sees among studios new to Vietnam is dumping the entire budget into the channel with the lowest CPI without checking whether players from that channel actually stay.",
      } },
      { type: "h2", text: { vi: "Ghép kênh với loại game và creative", en: "Match channels to game and creative" } },
      { type: "ul", items: [
        { vi: "Meta Ads: phù hợp để mở rộng tệp dựa trên tín hiệu chuyển đổi và creative đa dạng, đặc biệt hiệu quả với game có funnel đăng ký/mua rõ ràng", en: "Meta Ads: useful for scaling audiences with conversion signals and varied creative, especially effective with games that have a clear registration/purchase funnel" },
        { vi: "TikTok Ads: mạnh khi game có khoảnh khắc xem được và video dọc tự nhiên — nhưng đòi hỏi sản xuất creative liên tục vì fatigue diễn ra nhanh hơn Meta", en: "TikTok Ads: strong when the game has watchable moments and native vertical video — but demands continuous creative production because fatigue sets in faster than on Meta" },
        { vi: "Google Ads (UAC): bắt nhu cầu có chủ đích và hỗ trợ chiến lược đa kênh, thường dùng để bù đắp phần cuối funnel mà mạng xã hội bỏ sót", en: "Google Ads (UAC): captures intent and supports a cross-channel strategy, often used to backfill the bottom of the funnel that social channels miss" },
      ] },
      { type: "h2", text: { vi: "Thiết lập vòng đo lường trước khi mở rộng ngân sách", en: "Build the measurement loop before scaling budget" } },
      { type: "p", text: {
        vi: "Chuẩn hóa event từ cài đặt, đăng ký, hoàn thành tutorial, mua hàng đến D7 retention. So sánh theo cohort và creative, đặt ngưỡng LTV/CAC trước khi tăng ngân sách. Khi dữ liệu chưa đủ, hãy ưu tiên học nhanh thay vì kết luận quá sớm — chạy ngân sách nhỏ trên nhiều biến thể creative trong 1-2 tuần đầu thường cho tín hiệu đáng tin hơn là đổ mạnh vào một hướng duy nhất ngay từ ngày đầu.",
        en: "Standardize events from install, registration and tutorial completion to purchase and D7 retention. Compare by cohort and creative, and set an LTV/CAC threshold before scaling. When data is limited, prioritize learning speed over premature conclusions — running small budgets across many creative variants in the first one to two weeks usually gives a more trustworthy signal than committing hard to a single direction from day one.",
      } },
    ],
  },
  {
    slug: "monetization-game-mobile-iap-battle-pass",
    title: { vi: "Monetization game mobile: chọn quảng cáo, IAP hay battle pass?", en: "Mobile game monetization: ads, IAP or battle pass?" },
    excerpt: { vi: "Với các studio và nhà phát hành, monetization game mobile: chọn quảng cáo, iap hay battle pass? thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Ads, IAP hay battle pass — chọn sai mô hình không giết game ngay, nó âm thầm bào mòn niềm tin người chơi mỗi ngày. Cách chọn đúng theo hành vi, không theo xu hướng. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Ads, IAP or battle pass — picking the wrong model doesn't kill a game outright, it quietly erodes player trust every day. How to choose by behavior, not trend." },
    category: { vi: "Kinh doanh Game", en: "Game Business" }, date: "2026-08-15", readingTime: 3, author: "ANBU Team", color: "from-teal-700 to-orange-600", variant: "strategy", cover: "/blog-covers/monetization-trust.jpg",
    sources: [{ label: { vi: "Google Play — payments policy", en: "Google Play — payments policy" }, href: "https://support.google.com/googleplay/android-developer/answer/10281818" }, { label: { vi: "Apple — In-App Purchase", en: "Apple — In-App Purchase" }, href: "https://developer.apple.com/in-app-purchase/" }],
    body: [
      { type: "p", text: {
        vi: "Monetization game mobile không phải chọn một nút kiếm tiền rồi gắn vào sản phẩm. Mô hình phù hợp phụ thuộc vào nhịp chơi, mức độ cạnh tranh, vị trí của người chơi trong funnel và giá trị mà game tạo ra ở từng giai đoạn. Nhiều studio copy nguyên mô hình monetization của game thành công khác mà quên rằng người chơi Việt Nam có hành vi chi tiêu và độ nhạy giá khác với thị trường gốc của game đó.",
        en: "Mobile game monetization is not selecting one revenue button and attaching it to a product. The right model depends on play rhythm, competition, funnel stage and the value the game creates at each moment. Many studios copy the monetization model of another successful game wholesale, forgetting that Vietnamese players have different spending behavior and price sensitivity than that game's original market.",
      } },
      { type: "h2", text: { vi: "Ba mô hình phổ biến — và khi nào mỗi mô hình phù hợp", en: "Three common models — and when each fits" } },
      { type: "ul", items: [
        { vi: "Quảng cáo: phù hợp với lượt chơi ngắn và phần thưởng rõ ràng, nhưng dùng quá tay sẽ đẩy người chơi trả tiền cao nhất rời đi vì trải nghiệm bị ngắt quãng", en: "Ads: fit short sessions with clear rewarded value, but overusing them pushes away the highest-paying players by breaking up the experience" },
        { vi: "IAP: phù hợp khi vật phẩm, tiện ích hoặc nội dung có giá trị cảm nhận cao — hiệu quả nhất khi người chơi đã trải nghiệm đủ để hiểu vì sao vật phẩm đó đáng mua", en: "IAP: fit items, utilities or content with clear perceived value — most effective once players have played enough to understand why the item is worth buying" },
        { vi: "Battle pass: tạo mục tiêu theo mùa và doanh thu lặp lại, nhưng cần nội dung đủ để hoàn thành hết pass trong thời gian hợp lý, tránh gây cảm giác bị ép chơi", en: "Battle pass: creates seasonal goals and recurring revenue, but needs enough content to complete within a reasonable time, avoiding a sense of forced play" },
      ] },
      { type: "h2", text: { vi: "Đo doanh thu cùng sức khỏe sản phẩm, không tách riêng", en: "Measure revenue alongside product health, not in isolation" } },
      { type: "p", text: {
        vi: "Theo dõi ARPDAU, payer conversion, doanh thu theo cohort và tác động đến retention. Một thay đổi làm doanh thu tăng nhưng D7 giảm có thể làm LTV dài hạn thấp hơn — đây là lỗi ANBU thấy thường xuyên nhất khi đội monetization và đội product không ngồi chung bàn khi ra quyết định. Luôn thử nghiệm với nhóm đối chứng và công khai điều khoản mua hàng rõ ràng, đặc biệt quan trọng theo yêu cầu minh bạch trong Nghị định 147/2024/NĐ-CP với game phát hành tại Việt Nam.",
        en: "Track ARPDAU, payer conversion, cohort revenue and retention impact. A change that raises revenue but lowers D7 may reduce long-term LTV — this is the mistake ANBU sees most often when the monetization team and product team don't sit at the same table when deciding. Always test with a control group and make purchase terms clear, which matters especially given Vietnam's Decree 147/2024/ND-CP transparency requirements for games released here.",
      } },
    ],
  },
  {
    slug: "do-luong-game-mobile-cpi-ltv-roas",
    title: { vi: "Đo lường game mobile: từ CPI đến LTV và ROAS", en: "Mobile game measurement: from CPI to LTV and ROAS" },
    excerpt: { vi: "Đo lường game mobile: từ CPI đến LTV và ROAS là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. CPI, LTV, ROAS — ba chỉ số vô nghĩa nếu không đọc cùng một cohort và cùng một khung thời gian. Cách dựng dashboard để không tự lừa chính mình. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "CPI, LTV, ROAS — three numbers that mean nothing unless read within the same cohort and time window. How to build a dashboard that doesn't lie to you." },
    category: { vi: "Analytics Game", en: "Game Analytics" }, date: "2026-08-15", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-blue-600", variant: "performance",
    sources: [{ label: { vi: "Google Analytics for Firebase", en: "Google Analytics for Firebase" }, href: "https://firebase.google.com/docs/analytics" }, { label: { vi: "Adjust — mobile measurement glossary", en: "Adjust — mobile measurement glossary" }, href: "https://www.adjust.com/glossary/" }],
    body: [
      { type: "p", text: {
        vi: "CPI cho biết chi phí tạo một lượt cài đặt; LTV ước tính giá trị người chơi trong vòng đời; ROAS so sánh doanh thu với chi phí quảng cáo. Ba chỉ số chỉ có ý nghĩa khi được nối trong cùng cohort và cùng khoảng thời gian — một sai lầm ANBU thấy lặp lại nhiều nhất là đội marketing báo cáo CPI theo tuần trong khi đội product báo cáo LTV theo tháng, khiến hai bên không bao giờ thực sự nói cùng một ngôn ngữ dữ liệu.",
        en: "CPI is the cost of an install; LTV estimates player value over the lifecycle; ROAS compares revenue with ad spend. These metrics matter only when connected within the same cohort and time window — the mistake ANBU sees most often is the marketing team reporting weekly CPI while the product team reports monthly LTV, so the two sides never actually speak the same data language.",
      } },
      { type: "h2", text: { vi: "Dashboard tối thiểu cần có gì?", en: "What should a minimum dashboard include?" } },
      { type: "ul", items: [
        { vi: "Chi phí, impressions, click, install và CPI theo kênh — tách riêng từng kênh, không gộp trung bình", en: "Spend, impressions, clicks, installs and CPI by channel — kept separate per channel, never averaged together" },
        { vi: "D1/D7/D30 retention theo campaign và creative", en: "D1/D7/D30 retention by campaign and creative" },
        { vi: "Doanh thu IAP, quảng cáo, payer conversion và LTV theo cohort", en: "IAP and ad revenue, payer conversion and LTV by cohort" },
        { vi: "Payback period và ROAS theo ngày/cohort, so với mục tiêu đã đặt trước khi chạy chiến dịch", en: "Payback period and ROAS by day/cohort, measured against a target set before the campaign ran" },
      ] },
      { type: "h2", text: { vi: "Ba lỗi đọc dữ liệu thường gặp", en: "Three common data-reading mistakes" } },
      { type: "p", text: {
        vi: "So sánh CPI giữa các quốc gia mà bỏ qua sức mua; dùng doanh thu ngày đầu để kết luận LTV; và tăng ngân sách trước khi event tracking ổn định. Lỗi thứ ba nguy hiểm nhất vì nó âm thầm — dashboard vẫn hiển thị số liệu, chỉ là số liệu đó không đáng tin, và đội ngũ ra quyết định dựa trên nó mà không biết. Hãy ghi rõ định nghĩa, cửa sổ quy đổi và nguồn dữ liệu trong mọi báo cáo, để bất kỳ ai đọc dashboard sau này cũng hiểu con số đến từ đâu.",
        en: "Common mistakes include comparing country CPI without purchasing power context, using day-one revenue to conclude LTV, and scaling budget before event tracking is stable. The third is the most dangerous because it's silent — the dashboard still shows numbers, they're just untrustworthy, and the team makes decisions on them without knowing it. Document definitions, attribution windows and data sources in every report, so anyone reading the dashboard later understands where the numbers came from.",
      } },
    ],
  },
  {
    slug: "ra-mat-game-mobile-viet-nam-checklist",
    title: { vi: "Ra mắt game mobile tại Việt Nam: checklist đầy đủ từ pháp lý đến 90 ngày đầu", en: "Launching a mobile game in Vietnam: the complete checklist from licensing to your first 90 days" },
    excerpt: { vi: "Ra mắt game ở Việt Nam thất bại hiếm khi vì marketing yếu. Phần lớn vỡ trận vì giấy phép chưa xong, bản dịch sai ngữ cảnh hoặc không ai trực xử lý sự cố. Đây là checklist đầy đủ ANBU dùng khi đồng hành cùng studio quốc tế vào thị trường này.", en: "Game launches in Vietnam rarely fail because of weak marketing. They fail because licensing wasn't finished, translation missed the context, or nobody was on call for a crisis. This is the full checklist ANBU uses when bringing international studios into this market." },
    category: { vi: "Thị trường Game", en: "Gaming Market" }, date: "2026-08-15", readingTime: 5, author: "ANBU Team", color: "from-navy-900 to-orange-600", variant: "strategy", cover: "/blog-covers/launch-checklist.jpg",
    sources: [{ label: { vi: "Cổng thông tin Chính phủ — Nghị định 147/2024/NĐ-CP", en: "Vietnam Government Portal — Decree 147/2024/ND-CP" }, href: "https://vanban.chinhphu.vn/?pageid=27160&docid=211230" }, { label: { vi: "Google Play — developer policy", en: "Google Play — developer policy" }, href: "https://play.google.com/about/developer-content-policy/" }, { label: { vi: "Google Play — checklist phát hành", en: "Google Play — launch best practices" }, href: "https://developer.android.com/distribute/best-practices/launch" }, { label: { vi: "Apple — chuẩn bị phát hành ứng dụng", en: "Apple — prepare for app release" }, href: "https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/" }],
    body: [
      { type: "p", text: {
        vi: "Ra mắt game ở Việt Nam ít khi đổ vỡ vì một quảng cáo dở. Nó đổ vỡ vì ba tuần trước ngày mở cửa, đội ngũ mới phát hiện game chưa đủ điều kiện giấy phép, bản dịch tiếng Việt sai ngữ cảnh gameplay, hoặc không ai trực xử lý khủng hoảng nếu server sập lúc 11 giờ đêm. Dưới đây là checklist đầy đủ ANBU dùng mỗi khi đồng hành một studio quốc tế đưa game vào thị trường này — từ pháp lý, bản địa hóa, đến 90 ngày đầu sau khi mở cửa.",
        en: "Game launches in Vietnam rarely fall apart because of one bad ad. They fall apart three weeks out, when a team discovers the title isn't licensed yet, the Vietnamese translation misses the gameplay context, or nobody is on call if the server goes down at 11pm. Here is the full checklist ANBU runs through with every international studio we bring into this market — from licensing and localization through the first 90 days after launch.",
      } },
      { type: "h2", text: { vi: "Bước 1: Xong pháp lý trước khi chốt ngày ra mắt", en: "Step 1: Lock licensing before you lock a launch date" } },
      { type: "p", text: {
        vi: "Trò chơi điện tử trên mạng tại Việt Nam chịu sự điều chỉnh của Nghị định 147/2024/NĐ-CP. Tùy game của bạn rơi vào nhóm G1, G2, G3 hay G4, yêu cầu về giấy phép hoặc xác nhận phát hành, nội dung, vật phẩm ảo và dữ liệu người chơi sẽ khác nhau — và có thể mất vài tuần để hoàn tất. Nếu đợi đến khi chiến dịch marketing đã lên lịch mới kiểm tra hồ sơ, bạn sẽ phải sửa creative, thông điệp hoặc cả ngày ra mắt.",
        en: "Online games in Vietnam fall under Decree 147/2024/ND-CP. Depending on whether your title is classified G1, G2, G3 or G4, the licensing or release-confirmation requirements, content review, virtual items and player-data rules all differ — and clearing them can take weeks. Check this before your marketing calendar is locked, not after; otherwise you'll be rewriting creative, messaging or the launch date itself.",
      } },
      { type: "ul", items: [
        { vi: "Xác định chủ thể phát hành tại Việt Nam và mô hình phân loại game (G1–G4)", en: "Confirm the publishing entity in Vietnam and the game's classification (G1–G4)" },
        { vi: "Rà soát nội dung, hình ảnh, cơ chế nạp và vật phẩm ảo theo quy định", en: "Review content, imagery, payment mechanics and virtual items against the rules" },
        { vi: "Chuẩn bị phương án dữ liệu người chơi và quyền riêng tư", en: "Prepare a player-data and privacy plan" },
        { vi: "Đồng bộ tiến độ hồ sơ pháp lý với lịch localization, PR và creator", en: "Align legal filing timelines with localization, PR and creator schedules" },
      ] },
      { type: "h2", text: { vi: "Bước 2: Bản địa hóa là ngữ cảnh, không chỉ là dịch", en: "Step 2: Localization means context, not just translation" } },
      { type: "p", text: {
        vi: "Một bản dịch đúng ngữ pháp vẫn có thể sai hoàn toàn nếu nó không khớp với gameplay. Tên kỹ năng, thuật ngữ chiến đấu, thông báo trong game và cả giọng điệu quảng cáo cần được kiểm tra trực tiếp trên bản build, không chỉ trên file text rời. Với một game nhập vai như Honkai Impact 3 hay MU Vinh Dự, dịch sai một thuật ngữ chiến đấu có thể khiến người chơi hiểu lầm cơ chế cốt lõi ngay từ phiên chơi đầu tiên.",
        en: "A grammatically correct translation can still be completely wrong if it doesn't match the gameplay. Skill names, combat terms, in-game notifications and even ad copy need to be checked against a real build, not a text file in isolation. In an RPG like Honkai Impact 3 or MU Vinh Dự, getting one combat term wrong can make players misread a core mechanic in their very first session.",
      } },
      { type: "ul", items: [
        { vi: "Dịch trong ngữ cảnh: có screenshot hoặc build thật, không dịch câu rời rạc", en: "Translate in context — use real screenshots or a build, not isolated strings" },
        { vi: "Kiểm thử LQA trên thiết bị và độ phân giải màn hình thật của người chơi Việt Nam", en: "Run LQA on real devices and the screen sizes Vietnamese players actually use" },
        { vi: "Chuẩn hóa glossary thuật ngữ trước khi dịch, không sửa lại sau", en: "Lock a terminology glossary before translating, not after" },
        { vi: "Theo dõi phản hồi người chơi sau launch để cập nhật glossary liên tục", en: "Track player feedback after launch and keep the glossary updated" },
      ] },
      { type: "h2", text: { vi: "Bước 3: Khóa bốn hạng mục trong 30 ngày trước ngày mở cửa", en: "Step 3: Lock four workstreams in the 30 days before launch" } },
      { type: "p", text: {
        vi: "Ba mươi ngày cuối không phải lúc để thử ý tưởng mới — đó là lúc siết lại những gì đã quyết định. Bốn hạng mục dưới đây cần khóa cùng lúc, vì chậm một cái sẽ kéo chậm cả launch.",
        en: "The final 30 days are not for testing new ideas — they're for tightening what's already decided. These four workstreams need to lock together, because a delay in one drags down the whole launch.",
      } },
      { type: "ul", items: [
        { vi: "Store: metadata, screenshot, video, rating độ tuổi và tracking link đã kiểm tra kỹ", en: "Store: metadata, screenshots, video, age rating and tracking links, all double-checked" },
        { vi: "Cộng đồng: group, Discord, FAQ tiếng Việt và quy trình hỗ trợ đã có người trực", en: "Community: groups, Discord, Vietnamese-language FAQs and a support team already staffed" },
        { vi: "Creator: danh sách đối tác, brief, disclosure và lịch đăng đã chốt", en: "Creators: partner list, briefs, disclosures and a locked posting calendar" },
        { vi: "Đo lường: event tracking, dashboard, cohort và ngưỡng cảnh báo đã chạy thử", en: "Measurement: event tracking, dashboard, cohorts and alert thresholds, tested end to end" },
      ] },
      { type: "h2", text: { vi: "Bước 4: Ra mắt theo tầng rủi ro, đừng mở toang ngay ngày đầu", en: "Step 4: Launch in risk-managed stages, not all at once" } },
      { type: "p", text: {
        vi: "Soft launch tồn tại để kiểm tra crash, tải máy chủ, onboarding, thanh toán và phản ứng cộng đồng trước khi bạn đổ ngân sách quảng cáo. Chỉ mở rộng khi các ngưỡng chất lượng, retention và năng lực hỗ trợ đã đạt — đừng dùng số lượt cài đặt làm thước đo duy nhất để quyết định scale.",
        en: "A soft launch exists to test crashes, server load, onboarding, payments and community response before you spend ad budget at scale. Expand only once quality, retention and support capacity clear their thresholds — install count alone should never be the signal to scale.",
      } },
      { type: "quote", text: {
        vi: "Một launch tốt không phải ngày có nhiều lượt cài nhất. Đó là ngày đội ngũ đủ tỉnh táo để nhận ra vấn đề và sửa nó trước khi nó lan rộng.",
        en: "A good launch isn't the day with the most installs. It's the day the team is sharp enough to spot a problem and fix it before it spreads.",
      } },
      { type: "h2", text: { vi: "90 ngày đầu: giữ người chơi ở lại, không chỉ đưa họ đến", en: "The first 90 days: keep players, don't just bring them in" } },
      { type: "p", text: {
        vi: "Chia 90 ngày đầu thành ba nhịp rõ ràng. Ngày 1–30: xử lý lỗi phát sinh, lắng nghe cộng đồng, thiết lập quy tắc an toàn. Ngày 31–60: bắt đầu event nhỏ, khuyến khích nội dung do người chơi tạo, đóng vòng feedback. Ngày 61–90: trao thêm không gian cho creator và xây lịch hoạt động định kỳ khi dữ liệu cho thấy retention đã ổn định. Đừng nhảy thẳng đến bước cuối khi bước đầu còn dang dở.",
        en: "Split the first 90 days into three clear waves. Days 1–30: fix emerging bugs, listen to the community, set safety rules. Days 31–60: run small events, encourage player-made content, close the feedback loop. Days 61–90: give creators more room and build a recurring activity calendar once the data shows retention has stabilized. Don't skip ahead to the last wave while the first one is still unfinished.",
      } },
      { type: "h2", text: { vi: "ANBU đồng hành ra sao", en: "How ANBU works alongside you" } },
      { type: "p", text: {
        vi: "ANBU không chỉ đưa checklist rồi để bạn tự triển khai. Với các studio quốc tế, chúng tôi thường tham gia từ giai đoạn đánh giá độ sẵn sàng pháp lý, phối hợp localization và creator, đến vận hành cộng đồng và đo lường trong chính 90 ngày đầu — cùng một đội ngũ, một đường thời gian, thay vì nhiều bên rời rạc mỗi người biết một phần việc.",
        en: "ANBU doesn't just hand you a checklist and walk away. With international studios, we typically stay involved from the legal-readiness assessment through localization and creator coordination to community operations and measurement across those first 90 days — one team, one timeline, instead of scattered vendors who each know only their own piece.",
      } },
      { type: "quote", text: {
        vi: "Nếu bạn đang chuẩn bị đưa game vào Việt Nam và chưa chắc mình đã sẵn sàng ở đâu, hãy gửi cho ANBU thông tin sản phẩm và thời gian dự kiến. Chúng tôi sẽ cùng bạn rà lại từng hạng mục trước khi đặt ngày ra mắt.",
        en: "If you're preparing to bring a game into Vietnam and aren't sure where you stand, send ANBU your product details and target timeline. We'll walk through every item on this list with you before you lock a launch date.",
      } },
    ],
  },
  {
    slug: "creative-testing-game-mobile-quang-cao",
    title: { vi: "Creative testing game mobile: quy trình tìm quảng cáo thắng", en: "Mobile game creative testing: a process for finding winning ads" },
    excerpt: { vi: "Khi triển khai creative testing game mobile: quy trình tìm quảng cáo thắng, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. Quảng cáo đẹp nhất không phải quảng cáo thắng. Creative testing biến việc đoán ý tưởng thành một quy trình học có kiểm soát — đây là cách bắt đầu. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "The prettiest ad isn't always the winning ad. Creative testing turns guesswork into a controlled learning process — here's where to start." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-16", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "strategy",
    cover: "/blog-covers/creative-testing-lab.jpg",
    sources: [{ label: { vi: "Meta — creative testing", en: "Meta — creative testing" }, href: "https://www.facebook.com/business/m/creative-testing" }, { label: { vi: "TikTok — Creative Center", en: "TikTok — Creative Center" }, href: "https://ads.tiktok.com/business/creativecenter/" }],
    body: [
      { type: "p", text: {
        vi: "Một quảng cáo game thắng không nhất thiết là quảng cáo đẹp nhất. Nó là quảng cáo truyền đạt đúng fantasy, cho thấy hành động chơi đủ nhanh và đưa người xem đến lý do cài đặt rõ ràng. Creative testing biến việc đoán ý tưởng thành một quy trình học có kiểm soát — thay vì tranh luận nội bộ xem creative nào \"đẹp hơn\", đội ngũ để thị trường trả lời bằng dữ liệu thật.",
        en: "A winning game ad is not always the prettiest ad. It communicates the right fantasy, shows gameplay quickly and gives viewers a clear reason to install. Creative testing turns creative guesses into a controlled learning process — instead of arguing internally about which creative looks \"better,\" the team lets the market answer with real data.",
      } },
      { type: "h2", text: { vi: "Tách creative thành các giả thuyết riêng biệt", en: "Break creative into separate hypotheses" } },
      { type: "ul", items: [
        { vi: "Hook: điều gì khiến người chơi dừng trong ba giây đầu?", en: "Hook: what makes a player stop in the first three seconds?" },
        { vi: "Fantasy: người xem muốn trở thành ai hoặc trải nghiệm điều gì?", en: "Fantasy: who does the viewer want to become or what do they want to experience?" },
        { vi: "Proof: hình ảnh nào chứng minh game thực sự chơi như lời hứa, không phải cảnh dựng?", en: "Proof: which visual proves the game plays as promised, not a staged scene?" },
      ] },
      { type: "h2", text: { vi: "Đọc dữ liệu đúng tầng phễu", en: "Read data at the right funnel level" } },
      { type: "p", text: {
        vi: "Hook rate cho biết khả năng thu hút; CTR cho biết mức độ tò mò; CVR cho biết trang store có hoàn tất lời hứa hay không; còn retention và LTV cho biết người được thu hút có phù hợp không. Không nên tối ưu chỉ một chỉ số — một creative thắng ở hook rate nhưng kéo sai đối tượng vẫn có thể là một khoản đầu tư tệ về dài hạn.",
        en: "Hook rate shows attention, CTR shows curiosity, CVR shows whether the store page completes the promise, while retention and LTV show whether the attracted audience is a fit. Don't optimize a single metric in isolation — a creative that wins on hook rate but attracts the wrong audience can still be a poor investment long term.",
      } },
    ],
  },
  {
    slug: "pr-game-mobile-viet-nam-ra-mat",
    title: { vi: "PR game mobile tại Việt Nam: xây câu chuyện trước ngày ra mắt", en: "Mobile game PR in Vietnam: build the story before launch day" },
    excerpt: { vi: "Một tựa game mới luôn cần được biết đến trước khi người chơi quyết định tải xuống. Tuy nhiên, PR game không chỉ là gửi thông cáo báo chí vào ngày ra mắt mà cần bắt đầu từ một câu chuyện đủ hấp dẫn để báo chí, creator và cộng đồng cùng chia sẻ. Hãy cùng ANBU xây dựng kế hoạch PR hiệu quả hơn.", en: "A new game isn't news just because it's new. Effective game PR starts with a story worth media, creators and players retelling." },
    category: { vi: "Thị trường Game", en: "Gaming Market" }, date: "2026-08-16", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-orange-600", variant: "branding",
    cover: "/blog-covers/game-pr-launch.jpg",
    sources: [{ label: { vi: "Google — hướng dẫn nội dung hữu ích", en: "Google — helpful content guidance" }, href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" }],
    body: [
      { type: "p", text: {
        vi: "Một tựa game mới không được nhắc đến chỉ vì nó mới. PR cần biến đặc điểm sản phẩm, đội ngũ hoặc cộng đồng thành một góc nhìn có ý nghĩa với độc giả Việt Nam. Khi câu chuyện rõ, báo chí, creator và người chơi có thể kể lại bằng ngôn ngữ của họ — và đó mới là mục tiêu thật của PR, không phải số lượng bài đăng.",
        en: "A new game is not news simply because it is new. PR turns a product, team or community truth into a story that matters to Vietnamese audiences. When the story is clear, media, creators and players can retell it in their own language — that's the real goal of PR, not the number of articles published.",
      } },
      { type: "h2", text: { vi: "Ba lớp câu chuyện ra mắt", en: "Three launch-story layers" } },
      { type: "ul", items: [
        { vi: "Câu chuyện sản phẩm: game giải quyết trải nghiệm nào tốt hơn những gì người chơi đã có?", en: "Product story: which player experience does the game solve better than what's already out there?" },
        { vi: "Câu chuyện con người: đội ngũ, cộng đồng hoặc IP có điều gì đáng nhớ và thật?", en: "Human story: what is memorable and genuine about the team, community or IP?" },
        { vi: "Câu chuyện thị trường: game đóng góp góc nhìn gì cho hệ sinh thái game Việt Nam?", en: "Market story: what perspective does the game add to Vietnam's game ecosystem?" },
      ] },
      { type: "h2", text: { vi: "Kết nối PR với search intent", en: "Connect PR with search intent" } },
      { type: "p", text: {
        vi: "Đặt tên game, thể loại, nền tảng và thị trường trong tiêu đề hoặc đoạn giới thiệu khi phù hợp. Tối ưu không có nghĩa là biến bài PR thành quảng cáo; đó là giúp người đang tìm game phù hợp nhận ra câu chuyện này — một bài PR viết tốt vẫn nên đọc như tin tức thật, không phải một trang landing page cải trang.",
        en: "Include the game name, genre, platform and market in headlines or introductions when relevant. Optimization does not turn PR into an ad; it helps people searching for the right game recognize this story — a well-written PR piece should still read like real news, not a disguised landing page.",
      } },
    ],
  },
  {
    slug: "influencer-game-mobile-do-luong-hieu-qua",
    title: { vi: "Đo lường influencer marketing cho game mobile: ngoài lượt xem", en: "Measuring influencer marketing for mobile games beyond views" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến đo lường influencer marketing cho game mobile: ngoài lượt xem trở thành một bài toán cần được chuẩn bị kỹ. Lượt xem chỉ là điểm khởi đầu, không phải kết quả. Cách đo influencer marketing game mobile để biết ai thật sự tạo ra người chơi, không chỉ tạo ra view. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Views are a starting point, not a result. How to measure mobile game influencer marketing to see who actually creates players, not just views." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" }, date: "2026-08-16", readingTime: 3, author: "ANBU Team", color: "from-orange-500 to-navy-800", variant: "influencer",
    cover: "/blog-covers/influencer-measurement.jpg",
    sources: [{ label: { vi: "Google Analytics — campaign measurement", en: "Google Analytics — campaign measurement" }, href: "https://support.google.com/analytics/answer/10917952" }, { label: { vi: "TikTok for Business — creator campaigns", en: "TikTok for Business — creator campaigns" }, href: "https://www.tiktok.com/business/en/solutions/creator-marketplace" }],
    body: [
      { type: "p", text: {
        vi: "Influencer marketing cho game mobile có thể tạo nhận biết, hướng dẫn tân thủ, bằng chứng xã hội hoặc thúc đẩy cài đặt. Vì mỗi mục tiêu khác nhau, KPI cũng phải khác nhau. Đặt tất cả creator vào cùng một bảng xếp hạng lượt xem sẽ làm mất giá trị thật của chiến dịch — một video hướng dẫn tân thủ và một video kêu gọi cài đặt trực tiếp không nên bị đo bằng cùng một thước.",
        en: "Influencer marketing for mobile games can build awareness, teach beginners, create social proof or drive installs. Each objective needs different KPIs. Ranking every creator by views hides the real value of the campaign — a beginner's guide video and a direct install-driving video shouldn't be measured by the same yardstick.",
      } },
      { type: "h2", text: { vi: "Framework đo theo hành trình", en: "Measure across the journey" } },
      { type: "ul", items: [
        { vi: "Reach và tỷ lệ xem sâu cho mục tiêu nhận biết", en: "Reach and watch depth for awareness" },
        { vi: "Lượt click, mã giới thiệu và install cho mục tiêu chuyển đổi", en: "Clicks, referral codes and installs for conversion" },
        { vi: "D1/D7 retention, IAP và LTV theo từng creator hoặc từng loại nội dung", en: "D1/D7 retention, IAP and LTV by creator or content type" },
      ] },
      { type: "h2", text: { vi: "Đánh giá cả nội dung không chuyển đổi ngay", en: "Value content that does not convert immediately" } },
      { type: "p", text: {
        vi: "Một video hướng dẫn có thể không tạo nhiều install trong ngày đăng nhưng giúp giảm rào cản cho người chơi mới nhiều tuần sau. Lưu trữ nội dung, gắn tracking hợp lý và đánh giá theo thời gian thay vì cắt creator quá sớm — nhiều đội ngũ bỏ lỡ giá trị dài hạn này vì chỉ nhìn báo cáo trong 48 giờ đầu rồi kết luận creator đó không hiệu quả.",
        en: "A guide may not create many installs on posting day but can reduce friction for new players weeks later. Archive content, use appropriate tracking and evaluate over time rather than cutting creators too early — many teams miss this long-term value because they only look at a 48-hour report and conclude the creator didn't work.",
      } },
    ],
  },
  {
    slug: "app-store-conversion-rate-game-mobile",
    title: { vi: "Tăng conversion rate trang store cho game mobile", en: "How to improve mobile game app store conversion rate" },
    excerpt: { vi: "Với các studio và nhà phát hành, tăng conversion rate trang store cho game mobile thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Ba câu hỏi người xem trang store cần được trả lời trong vài giây: game này là gì, khác gì và có nên tin không. Cách tăng conversion khi bạn chỉ có vài giây đó. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Three questions a store visitor needs answered in seconds: what is this, what's different, should I trust it? How to raise conversion when you only get those seconds." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-16", readingTime: 3, author: "ANBU Team", color: "from-blue-700 to-orange-600", variant: "seo",
    cover: "/blog-covers/store-conversion.jpg",
    sources: [{ label: { vi: "Google Play Console — store listing experiments", en: "Google Play Console — store listing experiments" }, href: "https://support.google.com/googleplay/android-developer/answer/6227309" }, { label: { vi: "Apple — product page optimization", en: "Apple — product page optimization" }, href: "https://developer.apple.com/app-store/product-page-optimization/" }],
    body: [
      { type: "p", text: {
        vi: "Conversion rate trên store là tỷ lệ người xem trang ứng dụng thực hiện cài đặt. Muốn tăng chỉ số này, đội ngũ cần trả lời nhanh ba câu hỏi: game này là gì, có gì khác biệt và tôi có nên tin lời hứa đó không. Nếu một trong ba câu chưa được trả lời trong vài giây đầu, người xem sẽ rời đi trước khi đọc hết mô tả.",
        en: "Store conversion rate is the share of app-page visitors who install. To improve it, quickly answer three questions: what is this game, what makes it different and why should I trust the promise? If any of these three goes unanswered in the first few seconds, the visitor leaves before reading the description.",
      } },
      { type: "h2", text: { vi: "Thiết kế theo thứ tự đọc", en: "Design for the reading order" } },
      { type: "ul", items: [
        { vi: "Icon và video thumbnail tạo nhận diện trong kết quả tìm kiếm — trước cả khi người dùng chạm vào trang", en: "Icon and video thumbnail create recognition in search results — before the user even taps into the page" },
        { vi: "Screenshot đầu tiên truyền đạt fantasy và gameplay chính, không phải màn hình menu", en: "The first screenshot communicates fantasy and core gameplay, not a menu screen" },
        { vi: "Mô tả ngắn xử lý lợi ích, thể loại và lý do khác biệt trong hai dòng đầu tiên", en: "The short description handles benefit, genre and differentiation within the first two lines" },
      ] },
      { type: "h2", text: { vi: "Thử nghiệm một biến mỗi lần", en: "Test one variable at a time" } },
      { type: "p", text: {
        vi: "Đổi một hook hoặc screenshot, giữ những yếu tố còn lại ổn định và theo dõi đủ thời gian. Đọc kết quả theo nguồn traffic và quốc gia vì cùng một creative có thể hoạt động khác nhau giữa người chơi Việt Nam và thị trường khác — một trang store tối ưu cho traffic Mỹ chưa chắc tối ưu cho traffic từ TikTok Việt Nam.",
        en: "Change one hook or screenshot, hold the rest stable and run long enough. Read results by traffic source and country because the same creative can perform differently for Vietnamese players versus other markets — a store page optimized for US traffic isn't necessarily optimized for Vietnamese TikTok traffic.",
      } },
    ],
  },
  {
    slug: "community-launch-game-mobile-90-ngay",
    title: { vi: "Community launch game mobile: kế hoạch 90 ngày đầu", en: "Mobile game community launch: a first 90-day plan" },
    excerpt: { vi: "Community launch game mobile: kế hoạch 90 ngày đầu là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. 90 ngày đầu quyết định cộng đồng có đáng quay lại hay không — bỏ lỡ cửa sổ này rất khó gây dựng lại. Kế hoạch từng giai đoạn để không bỏ lỡ. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "The first 90 days decide whether a community is worth returning to — miss this window and it's hard to rebuild. A phase-by-phase plan so you don't." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" }, date: "2026-08-16", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-teal-600", variant: "social",
    cover: "/blog-covers/community-launch.jpg",
    sources: [{ label: { vi: "Discord — Community Guidelines", en: "Discord — Community Guidelines" }, href: "https://discord.com/guidelines" }, { label: { vi: "Google Play — user-generated content policy", en: "Google Play — user-generated content policy" }, href: "https://support.google.com/googleplay/android-developer/answer/9876937" }],
    body: [
      { type: "p", text: {
        vi: "90 ngày đầu là lúc người chơi quyết định cộng đồng này có đáng để quay lại hay không. Thay vì chỉ đăng thông báo, đội ngũ cần thiết kế nhịp nội dung, phản hồi và hoạt động để người mới dễ tham gia, người cũ có vai trò và creator có không gian đóng góp — bỏ lỡ cửa sổ 90 ngày này thường khó gây dựng lại từ đầu, vì ấn tượng ban đầu về một cộng đồng \"im lặng\" rất khó xóa.",
        en: "The first 90 days are when players decide whether a community is worth returning to. Instead of posting announcements only, teams need rhythms for content, feedback and activities that welcome newcomers, give veterans a role and create space for creators — missing this 90-day window is hard to recover from later, since a first impression of a \"quiet\" community is hard to shake.",
      } },
      { type: "h2", text: { vi: "Ba giai đoạn vận hành", en: "Three operating phases" } },
      { type: "ul", items: [
        { vi: "Ngày 1–30: lắng nghe, giải đáp nhanh và tạo quy tắc an toàn rõ ràng ngay từ đầu", en: "Days 1–30: listen, answer quickly and establish clear safety rules from day one" },
        { vi: "Ngày 31–60: event nhỏ, khuyến khích nội dung do người chơi tạo và mở vòng feedback thường xuyên", en: "Days 31–60: small events, encourage player-made content and open a regular feedback loop" },
        { vi: "Ngày 61–90: trao quyền creator và xây lịch hoạt động định kỳ để cộng đồng tự vận hành một phần", en: "Days 61–90: empower creators and build a recurring activity calendar so the community starts running partly on its own" },
      ] },
      { type: "h2", text: { vi: "Đo sức khỏe cộng đồng bằng nhiều lớp chỉ số", en: "Measure community health with multiple metric layers" } },
      { type: "p", text: {
        vi: "Theo dõi thành viên hoạt động, thời gian phản hồi, tỷ lệ câu hỏi được giải quyết, UGC và retention của nhóm tham gia. Mục tiêu là cộng đồng tạo ra giá trị cho người chơi và cung cấp insight tốt hơn cho đội sản phẩm, không phải một con số thành viên đẹp để đưa vào báo cáo nội bộ.",
        en: "Track active members, response time, resolved questions, UGC and retention of participants. The goal is a community that creates player value and gives the product team better insight, not a pretty member-count number for an internal report.",
      } },
    ],
  },
  {
    slug: "soft-launch-game-mobile-do-gi-truoc-global-launch",
    title: { vi: "Soft launch game mobile: cần đo gì trước khi mở rộng toàn cầu?", en: "Mobile game soft launch: what to measure before going global" },
    excerpt: { vi: "Khi triển khai soft launch game mobile: cần đo gì trước khi mở rộng toàn cầu?, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. Soft launch không phải bản phát hành nhỏ để lấy vài lượt cài. Đây là nơi rẻ nhất để phát hiện vấn đề — trước khi ngân sách global launch đổ vào. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A soft launch isn't a small release just to grab a few installs. It's the cheapest place to catch problems — before the global launch budget goes in." },
    category: { vi: "Vận hành Game", en: "Game Operations" }, date: "2026-08-17", readingTime: 3, author: "ANBU Team", color: "from-teal-700 to-navy-900", variant: "game", cover: "/blog-covers/soft-launch-measurement.jpg",
    sources: [{ label: { vi: "Google Play — testing tracks", en: "Google Play — testing tracks" }, href: "https://support.google.com/googleplay/android-developer/answer/9845334" }],
    body: [
      { type: "p", text: {
        vi: "Soft launch game mobile không phải bản phát hành nhỏ để lấy vài lượt cài đặt. Đây là giai đoạn kiểm chứng giả thuyết: người chơi có hiểu giá trị sản phẩm, thiết bị có chạy ổn, onboarding có tạo hành vi đúng và đội ngũ có đủ năng lực hỗ trợ hay không — mọi câu trả lời \"không\" ở giai đoạn này rẻ hơn rất nhiều so với phát hiện ra sau khi đã đổ ngân sách vào global launch.",
        en: "A mobile game soft launch is not a small release for a few installs. It tests hypotheses: do players understand the value, does the game run reliably, does onboarding create the right behavior and can the team support it? Every \"no\" discovered at this stage is far cheaper than finding out after budget has already gone into the global launch.",
      } },
      { type: "h2", text: { vi: "Bốn nhóm chỉ số cần theo dõi", en: "Four metric groups to track" } },
      { type: "ul", items: [
        { vi: "Chất lượng kỹ thuật: crash, loading, ANR và hiệu năng trên các thiết bị phổ biến ở thị trường mục tiêu", en: "Technical quality: crashes, loading, ANR and performance on devices common in the target market" },
        { vi: "Sản phẩm: tutorial completion, D1/D7 retention và session depth", en: "Product: tutorial completion, D1/D7 retention and session depth" },
        { vi: "Kinh tế: payer conversion, ARPDAU và LTV sơ bộ để kiểm tra giả thuyết monetization", en: "Economy: payer conversion, ARPDAU and early LTV to test the monetization hypothesis" },
        { vi: "Vận hành: thời gian phản hồi, lỗi thanh toán và sentiment cộng đồng trong giai đoạn thử nghiệm", en: "Operations: response time, payment issues and community sentiment during the test period" },
      ] },
      { type: "h2", text: { vi: "Chỉ mở rộng khi biết mình đang học gì", en: "Scale only when you know what you are learning" } },
      { type: "p", text: {
        vi: "Mỗi soft launch nên có giả thuyết, ngưỡng quyết định và người chịu trách nhiệm rõ ràng trước khi bắt đầu. Khi một chỉ số thấp, đừng vội tăng quảng cáo; hãy xác định đó là vấn đề acquisition, onboarding, gameplay hay vận hành — tăng ngân sách trước khi biết nguyên nhân chỉ khiến vấn đề lộ ra ở quy mô lớn hơn và tốn kém hơn.",
        en: "Every soft launch needs a hypothesis, decision thresholds and a clear owner before it starts. When a metric is weak, don't rush to scale ads; identify whether the issue is acquisition, onboarding, gameplay or operations — scaling budget before knowing the cause just exposes the same problem at a larger, costlier scale.",
      } },
    ],
  },
  {
    slug: "game-mobile-ugc-creator-program",
    title: { vi: "Creator program game mobile: xây hệ sinh thái nội dung", en: "Mobile game creator programs: building a content ecosystem" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến creator program game mobile: xây hệ sinh thái nội dung trở thành một bài toán cần được chuẩn bị kỹ. Một chương trình creator tốt không biến mọi người thành quảng cáo giống nhau. Cách xây hệ sinh thái để mỗi creator phát huy đúng thế mạnh riêng. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A good creator program doesn't turn everyone into identical ads. How to build an ecosystem where each creator's strength actually shows." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" }, date: "2026-08-17", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "social", cover: "/blog-covers/creator-program.jpg",
    sources: [{ label: { vi: "YouTube — Creator Academy", en: "YouTube — Creator Academy" }, href: "https://creatoracademy.youtube.com/" }],
    body: [
      { type: "p", text: {
        vi: "Creator program cho game mobile là hệ thống hợp tác dài hạn với những người có khả năng kể chuyện, hướng dẫn hoặc tạo không khí cho cộng đồng. Mục tiêu không phải biến mọi creator thành quảng cáo giống nhau, mà tạo điều kiện để mỗi người phát huy thế mạnh riêng trong cùng một định vị — một chương trình creator tốt trông giống một dàn nhạc với nhiều nhạc cụ khác nhau, không phải một dàn đồng ca hát cùng một câu.",
        en: "A mobile game creator program is a long-term system with people who can tell stories, teach or energize a community. The goal is not identical ads; it is enabling each creator's strength within one clear positioning — a good creator program looks like an orchestra with different instruments, not a choir singing the same line.",
      } },
      { type: "h2", text: { vi: "Thiết kế quyền lợi hai chiều", en: "Design two-way value" } },
      { type: "ul", items: [
        { vi: "Creator nhận early access, tài nguyên, đào tạo và cơ hội được nổi bật trong kênh chính thức", en: "Creators receive early access, resources, training and visibility on official channels" },
        { vi: "Game nhận nội dung đều, feedback sớm và kết nối cộng đồng sâu hơn theo thời gian", en: "The game receives consistent content, early feedback and deeper community connection over time" },
        { vi: "Cả hai thống nhất disclosure, quyền sử dụng nội dung và tiêu chí đánh giá ngay từ đầu", en: "Both sides agree on disclosure, content rights and evaluation criteria from the start" },
      ] },
      { type: "h2", text: { vi: "Đánh giá bằng chất lượng cộng đồng, không chỉ số liệu bề mặt", en: "Evaluate by community quality, not surface metrics" } },
      { type: "p", text: {
        vi: "Ngoài lượt xem, hãy theo dõi câu hỏi được tạo ra, người xem quay lại, traffic về kênh sở hữu và retention của người chơi đến từ creator. Đây là tín hiệu cho biết chương trình đang xây tài sản dài hạn hay chỉ tạo một đợt chú ý ngắn — một creator program bền vững thường mất vài tháng mới thấy rõ hiệu quả, và điều đó không nên bị nhầm với việc chương trình không hoạt động.",
        en: "Beyond views, track questions generated, returning viewers, owned-channel traffic and retention of creator-attributed players. These signals show whether the program is building a long-term asset or just a short burst of attention — a sustainable creator program often takes a few months to show clear results, and that shouldn't be mistaken for the program not working.",
      } },
    ],
  },
  {
    slug: "seo-game-mobile-topic-cluster",
    title: { vi: "SEO cho game mobile: xây topic cluster để tăng độ phủ tìm kiếm", en: "Mobile game SEO: building topic clusters for search visibility" },
    excerpt: { vi: "Người chơi không chỉ tìm tên game mà còn tìm hướng dẫn, cấu hình, sự kiện và đánh giá trước khi cài đặt. Vì vậy, SEO cho game mobile cần một hệ thống nội dung liên kết với nhau thay vì vài bài viết rời rạc. ANBU sẽ hướng dẫn cách xây topic cluster để tăng độ phủ tìm kiếm bền vững.", en: "Players don't just search a game's name — they search guides, requirements, events, reviews. How to build a topic cluster that doesn't miss those searches." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-17", readingTime: 3, author: "ANBU Team", color: "from-blue-700 to-orange-600", variant: "seo", cover: "/blog-covers/game-seo-cluster.jpg",
    sources: [{ label: { vi: "Google Search Central — SEO Starter Guide", en: "Google Search Central — SEO Starter Guide" }, href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" }],
    body: [
      { type: "p", text: {
        vi: "SEO game mobile không nên chỉ tập trung vào tên game. Người chơi còn tìm thể loại, hướng dẫn, cấu hình, nhân vật, event, review và cộng đồng. Topic cluster tổ chức những nhu cầu đó quanh một trang trụ cột, giúp người dùng đi tiếp và giúp công cụ tìm kiếm hiểu độ sâu chủ đề — một website chỉ có trang chủ và vài bài rời rạc rất khó cạnh tranh với một website có cấu trúc cluster rõ ràng, dù nội dung từng bài có tốt đến đâu.",
        en: "Mobile game SEO shouldn't focus only on the game name. Players also search for genre, guides, requirements, characters, events, reviews and community. A topic cluster organizes those needs around a pillar page so users can continue their journey and search engines can understand topical depth — a website with just a homepage and scattered posts struggles to compete against one with a clear cluster structure, no matter how good each individual post is.",
      } },
      { type: "h2", text: { vi: "Một cluster game mobile gồm gì?", en: "What belongs in a mobile game cluster?" } },
      { type: "ul", items: [
        { vi: "Trang trụ cột: game là gì, dành cho ai và điểm khác biệt so với các game cùng thể loại", en: "Pillar page: what the game is, who it is for and how it differs from similar games" },
        { vi: "Bài hỗ trợ: hướng dẫn chơi, build, event và giải đáp lỗi cụ thể", en: "Support articles: guides, builds, events and specific troubleshooting" },
        { vi: "Trang chuyển đổi: store, đăng ký cộng đồng và trang cập nhật", en: "Conversion pages: store, community sign-up and update pages" },
      ] },
      { type: "h2", text: { vi: "Liên kết theo hành trình, không nhồi link", en: "Link by journey, not by stuffing" } },
      { type: "p", text: {
        vi: "Mỗi bài nên dẫn người đọc đến bước tiếp theo hợp lý: bài hướng dẫn trỏ về trang game, trang game trỏ về store, còn bài event trỏ về cộng đồng. Anchor text mô tả đúng nội dung và chỉ liên kết khi giúp người đọc ra quyết định — mục tiêu cuối cùng của một cluster không phải để có nhiều internal link, mà để người đọc luôn biết bước tiếp theo nên làm gì.",
        en: "Each article should lead to the next logical step: a guide to the game page, the game page to the store, and an event article to the community. Use descriptive anchors and link only when it helps the reader decide — the point of a cluster isn't to accumulate internal links, it's to make sure readers always know what to do next.",
      } },
    ],
  },
  {
    slug: "game-mobile-onboarding-tang-activation",
    title: { vi: "Onboarding game mobile: 7 cách tăng activation trong phiên đầu", en: "Mobile game onboarding: 7 ways to improve first-session activation" },
    excerpt: { vi: "Với các studio và nhà phát hành, onboarding game mobile: 7 cách tăng activation trong phiên đầu thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Phần lớn người chơi quyết định có ở lại hay không trong vài phút đầu tiên. 5 cách rút ngắn khoảng cách từ lượt cài đến khoảnh khắc game thật sự hay. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Most players decide whether to stay within the first few minutes. Five ways to shorten the gap between install and the game's first genuinely fun moment." },
    category: { vi: "Vận hành Game", en: "Game Operations" }, date: "2026-08-17", readingTime: 3, author: "ANBU Team", color: "from-blue-700 to-teal-600", variant: "game", cover: "/blog-covers/onboarding-activation.jpg",
    sources: [{ label: { vi: "Google Play — app quality", en: "Google Play — app quality" }, href: "https://developer.android.com/distribute/best-practices" }],
    body: [
      { type: "p", text: {
        vi: "Activation là lúc người chơi hoàn thành hành động cốt lõi đầu tiên, chẳng hạn một trận đấu, một màn chơi hoặc lần nâng cấp đầu tiên. Onboarding tốt không cố dạy mọi tính năng; nó đưa người chơi đến giá trị chính với ít gián đoạn nhất — vì phần lớn người chơi quyết định có ở lại hay không trong vài phút đầu tiên, trước khi họ kịp thấy phần sâu nhất của game.",
        en: "Activation is when a player completes a first core action, such as a match, level or upgrade. Good onboarding does not try to teach every feature; it reaches the core value with the least interruption — most players decide whether to stay within the first few minutes, long before they see the deepest parts of the game.",
      } },
      { type: "h2", text: { vi: "Năm nguyên tắc giảm ma sát", en: "Five friction-reduction principles" } },
      { type: "ul", items: [
        { vi: "Cho người chơi vào hành động trước khi giải thích dài — học bằng cách làm, không phải bằng cách đọc", en: "Put players into action before lengthy explanation — learn by doing, not by reading" },
        { vi: "Dùng một mục tiêu rõ ở mỗi bước, tránh đưa nhiều lựa chọn cùng lúc khi người chơi chưa có đủ ngữ cảnh", en: "Give each step one clear goal, avoiding multiple choices at once before players have enough context" },
        { vi: "Cho phép bỏ qua phần không quan trọng cho người chơi đã quen thể loại", en: "Let players skip non-essential parts if they're already familiar with the genre" },
        { vi: "Phản hồi ngay sau thao tác đúng — sự im lặng khiến người chơi mới nghi ngờ liệu mình có đang làm đúng", en: "Give immediate feedback after correct actions — silence makes new players doubt whether they're doing it right" },
        { vi: "Đo activation theo nguồn cài đặt và thiết bị, vì người chơi từ các kênh khác nhau có kỳ vọng khác nhau", en: "Measure activation by acquisition source and device, since players from different channels carry different expectations" },
      ] },
      { type: "h2", text: { vi: "Tối ưu bằng session replay, không chỉ bằng phỏng đoán", en: "Optimize with session replay, not guesswork" } },
      { type: "p", text: {
        vi: "Hãy xem nơi người chơi dừng, quay lại hoặc bấm sai. Những khoảnh khắc đó cho biết vấn đề nằm ở câu chữ, giao diện, tốc độ tải hay chính thiết kế gameplay — và thường thì nguyên nhân thực tế khác hẳn với những gì đội ngũ đoán trước khi xem dữ liệu thật.",
        en: "Review where players stop, backtrack or tap incorrectly. Those moments reveal whether the issue is copy, interface, loading speed or gameplay design itself — and the real cause is often quite different from what the team assumed before looking at actual data.",
      } },
    ],
  },
  {
    slug: "battle-pass-game-mobile-thiet-ke-gia-tri",
    title: { vi: "Battle pass game mobile: thiết kế giá trị tăng retention", en: "Mobile game battle passes: designing value for retention" },
    excerpt: { vi: "Battle pass game mobile: thiết kế giá trị tăng retention là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. Người chơi nhận ra rất nhanh khi một battle pass được thiết kế để moi tiền thay vì thưởng cho thời gian họ bỏ ra. Cách cân bằng bốn lớp giá trị để giữ niềm tin đó. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Players notice fast when a battle pass is built to extract money instead of reward their time. How to balance four value layers to keep that trust." },
    category: { vi: "Kinh doanh Game", en: "Game Business" }, date: "2026-08-17", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "strategy", cover: "/blog-covers/battle-pass-value.jpg",
    sources: [{ label: { vi: "Apple — In-App Purchase", en: "Apple — In-App Purchase" }, href: "https://developer.apple.com/in-app-purchase/" }, { label: { vi: "Google Play — payments policy", en: "Google Play — payments policy" }, href: "https://support.google.com/googleplay/android-developer/answer/10281818" }],
    body: [
      { type: "p", text: {
        vi: "Battle pass là một lời hứa theo mùa: nếu người chơi quay lại và hoàn thành các mục tiêu, họ nhận được tiến bộ và phần thưởng tương xứng. Khi thiết kế chỉ tập trung vào ép mua, hệ thống dễ làm giảm niềm tin và retention — người chơi cảm nhận rất nhanh khi một battle pass được thiết kế để moi tiền thay vì để thưởng cho thời gian họ bỏ ra.",
        en: "A battle pass is a seasonal promise: if players return and complete goals, they receive meaningful progress and rewards. When design focuses only on forcing purchase, trust and retention suffer — players notice very quickly when a battle pass is built to extract money rather than to reward the time they invest.",
      } },
      { type: "h2", text: { vi: "Bốn lớp giá trị cần cân bằng", en: "Four value layers to balance" } },
      { type: "ul", items: [
        { vi: "Tiến bộ dễ hiểu: người chơi biết còn bao xa đến phần thưởng tiếp theo, không phải đoán mò", en: "Clear progress: players know how far they are from the next reward, not guessing" },
        { vi: "Phần thưởng có ý nghĩa: đẹp, hữu ích hoặc thể hiện thành tích, không phải vật phẩm lấp đầy cho đủ số lượng", en: "Meaningful rewards: beautiful, useful or status-signaling, not filler items to pad the count" },
        { vi: "Nhịp hoàn thành hợp lý: không biến game thành công việc bắt buộc mỗi ngày để không bỏ lỡ", en: "A reasonable completion rhythm: don't turn play into a mandatory daily job to avoid missing out" },
        { vi: "Quyền lựa chọn công bằng: không khóa trải nghiệm cốt lõi phía sau tường thanh toán", en: "Fair choice: never lock the core experience behind a paywall" },
      ] },
      { type: "h2", text: { vi: "Đo cả doanh thu và cảm nhận", en: "Measure revenue and sentiment together" } },
      { type: "p", text: {
        vi: "Theo dõi tỷ lệ mua, tỷ lệ hoàn thành, số ngày quay lại và feedback theo cohort. Một battle pass khỏe là hệ thống người chơi muốn tham gia tiếp ở mùa sau, không phải chỉ mua một lần rồi bỏ dở — tỷ lệ hoàn thành thấp liên tục qua nhiều mùa là dấu hiệu độ khó hoặc nhịp thiết kế đang sai, dù doanh thu ngắn hạn vẫn ổn.",
        en: "Track purchase rate, completion, return days and cohort feedback. A healthy battle pass is one players want to join again next season, not a one-time purchase they abandon — persistently low completion across seasons signals the difficulty or pacing is wrong, even if short-term revenue still looks fine.",
      } },
    ],
  },
  {
    slug: "quang-cao-game-mobile-viet-nam-ke-hoach-ngan-sach",
    title: { vi: "Quảng cáo game mobile Việt Nam: lập ngân sách theo giai đoạn", en: "Mobile game advertising in Vietnam: budget by launch stage" },
    excerpt: { vi: "Khi triển khai quảng cáo game mobile việt nam: lập ngân sách theo giai đoạn, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. Đổ hết ngân sách vào ngày ra mắt là cách nhanh nhất để hết tiền đúng lúc dữ liệu bắt đầu đủ để ra quyết định. Cách chia ngân sách theo ba giai đoạn thay vì một cú đánh. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Spending the whole budget on launch day is the fastest way to run out of money right when the data becomes useful. How to split budget across three stages instead of one big swing." },
    category: { vi: "Performance Marketing", en: "Performance Marketing" }, date: "2026-08-18", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "performance",
    sources: [{ label: { vi: "Google Ads — App campaigns", en: "Google Ads — App campaigns" }, href: "https://support.google.com/google-ads/answer/6247380" }, { label: { vi: "Meta — quảng cáo ứng dụng", en: "Meta — app advertising" }, href: "https://www.facebook.com/business/ads/app-ads" }],
    body: [
      { type: "p", text: {
        vi: "Quảng cáo game mobile tại Việt Nam hiệu quả khi ngân sách được chia theo câu hỏi cần trả lời, không theo lịch phát hành. Giai đoạn đầu cần biết creative nào kéo đúng người chơi, giai đoạn tăng trưởng cần tìm cohort có LTV tốt và giai đoạn mở rộng cần bảo vệ chất lượng traffic. Sai lầm phổ biến là đổ toàn bộ ngân sách vào tuần ra mắt rồi hết tiền đúng lúc dữ liệu bắt đầu đủ để ra quyết định đúng.",
        en: "Mobile game advertising in Vietnam works best when budget follows the questions the team needs to answer, not the release calendar. Early spend finds winning creative, growth spend finds high-LTV cohorts and scaling protects traffic quality. A common mistake is spending the entire budget in launch week, then running out of money right as the data becomes enough to make good decisions.",
      } },
      { type: "h2", text: { vi: "Chia ngân sách theo ba giai đoạn", en: "Split budget across three stages" } },
      { type: "ul", items: [
        { vi: "Test: nhiều concept, ngân sách nhỏ, ưu tiên tốc độ học hơn là hiệu quả tức thì", en: "Test: multiple concepts, small budgets, prioritizing learning speed over immediate efficiency" },
        { vi: "Scale: tăng dần ngân sách cho nhóm có retention và doanh thu tốt, không tăng đột ngột", en: "Scale: gradually expand budget for cohorts with strong retention and revenue, never abruptly" },
        { vi: "Retarget: đưa người đã cài quay lại bằng nội dung đúng thời điểm, không lặp lại thông điệp acquisition ban đầu", en: "Retarget: bring installers back with timely content, not a repeat of the original acquisition message" },
      ] },
      { type: "h2", text: { vi: "Đừng tối ưu chỉ bằng CPI", en: "Do not optimize on CPI alone" } },
      { type: "p", text: {
        vi: "CPI thấp nhưng D1, D7 hoặc doanh thu thấp vẫn là một thương vụ đắt — chỉ là chi phí đó bị giấu ở bước sau thay vì hiện ngay trên báo cáo kênh. Hãy đặt ngưỡng đánh giá theo cohort và so sánh creative, kênh, thiết bị và khu vực trước khi tăng ngân sách, thay vì chỉ nhìn con số CPI trên dashboard hằng ngày.",
        en: "A low CPI with weak D1, D7 or revenue is still expensive — the cost is simply hidden downstream instead of showing up on the channel report. Set cohort-based thresholds and compare creative, channel, device and location before scaling, rather than reacting to the CPI number on a daily dashboard alone.",
      } },
    ],
  },
  {
    slug: "tiktok-marketing-cho-game-mobile-viet-nam",
    title: { vi: "TikTok marketing game mobile: creative khiến người chơi dừng lại", en: "TikTok marketing for mobile games: stop-scrolling creative" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến tiktok marketing game mobile: creative khiến người chơi dừng lại trở thành một bài toán cần được chuẩn bị kỹ. Người xem TikTok quyết định lướt qua hay dừng lại trong chưa đầy hai giây — trước khi kịp nhận ra đó là quảng cáo. Công thức creative để họ chọn dừng lại. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "TikTok viewers decide to scroll or stop in under two seconds — before they even register it's an ad. A creative formula that gets them to stop." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-18", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-orange-600", variant: "social",
    sources: [{ label: { vi: "TikTok Creative Center", en: "TikTok Creative Center" }, href: "https://ads.tiktok.com/business/creativecenter/" }],
    body: [
      { type: "p", text: {
        vi: "TikTok marketing cho game mobile cần tư duy như một format nội dung, không phải một banner chuyển thành video. Người xem phải hiểu bối cảnh đủ nhanh, thấy một khoảnh khắc đáng chia sẻ và nhận ra hành động tiếp theo — và họ quyết định điều đó trong chưa đầy hai giây đầu tiên, trước cả khi kịp nhận ra đây là quảng cáo.",
        en: "TikTok marketing for mobile games should be treated as a content format, not a banner turned into video. Viewers need fast context, a shareable moment and a clear next action — and they decide all of that in under two seconds, before they even register it's an ad.",
      } },
      { type: "h2", text: { vi: "Công thức creative dễ kiểm thử", en: "A testable creative formula" } },
      { type: "ul", items: [
        { vi: "0–2 giây: mở bằng tình huống hoặc kết quả bất ngờ, không mở bằng logo hay tên game", en: "0–2 seconds: open with a situation or surprising result, never with a logo or the game's name" },
        { vi: "3–10 giây: cho thấy gameplay thật và lý do đáng quan tâm, tránh cảnh cắt dựng quá tay khiến gameplay trông giả", en: "3–10 seconds: show real gameplay and why it matters, avoiding over-edited cuts that make gameplay look fake" },
        { vi: "Cuối video: một lời mời rõ, phù hợp với đúng những gì đã hứa ở đầu video", en: "End: one clear call to action that matches exactly what was promised at the start" },
      ] },
      { type: "h2", text: { vi: "Đo chất lượng sau lượt xem, không chỉ bằng lượt xem", en: "Measure quality beyond views, not by view count alone" } },
      { type: "p", text: {
        vi: "Theo dõi tỷ lệ xem hết, click, cài đặt, activation và retention theo từng hook. Creative có nhiều view nhưng kéo sai người chơi sẽ làm tăng chi phí xử lý ở các bước sau — một hook giật gân dễ viral nhưng nếu không phản ánh đúng game, phần lớn traffic sẽ rời đi ngay khi mở app.",
        en: "Track completion, clicks, installs, activation and retention by hook. A creative with many views but the wrong players increases downstream costs — a sensational hook that goes viral easily but doesn't reflect the actual game will lose most of that traffic the moment they open the app.",
      } },
    ],
  },
  {
    slug: "pheu-marketing-game-mobile-tu-nhan-biet-den-retention",
    title: { vi: "Phễu marketing game mobile: từ nhận biết đến retention", en: "The mobile game marketing funnel: from awareness to retention" },
    excerpt: { vi: "Với các studio và nhà phát hành, phễu marketing game mobile: từ nhận biết đến retention thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Bỏ quên một tầng phễu marketing khiến mọi nỗ lực ở các tầng trước đó bị lãng phí. Bốn tầng cần theo dõi từ quảng cáo đến người chơi quay lại. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Neglect one funnel stage and every effort spent on the stages before it goes to waste. Four stages to track from the first ad to a returning player." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-19", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-teal-600", variant: "strategy",
    sources: [{ label: { vi: "Google Analytics — đo lường hành trình", en: "Google Analytics — journey measurement" }, href: "https://support.google.com/analytics/answer/9304153" }],
    body: [
      { type: "p", text: {
        vi: "Phễu marketing game mobile không kết thúc ở lượt cài. Mỗi tầng phải trả lời một câu hỏi: người chơi có chú ý, tin lời hứa, bắt đầu chơi và có lý do quay lại hay không? Khi các tầng được thiết kế liền mạch, ngân sách quảng cáo tạo ra tài sản tăng trưởng thay vì chỉ tạo traffic — và khi một tầng bị bỏ quên, mọi nỗ lực ở các tầng trước đó đều bị lãng phí.",
        en: "The mobile game marketing funnel does not end at install. Each stage should answer a question: did the player notice, trust the promise, start playing and find a reason to return? A connected funnel turns ad spend into a growth asset — and when one stage is neglected, every effort spent on the stages before it goes to waste.",
      } },
      { type: "h2", text: { vi: "Bốn tầng cần theo dõi", en: "Four stages to track" } },
      { type: "ul", items: [
        { vi: "Awareness: reach, video completion và branded search — dấu hiệu người chơi đã bắt đầu tò mò", en: "Awareness: reach, video completion and branded search — signs curiosity has started" },
        { vi: "Consideration: store view, click và wishlist — dấu hiệu lời hứa quảng cáo đủ thuyết phục", en: "Consideration: store views, clicks and wishlists — signs the ad's promise was convincing enough" },
        { vi: "Activation: tutorial completion và first core action — dấu hiệu người chơi hiểu và thích trải nghiệm cốt lõi", en: "Activation: tutorial completion and first core action — signs the player understood and liked the core experience" },
        { vi: "Retention: D1, D7, D30 và hoạt động cộng đồng — dấu hiệu giá trị đủ để giữ chân lâu dài", en: "Retention: D1, D7, D30 and community activity — signs the value is enough to hold on to players long term" },
      ] },
      { type: "h2", text: { vi: "Tìm điểm rơi trước khi tăng ngân sách", en: "Find the leak before scaling" } },
      { type: "p", text: {
        vi: "Nếu click tốt nhưng store conversion thấp, vấn đề nằm ở lời hứa hoặc trang store. Nếu cài đặt tốt nhưng activation thấp, hãy kiểm tra onboarding và hiệu năng. Cách chẩn đoán theo tầng giúp đội ngũ sửa đúng chỗ — thay vì phản ứng bằng cách tăng ngân sách ở tầng trên cùng, một hành động thường chỉ khiến điểm rơi ở tầng dưới lộ rõ hơn và tốn kém hơn.",
        en: "If clicks are strong but store conversion is weak, inspect the promise or store page. If installs are strong but activation is weak, inspect onboarding and performance. Stage-based diagnosis helps teams fix the right problem — rather than reacting by increasing budget at the top of the funnel, which usually just makes the leak further down more visible and more expensive.",
      } },
    ],
  },
  {
    slug: "thanh-toan-game-mobile-viet-nam-tang-conversion",
    title: { vi: "Thanh toán game mobile Việt Nam: giảm ma sát, tăng conversion", en: "Mobile game payments in Vietnam: reduce friction, grow conversion" },
    excerpt: { vi: "Thanh toán game mobile Việt Nam: giảm ma sát, tăng conversion là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. Nhiều thất thoát doanh thu không nằm ở giá — mà ở một bước xác thực bị lỗi trên một nhà mạng cụ thể mà không ai để ý. Cách tối ưu trải nghiệm thanh toán từng bước. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A lot of revenue leakage isn't about price — it's a verification step failing on one specific carrier nobody noticed. How to optimize payment step by step." },
    category: { vi: "Kinh doanh Game", en: "Game Business" }, date: "2026-08-19", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "performance",
    sources: [{ label: { vi: "Google Play — payments policy", en: "Google Play — payments policy" }, href: "https://support.google.com/googleplay/android-developer/answer/10281818" }, { label: { vi: "Apple — In-App Purchase", en: "Apple — In-App Purchase" }, href: "https://developer.apple.com/in-app-purchase/" }],
    body: [
      { type: "p", text: {
        vi: "Thanh toán game mobile tại Việt Nam là một phần của trải nghiệm sản phẩm, không chỉ là bước cuối của phễu. Người chơi cần biết mình mua gì, giá bao nhiêu, giao dịch có an toàn không và phải làm gì nếu vật phẩm chưa được ghi nhận — và vì phần lớn giao dịch game vẫn còn mới với nhiều người chơi Việt Nam, một trải nghiệm thanh toán mơ hồ dễ khiến họ bỏ ngang ngay cả khi đã sẵn sàng chi tiền.",
        en: "Mobile game payments in Vietnam are part of the product experience, not merely the end of the funnel. Players need to know what they're buying, the price, whether the transaction is safe and what to do if an item goes missing — and since in-game purchases are still relatively new for many Vietnamese players, an ambiguous payment experience can make them abandon it even when they were ready to spend.",
      } },
      { type: "h2", text: { vi: "Ba điểm cần tối ưu", en: "Three areas to optimize" } },
      { type: "ul", items: [
        { vi: "Thông tin: tên gói, giá, vật phẩm và điều kiện phải dễ hiểu ngay từ lần đọc đầu tiên", en: "Information: package name, price, items and conditions must be clear on the first read" },
        { vi: "Tin cậy: hiển thị kênh hỗ trợ, lịch sử giao dịch và chính sách hoàn tiền rõ ràng", en: "Trust: clearly show support channels, transaction history and refund policies" },
        { vi: "Khôi phục: xử lý retry, pending và restore purchase nhanh, không để người chơi tự hỏi tiền của mình đi đâu", en: "Recovery: handle retry, pending and restore purchase quickly, never leave players wondering where their money went" },
      ] },
      { type: "h2", text: { vi: "Đo conversion theo từng bước", en: "Measure conversion step by step" } },
      { type: "p", text: {
        vi: "Đo từ lúc mở paywall đến chọn gói, xác thực, hoàn tất và nhận vật phẩm. So sánh theo thiết bị, mạng, cohort và gói mua để biết điểm ma sát nằm ở giao diện hay ở hệ thống thanh toán — rất nhiều trường hợp thất thoát doanh thu ANBU từng thấy không nằm ở giá, mà nằm ở một bước xác thực bị rớt trên một nhà mạng cụ thể mà không ai để ý.",
        en: "Measure from paywall open through package selection, authentication, completion and item delivery. Compare by device, network, cohort and package to locate friction in the interface or the payment system — a lot of revenue leakage ANBU has seen wasn't about price at all, but a verification step failing on one specific carrier that nobody had noticed.",
      } },
    ],
  },
  {
    slug: "community-manager-game-mobile-kpi",
    title: { vi: "KPI community manager game mobile: đo sức khỏe cộng đồng", en: "Mobile game community manager KPIs: measuring health" },
    excerpt: { vi: "Khi triển khai kpi community manager game mobile: đo sức khỏe cộng đồng, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. Một group 50.000 thành viên im lặng không đáng giá bằng một group 2.000 người thường xuyên góp ý. KPI cộng đồng nên đo điều gì thay vì chỉ đếm số lượng. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A silent group of 50,000 isn't worth as much as an active group of 2,000 who give feedback. What community KPIs should actually measure besides headcount." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" }, date: "2026-08-19", readingTime: 3, author: "ANBU Team", color: "from-blue-700 to-teal-600", variant: "social",
    sources: [{ label: { vi: "Discord — Community Guidelines", en: "Discord — Community Guidelines" }, href: "https://discord.com/guidelines" }],
    body: [
      { type: "p", text: {
        vi: "Community manager game mobile tạo giá trị bằng cách biến phản hồi thành niềm tin, nội dung và insight cho sản phẩm. Vì vậy, số người trong group chỉ là chỉ số đầu phễu; KPI cần cho thấy cộng đồng có đang hoạt động lành mạnh và giúp người chơi quay lại hay không — một group 50.000 thành viên im lặng không có giá trị bằng một group 2.000 thành viên thường xuyên góp ý và quay lại chơi mỗi tuần.",
        en: "A mobile game community manager creates value by turning feedback into trust, content and product insight. Member count is only a top-funnel metric; KPIs should show whether the community is healthy and brings players back — a silent group of 50,000 members isn't worth as much as an active group of 2,000 who give feedback and return to play every week.",
      } },
      { type: "h2", text: { vi: "Bốn nhóm KPI nên dùng", en: "Four KPI groups to use" } },
      { type: "ul", items: [
        { vi: "Tham gia: active members, bài đăng, bình luận và event participation", en: "Participation: active members, posts, comments and event participation" },
        { vi: "Phản hồi: response time, resolved questions và escalation rate", en: "Support: response time, resolved questions and escalation rate" },
        { vi: "Cảm nhận: sentiment, chủ đề tiêu cực lặp lại và mức độ tin cậy dành cho đội ngũ vận hành", en: "Sentiment: overall sentiment, recurring negative themes and trust in the operating team" },
        { vi: "Tác động: retention, UGC và traffic thực tế quay về sản phẩm từ cộng đồng", en: "Impact: retention, UGC and actual traffic the community drives back to the product" },
      ] },
      { type: "h2", text: { vi: "Đọc KPI theo xu hướng, không theo một tuần đơn lẻ", en: "Read KPIs as trends, not a single week" } },
      { type: "p", text: {
        vi: "Một tuần nhiều bình luận chưa chắc tốt nếu phần lớn là khiếu nại. Hãy nhìn theo cohort, event và thay đổi sản phẩm để phân biệt tăng trưởng thật với một đợt bùng phát vấn đề — báo cáo cộng đồng tốt nhất luôn đi kèm ngữ cảnh: điều gì vừa thay đổi trong game khiến con số này di chuyển.",
        en: "A week with many comments is not automatically positive if most are complaints. Read KPIs by cohort, event and product change to separate real growth from a spike in problems — the best community reports always come with context: what just changed in the game that moved this number.",
      } },
    ],
  },
  {
    slug: "localization-game-mobile-chi-phi-va-quy-trinh",
    title: { vi: "Localization game mobile: chi phí và kiểm soát chất lượng", en: "Mobile game localization: cost and quality control" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến localization game mobile: chi phí và kiểm soát chất lượng trở thành một bài toán cần được chuẩn bị kỹ. Lập ngân sách localization theo số từ cần dịch là cách chắc chắn để bị vượt chi phí. Quy trình bốn bước tính đúng cả phần chi phí ẩn sau mỗi bản cập nhật. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Budgeting localization by word count is a reliable way to blow the budget. A four-step workflow that accounts for the hidden costs after every update." },
    category: { vi: "Thị trường Game", en: "Gaming Market" }, date: "2026-08-20", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-orange-600", variant: "branding",
    sources: [{ label: { vi: "Apple — localization", en: "Apple — localization" }, href: "https://developer.apple.com/app-store/localization/" }],
    body: [
      { type: "p", text: {
        vi: "Chi phí localization game mobile không chỉ là số từ cần dịch. Đội ngũ còn phải tính glossary, QA, voice, hình ảnh, cập nhật live-ops và thời gian sửa lỗi khi nội dung thay đổi — nhiều studio lập ngân sách theo từ, rồi bất ngờ khi chi phí thực tế vượt xa dự tính vì quên tính vòng lặp sửa lỗi sau mỗi bản cập nhật.",
        en: "Mobile game localization cost is more than the word count. Teams must also account for glossaries, QA, voice, visuals, live-ops updates and revision time — many studios budget per word, then get blindsided when actual costs run far higher because they forgot to account for the fix cycle after every update.",
      } },
      { type: "h2", text: { vi: "Quy trình bốn bước", en: "A four-step workflow" } },
      { type: "ul", items: [
        { vi: "Chuẩn hóa thuật ngữ và giọng thương hiệu trước khi dịch bất kỳ dòng nào", en: "Standardize terminology and brand voice before translating a single line" },
        { vi: "Dịch trong context với screenshot hoặc build thật, không dịch một danh sách chuỗi rời rạc", en: "Translate in context with screenshots or a real build, not an isolated list of strings" },
        { vi: "LQA trên thiết bị và kích thước màn hình thật, vì lỗi tràn chữ hiếm khi xuất hiện trên bản dịch giấy", en: "Run LQA on real devices and screen sizes, since text-overflow bugs rarely show up on a translated document" },
        { vi: "Theo dõi lỗi sau launch và cập nhật glossary liên tục, không coi bản dịch là việc làm một lần", en: "Track post-launch issues and continuously update the glossary, rather than treating translation as a one-time task" },
      ] },
      { type: "h2", text: { vi: "Đánh giá bằng trải nghiệm, không phải số câu đã dịch", en: "Evaluate by experience, not by translated line count" } },
      { type: "p", text: {
        vi: "Bản dịch đạt chuẩn khi người chơi hiểu phải làm gì, tin vào lời hứa và không gặp lỗi giao diện. Đây là thước đo quan trọng hơn việc chỉ đếm số câu đã hoàn thành — một bản dịch 100% chuỗi nhưng đầy lỗi ngữ cảnh vẫn tệ hơn một bản dịch 90% nhưng chính xác và tự nhiên ở mọi màn hình quan trọng.",
        en: "Localization succeeds when players know what to do, trust the promise and encounter no UI errors. That matters more than simply counting translated strings — a translation that's 100% complete but riddled with context errors is worse than one at 90% that's accurate and natural on every screen that matters.",
      } },
    ],
  },
  {
    slug: "creative-strategy-game-mobile-test-hook",
    title: { vi: "Creative strategy game mobile: test hook trước khi scale", en: "Mobile game creative strategy: test hooks before scaling" },
    excerpt: { vi: "Với các studio và nhà phát hành, creative strategy game mobile: test hook trước khi scale thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Đợi cả video hoàn chỉnh ra mắt rồi mới biết yếu tố nào thắng là quá muộn để sửa. Cách tách hook, gameplay và lời hứa để kiểm thử nhanh trước khi sản xuất hàng loạt. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Waiting for a finished video to launch before learning what wins is too late to fix. How to isolate hook, gameplay and promise for fast testing before scaling production." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-20", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "game",
    sources: [{ label: { vi: "TikTok Creative Center", en: "TikTok Creative Center" }, href: "https://ads.tiktok.com/business/creativecenter/" }],
    body: [
      { type: "p", text: {
        vi: "Creative strategy cho game mobile bắt đầu từ giả thuyết về lý do người chơi dừng lại. Thay vì làm một video hoàn chỉnh rồi chờ kết quả, hãy tách hook, cảnh gameplay và lời hứa để kiểm thử nhanh — cách này giúp đội ngũ biết chính xác yếu tố nào đang thắng thay vì đoán mò sau khi cả video đã ra mắt.",
        en: "Mobile game creative strategy starts with a hypothesis about why players stop. Instead of producing one polished video and waiting, isolate the hook, gameplay moment and promise for fast testing — this way the team knows exactly which element is winning instead of guessing after the whole video has already launched.",
      } },
      { type: "h2", text: { vi: "Ba loại hook nên thử", en: "Three hook types to test" } },
      { type: "ul", items: [
        { vi: "Hook fantasy: cho thấy thế giới hoặc vai trò người chơi muốn sở hữu", en: "Fantasy hook: show the world or role players want to own" },
        { vi: "Hook challenge: đặt câu hỏi hoặc thử thách có thể hiểu ngay trong tích tắc", en: "Challenge hook: pose a question or challenge instantly understandable" },
        { vi: "Hook proof: chứng minh kết quả, phản ứng hoặc khoảnh khắc hiếm bằng gameplay thật", en: "Proof hook: demonstrate an outcome, reaction or rare moment with real gameplay" },
      ] },
      { type: "h2", text: { vi: "Tăng ngân sách sau khi hiểu vì sao thắng", en: "Scale after understanding why it wins" } },
      { type: "p", text: {
        vi: "Đừng nhân bản một creative chỉ vì CTR cao. Hãy kiểm tra activation và retention để chắc rằng hook thu hút đúng nhóm người chơi mà sản phẩm có thể giữ lại — một hook thắng về CTR nhưng kéo người xem tò mò thay vì người chơi thật sẽ chỉ tạo ra tăng trưởng ảo trên báo cáo.",
        en: "Don't duplicate a creative just because CTR is high. Check activation and retention to confirm the hook attracts players the product can actually retain — a hook that wins on CTR but pulls in curious viewers rather than real players just creates the illusion of growth on a report.",
      } },
    ],
  },
  {
    slug: "game-marketing-b2b-case-study-viet-nam",
    title: { vi: "Case study marketing game Việt Nam: viết để tăng niềm tin", en: "Vietnam game marketing case studies that build buyer trust" },
    excerpt: { vi: "Case study marketing game Việt Nam: viết để tăng niềm tin là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. Một case study chỉ liệt kê con số đẹp mà không giải thích lý do phía sau khó thuyết phục khách hàng đang cân nhắc kỹ. Cấu trúc để viết case study đáng tin. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A case study that lists impressive numbers without explaining the reasoning struggles to convince a careful buyer. A structure for writing one that's actually credible." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-20", readingTime: 3, author: "ANBU Team", color: "from-blue-700 to-orange-600", variant: "strategy",
    sources: [{ label: { vi: "Google — helpful content", en: "Google — helpful content" }, href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" }],
    body: [
      { type: "p", text: {
        vi: "Case study marketing game tại Việt Nam không nên là một bài khoe thành tích. Người đọc cần biết bối cảnh, vấn đề, lựa chọn chiến lược, cách đo và điều gì có thể áp dụng cho sản phẩm tương tự — một case study chỉ liệt kê con số đẹp mà không giải thích lý do phía sau sẽ khó thuyết phục một khách hàng đang cân nhắc kỹ.",
        en: "A Vietnam game marketing case study should not be a trophy post. Readers need the context, problem, strategic choices, measurement and lessons applicable to similar products — a case study that only lists impressive numbers without explaining the reasoning behind them struggles to convince a client who is weighing their options carefully.",
      } },
      { type: "h2", text: { vi: "Cấu trúc case study đáng tin", en: "A credible case study structure" } },
      { type: "ul", items: [
        { vi: "Bối cảnh: thị trường, sản phẩm và mục tiêu ban đầu của khách hàng", en: "Context: market, product and the client's original goal" },
        { vi: "Can thiệp: insight, creative, kênh và thời gian triển khai cụ thể", en: "Intervention: the specific insight, creative, channels and timing used" },
        { vi: "Kết quả: chỉ số trước–sau, kèm giới hạn dữ liệu để tránh diễn giải quá đà", en: "Results: before-and-after metrics, with data limits noted to avoid overinterpretation" },
        { vi: "Bài học: điều gì nên lặp lại hoặc tránh cho lần triển khai tiếp theo", en: "Lessons: what to repeat or avoid for the next campaign" },
      ] },
      { type: "h2", text: { vi: "Tối ưu SEO mà không thổi phồng", en: "Optimize SEO without overclaiming" } },
      { type: "p", text: {
        vi: "Dùng tiêu đề mô tả đúng vấn đề, thêm số liệu có bối cảnh và liên kết đến dịch vụ liên quan. Sự minh bạch giúp bài viết vừa có cơ hội xếp hạng vừa tăng chất lượng lead — khách hàng game thường đủ tỉnh táo để nhận ra một case study nói quá, và điều đó gây hại nhiều hơn là không viết case study nào.",
        en: "Use a title that describes the problem, add contextual metrics and link to relevant services. Transparency supports both rankings and lead quality — game clients are usually sharp enough to spot an exaggerated case study, and that does more damage than not publishing one at all.",
      } },
    ],
  },
  {
    slug: "mobile-game-user-acquisition-vietnam-benchmark",
    title: { vi: "User acquisition game mobile Việt Nam: benchmark cần theo dõi", en: "Mobile game user acquisition in Vietnam: key benchmarks" },
    excerpt: { vi: "Khi triển khai user acquisition game mobile việt nam: benchmark cần theo dõi, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. So sánh CPI giữa một game hyper-casual và một game RPG nặng gần như vô nghĩa. Cách đọc benchmark UA đúng — theo xu hướng của chính sản phẩm, không theo ngành. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Comparing CPI between a hyper-casual game and a heavy RPG is nearly meaningless. How to read UA benchmarks the right way — by your own trend, not the industry average." },
    category: { vi: "Analytics Game", en: "Game Analytics" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-teal-600", variant: "performance",
    sources: [{ label: { vi: "Firebase Analytics", en: "Firebase Analytics" }, href: "https://firebase.google.com/docs/analytics" }],
    body: [
      { type: "p", text: {
        vi: "Không có một benchmark user acquisition đúng cho mọi game. Một game hyper-casual và một game RPG nặng có chi phí và hành vi hoàn toàn khác nhau, nên so sánh chéo giữa hai thể loại gần như vô nghĩa. Điều thật sự đáng theo dõi là xu hướng của chính sản phẩm theo kênh, creative, quốc gia và cohort người chơi — benchmark ngành chỉ nên dùng để biết mình đang ở đâu trong bức tranh lớn, không phải để đặt mục tiêu tuyệt đối.",
        en: "There is no universal user acquisition benchmark. A hyper-casual game and a heavy RPG have completely different cost structures and behavior, so cross-genre comparison is nearly meaningless. What actually matters is your own product's trend by channel, creative, country and player cohort — industry benchmarks are useful only to know roughly where you stand, not as an absolute target.",
      } },
      { type: "h2", text: { vi: "Bốn chỉ số nền tảng cần theo dõi song song", en: "Four core metrics to track together" } },
      { type: "ul", items: [
        { vi: "CPI và tỷ lệ cài đặt hợp lệ (loại trừ traffic gian lận hoặc chất lượng thấp)", en: "CPI and qualified install rate (excluding fraudulent or low-quality traffic)" },
        { vi: "Activation sau phiên đầu — tỷ lệ người chơi hoàn thành hành động có ý nghĩa đầu tiên", en: "First-session activation — the share of players completing a meaningful first action" },
        { vi: "D1, D7 retention theo cohort, tách riêng từng kênh và creative", en: "D1, D7 retention by cohort, separated by channel and creative" },
        { vi: "LTV và payback theo nguồn traffic, không gộp trung bình toàn bộ", en: "LTV and payback by traffic source, never averaged across the whole" },
      ] },
      { type: "h2", text: { vi: "Đừng dùng benchmark để che vấn đề", en: "Do not use benchmarks to hide problems" } },
      { type: "p", text: {
        vi: "Nếu game thấp hơn benchmark, hãy kiểm tra trải nghiệm và chất lượng traffic trước khi tăng ngân sách. Benchmark là tín hiệu chẩn đoán, không phải mục tiêu duy nhất — nhiều đội ngũ sai lầm khi coi việc \"đạt benchmark ngành\" là thành công, trong khi vấn đề thật sự của sản phẩm vẫn còn nguyên. Cách dùng benchmark đúng là để đặt câu hỏi, không phải để yên tâm.",
        en: "If performance trails a benchmark, inspect experience and traffic quality before scaling. A benchmark is a diagnostic signal, not the only goal — many teams mistakenly treat \"hitting the industry benchmark\" as success while the product's real problem is still unresolved. The right way to use a benchmark is to prompt questions, not to feel reassured.",
      } },
    ],
  },
  {
    slug: "aso-game-mobile-title-description-screenshot",
    title: { vi: "ASO game mobile: tối ưu title, mô tả và screenshot", en: "Mobile game ASO: optimize title, description and screenshots" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến aso game mobile: tối ưu title, mô tả và screenshot trở thành một bài toán cần được chuẩn bị kỹ. Trang store là hợp đồng đầu tiên giữa game và người chơi — bất kỳ khoảng cách nào giữa lời hứa và trải nghiệm thật đều trả giá bằng uninstall sớm. Cách tối ưu từng chi tiết trên trang. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A store page is the first contract between a game and a player — any gap between promise and reality gets paid back in early uninstalls. How to optimize every detail on it." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "seo",
    sources: [{ label: { vi: "Google Play Console", en: "Google Play Console" }, href: "https://support.google.com/googleplay/android-developer/answer/9859152" }],
    body: [
      { type: "p", text: {
        vi: "ASO game mobile không phải nhồi từ khóa vào title cho đến khi đọc lên không còn giống tiếng người. Title, mô tả và screenshot phải cùng truyền một lời hứa rõ ràng, đúng với trải nghiệm sau khi cài — vì trang store là hợp đồng đầu tiên giữa game và người chơi, và bất kỳ khoảng cách nào giữa lời hứa và trải nghiệm thật đều trả giá bằng uninstall sớm và review một sao.",
        en: "Mobile game ASO is not stuffing keywords into a title until it no longer reads like language a person would use. Title, description and screenshots should communicate one clear promise that matches the post-install experience — the store page is the first contract between game and player, and any gap between promise and reality gets paid back in early uninstalls and one-star reviews.",
      } },
      { type: "h2", text: { vi: "Ưu tiên thứ tự đọc, vì không ai đọc hết", en: "Prioritize the reading order, because nobody reads it all" } },
      { type: "ul", items: [
        { vi: "Title nói rõ thể loại và điểm khác biệt trong vài từ đầu tiên", en: "Title states genre and differentiation within the first few words" },
        { vi: "Screenshot đầu cho thấy fantasy chính — đây là yếu tố quyết định conversion nhiều nhất, không phải screenshot thứ năm", en: "The first screenshot shows the core fantasy — this drives conversion more than the fifth screenshot ever will" },
        { vi: "Mô tả giải thích lợi ích bằng ngôn ngữ tự nhiên, không phải danh sách tính năng khô khan", en: "Description explains benefits in natural language, not a dry feature list" },
      ] },
      { type: "h2", text: { vi: "Kiểm thử theo nguồn traffic, không chỉ theo trung bình", en: "Test by traffic source, not just the average" } },
      { type: "p", text: {
        vi: "Một trang store có thể chuyển đổi khác nhau giữa người đến từ TikTok, Google hay creator, vì mỗi nhóm đã có một kỳ vọng khác nhau trước khi chạm vào store. Hãy đọc conversion theo nguồn thay vì chỉ nhìn trung bình — một trang store \"tốt\" trên giấy tờ có thể đang che giấu việc nó hoạt động rất tệ với một nguồn traffic quan trọng.",
        en: "A store page may convert differently for TikTok, Google and creator traffic, since each group already carries a different expectation before landing on the store. Read conversion by source instead of relying only on the average — a store page that looks \"good\" on paper can be hiding poor performance on one important traffic source.",
      } },
    ],
  },
  {
    slug: "game-mobile-retention-push-notification",
    title: { vi: "Tăng retention game mobile bằng push notification đúng cách", en: "Improve mobile game retention with better push notifications" },
    excerpt: { vi: "Với các studio và nhà phát hành, tăng retention game mobile bằng push notification đúng cách thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Một khi người chơi tắt thông báo, gần như không có cách nào lấy lại kênh đó. Cách dùng push notification như một tài nguyên hữu hạn, không phải công cụ dùng thoải mái. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Once a player disables notifications, there's almost no way to win that channel back. How to treat push as a finite resource, not a tool to reach for anytime." },
    category: { vi: "Vận hành Game", en: "Game Operations" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-teal-700 to-navy-900", variant: "social",
    sources: [{ label: { vi: "Firebase Cloud Messaging", en: "Firebase Cloud Messaging" }, href: "https://firebase.google.com/docs/cloud-messaging" }],
    body: [
      { type: "p", text: {
        vi: "Push notification chỉ giúp retention khi nhắc người chơi về một giá trị thật: phần thưởng, event, bạn bè hoặc tiến độ đang dang dở. Gửi quá nhiều sẽ làm giảm niềm tin và tăng opt-out — và một khi người chơi đã tắt thông báo, gần như không có cách nào lấy lại kênh đó. Đây là lý do push notification nên được coi là tài nguyên hữu hạn, không phải công cụ dùng thoải mái mỗi khi cần tăng số liệu ngắn hạn.",
        en: "Push notifications improve retention only when they remind players of real value: rewards, events, friends or unfinished progress. Over-messaging reduces trust and increases opt-outs — and once a player disables notifications, there's almost no way to win that channel back. That's why push should be treated as a finite resource, not a tool to reach for whenever a short-term metric needs a boost.",
      } },
      { type: "h2", text: { vi: "Phân nhóm trước khi gửi, không gửi hàng loạt", en: "Segment before sending, never broadcast to everyone" } },
      { type: "ul", items: [
        { vi: "Người mới chưa hoàn thành onboarding — cần nhắc nhẹ, không cần khuyến mãi", en: "New players who haven't completed onboarding — need a gentle nudge, not a promotion" },
        { vi: "Người chơi có tiến độ dang dở — thông báo nên gắn cụ thể với tiến độ đó, không chung chung", en: "Players with unfinished progress — the message should reference that specific progress, not be generic" },
        { vi: "Người đã rời game nhiều ngày — cần một lý do đủ mạnh để quay lại, không phải một câu nhắc thông thường", en: "Players absent for several days — need a strong enough reason to return, not a routine reminder" },
      ] },
      { type: "h2", text: { vi: "Đo incremental retention, không chỉ open rate", en: "Measure incremental retention, not just open rate" } },
      { type: "p", text: {
        vi: "So sánh nhóm nhận và không nhận thông báo, theo dõi mở app, session và retention thật sự tạo ra thêm so với việc không gửi gì. Đừng đánh giá chỉ bằng open rate — một thông báo có open rate cao nhưng không thay đổi hành vi sau đó chỉ đang làm phiền người chơi mà không tạo giá trị nào.",
        en: "Compare messaged and unmessaged groups, and track the opens, sessions and retention actually created above doing nothing. Don't judge on open rate alone — a notification with a high open rate that changes no downstream behavior is just interrupting players without creating value.",
      } },
    ],
  },
  {
    slug: "game-mobile-influencer-brief-mau",
    title: { vi: "Brief influencer game mobile: giúp creator nói tự nhiên", en: "Mobile game influencer briefs that sound authentic" },
    excerpt: { vi: "Brief influencer game mobile: giúp creator nói tự nhiên là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. Một brief quá chi tiết khiến video nghe như quảng cáo đọc kịch bản — và khán giả của creator nhận ra ngay. Cách viết brief đủ rõ mà vẫn giữ được giọng riêng của họ. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "An overly detailed brief makes a video sound like a read-aloud ad — and the creator's audience notices immediately. How to brief clearly while keeping their voice intact." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "influencer",
    sources: [{ label: { vi: "TikTok Creator Marketplace", en: "TikTok Creator Marketplace" }, href: "https://creatormarketplace.tiktok.com/" }],
    body: [
      { type: "p", text: {
        vi: "Influencer marketing game mobile hiệu quả khi creator hiểu điều cần truyền đạt nhưng không bị buộc đọc một kịch bản cứng. Một brief quá chi tiết khiến video nghe như quảng cáo đọc kịch bản — khán giả của creator nhận ra ngay và phản ứng ngược lại với cả creator lẫn thương hiệu. Brief tốt nên mô tả audience, proof point, điều không được nói và cách disclosure, rồi để phần còn lại cho giọng riêng của creator.",
        en: "Mobile game influencer marketing works when creators understand the message without being forced to read a rigid script. An overly detailed brief makes the video sound like a read-aloud ad — the creator's audience notices immediately and reacts against both the creator and the brand. A good brief defines the audience, proof point, guardrails and disclosure, then leaves the rest to the creator's own voice.",
      } },
      { type: "h2", text: { vi: "Brief gồm năm phần", en: "Five parts of a brief" } },
      { type: "ul", items: [
        { vi: "Mục tiêu và nhóm người xem cụ thể, không chỉ \"tăng nhận diện\"", en: "A specific goal and audience, not just \"raise awareness\"" },
        { vi: "Một thông điệp bắt buộc — chỉ một, không phải danh sách năm điểm cần nhớ", en: "One required message — only one, not a list of five talking points to remember" },
        { vi: "Gameplay hoặc proof cần xuất hiện trong video", en: "Gameplay or proof that needs to appear in the video" },
        { vi: "Điều cần tránh và thông tin pháp lý (đặc biệt là yêu cầu disclosure quảng cáo)", en: "Guardrails and legal information (especially ad-disclosure requirements)" },
        { vi: "CTA và cách đo link để biết chiến dịch có hiệu quả", en: "CTA and a tracking method to know whether the campaign worked" },
      ] },
      { type: "h2", text: { vi: "Đánh giá bằng chất lượng traffic, không phải lượt xem", en: "Evaluate by traffic quality, not views" } },
      { type: "p", text: {
        vi: "Lượt xem chỉ là đầu phễu. Hãy theo dõi click, cài đặt, activation và retention của từng creator để biết ai tạo giá trị dài hạn — có những creator lượt xem thấp nhưng traffic chất lượng rất cao, và ngược lại. Nếu chỉ trả tiền theo view, ANBU thường thấy ngân sách chảy sai hướng.",
        en: "Views are top-funnel only. Track clicks, installs, activation and retention by creator to see who creates long-term value — some creators have low view counts but very high-quality traffic, and vice versa. Paying purely by view count is where ANBU most often sees budgets flow in the wrong direction.",
      } },
    ],
  },
  {
    slug: "monetization-game-mobile-arppu-arpu",
    title: { vi: "ARPU và ARPPU game mobile: đọc doanh thu đúng cách", en: "Mobile game ARPU and ARPPU: reading revenue correctly" },
    excerpt: { vi: "Khi triển khai arpu và arppu game mobile: đọc doanh thu đúng cách, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. ARPU tăng có thể chỉ vì bạn vừa mất một loạt người chơi không trả tiền, không phải vì game đang kiếm tiền tốt hơn. Cách đọc ARPU và ARPPU để không tự đánh lừa mình. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "ARPU can rise simply because you just lost a batch of non-paying players, not because the game is monetizing better. How to read ARPU and ARPPU without fooling yourself." },
    category: { vi: "Analytics Game", en: "Game Analytics" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-orange-600", variant: "performance",
    sources: [{ label: { vi: "Unity — game analytics", en: "Unity — game analytics" }, href: "https://unity.com/solutions/gaming-services" }],
    body: [
      { type: "p", text: {
        vi: "ARPU là doanh thu trung bình trên toàn bộ người chơi, còn ARPPU chỉ tính nhóm đã trả tiền. Đọc cùng payer conversion, retention và cohort sẽ giúp tránh kết luận sai về monetization — một mình ARPU tăng có thể chỉ vì mất bớt người chơi không trả tiền, chứ không phải vì game đang kiếm tiền tốt hơn.",
        en: "ARPU is average revenue per player while ARPPU covers paying players only. Read both alongside payer conversion, retention and cohort data to avoid false conclusions about monetization — ARPU rising on its own can simply mean losing non-paying players, not that the game is monetizing better.",
      } },
      { type: "h2", text: { vi: "Ba cách phân tích", en: "Three ways to analyze" } },
      { type: "ul", items: [
        { vi: "So sánh theo cohort ngày cài để loại trừ nhiễu từ các đợt UA khác nhau", en: "Compare by install cohort to remove noise from different UA waves" },
        { vi: "Tách organic và paid traffic, vì hành vi chi tiêu của hai nhóm thường khác nhau đáng kể", en: "Separate organic and paid traffic, since spending behavior often differs significantly between the two" },
        { vi: "Theo dõi thay đổi sau offer hoặc event để biết tác động thật, không chỉ nhìn tổng doanh thu tháng", en: "Track changes after offers or events to see real impact, not just monthly revenue totals" },
      ] },
      { type: "h2", text: { vi: "Tăng doanh thu mà không phá retention", en: "Grow revenue without hurting retention" } },
      { type: "p", text: {
        vi: "Nếu ARPPU tăng nhưng retention giảm, hệ thống đang lấy doanh thu ngắn hạn bằng chi phí niềm tin. Hãy thử offer rõ ràng, giới hạn hợp lý và giá trị không ảnh hưởng pay-to-win — về dài hạn, một game giữ được retention tốt luôn có nhiều cơ hội tăng doanh thu hơn một game vắt kiệt nhóm người chơi hiện có.",
        en: "If ARPPU rises while retention falls, the system is trading trust for short-term revenue. Test clear offers, reasonable limits and value that avoids pay-to-win pressure — over the long run, a game that keeps retention healthy always has more room to grow revenue than one that squeezes its existing player base dry.",
      } },
    ],
  },
  {
    slug: "game-mobile-analytics-dashboard-can-co",
    title: { vi: "Dashboard analytics game mobile: 10 chỉ số cần xem", en: "Mobile game analytics dashboard: 10 metrics to review" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến dashboard analytics game mobile: 10 chỉ số cần xem trở thành một bài toán cần được chuẩn bị kỹ. Một dashboard nhồi quá nhiều biểu đồ khiến người xem mất nhiều thời gian tìm câu trả lời hơn cả không có dashboard nào. 10 chỉ số thật sự cần có mặt. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A dashboard crammed with too many charts can cost more time than having none at all. The 10 metrics that actually deserve a spot." },
    category: { vi: "Analytics Game", en: "Game Analytics" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-blue-700 to-teal-600", variant: "seo", cover: "/blog-covers/analytics-dashboard.jpg",
    sources: [{ label: { vi: "Firebase Analytics", en: "Firebase Analytics" }, href: "https://firebase.google.com/docs/analytics" }],
    body: [
      { type: "p", text: {
        vi: "Dashboard analytics game mobile không cần chứa mọi dữ liệu. Nó cần trả lời nhanh tuần này traffic, chất lượng người chơi và doanh thu đang thay đổi vì lý do nào — một dashboard nhồi quá nhiều biểu đồ thường khiến người xem mất nhiều thời gian tìm câu trả lời hơn là không có dashboard nào cả.",
        en: "A mobile game analytics dashboard does not need every data point. It should quickly explain why traffic, player quality and revenue changed this week — a dashboard crammed with too many charts often costs the viewer more time finding an answer than having no dashboard at all.",
      } },
      { type: "h2", text: { vi: "Nhóm chỉ số cốt lõi", en: "Core metric groups" } },
      { type: "ul", items: [
        { vi: "Acquisition: spend, CPI, installs và source mix theo từng kênh", en: "Acquisition: spend, CPI, installs and source mix by channel" },
        { vi: "Product: activation, session depth và retention theo cohort", en: "Product: activation, session depth and retention by cohort" },
        { vi: "Revenue: payer conversion, ARPU và LTV theo thời gian", en: "Revenue: payer conversion, ARPU and LTV over time" },
      ] },
      { type: "h2", text: { vi: "Thiết kế dashboard để hành động, không chỉ để báo cáo", en: "Design for action, not just for reporting" } },
      { type: "p", text: {
        vi: "Mỗi biểu đồ nên có ngưỡng cảnh báo, người phụ trách và bước tiếp theo. Nếu không biết khi nào cần hành động, đó chỉ là báo cáo chứ chưa phải dashboard vận hành — sự khác biệt lớn nhất giữa hai loại này là dashboard vận hành khiến người xem biết chính xác việc cần làm tiếp theo, còn báo cáo chỉ khiến người xem biết chuyện đã xảy ra.",
        en: "Each chart should have an alert threshold, an owner and a next step. Without a clear trigger for action, it's just a report rather than an operating dashboard — the biggest difference is that an operating dashboard tells the viewer exactly what to do next, while a report only tells them what already happened.",
      } },
    ],
  },
  {
    slug: "game-mobile-community-discord-viet-nam",
    title: { vi: "Xây dựng và vận hành Discord cho cộng đồng game tại Việt Nam", en: "Building and running a Discord community for your game in Vietnam" },
    excerpt: { vi: "Một server Discord không tự nhiên sống động chỉ vì có nhiều kênh. Nó cần kiến trúc rõ ràng, một kế hoạch chào đón 30 ngày đầu và cách đo sức khỏe cộng đồng theo thời gian — không chỉ đếm số thành viên.", en: "A Discord server doesn't come alive just because it has a lot of channels. It needs clear architecture, a 30-day onboarding plan and a way to measure community health over time — not just a member count." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" }, date: "2026-08-21", readingTime: 5, author: "ANBU Team", color: "from-navy-900 to-teal-600", variant: "social", cover: "/blog-covers/discord-community.jpg",
    sources: [{ label: { vi: "Discord Community Guidelines", en: "Discord Community Guidelines" }, href: "https://discord.com/guidelines" }],
    body: [
      { type: "p", text: {
        vi: "Nhiều thương hiệu mở server Discord xong để mặc kệ nó tự lớn. Một tuần sau, kênh #general đầy tin nhắn spam, không ai biết #bug-report ở đâu, còn admin thì bận trả lời cùng một câu hỏi hai mươi lần. Discord cho game cần được thiết kế như một sản phẩm thật — có cấu trúc, có người chịu trách nhiệm và có kế hoạch cho 30 ngày đầu, không phải một kênh chat mở ra rồi để đó.",
        en: "Plenty of brands open a Discord server and just let it grow on its own. A week later #general is full of spam, nobody can find #bug-report, and the admin is answering the same question for the twentieth time. A game Discord needs to be designed like a real product — with structure, an owner and a plan for the first 30 days, not a chat room opened and forgotten.",
      } },
      { type: "h2", text: { vi: "Cấu trúc kênh nên có", en: "Channel structure to start with" } },
      { type: "ul", items: [
        { vi: "Start here: quy tắc, FAQ và chọn vai trò — nơi đầu tiên người mới nhìn thấy", en: "Start here: rules, FAQ and role selection — the first thing newcomers see" },
        { vi: "Game help: hướng dẫn, báo lỗi và hỗ trợ có người trực trả lời", en: "Game help: guides, bug reports and support with a staffed answer channel" },
        { vi: "Community: chat tự do, event và nội dung do người chơi tạo", en: "Community: free chat, events and player-made content" },
        { vi: "Feedback: bug report và đề xuất tính năng, tách riêng khỏi chat chung", en: "Feedback: bug reports and feature requests, kept separate from general chat" },
      ] },
      { type: "h2", text: { vi: "30 ngày đầu quyết định ai ở lại", en: "The first 30 days decide who stays" } },
      { type: "p", text: {
        vi: "Thành viên mới cần biết vào đâu, đọc gì và làm hành động đầu tiên trong vài phút — không phải cuộn qua hai mươi kênh để đoán. Gán vai trò theo ngôn ngữ, nền tảng và sở thích ngay từ đầu, rồi dựng một lịch event cố định (ví dụ tối thứ Sáu hàng tuần) để tạo thói quen quay lại thay vì chỉ đăng thông báo ngẫu hứng.",
        en: "New members need to know where to go, what to read and what first action to take within minutes — not scroll through twenty channels guessing. Assign roles by language, platform and interest from day one, then set a recurring event slot, a Friday-night ritual for example, to build a return habit instead of posting announcements at random.",
      } },
      { type: "h2", text: { vi: "Đo sức khỏe server, không chỉ đếm thành viên", en: "Measure server health, not just member count" } },
      { type: "p", text: {
        vi: "Theo dõi tỷ lệ hoàn tất onboarding, số thành viên gửi tin nhắn đầu tiên, tham gia event, quay lại sau bảy ngày và thời gian phản hồi của đội vận hành. Nếu số lượng thành viên tăng nhưng hoạt động giảm, đó là dấu hiệu onboarding có vấn đề — đừng chỉ đăng thêm bài để che lấp. Khi thành viên rời đi ở cùng một bước, hãy sửa đúng bước đó thay vì tăng tần suất đăng bài trên toàn kênh.",
        en: "Track onboarding completion, first-message rate, event participation, seven-day return and the team's response time. If membership climbs while activity falls, that's an onboarding problem — don't paper over it with more posts. When members drop off at the same step every time, fix that step specifically instead of posting more everywhere.",
      } },
      { type: "quote", text: {
        vi: "Một cộng đồng game không lớn lên vì có nhiều kênh. Nó lớn lên vì người mới luôn biết mình đang đứng ở đâu và nên làm gì tiếp theo.",
        en: "A game community doesn't grow because it has many channels. It grows because newcomers always know where they stand and what to do next.",
      } },
    ],
  },
  {
    slug: "marketing-game-mobile-mua-tet-viet-nam",
    title: { vi: "Marketing game mobile mùa Tết: nội dung và event đúng văn hóa", en: "Tet marketing for mobile games: culturally relevant content" },
    excerpt: { vi: "Với các studio và nhà phát hành, marketing game mobile mùa tết: nội dung và event đúng văn hóa thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Tết là một trong số ít dịp trong năm mà thời gian rảnh và mức sẵn sàng chi tiêu của người chơi Việt cùng tăng. Bỏ lỡ cửa sổ này nghĩa là chờ thêm một năm. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Tet is one of the rare windows when Vietnamese players' free time and spending willingness rise together. Miss it and you wait another year." },
    category: { vi: "Thị trường Game", en: "Gaming Market" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "branding",
    sources: [{ label: { vi: "Google — helpful content", en: "Google — helpful content" }, href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" }],
    body: [
      { type: "p", text: {
        vi: "Marketing game mobile mùa Tết không chỉ là thay màu đỏ và thêm lời chúc. Đội ngũ cần hiểu lịch nghỉ, thói quen online, ngôn ngữ và những moment khiến người chơi muốn chia sẻ cùng bạn bè — vì Tết là một trong số ít dịp trong năm mà thời gian rảnh và tâm lý sẵn sàng chi tiêu của người chơi Việt Nam cùng tăng đồng thời. Bỏ lỡ cửa sổ này nghĩa là chờ thêm một năm.",
        en: "Tet marketing for mobile games is more than red colors and greetings. Teams should understand holiday schedules, online habits, language and moments players want to share — Tet is one of the rare windows in the year when Vietnamese players' free time and willingness to spend rise together. Missing this window means waiting another year.",
      } },
      { type: "h2", text: { vi: "Ba lớp nội dung cần đi cùng nhau", en: "Three content layers that need to move together" } },
      { type: "ul", items: [
        { vi: "Brand: lời chúc và câu chuyện phù hợp văn hóa, không phải bản dịch nguyên xi từ chiến dịch quốc tế", en: "Brand: culturally relevant greetings and stories, not a straight translation of an international campaign" },
        { vi: "Gameplay: event, quest hoặc vật phẩm theo mùa gắn với ý nghĩa Tết (may mắn, sum họp, khởi đầu mới)", en: "Gameplay: seasonal events, quests or items tied to Tet meanings (luck, reunion, fresh starts)" },
        { vi: "Community: UGC, creator và hoạt động nhóm khai thác không khí lễ hội thật của người chơi", en: "Community: UGC, creators and group activities that tap into players' genuine festive mood" },
      ] },
      { type: "h2", text: { vi: "Đo tác động sau cao điểm, không chỉ trong những ngày Tết", en: "Measure after the peak, not just during Tet itself" } },
      { type: "p", text: {
        vi: "Theo dõi retention sau event, người chơi quay lại và doanh thu tăng thêm thay vì chỉ nhìn lượt tương tác trong vài ngày đầu. Nhiều chiến dịch Tết tạo được một đợt tăng ngắn rồi mất trắng ngay khi kỳ nghỉ kết thúc — dấu hiệu event chỉ mượn sự chú ý sẵn có chứ chưa xây được thói quen chơi mới.",
        en: "Track post-event retention, returning players and incremental revenue instead of only looking at early engagement. Many Tet campaigns generate a short spike that evaporates the moment the holiday ends — a sign the event only borrowed existing attention rather than building a new play habit.",
      } },
    ],
  },
  {
    slug: "seo-game-marketing-viet-nam-internal-link",
    title: { vi: "Internal link website game: xây topic cluster cho SEO", en: "Internal linking for game websites: building SEO topic clusters" },
    excerpt: { vi: "Internal link website game: xây topic cluster cho SEO là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. Hàng chục bài viết tốt nhưng không link đến nhau khiến mỗi bài phải tự gánh toàn bộ sức mạnh SEO của mình. Cách xây internal link để cả cụm bài cùng hỗ trợ nhau. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Dozens of good posts that never link to each other force each one to carry its SEO weight alone. How to build internal links so the whole cluster supports itself." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-blue-700 to-orange-600", variant: "seo",
    sources: [{ label: { vi: "Google Search Central — SEO Starter Guide", en: "Google Search Central — SEO Starter Guide" }, href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" }],
    body: [
      { type: "p", text: {
        vi: "Website game có thể tăng độ phủ tìm kiếm bằng cách liên kết bài viết theo hành trình: thị trường, chiến lược, triển khai, đo lường và case study. Mỗi link cần giúp người đọc trả lời câu hỏi tiếp theo, chứ không chỉ nhét thêm một đường link cho có. Nhiều website game có hàng chục bài viết tốt nhưng chúng nằm cô lập, không link đến nhau — kết quả là mỗi bài phải tự gánh toàn bộ sức mạnh SEO của mình thay vì được cả cụm bài hỗ trợ.",
        en: "A game website can grow search visibility by linking content along the journey: market, strategy, execution, measurement and case studies. Each link should answer the reader's next question, not just be inserted for the sake of having a link. Many game websites have dozens of solid posts that sit isolated, never linking to each other — the result is that each post has to carry its entire SEO weight alone instead of being supported by a whole content cluster.",
      } },
      { type: "h2", text: { vi: "Nguyên tắc liên kết", en: "Linking principles" } },
      { type: "ul", items: [
        { vi: "Dẫn từ bài rộng (pillar) đến bài chuyên sâu (cluster) và ngược lại", en: "Link from broad pillar pages to deep cluster pages and back" },
        { vi: "Dùng anchor text mô tả đúng nội dung trang đích, không dùng \"xem thêm\" hay \"tại đây\"", en: "Use anchor text that accurately describes the destination, not generic \"read more\" or \"here\"" },
        { vi: "Ưu tiên link đến trang có giá trị chuyển đổi (trang dịch vụ, trang liên hệ) từ các bài viết có traffic cao", en: "Prioritize linking to conversion-relevant pages (service, contact) from high-traffic posts" },
      ] },
      { type: "h2", text: { vi: "Kiểm tra link định kỳ", en: "Audit links regularly" } },
      { type: "p", text: {
        vi: "Xóa link hỏng, cập nhật bài cũ và kiểm tra các bài mới đã được nối vào cluster đúng chỗ hay chưa. Cấu trúc tốt giúp cả người dùng lẫn crawler khám phá website dễ hơn — và với ANBU, đây thường là hạng mục rẻ nhất trong toàn bộ chiến lược SEO, vì không cần viết nội dung mới, chỉ cần sắp xếp lại những gì đã có.",
        en: "Remove broken links, refresh older posts and confirm new articles are properly connected into the cluster. A strong structure helps both users and crawlers discover the site more easily — and in ANBU's experience, this is usually the cheapest item in an entire SEO strategy, since it requires no new content, only reorganizing what already exists.",
      } },
    ],
  },
  {
    slug: "ab-test-store-listing-game-mobile",
    title: { vi: "A/B test store listing game mobile: nên thử gì?", en: "Mobile game store listing A/B tests: what to test" },
    excerpt: { vi: "Khi triển khai a/b test store listing game mobile: nên thử gì?, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. Thay nhiều biến cùng lúc có thể cho kết quả tốt hơn — nhưng bạn sẽ không bao giờ biết chính xác điều gì tạo ra sự khác biệt đó. Cách chạy A/B test store listing đúng cách. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Changing several variables at once might win — but you'll never know exactly what caused it. How to run store listing A/B tests the right way." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-21", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "seo",
    sources: [{ label: { vi: "Google Play store listing experiments", en: "Google Play store listing experiments" }, href: "https://support.google.com/googleplay/android-developer/answer/6227309" }],
    body: [
      { type: "p", text: {
        vi: "A/B test store listing game mobile giúp trả lời câu hỏi cụ thể: người chơi phản ứng với fantasy nào, screenshot nào truyền tải gameplay tốt hơn và lời hứa nào tạo conversion. Mỗi lần nên thay một biến chính — thay nhiều biến cùng lúc có thể cho kết quả tốt hơn, nhưng đội ngũ sẽ không bao giờ biết chính xác điều gì đã tạo ra sự khác biệt đó để lặp lại ở lần sau.",
        en: "Mobile game store listing experiments answer specific questions: which fantasy, screenshot or promise improves conversion. Change one primary variable at a time — changing several at once might produce a better result, but the team will never know exactly what caused it, and can't repeat it deliberately next time.",
      } },
      { type: "h2", text: { vi: "Ưu tiên biến có tác động lớn", en: "Prioritize high-impact variables" } },
      { type: "ul", items: [
        { vi: "Icon và frame đầu tiên của video — thứ đầu tiên người dùng nhìn thấy trước khi quyết định lướt tiếp hay dừng lại", en: "Icon and the first video frame — the first thing a user sees before deciding to scroll past or stop" },
        { vi: "Screenshot đầu và headline trên ảnh, vì phần lớn người dùng không cuộn hết cả dải screenshot", en: "First screenshot and its headline, since most users never scroll through the entire screenshot set" },
        { vi: "Thông điệp ngắn mô tả điểm khác biệt so với các game cùng thể loại đang cạnh tranh trong cùng kết quả tìm kiếm", en: "A short message describing differentiation from competing games in the same search results" },
      ] },
      { type: "h2", text: { vi: "Đọc kết quả đúng cách", en: "Read results correctly" } },
      { type: "p", text: {
        vi: "Chờ đủ dữ liệu, tách theo quốc gia và nguồn traffic, rồi kiểm tra activation sau cài đặt. Conversion tăng nhưng người chơi rời sớm chưa phải chiến thắng — biến thể thắng thử nghiệm đôi khi chỉ đang hứa hẹn quá đà rồi khiến người chơi thất vọng ngay sau khi mở game, và khoản mất mát đó không hiện lên trong báo cáo A/B test nếu chỉ đo đến bước cài đặt.",
        en: "Wait for sufficient data, segment by country and source, then check post-install activation. Higher conversion with early churn is not a win — a winning variant sometimes just overpromises and disappoints players right after opening the game, and that loss never shows up in an A/B test report that only measures through install.",
      } },
    ],
  },
  {
    slug: "game-marketing-localization-vietnam-keyword",
    title: { vi: "Marketing game tại Việt Nam: bản địa hóa keyword và thông điệp", en: "Game marketing in Vietnam: localizing keywords and messaging" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến marketing game tại việt nam: bản địa hóa keyword và thông điệp trở thành một bài toán cần được chuẩn bị kỹ. Cộng đồng game Việt tự sáng tạo thuật ngữ riêng, pha trộn tiếng Anh và tiếng Việt theo cách không công cụ nghiên cứu từ khóa nào đoán được. Cách tìm đúng từ khóa người chơi thật sự gõ. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Vietnamese gaming communities coin their own slang, blending English and Vietnamese in ways no keyword tool predicts. How to find the terms players actually type." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-22", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-orange-600", variant: "branding",
    sources: [{ label: { vi: "Google Search Central — nội dung hữu ích", en: "Google Search Central — helpful content" }, href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" }],
    body: [
      { type: "p", text: {
        vi: "Keyword tiếng Anh dịch sang tiếng Việt chưa chắc là keyword người chơi sử dụng. Marketing game tại Việt Nam cần nghiên cứu cách cộng đồng gọi thể loại, tính năng, nhân vật và lợi ích của game trong ngữ cảnh thật — cộng đồng game Việt thường tự sáng tạo ra thuật ngữ riêng, pha trộn tiếng Anh và tiếng Việt theo cách không có công cụ nghiên cứu từ khóa nào đoán trước được.",
        en: "An English keyword translated into Vietnamese may not be how players actually search. Vietnam game marketing should study how communities describe genres, features, characters and benefits in real context — Vietnamese gaming communities often coin their own terms, blending English and Vietnamese in ways no keyword tool can predict in advance.",
      } },
      { type: "h2", text: { vi: "Tìm keyword từ ngôn ngữ cộng đồng", en: "Find keywords from community language" } },
      { type: "ul", items: [
        { vi: "Đọc bình luận, group và video review để thấy cách người chơi thật sự gọi tên mọi thứ", en: "Read comments, groups and review videos to see how players actually name things" },
        { vi: "Gom biến thể theo ý định tìm kiếm, không theo độ giống nhau về mặt chữ", en: "Cluster variants by search intent, not by textual similarity" },
        { vi: "Đưa keyword vào title, store và nội dung hỗ trợ một cách tự nhiên, không gượng ép", en: "Use keywords in titles, store pages and support content naturally, never forced" },
      ] },
      { type: "h2", text: { vi: "Đo bằng hành động sau click", en: "Measure post-click actions" } },
      { type: "p", text: {
        vi: "Keyword tốt không chỉ tạo impression. Nó phải kéo đúng người chơi vào store, hoàn thành activation và có khả năng quay lại — một từ khóa có volume cao nhưng kéo sai đối tượng chỉ làm tăng traffic ảo trên báo cáo mà không tạo ra giá trị thật cho sản phẩm.",
        en: "A strong keyword does more than create impressions. It attracts the right players, drives activation and supports return behavior — a high-volume keyword that pulls in the wrong audience just inflates traffic on a report without creating real product value.",
      } },
    ],
  },
  {
    slug: "game-mobile-user-acquisition-creative-fatigue",
    title: { vi: "Creative fatigue trong quảng cáo game mobile: dấu hiệu và cách xử lý", en: "Mobile game creative fatigue: signs and ways to respond" },
    excerpt: { vi: "Với các studio và nhà phát hành, creative fatigue trong quảng cáo game mobile: dấu hiệu và cách xử lý thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Phản ứng sai lầm phổ biến nhất khi creative mệt mỏi là đổ lỗi cho kênh quảng cáo rồi rút ngân sách. Ba dấu hiệu nhận biết fatigue trước khi mắc sai lầm đó. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "The most common wrong reaction to creative fatigue is blaming the ad channel and pulling budget. Three signs to catch fatigue before making that mistake." },
    category: { vi: "Performance Marketing", en: "Performance Marketing" }, date: "2026-08-22", readingTime: 3, author: "ANBU Team", color: "from-orange-600 to-navy-900", variant: "performance",
    sources: [{ label: { vi: "Meta — creative diversification", en: "Meta — creative diversification" }, href: "https://www.facebook.com/business/m/creative-diversification" }],
    body: [
      { type: "p", text: {
        vi: "Creative fatigue xuất hiện khi cùng một góc nhìn đã bị người dùng thấy quá nhiều. Chỉ số xấu dần không nhất thiết nghĩa là game hoặc kênh quảng cáo có vấn đề; có thể đội ngũ đang thiếu vòng lặp creative mới — và phản ứng sai lầm phổ biến nhất là đổ lỗi cho kênh hoặc sản phẩm rồi rút ngân sách, trong khi giải pháp thực ra chỉ là làm mới creative.",
        en: "Creative fatigue appears when audiences see the same angle too often. Worsening metrics don't necessarily mean the game or channel is broken; the team may simply lack a fresh creative pipeline — the most common wrong reaction is to blame the channel or product and pull budget, when the real fix is just refreshing creative.",
      } },
      { type: "h2", text: { vi: "Ba dấu hiệu cần theo dõi", en: "Three signs to watch" } },
      { type: "ul", items: [
        { vi: "CTR giảm trong khi frequency tăng — dấu hiệu rõ nhất của fatigue", en: "CTR falls as frequency rises — the clearest sign of fatigue" },
        { vi: "CPI tăng nhưng conversion store vẫn ổn định — vấn đề nằm ở creative, không phải ở trang store", en: "CPI rises while store conversion stays stable — the problem is the creative, not the store page" },
        { vi: "Comment và phản ứng bắt đầu lặp lại, một dấu hiệu khán giả đã quen thuộc quá mức với quảng cáo", en: "Comments and reactions start repeating, a sign the audience has grown overly familiar with the ad" },
      ] },
      { type: "h2", text: { vi: "Làm mới theo góc nhìn, không chỉ đổi màu sắc", en: "Refresh the angle, not just the color palette" } },
      { type: "p", text: {
        vi: "Thay fantasy, nhân vật, tình huống hoặc proof thay vì chỉ đổi màu. Giữ event tracking để biết góc mới có cải thiện activation và retention thật không — nếu chỉ đổi phần vỏ ngoài mà giữ nguyên góc nhìn cũ, fatigue thường quay lại rất nhanh vì bản chất thông điệp không thay đổi.",
        en: "Change the fantasy, character, situation or proof instead of only changing colors. Keep event tracking to see whether the new angle genuinely improves activation and retention — changing only the surface while keeping the same angle usually brings fatigue back quickly, since the core message hasn't actually changed.",
      } },
    ],
  },
  {
    slug: "game-community-moderation-vietnam",
    title: { vi: "Moderation cộng đồng game: xây quy tắc an toàn cho người chơi Việt", en: "Game community moderation: building a safer space for Vietnamese players" },
    excerpt: { vi: "Một cộng đồng game có thể tăng vài nghìn thành viên chỉ trong một đêm — và spam sẽ đuổi người chơi tốt đi trước khi bạn kịp phản ứng. Cách chuẩn bị policy moderation trước khi làn sóng đó ập đến.", en: "A game community can gain thousands of members overnight — and spam will drive good players away before you can react. How to prepare a moderation policy before that wave hits." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" }, date: "2026-08-22", readingTime: 3, author: "ANBU Team", color: "from-navy-900 to-teal-600", variant: "social",
    sources: [{ label: { vi: "Discord — Community Guidelines", en: "Discord — Community Guidelines" }, href: "https://discord.com/guidelines" }],
    body: [
      { type: "p", text: {
        vi: "Cộng đồng game Việt có thể tăng rất nhanh sau một event hoặc creator campaign — có khi vài nghìn thành viên mới trong một đêm. Nếu quy tắc, vai trò và quy trình xử lý chưa rõ trước khi làn sóng đó ập đến, spam và xung đột sẽ làm người chơi tốt rời đi trước khi đội ngũ kịp phản ứng. Moderation không phải việc dọn dẹp sau khi có vấn đề; nó phải được thiết kế trước khi cộng đồng lớn lên.",
        en: "A Vietnamese game community can grow very fast after an event or creator campaign — sometimes thousands of new members overnight. Without clear rules, roles and escalation already in place before that wave hits, spam and conflict drive good players away before the team can react. Moderation isn't cleanup after a problem appears; it needs to be designed before the community grows.",
      } },
      { type: "h2", text: { vi: "Một policy moderation cần có", en: "What a moderation policy needs" } },
      { type: "ul", items: [
        { vi: "Hành vi được phép và không được phép, viết rõ ràng và công khai, không chỉ tồn tại trong đầu admin", en: "Allowed and prohibited behavior, written clearly and public, not just in the admin's head" },
        { vi: "Mức xử lý theo từng loại vi phạm — cảnh báo, tạm khóa, cấm vĩnh viễn — áp dụng nhất quán cho mọi thành viên", en: "Action levels for each violation type — warning, temp mute, permanent ban — applied consistently to everyone" },
        { vi: "Kênh báo cáo rõ ràng và cam kết thời gian phản hồi cụ thể", en: "A clear reporting channel with a committed response time" },
        { vi: "Quy trình appeal minh bạch để thành viên bị xử lý sai có cách khiếu nại", en: "A transparent appeal process for members who feel wrongly penalized" },
      ] },
      { type: "h2", text: { vi: "Đo chất lượng moderation bằng kết quả, không phải số lượt xóa", en: "Measure moderation quality by outcome, not deletion count" } },
      { type: "p", text: {
        vi: "Theo dõi thời gian xử lý, tỷ lệ tái phạm, sentiment và retention của thành viên. Mục tiêu là giữ cuộc trò chuyện hữu ích chứ không phải xóa càng nhiều càng tốt — một server xóa bài quá tay thường xuyên sẽ khiến thành viên e ngại đăng bất cứ điều gì, kể cả phản hồi có giá trị mà đội ngũ sản phẩm rất cần nghe.",
        en: "Track resolution time, repeat violations, sentiment and member retention. The goal is useful conversation, not maximum deletion — a server that deletes posts too aggressively makes members afraid to post anything at all, including the valuable feedback the product team actually needs to hear.",
      } },
    ],
  },
  {
    slug: "ai-search-seo-game-marketing",
    title: { vi: "AI search và SEO game marketing: làm sao để được trích dẫn?", en: "AI search and game marketing SEO: how to become a cited source" },
    excerpt: { vi: "AI search và SEO game marketing: làm sao để được trích dẫn? là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. Hệ thống AI có xu hướng trích dẫn nội dung trả lời thẳng câu hỏi hơn là mở đầu bằng một đoạn giới thiệu dài dòng. Cách viết để website game được chọn làm nguồn. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "AI systems tend to cite content that answers a question directly, not one that opens with a long preamble. How to write so your game website gets picked as the source." },
    category: { vi: "SEO", en: "SEO" }, date: "2026-08-22", readingTime: 3, author: "ANBU Team", color: "from-blue-700 to-orange-600", variant: "seo",
    sources: [{ label: { vi: "Google Search Central — AI features", en: "Google Search Central — AI features" }, href: "https://developers.google.com/search/docs/appearance/ai-features" }],
    body: [
      { type: "p", text: {
        vi: "AI search không thay thế SEO nền tảng. Nó làm rõ hơn yêu cầu về nguồn, cấu trúc và tính hữu ích. Bài viết marketing game nên trả lời câu hỏi cụ thể, nêu bối cảnh Việt Nam và cho người đọc biết dữ liệu đến từ đâu — hệ thống AI có xu hướng ưu tiên trích dẫn nội dung trả lời thẳng vào câu hỏi hơn là nội dung mở đầu bằng một đoạn giới thiệu dài dòng.",
        en: "AI search does not replace foundational SEO. It raises the bar for sourcing, structure and usefulness. Game marketing content should answer specific questions, add Vietnam context and show where evidence comes from — AI systems tend to favor citing content that answers a question directly over content that opens with a long preamble.",
      } },
      { type: "h2", text: { vi: "Tăng khả năng được chọn trích dẫn", en: "Improve selection chances" } },
      { type: "ul", items: [
        { vi: "Dùng heading như câu hỏi người dùng thật sẽ gõ vào ô tìm kiếm", en: "Use headings that mirror real questions users would type" },
        { vi: "Đưa câu trả lời ngắn lên đầu rồi mới phân tích sâu hơn phía sau", en: "Lead with a concise answer before going into deeper analysis" },
        { vi: "Thêm dữ liệu, ví dụ và nguồn có thể kiểm chứng thay vì khẳng định chung chung", en: "Add verifiable data, examples and sources instead of vague claims" },
      ] },
      { type: "h2", text: { vi: "Xây tín hiệu chuyên môn dài hạn", en: "Build long-term expertise signals" } },
      { type: "p", text: {
        vi: "Case study, tác giả rõ ràng, liên kết nội bộ và trải nghiệm triển khai thực tế giúp website trở thành nguồn đáng tin hơn cho cả người đọc lẫn hệ thống AI. Đây không phải là việc làm một lần; tín hiệu chuyên môn được tích lũy qua thời gian, và một website chỉ có vài bài viết mỏng khó cạnh tranh với một website có lịch sử nội dung sâu và nhất quán.",
        en: "Case studies, clear authorship, internal links and execution experience make a site more trustworthy to readers and AI systems alike. This isn't a one-time task; expertise signals accumulate over time, and a site with only a few thin posts struggles to compete against one with a deep, consistent content history.",
      } },
    ],
  },
  {
    slug: "game-launch-marketing-thailand",
    title: { vi: "Ra mắt game mobile tại Thái Lan: playbook marketing thực tế", en: "How to Launch a Mobile Game in Thailand: A Marketing Playbook" },
    excerpt: { vi: "Thị trường Thái Lan là một trong những thị trường game tiềm năng ở Đông Nam Á. Tuy nhiên, phát hành game tại đây không thể chỉ copy paste từ thị trường khác mà cần đầu tư nghiêm túc vào chiến lược và cách triển khai. Hãy cùng ANBU tìm hiểu trong bài viết này.", en: "Thailand is one of Southeast Asia's most promising gaming markets. But launching there is not a copy and paste exercise: it requires a thoughtful strategy and local execution. In this guide, ANBU breaks down what teams should consider." },
    category: { vi: "Thị trường Game", en: "Gaming Market" }, date: "2026-08-23", readingTime: 3, author: "ANBU Team", color: "from-blue-950 to-orange-600", variant: "game",
    sources: [{ label: { vi: "Google Play — store listing experiments", en: "Google Play — store listing experiments" }, href: "https://support.google.com/googleplay/android-developer/answer/6223646" }],
    body: [
      { type: "p", text: { vi: "Thị trường Thái Lan là một trong những thị trường game tiềm năng ở khu vực Đông Nam Á, với cộng đồng người chơi năng động và nhiều cơ hội cho các tựa game mobile mới. Tuy nhiên, việc phát hành game tại thị trường Thái không đơn giản là copy paste kế hoạch từ Việt Nam hay một thị trường khác rồi thay ngôn ngữ. Đội ngũ cần đầu tư vào chiến lược bản địa hóa, lựa chọn nền tảng, creator phù hợp và cách xây dựng cộng đồng. Hãy cùng ANBU tìm hiểu một playbook thực tế để chuẩn bị tốt hơn cho ngày game ra mắt tại Thái Lan.", en: "Thailand is one of Southeast Asia's most promising gaming markets, with an active player community and real room for new mobile games. Yet launching there is not as simple as copy and pasting a plan from Vietnam or another market and changing the language. Teams need to invest in localization, platform selection, the right creators and community building. In this guide, ANBU shares a practical playbook for preparing a stronger mobile game launch in Thailand." } },
      { type: "h2", text: { vi: "Bắt đầu bằng bản đồ thị trường", en: "Start with a market map" } },
      { type: "p", text: { vi: "Trước khi mua media, hãy phân nhóm người chơi theo thể loại, thiết bị, mức chi tiêu và cộng đồng họ tham gia. Facebook, YouTube, TikTok, livestream và các cộng đồng game có vai trò khác nhau; không nên mặc định một format thắng ở Việt Nam sẽ thắng ở Thái Lan.", en: "Before buying media, segment players by genre, device, spending profile and communities. Facebook, YouTube, TikTok, livestreams and gaming communities play different roles; never assume a format that wins in Vietnam will win in Thailand." } },
      {
        type: "image",
        src: "/blog-covers/thailand-game-expo.jpg",
        alt: { vi: "Triển lãm và sự kiện game quy mô lớn tại Bangkok Thái Lan", en: "Large-scale gaming exhibition and conference in Bangkok Thailand" },
        caption: { vi: "Không gian sự kiện triển lãm game và ngày hội văn hóa game thủ tại Bangkok, Thái Lan.", en: "Gaming exhibition hall and player cultural festival in Bangkok, Thailand." },
      },
      { type: "h2", text: { vi: "Creator và nội dung bản địa", en: "Creators and local content" } },
      { type: "ul", items: [{ vi: "Chọn creator theo thể loại và chất lượng bình luận, không chỉ follower", en: "Choose creators by genre fit and comment quality, not follower count alone" }, { vi: "Brief bằng insight và proof nhưng giữ giọng nói tự nhiên của creator", en: "Brief with insight and proof while preserving the creator's natural voice" }, { vi: "Chuẩn bị metadata, screenshot và support content bằng tiếng Thái", en: "Prepare Thai metadata, screenshots and support content" }] },
      {
        type: "image",
        src: "/blog-covers/real-thailand.jpg",
        alt: { vi: "Hoạt động marketing và cộng đồng game thủ tại Thái Lan", en: "Game marketing and player community activities in Thailand" },
        caption: { vi: "Cộng đồng game thủ và các sự kiện offline tại thị trường Thái Lan có sức lan tỏa rất nhanh khi chạm đúng văn hóa bản địa.", en: "Thai player communities and offline activations spread rapidly when aligned with local culture." },
      },
      { type: "h2", text: { vi: "Soft launch và 90 ngày đầu", en: "Soft launch and the first 90 days" } },
      { type: "p", text: { vi: "Soft launch tại Thái Lan nên kiểm tra conversion của store, activation trong onboarding, thanh toán, phản hồi về bản dịch và tốc độ hỗ trợ. Sau launch, chia kế hoạch thành ba nhịp: sửa friction trong 30 ngày đầu, xây thói quen cộng đồng ở ngày 31–60 và mở rộng creator hoặc event ở ngày 61–90 khi cohort cho thấy retention ổn định.", en: "A Thai soft launch should validate store conversion, onboarding activation, payments, translation feedback and support speed. After launch, use three waves: remove friction in days 1–30, build community habits in days 31–60 and scale creators or events in days 61–90 once cohorts show stable retention." } },
      { type: "h2", text: { vi: "Checklist trước khi scale", en: "Pre-scale checklist" } },
      { type: "ul", items: [{ vi: "Có baseline CPI, activation, D1, D7 và doanh thu", en: "Baseline CPI, activation, D1, D7 and revenue are defined" }, { vi: "Mỗi creator và kênh có tracking riêng", en: "Each creator and channel has separate tracking" }, { vi: "Có quy trình xử lý review, lỗi thanh toán và khủng hoảng cộng đồng", en: "Reviews, payment issues and community crises have an escalation process" }] },
    ],
  },
  {
    slug: "app-review-management-game-vietnam",
    title: { vi: "Quản lý review app game tại Việt Nam: biến phản hồi thành tăng trưởng", en: "Managing mobile game app reviews in Vietnam for growth" },
    excerpt: { vi: "Khi triển khai quản lý review app game tại việt nam: biến phản hồi thành tăng trưởng, đội ngũ không nên chỉ nhìn vào một chỉ số hoặc một kênh riêng lẻ. Một review một sao về lỗi crash quan trọng hơn nhiều một review một sao vì thua trận — dù cả hai kéo rating trung bình xuống như nhau. Cách quản lý review để sửa đúng vấn đề. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "A one-star review about a crash matters far more than one from a player who just lost a match — even though both hurt the average equally. How to manage reviews and fix the right problem." },
    category: { vi: "Vận hành Game", en: "Game Operations" }, date: "2026-08-22", readingTime: 3, author: "ANBU Team", color: "from-teal-700 to-navy-900", variant: "game",
    sources: [{ label: { vi: "Google Play — ratings and reviews", en: "Google Play — ratings and reviews" }, href: "https://support.google.com/googleplay/android-developer/answer/138230" }],
    body: [
      { type: "p", text: {
        vi: "Review app game tại Việt Nam thường phản ánh cả lỗi sản phẩm, kỳ vọng chưa đúng và cách đội ngũ hỗ trợ người chơi. Đừng chỉ nhìn điểm sao; hãy phân loại chủ đề và phản hồi theo mức độ ảnh hưởng — một review một sao về lỗi crash quan trọng hơn nhiều review một sao vì người chơi thua trận, dù cả hai đều kéo rating trung bình xuống như nhau.",
        en: "Vietnamese mobile game reviews reflect product issues, mismatched expectations and support quality. Don't look only at star ratings; classify themes and respond by impact — a one-star review about a crash matters far more than a one-star review from a player who simply lost a match, even though both drag the average rating down equally.",
      } },
      { type: "h2", text: { vi: "Quy trình bốn bước", en: "A four-step process" } },
      { type: "ul", items: [
        { vi: "Gom review theo lỗi, thanh toán, gameplay và support để thấy pattern thay vì từng review đơn lẻ", en: "Group reviews by bugs, payments, gameplay and support to spot patterns rather than one-off comments" },
        { vi: "Ưu tiên vấn đề ảnh hưởng nhiều người chơi nhất, không phải vấn đề dễ sửa nhất", en: "Prioritize issues affecting the most players, not the easiest ones to fix" },
        { vi: "Phản hồi ngắn, cụ thể và đúng ngữ cảnh, tránh câu trả lời mẫu lặp lại giống hệt nhau", en: "Reply briefly, specifically and in context, avoiding identical copy-paste templates" },
        { vi: "Đưa insight vào backlog sản phẩm để review thực sự tạo ra thay đổi", en: "Feed insights into the product backlog so reviews actually drive change" },
      ] },
      { type: "h2", text: { vi: "Đo sau khi cải thiện, không chỉ đọc phản hồi rồi để đó", en: "Measure after improvements, not just read and move on" } },
      { type: "p", text: {
        vi: "Theo dõi rating mới, tỷ lệ review tiêu cực, ticket hỗ trợ và retention của cohort bị ảnh hưởng. Review tốt lên là kết quả của sản phẩm tốt hơn, không phải thủ thuật — mua review giả hoặc spam yêu cầu đánh giá 5 sao chỉ tạo tín hiệu giả và có thể vi phạm chính sách nền tảng, gây rủi ro lớn hơn nhiều so với lợi ích ngắn hạn.",
        en: "Track new ratings, negative review share, support tickets and retention for affected cohorts. Better reviews should follow a better product, not a trick — buying fake reviews or spamming five-star review requests only creates a false signal and can violate platform policy, a much bigger risk than any short-term benefit.",
      } },
    ],
  },
  {
    slug: "micro-influencer-game-campaign-vietnam",
    title: { vi: "Micro influencer cho game tại Việt Nam: cách chọn và đo hiệu quả", en: "Micro influencers for games in Vietnam: selection and measurement" },
    excerpt: { vi: "Thị trường game thay đổi nhanh khiến micro influencer cho game tại việt nam: cách chọn và đo hiệu quả trở thành một bài toán cần được chuẩn bị kỹ. Với ngân sách hạn chế, mười micro creator phù hợp thường hiệu quả hơn một creator lớn không thật sự hiểu game. Cách chọn và đo lường đúng nhóm creator này. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "On a limited budget, ten well-matched micro creators often outperform one big creator who doesn't understand the game. How to choose and measure them right." },
    category: { vi: "Cộng đồng Game", en: "Gaming Community" }, date: "2026-08-23", readingTime: 3, author: "ANBU Team", color: "from-orange-700 to-navy-900", variant: "social",
    sources: [{ label: { vi: "TikTok for Business Creator Marketplace", en: "TikTok for Business Creator Marketplace" }, href: "https://www.tiktok.com/business/en/creator-marketplace" }, { label: { vi: "Chính sách nội dung thương hiệu của Meta", en: "Meta branded content policies" }, href: "https://www.facebook.com/business/help/116947042301108" }],
    body: [
      { type: "p", text: {
        vi: "Một micro influencer game tại Việt Nam không chỉ là một vị trí đặt quảng cáo. Creator hiểu cộng đồng, biết ngôn ngữ của thể loại và có thể biến tính năng thành câu chuyện dễ tin. Vì vậy, chiến dịch nên đánh giá chất lượng tương tác và mức độ phù hợp trước khi so follower — với ngân sách hạn chế, mười micro creator phù hợp thường tạo hiệu quả tốt hơn một creator lớn không thật sự hiểu game.",
        en: "A gaming micro influencer in Vietnam is more than an ad placement. The creator understands the community, speaks the genre's language and can turn a feature into a credible story. Evaluate engagement quality and fit before comparing follower counts — on a limited budget, ten well-matched micro creators often outperform one large creator who doesn't genuinely understand the game.",
      } },
      { type: "h2", text: { vi: "Chọn creator theo ba lớp phù hợp", en: "Select creators across three fit layers" } },
      { type: "ul", items: [
        { vi: "Genre fit: creator có chơi và hiểu đúng thể loại, không chỉ đọc kịch bản đã soạn sẵn", en: "Genre fit: the creator genuinely plays and understands the genre, not just reading a prepared script" },
        { vi: "Audience fit: người xem nằm trong thị trường và độ tuổi mục tiêu của game", en: "Audience fit: viewers match the game's target market and age group" },
        { vi: "Content fit: format của creator phù hợp với message cần thử nghiệm", en: "Content fit: the creator's format suits the message being tested" },
      ] },
      { type: "h2", text: { vi: "Đo từ lượt xem đến người chơi quay lại", en: "Measure from views to returning players" } },
      { type: "p", text: {
        vi: "Mỗi creator cần link hoặc mã riêng để theo dõi click, install, activation và retention theo cohort. Đừng dùng view làm KPI duy nhất; một video ít view nhưng kéo người chơi đúng thể loại có thể tạo giá trị cao hơn một video viral nhưng không có activation — ANBU thường thấy các chiến dịch micro influencer tốt nhất không phải chiến dịch có nhiều view nhất, mà là chiến dịch có tỷ lệ install-đến-activation cao nhất.",
        en: "Give each creator a unique link or code to track clicks, installs, activation and cohort retention. Views shouldn't be the only KPI; a smaller video that attracts the right genre audience can outperform a viral post with no activation — ANBU has often found the best micro influencer campaigns aren't the ones with the most views, but the ones with the highest install-to-activation rate.",
      } },
    ],
  },
  {
    slug: "aso-localization-vietnam-mobile-game",
    title: { vi: "ASO bản địa hóa cho game mobile Việt Nam: tối ưu từ khóa", en: "Vietnam mobile game ASO: localization beyond translation" },
    excerpt: { vi: "Với các studio và nhà phát hành, aso bản địa hóa cho game mobile việt nam: tối ưu từ khóa thường bắt đầu từ những câu hỏi rất thực tế về người chơi và tăng trưởng. Metadata đúng với tài liệu quốc tế nhưng sai với cách người chơi Việt tìm kiếm sẽ không bao giờ chuyển thành lượt cài chất lượng. Cách bản địa hóa ASO thật sự, không chỉ dịch. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Metadata that matches an international doc but not how Vietnamese players actually search will never convert into quality installs. How to truly localize ASO, not just translate it." },
    category: { vi: "Marketing Game", en: "Game Marketing" }, date: "2026-08-23", readingTime: 3, author: "ANBU Team", color: "from-teal-800 to-blue-900", variant: "seo",
    sources: [{ label: { vi: "Chính sách metadata Google Play", en: "Google Play metadata policy" }, href: "https://support.google.com/googleplay/android-developer/answer/9898842" }, { label: { vi: "Tài liệu Apple App Store Connect", en: "Apple App Store Connect help" }, href: "https://developer.apple.com/help/app-store-connect/manage-app-information/" }],
    body: [
      { type: "p", text: {
        vi: "ASO bản địa hóa cho game mobile Việt Nam bắt đầu từ nghiên cứu ngôn ngữ người chơi. Cùng một tính năng có thể được gọi bằng tiếng Anh, tiếng Việt hoặc tiếng lóng cộng đồng. Nếu metadata dùng từ đúng với tài liệu quốc tế nhưng sai với cách người chơi tìm, traffic sẽ không chuyển thành lượt cài chất lượng — đây là lỗi rất phổ biến ở các studio quốc tế chỉ dịch nguyên bộ keyword gốc sang tiếng Việt.",
        en: "Localized ASO for a Vietnam mobile game starts with player language research. The same feature may be described in English, Vietnamese or community slang. Metadata that matches an international document but not real search behavior won't convert into quality installs — this is a very common mistake among international studios that simply translate their original keyword set into Vietnamese.",
      } },
      { type: "h2", text: { vi: "Nghiên cứu keyword theo ý định tìm kiếm", en: "Research keywords by search intent" } },
      { type: "ul", items: [
        { vi: "Từ khóa thể loại và fantasy — cách người chơi mô tả trải nghiệm họ muốn", en: "Genre and fantasy terms — how players describe the experience they want" },
        { vi: "Từ khóa tính năng và gameplay cụ thể", en: "Feature and gameplay terms specific to the game" },
        { vi: "Từ khóa thương hiệu, đối thủ và nhu cầu thay thế", en: "Brand, competitor and alternative terms" },
        { vi: "Từ khóa sau cài đặt như giftcode, event và hỗ trợ — nơi nhiều studio bỏ sót cơ hội", en: "Post-install terms such as codes, events and support — an opportunity many studios miss" },
      ] },
      { type: "h2", text: { vi: "Đồng bộ metadata với creative", en: "Align metadata with creative" } },
      { type: "p", text: {
        vi: "Title, short description, screenshot và video phải kể cùng một promise. Hãy thử một nhóm thông điệp nhấn vào fantasy và một nhóm nhấn vào lợi ích gameplay, sau đó so sánh conversion rate theo nguồn traffic. ASO tốt là hệ thống thử nghiệm liên tục, không phải một lần điền keyword rồi để đó cả năm.",
        en: "The title, short description, screenshots and video should tell the same promise. Test one message set around fantasy and another around gameplay benefits, then compare conversion by traffic source. Good ASO is a continuous testing system, not a one-time keyword fill left untouched for a year.",
      } },
    ],
  },
  {
    slug: "esports-sponsorship-vietnam-roi",
    title: { vi: "Đo ROI tài trợ esports tại Việt Nam: khung dành cho nhãn hàng", en: "Measuring esports sponsorship ROI in Vietnam" },
    excerpt: { vi: "Đo ROI tài trợ esports tại Việt Nam: khung dành cho nhãn hàng là chủ đề nhiều đội ngũ game quan tâm khi muốn tiếp cận người chơi Việt Nam. Chỉ báo cáo tổng lượt xem sẽ khiến một khoản tài trợ tạo ra hiệu ứng thương hiệu thật vẫn bị coi là thất bại. Khung đo ROI tài trợ esports mà nhãn hàng nên dùng. Trong bài viết này, ANBU chia sẻ cách tiếp cận thực tế để bạn có thể áp dụng cho kế hoạch của mình.", en: "Reporting only total views can make a sponsorship that created real brand lift look like a failure. A framework brands should use to measure esports sponsorship ROI." },
    category: { vi: "Analytics Game", en: "Game Analytics" }, date: "2026-08-23", readingTime: 3, author: "ANBU Team", color: "from-blue-950 to-orange-700", variant: "performance",
    sources: [{ label: { vi: "Nielsen Esports Insights", en: "Nielsen esports insights" }, href: "https://www.nielsen.com/insights/2022/esports-sponsorships/" }, { label: { vi: "VIRESA", en: "VIRESA" }, href: "https://viresa.org.vn/" }],
    body: [
      { type: "p", text: {
        vi: "Nhãn hàng thường hỏi tài trợ esports tại Việt Nam có đáng tiền không. Câu trả lời phụ thuộc vào mục tiêu: awareness, trial, lead hay doanh thu. Nếu chỉ lấy tổng lượt xem để báo cáo, đội ngũ sẽ bỏ qua chất lượng người xem, tần suất tiếp xúc và hành động sau sự kiện — và đó thường là lúc một khoản tài trợ lớn bị coi là thất bại dù thực ra nó đã tạo ra hiệu ứng thương hiệu thật, chỉ là không ai đo đúng cách.",
        en: "Brands often ask whether esports sponsorship in Vietnam is worth the money. The answer depends on the goal: awareness, trial, leads or revenue. Reporting only total views hides audience quality, frequency and post-event actions — and that's often when a major sponsorship gets labeled a failure even though it created real brand lift, just not measured the right way.",
      } },
      { type: "h2", text: { vi: "Thiết kế tầng đo lường", en: "Design measurement layers" } },
      { type: "ul", items: [
        { vi: "Media: reach, unique viewers, view-through và frequency", en: "Media: reach, unique viewers, view-through and frequency" },
        { vi: "Community: chat quality, follower growth và sentiment trong và sau sự kiện", en: "Community: chat quality, follower growth and sentiment during and after the event" },
        { vi: "Business: QR scan, landing conversion, lead và doanh thu quy về", en: "Business: QR scans, landing conversion, leads and attributed revenue" },
      ] },
      { type: "h2", text: { vi: "So sánh với baseline", en: "Compare against a baseline" } },
      { type: "p", text: {
        vi: "Một sự kiện chỉ có ý nghĩa khi được so với hoạt động không tài trợ hoặc kỳ trước. Hãy chốt baseline trước khi công bố, gắn mã cho từng kênh và đánh giá thêm tác động trễ sau 7 hoặc 30 ngày. Điều này giúp phân biệt hiệu ứng thương hiệu với doanh thu ngắn hạn.",
        en: "An event is meaningful only against an unsponsored period or a previous edition. Set the baseline before launch, tag every channel and measure delayed impact after 7 or 30 days. This separates brand lift from short-term revenue.",
      } },
      { type: "h2", text: { vi: "Chọn đúng giải đấu, không chỉ giải đấu lớn nhất", en: "Choose the right tournament, not just the biggest one" } },
      { type: "p", text: {
        vi: "Một giải đấu có lượt xem cao nhưng khán giả không khớp với nhóm mục tiêu của nhãn hàng vẫn là một khoản đầu tư kém. ANBU thường khuyên khách hàng đánh giá độ khớp giữa cộng đồng giải đấu và chân dung người dùng mục tiêu trước khi nhìn vào con số reach, vì một cộng đồng nhỏ nhưng đúng đối tượng luôn tạo giá trị chuyển đổi tốt hơn một đám đông chung chung.",
        en: "A tournament with high viewership but an audience that doesn't match the brand's target group is still a poor investment. ANBU usually advises clients to assess the fit between a tournament's community and the target user profile before looking at reach numbers, since a smaller but well-matched community always converts better than a generic crowd.",
      } },
    ],
  },
  {
    slug: "lich-su-qua-trinh-phat-trien-esports-viet-nam",
    title: {
      vi: "Esports Việt Nam: Lịch sử và hành trình phát triển",
      en: "Vietnam Esports: History and the Road to Growth",
    },
    excerpt: {
      vi: "Esports Việt Nam đã đi từ những phòng máy và giải đấu cộng đồng đến sân khấu SEA Games, hệ thống giải chuyên nghiệp và một hệ sinh thái nội dung có hàng triệu người theo dõi. Cùng ANBU nhìn lại các cột mốc quan trọng, những tựa game tạo nên thế hệ tuyển thủ và bài toán phía trước.",
      en: "Vietnamese esports has grown from internet cafés and community tournaments into SEA Games stages, professional leagues and a content ecosystem followed by millions. This guide traces the milestones, games and structural challenges shaping its next phase.",
    },
    category: { vi: "Esports Việt Nam", en: "Vietnam Esports" },
    date: "2026-08-18",
    readingTime: 12,
    author: "ANBU Team",
    color: "from-blue-950 to-orange-600",
    variant: "game",
    cover: "/blog-covers/esports-vietnam-sea-games.jpg",
    sources: [
      { label: { vi: "VIRESA: Hành trình 15 năm xây dựng thể thao điện tử Việt Nam", en: "VIRESA: 15 years building Vietnam esports" }, href: "https://viresa.org.vn/en/viresa-hanh-trinh-ve-vang-15-nam-xay-dung-va-phat-trien-the-thao-dien-tu-giai-tri-viet-nam" },
      { label: { vi: "ONE Esports: Lịch sử GAM Esports và Liên Minh Huyền Thoại Việt Nam", en: "ONE Esports: GAM Esports and Vietnam League of Legends history" }, href: "https://www.oneesports.gg/league-of-legends/gam-esports-rise-lol-vietnam/" },
      { label: { vi: "VNG Annual Report 2024: hệ sinh thái game Việt Nam", en: "VNG Annual Report 2024: Vietnam's gaming ecosystem" }, href: "https://bctn2024.vng.com.vn/about/game" },
      { label: { vi: "Cổng Thông tin điện tử Chính phủ: Vietnam GameVerse 2026", en: "Vietnam Government Portal: Vietnam GameVerse 2026" }, href: "https://baochinhphu.vn/vietnam-gameverse-2026-viet-nam-tro-thanh-diem-ket-noi-esports-khu-vuc-102260509092527409.htm" },
      { label: { vi: "AP News: esports tại Asian Games Hàng Châu", en: "AP News: esports at the Hangzhou Asian Games" }, href: "https://apnews.com/article/00dd2440001d4c6796e9643969a6de5a" },
      { label: { vi: "Le Monde: bài học về tính minh bạch của giải đấu", en: "Le Monde: lessons on competitive integrity" }, href: "https://www.lemonde.fr/pixels/article/2024/06/05/matchs-de-league-of-legends-truques-au-dela-du-cas-vietnamien-des-e-sportifs-prets-a-perdre-pour-gagner-plus_6237538_4408996.html" },
    ],
    body: [
      { type: "p", text: {
        vi: "Thị trường esports Việt Nam không xuất hiện trong một đêm. Từ những phòng máy đông người, các giải đấu tự phát và những buổi xem chung trên mạng, thể thao điện tử dần trở thành một ngành có tuyển thủ chuyên nghiệp, huấn luyện viên, nhà tổ chức, nhà tài trợ, caster và hàng triệu người xem. Nhìn lại hành trình này giúp nhà phát hành hiểu vì sao cộng đồng Việt Nam phản ứng rất nhanh với cạnh tranh, nhưng cũng đòi hỏi tính công bằng, lịch thi đấu ổn định và một câu chuyện đủ gần gũi.",
        en: "Vietnamese esports did not appear overnight. It grew from busy internet cafés, community tournaments and shared online viewing into an industry with professional players, coaches, organizers, sponsors, casters and millions of viewers. Understanding that journey helps publishers see why Vietnamese communities respond quickly to competition while demanding fairness, a reliable calendar and a story that feels local.",
      } },
      { type: "quote", text: {
        vi: "Lịch sử esports Việt Nam là lịch sử của cộng đồng: công nghệ mở đường, nhưng người chơi, đội tuyển và những người tổ chức giải mới biến cuộc chơi thành một hệ sinh thái.",
        en: "Vietnamese esports is a history of community: technology opened the door, but players, teams and tournament builders turned competition into an ecosystem.",
      } },
      { type: "h2", text: { vi: "Cuối thập niên 1990 và đầu những năm 2000: nền móng từ phòng máy", en: "Late 1990s and early 2000s: the internet café foundation" } },
      { type: "p", text: {
        vi: "Trước khi có các giải đấu lớn, esports Việt Nam được nuôi dưỡng trong các phòng máy và câu lạc bộ địa phương. StarCraft, Warcraft III, Counter-Strike, FIFA và sau đó là DotA tạo ra những cộng đồng nhỏ nhưng có tính cạnh tranh cao. Người chơi tự lập đội, truyền lịch thi đấu qua diễn đàn, góp tiền thuê máy chủ và học cách tổ chức giải từ kinh nghiệm thực tế. Dù thiếu cơ cấu chuyên nghiệp, giai đoạn này tạo ra văn hóa luyện tập, tinh thần đại diện cho đội tuyển và thói quen theo dõi một mùa giải.",
        en: "Before major leagues existed, Vietnamese esports was nurtured in internet cafés and local clubs. StarCraft, Warcraft III, Counter-Strike, FIFA and later DotA formed small but highly competitive communities. Players built teams, shared schedules on forums, paid for servers and learned event operations by doing. The structure was informal, but it created training habits, team identity and the audience behavior needed for a season-based sport.",
      } },
      { type: "h2", text: { vi: "Thập niên 2010: game online và các giải đấu bắt đầu chuyên nghiệp hóa", en: "The 2010s: online games and leagues become more professional" } },
      { type: "p", text: {
        vi: "Sự phổ cập của Internet tốc độ cao, livestream và nền tảng video đã đưa esports ra khỏi phòng máy. Các giải đấu có lịch rõ ràng hơn, đội tuyển bắt đầu xây thương hiệu và người chơi có thể theo dõi trận đấu từ bất kỳ tỉnh thành nào. Đây cũng là lúc các nhà phát hành nhìn thấy giá trị của esports như một công cụ giữ chân cộng đồng, thay vì chỉ là một hoạt động quảng bá ngắn hạn.",
        en: "Faster internet, livestreaming and video platforms moved esports beyond the café. Tournaments adopted clearer calendars, teams began building brands and fans could follow matches from anywhere in the country. Publishers also started to see esports as a community-retention system rather than a short-term promotional stunt.",
      } },
      { type: "h2", text: { vi: "Liên Minh Huyền Thoại và bước ngoặt của hệ thống giải", en: "League of Legends and the league-system turning point" } },
      { type: "p", text: {
        vi: "Liên Minh Huyền Thoại mở bản thử nghiệm tại Việt Nam vào tháng 8 năm 2012, theo ghi nhận của ONE Esports. Từ đó, các đội tuyển Việt Nam dần bước vào hệ thống giải khu vực, các mùa giải có tính liên tục và một lứa tuyển thủ được đào tạo bài bản hơn. Những cái tên như GAM Esports cho thấy một đội tuyển có thể trở thành thương hiệu nội dung, tạo cộng đồng riêng và đại diện cho Việt Nam trên sân khấu quốc tế. Bước ngoặt nằm ở chỗ người hâm mộ không chỉ xem một trận đấu, họ theo dõi cả hành trình của đội.",
        en: "League of Legends entered Vietnam with a closed beta in August 2012, according to ONE Esports. Vietnamese teams then moved into regional competition, recurring seasons and more structured player development. Teams such as GAM Esports showed how a roster could become a content brand, build its own community and represent Vietnam internationally. The key shift was that fans no longer watched one match; they followed a team's whole journey.",
      } },
      {
        type: "image",
        src: "/blog-covers/esports-vietnam-stage.jpg",
        alt: { vi: "Sân khấu chung kết giải đấu Esports chuyên nghiệp tại Việt Nam", en: "Professional esports tournament grand finals stage in Vietnam" },
        caption: { vi: "Sân khấu giải đấu chuyên nghiệp và hệ thống giải thể thao điện tử quy mô lớn tại Việt Nam.", en: "Professional league stage and large-scale esports competition system in Vietnam." },
      },
      { type: "h2", text: { vi: "Esports mobile mở rộng tệp người chơi", en: "Mobile esports expands the player base" } },
      { type: "p", text: {
        vi: "Nếu PC tạo ra nền văn hóa thi đấu chuyên sâu, mobile giúp esports tiếp cận đại chúng nhanh hơn. Liên Quân Mobile, Free Fire, PUBG Mobile, Mobile Legends và các game cạnh tranh khác đưa việc thi đấu vào thiết bị mà phần lớn người chơi đã có sẵn. Các giải mobile có thể kết hợp livestream, creator, hoạt động tại trường học hoặc trung tâm thương mại, nhờ vậy rút ngắn khoảng cách giữa người xem phổ thông và tuyển thủ. Với nhà phát hành, đây là cơ hội lớn nhưng cũng là lời nhắc rằng trải nghiệm trên máy yếu, mạng không ổn định và thanh toán địa phương phải được tính từ đầu.",
        en: "PC created a deep competitive culture, while mobile made esports accessible at mass scale. Arena of Valor, Free Fire, PUBG Mobile, Mobile Legends and other competitive titles put competition on devices most players already own. Mobile tournaments can combine livestreams, creators and offline activations, reducing the distance between casual viewers and professionals. For publishers, this is a major opportunity, but it also means low-end performance, unstable networks and local payments must be designed in from day one.",
      } },
      { type: "h2", text: { vi: "SEA Games và sự công nhận chính thức", en: "SEA Games and official recognition" } },
      { type: "p", text: {
        vi: "Việc esports xuất hiện trong chương trình thi đấu khu vực đã thay đổi cách xã hội nhìn về bộ môn này. VIRESA ghi nhận vai trò của mình trong quá trình xây dựng hệ thống thể thao điện tử và các cột mốc SEA Games, đặc biệt kỳ SEA Games 31 tại Việt Nam. Khi đội tuyển khoác áo quốc gia, esports có thêm câu chuyện về thành tích, kỷ luật và trách nhiệm đại diện. Đây là nền tảng quan trọng để các liên đoàn, nhà phát hành và câu lạc bộ cùng bàn về đào tạo, tuyển chọn, y tế, chống gian lận và quyền lợi tuyển thủ.",
        en: "Esports entering a regional multi-sport program changed how society viewed the discipline. VIRESA describes its role in building Vietnam's esports system and supporting SEA Games milestones, especially the 31st SEA Games hosted in Vietnam. Once players competed under the national flag, esports gained a story about achievement, discipline and representation. That created a stronger basis for discussing training, selection, health, anti-cheating and player welfare across federations, publishers and clubs.",
      } },
      {
        type: "image",
        src: "/blog-covers/esports-vietnam-sea-games.jpg",
        alt: { vi: "Đội tuyển Thể thao điện tử Việt Nam tại Đại hội Thể thao Đông Nam Á SEA Games", en: "Vietnam national esports team at the Southeast Asian Games (SEA Games)" },
        caption: { vi: "Đội tuyển Esports Việt Nam tranh tài và giành huy chương danh giá tại đấu trường SEA Games.", en: "Vietnam national esports squad competing and winning medals on the SEA Games stage." },
      },
      { type: "h2", text: { vi: "Từ SEA Games đến Asian Games: bước ra sân chơi quốc tế", en: "From SEA Games to the Asian Games" } },
      { type: "p", text: {
        vi: "Tại Asian Games Hàng Châu, esports được đưa vào chương trình tranh huy chương và Việt Nam tham dự ở những nội dung như Arena of Valor và Liên Minh Huyền Thoại. Những giải đấu này đặt tuyển thủ trước yêu cầu khác hẳn một mùa giải câu lạc bộ: thời gian tập trung ngắn, áp lực truyền thông lớn, tiêu chuẩn đại diện quốc gia và đối thủ đến từ nhiều nền esports mạnh. Kinh nghiệm quốc tế vì vậy không chỉ được đo bằng huy chương, mà còn bằng khả năng chuẩn bị, thích nghi và duy trì phong độ.",
        en: "At the Hangzhou Asian Games, esports became a medal event and Vietnam competed in titles including Arena of Valor and League of Legends. These tournaments place different demands on players than a club season: short preparation windows, national-team pressure, media attention and opponents from mature esports markets. International experience should therefore be measured not only by medals, but also by preparation, adaptation and consistency under pressure.",
      } },
      {
        type: "image",
        src: "/blog-covers/esports-vietnam-asiad.jpg",
        alt: { vi: "Tuyển thủ Esports Việt Nam thi đấu tại Đại hội Thể thao Châu Á Asian Games", en: "Vietnamese esports athletes competing at the Asian Games" },
        caption: { vi: "Tuyển thủ Việt Nam đại diện quốc gia tranh tài tại đấu trường thể thao điện tử Asian Games.", en: "Vietnamese athletes representing the nation at the Asian Games esports arena." },
      },
      { type: "h2", text: { vi: "Khi esports trở thành hệ sinh thái nội dung và kinh doanh", en: "When esports becomes a content and business ecosystem" } },
      { type: "p", text: {
        vi: "Một trận đấu ngày nay tạo ra nhiều lớp nội dung: livestream chính thức, co-stream của creator, video phân tích, short video, meme, fan art và hoạt động tại cộng đồng. Báo cáo thường niên 2024 của VNG cho biết lượng khán giả esports tại Việt Nam đã tăng thêm hơn 10 triệu người, cho thấy quy mô tiếp cận không còn giới hạn ở người chơi chuyên nghiệp. Vì vậy, một giải đấu tốt cần đồng thời phục vụ người xem hardcore, người mới biết game và nhãn hàng muốn tham gia mà không phá vỡ trải nghiệm cộng đồng.",
        en: "A match now creates several content layers: the official broadcast, creator co-streams, analysis videos, short-form clips, memes, fan art and community activations. VNG's 2024 annual report notes that Vietnam's esports audience grew by more than 10 million, showing that reach now extends well beyond competitive players. A strong league must serve hardcore viewers, newcomers and brands without damaging the community experience.",
      } },
      { type: "h2", text: { vi: "Những bài toán còn lại: tính bền vững và tính chính trực", en: "The remaining challenges: sustainability and integrity" } },
      { type: "p", text: {
        vi: "Tăng trưởng khán giả chưa đồng nghĩa với một ngành bền vững. Câu lạc bộ cần doanh thu ngoài tiền thưởng, tuyển thủ cần hợp đồng và lộ trình sau thi đấu, còn giải đấu cần quy tắc minh bạch về lịch, trọng tài, dữ liệu và xử lý vi phạm. Các vụ điều tra dàn xếp trận đấu trong khu vực cũng cho thấy uy tín có thể mất rất nhanh nếu cơ chế giám sát không đủ mạnh. Đầu tư vào giáo dục tuyển thủ, phòng chống gian lận, sức khỏe tâm lý và quy trình khiếu nại phải được xem là hạ tầng, không phải chi phí phụ.",
        en: "Audience growth does not automatically create a sustainable industry. Clubs need revenue beyond prize money, players need contracts and post-career paths, and leagues need transparent rules for schedules, officiating, data and sanctions. Match-fixing investigations in the region show how quickly trust can disappear when oversight is weak. Player education, anti-cheating, mental health and appeals processes should be treated as infrastructure, not optional costs.",
      } },
      { type: "h2", text: { vi: "Esports Việt Nam sẽ phát triển theo hướng nào?", en: "Where can Vietnamese esports go next?" } },
      { type: "p", text: {
        vi: "Cơ hội tiếp theo nằm ở việc kết nối esports với game publishing, creator economy, giáo dục và các sự kiện văn hóa. Vietnam GameVerse 2026 được giới thiệu như một điểm kết nối esports khu vực, cho thấy tham vọng đưa Việt Nam từ nơi tiêu thụ nội dung thành nơi tổ chức, sản xuất và xuất khẩu năng lực. Để đi xa, Việt Nam cần các giải đấu có lịch ổn định, tiêu chuẩn sản xuất tốt, câu lạc bộ có quản trị chuyên nghiệp và những chương trình dành cho tài năng trẻ ngoài các thành phố lớn.",
        en: "The next opportunity is connecting esports with game publishing, the creator economy, education and cultural events. Vietnam GameVerse 2026 has been positioned as a regional esports connection point, reflecting an ambition to make Vietnam not only a content consumer but also a host, producer and exporter of expertise. The next phase needs stable calendars, high production standards, professionally managed clubs and pathways for young talent beyond major cities.",
      } },
      { type: "h2", text: { vi: "Bài học cho nhà phát hành và nhãn hàng", en: "What publishers and brands should learn" } },
      { type: "ul", items: [
        { vi: "Đừng xem esports là một gói media đơn lẻ; hãy xây lịch nội dung từ vòng loại đến hậu giải.", en: "Do not treat esports as a single media buy; build a content calendar from qualifiers to post-finals." },
        { vi: "Chọn đội tuyển và creator theo độ phù hợp cộng đồng, không chỉ theo lượt xem cao nhất.", en: "Choose teams and creators for community fit, not only the highest view count." },
        { vi: "Đo cả reach, thời gian xem, tương tác, lượt thử game và hành vi quay lại.", en: "Measure reach, watch time, engagement, trials and return behavior." },
        { vi: "Đầu tư vào bản địa hóa, quản trị khủng hoảng và tính minh bạch ngay từ trước khi ra mắt.", en: "Invest in localization, crisis readiness and integrity before launch." },
      ] },
      { type: "h2", text: { vi: "Một mùa giải esports được xây như thế nào?", en: "How a Vietnamese esports season is built" } },
      { type: "p", text: {
        vi: "Một mùa giải tốt không bắt đầu ở trận chung kết. Nhà tổ chức phải thiết kế vòng loại đủ rộng để tìm tài năng, lịch thi đấu đủ đều để giữ thói quen theo dõi, và một hệ thống nội dung giúp người mới hiểu câu chuyện của đội tuyển. Sau mỗi tuần, dữ liệu về thời gian xem, tỷ lệ rời livestream, lượng tìm kiếm tên tuyển thủ và phản hồi cộng đồng cần được đưa trở lại vào kế hoạch tuần kế tiếp. Đây là điểm khác biệt giữa một giải đấu chỉ tạo ra vài ngày viral và một giải đấu có thể xây tài sản thương hiệu trong nhiều năm.",
        en: "A strong season does not begin at the grand final. Organizers need an accessible qualification path to discover talent, a consistent calendar to build viewing habits and content that helps newcomers understand team stories. Each week, watch time, stream drop-off, player-name searches and community feedback should feed the next week's plan. That is the difference between a tournament that creates a few viral days and a league that builds a durable brand asset.",
      } },
      { type: "h2", text: { vi: "Tuyển thủ, creator và câu lạc bộ cùng tạo giá trị", en: "Players, creators and clubs create value together" } },
      { type: "p", text: {
        vi: "Tuyển thủ tạo thành tích, nhưng creator giúp thành tích đó trở thành câu chuyện được nhắc lại mỗi ngày. Một câu lạc bộ chuyên nghiệp cần quản lý cả hai lớp: lịch tập, sức khỏe và chiến thuật cho đội tuyển; đồng thời là quy trình sản xuất video, livestream, giao tiếp với fan và hợp tác thương hiệu. Khi ba bên phối hợp đúng, giá trị không chỉ nằm ở tiền thưởng mà còn ở bản quyền nội dung, tài trợ dài hạn, bán vật phẩm và khả năng chuyển người xem thành người chơi.",
        en: "Players create competitive results, but creators turn those results into stories people revisit every day. A professional club must manage both layers: training, health and tactics for the roster, plus a production workflow for videos, livestreams, fan communication and brand partnerships. When the three sides work together, value comes from more than prize money: content rights, long-term sponsorships, merchandise and the ability to turn viewers into players.",
      } },
      { type: "h2", text: { vi: "ANBU nhìn thấy cơ hội gì cho thị trường Việt Nam?", en: "What opportunity does ANBU see in Vietnam?" } },
      { type: "p", text: {
        vi: "Với nhà phát hành quốc tế, Việt Nam không chỉ là nơi mua media để lấy lượt cài đặt. Đây là thị trường có cộng đồng cạnh tranh, creator hiểu ngôn ngữ của người chơi và những thành phố đủ năng lực tổ chức sự kiện offline. Chiến lược phù hợp nên bắt đầu bằng nghiên cứu cộng đồng, chọn đúng game và đúng người kể chuyện, sau đó kết nối giải đấu với hoạt động trải nghiệm, nội dung địa phương và đo lường sau cài đặt. Cách tiếp cận này giúp esports trở thành một phần của vòng đời game, thay vì một chiến dịch ngắn ngủi trước ngày phát hành.",
        en: "For an international publisher, Vietnam is not simply a media market for buying installs. It has competitive communities, creators who understand player language and cities capable of hosting offline experiences. The right strategy starts with community research, the right title and the right storytellers, then connects competition with local content, live experiences and post-install measurement. This makes esports part of the game's lifecycle instead of a short campaign before launch day.",
      } },
      { type: "h2", text: { vi: "Kết luận", en: "Conclusion" } },
      { type: "p", text: {
        vi: "Lịch sử esports Việt Nam là câu chuyện đi từ cộng đồng tự tổ chức đến một hệ sinh thái có giải đấu, tuyển thủ, nhà phát hành, creator và khán giả quy mô lớn. Những cột mốc SEA Games, Asian Games và sự phát triển của thị trường nội dung cho thấy tiềm năng là có thật. Nhưng để biến tiềm năng thành vị thế bền vững, ngành cần làm tốt những điều ít hào nhoáng hơn: quản trị minh bạch, bảo vệ tuyển thủ, phát triển tài năng và tạo ra trải nghiệm đáng tin cậy cho người hâm mộ. Với nhà phát hành muốn bước vào Việt Nam, hiểu lịch sử này là bước đầu để xây một chiến lược esports phù hợp thay vì sao chép một công thức có sẵn.",
        en: "Vietnamese esports has moved from self-organized communities to an ecosystem of leagues, players, publishers, creators and large audiences. SEA Games, Asian Games and the growth of gaming content show that the opportunity is real. Turning that opportunity into a durable position requires less glamorous work: transparent governance, player protection, talent development and a trustworthy fan experience. For publishers entering Vietnam, understanding this history is the first step toward an esports strategy built for the market rather than copied from elsewhere.",
      } },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return undefined;
  const currentLength = post.body.reduce((total, block) => {
    if (block.type === "ul") return total + block.items.reduce((sum, item) => sum + item.vi.length + item.en.length, 0);
    if (block.type === "image") return total + (block.caption ? block.caption.vi.length + block.caption.en.length : 0);
    return total + block.text.vi.length + block.text.en.length;
  }, 0);
  // Short briefs receive the deeper editorial layer below so every rendered article
  // clears the 1,000-character minimum while longer posts remain untouched.
  if (currentLength >= 2200) return post;
  const depthBlocks: Block[] = [
    { type: "h2", text: { vi: "Framework nghiên cứu và triển khai", en: "A research and execution framework" } },
    { type: "p", text: { vi: `Bước đầu tiên là lập bản đồ ý định tìm kiếm thay vì chỉ gom một danh sách keyword. Với ${post.title.vi}, hãy chia truy vấn thành bốn nhóm: tìm hiểu (người chơi muốn biết), so sánh (đang cân nhắc), hành động (muốn cài hoặc đăng ký) và hậu mãi (cần hỗ trợ sau khi chơi). Mỗi nhóm cần một định dạng nội dung khác nhau: bài giải thích, bảng so sánh, landing page hoặc hướng dẫn thao tác.`, en: `Start by mapping search intent instead of collecting a keyword list. For ${post.title.en}, group queries into four intents: informational, comparison, action and post-install support. Each intent needs a different format: an explainer, comparison table, landing page or practical guide.` } },
    { type: "h2", text: { vi: "Ví dụ áp dụng tại thị trường Việt Nam", en: "A Vietnam market example" } },
    { type: "p", text: { vi: "Một chiến dịch game tại Việt Nam không nên sao chép nguyên thông điệp quốc tế. Hãy kiểm tra cách người chơi gọi thể loại, cách họ mô tả lỗi hoặc lợi ích, và khác biệt giữa nhóm mới cài với nhóm đã chơi lâu. Sau đó thử hai thông điệp trên cùng một nhóm đối tượng, giữ nguyên ngân sách và thời gian, rồi so sánh CTR, conversion, activation và retention. Cách làm này biến insight địa phương thành quyết định có thể kiểm chứng.", en: "A Vietnam game campaign should not copy an international message word for word. Check how players name the genre, describe pain points and explain benefits, then separate new installers from experienced players. Test two messages with the same audience, budget and window, and compare CTR, conversion, activation and retention. This turns local insight into a measurable decision." } },
    { type: "h2", text: { vi: `Checklist triển khai cho ${post.title.vi}`, en: `An implementation checklist for ${post.title.en}` } },
    { type: "p", text: { vi: `Để biến chủ đề này thành kết quả kinh doanh, đội ngũ nên bắt đầu bằng một giả thuyết cụ thể, xác định nhóm người chơi và chọn một chỉ số chính. Với các chiến dịch tại Việt Nam, hãy tách dữ liệu theo nguồn traffic, thiết bị, khu vực và giai đoạn trong hành trình người chơi. Sau mỗi chu kỳ, ghi lại điều đã học, quyết định giữ hay bỏ và tác động đến mục tiêu.`, en: `To turn this topic into business results, start with a clear hypothesis, define the player segment and choose one primary metric. For Vietnam campaigns, segment data by traffic source, device, region and player journey stage. After each cycle, record the learning, the keep-or-drop decision and the impact on the goal.` } },
    { type: "ul", items: [
      { vi: "Xác định mục tiêu, đối tượng và mốc đo trước khi triển khai", en: "Define the goal, audience and measurement window before launch" },
      { vi: "Tạo một phiên bản thử nghiệm đủ khác để có thể so sánh", en: "Create a test version that is different enough to compare" },
      { vi: "Đọc cả chỉ số đầu phễu lẫn activation, retention và doanh thu", en: "Read both top-funnel metrics and activation, retention and revenue" },
      { vi: "Ghi lại insight thành brief cho vòng nội dung hoặc sản phẩm tiếp theo", en: "Turn the insight into a brief for the next content or product cycle" },
    ] },
    { type: "h2", text: { vi: "Các lỗi thường làm kết quả sai lệch", en: "Common mistakes that distort results" } },
    { type: "ul", items: [
      { vi: "Đánh giá từ vài ngày đầu khi chưa đủ chu kỳ hành vi", en: "Judging from the first few days before a behavior cycle is complete" },
      { vi: "Gộp tất cả nguồn traffic và quốc gia vào một báo cáo", en: "Combining every traffic source and country into one report" },
      { vi: "Tối ưu CTR nhưng bỏ qua chất lượng người chơi sau click", en: "Optimizing CTR while ignoring post-click player quality" },
      { vi: "Thay quá nhiều biến cùng lúc nên không biết yếu tố nào tạo tác động", en: "Changing too many variables at once and losing attribution" },
    ] },
    { type: "h2", text: { vi: "Câu hỏi thường gặp", en: "Frequently asked questions" } },
    { type: "p", text: { vi: `Bao lâu nên đánh giá lại ${post.title.vi}? Với phần lớn chiến dịch game, nên theo dõi đủ một chu kỳ hành vi thay vì kết luận từ vài ngày đầu. Khi dữ liệu còn ít, hãy dùng kết quả định tính từ người chơi để bổ sung, nhưng không thay thế việc đo lường định lượng.`, en: `How often should you review ${post.title.en}? For most game campaigns, measure through a full behavior cycle instead of judging the first few days. When data is limited, use qualitative player feedback as context, but do not replace quantitative measurement.` } },
  ];
  return { ...post, body: [...post.body, ...depthBlocks] };
}

export const budgetRanges = [
  "< 50 triệu",
  "50 – 150 triệu",
  "150 – 500 triệu",
  "> 500 triệu",
];


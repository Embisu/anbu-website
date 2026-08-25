import type { L10n } from "./site";

export type Service = {
  slug: string;
  icon: string; // key used by Icon component
  title: L10n;
  tagline: L10n;
  description: L10n;
  features: L10n[];
  deliverables: L10n[];
};

export const services: Service[] = [
  {
    slug: "influencer-marketing",
    icon: "star",
    title: { vi: "Influencer & KOL/KOC Marketing", en: "Influencer & KOL/KOC Marketing" },
    tagline: {
      vi: "Đúng người, đúng insight, đúng thời điểm.",
      en: "The right people, the right insight, the right moment.",
    },
    description: {
      vi: "Chúng tôi lên chiến lược, tuyển chọn và vận hành KOL/KOC/influencer cho các chiến dịch trong nước và quốc tế, từ xây dựng ý tưởng, kịch bản đến quản lý và đo lường hiệu quả từng đồng ngân sách.",
      en: "We plan, cast and run KOL/KOC/influencer campaigns at home and abroad, from ideas and scripts to management and measuring every dollar of spend.",
    },
    features: [
      { vi: "Nghiên cứu & tuyển chọn KOL/KOC phù hợp", en: "Research & casting the right KOL/KOC" },
      { vi: "Kịch bản & sản xuất video quảng bá", en: "Scripting & promo video production" },
      { vi: "Quản lý chiến dịch đa thị trường", en: "Multi-market campaign management" },
      { vi: "Đo lường hiệu quả & tối ưu ngân sách", en: "Performance measurement & budget optimization" },
    ],
    deliverables: [
      { vi: "Danh sách KOL/KOC đề xuất", en: "Recommended KOL/KOC list" },
      { vi: "Kế hoạch & dự trù ngân sách", en: "Plan & budget" },
      { vi: "Báo cáo hiệu quả chiến dịch", en: "Campaign performance report" },
    ],
  },
  {
    slug: "game-app-marketing",
    icon: "bolt",
    title: { vi: "Game & App Marketing", en: "Game & App Marketing" },
    tagline: {
      vi: "Tăng trưởng người dùng, tối ưu CPI & ROAS.",
      en: "Grow users, optimize CPI & ROAS.",
    },
    description: {
      vi: "Kinh nghiệm ra mắt và vận hành game/ứng dụng ở quy mô khu vực và toàn cầu: kế hoạch user acquisition, tối ưu CPI/ROAS, influencer, PR báo chí và tổ chức sự kiện ra mắt.",
      en: "ANBU is a game marketing agency helping games and apps launch in Vietnam and Southeast Asia through user acquisition, CPI/ROAS optimization, influencer, PR and launch events.",
    },
    features: [
      { vi: "Kế hoạch ra mắt & User Acquisition", en: "Launch & user-acquisition planning" },
      { vi: "Tối ưu CPI, ROAS đa nền tảng", en: "Cross-platform CPI & ROAS optimization" },
      { vi: "Influencer & PR cho game/app", en: "Influencer & PR for games/apps" },
      { vi: "Tổ chức sự kiện ra mắt & OOH", en: "Launch events & OOH" },
    ],
    deliverables: [
      { vi: "Kế hoạch ra mắt chi tiết", en: "Detailed launch plan" },
      { vi: "Dashboard theo dõi UA", en: "UA tracking dashboard" },
      { vi: "Báo cáo tối ưu định kỳ", en: "Regular optimization reports" },
    ],
  },
  {
    slug: "brand-strategy",
    icon: "compass",
    title: { vi: "Chiến lược thương hiệu", en: "Brand Strategy" },
    tagline: {
      vi: "Định vị sắc bén, khác biệt bền vững.",
      en: "Sharp positioning, lasting differentiation.",
    },
    description: {
      vi: "Chúng tôi xây nền móng cho thương hiệu: nghiên cứu thị trường, chân dung khách hàng, định vị và thông điệp cốt lõi, để mọi hoạt động sau này đều nhất quán và hiệu quả.",
      en: "We build your brand's foundation: market research, customer personas, positioning and core messaging, so everything that follows stays consistent and effective.",
    },
    features: [
      { vi: "Nghiên cứu thị trường & đối thủ", en: "Market & competitor research" },
      { vi: "Định vị và kiến trúc thương hiệu", en: "Positioning & brand architecture" },
      { vi: "Thông điệp & tính cách thương hiệu", en: "Messaging & brand personality" },
      { vi: "Chiến lược nội dung tổng thể", en: "Overarching content strategy" },
    ],
    deliverables: [
      { vi: "Brand playbook", en: "Brand playbook" },
      { vi: "Bộ thông điệp cốt lõi", en: "Core messaging kit" },
      { vi: "Lộ trình triển khai", en: "Rollout roadmap" },
    ],
  },
  {
    slug: "creative-design",
    icon: "palette",
    title: { vi: "Sáng tạo & Thiết kế", en: "Creative & Design" },
    tagline: {
      vi: "Nhận diện đẹp, cảm xúc và đáng nhớ.",
      en: "Identity that's beautiful, emotive and memorable.",
    },
    description: {
      vi: "Từ logo, bộ nhận diện đến ấn phẩm truyền thông và bao bì, đội ngũ thiết kế của ANBU biến chiến lược thành hình ảnh khiến khách hàng của bạn phải dừng lại và ghi nhớ.",
      en: "From logo and identity systems to campaign assets and packaging, ANBU's design team turns strategy into visuals that make your audience stop and remember.",
    },
    features: [
      { vi: "Thiết kế logo & bộ nhận diện", en: "Logo & identity design" },
      { vi: "Ấn phẩm truyền thông & social", en: "Campaign & social creatives" },
      { vi: "Thiết kế bao bì, ấn phẩm in", en: "Packaging & print design" },
      { vi: "Hệ thống thiết kế (design system)", en: "Design systems" },
    ],
    deliverables: [
      { vi: "Brand guidelines", en: "Brand guidelines" },
      { vi: "Thư viện tài nguyên thiết kế", en: "Asset library" },
      { vi: "File nguồn bàn giao", en: "Source files handover" },
    ],
  },
  {
    slug: "performance-marketing",
    icon: "target",
    title: { vi: "Marketing hiệu suất", en: "Performance Marketing" },
    tagline: {
      vi: "Ngân sách sinh lời, tăng trưởng đo được.",
      en: "Profitable spend, measurable growth.",
    },
    description: {
      vi: "Chạy quảng cáo đa kênh (Meta, Google, TikTok), tối ưu chuyển đổi và đo lường minh bạch. Chúng tôi tập trung vào chỉ số quan trọng nhất với bạn: doanh thu.",
      en: "Multi-channel advertising (Meta, Google, TikTok), conversion optimization and transparent measurement. We focus on the metric that matters most to you: revenue.",
    },
    features: [
      { vi: "Quảng cáo Meta, Google, TikTok", en: "Meta, Google, TikTok ads" },
      { vi: "Tối ưu tỷ lệ chuyển đổi (CRO)", en: "Conversion rate optimization" },
      { vi: "Phễu bán hàng & email automation", en: "Sales funnels & email automation" },
      { vi: "Báo cáo & dashboard minh bạch", en: "Transparent reporting & dashboards" },
    ],
    deliverables: [
      { vi: "Kế hoạch media chi tiết", en: "Detailed media plan" },
      { vi: "Dashboard theo dõi realtime", en: "Realtime tracking dashboard" },
      { vi: "Báo cáo tối ưu hàng tuần", en: "Weekly optimization reports" },
    ],
  },
  {
    slug: "seo-content",
    icon: "search",
    title: { vi: "SEO & Nội dung", en: "SEO & Content" },
    tagline: {
      vi: "Traffic bền vững từ tìm kiếm.",
      en: "Sustainable traffic from search.",
    },
    description: {
      vi: "Chiến lược SEO tổng thể: nghiên cứu từ khoá, SEO kỹ thuật, xây dựng nội dung chuẩn E-E-A-T và backlink chất lượng để thương hiệu của bạn hiện diện đúng lúc khách hàng tìm kiếm.",
      en: "End-to-end SEO: keyword research, technical SEO, E-E-A-T content and quality backlinks so your brand shows up exactly when customers are searching.",
    },
    features: [
      { vi: "Nghiên cứu từ khoá & ý định tìm kiếm", en: "Keyword & intent research" },
      { vi: "SEO kỹ thuật & tối ưu tốc độ", en: "Technical SEO & speed optimization" },
      { vi: "Sản xuất nội dung chuẩn SEO", en: "SEO content production" },
      { vi: "Xây dựng backlink chất lượng", en: "Quality link building" },
    ],
    deliverables: [
      { vi: "Audit SEO toàn diện", en: "Full SEO audit" },
      { vi: "Content calendar", en: "Content calendar" },
      { vi: "Báo cáo thứ hạng & traffic", en: "Ranking & traffic reports" },
    ],
  },
  {
    slug: "web-development",
    icon: "code",
    title: { vi: "Thiết kế & Phát triển Web", en: "Web & App Development" },
    tagline: {
      vi: "Website nhanh, đẹp, chuẩn SEO.",
      en: "Websites that are fast, beautiful, SEO-ready.",
    },
    description: {
      vi: "Chúng tôi xây website và ứng dụng với công nghệ hiện đại (Next.js, headless CMS), tối ưu tốc độ, trải nghiệm và SEO, sẵn sàng cho tăng trưởng.",
      en: "We build websites and apps with modern technology (Next.js, headless CMS), optimized for speed, experience and SEO, ready to scale.",
    },
    features: [
      { vi: "Website doanh nghiệp & landing page", en: "Corporate sites & landing pages" },
      { vi: "Thương mại điện tử", en: "E-commerce" },
      { vi: "Ứng dụng web & tích hợp API", en: "Web apps & API integrations" },
      { vi: "Bảo trì & tối ưu hiệu năng", en: "Maintenance & performance tuning" },
    ],
    deliverables: [
      { vi: "Mã nguồn & tài liệu bàn giao", en: "Source code & docs" },
      { vi: "Hướng dẫn quản trị nội dung", en: "CMS training" },
      { vi: "Gói bảo trì tuỳ chọn", en: "Optional maintenance plan" },
    ],
  },
  {
    slug: "social-media",
    icon: "chat",
    title: { vi: "Quản trị mạng xã hội", en: "Social Media Management" },
    tagline: {
      vi: "Cộng đồng gắn kết, thương hiệu sống động.",
      en: "Engaged communities, brands that feel alive.",
    },
    description: {
      vi: "Lên kế hoạch, sản xuất và vận hành kênh social của bạn, nội dung nhất quán, tương tác thật và cộng đồng trung thành quanh thương hiệu.",
      en: "We plan, produce and run your social channels, consistent content, real engagement and a loyal community around your brand.",
    },
    features: [
      { vi: "Chiến lược & định hướng kênh", en: "Channel strategy & direction" },
      { vi: "Sản xuất nội dung & video ngắn", en: "Content & short-form video production" },
      { vi: "Vận hành & chăm sóc cộng đồng", en: "Community management" },
      { vi: "KOL/KOC & influencer marketing", en: "KOL/KOC & influencer marketing" },
    ],
    deliverables: [
      { vi: "Content plan hàng tháng", en: "Monthly content plan" },
      { vi: "Bộ nội dung sản xuất", en: "Produced content batches" },
      { vi: "Báo cáo hiệu quả kênh", en: "Channel performance reports" },
    ],
  },
  {
    slug: "esports-gaming-marketing-sea",
    icon: "star",
    title: { vi: "Marketing Esports & Gaming Influencer Đông Nam Á", en: "Esports & Gaming Influencer Marketing Agency in Southeast Asia" },
    tagline: { vi: "Đưa game vào đúng cộng đồng trong khu vực.", en: "Put your game in front of the right communities across SEA." },
    description: { vi: "ANBU là đối tác esports marketing và gaming influencer marketing giúp game quốc tế tiếp cận cộng đồng Đông Nam Á, từ KOL/KOC casting, creator campaign và launch PR đến community activation và user acquisition.", en: "ANBU is an esports marketing agency for gaming influencer marketing across Southeast Asia. We connect KOLs, creators, launch PR, community activation and user acquisition into one market-entry plan." },
    features: [
      { vi: "Nghiên cứu cộng đồng và tuyển chọn KOL/KOC theo thể loại", en: "Community research and genre-fit KOL/KOC casting" },
      { vi: "Chiến lược creator cho Việt Nam, Thái Lan và SEA", en: "Creator strategy for Vietnam, Thailand and SEA" },
      { vi: "Launch PR, livestream và activation esports", en: "Launch PR, livestreams and esports activations" },
      { vi: "Đo lường reach, engagement, install và retention", en: "Measurement across reach, engagement, installs and retention" },
    ],
    deliverables: [
      { vi: "Bản đồ creator và shortlist theo thị trường", en: "Market-by-market creator map and shortlist" },
      { vi: "Kế hoạch launch và ngân sách theo giai đoạn", en: "Phased launch and budget plan" },
      { vi: "Dashboard campaign và báo cáo học hỏi", en: "Campaign dashboard and learning report" },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

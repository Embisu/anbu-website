import type { L10n } from "./site";

export type Testimonial = {
  quote: L10n;
  author: L10n;
  role: L10n;
  company: L10n;
};

// Generic, industry-based social proof (no fabricated brand endorsements).
export const testimonials: Testimonial[] = [
  {
    quote: {
      vi: "ANBU hiểu game và thị trường khu vực rất sâu. Chiến dịch influencer họ chạy giúp lượng người chơi và doanh thu của chúng tôi bật lên rõ rệt.",
      en: "ANBU deeply understands games and the regional market. Their influencer campaign visibly lifted our players and revenue.",
    },
    author: { vi: "Publishing Manager", en: "Publishing Manager" },
    role: { vi: "Nhà phát hành game mobile", en: "Mobile game publisher" },
    company: { vi: "Đông Nam Á", en: "Southeast Asia" },
  },
  {
    quote: {
      vi: "Từ nội dung đến SEO, đội ngũ làm việc bài bản và minh bạch. Website của chúng tôi lên top nhiều từ khoá quan trọng chỉ sau vài tháng.",
      en: "From content to SEO, the team is methodical and transparent. Our website ranked top for many key terms within months.",
    },
    author: { vi: "Trưởng phòng Marketing", en: "Marketing Manager" },
    role: { vi: "Thương hiệu ô tô", en: "Automotive brand" },
    company: { vi: "Việt Nam", en: "Vietnam" },
  },
  {
    quote: {
      vi: "Họ biến một thương hiệu gần như vô danh thành cái tên được nhắc đến. Cách lên ý tưởng và chọn KOL rất đúng insight.",
      en: "They turned a nearly unknown brand into a talked-about name. Their ideas and KOL selection nailed the insight.",
    },
    author: { vi: "Nhà sáng lập", en: "Founder" },
    role: { vi: "Nhãn hàng tiêu dùng", en: "Consumer brand" },
    company: { vi: "Việt Nam", en: "Vietnam" },
  },
];

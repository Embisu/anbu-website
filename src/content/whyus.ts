import type { L10n } from "./site";

export type Reason = {
  icon: string;
  title: L10n;
  desc: L10n;
};

export const reasons: Reason[] = [
  {
    icon: "globe",
    title: { vi: "Kinh nghiệm khắp khu vực", en: "Experience across the region" },
    desc: {
      vi: "Đội ngũ đã trực tiếp chạy chiến dịch cho các thương hiệu game, công nghệ và tiêu dùng tại Việt Nam, Đông Nam Á và toàn cầu, hiểu rõ đặc thù từng thị trường.",
      en: "Our team has run real campaigns for gaming, tech and consumer brands in Vietnam, Southeast Asia and worldwide, we understand each market.",
    },
  },
  {
    icon: "target",
    title: { vi: "Chính xác từng mục tiêu", en: "Precision on every target" },
    desc: {
      vi: "Các quyết định được định hướng bởi mục tiêu và dữ liệu phù hợp với từng chiến dịch — từ mức độ nhận biết, tương tác và chuyển đổi đến CPI hoặc ROAS khi áp dụng.",
      en: "Decisions are guided by campaign-specific goals and data — from awareness, engagement, and conversions to CPI or ROAS where applicable.",
    },
  },
  {
    icon: "bolt",
    title: { vi: "Một đội ngũ, mọi năng lực", en: "One team, every capability" },
    desc: {
      vi: "Chiến lược, sáng tạo, influencer, performance, SEO và công nghệ trong cùng một đội, bạn không phải ghép nối nhiều bên rời rạc.",
      en: "Strategy, creative, influencer, performance, SEO and tech on one team, no stitching together scattered vendors.",
    },
  },
  {
    icon: "shield",
    title: { vi: "Thầm lặng phía sau, bạn tỏa sáng", en: "We stay behind, you shine" },
    desc: {
      vi: "Đúng tinh thần ANBU: chúng tôi làm việc như một phòng marketing nội bộ, minh bạch, chủ động, và để ánh đèn thuộc về thương hiệu của bạn.",
      en: "True to the ANBU spirit: we work like your in-house team, transparent, proactive, and we let the spotlight stay on your brand.",
    },
  },
];

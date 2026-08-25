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
      vi: "Không làm theo cảm tính. Mọi quyết định đều gắn với chỉ số, CPI, ROAS, tỷ lệ chuyển đổi, thứ hạng, và được tối ưu liên tục.",
      en: "No guesswork. Every decision ties to a metric, CPI, ROAS, conversion, rankings, and is optimized continuously.",
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

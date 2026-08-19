import type { L10n } from "./site";

export type Value = {
  icon: string;
  title: L10n;
  description: L10n;
};

export const values: Value[] = [
  {
    icon: "spark",
    title: { vi: "Kết quả là trên hết", en: "Results first" },
    description: {
      vi: "Chúng tôi đo lường thành công bằng tác động thật đến kinh doanh của bạn, không phải bằng giải thưởng.",
      en: "We measure success by real impact on your business, not by awards.",
    },
  },
  {
    icon: "heart",
    title: { vi: "Tận tâm như người trong cuộc", en: "Owner's mindset" },
    description: {
      vi: "Chúng tôi coi thương hiệu của bạn như của chính mình và luôn chủ động đề xuất điều tốt nhất.",
      en: "We treat your brand as our own and proactively propose what's best.",
    },
  },
  {
    icon: "shield",
    title: { vi: "Minh bạch tuyệt đối", en: "Radical transparency" },
    description: {
      vi: "Báo cáo rõ ràng, số liệu thật, không tô hồng. Bạn luôn biết tiền của mình đi đâu.",
      en: "Clear reporting, real numbers, no sugar-coating. You always know where your money goes.",
    },
  },
  {
    icon: "bolt",
    title: { vi: "Sáng tạo có kỷ luật", en: "Disciplined creativity" },
    description: {
      vi: "Ý tưởng lớn được dẫn dắt bởi chiến lược và dữ liệu, không phải cảm tính đơn thuần.",
      en: "Big ideas guided by strategy and data, not gut feeling alone.",
    },
  },
];

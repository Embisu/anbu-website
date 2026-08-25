import type { L10n } from "./site";

export type Step = {
  no: string;
  title: L10n;
  description: L10n;
};

// Framed in the spirit of a special-ops unit, the ANBU brand story.
export const processSteps: Step[] = [
  {
    no: "01",
    title: { vi: "Khám phá", en: "Discover" },
    description: {
      vi: "Nghiên cứu thị trường, đối thủ và khách hàng của bạn để nhìn rõ bài toán thật trước khi bắt tay vào việc.",
      en: "We study your market, competitors and customers to see the real problem before we start.",
    },
  },
  {
    no: "02",
    title: { vi: "Chiến lược", en: "Strategy" },
    description: {
      vi: "Xác định mục tiêu, định vị và lộ trình rõ ràng, kèm các chỉ số thành công được thống nhất từ đầu.",
      en: "We set the objective, positioning and a clear roadmap, with success metrics agreed up front.",
    },
  },
  {
    no: "03",
    title: { vi: "Triển khai", en: "Execute" },
    description: {
      vi: "Đội sáng tạo, nội dung và công nghệ triển khai đồng bộ, đúng thời điểm và đúng kênh.",
      en: "Our creative, content and tech teams execute together, right timing, right channels.",
    },
  },
  {
    no: "04",
    title: { vi: "Tối ưu & Mở rộng", en: "Optimize & Scale" },
    description: {
      vi: "Bám sát dữ liệu, tối ưu liên tục và nhân rộng những gì hiệu quả để tăng trưởng bền vững.",
      en: "We track the data, optimize relentlessly and scale what works for sustainable growth.",
    },
  },
];

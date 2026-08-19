import type { L10n } from "./site";

export type FAQ = {
  q: L10n;
  a: L10n;
};

export const faqs: FAQ[] = [
  {
    q: { vi: "ANBU cung cấp những dịch vụ gì?", en: "What services does ANBU offer?" },
    a: {
      vi: "Chúng tôi là agency full-service: chiến lược thương hiệu, sáng tạo & thiết kế, influencer/KOL marketing, marketing hiệu suất, game & app marketing, SEO & nội dung, quản trị mạng xã hội và phát triển web. Bạn có thể chọn từng dịch vụ hoặc gói tổng thể.",
      en: "We're a full-service agency: brand strategy, creative & design, influencer/KOL marketing, performance marketing, game & app marketing, SEO & content, social media management and web development. You can pick individual services or an end-to-end package.",
    },
  },
  {
    q: { vi: "Chi phí một dự án khoảng bao nhiêu?", en: "How much does a project cost?" },
    a: {
      vi: "Chi phí phụ thuộc vào phạm vi, mục tiêu và thị trường. Sau buổi trao đổi đầu tiên, chúng tôi sẽ gửi đề xuất kèm dự trù ngân sách minh bạch. Cứ liên hệ để nhận báo giá phù hợp với bạn.",
      en: "Cost depends on scope, goals and markets. After an initial call we send a proposal with a transparent budget. Reach out for a quote tailored to you.",
    },
  },
  {
    q: { vi: "Thời gian triển khai một chiến dịch là bao lâu?", en: "How long does a campaign take?" },
    a: {
      vi: "Các dự án nhỏ có thể chạy trong 2–4 tuần; chiến dịch tích hợp hoặc ra mắt sản phẩm thường 1–3 tháng. Chúng tôi luôn thống nhất lộ trình và mốc thời gian rõ ràng ngay từ đầu.",
      en: "Small projects can run in 2–4 weeks; integrated campaigns or product launches typically take 1–3 months. We agree a clear roadmap and milestones up front.",
    },
  },
  {
    q: { vi: "ANBU có làm việc với thị trường quốc tế không?", en: "Do you work in international markets?" },
    a: {
      vi: "Có. Đội ngũ đã triển khai ở Đông Nam Á, Đài Loan, Brazil và nhiều thị trường khác — đặc biệt trong mảng game và ứng dụng ở quy mô toàn cầu.",
      en: "Yes. Our team has executed across Southeast Asia, Taiwan, Brazil and more — especially in games and apps at global scale.",
    },
  },
  {
    q: { vi: "ANBU có cam kết KPI không?", en: "Do you commit to KPIs?" },
    a: {
      vi: "Chúng tôi thống nhất các chỉ số thành công ngay từ đầu và báo cáo minh bạch theo tiến độ. Tuỳ dịch vụ, chúng tôi có thể cam kết theo KPI cụ thể như thứ hạng, lượt tải hay chi phí trên mỗi kết quả.",
      en: "We agree success metrics from the start and report transparently. Depending on the service, we can commit to specific KPIs such as rankings, installs or cost per result.",
    },
  },
  {
    q: { vi: "Làm sao để bắt đầu hợp tác?", en: "How do we get started?" },
    a: {
      vi: "Rất đơn giản: điền form liên hệ hoặc nhắn cho chúng tôi. Chúng tôi phản hồi trong vòng 24 giờ làm việc, hẹn một buổi trao đổi để hiểu mục tiêu, rồi gửi đề xuất phù hợp.",
      en: "Simple: fill in the contact form or message us. We reply within one business day, set up a call to understand your goals, then send a tailored proposal.",
    },
  },
];

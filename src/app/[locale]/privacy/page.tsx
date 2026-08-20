import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: "/privacy",
    title: locale === "vi" ? "Chính sách bảo mật" : "Privacy Policy",
    description: locale === "vi" ? "Chính sách bảo mật của ANBU." : "ANBU privacy policy.",
  });
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const isVi = params.locale !== "en";
  return (
    <>
      <PageHero
        eyebrow={isVi ? "Pháp lý" : "Legal"}
        title={isVi ? "Chính sách bảo mật" : "Privacy Policy"}
        subtitle={isVi ? "Cập nhật lần cuối: Tháng 8, 2026" : "Last updated: August 2026"}
      />
      <section className="container-x py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-8 text-lg leading-relaxed text-navy-600">
          <p>
            {isVi
              ? `ANBU (sau đây gọi là "chúng tôi") cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng khi truy cập và tương tác trên website ${site.domain}. Chính sách này giải thích rõ ràng mục đích, phạm vi thu thập, cách thức xử lý dữ liệu và quyền lợi của bạn theo quy định của Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân tại Việt Nam và các tiêu chuẩn bảo mật quốc tế (GDPR).`
              : `ANBU ("we", "us") is dedicated to safeguarding the privacy and personal data of visitors accessing ${site.domain}. This Privacy Policy transparently outlines our data collection practices, processing principles, and your legal rights in accordance with Vietnam's Decree 13/2023/ND-CP on Personal Data Protection and international data protection regulations (GDPR).`}
          </p>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "1. Thông tin chúng tôi thu thập" : "1. Information We Collect"}
          </h2>
          <div className="space-y-3">
            <p>
              {isVi
                ? "Chúng tôi chỉ thu thập các dữ liệu cần thiết phục vụ cho việc liên hệ và cung cấp dịch vụ giải pháp marketing:"
                : "We collect only the essential information necessary for business communication and marketing consultancy:"}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base text-navy-600">
              <li>
                {isVi
                  ? "Dữ liệu liên hệ chủ động: Họ và tên, địa chỉ email, số điện thoại, tên công ty/dự án game, và thông điệp bạn gửi qua biểu mẫu liên hệ hoặc email trực tiếp."
                  : "Voluntary Contact Data: Full name, business email, phone number, company/studio name, and project requirements submitted via contact forms or direct email."}
              </li>
              <li>
                {isVi
                  ? "Dữ liệu kỹ thuật ẩn danh: Địa chỉ IP, loại trình duyệt, hệ điều hành, thời gian truy cập và các trang đã xem nhằm mục đích tối ưu hóa hiệu năng website (thông qua công cụ phân tích Google Analytics và Cloudflare Web Analytics mà không định danh cá nhân cụ thể)."
                  : "Anonymous Technical Telemetry: IP addresses, browser specifications, operating system, session duration, and pageview paths collected via privacy-conscious Google Analytics and Cloudflare Web Analytics to optimize website performance."}
              </li>
            </ul>
          </div>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "2. Mục đích xử lý dữ liệu" : "2. How We Use Your Data"}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base text-navy-600">
            <li>{isVi ? "Phản hồi các yêu cầu tư vấn chiến dịch, báo giá dịch vụ và hợp tác phát hành game." : "Responding to campaign consultations, service proposals, and game publishing partnership inquiries."}</li>
            <li>{isVi ? "Thực hiện các thỏa thuận hợp đồng và cung cấp dịch vụ chuyên môn theo yêu cầu của đối tác." : "Fulfilling contractual obligations and delivering requested marketing advisory services."}</li>
            <li>{isVi ? "Đảm bảo tính an toàn, phòng chống tấn công mạng và duy trì tính ổn định của hệ thống." : "Maintaining infrastructure integrity, preventing cybersecurity threats, and ensuring service reliability."}</li>
          </ul>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "3. Bảo mật và chia sẻ thông tin" : "3. Data Security and Third-Party Sharing"}
          </h2>
          <p>
            {isVi
              ? "ANBU cam kết không bán, cho thuê hoặc thương mại hóa thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào. Mọi dữ liệu thu thập được lưu trữ trên hạ tầng máy chủ bảo mật cao với chuẩn mã hóa SSL/TLS 256-bit. Dữ liệu chỉ được chia sẻ khi có yêu cầu bắt buộc từ cơ quan pháp luật có thẩm quyền tại Việt Nam."
              : "ANBU strictly maintains that we do not sell, rent, or trade your personal information with any third parties. All collected data is protected under robust security infrastructure featuring 256-bit SSL/TLS encryption. Data is only disclosed when mandated by applicable law enforcement authorities."}
          </p>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "4. Quyền của chủ thể dữ liệu" : "4. Your Data Protection Rights"}
          </h2>
          <p>
            {isVi
              ? "Bạn có toàn quyền yêu cầu kiểm tra, cập nhật, chỉnh sửa hoặc yêu cầu xóa vĩnh viễn dữ liệu liên hệ của mình khỏi hệ thống của chúng tôi bất kỳ lúc nào bằng cách gửi văn bản yêu cầu qua email chính thức."
              : "You possess the full right to access, rectify, update, or request permanent erasure of your personal contact records from our databases at any time by contacting our data protection team."}
          </p>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "5. Thông tin liên hệ" : "5. Contact Information"}
          </h2>
          <p>
            {isVi ? "Mọi thắc mắc hoặc khiếu nại liên quan đến chính sách bảo mật dữ liệu, xin vui lòng gửi email đến: " : "For inquiries or requests regarding our privacy policy, please reach out to: "}
            <a href={`mailto:${site.email}`} className="font-semibold text-orange-600 hover:underline">{site.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}

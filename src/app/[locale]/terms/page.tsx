import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: "/terms",
    title: locale === "vi" ? "Điều khoản sử dụng" : "Terms of Service",
    description: locale === "vi" ? "Điều khoản sử dụng website ANBU." : "ANBU website terms of service.",
  });
}

export default function TermsPage({ params }: { params: { locale: string } }) {
  const isVi = params.locale !== "en";
  return (
    <>
      <PageHero
        eyebrow={isVi ? "Pháp lý" : "Legal"}
        title={isVi ? "Điều khoản sử dụng" : "Terms of Service"}
        subtitle={isVi ? "Cập nhật lần cuối: Tháng 8, 2026" : "Last updated: August 2026"}
      />
      <section className="container-x py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-8 text-lg leading-relaxed text-navy-600">
          <p>
            {isVi
              ? `Chào mừng bạn đến với ${site.domain}. Bằng việc truy cập hoặc sử dụng các tài nguyên, ấn phẩm nghiên cứu và dịch vụ được cung cấp trên website này, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ các điều khoản và điều kiện được quy định dưới đây.`
              : `Welcome to ${site.domain}. By accessing or using the resources, research publications, and services provided on this website, you acknowledge that you have read, understood, and agreed to be bound by the terms and conditions outlined below.`}
          </p>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "1. Quyền sở hữu trí tuệ và bản quyền" : "1. Intellectual Property & Copyright"}
          </h2>
          <p>
            {isVi
              ? "Toàn bộ tài nguyên trên website bao gồm bài viết phân tích, báo cáo thị trường game, hình ảnh đồ họa, logo thương hiệu ANBU, mã nguồn và cấu trúc giao diện đều là tài sản trí tuệ độc quyền của ANBU hoặc các đối tác được cấp phép hợp pháp. Nghiêm cấm mọi hành vi sao chép, phân phối lại hoặc sử dụng cho mục đích thương mại mà không có sự đồng thuận bằng văn bản của ANBU."
              : "All website assets including analytical articles, gaming market whitepapers, graphics, ANBU brand logos, codebase, and layout frameworks constitute the exclusive intellectual property of ANBU or its licensors. Any unauthorized reproduction, redistribution, or commercial exploitation without prior written consent from ANBU is strictly prohibited."}
          </p>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "2. Quy định sử dụng thông tin và dịch vụ" : "2. Permitted Use of Information & Services"}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base text-navy-600">
            <li>{isVi ? "Bạn được phép trích dẫn thông tin cho mục đích nghiên cứu, học tập cá nhân với điều kiện phải ghi rõ nguồn và đính kèm đường link dẫn về bài viết gốc trên anbu.asia." : "You may cite insights for non-commercial research or study provided explicit attribution and canonical backlink to the original anbu.asia URL are maintained."}</li>
            <li>{isVi ? "Không được sử dụng bất kỳ công cụ tự động (bot, scraper) nhằm thu thập dữ liệu trái phép hoặc làm gián đoạn hạ tầng máy chủ của website." : "You must not deploy automated bots or scrapers to harvest data without authorization or disrupt server infrastructure."}</li>
          </ul>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "3. Tuyên bố từ chối bảo đảm & Giới hạn trách nhiệm" : "3. Disclaimer of Warranties & Limitation of Liability"}
          </h2>
          <p>
            {isVi
              ? "Các thông tin, báo cáo xu hướng và dữ liệu phân tích trên website được cung cấp nhằm mục đích tham khảo chuyên môn. Mặc dù chúng tôi luôn nỗ lực đảm bảo tính chính xác cao nhất, ANBU không chịu trách nhiệm pháp lý đối với bất kỳ quyết định đầu tư hay kinh doanh nào phát sinh từ việc sử dụng các thông tin này."
              : "The articles, industry insights, and analytical data on this website are provided for professional reference purposes. While we strive for absolute accuracy, ANBU assumes no legal liability for any independent business or investment decisions made based on this information."}
          </p>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "4. Luật áp dụng và giải quyết tranh chấp" : "4. Governing Law & Dispute Resolution"}
          </h2>
          <p>
            {isVi
              ? "Các điều khoản này được diễn giải và điều chỉnh theo quy định của pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp nếu không thể giải quyết thông qua thương lượng hòa giải sẽ được đưa ra tòa án có thẩm quyền tại Việt Nam."
              : "These Terms of Service are governed by and construed in accordance with the laws of the Socialist Republic of Vietnam. Any unresolved disputes shall be submitted to the competent jurisdiction courts in Vietnam."}
          </p>

          <h2 className="font-display text-2xl font-bold text-navy-800">
            {isVi ? "5. Liên hệ với ban điều hành" : "5. Contact Administration"}
          </h2>
          <p>
            {isVi ? "Mọi thắc mắc hoặc yêu cầu cấp phép sử dụng nội dung, xin vui lòng gửi email về: " : "For inquiries regarding content licensing or partnership agreements, please contact: "}
            <a href={`mailto:${site.email}`} className="font-semibold text-orange-600 hover:underline">{site.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}

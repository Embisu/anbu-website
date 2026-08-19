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
        subtitle={isVi ? "Cập nhật lần cuối: Tháng 7, 2026" : "Last updated: July 2026"}
      />
      <section className="container-x py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-navy-600">
          <p>
            {isVi
              ? `ANBU tôn trọng quyền riêng tư của bạn. Trang này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng website ${site.domain}.`
              : `ANBU respects your privacy. This page describes how we collect, use and protect personal information when you use the ${site.domain} website.`}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy-800">{isVi ? "Thông tin chúng tôi thu thập" : "Information we collect"}</h2>
          <p>
            {isVi
              ? "Chúng tôi chỉ thu thập thông tin bạn chủ động cung cấp qua biểu mẫu liên hệ (họ tên, email, số điện thoại, công ty và nội dung tin nhắn) nhằm mục đích phản hồi yêu cầu của bạn."
              : "We only collect information you voluntarily provide via our contact form (name, email, phone, company and message) for the purpose of responding to your request."}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy-800">{isVi ? "Cách chúng tôi sử dụng" : "How we use it"}</h2>
          <p>
            {isVi
              ? "Thông tin được dùng để liên hệ, tư vấn và cung cấp dịch vụ. Chúng tôi không bán hoặc chia sẻ dữ liệu của bạn cho bên thứ ba vì mục đích quảng cáo."
              : "Information is used to contact you, provide consultation and deliver services. We do not sell or share your data with third parties for advertising purposes."}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy-800">{isVi ? "Liên hệ" : "Contact"}</h2>
          <p>
            {isVi ? "Mọi thắc mắc về bảo mật, vui lòng liên hệ: " : "For any privacy questions, contact: "}
            <a href={`mailto:${site.email}`} className="font-semibold text-orange-600">{site.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}

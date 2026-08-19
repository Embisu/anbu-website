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
        subtitle={isVi ? "Cập nhật lần cuối: Tháng 7, 2026" : "Last updated: July 2026"}
      />
      <section className="container-x py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-navy-600">
          <p>
            {isVi
              ? `Bằng việc truy cập website ${site.domain}, bạn đồng ý với các điều khoản dưới đây.`
              : `By accessing the ${site.domain} website, you agree to the terms below.`}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy-800">{isVi ? "Sử dụng nội dung" : "Use of content"}</h2>
          <p>
            {isVi
              ? "Toàn bộ nội dung, hình ảnh và thương hiệu trên website thuộc quyền sở hữu của ANBU. Vui lòng không sao chép hoặc sử dụng lại khi chưa có sự đồng ý bằng văn bản."
              : "All content, images and branding on this website are owned by ANBU. Please do not copy or reuse without written consent."}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy-800">{isVi ? "Giới hạn trách nhiệm" : "Limitation of liability"}</h2>
          <p>
            {isVi
              ? "Website được cung cấp trên cơ sở 'nguyên trạng'. ANBU không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng website."
              : "The website is provided on an 'as is' basis. ANBU is not liable for any damages arising from use of the website."}
          </p>
          <h2 className="font-display text-2xl font-bold text-navy-800">{isVi ? "Liên hệ" : "Contact"}</h2>
          <p>
            {isVi ? "Câu hỏi về điều khoản, liên hệ: " : "Questions about these terms, contact: "}
            <a href={`mailto:${site.email}`} className="font-semibold text-orange-600">{site.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}

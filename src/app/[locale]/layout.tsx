import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Be_Vietnam_Pro } from "next/font/google";
import "../globals.css";
import { locales, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site, t } from "@/content/site";
import { siteUrl, languageAlternates } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ScrollProgress from "@/components/ScrollProgress";
import Analytics from "@/components/Analytics";
import ZaloButton from "@/components/ZaloButton";

export const runtime = "edge";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Distinct heavier display weights, same Vietnamese-capable family (guaranteed diacritic support).
const display = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : defaultLocale) as Locale;
  const isVi = locale === "vi";
  const title = isVi
    ? "ANBU | Biệt đội Community và Marketing cho game"
    : "ANBU | Community and Game Marketing";
  const description = isVi
    ? "ANBU giúp game, ứng dụng và thương hiệu quốc tế ra mắt tại Việt Nam bằng KOL KOC, social, cộng đồng, PR và paid media tích hợp."
    : "ANBU helps games, apps and international brands launch in Vietnam and Southeast Asia with integrated creator, social, community, PR and paid media campaigns.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${site.name}`,
    },
    description,
    applicationName: site.name,
    keywords: isVi
      ? ["agency", "marketing", "thương hiệu", "SEO", "thiết kế website", "quảng cáo", "ANBU"]
      : ["agency", "marketing", "branding", "SEO", "web development", "advertising", "ANBU"],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: languageAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: isVi ? "vi_VN" : "en_US",
      url: `${siteUrl}/${locale}`,
      title,
      description,
      images: [{ url: "/og/og-default.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og/og-default.png"] },
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${siteUrl}/#organization`,
    name: t(site.legalName, locale),
    alternateName: site.name,
    url: siteUrl,
    logo: `${siteUrl}/logo/logo.png`,
    image: `${siteUrl}/logo/logo.png`,
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.foundedYear),
    areaServed: ["VN", "TH", "PH", "ID", "MY", "SG"],
    sameAs: Object.values(site.social),
    address: {
      "@type": "PostalAddress",
      streetAddress: "47 Dang Van Ngu, An Cuu",
      addressLocality: "Hue City",
      addressCountry: "VN",
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: site.name,
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/${locale}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <Analytics />
        <ScrollProgress />
        <ZaloButton locale={locale} />
        <JsonLd data={orgLd} />
        <JsonLd data={websiteLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy-600 focus:px-4 focus:py-2 focus:text-white"
        >
          {locale === "vi" ? "Bỏ qua đến nội dung" : "Skip to content"}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}

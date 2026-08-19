import type { Locale } from "@/i18n/config";

export type L10n = Record<Locale, string>;

export const site = {
  name: "ANBU",
  legalName: {
    vi: "Công ty TNHH Marketing & Truyền thông ANBU",
    en: "ANBU Marketing & Communications Co., Ltd",
  } as L10n,
  taxId: "3301761892",
  domain: "anbu.asia",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://anbu.asia",
  email: "dat.phan@anbu.asia",
  phone: "039 699 5252",
  phoneHref: "tel:+84396995252",
  zalo: "https://zalo.me/0396995252",
  whatsapp: "https://wa.me/84396995252",
  address: {
    vi: "47 Đặng Văn Ngữ, An Cựu, TP. Huế, Việt Nam",
    en: "47 Dang Van Ngu, An Cuu, Hue City, Vietnam",
  } as L10n,
  foundedYear: 2024,
  // Only real, verified profiles are listed (rendered dynamically).
  social: {
    facebook: "https://www.facebook.com/anbuvn/",
    threads: "https://www.threads.com/@anbumarcom",
  } as Record<string, string>,
  stats: {
    projects: "40+",
    clients: "25+",
    years: "6+",
    markets: "SEA",
  },
};

export function t(value: L10n, locale: Locale): string {
  return value[locale] ?? value.vi;
}

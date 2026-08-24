"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site, t } from "@/content/site";
import { services } from "@/content/services";
import { localePath } from "@/lib/utils";
import Icon from "./Icon";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() || "";
  const year = new Date().getFullYear();

  if (pathname.includes("/admin")) {
    return null;
  }

  const socials = Object.entries(site.social).map(([name, href]) => ({ name, href }));

  return (
    <footer className="mt-24 bg-navy-900 text-navy-100">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/logo/logo-white.png" alt="ANBU" width={132} height={44} className="h-9 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-200">{dict.footer.tagline}</p>
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ANBU on ${s.name.charAt(0).toUpperCase() + s.name.slice(1)}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-navy-100 transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <Icon name={s.name as any} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {locale === "vi" ? "Dịch vụ" : "Services"}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-navy-300">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={localePath(locale, `/services/${s.slug}`)} className="hover:text-white transition-colors">
                    {t(s.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {locale === "vi" ? "Về ANBU" : "About"}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-navy-300">
              <li>
                <Link href={localePath(locale, "/about")} className="hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, "/work")} className="hover:text-white transition-colors">
                  {dict.nav.work}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, "/blog")} className="hover:text-white transition-colors">
                  {dict.nav.blog}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, "/contact")} className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, "/privacy")} className="hover:text-white transition-colors">
                  {locale === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, "/terms")} className="hover:text-white transition-colors">
                  {locale === "vi" ? "Điều khoản sử dụng" : "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {locale === "vi" ? "Liên hệ & Trụ sở" : "Contact & Office"}
            </h4>
            <div className="mt-4 space-y-2.5 text-sm text-navy-300">
              <p className="font-medium text-white">{t(site.legalName, locale)}</p>
              <p className="text-xs text-navy-300">MST: {site.taxId}</p>
              <p>
                <a
                  href={site.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={locale === "vi" ? "Mở vị trí ANBU trên Google Maps" : "Open ANBU location on Google Maps"}
                  className="group/map inline-flex items-start gap-1.5 transition hover:text-orange-400"
                >
                  <span className="text-orange-400 mt-0.5 group-hover/map:scale-110 transition-transform">📍</span>
                  <span className="underline decoration-navy-700 underline-offset-4 group-hover/map:decoration-orange-400">
                    {t(site.address, locale)}
                  </span>
                </a>
              </p>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                  Hotline: {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-white transition-colors">
                  Email: {site.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-navy-400">
          <p>© {year} {site.name} — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

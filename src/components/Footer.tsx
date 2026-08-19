import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site, t } from "@/content/site";
import { services } from "@/content/services";
import { localePath } from "@/lib/utils";
import Icon from "./Icon";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

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

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">{dict.footer.services}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {services.slice(0, 6).map((s) => (
                  <li key={s.slug}>
                    <Link href={localePath(locale, `/services/${s.slug}`)} className="text-navy-200 transition-colors hover:text-orange-400">
                      {t(s.title, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">{dict.footer.company}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href={localePath(locale, "/about")} className="text-navy-200 hover:text-orange-400">{dict.nav.about}</Link></li>
                <li><Link href={localePath(locale, "/work")} className="text-navy-200 hover:text-orange-400">{dict.nav.work}</Link></li>
                <li><Link href={localePath(locale, "/blog")} className="text-navy-200 hover:text-orange-400">{dict.nav.blog}</Link></li>
                <li><Link href={localePath(locale, "/contact")} className="text-navy-200 hover:text-orange-400">{dict.nav.contact}</Link></li>
                <li>
                  <a href="https://otahub.asia/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-navy-200 hover:text-orange-400">
                    OTAHub <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">{dict.footer.contact}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span className="text-navy-200">{t(site.address, locale)}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-orange-500" />
                  <a href={`mailto:${site.email}`} className="text-navy-200 hover:text-orange-400">{site.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-navy-300 sm:flex-row">
          <p>© {year} {t(site.legalName, locale)}. {dict.footer.rights}</p>
          <div className="flex items-center gap-6">
            <Link href={localePath(locale, "/privacy")} className="hover:text-orange-400">{dict.footer.privacy}</Link>
            <Link href={localePath(locale, "/terms")} className="hover:text-orange-400">{dict.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

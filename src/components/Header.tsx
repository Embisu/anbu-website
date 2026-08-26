"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/utils";
import Icon from "./Icon";
import LanguageSwitcher from "./LanguageSwitcher";
import { blogCategories } from "@/content/posts";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [blogExpanded, setBlogExpanded] = useState(false);
  const pathname = usePathname() || "";

  if (pathname.includes("/admin")) {
    return null;
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setBlogExpanded(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const nav = [
    { href: localePath(locale, "/about"), label: dict.nav.about },
    { href: localePath(locale, "/services"), label: dict.nav.services },
    { href: localePath(locale, "/work"), label: dict.nav.work },
    { href: localePath(locale, "/blog"), label: dict.nav.blog },
    { href: localePath(locale, "/contact"), label: dict.nav.contact },
  ];

  const isActive = (href: string) => pathname === href || (href !== localePath(locale) && pathname.startsWith(href + "/"));

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "border-b border-navy-100/70 bg-white/90 shadow-sm backdrop-blur-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-14 items-center justify-between sm:h-16 md:h-20">
          <Link href={localePath(locale)} className="flex items-center" aria-label="ANBU">
            <Image
              src="/logo/logo.png"
              alt="ANBU"
              width={132}
              height={44}
              priority
              className="h-7 w-auto sm:h-8 md:h-9"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {nav.map((item) =>
              item.label === dict.nav.blog ? (
                <div key={item.href} className="group relative py-5">
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${
                      isActive(item.href) ? "text-orange-600" : "text-navy-700 hover:text-orange-600"
                    }`}
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-xs transition-transform group-hover:rotate-180">
                      ⌄
                    </span>
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 translate-y-2 rounded-2xl border border-navy-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {blogCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={localePath(locale, `/blog/category/${category.slug}`)}
                        className="block rounded-xl px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        {locale === "vi" ? category.vi : category.en}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive(item.href) ? "text-orange-600" : "text-navy-700 hover:text-orange-600"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher current={locale} />
            </div>
            <Link href={localePath(locale, "/contact")} className="btn-primary hidden md:inline-flex">
              {dict.nav.cta}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-100 bg-white/80 text-navy-800 shadow-sm transition hover:bg-orange-50 hover:text-orange-600 lg:hidden active:scale-95"
              aria-label={open ? (locale === "vi" ? "Đóng menu" : "Close menu") : (locale === "vi" ? "Mở menu" : "Open menu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {open && (
          <div
            className="fixed inset-x-0 top-14 z-50 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-navy-100 bg-white/95 px-4 pb-8 pt-3 shadow-2xl backdrop-blur-2xl lg:hidden"
            id="mobile-menu"
          >
            <div className="space-y-1.5">
              {nav.map((item) => {
                const isBlog = item.label === dict.nav.blog;
                return (
                  <div key={item.href} className="overflow-hidden rounded-2xl">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        className={`flex-1 px-4 py-3 text-base font-bold transition-colors ${
                          isActive(item.href)
                            ? "bg-orange-50 text-orange-600"
                            : "text-navy-800 hover:bg-navy-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                      {isBlog && (
                        <button
                          type="button"
                          onClick={() => setBlogExpanded((v) => !v)}
                          className="flex h-11 w-11 items-center justify-center text-navy-500 hover:text-orange-600"
                          aria-label="Toggle categories"
                        >
                          <span className={`text-base transition-transform duration-200 ${blogExpanded ? "rotate-180" : ""}`}>
                            ⌄
                          </span>
                        </button>
                      )}
                    </div>
                    {isBlog && blogExpanded && (
                      <div className="mb-2 space-y-1 rounded-xl bg-cloud/70 p-2 text-sm">
                        {blogCategories.map((category) => (
                          <Link
                            key={category.slug}
                            href={localePath(locale, `/blog/category/${category.slug}`)}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-navy-600 hover:bg-orange-50 hover:text-orange-600"
                          >
                            {locale === "vi" ? category.vi : category.en}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Footer Actions */}
            <div className="mt-6 flex flex-col gap-3.5 border-t border-navy-100 pt-5">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                  {locale === "vi" ? "Ngôn ngữ / Language" : "Language"}
                </span>
                <LanguageSwitcher current={locale} />
              </div>
              <Link
                href={localePath(locale, "/contact")}
                className="btn-primary w-full justify-center py-3.5 text-base shadow-lg"
              >
                {dict.nav.cta}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for mobile menu */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-14 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}
    </>
  );
}

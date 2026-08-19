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
  const pathname = usePathname() || "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const nav = [
    { href: localePath(locale, "/about"), label: dict.nav.about },
    { href: localePath(locale, "/services"), label: dict.nav.services },
    { href: localePath(locale, "/work"), label: dict.nav.work },
    { href: localePath(locale, "/blog"), label: dict.nav.blog },
    { href: localePath(locale, "/contact"), label: dict.nav.contact },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-navy-100/70 bg-white/85 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href={localePath(locale)} className="flex items-center" aria-label="ANBU">
          <Image
            src="/logo/logo.png"
            alt="ANBU"
            width={132}
            height={44}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {nav.map((item) => item.label === dict.nav.blog ? (
            <div key={item.href} className="group relative py-5">
              <Link href={item.href} className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${isActive(item.href) ? "text-orange-600" : "text-navy-700 hover:text-orange-600"}`}>
                {item.label}<span aria-hidden="true" className="text-xs">⌄</span>
              </Link>
              <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 translate-y-2 rounded-2xl border border-navy-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {blogCategories.map((category) => <Link key={category.slug} href={localePath(locale, `/blog/category/${category.slug}`)} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-orange-50 hover:text-orange-600">{locale === "vi" ? category.vi : category.en}</Link>)}
              </div>
            </div>
          ) : (
            <Link key={item.href} href={item.href} className={`text-sm font-semibold transition-colors ${isActive(item.href) ? "text-orange-600" : "text-navy-700 hover:text-orange-600"}`}>{item.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 text-navy-700 lg:hidden"
            aria-label={open ? (locale === "vi" ? "Đóng menu" : "Close menu") : (locale === "vi" ? "Mở menu" : "Open menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="container-x space-y-1 border-t border-navy-100 bg-white pb-6 pt-3">
            {nav.map((item) => (
              <div key={item.href}>
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-base font-semibold ${
                  isActive(item.href) ? "bg-orange-50 text-orange-600" : "text-navy-700 hover:bg-navy-50"
                }`}
              >
                {item.label}
              </Link>
              {item.label === dict.nav.blog && <div className="ml-4 border-l border-navy-100 pl-3">{blogCategories.map((category) => <Link key={category.slug} href={localePath(locale, `/blog/category/${category.slug}`)} className="block rounded-lg px-3 py-2 text-sm text-navy-500 hover:bg-orange-50 hover:text-orange-600">{locale === "vi" ? category.vi : category.en}</Link>)}</div>}
              </div>
            ))}
            <div className="flex items-center justify-between px-4 pt-4">
              <LanguageSwitcher current={locale} />
              <Link href={localePath(locale, "/contact")} className="btn-primary">
                {dict.nav.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

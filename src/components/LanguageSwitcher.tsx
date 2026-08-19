"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || "/";

  function swap(locale: Locale) {
    const parts = pathname.split("/");
    // parts[0] === "" , parts[1] === current locale
    if (locales.includes(parts[1] as Locale)) {
      parts[1] = locale;
    } else {
      return `/${locale}`;
    }
    return parts.join("/") || `/${locale}`;
  }

  return (
    <div className="inline-flex items-center rounded-full border border-navy-100 bg-white p-0.5 text-xs font-semibold">
      {locales.map((loc) => {
        const active = loc === current;
        return (
          <Link
            key={loc}
            href={swap(loc)}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
              active ? "bg-navy-600 text-white" : "text-navy-500 hover:text-navy-700"
            }`}
          >
            {loc}
          </Link>
        );
      })}
    </div>
  );
}

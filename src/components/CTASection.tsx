import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/utils";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { MarkWatermark } from "./Illustration";

export default function CTASection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="container-x">
      <Reveal className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-navy-800 px-5 py-10 sm:px-14 sm:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-navy-500/40 blur-3xl" />
        <MarkWatermark className="-bottom-12 -right-8 h-64 w-64 rotate-12" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            {dict.ctaBanner.title}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm leading-relaxed text-navy-100 sm:text-lg">{dict.ctaBanner.subtitle}</p>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link href={localePath(locale, "/contact")} className="btn-primary">
              {dict.ctaBanner.button}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

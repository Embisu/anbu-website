"use client";

import { useState } from "react";
import Icon from "./Icon";

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border transition-colors ${
              isOpen ? "border-orange-200 bg-white" : "border-navy-100 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-btn-${i}`}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 text-left"
            >
              <span className="font-display text-sm sm:text-base lg:text-lg font-bold text-navy-800">{item.q}</span>
              <span
                className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isOpen ? "rotate-45 bg-orange-500 text-white" : "bg-navy-50 text-navy-600"
                }`}
              >
                <Icon name="close" className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-45" />
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 sm:px-6 sm:pb-6 text-xs sm:text-sm leading-relaxed text-navy-500 sm:text-base">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

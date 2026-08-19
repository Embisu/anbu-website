"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

export type ResultItem = {
  client: string;
  category: string;
  metric: string;
  metricLabel: string;
  desc: string;
};

export default function ResultsCarousel({ items }: { items: ResultItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [paused, count]);

  const go = (n: number) => setIndex((n + count) % count);

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-4xl border border-navy-100 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(1,47,135,0.3)] sm:p-12">
        <div className="relative min-h-[210px]">
          {items.map((item, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                i === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 translate-y-2 opacity-0"
              }`}
              aria-hidden={i !== index}
            >
              <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-600">
                {item.category}
              </span>
              <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
                <span className="font-display text-5xl font-extrabold leading-none text-orange-600 sm:text-6xl">
                  {item.metric}
                </span>
                <span className="pb-1 text-sm font-semibold text-navy-500">{item.metricLabel}</span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-navy-600 sm:text-lg">{item.desc}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-600 font-display text-base font-bold text-white">
                  {item.client.charAt(0)}
                </span>
                <span className="font-display text-base font-bold text-navy-800">{item.client}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-100 text-navy-600 transition-colors hover:border-orange-400 hover:text-orange-600"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to result ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-orange-500" : "w-2 bg-navy-200 hover:bg-navy-300"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-100 text-navy-600 transition-colors hover:border-orange-400 hover:text-orange-600"
        >
          <Icon name="arrow" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

// Counts up from 0 to the numeric part of `value` when scrolled into view.
// Keeps any prefix/suffix, e.g. "40+", "98%", "~1M" (non-numeric shown as-is).
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const match = value.match(/^(\D*)(\d[\d.,]*)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const prefix = match[1];
    const numStr = match[2].replace(/,/g, "");
    const suffix = match[3];
    const target = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const fmt = (n: number) => prefix + n.toFixed(decimals) + suffix;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(fmt(target));
      return;
    }

    setDisplay(fmt(0));
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(fmt(target * eased));
            if (p < 1) requestAnimationFrame(step);
            else setDisplay(fmt(target));
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  // The animated number is decorative; the true final value is exposed to
  // screen readers and non-JS/SEO crawlers via an always-final sr-only span.
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

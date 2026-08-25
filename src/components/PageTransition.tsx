"use client";

import { useEffect, useState } from "react";

// Branded intro: the ANBU shuriken springs in, then the navy panel wipes
// upward to reveal the page.
//
// Runs ONCE per page load only, not on every internal navigation, so moving
// between pages stays instant (a transition on every click makes a site feel slow).
export default function PageTransition() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActive(false);
      return;
    }
    const t = setTimeout(() => setActive(false), 1350);
    return () => clearTimeout(t);
  }, []);

  if (!active) return null;

  return (
    <div className="anbu-panel pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-navy-900">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
      <div className="pointer-events-none absolute h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="relative flex items-center justify-center">
        <span className="anbu-ring absolute h-40 w-40 rounded-full border border-orange-400/50" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/mark-white.svg"
          alt=""
          className="anbu-shuriken relative h-24 w-24 drop-shadow-[0_10px_30px_rgba(245,80,30,0.55)]"
        />
      </div>
    </div>
  );
}

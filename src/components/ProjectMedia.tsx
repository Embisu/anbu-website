"use client";

import { useState } from "react";
import Scene, { type SceneVariant } from "./Scene";

// Tries public/projects/<slug>.(jpg|png|webp). If none exists, falls back to
// the themed SVG illustration, so the site never shows a broken image.
const EXTS = ["jpg", "png", "webp"] as const;
const PREFERRED_EXT: Record<string, (typeof EXTS)[number]> = {
  "douluo-soul-master-duel": "jpg",
  "goi-ta-dai-chuong-quy": "webp",
  "thien-tai-kinh-doanh": "jpg",
  "tam-quoc-cong-thanh-thien-ha": "webp",
  "mu-vuot-thoi-dai": "webp",
  "football-master-2": "webp",
  "life-makeover": "webp",
  "onmyoji-arena": "webp",
  "nguyet-mong": "jpg",
  "focallure": "jpg",
};

function extensionsFor(slug: string) {
  const preferred = PREFERRED_EXT[slug];
  return preferred ? [preferred, ...EXTS.filter((ext) => ext !== preferred)] : [...EXTS];
}

/** Full-bleed hero media: cinematic photo when available, else the side illustration. */
export function ProjectHeroMedia({
  slug,
  variant,
  alt,
  fit = "cover",
}: {
  slug: string;
  variant: SceneVariant;
  alt: string;
  fit?: "cover" | "contain";
}) {
  const [attempt, setAttempt] = useState(0);
  const extensions = extensionsFor(slug);

  if (attempt >= extensions.length) {
    return (
      <Scene
        variant={variant}
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-2/5 opacity-90 lg:block"
      />
    );
  }

  if (fit === "contain") {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/projects/${slug}.${extensions[attempt]}`}
          alt=""
          aria-hidden="true"
          onError={() => setAttempt((a) => a + 1)}
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-xl"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/projects/${slug}.${extensions[attempt]}`}
          alt={alt}
          onError={() => setAttempt((a) => a + 1)}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-75"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
      </>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/projects/${slug}.${extensions[attempt]}`}
        alt={alt}
        onError={() => setAttempt((a) => a + 1)}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
    </>
  );
}

export default function ProjectMedia({
  slug,
  variant,
  alt,
  className = "",
  priority = false,
  focal,
  fit = "cover",
}: {
  slug: string;
  variant: SceneVariant;
  alt: string;
  className?: string;
  /** Above-the-fold hero media: load eagerly so it's not deferred. */
  priority?: boolean;
  /** object-position focal point, e.g. "center top" or "50% 30%". */
  focal?: string;
  fit?: "cover" | "contain";
}) {
  const [attempt, setAttempt] = useState(0);
  const extensions = extensionsFor(slug);

  if (attempt >= extensions.length) {
    return <Scene variant={variant} className={`${className} h-full w-full`} />;
  }

  if (fit === "contain") {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/projects/${slug}.${extensions[attempt]}`}
          alt=""
          aria-hidden="true"
          loading={priority ? "eager" : "lazy"}
          onError={() => setAttempt((a) => a + 1)}
          className={`${className} h-full w-full scale-110 object-cover opacity-45 blur-xl`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/projects/${slug}.${extensions[attempt]}`}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className={`${className} h-full w-full object-contain`}
        />
      </>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/projects/${slug}.${extensions[attempt]}`}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      onError={() => setAttempt((a) => a + 1)}
      style={focal ? { objectPosition: focal } : undefined}
      className={`${className} h-full w-full object-cover`}
    />
  );
}

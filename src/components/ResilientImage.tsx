"use client";

import React, { useState, useEffect } from "react";

type ResilientImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "auto" | "sync";
};

export default function ResilientImage({
  src,
  alt,
  className = "",
  style,
  width,
  height,
  loading = "lazy",
  fetchPriority = "auto",
  decoding = "async",
}: ResilientImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackStep, setFallbackStep] = useState(0);

  useEffect(() => {
    setCurrentSrc(src);
    setFallbackStep(0);
  }, [src]);

  const handleError = () => {
    // If it's a blog-media file, step through CDNs
    if (currentSrc.includes("/blog-media/")) {
      const parts = currentSrc.split("/blog-media/");
      const fileName = parts[1]?.split("?")[0];
      if (fileName) {
        if (fallbackStep === 0) {
          setFallbackStep(1);
          // Tier 1: Direct GitHub Raw CDN
          setCurrentSrc(
            `https://raw.githubusercontent.com/Embisu/anbu-website/main/public/blog-media/${fileName}`
          );
          return;
        }
        if (fallbackStep === 1) {
          setFallbackStep(2);
          // Tier 2: jsDelivr GitHub CDN
          setCurrentSrc(
            `https://cdn.jsdelivr.net/gh/Embisu/anbu-website@main/public/blog-media/${fileName}`
          );
          return;
        }
      }
    }

    if (currentSrc !== "/blog-covers/game-app.jpg") {
      // Final resilient fallback to prevent empty/broken placeholder icon
      setCurrentSrc("/blog-covers/game-app.jpg");
    }
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}

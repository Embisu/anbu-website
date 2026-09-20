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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError && currentSrc.includes("/blog-media/")) {
      const parts = currentSrc.split("/blog-media/");
      const fileName = parts[1]?.split("?")[0];
      if (fileName) {
        setHasError(true);
        // Fallback directly to GitHub Raw CDN (available 0.1s after commit)
        setCurrentSrc(
          `https://raw.githubusercontent.com/Embisu/anbu-website/main/public/blog-media/${fileName}`
        );
        return;
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

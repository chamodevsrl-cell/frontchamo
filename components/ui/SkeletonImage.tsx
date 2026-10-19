
"use client";

import { useState } from "react";
import CmsImage from "@/components/CmsImage";

type SkeletonImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
};

export default function SkeletonImage({
  src,
  alt,
  sizes = "100vw",
  className = "",
}: SkeletonImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;

  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-200">
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-slate-300"
          aria-hidden="true"
        />
      )}

      <CmsImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={() => setLoadedSrc(src)}
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
}

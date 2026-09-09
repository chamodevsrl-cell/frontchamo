"use client";

import { useEffect, useState } from "react";
import { Cog } from "lucide-react";

const INTRO_MS = 2700;

export default function IntroSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(skip);
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const end = window.setTimeout(() => {
      document.body.style.overflow = previous;
      setVisible(false);
    }, INTRO_MS);

    return () => {
      window.clearTimeout(end);
      document.body.style.overflow = previous;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="intro-splash"
      role="status"
      aria-live="polite"
      aria-label="Cargando Chamo Import"
    >
      <div className="intro-panel intro-panel-left" />
      <div className="intro-panel intro-panel-right" />
      <div className="intro-gear" aria-hidden>
        <Cog
          className="intro-gear-main h-24 w-24 text-brand-gold sm:h-32 sm:w-32"
          strokeWidth={1.6}
        />
        <Cog
          className="intro-gear-small absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-white sm:h-12 sm:w-12"
          strokeWidth={2}
        />
        <p className="intro-gear-label mt-5 font-display text-sm font-extrabold tracking-[0.28em] text-white uppercase sm:text-base">
          Chamo Import
        </p>
      </div>
    </div>
  );
}

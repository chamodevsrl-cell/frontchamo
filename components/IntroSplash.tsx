"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Cog } from "lucide-react";

function lockIntroScroll() {
  document.documentElement.classList.add("intro-playing");
}

function unlockIntroScroll() {
  document.documentElement.classList.remove("intro-playing");
}

export default function IntroSplash() {
  const lastPlay = useRef(0);
  const [visible, setVisible] = useState(true);
  const [cycle, setCycle] = useState(0);

  const hide = useCallback(() => {
    unlockIntroScroll();
    setVisible(false);
  }, []);

  const play = useCallback(() => {
    const now = Date.now();
    if (now - lastPlay.current < 450) return;
    lastPlay.current = now;
    setCycle((n) => n + 1);
    setVisible(true);
  }, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("a[data-site-intro]")) return;
      play();
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [play]);

  useLayoutEffect(() => {
    if (!visible) {
      unlockIntroScroll();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = window.setTimeout(hide, 0);
      return () => window.clearTimeout(skip);
    }

    lockIntroScroll();
    const safety = window.setTimeout(hide, 3200);

    return () => {
      window.clearTimeout(safety);
      unlockIntroScroll();
    };
  }, [visible, cycle, hide]);

  if (!visible) return null;

  return (
    <div
      key={cycle}
      className="intro-splash"
      role="status"
      aria-live="polite"
      aria-label="Cargando Chamo Import"
    >
      <div
        className="intro-panel intro-panel-left"
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.animationName.includes("intro-door-left")) hide();
        }}
      />
      <div className="intro-panel intro-panel-right" />
      <div className="intro-gear" aria-hidden>
        <Cog className="intro-gear-main text-brand-gold" strokeWidth={1.6} />
        <Cog className="intro-gear-small text-white" strokeWidth={2} />
        <p className="intro-gear-label">Chamo Import</p>
      </div>
    </div>
  );
}

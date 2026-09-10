"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Cog } from "lucide-react";

export default function IntroSplash() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);
  const overflowRef = useRef("");
  const [visible, setVisible] = useState(true);
  const [variant, setVariant] = useState<"boot" | "nav">("boot");
  const [cycle, setCycle] = useState(0);

  const hide = useCallback(() => {
    document.body.style.overflow = overflowRef.current;
    setVisible(false);
  }, []);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    // El router de Next es un sistema externo: hay que sincronizar la transición.
    setVariant("nav");
    setCycle((n) => n + 1);
    setVisible(true);
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = window.setTimeout(hide, 0);
      return () => window.clearTimeout(skip);
    }

    overflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const safety = window.setTimeout(hide, variant === "boot" ? 3200 : 1800);

    return () => {
      window.clearTimeout(safety);
      document.body.style.overflow = overflowRef.current;
    };
  }, [visible, variant, cycle, hide]);

  if (!visible) return null;

  return (
    <div
      key={`${variant}-${cycle}`}
      className={`intro-splash intro-splash--${variant}`}
      role="status"
      aria-live="polite"
      aria-label={
        variant === "boot" ? "Cargando Chamo Import" : "Cambiando de página"
      }
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

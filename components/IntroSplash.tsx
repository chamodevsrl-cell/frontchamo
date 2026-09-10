"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Cog } from "lucide-react";

function isInternalPageLink(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname;
}

export default function IntroSplash() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);
  const overflowRef = useRef("");
  const lastPlay = useRef(0);
  const [visible, setVisible] = useState(true);
  const [variant, setVariant] = useState<"boot" | "nav">("boot");
  const [cycle, setCycle] = useState(0);

  const hide = useCallback(() => {
    document.body.style.overflow = overflowRef.current;
    setVisible(false);
  }, []);

  const playNav = useCallback(() => {
    const now = Date.now();
    if (now - lastPlay.current < 450) return;
    lastPlay.current = now;
    setVariant("nav");
    setCycle((n) => n + 1);
    setVisible(true);
  }, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalPageLink(anchor)) return;
      playNav();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", playNav);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", playNav);
    };
  }, [playNav]);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    playNav();
  }, [pathname, playNav]);

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

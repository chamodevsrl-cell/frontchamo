"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Cog, ShoppingCart } from "lucide-react";

type IntroVariant = "brand" | "cart";

function lockIntroScroll() {
  document.documentElement.classList.add("intro-playing");
}

function unlockIntroScroll() {
  document.documentElement.classList.remove("intro-playing");
}

function isSameOriginPath(href: string, path: string) {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin && url.pathname === path;
  } catch {
    return false;
  }
}

export default function IntroSplash() {
  const pathname = usePathname();
  const lastPlay = useRef(0);
  const lastPath = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [variant, setVariant] = useState<IntroVariant>(
    pathname === "/carrito" ? "cart" : "brand",
  );

  const hide = useCallback(() => {
    unlockIntroScroll();
    setVisible(false);
  }, []);

  const play = useCallback((next: IntroVariant) => {
    const now = Date.now();
    if (now - lastPlay.current < 450) return;
    lastPlay.current = now;
    setVariant(next);
    setCycle((n) => n + 1);
    setVisible(true);
  }, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;

      if (link.matches("[data-site-intro]")) {
        play("brand");
        return;
      }

      if (
        (link.matches("[data-cart-intro]") || isSameOriginPath(link.href, "/carrito")) &&
        window.location.pathname !== "/carrito"
      ) {
        play("cart");
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [play]);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (pathname === "/carrito") play("cart");
  }, [pathname, play]);

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
    const safety = window.setTimeout(hide, variant === "cart" ? 4200 : 3200);

    return () => {
      window.clearTimeout(safety);
      unlockIntroScroll();
    };
  }, [visible, cycle, hide, variant]);

  if (!visible) return null;

  return (
    <div
      key={`${variant}-${cycle}`}
      className={`intro-splash${variant === "cart" ? " intro-splash--cart" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={
        variant === "cart" ? "Entrando al carrito" : "Cargando Chamo Import"
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
      {variant === "cart" ? (
        <div className="intro-cart" aria-hidden>
          <ShoppingCart
            className="intro-cart-icon"
            strokeWidth={1.6}
          />
        </div>
      ) : (
        <div className="intro-gear" aria-hidden>
          <Cog className="intro-gear-main text-brand-gold" strokeWidth={1.6} />
          <Cog className="intro-gear-small text-white" strokeWidth={2} />
          <p className="intro-gear-label">Chamo Import</p>
        </div>
      )}
    </div>
  );
}

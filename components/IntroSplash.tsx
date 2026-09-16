"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Cog, ShoppingCart } from "lucide-react";
import BrandLoader, { BRAND_LOADER_MS } from "@/components/BrandLoader";
import { AUTH_TRANSITION_EVENT } from "@/components/AuthProvider";

type IntroVariant = "brand" | "cart" | "load";

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

function isAdminPath(path: string) {
  return path.startsWith("/admin");
}

function isProfilePath(path: string) {
  return path === "/cuenta/perfil";
}

/**
 * El loader "load" solo debe verse al cruzar hacia/desde el panel admin o la
 * página de editar perfil — no en cada navegación interna (catálogo,
 * categorías, ofertas, etc.).
 */
function isLoadBoundary(from: string, to: string) {
  if (isAdminPath(from) !== isAdminPath(to)) return true;
  if (isProfilePath(from) !== isProfilePath(to)) return true;
  return false;
}

/** Pathname de destino de un link interno navegable, o `null` si no aplica. */
function internalTargetPath(link: HTMLAnchorElement): string | null {
  if (link.target === "_blank" || link.hasAttribute("download")) return null;
  try {
    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      return null;
    }
    return url.pathname;
  } catch {
    return null;
  }
}

export default function IntroSplash() {
  const pathname = usePathname();
  const lastPlay = useRef(0);
  const lastPath = useRef(pathname);
  const cartClaimedByClick = useRef(false);
  const loadClaimedByClick = useRef(false);
  const sessionStart = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const variantRef = useRef<IntroVariant>(
    pathname === "/carrito" ? "cart" : "brand",
  );
  const [visible, setVisible] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [variant, setVariant] = useState<IntroVariant>(
    pathname === "/carrito" ? "cart" : "brand",
  );

  const hide = useCallback(() => {
    visibleRef.current = false;
    setVisible(false);
    if (variantRef.current !== "load") {
      unlockIntroScroll();
    }
  }, []);

  const play = useCallback((next: IntroVariant) => {
    const now = Date.now();
    if (next === "load") {
      if (visibleRef.current) return false;
      const started = sessionStart.current;
      if (started === null || now - started < BRAND_LOADER_MS + 400) return false;
    } else if (now - lastPlay.current < 450 && next === variantRef.current) {
      return false;
    }
    lastPlay.current = now;
    variantRef.current = next;
    visibleRef.current = true;
    setVariant(next);
    setCycle((n) => n + 1);
    setVisible(true);
    return true;
  }, []);

  useLayoutEffect(() => {
    sessionStart.current = Date.now();
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
        if (play("brand")) loadClaimedByClick.current = true;
        return;
      }

      if (
        (link.matches("[data-cart-intro]") || isSameOriginPath(link.href, "/carrito")) &&
        window.location.pathname !== "/carrito"
      ) {
        if (play("cart")) cartClaimedByClick.current = true;
        return;
      }

      const targetPath = internalTargetPath(link);
      if (targetPath && isLoadBoundary(window.location.pathname, targetPath)) {
        if (play("load")) loadClaimedByClick.current = true;
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [play]);

  useEffect(() => {
    function onAuthTransition() {
      play("load");
    }
    window.addEventListener(AUTH_TRANSITION_EVENT, onAuthTransition);
    return () => window.removeEventListener(AUTH_TRANSITION_EVENT, onAuthTransition);
  }, [play]);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    const previousPath = lastPath.current;
    lastPath.current = pathname;

    if (pathname === "/carrito") {
      loadClaimedByClick.current = false;
      if (cartClaimedByClick.current) {
        cartClaimedByClick.current = false;
        return;
      }
      play("cart");
      return;
    }

    cartClaimedByClick.current = false;
    if (loadClaimedByClick.current) {
      loadClaimedByClick.current = false;
      return;
    }
    if (isLoadBoundary(previousPath, pathname)) {
      play("load");
    }
  }, [pathname, play]);

  useLayoutEffect(() => {
    if (!visible) {
      if (variant !== "load") unlockIntroScroll();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = window.setTimeout(hide, 0);
      return () => window.clearTimeout(skip);
    }

    lockIntroScroll();
    const hold =
      variant === "cart" ? 4200 : variant === "load" ? BRAND_LOADER_MS : 3200;
    const safety = window.setTimeout(hide, hold);

    return () => {
      window.clearTimeout(safety);
      if (variant !== "load") unlockIntroScroll();
    };
  }, [visible, cycle, hide, variant]);

  if (variant === "load") {
    return (
      <BrandLoader
        visible={visible}
        onExited={() => {
          unlockIntroScroll();
        }}
      />
    );
  }

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
          <ShoppingCart className="intro-cart-icon" strokeWidth={1.6} />
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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import BrandLoader, { BRAND_LOADER_MS } from "@/components/BrandLoader";

function isAdminPath(path: string) {
  return path.startsWith("/admin");
}

function isProfilePath(path: string) {
  return path === "/cuenta/perfil";
}

/**
 * Único momento en que este loader debe verse: al cruzar hacia/desde el
 * panel admin o la página de editar perfil. La carga inicial / recarga la
 * cubre `Preloader.tsx` (otro componente) — no hay más animaciones de
 * transición en el sitio.
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
  const lastPath = useRef(pathname);
  const claimedByClick = useRef(false);
  const visibleRef = useRef(false);
  const [mountedAt] = useState(() => Date.now());
  const [visible, setVisible] = useState(false);

  const hide = useCallback(() => {
    visibleRef.current = false;
    setVisible(false);
  }, []);

  const play = useCallback(() => {
    if (visibleRef.current) return false;
    // No repetir el loader si `Preloader` (carga inicial) todavía lo está mostrando.
    if (Date.now() - mountedAt < BRAND_LOADER_MS + 400) return false;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return false;
    }
    visibleRef.current = true;
    setVisible(true);
    return true;
  }, [mountedAt]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;

      const targetPath = internalTargetPath(link);
      if (targetPath && isLoadBoundary(window.location.pathname, targetPath)) {
        if (play()) claimedByClick.current = true;
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [play]);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    const previousPath = lastPath.current;
    lastPath.current = pathname;

    if (claimedByClick.current) {
      claimedByClick.current = false;
      return;
    }
    if (isLoadBoundary(previousPath, pathname)) {
      play();
    }
  }, [pathname, play]);

  useEffect(() => {
    if (!visible) return;
    document.documentElement.classList.add("intro-playing");
    const timer = window.setTimeout(hide, BRAND_LOADER_MS);
    return () => window.clearTimeout(timer);
  }, [visible, hide]);

  return (
    <BrandLoader
      visible={visible}
      onExited={() => document.documentElement.classList.remove("intro-playing")}
    />
  );
}

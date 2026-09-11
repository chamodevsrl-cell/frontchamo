"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Heart } from "lucide-react";
import { getProductById, type FeaturedProduct } from "@/data/products";

const STORAGE_KEY = "chamo-favorites-v1";

type FavoritesContextValue = {
  ids: string[];
  products: FeaturedProduct[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (id): id is string => typeof id === "string" && id.length > 0,
    );
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number>(0);
  const idsRef = useRef<string[]>([]);

  const flash = useCallback((text: string) => {
    window.clearTimeout(noticeTimer.current);
    setNotice(text);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 1800);
  }, []);

  useEffect(() => {
    // Hidratar después del mount para coincidir con el HTML del servidor (badge 0).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setIds(parseIds(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, ready]);

  useEffect(() => {
    return () => window.clearTimeout(noticeTimer.current);
  }, []);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggle = useCallback((productId: string) => {
    const currentlyActive = idsRef.current.includes(productId);
    const nextActive = !currentlyActive;
    const next = currentlyActive
      ? idsRef.current.filter((id) => id !== productId)
      : [...idsRef.current, productId];
    idsRef.current = next;
    setIds(next);
    flash(nextActive ? "Guardado en favoritos" : "Quitado de favoritos");
    return nextActive;
  }, [flash]);

  const remove = useCallback((productId: string) => {
    setIds((current) => {
      const next = current.filter((id) => id !== productId);
      idsRef.current = next;
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    idsRef.current = [];
    setIds([]);
  }, []);

  const products = useMemo(
    () =>
      ids.flatMap((id) => {
        const product = getProductById(id);
        return product ? [product] : [];
      }),
    [ids],
  );

  const value = useMemo(
    () => ({
      ids,
      products,
      count: products.length,
      has,
      toggle,
      remove,
      clear,
    }),
    [ids, products, has, toggle, remove, clear],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      {notice ? (
        <p
          role="status"
          className="pointer-events-none fixed right-4 bottom-24 z-[80] inline-flex items-center gap-2 rounded-lg bg-brand-dark px-3 py-2 text-xs font-semibold text-white shadow-lg sm:bottom-8"
        >
          <Heart className="h-3.5 w-3.5" strokeWidth={2.25} fill="currentColor" aria-hidden />
          {notice}
        </p>
      ) : null}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  }
  return ctx;
}

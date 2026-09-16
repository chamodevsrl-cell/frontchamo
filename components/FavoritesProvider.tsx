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
import {
  FAVORITES_STORAGE_KEY,
  parseFavoriteItems,
  type FavoriteItem,
} from "@/lib/favorites";

type FavoritesContextValue = {
  /** Ids en orden de más reciente a más antiguo (derivado de `items`). */
  ids: string[];
  items: FavoriteItem[];
  products: FeaturedProduct[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number>(0);
  const itemsRef = useRef<FavoriteItem[]>([]);

  const flash = useCallback((text: string) => {
    window.clearTimeout(noticeTimer.current);
    setNotice(text);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 1800);
  }, []);

  useEffect(() => {
    // Hidratar después del mount para coincidir con el HTML del servidor (badge 0).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setItems(parseFavoriteItems(window.localStorage.getItem(FAVORITES_STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    return () => window.clearTimeout(noticeTimer.current);
  }, []);

  const ids = useMemo(
    () =>
      [...items]
        .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
        .map((item) => item.productId),
    [items],
  );

  const has = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const toggle = useCallback((productId: string) => {
    const currentlyActive = itemsRef.current.some((item) => item.productId === productId);
    const nextActive = !currentlyActive;
    const next = currentlyActive
      ? itemsRef.current.filter((item) => item.productId !== productId)
      : [
          ...itemsRef.current,
          { productId, addedAt: new Date().toISOString() },
        ];
    itemsRef.current = next;
    setItems(next);
    flash(nextActive ? "Guardado en favoritos" : "Quitado de favoritos");
    return nextActive;
  }, [flash]);

  const remove = useCallback((productId: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.productId !== productId);
      itemsRef.current = next;
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    itemsRef.current = [];
    setItems([]);
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
      items,
      products,
      count: products.length,
      has,
      toggle,
      remove,
      clear,
    }),
    [ids, items, products, has, toggle, remove, clear],
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

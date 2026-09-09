"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductById, type FeaturedProduct } from "@/data/products";

const STORAGE_KEY = "chamo-cart-v1";

export type CartLine = {
  productId: string;
  qty: number;
};

export type CartResolvedLine = CartLine & {
  product: FeaturedProduct;
};

type CartContextValue = {
  items: CartLine[];
  lines: CartResolvedLine[];
  count: number;
  addItem: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        line &&
        typeof line.productId === "string" &&
        Number.isFinite(line.qty) &&
        line.qty > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hidratar después del mount para coincidir con el HTML del servidor (badge 0).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setItems(parseCart(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((productId: string, qty = 1) => {
    const amount = Math.max(1, Math.floor(qty));
    setItems((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (!existing) return [...current, { productId, qty: amount }];
      return current.map((line) =>
        line.productId === productId
          ? { ...line, qty: line.qty + amount }
          : line,
      );
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const amount = Math.floor(qty);
    setItems((current) => {
      if (amount < 1) {
        return current.filter((line) => line.productId !== productId);
      }
      return current.map((line) =>
        line.productId === productId ? { ...line, qty: amount } : line,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const lines = useMemo(
    () =>
      items.flatMap((line) => {
        const product = getProductById(line.productId);
        return product ? [{ ...line, product }] : [];
      }),
    [items],
  );

  const count = useMemo(
    () => lines.reduce((sum, line) => sum + line.qty, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ items, lines, count, addItem, setQty, removeItem, clear }),
    [items, lines, count, addItem, setQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}

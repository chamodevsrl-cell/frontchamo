"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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

const listeners = new Set<() => void>();
let memoryCart: CartLine[] = [];
let didRead = false;

function emit() {
  listeners.forEach((listener) => listener());
}

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

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  if (!didRead) {
    memoryCart = parseCart(window.localStorage.getItem(STORAGE_KEY));
    didRead = true;
  }
  return memoryCart;
}

function writeCart(next: CartLine[]) {
  memoryCart = next;
  didRead = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): CartLine[] {
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readCart, getServerSnapshot);

  const addItem = useCallback((productId: string, qty = 1) => {
    const amount = Math.max(1, Math.floor(qty));
    const current = readCart();
    const existing = current.find((line) => line.productId === productId);
    if (!existing) {
      writeCart([...current, { productId, qty: amount }]);
      return;
    }
    writeCart(
      current.map((line) =>
        line.productId === productId
          ? { ...line, qty: line.qty + amount }
          : line,
      ),
    );
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const amount = Math.floor(qty);
    const current = readCart();
    if (amount < 1) {
      writeCart(current.filter((line) => line.productId !== productId));
      return;
    }
    writeCart(
      current.map((line) =>
        line.productId === productId ? { ...line, qty: amount } : line,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    writeCart(readCart().filter((line) => line.productId !== productId));
  }, []);

  const clear = useCallback(() => writeCart([]), []);

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

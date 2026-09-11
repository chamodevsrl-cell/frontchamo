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
  quantity: number;
  /** Precio unitario referencial al momento de agregar (no se recalcula solo). */
  unitPrice: number;
  /** Precio mayorista al momento de agregar. */
  wholesaleUnitPrice: number;
};

export type CartResolvedLine = CartLine & {
  product: FeaturedProduct;
  /** true si el precio vivo del catálogo ya no coincide con el guardado. */
  priceChanged: boolean;
};

type CartContextValue = {
  items: CartLine[];
  lines: CartResolvedLine[];
  count: number;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Acepta el formato viejo (`qty`, sin precio) y lo migra al nuevo en la lectura. */
function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((row): CartLine[] => {
      if (!row || typeof row !== "object") return [];
      const line = row as Record<string, unknown>;
      const productId =
        typeof line.productId === "string" ? line.productId : null;
      const rawQuantity =
        typeof line.quantity === "number"
          ? line.quantity
          : typeof line.qty === "number" // formato viejo
            ? line.qty
            : NaN;
      if (!productId || !Number.isFinite(rawQuantity) || rawQuantity <= 0) {
        return [];
      }
      const quantity = Math.floor(rawQuantity);

      let unitPrice =
        typeof line.unitPrice === "number" ? line.unitPrice : null;
      let wholesaleUnitPrice =
        typeof line.wholesaleUnitPrice === "number"
          ? line.wholesaleUnitPrice
          : null;

      if (unitPrice === null || wholesaleUnitPrice === null) {
        // Línea del formato viejo: no traía precio, se rellena con el vivo del catálogo.
        const product = getProductById(productId);
        if (!product) return [];
        unitPrice ??= product.price;
        wholesaleUnitPrice ??= product.wholesalePrice;
      }

      return [{ productId, quantity, unitPrice, wholesaleUnitPrice }];
    });
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

  const addItem = useCallback((productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    const amount = Math.max(1, Math.floor(quantity));
    setItems((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (!existing) {
        return [
          ...current,
          {
            productId,
            quantity: amount,
            // Precio al momento de agregar; no se toca aunque el catálogo cambie después.
            unitPrice: product.price,
            wholesaleUnitPrice: product.wholesalePrice,
          },
        ];
      }
      return current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: line.quantity + amount }
          : line,
      );
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const amount = Math.floor(quantity);
    setItems((current) => {
      if (amount < 1) {
        return current.filter((line) => line.productId !== productId);
      }
      return current.map((line) =>
        line.productId === productId ? { ...line, quantity: amount } : line,
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
        if (!product) return [];
        const priceChanged =
          product.price !== line.unitPrice ||
          product.wholesalePrice !== line.wholesaleUnitPrice;
        return [{ ...line, product, priceChanged }];
      }),
    [items],
  );

  const count = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ items, lines, count, addItem, setQuantity, removeItem, clear }),
    [items, lines, count, addItem, setQuantity, removeItem, clear],
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

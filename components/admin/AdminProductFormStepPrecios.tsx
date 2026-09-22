"use client";

import type { ProductStatus } from "@/types/admin";

const STATUSES: ProductStatus[] = ["active", "draft", "archived"];

export default function AdminProductFormStepPrecios({
  price,
  setPrice,
  stock,
  setStock,
  minStock,
  setMinStock,
  status,
  setStatus,
  isFeatured,
  setIsFeatured,
  isOnOffer,
  setIsOnOffer,
  oldPrice,
  setOldPrice,
}: {
  price: string;
  setPrice: (value: string) => void;
  stock: string;
  setStock: (value: string) => void;
  minStock: string;
  setMinStock: (value: string) => void;
  status: ProductStatus;
  setStatus: (value: ProductStatus) => void;
  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;
  isOnOffer: boolean;
  setIsOnOffer: (value: boolean) => void;
  oldPrice: string;
  setOldPrice: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-dark">
        Fase 3 — Precios y stock
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold">
          Precio (S/)
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            type="number"
            min={0}
            step="0.01"
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Stock
          <input
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Stock mínimo
          <input
            value={minStock}
            onChange={(event) => setMinStock(event.target.value)}
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Estado
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ProductStatus)}
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          >
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-6 flex items-center gap-2 text-sm font-semibold sm:mt-0 sm:self-end">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
            className="rounded border-brand-dark/20"
          />
          Destacado
        </label>
      </div>

      <div className="rounded-xl border border-brand-dark/10 bg-brand-gray/40 p-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={isOnOffer}
            onChange={(event) => setIsOnOffer(event.target.checked)}
            className="rounded border-brand-dark/20"
          />
          En oferta
        </label>
        {isOnOffer ? (
          <label className="mt-3 block text-sm font-semibold">
            Precio anterior (S/)
            <input
              value={oldPrice}
              onChange={(event) => setOldPrice(event.target.value)}
              type="number"
              min={0}
              step="0.01"
              placeholder="Precio antes del descuento"
              className="mt-1 w-full max-w-xs rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            />
            <span className="mt-1 block text-xs font-normal text-brand-dark/50">
              Debe ser mayor que el precio de arriba para que se vea el
              descuento en la tienda.
            </span>
          </label>
        ) : null}
      </div>
    </div>
  );
}

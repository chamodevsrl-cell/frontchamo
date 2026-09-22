"use client";

import { Image as ImageIcon } from "lucide-react";

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminProductPreviewCard({
  image,
  name,
  brand,
  sku,
  price,
  oldPrice,
  discountPercent,
  isFeatured,
  isOnOffer,
}: {
  image: string | undefined;
  name: string;
  brand: string;
  sku: string;
  price: number;
  oldPrice: number;
  discountPercent: number;
  isFeatured: boolean;
  isOnOffer: boolean;
}) {
  return (
    <aside className="h-fit rounded-2xl border border-brand-dark/10 bg-white p-4 shadow-sm lg:sticky lg:top-4">
      <p className="text-xs font-semibold tracking-wide text-brand-dark/50 uppercase">
        Vista previa en la tienda
      </p>
      <div className="mt-3 overflow-hidden rounded-xl border border-brand-dark/10">
        <div className="flex aspect-square items-center justify-center bg-brand-gray">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name || "Producto"} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-10 w-10 text-brand-dark/25" strokeWidth={1.5} />
          )}
        </div>
        <div className="space-y-1 p-3">
          <div className="flex flex-wrap gap-1">
            {isFeatured ? (
              <span className="inline-block rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-bold text-brand-gold uppercase">
                Destacado
              </span>
            ) : null}
            {isOnOffer ? (
              <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 uppercase">
                {discountPercent > 0 ? `-${discountPercent}% OFF` : "Oferta"}
              </span>
            ) : null}
          </div>
          <p className="text-[11px] font-semibold text-brand-dark/50 uppercase">
            {brand || "Sin marca"}
          </p>
          <p className="font-display text-sm font-bold text-brand-dark">
            {name || "Nombre del producto"}
          </p>
          <p className="text-xs text-brand-dark/40">SKU: {sku || "—"}</p>
          <p className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-brand-primary">
              {price > 0 ? soles(price) : "Consultar"}
            </span>
            {isOnOffer && oldPrice > price ? (
              <span className="text-xs text-brand-dark/40 line-through">
                {soles(oldPrice)}
              </span>
            ) : null}
          </p>
          <button
            type="button"
            disabled
            className="mt-1 w-full rounded-lg bg-brand-primary py-2 text-xs font-semibold text-white opacity-90"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </aside>
  );
}

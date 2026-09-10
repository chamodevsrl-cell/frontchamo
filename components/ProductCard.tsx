"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { BadgePercent, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { FeaturedProduct } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";
import CompareButton from "@/components/CompareButton";

type ProductCardProps = {
  product: FeaturedProduct;
  onOpen: () => void;
  onAddToCart?: () => void;
};

export default function ProductCard({
  product,
  onOpen,
  onAddToCart,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  function handleAdd(event: MouseEvent) {
    event.stopPropagation();
    if (!onAddToCart) {
      onOpen();
      return;
    }
    onAddToCart();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-brand-primary/35 bg-white shadow-[0_0_0_1px_rgba(18,126,201,0.12),0_0_18px_rgba(18,126,201,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(18,126,201,0.25),0_0_28px_rgba(18,126,201,0.55)] lg:rounded-2xl dark:bg-[#102a40] dark:text-white"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-gray sm:aspect-[4/3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 72vw, 18.5rem"
        />

        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-brand-dark uppercase sm:top-3 sm:left-3 sm:px-2 sm:py-1 sm:text-[10px] ${
            product.badge === "oferta"
              ? "bg-[#cfe8f8]"
              : "bg-brand-gold/90 text-brand-dark"
          }`}
        >
          {product.badge === "oferta" ? (
            <BadgePercent className="h-3 w-3" strokeWidth={2.5} aria-hidden />
          ) : (
            <Star className="h-3 w-3" strokeWidth={2.5} aria-hidden />
          )}
          {product.badge === "oferta" && product.discount
            ? `-${product.discount}% OFERTA`
            : "DESTACADO"}
        </span>

        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 sm:top-3 sm:right-3">
          <FavoriteButton productId={product.id} />
          <CompareButton productId={product.id} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pt-2.5 pb-3 sm:px-4 sm:pt-3 sm:pb-4">
        <div className="hidden items-center justify-between gap-2 sm:flex">
          <p className="text-[11px] font-bold tracking-wide text-brand-primary uppercase">
            {product.brand}
          </p>
          <p className="text-[11px] text-brand-dark/45 dark:text-white/45">
            SKU: {product.sku}
          </p>
        </div>

        <h3 className="line-clamp-2 text-center font-display text-[11px] font-bold tracking-wide text-brand-dark uppercase sm:mt-1.5 sm:text-left sm:text-base sm:normal-case dark:text-white">
          {product.name}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5 sm:mt-2 sm:justify-start">
          <span className="font-display text-sm font-bold text-brand-primary sm:text-xl">
            {formatPrice(product.price)}
          </span>
          <span className="hidden text-sm text-brand-dark/40 line-through sm:inline dark:text-white/40">
            {formatPrice(product.oldPrice)}
          </span>
        </div>
        <p className="mt-0.5 hidden text-xs text-brand-dark/55 sm:block dark:text-white/55">
          Mayorista: {formatPrice(product.wholesalePrice)} (x volumen)
        </p>

        <p className="mt-1.5 hidden items-center gap-1.5 text-xs font-medium text-emerald-600 sm:mt-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          En stock ({product.stock} unids)
        </p>

        <div className="mt-auto flex gap-2 pt-2.5 sm:pt-3">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#7EB1F7] px-2 py-2 text-[10px] font-bold tracking-wide text-brand-dark uppercase transition hover:bg-brand-primary hover:text-white sm:gap-2 sm:rounded-lg sm:bg-brand-primary sm:px-3 sm:py-2.5 sm:text-sm sm:font-semibold sm:normal-case sm:text-white sm:hover:bg-brand-dark"
          >
            <ShoppingCart className="hidden h-4 w-4 sm:block" strokeWidth={2} />
            {added ? "Agregado" : "Añadir al carrito"}
          </button>
          <CompareButton
            productId={product.id}
            variant="box"
            className="shrink-0"
          />
        </div>
      </div>
    </article>
  );
}

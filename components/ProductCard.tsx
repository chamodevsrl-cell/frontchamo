"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgePercent, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { productPath, type FeaturedProduct } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";
import CompareButton from "@/components/CompareButton";

type ProductCardProps = {
  product: FeaturedProduct;
  onAddToCart?: () => void;
};

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const href = productPath(product.id);

  function handleAdd(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (!onAddToCart) return;
    onAddToCart();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="card-glow group relative flex h-full flex-col overflow-hidden rounded-xl bg-white transition duration-300 hover:-translate-y-0.5 lg:rounded-2xl dark:bg-[#102a40] dark:text-white">
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 sm:top-3 sm:right-3">
        <FavoriteButton productId={product.id} />
        <CompareButton productId={product.id} />
      </div>

      <Link href={href} className="flex min-h-0 flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-brand-gray sm:aspect-[4/3]">
          <Image
            src={product.images[0]}
            alt=""
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
            {product.badge === "oferta" && product.discountPercent
              ? `-${product.discountPercent}% OFERTA`
              : "DESTACADO"}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-2.5 pt-2.5 sm:px-4 sm:pt-3">
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
        </div>
      </Link>

      <div className="flex gap-2 px-2.5 pt-2.5 pb-3 sm:px-4 sm:pt-3 sm:pb-4">
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
    </article>
  );
}

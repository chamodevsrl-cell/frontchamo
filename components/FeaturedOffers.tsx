"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GitCompareArrows, Heart, ShoppingCart } from "lucide-react";
import { featuredProducts, type FeaturedProduct } from "@/data/products";
import ProductModal from "@/components/ProductModal";

function formatPrice(value: number) {
  return value.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  });
}

function ProductCard({
  product,
  onOpen,
}: {
  product: FeaturedProduct;
  onOpen: () => void;
}) {
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
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-brand-primary/35 bg-white shadow-[0_0_0_1px_rgba(18,126,201,0.12),0_0_18px_rgba(18,126,201,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(18,126,201,0.25),0_0_28px_rgba(18,126,201,0.55)] lg:rounded-2xl"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-gray sm:aspect-[4/3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 46vw, 25vw"
        />

        <span
          className={`absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-brand-dark uppercase sm:top-3 sm:left-3 sm:px-2 sm:py-1 sm:text-[10px] ${
            product.badge === "oferta"
              ? "bg-[#cfe8f8]"
              : "bg-brand-gold/90 text-brand-dark"
          }`}
        >
          {product.badge === "oferta" && product.discount
            ? `-${product.discount}% OFERTA`
            : "DESTACADO"}
        </span>

        <div className="absolute top-2 right-2 hidden flex-col gap-2 sm:top-3 sm:right-3 sm:flex">
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm transition hover:text-brand-primary"
            aria-label="Agregar a favoritos"
          >
            <Heart className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm transition hover:text-brand-primary"
            aria-label="Comparar producto"
          >
            <GitCompareArrows className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pt-2.5 pb-3 sm:px-4 sm:pt-3 sm:pb-4">
        <div className="hidden items-center justify-between gap-2 sm:flex">
          <p className="text-[11px] font-bold tracking-wide text-brand-primary uppercase">
            {product.brand}
          </p>
          <p className="text-[11px] text-brand-dark/45">SKU: {product.sku}</p>
        </div>

        <h3 className="line-clamp-2 text-center font-display text-[11px] font-bold tracking-wide text-brand-dark uppercase sm:mt-1.5 sm:text-left sm:text-base sm:normal-case">
          {product.name}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5 sm:mt-2 sm:justify-start">
          <span className="font-display text-sm font-bold text-brand-primary sm:text-xl">
            {formatPrice(product.price)}
          </span>
          <span className="hidden text-sm text-brand-dark/40 line-through sm:inline">
            {formatPrice(product.oldPrice)}
          </span>
        </div>
        <p className="mt-0.5 hidden text-xs text-brand-dark/55 sm:block">
          Mayorista: {formatPrice(product.wholesalePrice)} (x volumen)
        </p>

        <p className="mt-1.5 hidden items-center gap-1.5 text-xs font-medium text-emerald-600 sm:mt-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          En stock ({product.stock} unids)
        </p>

        <div className="mt-auto flex gap-2 pt-2.5 sm:pt-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#7EB1F7] px-2 py-2 text-[10px] font-bold tracking-wide text-brand-dark uppercase transition hover:bg-brand-primary hover:text-white sm:gap-2 sm:rounded-lg sm:bg-brand-primary sm:px-3 sm:py-2.5 sm:text-sm sm:font-semibold sm:normal-case sm:text-white sm:hover:bg-brand-dark"
          >
            <ShoppingCart className="hidden h-4 w-4 sm:block" strokeWidth={2} />
            Añadir al carrito
          </button>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedOffers() {
  const [selected, setSelected] = useState<FeaturedProduct | null>(null);

  return (
    <section aria-labelledby="ofertas-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-[#cfe8f8] px-3 py-1 text-[11px] font-bold tracking-wide text-brand-primary uppercase">
            # Selección destacada
          </span>
          <h2
            id="ofertas-heading"
            className="mt-2 font-display text-2xl font-bold text-brand-dark sm:text-3xl"
          >
            Productos Destacados y Ofertas Mayoristas
          </h2>
          <p className="mt-1 max-w-xl text-sm text-brand-dark/60">
            Los productos de mayor demanda con stock listo para despacho
            inmediato.
          </p>
        </div>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-gray px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-primary hover:text-white"
        >
          Ver Todo el Catálogo
          <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
        </Link>
      </div>

      {/* Móvil: carrusel horizontal (2 tarjetas + peek) */}
      <div className="-mx-4 sm:-mx-6 lg:mx-0">
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:gap-4 sm:px-6 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <li
              key={product.id}
              className="w-[min(46vw,11.5rem)] shrink-0 snap-start sm:w-[min(42vw,14rem)] lg:w-auto lg:shrink"
            >
              <ProductCard
                product={product}
                onOpen={() => setSelected(product)}
              />
            </li>
          ))}
        </ul>
      </div>

      {selected ? (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      ) : null}
    </section>
  );
}

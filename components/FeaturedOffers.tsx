"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeFeaturedProducts, type FeaturedProduct } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Reveal from "@/components/Reveal";
import { useCart } from "@/components/CartProvider";

export default function FeaturedOffers() {
  const [selected, setSelected] = useState<FeaturedProduct | null>(null);
  const { addItem } = useCart();

  return (
    <section aria-labelledby="ofertas-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-[#cfe8f8] px-3 py-1 text-[11px] font-bold tracking-wide text-brand-primary uppercase">
            # Selección destacada
          </span>
          <h2
            id="ofertas-heading"
            className="mt-2 font-display text-2xl font-bold text-brand-dark sm:text-3xl dark:text-white"
          >
            Productos Destacados y Ofertas Mayoristas
          </h2>
          <p className="mt-1 max-w-xl text-sm text-brand-dark/60 dark:text-white/60">
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

      <div className="-mx-4 sm:-mx-6 lg:mx-0">
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:gap-4 sm:px-6 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-4">
          {homeFeaturedProducts.map((product, index) => (
            <li
              key={product.id}
              className="w-[min(46vw,11.5rem)] shrink-0 snap-start sm:w-[min(42vw,14rem)] lg:w-auto lg:shrink"
            >
              <Reveal delayMs={Math.min(index, 6) * 70}>
                <ProductCard
                  product={product}
                  onOpen={() => setSelected(product)}
                  onAddToCart={() => addItem(product.id, 1)}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {selected ? (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
          onSelectProduct={(product) => setSelected(product)}
        />
      ) : null}
    </section>
  );
}

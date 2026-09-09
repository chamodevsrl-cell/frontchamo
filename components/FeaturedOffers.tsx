"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { homeFeaturedProducts, type FeaturedProduct } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Reveal from "@/components/Reveal";
import { useCart } from "@/components/CartProvider";

export default function FeaturedOffers() {
  const [selected, setSelected] = useState<FeaturedProduct | null>(null);
  const { addItem } = useCart();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card
      ? card.getBoundingClientRect().width + 16
      : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section aria-labelledby="ofertas-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div className="flex min-w-0 flex-1 flex-wrap items-end justify-between gap-3">
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
            className="text-sm font-semibold text-brand-primary transition hover:text-brand-dark"
          >
            Ver todo el catálogo
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Productos anteriores"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark shadow-[0_2px_10px_rgba(11,53,84,0.12)] transition hover:border-brand-primary/40 hover:text-brand-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Productos siguientes"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark shadow-[0_2px_10px_rgba(11,53,84,0.12)] transition hover:border-brand-primary/40 hover:text-brand-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="-mx-4 sm:-mx-6 lg:mx-0">
        <ul
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 scrollbar-none sm:gap-4 sm:px-6 lg:gap-5 lg:px-0"
        >
          {homeFeaturedProducts.map((product, index) => (
            <li
              key={product.id}
              className="w-[min(78vw,18rem)] shrink-0 snap-start sm:w-[min(48vw,20rem)] lg:w-[17.5rem] xl:w-[18.75rem]"
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

      <p className="mt-1 flex items-center justify-center gap-2 text-xs text-brand-dark/45 lg:hidden">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Desliza para ver más
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </p>

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

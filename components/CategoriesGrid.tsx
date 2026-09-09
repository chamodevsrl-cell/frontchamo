"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { mainCategories, type MainCategory } from "@/data/home";

const shinyCard =
  "border border-brand-primary/35 shadow-[0_0_0_1px_rgba(18,126,201,0.12),0_0_18px_rgba(18,126,201,0.35)] hover:shadow-[0_0_0_1px_rgba(18,126,201,0.25),0_0_28px_rgba(18,126,201,0.55)]";

function CategoryCard({ category }: { category: MainCategory }) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl text-brand-dark transition duration-300 hover:-translate-y-0.5 dark:bg-[#102a40] dark:text-white ${shinyCard}`}
      style={{ backgroundColor: category.tint }}
    >
      <div className="flex flex-1 flex-col px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 lg:px-6 lg:pt-6 dark:bg-[#102a40]">
        <p className="text-[10px] font-bold tracking-[0.12em] text-brand-primary uppercase sm:text-[11px] lg:text-xs">
          {category.eyebrow}
        </p>
        <h3 className="font-display mt-1.5 text-xl font-extrabold tracking-tight text-brand-dark uppercase sm:mt-2 sm:text-2xl lg:text-[1.65rem] dark:text-white">
          {category.label}
        </h3>

        <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
          {category.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-xs text-brand-dark/75 sm:gap-2.5 sm:text-sm dark:text-white/80"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary"
                aria-hidden
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <Link
          href={category.href}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_14px_rgba(18,126,201,0.45)] transition hover:bg-brand-dark sm:mt-5 sm:px-4 sm:py-2 sm:text-sm"
        >
          Explorar
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-brand-primary/15 bg-white/50">
          <Image
            src={category.image}
            alt={category.imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 72vw, 18.5rem"
          />
        </div>
      </div>
    </article>
  );
}

export default function CategoriesGrid() {
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
    <section aria-labelledby="categorias-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div className="flex min-w-0 flex-1 flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-brand-primary" aria-hidden />
            <h2
              id="categorias-heading"
              className="font-display text-2xl font-bold text-brand-dark sm:text-3xl dark:text-white"
            >
              Categorías principales
            </h2>
          </div>
          <Link
            href="/categorias"
            className="text-sm font-semibold text-brand-primary transition hover:text-brand-dark"
          >
            Ver todas
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Categorías anteriores"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark shadow-[0_2px_10px_rgba(11,53,84,0.12)] transition hover:border-brand-primary/40 hover:text-brand-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Categorías siguientes"
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
          {mainCategories.map((category) => (
            <li
              key={category.href}
              className="w-[min(78vw,18rem)] shrink-0 snap-start sm:w-[min(48vw,20rem)] lg:w-[17.5rem] xl:w-[18.75rem]"
            >
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-1 flex items-center justify-center gap-2 text-xs text-brand-dark/45 lg:hidden">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Desliza para ver más
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </p>
    </section>
  );
}

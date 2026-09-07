"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { mainCategories } from "@/data/home";

const VISIBLE_MOBILE = 3;

function CategoryCard({
  href,
  label,
  accent,
}: {
  href: string;
  label: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(11,53,84,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,53,84,0.12)]"
    >
      <div
        className="relative flex aspect-square items-center justify-center"
        style={{
          background: `linear-gradient(160deg, ${accent}14 0%, #f4f4f4 55%, #ffffff 100%)`,
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-105 sm:h-16 sm:w-16"
          style={{ backgroundColor: `${accent}18` }}
        >
          <Wrench
            className="h-7 w-7 sm:h-8 sm:w-8"
            style={{ color: accent }}
            strokeWidth={1.75}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-brand-dark/5 px-2.5 py-2.5 sm:px-3 sm:py-3">
        <span className="font-display text-xs font-bold text-brand-dark group-hover:text-brand-primary sm:text-sm">
          {label}
        </span>
        <ArrowRight
          className="h-3.5 w-3.5 shrink-0 text-brand-primary opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:h-4 sm:w-4"
          strokeWidth={2.25}
        />
      </div>
    </Link>
  );
}

export default function CategoriesGrid() {
  const [startIndex, setStartIndex] = useState(0);
  const maxStart = Math.max(0, mainCategories.length - VISIBLE_MOBILE);
  const visibleCategories = mainCategories.slice(
    startIndex,
    startIndex + VISIBLE_MOBILE,
  );

  function goPrev() {
    setStartIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setStartIndex((current) => Math.min(maxStart, current + 1));
  }

  return (
    <section aria-labelledby="categorias-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-brand-primary" aria-hidden />
          <h2
            id="categorias-heading"
            className="font-display text-2xl font-bold text-brand-dark sm:text-3xl"
          >
            Categorías principales
          </h2>
        </div>
        <Link
          href="/categorias"
          className="text-sm font-semibold text-brand-primary transition hover:text-brand-dark"
        >
          Ver todas las categorías
        </Link>
      </div>

      {/* Móvil / tablet: 3 visibles + flechas */}
      <div className="lg:hidden">
        <div className="relative">
          <ul className="grid grid-cols-3 gap-2 sm:gap-3">
            {visibleCategories.map((category) => (
              <li key={category.href}>
                <CategoryCard
                  href={category.href}
                  label={category.label}
                  accent={category.accent}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={goPrev}
            disabled={startIndex === 0}
            className="absolute top-1/2 -left-1 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-primary text-white shadow-md transition hover:bg-brand-dark disabled:pointer-events-none disabled:opacity-30 sm:-left-2"
            aria-label="Categorías anteriores"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={startIndex >= maxStart}
            className="absolute top-1/2 -right-1 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-primary text-white shadow-md transition hover:bg-brand-dark disabled:pointer-events-none disabled:opacity-30 sm:-right-2"
            aria-label="Categorías siguientes"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <ArrowLeft className="h-3.5 w-3.5 text-brand-dark/35" strokeWidth={2} />
          <p className="text-xs font-medium text-brand-dark/55">
            {startIndex + 1}–{Math.min(startIndex + VISIBLE_MOBILE, mainCategories.length)}{" "}
            de {mainCategories.length}
          </p>
          <ArrowRight className="h-3.5 w-3.5 text-brand-dark/35" strokeWidth={2} />
        </div>
      </div>

      {/* Desktop: grilla completa */}
      <ul className="hidden gap-4 lg:grid lg:grid-cols-4 xl:grid-cols-5">
        {mainCategories.map((category) => (
          <li key={category.href}>
            <CategoryCard
              href={category.href}
              label={category.label}
              accent={category.accent}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

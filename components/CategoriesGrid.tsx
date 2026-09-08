"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mainCategories, type MainCategory } from "@/data/home";

const shinyCard =
  "border border-brand-primary/35 shadow-[0_0_0_1px_rgba(18,126,201,0.12),0_0_18px_rgba(18,126,201,0.35)] hover:shadow-[0_0_0_1px_rgba(18,126,201,0.25),0_0_28px_rgba(18,126,201,0.55)]";

function CategoryCard({ category }: { category: MainCategory }) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-xl transition duration-300 hover:-translate-y-0.5 lg:rounded-2xl ${shinyCard}`}
      style={{ backgroundColor: category.tint }}
    >
      <div className="flex flex-1 flex-col px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4 lg:px-6 lg:pt-6">
        <p className="text-[10px] font-bold tracking-[0.12em] text-brand-primary uppercase sm:text-[11px] lg:text-xs">
          {category.eyebrow}
        </p>
        <h3 className="font-display mt-1.5 text-xl font-extrabold tracking-tight text-brand-dark uppercase sm:mt-2 sm:text-2xl lg:text-[1.65rem]">
          {category.label}
        </h3>

        <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
          {category.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-xs text-brand-dark/75 sm:gap-2.5 sm:text-sm"
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
            sizes="(max-width: 1024px) 72vw, 25vw"
          />
        </div>
      </div>
    </article>
  );
}

export default function CategoriesGrid() {
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
          className="inline-flex items-center gap-2 rounded-lg bg-brand-gray px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-primary hover:text-white"
        >
          Ver todas las categorías
          <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
        </Link>
      </div>

      {/* Móvil/tablet: carrusel horizontal (misma idea que FeaturedOffers) */}
      <div className="-mx-4 sm:-mx-6 lg:mx-0">
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:gap-4 sm:px-6 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-4">
          {mainCategories.map((category) => (
            <li
              key={category.href}
              className="w-[min(78vw,18rem)] shrink-0 snap-start sm:w-[min(48vw,20rem)] lg:w-auto lg:shrink"
            >
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

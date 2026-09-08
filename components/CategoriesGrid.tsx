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
      className={`group flex h-full flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.5 ${shinyCard}`}
      style={{ backgroundColor: category.tint }}
    >
      <div className="flex flex-1 flex-col px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
        <p className="text-[11px] font-bold tracking-[0.12em] text-brand-primary uppercase sm:text-xs">
          {category.eyebrow}
        </p>
        <h3 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-brand-dark uppercase sm:text-[1.65rem]">
          {category.label}
        </h3>

        <ul className="mt-4 space-y-2">
          {category.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2.5 text-sm text-brand-dark/75"
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
          className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-[0_0_14px_rgba(18,126,201,0.45)] transition hover:bg-brand-dark"
        >
          Explorar
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-brand-primary/15 bg-white/50">
          <Image
            src={category.image}
            alt={category.imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
          className="text-sm font-semibold text-brand-primary transition hover:text-brand-dark"
        >
          Ver todas las categorías
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {mainCategories.map((category) => (
          <li key={category.href}>
            <CategoryCard category={category} />
          </li>
        ))}
      </ul>
    </section>
  );
}

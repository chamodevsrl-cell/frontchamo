"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { mainCategories, type MainCategory } from "@/data/home";
import { useSiteContent } from "@/components/ContentProvider";
import Reveal from "@/components/Reveal";
import CategoryIcon from "@/components/CategoryIcon";
import Image from "next/image";
import SkeletonImage from "@/components/ui/SkeletonImage";

function CategoryCard({ category }: { category: MainCategory }) {
    return (
      <article className="card-glow group relative h-[230px] overflow-hidden rounded-2xl bg-[#102a40] transition-all duration-500 hover:-translate-y-1 sm:h-[280px] lg:h-[280px]">
  
{/* Imagen de fondo con Skeleton Loading */}
<div className="absolute inset-0 overflow-hidden">
  <SkeletonImage
    src={category.image}
    alt={category.imageAlt || category.label}
    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 384px"
    className="object-center transition-transform duration-700 group-hover:scale-110"
  />
</div>

  
        {/* Degradado oscuro */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061b2d]/95 via-[#061b2d]/55 to-[#061b2d]/10 transition-all duration-500 group-hover:from-[#061b2d]"
          aria-hidden="true"
        />
  
        {/* Contenido */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-6">
  
          {/* Icono */}
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-brand-primary shadow-lg">
            <CategoryIcon
              slug={category.slug}
              icon={category.icon}
              className="h-5 w-5 text-white"
            />
          </div>
  
          {/* Nombre */}
          <h3 className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
            {category.label}
          </h3>
  
          {/* Descripción */}
          <p className="mt-2 line-clamp-2 max-w-[85%] text-sm leading-relaxed text-white/85">
            {category.bullets.slice(0, 2).join(" · ")}
          </p>
  
          {/* Enlace */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90">
              Explorar categoría
            </span>
  
            <Link
              href={category.href}
              aria-label={`Explorar ${category.label}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:border-brand-primary hover:bg-brand-primary hover:scale-110"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

export default function CategoriesGrid() {
  const { categories } = useSiteContent();
  const list = categories.length > 0 ? categories : mainCategories;
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
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "16") || 16;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section aria-labelledby="categorias-heading">

<div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

{/* Título */}
<div className="flex min-w-0 items-center gap-3">
  <span
    className="h-9 w-1 shrink-0 rounded-full bg-brand-primary"
    aria-hidden
  />

  <h2
    id="categorias-heading"
    className="font-display text-xl font-bold leading-tight text-brand-dark sm:text-3xl dark:text-white"
  >
    Categorías principales
  </h2>
</div>

{/* Acciones */}
<div className="flex items-center justify-between gap-3 sm:justify-end">

  <Link
    href="/categorias"
    className="text-sm font-semibold text-brand-primary transition hover:text-brand-dark"
  >
    Ver todas
  </Link>

  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => scrollByCard(-1)}
      disabled={!canPrev}
      aria-label="Categorías anteriores"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark shadow-sm transition hover:text-brand-primary disabled:opacity-35"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>

    <button
      type="button"
      onClick={() => scrollByCard(1)}
      disabled={!canNext}
      aria-label="Categorías siguientes"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark shadow-sm transition hover:text-brand-primary disabled:opacity-35"
    >
      <ChevronRight className="h-5 w-5" />
    </button>
  </div>
</div>
</div>


<div className="w-full min-w-0 overflow-hidden">
  <ul
    ref={scrollerRef}
    className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 scrollbar-none"
  >
          {list.map((category, index) => (
            <li
              key={category.href}
              className="w-[min(85vw,22rem)] shrink-0 snap-start sm:w-[min(48vw,24rem)] lg:w-[22rem] xl:w-[24rem]"
            >
              <Reveal delayMs={Math.min(index, 6) * 70}>
                <CategoryCard category={category} />
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
    </section>
  );
}

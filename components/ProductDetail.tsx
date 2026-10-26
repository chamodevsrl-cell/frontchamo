"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Lock,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  productPath,
  type FeaturedProduct,
} from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/CartProvider";
import { useCmsWhatsappHref } from "@/components/useCmsWhatsappHref";
import Breadcrumbs from "@/components/Breadcrumbs";
import FavoriteButton from "@/components/FavoriteButton";
import CompareButton from "@/components/CompareButton";
import CategoryIcon from "@/components/CategoryIcon";
import { useSiteContent } from "@/components/ContentProvider";

const CARD =
  "overflow-hidden rounded-2xl border-2 border-brand-primary/50 bg-white shadow-[0_0_0_1px_rgba(18,126,201,0.12),0_0_22px_rgba(18,126,201,0.28)]";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.150-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const FEATURE_ICONS = [ShieldCheck, Lock, Wrench, Award] as const;

function splitTitle(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 2) {
    return { lead: parts[0] ?? name, rest: parts.slice(1).join(" ") };
  }
  return {
    lead: parts.slice(0, 2).join(" "),
    rest: parts.slice(2).join(" "),
  };
}

function AccordionCard({
  id,
  title,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className={CARD}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left lg:pointer-events-none lg:cursor-default"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="inline-flex items-center gap-2 font-display text-base font-bold text-brand-dark sm:text-lg">
          <Icon className="h-5 w-5 shrink-0 text-brand-primary" strokeWidth={2} />
          {title}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-brand-dark/45 transition lg:hidden ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2.25}
        />
      </button>
      <div id={id} className={open ? "block" : "hidden lg:block"}>
        {children}
      </div>
    </div>
  );
}

type ProductDetailProps = {
  product: FeaturedProduct;
  related: FeaturedProduct[];
};

export default function ProductDetail({ product, related }: ProductDetailProps) {
  const { addItem } = useCart();
  const { categories } = useSiteContent();
  const whatsappHrefFor = useCmsWhatsappHref();
  const categoryIcon = categories.find((item) => item.slug === product.category)?.icon;
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [openSpecs, setOpenSpecs] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const relatedRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const images = product.images.length > 0 ? product.images : [];
  const title = splitTitle(product.name);
  const chips = product.features.slice(0, 4);
  const specs = [
    { label: "Marca", value: product.brand },
    { label: "Modelo", value: product.sku },
    { label: "Tipo", value: product.categoryLabel },
    ...product.specs,
  ];

  const updateRelatedArrows = useCallback(() => {
    const el = relatedRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = relatedRef.current;
    if (!el) return;
    updateRelatedArrows();
    el.addEventListener("scroll", updateRelatedArrows, { passive: true });
    window.addEventListener("resize", updateRelatedArrows);
    return () => {
      el.removeEventListener("scroll", updateRelatedArrows);
      window.removeEventListener("resize", updateRelatedArrows);
    };
  }, [updateRelatedArrows, related.length]);

  function scrollRelated(direction: -1 | 1) {
    const el = relatedRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card
      ? card.getBoundingClientRect().width + 16
      : el.clientWidth * 0.7;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  function goImage(direction: -1 | 1) {
    if (images.length === 0) return;
    setActiveImage((current) => (current + direction + images.length) % images.length);
  }

  const whatsappHref = whatsappHrefFor(
    `Hola, quiero cotizar este producto: ${product.name} (${product.sku})`,
  );

  return (
    <div className="space-y-6 lg:space-y-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Inicio" },
          { href: `/categorias/${product.category}`, label: product.categoryLabel },
          { label: product.brand },
          { label: product.name },
        ]}
      />

      <section className="grid items-start gap-5 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-2.5 py-1 font-display text-sm font-extrabold tracking-wide text-brand-dark uppercase">
              {product.brand}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-brand-dark/45 uppercase">
              <CategoryIcon
                slug={product.category}
                icon={categoryIcon}
                className="h-3.5 w-3.5 text-brand-primary"
              />
              {product.categoryLabel}
            </span>
          </div>

          <h1 className="mt-3 font-display text-[1.65rem] leading-tight font-extrabold text-brand-dark sm:text-4xl xl:text-[2.65rem]">
            {title.lead}
            {title.rest ? (
              <>
                {" "}
                <span className="text-brand-primary">{title.rest}</span>
              </>
            ) : null}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-brand-dark/70 sm:text-[15px] lg:max-w-xl">
            {product.description}
          </p>

          {chips.length > 0 ? (
            <ul className="mt-4 grid grid-cols-4 gap-2 lg:flex lg:flex-wrap lg:gap-2">
              {chips.map((feature, index) => {
                const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
                return (
                  <li
                    key={feature}
                    className="flex flex-col items-center gap-1.5 px-1 py-1 text-center lg:inline-flex lg:flex-row lg:rounded-full lg:border lg:border-brand-dark/10 lg:bg-white lg:px-3 lg:py-1.5 lg:text-left lg:shadow-[0_1px_4px_rgba(11,53,84,0.06)]"
                  >
                    <Icon className="h-5 w-5 text-brand-primary lg:h-3.5 lg:w-3.5" strokeWidth={2.25} />
                    <span className="text-[10px] leading-tight font-semibold text-brand-dark sm:text-xs">
                      {feature}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <div
          className={`${CARD} relative aspect-[4/3] w-full lg:row-span-2 lg:aspect-auto lg:min-h-[520px]`}
        >
          {images[activeImage] ? (
            <Image
              src={images[activeImage]}
              alt={`${product.name} — imagen ${activeImage + 1}`}
              fill
              className="object-contain p-3 sm:p-6"
              sizes="(max-width: 1024px) 100vw, 55vw"
              preload
            />
          ) : null}

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => goImage(-1)}
                aria-label="Imagen anterior"
                className="absolute top-1/2 left-2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-dark/10 bg-white/90 text-brand-dark shadow-md transition hover:text-brand-primary sm:left-3 sm:h-10 sm:w-10"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => goImage(1)}
                aria-label="Imagen siguiente"
                className="absolute top-1/2 right-2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-dark/10 bg-white/90 text-brand-dark shadow-md transition hover:text-brand-primary sm:right-3 sm:h-10 sm:w-10"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    aria-label={`Ver imagen ${index + 1}`}
                    aria-current={activeImage === index}
                    onClick={() => setActiveImage(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeImage === index
                        ? "w-6 bg-brand-primary"
                        : "w-2 bg-brand-dark/20 hover:bg-brand-dark/40"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="font-display text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">
              {formatPrice(product.price)}
            </p>
            <div className="rounded-xl border border-brand-primary/25 bg-[#eef6fc] px-3.5 py-2">
              <p className="text-[11px] font-semibold tracking-wide text-brand-dark/50 uppercase">
                Precio mayorista
              </p>
              <p className="font-display text-lg font-bold text-brand-primary">
                {formatPrice(product.wholesalePrice)}
              </p>
              <p className="text-[11px] text-brand-dark/45">por volumen</p>
            </div>
          </div>

          <div className="mt-3 hidden flex-wrap items-center gap-2 lg:flex">
            <FavoriteButton productId={product.id} variant="box" />
            <CompareButton productId={product.id} variant="box" />
            <p className="text-sm font-medium text-emerald-600">
              En stock ({product.stock} unidades)
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                addItem(product.id, 1);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1400);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(18,126,201,0.28)] transition hover:bg-brand-dark"
            >
              <ShoppingCart className="h-4 w-4 lg:hidden" strokeWidth={2.25} />
              {added ? "Agregado a cotización" : "Agregar a cotización"}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-whatsapp bg-white px-5 py-3 text-sm font-bold text-brand-whatsapp transition hover:bg-[#f3fff7]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Cotizar por WhatsApp
            </a>
          </div>

          <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-brand-dark/60 sm:text-xs lg:justify-start lg:gap-x-6">
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-primary" strokeWidth={2} />
              Garantía oficial
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-brand-primary" strokeWidth={2} />
              Envíos a todo el Perú
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Store className="h-4 w-4 text-brand-primary" strokeWidth={2} />
              Retiro en tienda
            </li>
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-3 lg:gap-6">
        <AccordionCard
          id="product-specs"
          title="Especificaciones técnicas"
          icon={ClipboardList}
          open={openSpecs}
          onToggle={() => setOpenSpecs((value) => !value)}
        >
          <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-brand-dark text-white">
                <th
                  scope="col"
                  className="w-[42%] px-3 py-2.5 font-semibold sm:w-[38%] sm:px-6 sm:py-3"
                >
                  Especificación
                </th>
                <th scope="col" className="px-3 py-2.5 font-semibold sm:px-6 sm:py-3">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, index) => (
                <tr
                  key={`${spec.label}-${index}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"}
                >
                  <th
                    scope="row"
                    className="border-t border-brand-primary/15 px-3 py-2.5 align-top font-semibold break-words text-brand-dark sm:px-6 sm:py-3"
                  >
                    {spec.label}
                  </th>
                  <td className="border-t border-brand-primary/15 px-3 py-2.5 align-top break-words text-brand-dark/80 sm:px-6 sm:py-3">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionCard>

        <AccordionCard
          id="product-description"
          title="Descripción del producto"
          icon={FileText}
          open={openDescription}
          onToggle={() => setOpenDescription((value) => !value)}
        >
          <div className="px-4 pb-4 sm:px-6 sm:pb-5">
            <p className="text-sm leading-relaxed text-brand-dark/70">
              {product.description}
            </p>
            {product.features.length > 0 ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm font-medium text-brand-dark"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                      strokeWidth={2.5}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </AccordionCard>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 lg:mb-4">
            <h2
              id="related-heading"
              className="inline-flex items-center gap-2 font-display text-base font-bold text-brand-dark sm:text-lg"
            >
              <ShoppingCart className="h-5 w-5 text-brand-primary" strokeWidth={2} />
              Productos relacionados
            </h2>
            <div className="flex items-center gap-3">
              <Link
                href={`/categorias/${product.category}`}
                className="hidden text-sm font-semibold text-brand-primary transition hover:text-brand-dark sm:inline"
              >
                Ver más productos →
              </Link>
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => scrollRelated(-1)}
                  disabled={!canPrev}
                  aria-label="Productos anteriores"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark transition hover:text-brand-primary disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRelated(1)}
                  disabled={!canNext}
                  aria-label="Productos siguientes"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark transition hover:text-brand-primary disabled:opacity-35"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          <ul
            ref={relatedRef}
            className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 scrollbar-none sm:gap-4"
          >
            {related.map((item) => (
              <li
                key={item.id}
                className="w-[38%] min-w-[7.25rem] shrink-0 snap-start sm:w-[14.5rem] sm:min-w-0"
              >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-brand-primary/50 bg-white shadow-[0_0_0_1px_rgba(18,126,201,0.12),0_0_16px_rgba(18,126,201,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(18,126,201,0.22),0_0_24px_rgba(18,126,201,0.4)]">
                  <Link href={productPath(item.id)} className="flex flex-1 flex-col">
                    <div className="relative aspect-square overflow-hidden bg-brand-gray">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="160px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-2 sm:p-3">
                      <p className="text-[10px] font-bold tracking-wide text-brand-primary uppercase">
                        {item.brand}
                      </p>
                      <p className="line-clamp-2 font-display text-xs font-bold text-brand-dark sm:text-sm">
                        {item.name}
                      </p>
                      <p className="mt-auto font-display text-sm font-bold text-brand-primary sm:text-base">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => addItem(item.id, 1)}
                    aria-label={`Agregar ${item.name} a cotización`}
                    className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm transition hover:bg-brand-primary hover:text-white sm:h-9 sm:w-9"
                  >
                    <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                  </button>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

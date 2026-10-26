"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Hand,
  Home,
  Layers,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  PACK_OPTIONS,
  packPrice,
  packQuantity,
  productPath,
  type FeaturedProduct,
  type PackKind,
} from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/CartProvider";
import { useCmsWhatsappHref } from "@/components/useCmsWhatsappHref";
import Breadcrumbs from "@/components/Breadcrumbs";
import FavoriteButton from "@/components/FavoriteButton";
import CategoryIcon from "@/components/CategoryIcon";
import { useSiteContent } from "@/components/ContentProvider";

const CARD = "card-glow overflow-hidden rounded-2xl bg-white";

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

const FEATURE_ICONS = [Layers, Lock, Hand, Home, Box, Wrench] as const;

function featureIcon(feature: string, index: number): LucideIcon {
  const text = feature.toLowerCase();
  if (text.includes("cierre") || text.includes("seguridad") || text.includes("metálic")) {
    return Lock;
  }
  if (text.includes("asa") || text.includes("ergon") || text.includes("mango")) {
    return Hand;
  }
  if (text.includes("hogar") || text.includes("taller") || text.includes("uso")) {
    return Home;
  }
  if (text.includes("bandeja") || text.includes("compart") || text.includes("extraíb")) {
    return Layers;
  }
  return FEATURE_ICONS[index % FEATURE_ICONS.length];
}

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

function firstSentence(text: string) {
  const match = text.trim().match(/^[^.!?]+[.!?]?/);
  return match?.[0] ?? text;
}

function AccordionCard({
  id,
  title,
  icon: Icon,
  open,
  onToggle,
  actions,
  tint = "plain",
  children,
}: {
  id: string;
  title: string;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  actions?: ReactNode;
  tint?: "plain" | "primary";
  children: ReactNode;
}) {
  const branded = tint === "primary";
  return (
    <div className={CARD}>
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3.5 lg:px-6 ${
          branded ? "bg-brand-primary text-white" : ""
        }`}
      >
        <button
          type="button"
          className="inline-flex min-w-0 flex-1 items-center justify-between gap-3 text-left lg:pointer-events-none lg:cursor-default"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
        >
          <span
            className={`inline-flex items-center gap-2 font-display text-base font-bold sm:text-lg ${
              branded ? "text-white" : "text-brand-dark"
            }`}
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${branded ? "text-brand-gold" : "text-brand-primary"}`}
              strokeWidth={2}
            />
            {title}
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 transition lg:hidden ${
              branded ? "text-white/80" : "text-brand-dark/45"
            } ${open ? "rotate-180" : ""}`}
            strokeWidth={2.25}
          />
        </button>
        {actions ? <div className="hidden shrink-0 lg:block">{actions}</div> : null}
      </div>
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
  const [qty, setQty] = useState(1);
  const [pack, setPack] = useState<PackKind>("unidad");
  const [added, setAdded] = useState(false);
  const [openSpecs, setOpenSpecs] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [openRelated, setOpenRelated] = useState(false);
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
  const unitsPerPack = packQuantity(product, pack);
  const selectedPrice = packPrice(product, pack);
  const packLabel = PACK_OPTIONS.find((item) => item.id === pack)?.label ?? "Unidad";
  const packHint = product.packaging[pack];

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
  }, [updateRelatedArrows, related.length, openRelated]);

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
    `Hola, quiero cotizar este producto: ${product.name} (${product.sku}) · ${qty} ${packLabel.toLowerCase()} (${unitsPerPack * qty} unids)`,
  );

  return (
    <div className="space-y-5 lg:space-y-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Inicio" },
          { href: `/categorias/${product.category}`, label: product.categoryLabel },
          { label: product.brand },
          { label: product.name },
        ]}
      />

      <section className="grid items-start gap-5 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <header className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-brand-gold px-2.5 py-1 font-display text-sm font-extrabold tracking-wide text-brand-dark uppercase">
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

          <h1 className="mt-3 font-display text-[1.7rem] leading-[1.12] font-extrabold text-brand-dark sm:text-4xl xl:text-[2.7rem]">
            {title.lead}
            {title.rest ? (
              <>
                {" "}
                <span className="text-brand-primary">{title.rest}</span>
              </>
            ) : null}
          </h1>

          <p className="mt-3 hidden text-sm leading-relaxed text-brand-dark/70 sm:text-[15px] lg:block lg:max-w-xl">
            {firstSentence(product.description)}
          </p>

          {chips.length > 0 ? (
            <ul className="mt-4 hidden gap-x-5 gap-y-3 lg:flex lg:flex-wrap">
              {chips.map((feature, index) => {
                const Icon = featureIcon(feature, index);
                return (
                  <li
                    key={feature}
                    className="inline-flex max-w-[11rem] items-start gap-2 text-left"
                  >
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                      strokeWidth={2.25}
                    />
                    <span className="text-xs font-semibold leading-snug text-brand-dark/80">
                      {feature}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </header>

        <div className="flex min-w-0 flex-col gap-3 lg:row-span-2">
          <div className={`${CARD} relative aspect-[4/3] w-full`}>
            {images[activeImage] ? (
              <Image
                src={images[activeImage]}
                alt={`${product.name} — imagen ${activeImage + 1}`}
                fill
                className="object-contain p-4 sm:p-6"
                sizes="(max-width: 1024px) 100vw, 52vw"
                preload
              />
            ) : null}

            <div className="absolute top-3 right-3 z-10">
              <FavoriteButton productId={product.id} />
            </div>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => goImage(-1)}
                  aria-label="Imagen anterior"
                  className="absolute top-1/2 left-2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-dark/10 bg-white/95 text-brand-dark shadow-md transition hover:text-brand-primary sm:left-3 sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => goImage(1)}
                  aria-label="Imagen siguiente"
                  className="absolute top-1/2 right-2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-dark/10 bg-white/95 text-brand-dark shadow-md transition hover:text-brand-primary sm:right-3 sm:h-10 sm:w-10"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </>
            ) : null}
          </div>

          {images.length > 1 ? (
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {images.slice(0, 5).map((src, index) => (
                <li key={`${src}-${index}`}>
                  <button
                    type="button"
                    aria-label={`Ver imagen ${index + 1}`}
                    aria-current={activeImage === index}
                    onClick={() => setActiveImage(index)}
                    className={`card-glow relative aspect-square w-full overflow-hidden rounded-xl bg-white transition ${
                      activeImage === index ? "ring-2 ring-brand-primary/40" : ""
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-[2.35rem] font-extrabold tracking-tight text-brand-dark sm:text-5xl">
                {formatPrice(selectedPrice)}
              </p>
              {pack !== "unidad" ? (
                <p className="mt-1 text-sm font-medium text-brand-dark/70 sm:text-base">
                  {formatPrice(product.wholesalePrice)} c/u · {unitsPerPack} unidades
                </p>
              ) : (
                <p className="mt-1 text-sm font-medium text-brand-dark/70 sm:text-base">
                  Mayorista {formatPrice(product.wholesalePrice)} c/u
                </p>
              )}
            </div>
            <div className="min-w-[13rem] text-right">
              <p className="mb-1.5 text-sm font-semibold tracking-wide text-brand-dark/60">
                Presentación
              </p>
              <div className="inline-flex overflow-hidden rounded-xl border border-[#d7e4ef] bg-white">
                {PACK_OPTIONS.map((option) => {
                  const selected = pack === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPack(option.id)}
                      aria-pressed={selected}
                      className={`px-3 py-2 text-sm font-bold uppercase transition ${
                        selected
                          ? "bg-brand-primary text-white"
                          : "text-brand-dark/70 hover:bg-brand-gray"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 max-w-[18rem] text-sm leading-snug font-medium text-brand-dark/70 sm:text-base">
                {packHint}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#d7e4ef] bg-white">
              <button
                type="button"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                aria-label="Disminuir cantidad"
                className="inline-flex h-11 w-11 items-center justify-center text-brand-dark transition hover:bg-brand-gray"
              >
                <Minus className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <span className="min-w-8 text-center font-display text-base font-bold text-brand-dark">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((value) => value + 1)}
                aria-label="Aumentar cantidad"
                className="inline-flex h-11 w-11 items-center justify-center text-brand-dark transition hover:bg-brand-gray"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <Check className="h-4 w-4" strokeWidth={2.5} />
              En stock ({product.stock} unidades)
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                addItem(product.id, qty * unitsPerPack);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1400);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(18,126,201,0.28)] transition hover:bg-brand-dark"
            >
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

          <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-medium text-brand-dark/60 sm:text-xs lg:flex lg:flex-wrap lg:justify-start lg:gap-x-6 lg:text-left">
            <li className="inline-flex flex-col items-center gap-1.5 lg:flex-row">
              <ShieldCheck className="h-5 w-5 text-brand-primary lg:h-4 lg:w-4" strokeWidth={2} />
              Garantía oficial
            </li>
            <li className="inline-flex flex-col items-center gap-1.5 lg:flex-row">
              <Truck className="h-5 w-5 text-brand-primary lg:h-4 lg:w-4" strokeWidth={2} />
              Envíos a todo el Perú
            </li>
            <li className="inline-flex flex-col items-center gap-1.5 lg:flex-row">
              <Store className="h-5 w-5 text-brand-primary lg:h-4 lg:w-4" strokeWidth={2} />
              Retiro en tienda
            </li>
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-3 lg:gap-5">
        <AccordionCard
          id="product-specs"
          title="Especificaciones técnicas"
          icon={ClipboardList}
          open={openSpecs}
          onToggle={() => setOpenSpecs((value) => !value)}
          tint="primary"
        >
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            {specs.map((spec, index) => (
              <div
                key={`${spec.label}-${index}`}
                className={`flex items-baseline justify-between gap-4 border-b border-brand-primary/15 px-4 py-3 sm:px-6 ${
                  index % 2 === 0 ? "bg-[#e8f4fc]" : "bg-white"
                }`}
              >
                <dt className="text-sm font-semibold text-brand-primary">{spec.label}</dt>
                <dd className="text-right text-sm font-semibold text-brand-dark">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </AccordionCard>

        <AccordionCard
          id="product-description"
          title="Descripción del producto"
          icon={FileText}
          open={openDescription}
          onToggle={() => setOpenDescription((value) => !value)}
        >
          <div className="grid gap-5 border-t border-[#e6eef5] px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.9fr)] lg:gap-10">
            <p className="text-sm leading-relaxed text-brand-dark/70">
              {product.description}
            </p>
            {product.features.length > 0 ? (
              <ul className="grid gap-2.5 content-start">
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
        <AccordionCard
          id="product-related"
          title="Productos relacionados"
          icon={ShoppingCart}
          open={openRelated}
          onToggle={() => setOpenRelated((value) => !value)}
          actions={
            <Link
              href={`/categorias/${product.category}`}
              className="text-sm font-semibold text-brand-primary transition hover:text-brand-dark"
            >
              Ver más productos →
            </Link>
          }
        >
          <div className="relative border-t border-[#e6eef5] px-3 pt-3 pb-4 sm:px-4">
            <button
              type="button"
              onClick={() => scrollRelated(-1)}
              disabled={!canPrev}
              aria-label="Productos anteriores"
              className="absolute top-1/2 left-1 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark shadow-sm transition hover:text-brand-primary disabled:opacity-35 lg:inline-flex"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollRelated(1)}
              disabled={!canNext}
              aria-label="Productos siguientes"
              className="absolute top-1/2 right-1 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-dark/10 bg-white text-brand-dark shadow-sm transition hover:text-brand-primary disabled:opacity-35 lg:inline-flex"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>

            <ul
              ref={relatedRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-none sm:gap-4 lg:px-8"
            >
              {related.map((item) => (
                <li
                  key={item.id}
                  className="w-[46%] min-w-[9.5rem] shrink-0 snap-start sm:w-[14.5rem] sm:min-w-0"
                >
                  <article className="card-glow group flex h-full flex-col overflow-hidden rounded-xl bg-white transition hover:-translate-y-0.5">
                    <Link href={productPath(item.id)} className="flex flex-1 flex-col">
                      <div className="relative aspect-square overflow-hidden bg-brand-gray">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="180px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1 p-2.5 pb-0 sm:p-3 sm:pb-0">
                        <p className="text-[10px] font-bold tracking-wide text-brand-primary uppercase">
                          {item.brand}
                        </p>
                        <p className="line-clamp-2 font-display text-xs font-bold text-brand-dark sm:text-sm">
                          {item.name}
                        </p>
                      </div>
                    </Link>
                    <div className="mt-auto flex items-center justify-between gap-2 p-2.5 pt-2 sm:p-3 sm:pt-2">
                      <p className="font-display text-sm font-bold text-brand-primary sm:text-base">
                        {formatPrice(item.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => addItem(item.id, 1)}
                        aria-label={`Agregar ${item.name} a cotización`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white transition hover:bg-brand-dark"
                      >
                        <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </AccordionCard>
      ) : null}
    </div>
  );
}

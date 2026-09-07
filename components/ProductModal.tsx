"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  X,
} from "lucide-react";
import type { FeaturedProduct } from "@/data/products";

const WHATSAPP_URL =
  "https://wa.me/51999999999?text=Hola%2C%20quiero%20cotizar%20este%20producto%3A%20";

function formatPrice(value: number) {
  return value.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  });
}

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

type ProductModalProps = {
  product: FeaturedProduct;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const titleId = useId();
  const [activeImage, setActiveImage] = useState(0);
  const images = product.images.length >= 5 ? product.images : product.images.concat(
    Array.from(
      { length: 5 - product.images.length },
      (_, i) => product.images[i % product.images.length] ?? product.image,
    ),
  );

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const whatsappHref = `${WHATSAPP_URL}${encodeURIComponent(
    `${product.name} (${product.sku})`,
  )}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[2px]"
        aria-label="Cerrar modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-brand-primary/40 bg-white shadow-[0_0_0_1px_rgba(18,126,201,0.25),0_0_40px_rgba(18,126,201,0.45),0_24px_60px_rgba(11,53,84,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-brand-dark/8 px-4 py-3 sm:px-5">
          <div>
            <p className="text-xs font-bold tracking-wide text-brand-primary uppercase">
              {product.brand}
            </p>
            <h2
              id={titleId}
              className="font-display text-lg font-bold text-brand-dark sm:text-xl"
            >
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-gray text-brand-dark transition hover:bg-brand-primary hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-2">
          <div className="border-b border-brand-dark/8 p-4 sm:p-5 lg:border-r lg:border-b-0">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-gray">
              <Image
                src={images[activeImage]}
                alt={`${product.name} — imagen ${activeImage + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <ul className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((src, index) => (
                <li key={`${src}-${index}`}>
                  <button
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 transition ${
                      activeImage === index
                        ? "border-brand-primary shadow-[0_0_12px_rgba(18,126,201,0.55)]"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                    aria-pressed={activeImage === index}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-brand-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-brand-dark/40 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            </div>
            <p className="text-sm text-brand-dark/70">
              Mayorista:{" "}
              <span className="font-semibold text-brand-dark">
                {formatPrice(product.wholesalePrice)}
              </span>{" "}
              (x volumen)
            </p>
            <p className="text-sm text-brand-dark/55">SKU: {product.sku}</p>

            <div>
              <h3 className="font-display text-sm font-bold text-brand-dark uppercase">
                Descripción
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-dark/75">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-brand-dark uppercase">
                Características
              </h3>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-brand-dark/75">
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wide text-brand-primary uppercase">
                <Package className="h-3.5 w-3.5" strokeWidth={2.25} />
                Contenido / empaque
              </p>
              <dl className="grid gap-1.5 text-sm text-brand-dark/80">
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold">Unidad</dt>
                  <dd className="text-right">{product.packaging.unidad}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold">Docena</dt>
                  <dd className="text-right">{product.packaging.docena}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold">Caja</dt>
                  <dd className="text-right">{product.packaging.caja}</dd>
                </div>
              </dl>
            </div>

            <div className="flex gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                strokeWidth={2.25}
              />
              <p>{product.warning}</p>
            </div>

            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_0_16px_rgba(18,126,201,0.4)] transition hover:bg-brand-dark"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                Añadir al carrito
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_16px_rgba(37,211,102,0.4)] transition hover:bg-[#1ebe57]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Cotizar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

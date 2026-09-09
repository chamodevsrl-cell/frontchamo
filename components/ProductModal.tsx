"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import {
  BadgePercent,
  GitCompareArrows,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import {
  getRelatedProducts,
  type FeaturedProduct,
} from "@/data/products";
import { whatsappUrl } from "@/data/contact";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/CartProvider";

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
  onSelectProduct?: (product: FeaturedProduct) => void;
};

export default function ProductModal({
  product,
  onClose,
  onSelectProduct,
}: ProductModalProps) {
  const titleId = useId();
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const images =
    product.images.length >= 5
      ? product.images
      : product.images.concat(
          Array.from(
            { length: 5 - product.images.length },
            (_, i) =>
              product.images[i % product.images.length] ?? product.image,
          ),
        );

  const related = getRelatedProducts(product, 4);

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

  const whatsappHref = whatsappUrl(
    `Hola, quiero cotizar este producto: ${product.name} (${product.sku}) x${qty}`,
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
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
        className="relative z-10 flex max-h-[min(94vh,960px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-brand-primary/35 bg-white shadow-[0_0_0_1px_rgba(18,126,201,0.2),0_0_40px_rgba(18,126,201,0.4),0_24px_60px_rgba(11,53,84,0.35)]"
      >
        <div className="flex-1 overflow-y-auto">
          {/* Cabecera: galería + ficha comercial */}
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-brand-dark/8 p-4 sm:p-5 lg:border-r lg:border-b-0">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-gray">
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
                          : "border-brand-dark/10 opacity-80 hover:opacity-100"
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

            <div className="relative flex flex-col gap-4 p-4 sm:p-5">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gray text-brand-dark transition hover:bg-brand-primary hover:text-white sm:top-4 sm:right-4"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={2.25} />
              </button>

              <div className="flex flex-wrap items-center gap-2 pr-10">
                <span className="rounded-full bg-[#cfe8f8] px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                  {product.brand}
                </span>
                <span className="text-xs text-brand-dark/50">
                  SKU: {product.sku}
                </span>
                {product.discount ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#cfe8f8] px-2.5 py-0.5 text-[11px] font-extrabold text-brand-primary">
                    <BadgePercent className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                    -{product.discount}% OFF
                  </span>
                ) : null}
              </div>

              <div>
                <h2
                  id={titleId}
                  className="font-display pr-8 text-xl font-bold text-brand-dark sm:text-2xl"
                >
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-dark/70">
                  {product.description}
                </p>
              </div>

              <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-4">
                <p className="font-display text-3xl font-bold text-brand-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="mt-0.5 text-xs text-brand-dark/55">
                  Precio unitario sugerido
                  {product.oldPrice ? (
                    <>
                      {" "}
                      ·{" "}
                      <span className="line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    </>
                  ) : null}
                </p>
                <div className="my-3 border-t border-dashed border-brand-primary/25" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold tracking-wide text-brand-dark/55 uppercase">
                    Precio mayorista por volumen
                  </p>
                  <p className="font-display text-lg font-bold text-brand-primary">
                    {formatPrice(product.wholesalePrice)}
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium text-emerald-600">
                Estado: En stock ({product.stock} unidades disponibles)
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center overflow-hidden rounded-lg border border-brand-dark/12 bg-white">
                  <button
                    type="button"
                    onClick={() => setQty((n) => Math.max(1, n - 1))}
                    className="inline-flex h-10 w-10 items-center justify-center text-brand-dark transition hover:bg-brand-gray"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold text-brand-dark">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((n) => n + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center text-brand-dark transition hover:bg-brand-gray"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-dark/12 text-brand-dark transition hover:border-brand-primary hover:text-brand-primary"
                  aria-label="Agregar a favoritos"
                >
                  <Heart className="h-4 w-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-dark/12 text-brand-dark transition hover:border-brand-primary hover:text-brand-primary"
                  aria-label="Comparar producto"
                >
                  <GitCompareArrows className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    addItem(product.id, qty);
                    setAdded(true);
                    window.setTimeout(() => setAdded(false), 1400);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary"
                >
                  <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                  {added ? "Agregado" : "Agregar a cotización"}
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-whatsapp px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Cotizar por WhatsApp
                </a>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-brand-dark/55">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
                  Garantía oficial
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-brand-primary" />
                  Despacho a provincia
                </span>
              </div>
            </div>
          </div>

          {/* Ficha técnica + relacionados */}
          <div className="space-y-8 border-t border-brand-dark/8 px-4 py-6 sm:px-6 sm:py-7">
            <section aria-labelledby="specs-heading">
              <h3
                id="specs-heading"
                className="font-display text-lg font-bold text-brand-dark sm:text-xl"
              >
                Especificaciones técnicas
              </h3>
              <div className="mt-3 overflow-hidden rounded-2xl border border-brand-primary/25 shadow-[0_0_0_1px_rgba(18,126,201,0.08),0_0_18px_rgba(18,126,201,0.2)]">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-brand-dark text-white">
                      <th
                        scope="col"
                        className="w-[42%] px-4 py-3 font-semibold sm:px-5"
                      >
                        Especificación
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold sm:px-5">
                        Detalle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...product.specs,
                      { label: "Empaque unidad", value: product.packaging.unidad },
                      { label: "Empaque docena", value: product.packaging.docena },
                      { label: "Empaque caja", value: product.packaging.caja },
                    ].map((spec, index) => (
                      <tr
                        key={`${spec.label}-${index}`}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"
                        }
                      >
                        <th
                          scope="row"
                          className="px-4 py-3 font-bold text-brand-dark sm:px-5"
                        >
                          {spec.label}
                        </th>
                        <td className="px-4 py-3 text-brand-dark/80 sm:px-5">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {related.length > 0 ? (
              <section aria-labelledby="related-heading">
                <h3
                  id="related-heading"
                  className="font-display text-lg font-bold text-brand-dark sm:text-xl"
                >
                  Productos relacionados de la misma categoría
                </h3>
                <p className="mt-1 text-sm text-brand-dark/55">
                  Más opciones en {product.categoryLabel}
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {related.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onSelectProduct?.(item)}
                        className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-brand-primary/25 bg-white text-left shadow-[0_0_12px_rgba(18,126,201,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(18,126,201,0.4)]"
                      >
                        <div className="relative aspect-square overflow-hidden bg-brand-gray">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                            sizes="160px"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-3">
                          <p className="text-[10px] font-bold tracking-wide text-brand-primary uppercase">
                            {item.brand}
                          </p>
                          <p className="line-clamp-2 font-display text-xs font-bold text-brand-dark sm:text-sm">
                            {item.name}
                          </p>
                          <p className="mt-auto font-display text-sm font-bold text-brand-primary">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

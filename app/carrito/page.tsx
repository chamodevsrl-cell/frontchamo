"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/data/contact";

export default function CarritoPage() {
  const { lines, count, setQuantity, removeItem, clear } = useCart();

  // Se usa el precio guardado al agregar (no el vivo del catálogo) para que el
  // total no cambie solo si el precio de un producto cambia después.
  const unitTotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const wholesaleTotal = lines.reduce(
    (sum, line) => sum + line.wholesaleUnitPrice * line.quantity,
    0,
  );
  const hasPriceChanges = lines.some((line) => line.priceChanged);

  const whatsappHref = whatsappUrl(
    [
      "Hola, quiero cotizar estos productos del carrito:",
      ...lines.map(
        (line) =>
          `- ${line.product.name} (${line.product.sku}) x${line.quantity}`,
      ),
      "",
      `Subtotal referencial mayorista: ${formatPrice(wholesaleTotal)}`,
    ].join("\n"),
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <Reveal>
        <Breadcrumbs
          items={[
            { href: "/", label: "Inicio" },
            { label: "Carrito" },
          ]}
        />
        <h1 className="mt-4 inline-flex items-center gap-3 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
          <ShoppingCart className="h-8 w-8 text-brand-primary" strokeWidth={2.25} aria-hidden />
          Carrito / cotización
        </h1>
        <p className="mt-2 max-w-xl text-brand-dark/70 dark:text-white/70">
          Arma tu pedido mayorista y envíalo por WhatsApp. Los precios son
          referenciales.
        </p>

        {lines.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-brand-dark/10 bg-white px-5 py-10 text-center dark:bg-[#102a40]">
            <ShoppingCart
              className="mx-auto h-12 w-12 text-brand-primary/45"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="mt-3 text-brand-dark/70 dark:text-white/70">
              Tu carrito está vacío.
            </p>
            <Link
              href="/catalogo"
              className="mt-4 inline-flex rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
            <ul className="space-y-3">
              {lines.map((line) => (
                <li
                  key={line.productId}
                  className="flex gap-3 rounded-2xl border border-brand-dark/10 bg-white p-3 sm:p-4 dark:bg-[#102a40]"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-gray sm:h-24 sm:w-24">
                    <Image
                      src={line.product.images[0]}
                      alt={line.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                      {line.product.brand}
                    </p>
                    <p className="font-display text-sm font-bold text-brand-dark sm:text-base dark:text-white">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-brand-dark/50 dark:text-white/50">
                      SKU {line.product.sku}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-brand-primary">
                      {formatPrice(line.wholesaleUnitPrice)} mayorista
                    </p>
                    {line.priceChanged ? (
                      <p className="mt-0.5 text-xs text-brand-gold">
                        El precio de este producto cambió desde que lo agregaste
                        (ahora {formatPrice(line.product.wholesalePrice)} mayorista).
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <div className="inline-flex overflow-hidden rounded-lg border border-brand-dark/12">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.productId, line.quantity - 1)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 px-1 text-center text-sm font-semibold leading-8">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.productId, line.quantity + 1)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-brand-primary/25 bg-white p-5 dark:bg-[#102a40]">
              <p className="text-sm text-brand-dark/60 dark:text-white/60">
                {count} unidad{count === 1 ? "" : "es"}
              </p>
              {hasPriceChanges ? (
                <p className="mt-2 rounded-lg bg-brand-gold/15 px-2.5 py-1.5 text-xs text-brand-dark dark:text-white">
                  Algunos precios cambiaron desde que agregaste el producto — el
                  total de abajo usa el precio guardado en tu carrito.
                </p>
              ) : null}
              <p className="mt-3 flex justify-between text-sm">
                <span>Referencial unitario</span>
                <span>{formatPrice(unitTotal)}</span>
              </p>
              <p className="mt-1 flex justify-between font-display text-lg font-bold text-brand-primary">
                <span>Mayorista</span>
                <span>{formatPrice(wholesaleTotal)}</span>
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-whatsapp px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe57]"
              >
                Cotizar carrito por WhatsApp
              </a>
              <Link
                href="/cotizar"
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Completar formulario
              </Link>
              <button
                type="button"
                onClick={clear}
                className="mt-3 w-full text-center text-xs font-semibold text-brand-dark/55 hover:text-brand-dark dark:text-white/55"
              >
                Vaciar carrito
              </button>
            </aside>
          </div>
        )}
        </Reveal>
      </main>
    </div>
  );
}

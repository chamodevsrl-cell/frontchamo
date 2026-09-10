"use client";

import Image from "next/image";
import Link from "next/link";
import { GitCompareArrows, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useCompare } from "@/components/CompareProvider";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/data/contact";
import type { FeaturedProduct, ProductSpec } from "@/data/products";

function specMap(product: FeaturedProduct) {
  return new Map(product.specs.map((spec) => [spec.label, spec.value]));
}

function unionSpecLabels(products: FeaturedProduct[]): string[] {
  const labels: string[] = [];
  for (const product of products) {
    for (const spec of product.specs) {
      if (!labels.includes(spec.label)) labels.push(spec.label);
    }
  }
  return labels;
}

function SpecValue({ spec }: { spec?: ProductSpec["value"] }) {
  return (
    <span className="text-sm text-brand-dark dark:text-white">
      {spec ?? "—"}
    </span>
  );
}

export default function CompararPage() {
  const { products, count, remove, clear } = useCompare();
  const labels = unionSpecLabels(products);
  const maps = products.map(specMap);
  const whatsappHref = whatsappUrl(
    [
      "Hola, quiero comparar y cotizar estos productos:",
      ...products.map(
        (product) =>
          `- ${product.name} (${product.sku}) — ${formatPrice(product.wholesalePrice)} mayorista`,
      ),
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
              { label: "Comparar" },
            ]}
          />
          <h1 className="mt-4 inline-flex items-center gap-3 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
            <GitCompareArrows
              className="h-8 w-8 text-brand-primary"
              strokeWidth={2.25}
              aria-hidden
            />
            Comparar productos
          </h1>
          <p className="mt-2 max-w-xl text-brand-dark/70 dark:text-white/70">
            Hasta 3 SKUs lado a lado: precio, ficha técnica de ejemplo y cotización
            por WhatsApp. La lista queda en este navegador.
          </p>
        </Reveal>

        {products.length === 0 ? (
          <Reveal delayMs={80}>
            <div className="mt-10 rounded-2xl border border-brand-dark/10 bg-white px-5 py-10 text-center dark:bg-[#102a40]">
              <GitCompareArrows
                className="mx-auto h-12 w-12 text-brand-primary/45"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="mt-3 text-brand-dark/70 dark:text-white/70">
                Aún no hay productos para comparar.
              </p>
              <Link
                href="/catalogo"
                className="mt-4 inline-flex rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Ir al catálogo
              </Link>
            </div>
          </Reveal>
        ) : (
          <Reveal delayMs={80}>
            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-brand-dark/60 dark:text-white/60">
                  {count} producto{count === 1 ? "" : "s"} (máximo 3)
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-brand-whatsapp px-3 py-2 text-xs font-semibold text-white hover:bg-[#1ebe57]"
                  >
                    Cotizar esta comparación
                  </a>
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs font-semibold text-brand-dark/55 hover:text-brand-dark dark:text-white/55"
                  >
                    Vaciar comparación
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white dark:bg-[#102a40]">
                <table className="min-w-[640px] w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-brand-dark text-white">
                      <th className="w-40 px-3 py-3 text-xs font-bold tracking-wide uppercase">
                        Dato
                      </th>
                      {products.map((product) => (
                        <th key={product.id} className="px-3 py-3 align-top">
                          <div className="relative mx-auto mb-2 aspect-square w-24 overflow-hidden rounded-lg bg-brand-gray">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                          <p className="font-display text-sm font-bold">
                            {product.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(product.id)}
                            className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-white/70 hover:text-brand-gold"
                          >
                            <X className="h-3 w-3" strokeWidth={2.5} />
                            Quitar
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Marca", products.map((product) => product.brand)],
                      ["SKU", products.map((product) => product.sku)],
                      ["Línea", products.map((product) => product.categoryLabel)],
                      [
                        "Precio",
                        products.map((product) => formatPrice(product.price)),
                      ],
                      [
                        "Mayorista",
                        products.map((product) =>
                          formatPrice(product.wholesalePrice),
                        ),
                      ],
                      [
                        "Stock",
                        products.map((product) => `${product.stock} unids`),
                      ],
                    ].map(([label, values]) => (
                      <tr
                        key={String(label)}
                        className="odd:bg-[#eef6fc] even:bg-white dark:odd:bg-brand-dark/40 dark:even:bg-[#102a40]"
                      >
                        <th className="px-3 py-2 text-xs font-bold tracking-wide text-brand-dark uppercase dark:text-white">
                          {label}
                        </th>
                        {(values as string[]).map((value, index) => (
                          <td key={`${String(label)}-${index}`} className="px-3 py-2">
                            <SpecValue spec={value} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {labels.map((label) => (
                      <tr
                        key={label}
                        className="odd:bg-[#eef6fc] even:bg-white dark:odd:bg-brand-dark/40 dark:even:bg-[#102a40]"
                      >
                        <th className="px-3 py-2 text-xs font-bold tracking-wide text-brand-dark uppercase dark:text-white">
                          {label}
                        </th>
                        {maps.map((map, index) => (
                          <td key={`${label}-${index}`} className="px-3 py-2">
                            <SpecValue spec={map.get(label)} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        )}
      </main>
    </div>
  );
}

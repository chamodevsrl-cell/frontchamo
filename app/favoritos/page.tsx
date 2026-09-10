"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCatalog from "@/components/ProductCatalog";
import { useFavorites } from "@/components/FavoritesProvider";

export default function FavoritosPage() {
  const { products, count, clear } = useFavorites();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <Reveal>
          <Breadcrumbs
            items={[
              { href: "/", label: "Inicio" },
              { label: "Favoritos" },
            ]}
          />
          <h1 className="mt-4 inline-flex items-center gap-3 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
            <Heart
              className="h-8 w-8 text-brand-primary"
              strokeWidth={2.25}
              aria-hidden
            />
            Favoritos
          </h1>
          <p className="mt-2 max-w-xl text-brand-dark/70 dark:text-white/70">
            Guarda productos para cotizarlos después. La lista queda en este
            navegador.
          </p>
        </Reveal>

        {products.length === 0 ? (
          <Reveal delayMs={80}>
            <div className="mt-10 rounded-2xl border border-brand-dark/10 bg-white px-5 py-10 text-center dark:bg-[#102a40]">
              <Heart
                className="mx-auto h-12 w-12 text-brand-primary/45"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="mt-3 text-brand-dark/70 dark:text-white/70">
                Aún no tienes favoritos.
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
                  {count} producto{count === 1 ? "" : "s"} guardado
                  {count === 1 ? "" : "s"}
                </p>
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs font-semibold text-brand-dark/55 hover:text-brand-dark dark:text-white/55"
                >
                  Vaciar favoritos
                </button>
              </div>
              <ProductCatalog products={products} />
            </div>
          </Reveal>
        )}
      </main>
    </div>
  );
}

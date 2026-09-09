import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import CatalogFilters from "@/components/CatalogFilters";
import ProductCatalog from "@/components/ProductCatalog";
import Reveal from "@/components/Reveal";
import { searchCatalog } from "@/data/products";

export const metadata: Metadata = {
  title: "Catálogo | Chamo Import",
  description: "Catálogo mayorista de ferretería e importaciones",
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q);
  const category = firstParam(params.category);
  const brand = firstParam(params.brand);
  const products = searchCatalog({ q, category, brand });

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <Reveal>
        <h1 className="font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
          Catálogo
        </h1>
        <p className="mt-2 max-w-2xl text-brand-dark/70 dark:text-white/70">
          Busca por nombre, SKU, marca o categoría. La misma lógica alimenta
          {" "}
          <code className="text-xs">GET /api/productos</code>.
        </p>
        </Reveal>
        <Reveal delayMs={80}>
        <div className="mt-8 space-y-6">
          <Suspense
            fallback={
              <p className="text-sm text-brand-dark/60 dark:text-white/60">
                Cargando filtros…
              </p>
            }
          >
            <CatalogFilters q={q} category={category} brand={brand} />
          </Suspense>
          <ProductCatalog
            products={products}
            emptyMessage="No encontramos productos con esa búsqueda. Prueba otra categoría o marca."
          />
        </div>
        </Reveal>
      </main>
    </div>
  );
}

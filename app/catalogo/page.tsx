import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import CatalogFilters from "@/components/CatalogFilters";
import CatalogPagination from "@/components/CatalogPagination";
import ProductCatalog from "@/components/ProductCatalog";
import Reveal from "@/components/Reveal";
import SitePageBanner from "@/components/SitePageBanner";
import { paginateItems, parsePageParam, searchCatalog } from "@/data/products";

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
  const matches = searchCatalog({ q, category, brand });
  const {
    items: products,
    page,
    pageSize,
    total,
    totalPages,
  } = paginateItems(matches, parsePageParam(params.page));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <SitePageBanner
          pageId="catalogo"
          title="CATÁLOGO"
          stamp={{ lead: "NUESTRO", accent: "CATÁLOGO" }}
          subtitle="Busca por nombre, SKU, marca o categoría. La misma lógica alimenta GET /api/productos."
          crumbs={[
            { href: "/", label: "Inicio" },
            { label: "Catálogo" },
          ]}
        />
        <Reveal delayMs={80}>
        <div className="space-y-6">
          <Suspense
            fallback={
              <p className="text-sm text-brand-dark/60 dark:text-white/60">
                Cargando filtros…
              </p>
            }
          >
            <CatalogFilters q={q} category={category} brand={brand} />
          </Suspense>
          <div id="catalogo-resultados" className="space-y-6 scroll-mt-28">
            <ProductCatalog
              products={products}
              emptyMessage="No encontramos productos con esa búsqueda. Prueba otra categoría o marca."
            />
            <CatalogPagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              basePath="/catalogo"
              query={{ q, category, brand }}
            />
          </div>
        </div>
        </Reveal>
      </main>
    </div>
  );
}

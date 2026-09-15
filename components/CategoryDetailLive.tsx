"use client";

import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import CategoryBanner from "@/components/CategoryBanner";
import ProductCatalog from "@/components/ProductCatalog";
import Reveal from "@/components/Reveal";
import { useSiteContent } from "@/components/ContentProvider";
import { getProductsByCategory } from "@/data/products";

export default function CategoryDetailLive({ slug }: { slug: string }) {
  const { categories, ready } = useSiteContent();

  if (!ready) {
    return (
      <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb]">
        <Navbar />
        <p className="px-4 py-12 text-sm text-brand-dark/70">Cargando categoría…</p>
      </div>
    );
  }

  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const brands = [...new Set(products.map((product) => product.brand))];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10">
        <CategoryBanner category={category} brands={brands} />
        <Reveal>
          <section id="productos-categoria" aria-labelledby="productos-categoria-heading">
            <h2
              id="productos-categoria-heading"
              className="mb-4 font-display text-xl font-bold text-brand-dark dark:text-white"
            >
              {products.length} producto{products.length === 1 ? "" : "s"} en {category.label}
            </h2>
            <ProductCatalog
              products={products}
              emptyMessage="Aún no hay productos de ejemplo en esta categoría. Cotiza por WhatsApp y te armamos la lista."
            />
          </section>
        </Reveal>
      </main>
    </div>
  );
}

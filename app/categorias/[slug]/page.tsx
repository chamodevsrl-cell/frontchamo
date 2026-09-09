import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import CategoryBanner from "@/components/CategoryBanner";
import ProductCatalog from "@/components/ProductCatalog";
import Reveal from "@/components/Reveal";
import { getCategoryBySlug, mainCategories } from "@/data/home";
import { getProductsByCategory } from "@/data/products";

export async function generateStaticParams() {
  return mainCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Categoría | Chamo Import" };
  return {
    title: `${category.label} | Chamo Import`,
    description: `${category.eyebrow} — ${category.label} al por mayor`,
  };
}

export default async function CategoriaDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
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

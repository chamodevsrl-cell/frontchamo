import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCatalog from "@/components/ProductCatalog";
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

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <p className="text-sm">
          <Link href="/categorias" className="font-semibold text-brand-primary hover:underline">
            Categorías
          </Link>
          <span className="text-brand-dark/40 dark:text-white/40"> / {category.label}</span>
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-brand-primary/25 bg-white dark:bg-[#102a40]">
            <div className="relative aspect-[16/10]">
              <Image
                src={category.image}
                alt={category.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 18rem"
                priority
              />
            </div>
            <div className="p-4">
              <p className="text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                {category.eyebrow}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-brand-dark dark:text-white">
                {category.label}
              </h1>
              <ul className="mt-3 space-y-1.5 text-sm text-brand-dark/70 dark:text-white/70">
                {category.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm text-brand-dark/60 dark:text-white/60">
              {products.length} producto{products.length === 1 ? "" : "s"} en esta línea
            </p>
            <ProductCatalog
              products={products}
              emptyMessage="Aún no hay productos de ejemplo en esta categoría. Cotiza por WhatsApp y te armamos la lista."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

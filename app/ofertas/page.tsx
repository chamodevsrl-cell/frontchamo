import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProductCatalog from "@/components/ProductCatalog";
import { featuredProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Ofertas | Chamo Import",
  description: "Ofertas y promociones de Chamo Import",
};

export default function OfertasPage() {
  const offers = featuredProducts.filter((product) => product.badge === "oferta");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <span className="inline-flex rounded-full bg-brand-gold px-2.5 py-1 text-xs font-extrabold text-brand-dark uppercase">
          Oferta
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
          Ofertas
        </h1>
        <p className="mt-3 max-w-xl text-brand-dark/70 dark:text-white/70">
          Selección con descuento referencial para mayoristas. Stock y precios de
          ejemplo.
        </p>
        <div className="mt-8">
          <ProductCatalog products={offers} />
        </div>
      </main>
    </div>
  );
}

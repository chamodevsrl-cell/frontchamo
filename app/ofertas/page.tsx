import type { Metadata } from "next";
import BrandsCarousel from "@/components/BrandsCarousel";
import Navbar from "@/components/Navbar";
import OffersBanner from "@/components/OffersBanner";
import ProductCatalog from "@/components/ProductCatalog";
import Reveal from "@/components/Reveal";
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
        <OffersBanner
          title="OFERTAS"
          stamp={{ lead: "OFERTAS", accent: "DESCUENTOS", variant: "offer" }}
          subtitle="Selección con descuento referencial para mayoristas. Stock y precios de ejemplo."
          crumbs={[
            { href: "/", label: "Inicio" },
            { label: "Ofertas" },
          ]}
        />
        <div className="my-8 sm:my-10">
          <BrandsCarousel variant="inline" />
        </div>
        <Reveal delayMs={80}>
          <div>
            <ProductCatalog products={offers} />
          </div>
        </Reveal>
      </main>
    </div>
  );
}

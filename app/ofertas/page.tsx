import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProductCatalog from "@/components/ProductCatalog";
import Reveal from "@/components/Reveal";
import StampHeading, { StampBand } from "@/components/StampHeading";
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
        <Reveal>
          <StampBand>
            <StampHeading
              lead="OFERTAS"
              accent="DESCUENTOS"
              variant="offer"
            />
            <p className="mt-6 max-w-xl text-sm text-brand-dark/70 sm:text-base dark:text-white/70">
              Selección con descuento referencial para mayoristas. Stock y precios de
              ejemplo.
            </p>
          </StampBand>
        </Reveal>
        <Reveal delayMs={80}>
          <div>
            <ProductCatalog products={offers} />
          </div>
        </Reveal>
      </main>
    </div>
  );
}

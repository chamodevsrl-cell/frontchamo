import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Ofertas | Chamo Import",
  description: "Ofertas y promociones de Chamo Import",
};

export default function OfertasPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <span className="inline-flex rounded-full bg-brand-gold px-2.5 py-1 text-xs font-extrabold text-brand-dark uppercase">
          Oferta
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
          Ofertas
        </h1>
        <p className="mt-3 max-w-xl text-brand-dark/70 dark:text-white/70">
          Pronto verás aquí las promociones activas de herramientas e importaciones.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-flex rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Ver catálogo
        </Link>
      </main>
    </div>
  );
}

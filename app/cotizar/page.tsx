import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Cotizar | Chamo Import",
  description: "Solicita una cotización mayorista en Chamo Import",
};

export default function CotizarPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <span className="inline-flex rounded-full bg-brand-gold px-2.5 py-1 text-xs font-extrabold text-brand-dark uppercase">
          Mayorista
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
          Cotizar pedido
        </h1>
        <p className="mt-3 max-w-xl text-brand-dark/70 dark:text-white/70">
          Completa el formulario. Se abre WhatsApp con tus datos y los productos
          del carrito ya prellenados.
        </p>
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-brand-dark/60">Cargando formulario…</p>
          }
        >
          <QuoteForm />
        </Suspense>
      </main>
    </div>
  );
}

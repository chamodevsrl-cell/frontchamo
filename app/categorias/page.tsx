import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoriesDirectory from "@/components/CategoriesDirectory";

export const metadata: Metadata = {
  title: "Categorías | Chamo Import",
  description: "Explora las categorías mayoristas de Chamo Import",
};

export default function CategoriasPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <Reveal>
          <Breadcrumbs
            items={[
              { href: "/", label: "Inicio" },
              { label: "Categorías" },
            ]}
          />
          <p className="mt-4 text-sm font-semibold tracking-wide text-brand-primary uppercase">
            Catálogo
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
            Categorías
          </h1>
          <p className="mt-3 max-w-2xl text-brand-dark/70 dark:text-white/70">
            Elige una línea para ver productos de ejemplo, collages de marcas de
            esa línea, fichas técnicas y cotizar por WhatsApp.
          </p>
        </Reveal>
        <CategoriesDirectory />
      </main>
    </div>
  );
}

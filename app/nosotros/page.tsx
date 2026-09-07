import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Nosotros | Chamo Import",
  description: "Conoce Chamo Import — ferretería e importaciones mayoristas",
};

export default function NosotrosPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
          Empresa
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-brand-dark sm:text-4xl dark:text-white">
          Nosotros
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-dark/75 dark:text-white/75">
          Somos Chamo Import S.R.L., una empresa dedicada a la importación y
          distribución de herramientas y productos para ferretería, con atención
          a mayoristas y distribuidores en todo el Perú.
        </p>
        <Link
          href="/contacto"
          className="mt-8 inline-flex rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Ir a Contacto
        </Link>
      </main>
    </div>
  );
}

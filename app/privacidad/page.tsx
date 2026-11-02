import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import LegalCopy from "@/components/LegalCopy";

export const metadata: Metadata = {
  title: "Política de privacidad | Chamo Import",
  description: "Cómo Chamo Import trata los datos de contacto de cotizaciones",
};

export default function PrivacidadPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <Reveal>
        <h1 className="font-display text-3xl font-bold text-brand-dark dark:text-white">
          Política de privacidad
        </h1>
        <div className="mt-6">
          <LegalCopy doc="privacidad" />
        </div>
        <p className="mt-6 text-sm text-brand-dark/80">
          Los{" "}
          <Link href="/terminos" className="font-semibold text-brand-primary">
            términos y condiciones
          </Link>{" "}
          describen el uso del catálogo.
        </p>
        </Reveal>
      </main>
    </div>
  );
}

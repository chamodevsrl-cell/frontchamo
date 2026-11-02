import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import LegalCopy from "@/components/LegalCopy";

export const metadata: Metadata = {
  title: "Términos y condiciones | Chamo Import",
  description: "Términos de uso del catálogo mayorista Chamo Import",
};

export default function TerminosPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <Reveal>
        <h1 className="font-display text-3xl font-bold text-brand-dark dark:text-white">
          Términos y condiciones
        </h1>
        <div className="mt-6">
          <LegalCopy doc="terminos" />
        </div>
        <p className="mt-6 text-sm text-brand-dark/80">
          Ver también la{" "}
          <Link href="/privacidad" className="font-semibold text-brand-primary">
            política de privacidad
          </Link>
          .
        </p>
        </Reveal>
      </main>
    </div>
  );
}

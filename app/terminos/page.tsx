import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import { COMPANY_NAME, EMAIL, PHONE_DISPLAY } from "@/data/contact";

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
        <p className="mt-2 text-sm text-brand-dark/55 dark:text-white/55">
          Última actualización: 9 de septiembre de 2026
        </p>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-dark/80 dark:text-white/80">
          <p>
            Este sitio es un catálogo mayorista de {COMPANY_NAME}. Los precios,
            stock y fichas técnicas publicados son referenciales hasta confirmar
            disponibilidad y condiciones comerciales.
          </p>
          <p>
            Las solicitudes de cotización (formulario o WhatsApp) no constituyen
            una orden de compra. El pedido se confirma cuando {COMPANY_NAME}{" "}
            emite una cotización o proforma aceptada por el cliente.
          </p>
          <p>
            El uso del catálogo implica no copiar contenidos, imágenes o datos
            de productos con fines distintos a evaluar una compra mayorista.
          </p>
          <p>
            Para consultas: {EMAIL} / {PHONE_DISPLAY}. Ver también la{" "}
            <Link href="/privacidad" className="font-semibold text-brand-primary">
              política de privacidad
            </Link>
            .
          </p>
        </div>
        </Reveal>
      </main>
    </div>
  );
}

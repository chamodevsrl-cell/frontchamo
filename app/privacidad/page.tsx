import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { COMPANY_NAME, EMAIL } from "@/data/contact";

export const metadata: Metadata = {
  title: "Política de privacidad | Chamo Import",
  description: "Cómo Chamo Import trata los datos de contacto de cotizaciones",
};

export default function PrivacidadPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-brand-dark dark:text-white">
          Política de privacidad
        </h1>
        <p className="mt-2 text-sm text-brand-dark/55 dark:text-white/55">
          Última actualización: 9 de septiembre de 2026
        </p>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-dark/80 dark:text-white/80">
          <p>
            {COMPANY_NAME} recolecta los datos que usted envía en el formulario
            de cotización o por WhatsApp (nombre, empresa, RUC, teléfono, correo
            y detalle del pedido) solo para atender la solicitud comercial.
          </p>
          <p>
            No vendemos esas listas. El mensaje se abre en WhatsApp bajo su
            control; el boletín del pie de página es una suscripción voluntaria
            y aún no está conectado a un proveedor de correo.
          </p>
          <p>
            Para acceder, corregir o retirar sus datos, escriba a {EMAIL}. Los{" "}
            <Link href="/terminos" className="font-semibold text-brand-primary">
              términos y condiciones
            </Link>{" "}
            describen el uso del catálogo.
          </p>
        </div>
      </main>
    </div>
  );
}

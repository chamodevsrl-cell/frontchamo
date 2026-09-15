import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import SitePageBanner from "@/components/SitePageBanner";
import {
  SiteContactChannels,
  SiteContactMap,
  SiteContactVisit,
} from "@/components/SiteContactInfo";

export const metadata: Metadata = {
  title: "Contacto | Chamo Import",
  description:
    "Habla con Chamo Import S.R.L. por WhatsApp, teléfono o visita. Atención mayorista en Lima.",
};

export default function ContactoPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10">
        <SitePageBanner
          pageId="contacto"
          title="CONTACTO"
          eyebrow="Mayorista"
          subtitle="Atención a ferreterías, distribuidores y obras. Cotiza por WhatsApp o visítanos en Lima."
          stamp={{ lead: "NUESTRO", accent: "CONTACTO" }}
          crumbs={[
            { href: "/", label: "Inicio" },
            { label: "Contacto" },
          ]}
          cta={{ href: "#escribir", label: "Escribir ahora" }}
          whatsappCta="Hola, quiero información como mayorista de Chamo Import."
          ctaAlt={{ href: "", label: "WhatsApp", external: true }}
        />

        <SiteContactChannels />

        <div
          id="escribir"
          className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start"
        >
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delayMs={80}>
            <SiteContactVisit />
          </Reveal>
        </div>

        <Reveal>
          <SiteContactMap />
        </Reveal>
      </main>
    </div>
  );
}

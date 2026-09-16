import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import ClaimForm from "@/components/ClaimForm";
import SitePageBanner from "@/components/SitePageBanner";
import { SiteContactChannels } from "@/components/SiteContactInfo";

export const metadata: Metadata = {
  title: "Reclamaciones | Chamo Import",
  description: "Registra un reclamo mayorista. Chamo Import S.R.L. te atiende por WhatsApp.",
};

export default function ReclamacionesPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10">
        <SitePageBanner
          pageId="contacto"
          title="RECLAMACIONES"
          eyebrow="Atención mayorista"
          subtitle="Describe el inconveniente. Queda registrado en el panel y se abre WhatsApp con tus datos."
          stamp={{ lead: "LIBRO DE", accent: "RECLAMOS" }}
          crumbs={[
            { href: "/", label: "Inicio" },
            { label: "Reclamaciones" },
          ]}
          cta={{ href: "#reclamo", label: "Registrar reclamo" }}
        />

        <SiteContactChannels />

        <div id="reclamo">
          <Reveal>
            <ClaimForm />
          </Reveal>
        </div>
      </main>
    </div>
  );
}

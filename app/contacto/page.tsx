import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import StampHeading, { StampBand } from "@/components/StampHeading";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import {
  COMPANY_NAME,
  EMAIL,
  MAP_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/data/contact";

export const metadata: Metadata = {
  title: "Contacto | Chamo Import",
  description: "Contáctanos — Chamo Import S.R.L.",
};

export default function ContactoPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <Reveal>
          <StampBand>
            <StampHeading lead="NUESTRO" accent="CONTACTO" />
            <p className="mt-6 max-w-2xl text-sm text-brand-dark/75 sm:text-base dark:text-white/75">
              Escríbenos o visítanos. Atención mayorista y distribuidores.
            </p>
          </StampBand>
        </Reveal>
        <Reveal delayMs={80}>
        <ul className="mt-2 max-w-md space-y-4 text-sm text-brand-dark dark:text-white">
          <li className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-brand-primary" strokeWidth={2} />
            <a href={`tel:${PHONE_TEL}`} className="hover:underline">
              {PHONE_DISPLAY}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-brand-primary" strokeWidth={2} />
            <a href={`mailto:${EMAIL}`} className="hover:underline">
              {EMAIL}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-brand-primary" strokeWidth={2} />
            Lun - Sáb 8:00am a 6:00pm
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-brand-primary" strokeWidth={2} />
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {COMPANY_NAME} — Ver en Google Maps
            </a>
          </li>
        </ul>
        </Reveal>
      </main>
    </div>
  );
}

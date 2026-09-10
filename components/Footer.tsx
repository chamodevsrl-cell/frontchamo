"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Clock,
  Wallet,
  Send,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";
import { LOGO_SRC } from "@/data/media";
import Reveal from "@/components/Reveal";
import {
  COMPANY_NAME,
  EMAIL,
  MAP_EMBED_URL,
  MAP_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/data/contact";

const quickLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/categorias", label: "Categorías" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

const legalLinks = [
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Política de privacidad" },
] as const;

const paymentMethods = [
  { id: "visa", label: "Visa", hint: "Crédito / Débito" },
  { id: "mastercard", label: "Mastercard", hint: "Crédito / Débito" },
  { id: "yape", label: "Yape", hint: "Billetera digital" },
  { id: "plin", label: "Plin", hint: "Billetera digital" },
] as const;

function PaymentBadge({
  id,
  label,
  hint,
}: {
  id: (typeof paymentMethods)[number]["id"];
  label: string;
  hint: string;
}) {
  const styles: Record<string, string> = {
    visa: "bg-[#1A1F71] text-white",
    mastercard: "bg-gradient-to-br from-[#EB001B] to-[#F79E1B] text-white",
    yape: "bg-[#742284] text-white",
    plin: "bg-[#00A0E3] text-white",
  };

  return (
    <div
      className={`flex min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-md px-2.5 py-2 shadow-sm ${styles[id]}`}
      title={`${label} — ${hint}`}
    >
      {id === "yape" || id === "plin" ? (
        <Wallet className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      ) : (
        <CreditCard className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      )}
      <span className="text-[10px] font-bold tracking-wide uppercase">{label}</span>
    </div>
  );
}

export default function Footer() {
  const [logoFailed, setLogoFailed] = useState(false);
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmail("");
  }

  return (
    <footer className="mt-auto bg-brand-dark text-white">
      <Reveal>
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:px-8 xl:px-10">
        {/* Marca */}
        <div className="lg:col-span-3">
          <Link href="/" className="mb-4 inline-flex items-center gap-3">
            {!logoFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={LOGO_SRC}
                alt="Chamo Import"
                className="h-12 w-auto max-w-[160px] object-contain brightness-0 invert"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="font-display text-xl font-bold tracking-wide text-white">
                CHAMO IMPORT
              </span>
            )}
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            Tu aliado en cada proyecto. Ferretería e importaciones mayoristas
            para distribuidores en todo el Perú.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-base font-bold text-brand-primary">
            Enlaces rápidos
          </h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="lg:col-span-3">
          <h3 className="font-display text-base font-bold text-brand-primary">
            Información de contacto
          </h3>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p className="flex items-start gap-2.5">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                strokeWidth={2}
              />
              {COMPANY_NAME} — Lima, Perú
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center gap-2.5 transition hover:text-white"
            >
              <Phone
                className="h-4 w-4 shrink-0 text-brand-primary"
                strokeWidth={2}
              />
              {PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2.5 transition hover:text-white"
            >
              <Mail
                className="h-4 w-4 shrink-0 text-brand-primary"
                strokeWidth={2}
              />
              {EMAIL}
            </a>
            <p className="flex items-center gap-2.5">
              <Clock
                className="h-4 w-4 shrink-0 text-brand-primary"
                strokeWidth={2}
              />
              Lun - Sáb 8:00am a 6:00pm
            </p>
          </div>
        </div>

        {/* Pagos */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-base font-bold text-brand-primary">
            Métodos de pago
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <PaymentBadge
                key={method.id}
                id={method.id}
                label={method.label}
                hint={method.hint}
              />
            ))}
          </div>
        </div>

        {/* Mapa + boletín */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-base font-bold text-brand-primary">
            Ubicación
          </h3>
          <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
            <iframe
              title="Ubicación Chamo Import en Google Maps"
              src={MAP_EMBED_URL}
              className="h-28 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-semibold text-brand-primary transition hover:text-white"
          >
            Abrir en Google Maps
          </a>

          <h3 className="mt-5 font-display text-base font-bold text-brand-primary">
            Boletín
          </h3>
          <p className="mt-1.5 text-xs text-white/60">
            Suscríbete a nuestro boletín
          </p>
          <form onSubmit={handleNewsletter} className="mt-2 flex overflow-hidden rounded-md">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Tu correo"
              required
              className="min-w-0 flex-1 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:bg-white/15"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-brand-primary px-3 text-white transition hover:bg-[#0f6aad]"
              aria-label="Suscribirse"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-4 text-center text-xs text-white/50 sm:flex-row sm:px-6 sm:text-left lg:px-8 xl:px-10">
          <p>© {year} {COMPANY_NAME}. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition hover:text-brand-primary"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition hover:text-brand-primary"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition hover:text-brand-primary"
              aria-label="YouTube"
            >
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      </Reveal>
    </footer>
  );
}

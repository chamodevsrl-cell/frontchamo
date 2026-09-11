import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";
import {
  ADDRESS_DISPLAY,
  ADDRESS_HINT,
  COMPANY_NAME,
  CONTACT_BANNER_ALT,
  CONTACT_BANNER_SRC,
  EMAIL,
  HOURS_DISPLAY,
  HOURS_HINT,
  MAP_EMBED_URL,
  MAP_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SOCIAL_LINKS,
  whatsappUrl,
} from "@/data/contact";

export const metadata: Metadata = {
  title: "Contacto | Chamo Import",
  description:
    "Habla con Chamo Import S.R.L. por WhatsApp, teléfono o visita. Atención mayorista en Lima.",
};

const whatsappHref = whatsappUrl(
  "Hola, quiero información como mayorista de Chamo Import.",
);

const channels = [
  {
    id: "whatsapp",
    href: whatsappHref,
    external: true,
    icon: MessageCircle,
    label: "WhatsApp",
    value: PHONE_DISPLAY,
    hint: "Respuesta el mismo día hábil",
    accent: true,
  },
  {
    id: "phone",
    href: `tel:${PHONE_TEL}`,
    external: false,
    icon: Phone,
    label: "Teléfono",
    value: PHONE_DISPLAY,
    hint: "Llamadas de lunes a sábado",
    accent: false,
  },
  {
    id: "email",
    href: `mailto:${EMAIL}`,
    external: false,
    icon: Mail,
    label: "Correo",
    value: EMAIL,
    hint: "Cotizaciones y consultas",
    accent: false,
  },
  {
    id: "hours",
    href: "#mapa",
    external: false,
    icon: Clock,
    label: "Horario",
    value: HOURS_DISPLAY,
    hint: HOURS_HINT,
    accent: false,
  },
] as const;

const socialIcon = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
} as const;

export default function ContactoPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10">
        <PageBanner
          title="CONTACTO"
          eyebrow="Mayorista"
          subtitle="Atención a ferreterías, distribuidores y obras. Cotiza por WhatsApp o visítanos en Lima."
          image={CONTACT_BANNER_SRC}
          imageAlt={CONTACT_BANNER_ALT}
          stamp={{ lead: "NUESTRO", accent: "CONTACTO" }}
          crumbs={[
            { href: "/", label: "Inicio" },
            { label: "Contacto" },
          ]}
          cta={{ href: "#escribir", label: "Escribir ahora" }}
          ctaAlt={{
            href: whatsappHref,
            label: "WhatsApp",
            external: true,
          }}
        />

        <Reveal>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const inner = (
                <>
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                      channel.accent
                        ? "bg-brand-whatsapp text-white"
                        : "bg-brand-primary/10 text-brand-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                  </span>
                  <p className="mt-3 text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                    {channel.label}
                  </p>
                  <p className="mt-1 font-display text-base font-bold text-brand-dark dark:text-white">
                    {channel.value}
                  </p>
                  <p className="mt-1 text-xs text-brand-dark/55 dark:text-white/55">
                    {channel.hint}
                  </p>
                </>
              );

              const className =
                "flex h-full flex-col rounded-2xl border border-brand-primary/20 bg-white p-5 shadow-[0_0_16px_rgba(18,126,201,0.1)] transition hover:-translate-y-0.5 dark:bg-[#102a40]";

              return (
                <li key={channel.id}>
                  {channel.external ? (
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {inner}
                    </a>
                  ) : (
                    <a href={channel.href} className={className}>
                      {inner}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <div
          id="escribir"
          className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start"
        >
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delayMs={80}>
            <aside className="space-y-4 rounded-2xl border border-brand-dark/10 bg-white p-5 sm:p-6 dark:bg-[#102a40]">
              <p className="text-sm font-bold tracking-wide text-brand-primary uppercase">
                Visítanos
              </p>
              <h2 className="font-display text-2xl font-extrabold text-brand-dark dark:text-white">
                {COMPANY_NAME}
              </h2>
              <p className="flex items-start gap-2 text-sm text-brand-dark/75 dark:text-white/75">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                  strokeWidth={2.25}
                />
                <span>
                  <span className="font-semibold text-brand-dark dark:text-white">
                    {ADDRESS_DISPLAY}
                  </span>
                  <span className="mt-1 block">{ADDRESS_HINT}</span>
                </span>
              </p>
              <p className="text-sm text-brand-dark/70 dark:text-white/70">
                Para un pedido con SKU y cantidades, usa la cotización mayorista.
                Este formulario es para consultas rápidas.
              </p>
              <Link
                href="/cotizar"
                className="inline-flex rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Ir a cotizar pedido
              </Link>

              <div className="border-t border-brand-dark/10 pt-4 dark:border-white/10">
                <p className="text-xs font-bold tracking-wide text-brand-dark/50 uppercase dark:text-white/50">
                  Redes
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {SOCIAL_LINKS.map((social) => {
                    const Icon = socialIcon[social.id];
                    return (
                      <li key={social.id}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-brand-dark/12 px-3 py-1.5 text-sm font-semibold text-brand-dark transition hover:border-brand-primary hover:text-brand-primary dark:text-white"
                        >
                          <Icon className="h-4 w-4" />
                          {social.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          </Reveal>
        </div>

        <Reveal>
          <section
            id="mapa"
            aria-labelledby="mapa-heading"
            className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-white dark:bg-[#102a40]"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="mapa-heading"
                  className="font-display text-xl font-bold text-brand-dark dark:text-white"
                >
                  Cómo llegar
                </h2>
                <p className="mt-1 text-sm text-brand-dark/60 dark:text-white/60">
                  {ADDRESS_DISPLAY} — {COMPANY_NAME}
                </p>
              </div>
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"
              >
                <MapPin className="h-4 w-4" strokeWidth={2.25} />
                Abrir en Google Maps
              </a>
            </div>
            <iframe
              title={`Ubicación de ${COMPANY_NAME} en Google Maps`}
              src={MAP_EMBED_URL}
              className="h-64 w-full border-0 sm:h-80 lg:h-[28rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </section>
        </Reveal>
      </main>
    </div>
  );
}

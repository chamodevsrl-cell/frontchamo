import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import {
  COMPANY_NAME,
  MAP_URL,
  PHONE_DISPLAY,
} from "@/data/contact";
import {
  NOSOTROS_BANNER_ALT,
  NOSOTROS_BANNER_SRC,
  companyMission,
  companyProfile,
  companyValues,
  companyVision,
} from "@/data/company";

export const metadata: Metadata = {
  title: "Nosotros | Chamo Import",
  description: "Misión, visión e historia de Chamo Import S.R.L.",
};

export default function NosotrosPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10">
        <PageBanner
          title="NOSOTROS"
          eyebrow="Empresa"
          subtitle={companyProfile.headline}
          image={NOSOTROS_BANNER_SRC}
          imageAlt={NOSOTROS_BANNER_ALT}
          stamp={{ lead: "SOBRE", accent: "NOSOTROS" }}
          crumbs={[
            { href: "/", label: "Inicio" },
            { label: "Nosotros" },
          ]}
          cta={{ href: "#mision-vision", label: "Ver misión y visión" }}
        />

        <Reveal>
          <section className="rounded-2xl border border-brand-dark/10 bg-white p-6 sm:p-8 dark:bg-[#102a40]">
            <p className="text-sm font-bold tracking-wide text-brand-primary uppercase">
              Quiénes somos
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-brand-dark sm:text-3xl dark:text-white">
              {companyProfile.name}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-dark/75 dark:text-white/75">
              {companyProfile.story}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-4">
              {companyProfile.highlights.map((item) => (
                <li
                  key={item.label}
                  className="rounded-xl border border-brand-primary/20 bg-brand-gray/70 px-4 py-3 dark:bg-brand-dark/40"
                >
                  <p className="text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-brand-dark dark:text-white">
                    {item.value}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delayMs={80}>
          <section
            id="mision-vision"
            className="grid gap-5 lg:grid-cols-2"
            aria-label="Misión y visión"
          >
            <article className="relative overflow-hidden rounded-2xl border border-brand-primary/25 bg-white p-6 shadow-[0_0_24px_rgba(18,126,201,0.18)] sm:p-8 dark:bg-[#102a40]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-white">
                <Target className="h-6 w-6" strokeWidth={2.25} />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-brand-dark dark:text-white">
                Misión
              </h2>
              <p className="mt-3 text-base leading-relaxed text-brand-dark/75 dark:text-white/75">
                {companyMission}
              </p>
            </article>
            <article className="relative overflow-hidden rounded-2xl border border-brand-gold/40 bg-white p-6 shadow-[0_0_24px_rgba(228,183,20,0.2)] sm:p-8 dark:bg-[#102a40]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold text-brand-dark">
                <Eye className="h-6 w-6" strokeWidth={2.25} />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-brand-dark dark:text-white">
                Visión
              </h2>
              <p className="mt-3 text-base leading-relaxed text-brand-dark/75 dark:text-white/75">
                {companyVision}
              </p>
            </article>
          </section>
        </Reveal>

        <Reveal delayMs={160}>
          <section>
            <h2 className="font-display text-2xl font-extrabold text-brand-dark dark:text-white">
              Cómo trabajamos
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {companyValues.map((value) => (
                <li
                  key={value.title}
                  className="rounded-2xl border border-brand-dark/10 bg-white p-5 dark:bg-[#102a40]"
                >
                  <h3 className="font-display text-lg font-bold text-brand-primary">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-dark/70 dark:text-white/70">
                    {value.text}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-brand-dark/60 dark:text-white/60">
              {COMPANY_NAME} · {PHONE_DISPLAY} ·{" "}
              <Link href="/contacto" className="font-semibold text-brand-primary">
                Contacto
              </Link>
              {" · "}
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-primary"
              >
                Lima en Maps
              </a>
            </p>
          </section>
        </Reveal>
      </main>
    </div>
  );
}

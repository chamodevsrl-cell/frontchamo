import Image from "next/image";
import Reveal from "@/components/Reveal";
import StampHeading from "@/components/StampHeading";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";

export type PageBannerCrumb = Crumb;

type BannerCta = { href: string; label: string; external?: boolean };

type PageBannerProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  crumbs?: Crumb[];
  brands?: readonly string[];
  cta?: BannerCta;
  ctaAlt?: BannerCta;
  stamp?: { lead?: string; accent: string; variant?: "default" | "offer" };
};

function BannerAction({ href, label, external }: BannerCta) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-5 py-2.5 text-sm font-bold tracking-wide text-white uppercase shadow-[4px_4px_0_0_#0B3554] transition hover:bg-brand-dark"
    >
      {label}
    </a>
  );
}

export default function PageBanner({
  title,
  eyebrow,
  subtitle,
  image,
  imageAlt,
  crumbs,
  brands = [],
  cta,
  ctaAlt,
  stamp,
}: PageBannerProps) {
  return (
    <Reveal>
    <section
      aria-labelledby="page-banner-title"
      className="relative isolate overflow-hidden rounded-2xl border border-brand-dark/20 shadow-[0_12px_32px_rgba(11,53,84,0.18)]"
    >
      <div className="relative min-h-[220px] sm:min-h-[300px] lg:min-h-[360px]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          preload
          className="object-cover"
          sizes="(max-width: 1600px) 100vw, 1600px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/55 via-brand-dark/50 to-brand-dark/70" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-brand-primary sm:w-4" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-brand-gold sm:w-4" />

        <div className="relative z-10 flex min-h-[220px] flex-col items-center justify-center px-8 py-12 text-center sm:min-h-[300px] lg:min-h-[360px]">
          {crumbs && crumbs.length > 0 ? (
            <Breadcrumbs items={crumbs} tone="light" className="justify-center" />
          ) : null}
          {eyebrow && !stamp ? (
            <span className="mt-3 inline-flex rounded-md bg-brand-gold px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-brand-dark uppercase">
              {eyebrow}
            </span>
          ) : null}
          {stamp ? (
            <div className="mt-4">
              <StampHeading
                id="page-banner-title"
                lead={stamp.lead}
                accent={stamp.accent}
                variant={stamp.variant}
              />
            </div>
          ) : (
            <h1
              id="page-banner-title"
              className="mt-4 bg-white px-5 py-2.5 font-display text-3xl font-extrabold tracking-tight text-brand-dark uppercase shadow-[8px_8px_0_0_#0B3554] sm:px-10 sm:py-4 sm:text-5xl lg:text-6xl"
            >
              {title}
            </h1>
          )}
          {subtitle ? (
            <p className="mt-5 max-w-xl text-sm text-white/90 sm:text-base">
              {subtitle}
            </p>
          ) : null}
          {brands.length > 0 ? (
            <ul className="mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
              {brands.map((brand) => (
                <li
                  key={brand}
                  className="rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-brand-dark uppercase"
                >
                  {brand}
                </li>
              ))}
            </ul>
          ) : null}
          {cta || ctaAlt ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {cta ? <BannerAction {...cta} /> : null}
              {ctaAlt ? (
                <span className="[&>a]:bg-brand-whatsapp [&>a]:shadow-[4px_4px_0_0_#0B3554] [&>a]:hover:bg-[#1ebe57]">
                  <BannerAction {...ctaAlt} />
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
    </Reveal>
  );
}

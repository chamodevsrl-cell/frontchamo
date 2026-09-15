"use client";

import PageBanner, { type PageBannerCrumb } from "@/components/PageBanner";
import StampHeading, { StampBand } from "@/components/StampHeading";
import { useSiteContent } from "@/components/ContentProvider";
import { cmsWhatsappUrl, footerWhatsapp } from "@/lib/cms";
import type { PageBannerId } from "@/data/page-banners";

type BannerCta = { href: string; label: string; external?: boolean };

export default function SitePageBanner({
  pageId,
  title,
  eyebrow,
  subtitle,
  stamp,
  crumbs,
  cta,
  ctaAlt,
  whatsappCta,
}: {
  pageId: PageBannerId;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  stamp?: { lead?: string; accent: string; variant?: "default" | "offer" };
  crumbs?: PageBannerCrumb[];
  cta?: BannerCta;
  ctaAlt?: BannerCta;
  whatsappCta?: string;
}) {
  const { pageBanners, footer } = useSiteContent();
  const banner = pageBanners.find((item) => item.id === pageId);
  const resolvedCtaAlt =
    whatsappCta && footerWhatsapp(footer)
      ? {
          href: cmsWhatsappUrl(footerWhatsapp(footer), whatsappCta),
          label: ctaAlt?.label ?? "WhatsApp",
          external: true as const,
        }
      : ctaAlt;

  if (!banner || banner.hidden) {
    return (
      <StampBand crumbs={crumbs}>
        {stamp ? (
          <StampHeading
            lead={stamp.lead}
            accent={stamp.accent}
            variant={stamp.variant}
          />
        ) : (
          <h1 className="font-display text-3xl font-extrabold text-brand-dark uppercase dark:text-white">
            {title}
          </h1>
        )}
        {subtitle ? (
          <p className="mt-6 max-w-xl text-sm text-brand-dark/70 sm:text-base dark:text-white/70">
            {subtitle}
          </p>
        ) : null}
      </StampBand>
    );
  }

  return (
    <PageBanner
      title={title}
      eyebrow={eyebrow}
      subtitle={subtitle}
      image={banner.src}
      imageAlt={banner.alt}
      stamp={stamp}
      crumbs={crumbs}
      cta={cta}
      ctaAlt={resolvedCtaAlt}
    />
  );
}

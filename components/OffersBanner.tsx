"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteContent } from "@/components/ContentProvider";
import SitePageBanner from "@/components/SitePageBanner";
import type { PageBannerCrumb } from "@/components/PageBanner";
import ProductModal from "@/components/ProductModal";
import StampHeading from "@/components/StampHeading";
import Breadcrumbs from "@/components/Breadcrumbs";
import CmsImage from "@/components/CmsImage";
import Reveal from "@/components/Reveal";
import { formatPrice } from "@/lib/format";
import { getProductById, type FeaturedProduct } from "@/data/products";
import type { CmsOfferBannerTile } from "@/lib/cms";

type ResolvedTile = { tile: CmsOfferBannerTile; product: FeaturedProduct | null };

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function TileContent({ tile, product }: ResolvedTile) {
  return (
    <>
      <CmsImage
        src={tile.image}
        alt={tile.alt || product?.name || tile.label || "Oferta"}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
        sizes="(max-width: 1024px) 50vw, 20vw"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3.5">
        <span className="font-display text-sm leading-tight font-bold text-white uppercase sm:text-base">
          {tile.label || product?.name || "Ver más"}
        </span>
        {product ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded bg-brand-gold px-2 py-0.5 text-xs font-extrabold text-brand-dark">
            {formatPrice(product.price)}
            {product.oldPrice > product.price ? (
              <span className="font-semibold text-brand-dark/60 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
    </>
  );
}

export default function OffersBanner({
  title,
  stamp,
  subtitle,
  crumbs,
}: {
  title: string;
  stamp?: { lead?: string; accent: string; variant?: "default" | "offer" };
  subtitle?: string;
  crumbs?: PageBannerCrumb[];
}) {
  const { cms, ready } = useSiteContent();
  const [selected, setSelected] = useState<FeaturedProduct | null>(null);

  if (!ready) return null;

  const tiles: ResolvedTile[] = cms.offerBanner.flatMap((tile) => {
    const product = tile.productId ? (getProductById(tile.productId) ?? null) : null;
    const hasDestination = Boolean(tile.url.trim()) || Boolean(product);
    return hasDestination ? [{ tile, product }] : [];
  });

  if (tiles.length === 0) {
    return (
      <SitePageBanner
        pageId="ofertas"
        title={title}
        stamp={stamp}
        subtitle={subtitle}
        crumbs={crumbs}
      />
    );
  }

  return (
    <>
      <Reveal>
        <section
          aria-labelledby="offers-banner-title"
          className="relative isolate overflow-hidden rounded-2xl border border-brand-dark/20 shadow-[0_12px_32px_rgba(11,53,84,0.18)]"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col items-center justify-center gap-3 bg-brand-dark px-6 py-8 text-center lg:w-64 lg:shrink-0 lg:items-start lg:px-7 lg:text-left xl:w-72">
              {crumbs && crumbs.length > 0 ? (
                <Breadcrumbs items={crumbs} tone="light" className="justify-center lg:justify-start" />
              ) : null}
              {stamp ? (
                <StampHeading
                  id="offers-banner-title"
                  lead={stamp.lead}
                  accent={stamp.accent}
                  variant={stamp.variant}
                />
              ) : (
                <h1
                  id="offers-banner-title"
                  className="bg-white px-5 py-2.5 font-display text-2xl font-extrabold tracking-tight text-brand-dark uppercase shadow-[8px_8px_0_0_#0B3554]"
                >
                  {title}
                </h1>
              )}
              {subtitle ? (
                <p className="max-w-xs text-sm text-white/85">{subtitle}</p>
              ) : null}
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-1">
              {tiles.map(({ tile, product }) => {
                const url = tile.url.trim();
                const tileClassName =
                  "group absolute inset-0 block h-full w-full overflow-hidden text-left";

                return (
                  <li
                    key={tile.id}
                    className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[300px] lg:flex-1 xl:min-h-[340px]"
                  >
                    {url ? (
                      isExternalUrl(url) ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={tileClassName}
                        >
                          <TileContent tile={tile} product={product} />
                        </a>
                      ) : (
                        <Link href={url} className={tileClassName}>
                          <TileContent tile={tile} product={product} />
                        </Link>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => product && setSelected(product)}
                        className={tileClassName}
                      >
                        <TileContent tile={tile} product={product} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </Reveal>

      {selected ? (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
          onSelectProduct={(product) => setSelected(product)}
        />
      ) : null}
    </>
  );
}

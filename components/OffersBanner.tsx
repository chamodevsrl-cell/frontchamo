"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteContent } from "@/components/ContentProvider";
import SitePageBanner from "@/components/SitePageBanner";
import type { PageBannerCrumb } from "@/components/PageBanner";
import ProductModal from "@/components/ProductModal";
import CmsImage from "@/components/CmsImage";
import Reveal from "@/components/Reveal";
import { formatPrice } from "@/lib/format";
import { getProductById, type FeaturedProduct } from "@/data/products";
import type { CmsOfferBannerTile } from "@/lib/cms";

/** El banner de 4 secciones solo reemplaza al normal cuando las 4 tienen foto + destino. */
const SECTIONS = 4;

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
        sizes="(max-width: 768px) 50vw, 25vw"
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

  const resolved: ResolvedTile[] = cms.offerBanner.flatMap((tile) => {
    if (!tile.image.trim()) return [];
    const product = tile.productId ? (getProductById(tile.productId) ?? null) : null;
    const hasDestination = Boolean(tile.url.trim()) || Boolean(product);
    return hasDestination ? [{ tile, product }] : [];
  });

  if (resolved.length < SECTIONS) {
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

  const tiles = resolved.slice(0, SECTIONS);

  return (
    <>
      <Reveal>
        <ul
          aria-label="Ofertas destacadas"
          className="grid grid-cols-2 gap-[3px] overflow-hidden rounded-2xl border-[3px] border-brand-dark/30 bg-brand-dark/20 shadow-[0_12px_32px_rgba(11,53,84,0.18)] sm:border-4 sm:grid-cols-4"
        >
          {tiles.map(({ tile, product }) => {
            const url = tile.url.trim();
            const tileClassName =
              "group absolute inset-0 block h-full w-full overflow-hidden text-left";

            return (
              <li key={tile.id} className="relative aspect-[4/5] bg-brand-gray sm:min-h-[320px]">
                {url ? (
                  isExternalUrl(url) ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className={tileClassName}>
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

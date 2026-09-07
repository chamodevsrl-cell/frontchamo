"use client";

import { useState } from "react";
import { distributorBrands } from "@/data/home";

function BrandCard({
  name,
  src,
}: {
  name: string;
  src: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-16 w-[140px] shrink-0 items-center justify-center rounded-md border border-brand-dark/8 bg-white px-4 shadow-sm sm:h-[4.5rem] sm:w-[155px]">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="max-h-8 max-w-[100px] object-contain sm:max-h-9 sm:max-w-[110px]"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-display text-[11px] font-bold tracking-wide text-brand-dark/55 uppercase">
          {name}
        </span>
      )}
    </div>
  );
}

export default function BrandsCarousel() {
  // Duplicado para loop continuo
  const loop = [...distributorBrands, ...distributorBrands];

  return (
    <section
      className="overflow-hidden border-t border-brand-primary/25 bg-[#eef2f5]"
      aria-labelledby="marcas-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <h2
          id="marcas-heading"
          className="mb-6 text-center font-display text-sm font-semibold tracking-[0.18em] uppercase sm:text-base"
        >
          <span className="text-brand-primary">Marcas </span>
          <span className="font-bold text-brand-dark">distribuidoras</span>
        </h2>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#eef2f5] to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#eef2f5] to-transparent sm:w-16" />

          <div className="overflow-hidden">
            <ul className="animate-brands-marquee flex w-max gap-3 py-1 sm:gap-4">
              {loop.map((brand, index) => (
                <li key={`${brand.id}-${index}`} aria-hidden={index >= distributorBrands.length}>
                  <BrandCard name={brand.name} src={brand.src} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

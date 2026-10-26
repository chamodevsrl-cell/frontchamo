"use client";

import { FileDown } from "lucide-react";
import { CATALOG_PDF_SRC } from "@/data/media";

export default function CatalogPdfFloat() {
  const ready = CATALOG_PDF_SRC.trim().length > 0;
  const className =
    "group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-[0_8px_24px_rgba(18,126,201,0.45)] transition duration-200 hover:scale-105 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:h-16 sm:w-16";

  const tooltip = (
    <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-brand-dark px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">
      {ready ? "Descargar catálogo" : "Catálogo PDF (próximamente)"}
    </span>
  );

  if (ready) {
    return (
      <a
        href={CATALOG_PDF_SRC}
        download
        aria-label="Descargar catálogo PDF"
        className={className}
      >
        <FileDown className="relative h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} />
        {tooltip}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label="Descargar catálogo PDF (próximamente)"
      title="Catálogo PDF — próximamente"
      className={`${className} cursor-default opacity-90`}
    >
      <FileDown className="relative h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} />
      {tooltip}
    </button>
  );
}

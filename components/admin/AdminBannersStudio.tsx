"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw, Save } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import CmsImage from "@/components/CmsImage";
import CmsImageField, { fieldClass } from "@/components/admin/CmsImageField";
import { slides as defaultSlides } from "@/data/media";
import { pageBannerCatalog } from "@/data/page-banners";
import type { CmsPageBannerOverride, CmsState } from "@/lib/cms";

type SlideDraft = {
  id: number;
  src: string;
  alt: string;
  hidden: boolean;
};

type PageDraft = {
  id: CmsPageBannerOverride["id"];
  label: string;
  href: string;
  src: string;
  alt: string;
  hidden: boolean;
};

function slidesFromCms(cms: CmsState): SlideDraft[] {
  return defaultSlides.map((slide) => {
    const over = cms.slides.find((item) => item.id === slide.id);
    return {
      id: slide.id,
      src: over?.src ?? slide.src,
      alt: over?.alt ?? slide.alt,
      hidden: over?.hidden ?? false,
    };
  });
}

function pagesFromCms(cms: CmsState): PageDraft[] {
  return pageBannerCatalog.map((item) => {
    const over = cms.pageBanners.find((entry) => entry.id === item.id);
    return {
      id: item.id,
      label: item.label,
      href: item.href,
      src: over?.src ?? item.src,
      alt: over?.alt ?? item.alt,
      hidden: over?.hidden ?? false,
    };
  });
}

export default function AdminBannersStudio() {
  const { cms, ready } = useSiteContent();

  if (!ready) {
    return <p className="text-sm text-brand-dark/70">Cargando banners…</p>;
  }

  return <AdminBannersStudioForm cms={cms} />;
}

function AdminBannersStudioForm({ cms }: { cms: CmsState }) {
  const { saveCms } = useSiteContent();
  const [slides, setSlides] = useState(() => slidesFromCms(cms));
  const [pages, setPages] = useState(() => pagesFromCms(cms));
  const [openId, setOpenId] = useState<string | null>("home-1");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function persist() {
    const saveError = saveCms({
      slides: slides.map((slide) => ({
        id: slide.id,
        src: slide.src,
        alt: slide.alt,
        hidden: slide.hidden,
      })),
      pageBanners: pages.map((page) => ({
        id: page.id,
        src: page.src,
        alt: page.alt,
        hidden: page.hidden,
      })),
    });
    if (saveError) {
      setError(saveError);
      setNotice("");
      return;
    }
    setError("");
    setNotice("Banners guardados en este navegador.");
  }

  function restore() {
    setSlides(slidesFromCms({ ...cms, slides: [], pageBanners: [] }));
    setPages(pagesFromCms({ ...cms, slides: [], pageBanners: [] }));
    saveCms({ slides: [], pageBanners: [] });
    setError("");
    setNotice("Volviste a los banners del código.");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-dark/70">
          Abre una tarjeta para cambiar la imagen del slider de inicio o el
          banner de Nosotros, Contacto, Ofertas y Catálogo. Ofertas también
          puede mostrar un banner de 4 secciones en vez de este — se arma en{" "}
          <Link href="/admin/ofertas" className="font-semibold text-brand-primary hover:underline">
            Ofertas
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={persist}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Save className="h-4 w-4" />
            Guardar banners
          </button>
          <button
            type="button"
            onClick={restore}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar código
          </button>
        </div>
      </div>
      {notice ? (
        <p role="status" className="text-sm font-medium text-brand-primary">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <section>
        <h2 className="font-display text-lg font-bold text-brand-dark">
          Inicio — slider
        </h2>
        <p className="mt-1 text-sm text-brand-dark/65">
          Los tres anuncios de la portada. Ocultar uno lo saca del carrusel.
        </p>
        <ul className="mt-4 grid gap-4 lg:grid-cols-3">
          {slides.map((slide, index) => {
            const key = `home-${slide.id}`;
            const open = openId === key;
            return (
              <li key={slide.id}>
                <BannerCard
                  title={`Banner ${index + 1}`}
                  subtitle="Home"
                  src={slide.src}
                  open={open}
                  onToggle={() => setOpenId(open ? null : key)}
                >
                  <CmsImageField
                    value={slide.src}
                    onChange={(src) =>
                      setSlides((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, src } : item,
                        ),
                      )
                    }
                    previewClassName="h-36 w-full"
                  />
                  <label className="mt-3 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                    Texto alternativo
                    <input
                      className={`${fieldClass} mt-1`}
                      value={slide.alt}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item, i) =>
                            i === index
                              ? { ...item, alt: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className="mt-3 flex items-center gap-2 text-sm text-brand-dark">
                    <input
                      type="checkbox"
                      checked={slide.hidden}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item, i) =>
                            i === index
                              ? { ...item, hidden: event.target.checked }
                              : item,
                          ),
                        )
                      }
                    />
                    Ocultar este banner
                  </label>
                </BannerCard>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-brand-dark">
          Otras páginas
        </h2>
        <p className="mt-1 text-sm text-brand-dark/65">
          Banner ancho de cada sección. Las líneas de categoría se siguen
          editando en Categorías.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {pages.map((page, index) => {
            const key = `page-${page.id}`;
            const open = openId === key;
            return (
              <li key={page.id}>
                <BannerCard
                  title={page.label}
                  subtitle={page.href}
                  src={page.src}
                  open={open}
                  onToggle={() => setOpenId(open ? null : key)}
                >
                  <CmsImageField
                    value={page.src}
                    onChange={(src) =>
                      setPages((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, src } : item,
                        ),
                      )
                    }
                    previewClassName="h-36 w-full"
                  />
                  <label className="mt-3 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                    Texto alternativo
                    <input
                      className={`${fieldClass} mt-1`}
                      value={page.alt}
                      onChange={(event) =>
                        setPages((current) =>
                          current.map((item, i) =>
                            i === index
                              ? { ...item, alt: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className="mt-3 flex items-center gap-2 text-sm text-brand-dark">
                    <input
                      type="checkbox"
                      checked={page.hidden}
                      onChange={(event) =>
                        setPages((current) =>
                          current.map((item, i) =>
                            i === index
                              ? { ...item, hidden: event.target.checked }
                              : item,
                          ),
                        )
                      }
                    />
                    Ocultar banner (queda el título sin foto)
                  </label>
                  <Link
                    href={page.href}
                    className="mt-3 inline-block text-sm font-semibold text-brand-primary hover:underline"
                  >
                    Ver página
                  </Link>
                </BannerCard>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function BannerCard({
  title,
  subtitle,
  src,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  src: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-[0_8px_24px_rgba(11,53,84,0.08)]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
        aria-expanded={open}
      >
        <span className="relative block h-36 overflow-hidden bg-brand-dark">
          {src ? (
            <CmsImage src={src} alt="" fill className="object-cover" />
          ) : null}
          <span className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
            <span>
              <span className="block text-[11px] font-bold tracking-wide text-brand-gold uppercase">
                {subtitle}
              </span>
              <span className="font-display text-lg font-bold text-white">
                {title}
              </span>
            </span>
            <ChevronDown
              className={`h-5 w-5 text-white transition ${open ? "rotate-180" : ""}`}
            />
          </span>
        </span>
      </button>
      {open ? <div className="space-y-3 p-4">{children}</div> : null}
    </article>
  );
}

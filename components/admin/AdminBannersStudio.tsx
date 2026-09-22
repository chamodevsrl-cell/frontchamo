"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import CmsImage from "@/components/CmsImage";
import CmsImageField, { fieldClass } from "@/components/admin/CmsImageField";
import { slides as defaultSlides } from "@/data/media";
import { pageBannerCatalog } from "@/data/page-banners";
import { featuredProducts } from "@/data/products";
import type { CmsOfferBannerTile, CmsPageBannerOverride, CmsState } from "@/lib/cms";

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
  const [offerTiles, setOfferTiles] = useState<CmsOfferBannerTile[]>(cms.offerBanner);
  const [openId, setOpenId] = useState<string | null>("home-1");
  const [notice, setNotice] = useState("");

  function persist() {
    saveCms({
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
      offerBanner: offerTiles,
    });
    setNotice("Banners guardados en este navegador.");
  }

  function restore() {
    setSlides(slidesFromCms({ ...cms, slides: [], pageBanners: [] }));
    setPages(pagesFromCms({ ...cms, slides: [], pageBanners: [] }));
    setOfferTiles([]);
    saveCms({ slides: [], pageBanners: [], offerBanner: [] });
    setNotice("Volviste a los banners del código.");
  }

  function addOfferTile() {
    const firstProduct = featuredProducts[0];
    setOfferTiles((current) => [
      ...current,
      {
        id: `offer_${Date.now()}`,
        image: "",
        alt: "",
        label: "",
        productId: firstProduct?.id ?? "",
        url: "",
      },
    ]);
  }

  function updateOfferTile(id: string, patch: Partial<CmsOfferBannerTile>) {
    setOfferTiles((current) =>
      current.map((tile) => (tile.id === id ? { ...tile, ...patch } : tile)),
    );
  }

  function removeOfferTile(id: string) {
    setOfferTiles((current) => current.filter((tile) => tile.id !== id));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-dark/70">
          Abre una tarjeta para cambiar la imagen del slider de inicio, la
          franja de imágenes de Ofertas o el banner de Nosotros, Contacto,
          Ofertas y Catálogo.
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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-brand-dark">
              Ofertas — franja de imágenes
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-brand-dark/65">
              Reemplaza el banner de Ofertas por una franja de imágenes; cada
              una lleva al producto que elijas al hacer clic. Si no agregas
              ninguna, se sigue mostrando el banner normal de Ofertas.
            </p>
          </div>
          <button
            type="button"
            onClick={addOfferTile}
            disabled={featuredProducts.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/30 px-3 py-1.5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Agregar imagen
          </button>
        </div>

        {offerTiles.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-brand-dark/15 bg-brand-gray/40 px-4 py-6 text-center text-sm text-brand-dark/55">
            Sin imágenes todavía — se ve el banner normal de Ofertas.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offerTiles.map((tile, index) => (
              <li
                key={tile.id}
                className="space-y-3 rounded-2xl border border-brand-dark/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wide text-brand-dark/50 uppercase">
                    Imagen {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOfferTile(tile.id)}
                    className="rounded-lg p-1.5 text-brand-dark/40 hover:bg-red-50 hover:text-red-600"
                    aria-label="Quitar imagen"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                <CmsImageField
                  value={tile.image}
                  onChange={(image) => updateOfferTile(tile.id, { image })}
                  label=""
                  previewClassName="h-32 w-full"
                />
                <label className="block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  Texto sobre la imagen (opcional)
                  <input
                    className={`${fieldClass} mt-1`}
                    value={tile.label}
                    onChange={(event) =>
                      updateOfferTile(tile.id, { label: event.target.value })
                    }
                    placeholder="Si lo dejas vacío, usa el nombre del producto"
                  />
                </label>
                <label className="block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  Producto al que lleva
                  <select
                    className={`${fieldClass} mt-1`}
                    value={tile.productId}
                    disabled={tile.url.trim().length > 0}
                    onChange={(event) =>
                      updateOfferTile(tile.id, { productId: event.target.value })
                    }
                  >
                    {featuredProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} — {product.sku}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  URL personalizada (opcional)
                  <input
                    className={`${fieldClass} mt-1`}
                    value={tile.url}
                    onChange={(event) =>
                      updateOfferTile(tile.id, { url: event.target.value })
                    }
                    placeholder="https://wa.me/51959723602 o /categorias/electricos"
                  />
                  <span className="mt-1 block text-[11px] font-normal normal-case text-brand-dark/45">
                    Si la completas, la imagen lleva a esta URL en vez del
                    producto de arriba.
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
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

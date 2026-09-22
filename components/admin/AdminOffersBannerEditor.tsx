"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import CmsImageField, { fieldClass } from "@/components/admin/CmsImageField";
import { featuredProducts } from "@/data/products";
import type { CmsOfferBannerTile } from "@/lib/cms";

const SECTIONS = 4;

function emptyTile(index: number): CmsOfferBannerTile {
  return {
    id: `offer_${index}_${Date.now()}`,
    image: "",
    alt: "",
    label: "",
    productId: featuredProducts[0]?.id ?? "",
    url: "",
  };
}

function toFourTiles(saved: CmsOfferBannerTile[]): CmsOfferBannerTile[] {
  const tiles = saved.slice(0, SECTIONS).map((tile) => ({ ...tile }));
  while (tiles.length < SECTIONS) {
    tiles.push(emptyTile(tiles.length));
  }
  return tiles;
}

export default function AdminOffersBannerEditor() {
  const { cms, ready } = useSiteContent();

  if (!ready) {
    return <p className="text-sm text-brand-dark/70">Cargando…</p>;
  }

  return <AdminOffersBannerEditorForm initial={cms.offerBanner} />;
}

function AdminOffersBannerEditorForm({
  initial,
}: {
  initial: CmsOfferBannerTile[];
}) {
  const { saveCms } = useSiteContent();
  const [tiles, setTiles] = useState<CmsOfferBannerTile[]>(() => toFourTiles(initial));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const filledCount = tiles.filter((tile) => tile.image.trim()).length;

  function persist() {
    const saveError = saveCms({ offerBanner: tiles });
    if (saveError) {
      setError(saveError);
      setNotice("");
      return;
    }
    setError("");
    setNotice("Banner de Ofertas guardado en este navegador.");
  }

  function updateTile(id: string, patch: Partial<CmsOfferBannerTile>) {
    setTiles((current) =>
      current.map((tile) => (tile.id === id ? { ...tile, ...patch } : tile)),
    );
  }

  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-brand-dark">
            Banner en 4 secciones
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-brand-dark/65">
            Reemplaza el banner de <code>/ofertas</code> por 4 secciones con
            borde, cada una con su propia imagen y su propio producto o URL
            de destino. Necesita las 4 con foto para activarse — con menos,
            se sigue mostrando el banner normal.
            {filledCount < SECTIONS ? (
              <span className="ml-1 font-semibold text-amber-700">
                Vas {filledCount}/{SECTIONS}.
              </span>
            ) : (
              <span className="ml-1 font-semibold text-brand-primary">
                Completo ({SECTIONS}/{SECTIONS}).
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={persist}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Save className="h-4 w-4" />
          Guardar
        </button>
      </div>

      {notice ? (
        <p role="status" className="mt-3 text-sm font-medium text-brand-primary">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile, index) => (
          <li
            key={tile.id}
            className="space-y-3 rounded-2xl border border-brand-dark/10 bg-brand-gray/30 p-4"
          >
            <span className="text-xs font-bold tracking-wide text-brand-dark/50 uppercase">
              Sección {index + 1}
            </span>
            <CmsImageField
              value={tile.image}
              onChange={(image) => updateTile(tile.id, { image })}
              label=""
              previewClassName="h-32 w-full"
            />
            <label className="block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
              Texto sobre la imagen (opcional)
              <input
                className={`${fieldClass} mt-1`}
                value={tile.label}
                onChange={(event) =>
                  updateTile(tile.id, { label: event.target.value })
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
                  updateTile(tile.id, { productId: event.target.value })
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
                  updateTile(tile.id, { url: event.target.value })
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
    </div>
  );
}

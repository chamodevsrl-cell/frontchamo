"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import CmsImageField, { fieldClass } from "@/components/admin/CmsImageField";
import { featuredProducts } from "@/data/products";
import type { CmsOfferBannerTile } from "@/lib/cms";

const MIN_TILES = 3;
const MAX_TILES = 4;

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
  const [tiles, setTiles] = useState<CmsOfferBannerTile[]>(initial);
  const [notice, setNotice] = useState("");

  function persist() {
    saveCms({ offerBanner: tiles });
    setNotice("Franja de Ofertas guardada en este navegador.");
  }

  function addTile() {
    const firstProduct = featuredProducts[0];
    setTiles((current) => [
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

  function updateTile(id: string, patch: Partial<CmsOfferBannerTile>) {
    setTiles((current) =>
      current.map((tile) => (tile.id === id ? { ...tile, ...patch } : tile)),
    );
  }

  function removeTile(id: string) {
    setTiles((current) => current.filter((tile) => tile.id !== id));
  }

  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-brand-dark">
            Franja de imágenes
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-brand-dark/65">
            Reemplaza el banner de <code>/ofertas</code> por una franja de
            imágenes; cada una lleva al producto que elijas o a una URL
            propia al hacer clic. Necesita entre {MIN_TILES} y {MAX_TILES}{" "}
            imágenes completas (con foto y producto o URL) para reemplazar
            el banner normal — con menos, se sigue mostrando el de siempre.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addTile}
            disabled={featuredProducts.length === 0 || tiles.length >= MAX_TILES}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/30 px-3 py-1.5 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Agregar imagen
          </button>
          <button
            type="button"
            onClick={persist}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </div>
      </div>

      {notice ? (
        <p role="status" className="mt-3 text-sm font-medium text-brand-primary">
          {notice}
        </p>
      ) : null}

      {tiles.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-brand-dark/15 bg-brand-gray/40 px-4 py-6 text-center text-sm text-brand-dark/55">
          Sin imágenes todavía — se ve el banner normal de Ofertas.
        </p>
      ) : (
        <>
          {tiles.length < MIN_TILES ? (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Te falta{tiles.length === MIN_TILES - 1 ? "" : "n"}{" "}
              {MIN_TILES - tiles.length} imagen{MIN_TILES - tiles.length === 1 ? "" : "es"} más
              — con menos de {MIN_TILES} se sigue viendo el banner normal en
              la tienda.
            </p>
          ) : null}
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((tile, index) => (
              <li
                key={tile.id}
                className="space-y-3 rounded-2xl border border-brand-dark/10 bg-brand-gray/30 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wide text-brand-dark/50 uppercase">
                    Imagen {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTile(tile.id)}
                    className="rounded-lg p-1.5 text-brand-dark/40 hover:bg-red-50 hover:text-red-600"
                    aria-label="Quitar imagen"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
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
        </>
      )}
    </div>
  );
}

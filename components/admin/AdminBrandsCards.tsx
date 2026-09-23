"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import CmsImageField, { fieldClass } from "@/components/admin/CmsImageField";
import { defaultBrands, type CmsBrand } from "@/lib/cms";
import { MAX_LOGO_IMAGE_HINT } from "@/lib/cms-image";

export default function AdminBrandsCards() {
  const { cms, ready } = useSiteContent();

  if (!ready) {
    return <p className="text-sm text-brand-dark/70">Cargando marcas…</p>;
  }

  return <AdminBrandsCardsForm initial={cms.brands} />;
}

function AdminBrandsCardsForm({ initial }: { initial: CmsBrand[] }) {
  const { saveCms } = useSiteContent();
  const [brands, setBrands] = useState<CmsBrand[]>(() =>
    initial.map((brand) => ({ ...brand })),
  );
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function persist() {
    const unnamed = brands.find((brand) => !brand.name.trim());
    if (unnamed) {
      setError("Cada marca necesita un nombre (se usa si el logo no carga).");
      setNotice("");
      return;
    }
    const clean = brands.map((brand) => ({ ...brand, name: brand.name.trim() }));
    const saveError = saveCms({ brands: clean });
    if (saveError) {
      setError(saveError);
      setNotice("");
      return;
    }
    setBrands(clean);
    setError("");
    setNotice("Marcas guardadas. Ya se ven en el carrusel del inicio y de Ofertas.");
  }

  function restore() {
    const next = defaultBrands();
    setBrands(next);
    saveCms({ brands: next });
    setError("");
    setNotice("Volviste a las marcas de fábrica.");
  }

  function add() {
    setBrands((current) => [
      { id: `br_${Date.now()}`, name: "", src: "" },
      ...current,
    ]);
    setNotice("");
  }

  function update(id: string, patch: Partial<CmsBrand>) {
    setBrands((current) =>
      current.map((brand) => (brand.id === id ? { ...brand, ...patch } : brand)),
    );
  }

  function move(index: number, delta: -1 | 1) {
    setBrands((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const visibleCount = brands.filter((brand) => !brand.hidden).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-dark/70">
          Logos del carrusel <strong>Marcas distribuidoras</strong> (inicio y
          Ofertas). Sube el logo, ponle nombre y guarda. El orden de las cartas es
          el orden del carrusel. {MAX_LOGO_IMAGE_HINT}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            Nueva marca
          </button>
          <button
            type="button"
            onClick={persist}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-white px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10"
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
          <button
            type="button"
            onClick={restore}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar
          </button>
        </div>
      </div>

      <p className="text-xs font-semibold tracking-wide text-brand-dark/50 uppercase">
        {brands.length} marca{brands.length === 1 ? "" : "s"} · {visibleCount} visible
        {visibleCount === 1 ? "" : "s"} en la web
      </p>

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

      {brands.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-primary/40 bg-white px-4 py-10 text-center text-sm text-brand-dark/60">
          No hay marcas. Con la lista vacía el carrusel no se muestra. Usa{" "}
          <strong>Nueva marca</strong> o <strong>Restaurar</strong>.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {brands.map((brand, index) => (
            <li
              key={brand.id}
              className={`rounded-2xl border bg-white p-4 shadow-[0_8px_24px_rgba(11,53,84,0.08)] ${
                brand.hidden ? "border-brand-dark/10 opacity-60" : "border-brand-primary/25"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-brand-primary">
                  #{index + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg border border-brand-dark/12 p-1.5 text-brand-dark/60 hover:border-brand-primary hover:text-brand-primary disabled:opacity-30"
                    aria-label={`Subir ${brand.name || "marca"}`}
                    title="Mover antes"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === brands.length - 1}
                    className="rounded-lg border border-brand-dark/12 p-1.5 text-brand-dark/60 hover:border-brand-primary hover:text-brand-primary disabled:opacity-30"
                    aria-label={`Bajar ${brand.name || "marca"}`}
                    title="Mover después"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <CmsImageField
                value={brand.src}
                onChange={(src) => update(brand.id, { src })}
                label="Logo"
                previewClassName="h-28 w-full"
                objectFit="contain"
              />

              <label className="mt-3 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                Nombre de la marca
                <input
                  className={`${fieldClass} mt-1`}
                  value={brand.name}
                  onChange={(event) => update(brand.id, { name: event.target.value })}
                  placeholder="Ej. BOSCH"
                />
              </label>

              <div className="mt-3 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm text-brand-dark">
                  <input
                    type="checkbox"
                    checked={Boolean(brand.hidden)}
                    onChange={(event) =>
                      update(brand.id, { hidden: event.target.checked })
                    }
                  />
                  Ocultar en la web
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setBrands((current) => current.filter((item) => item.id !== brand.id))
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

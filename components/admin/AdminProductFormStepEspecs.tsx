"use client";

import { Plus, Trash2 } from "lucide-react";
import type { PackagingLine } from "@/types/admin";

/** Unidades sugeridas; el campo de al lado sigue siendo texto libre para crear una nueva. */
const PACKAGING_PRESETS = ["Unidad", "Docena", "Caja"];

type SpecRow = { label: string; value: string };

export default function AdminProductFormStepEspecs({
  specs,
  onAddSpec,
  onUpdateSpec,
  onRemoveSpec,
  packaging,
  customUnit,
  setCustomUnit,
  onAddPackagingUnit,
  onUpdatePackagingContent,
  onRemovePackaging,
}: {
  specs: SpecRow[];
  onAddSpec: () => void;
  onUpdateSpec: (index: number, field: "label" | "value", value: string) => void;
  onRemoveSpec: (index: number) => void;
  packaging: PackagingLine[];
  customUnit: string;
  setCustomUnit: (value: string) => void;
  onAddPackagingUnit: (unit: string) => void;
  onUpdatePackagingContent: (index: number, content: string) => void;
  onRemovePackaging: (index: number) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-dark">
        Fase 4 — Ficha técnica (Especs)
      </h2>
      <p className="text-sm text-brand-dark/60">
        Pares atributo / valor para la tabla de ficha técnica del modal de
        producto. Opcional.
      </p>
      <div className="space-y-2">
        {specs.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={row.label}
              onChange={(event) => onUpdateSpec(index, "label", event.target.value)}
              placeholder="Atributo (p. ej. Material)"
              className="w-1/3 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm"
            />
            <input
              value={row.value}
              onChange={(event) => onUpdateSpec(index, "value", event.target.value)}
              placeholder="Valor"
              className="flex-1 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => onRemoveSpec(index)}
              className="rounded-lg p-2 text-brand-dark/40 hover:bg-red-50 hover:text-red-600"
              aria-label="Quitar fila"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddSpec}
        className="flex items-center gap-1.5 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-gray"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Agregar especificación
      </button>

      <div className="border-t border-brand-dark/10 pt-4">
        <h3 className="font-display text-base font-bold text-brand-dark">
          Presentaciones de venta
        </h3>
        <p className="text-sm text-brand-dark/60">
          ¿Sale por unidad, docena, caja…? Agrega una presentación y describe
          qué trae. También puedes crear una unidad propia (p. ej.
          &ldquo;Rollo&rdquo;, &ldquo;Par&rdquo;, &ldquo;Galón&rdquo;).
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {PACKAGING_PRESETS.map((preset) => {
            const already = packaging.some(
              (row) => row.unit.toLowerCase() === preset.toLowerCase(),
            );
            return (
              <button
                key={preset}
                type="button"
                disabled={already}
                onClick={() => onAddPackagingUnit(preset)}
                className="rounded-full border border-brand-primary/30 px-3 py-1 text-xs font-semibold text-brand-primary hover:bg-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                + {preset}
              </button>
            );
          })}
          <span className="flex items-center gap-1.5">
            <input
              value={customUnit}
              onChange={(event) => setCustomUnit(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onAddPackagingUnit(customUnit);
                }
              }}
              placeholder="Otra unidad (Rollo, Par…)"
              className="rounded-full border border-brand-dark/15 px-3 py-1 text-xs"
            />
            <button
              type="button"
              onClick={() => onAddPackagingUnit(customUnit)}
              className="rounded-full border border-brand-dark/15 px-2.5 py-1 text-xs font-semibold text-brand-dark hover:bg-brand-gray"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </span>
        </div>

        {packaging.length > 0 ? (
          <div className="mt-3 space-y-2">
            {packaging.map((row, index) => (
              <div key={row.unit} className="flex items-center gap-2">
                <span className="w-24 shrink-0 rounded-lg bg-brand-dark/5 px-2 py-2 text-center text-xs font-bold tracking-wide text-brand-dark uppercase">
                  {row.unit}
                </span>
                <input
                  value={row.content}
                  onChange={(event) => onUpdatePackagingContent(index, event.target.value)}
                  placeholder="Qué trae (p. ej. 12 unidades por caja)"
                  className="flex-1 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => onRemovePackaging(index)}
                  className="rounded-lg p-2 text-brand-dark/40 hover:bg-red-50 hover:text-red-600"
                  aria-label="Quitar presentación"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-brand-dark/40">
            Sin presentaciones todavía — opcional.
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Ruler, Trash2 } from "lucide-react";
import { createUnitAction, deleteUnitAction } from "@/app/admin/actions";
import type { MeasurementUnit } from "@/types/admin";

export default function AdminUnitsView({ units }: { units: MeasurementUnit[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreating(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await createUnitAction({
        name: String(form.get("name") ?? ""),
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      (event.target as HTMLFormElement).reset();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear la unidad.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(unitId: string) {
    setError("");
    setDeletingId(unitId);
    try {
      const result = await deleteUnitAction(unitId);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setConfirmingId(null);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo borrar la unidad.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-dark/65">
        Unidades disponibles para las &quot;Presentaciones de venta&quot; del
        alta/edición de producto (Fase 4). Mock <code>getUnits()</code> /{" "}
        <code>createUnit()</code>. Unidad, Docena y Caja vienen por defecto y no
        se pueden borrar.
      </p>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {units.map((unit) => (
          <li
            key={unit.id}
            className="flex items-center justify-between gap-2 rounded-xl border border-brand-dark/10 bg-white px-4 py-3 shadow-sm"
          >
            <span className="flex items-center gap-2 min-w-0">
              <Ruler className="h-4 w-4 shrink-0 text-brand-primary" strokeWidth={2} />
              <span className="truncate text-sm font-semibold text-brand-dark">
                {unit.name}
              </span>
              {unit.isSystem ? (
                <span className="shrink-0 rounded-full bg-brand-gray px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-dark/60 uppercase">
                  Base
                </span>
              ) : null}
            </span>
            {!unit.isSystem ? (
              confirmingId === unit.id ? (
                <span className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    disabled={deletingId === unit.id}
                    onClick={() => void handleDelete(unit.id)}
                    className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {deletingId === unit.id ? "…" : "Sí, borrar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    className="rounded-lg border border-brand-dark/15 px-2 py-1 text-xs font-semibold text-brand-dark hover:border-brand-primary"
                  >
                    Cancelar
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingId(unit.id)}
                  className="shrink-0 rounded-lg p-1.5 text-brand-dark/40 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Borrar unidad ${unit.name}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              )
            ) : null}
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleCreate}
        className="max-w-md space-y-4 rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="font-display text-lg font-bold text-brand-dark">
            Nueva unidad
          </h2>
          <p className="mt-1 text-sm text-brand-dark/65">
            Por ejemplo &ldquo;Rollo&rdquo;, &ldquo;Galón&rdquo;, &ldquo;Par&rdquo;,
            &ldquo;Kilogramo&rdquo;. Queda disponible al toque en el alta de producto.
          </p>
        </div>

        <label className="block text-sm font-semibold">
          Nombre
          <input
            name="name"
            required
            placeholder="Ej. Rollo"
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>

        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6aad] disabled:opacity-60"
        >
          {creating ? "Guardando…" : "Agregar unidad"}
        </button>
      </form>
    </div>
  );
}

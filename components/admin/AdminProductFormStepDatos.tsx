"use client";

import type { Category } from "@/types/admin";

export default function AdminProductFormStepDatos({
  categoryOptions,
  name,
  setName,
  sku,
  setSku,
  brand,
  setBrand,
  categoryId,
  setCategoryId,
  descriptionShort,
  setDescriptionShort,
}: {
  categoryOptions: Category[];
  name: string;
  setName: (value: string) => void;
  sku: string;
  setSku: (value: string) => void;
  brand: string;
  setBrand: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  descriptionShort: string;
  setDescriptionShort: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-dark">
        Fase 1 — Datos principales
      </h2>
      <label className="block text-sm font-semibold">
        Nombre
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ej. Taladro percutor 1/2&quot; 750W"
          className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          SKU
          <input
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Marca
          <input
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Categoría
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
        >
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Descripción corta
        <textarea
          value={descriptionShort}
          onChange={(event) => setDescriptionShort(event.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
        />
      </label>
    </div>
  );
}

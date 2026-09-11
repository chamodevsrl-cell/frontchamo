"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProductAction } from "@/app/admin/actions";
import { mainCategories } from "@/data/home";
import type { CreateProductInput, ProductStatus } from "@/types/admin";

const STATUSES: ProductStatus[] = ["active", "draft", "archived"];

export default function AdminNewProductForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const categoryId = String(form.get("categoryId") ?? "");
    const payload: CreateProductInput = {
      sku: String(form.get("sku") ?? ""),
      name: String(form.get("name") ?? ""),
      brand: String(form.get("brand") ?? ""),
      categoryId,
      subcategoryId: `${categoryId}-general`,
      price: Number(form.get("price") ?? 0),
      stock: Number(form.get("stock") ?? 0),
      minStock: Number(form.get("minStock") ?? 10),
      status: (String(form.get("status") ?? "active") as ProductStatus),
      images: String(form.get("image") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      descriptionShort: String(form.get("descriptionShort") ?? ""),
      descriptionFull: String(form.get("descriptionFull") ?? ""),
      isFeatured: form.get("isFeatured") === "on",
    };
    try {
      const result = await createProductAction(payload);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace("/admin/productos");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear el producto.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-4 rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm"
    >
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-dark">Crear producto</h1>
        <p className="mt-1 text-sm text-brand-dark/65">
          Llama a <code>createProduct()</code> (mock). El backend asignará <code>id</code> y{" "}
          <code>createdAt</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          SKU
          <input
            name="sku"
            required
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Marca
          <input
            name="brand"
            required
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold">
        Nombre
        <input
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Categoría
          <select
            name="categoryId"
            required
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            defaultValue={mainCategories[0]?.slug}
          >
            {mainCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Estado
          <select
            name="status"
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            defaultValue="active"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold">
          Precio (S/)
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            required
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Stock
          <input
            name="stock"
            type="number"
            min={0}
            required
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Stock mínimo
          <input
            name="minStock"
            type="number"
            min={0}
            defaultValue={10}
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold">
        Imágenes (URLs separadas por coma)
        <input
          name="image"
          placeholder="https://…"
          className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
        />
      </label>

      <label className="block text-sm font-semibold">
        Descripción corta
        <textarea
          name="descriptionShort"
          rows={2}
          className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
        />
      </label>
      <label className="block text-sm font-semibold">
        Descripción completa
        <textarea
          name="descriptionFull"
          rows={4}
          className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="isFeatured" className="rounded border-brand-dark/20" />
        Destacado
      </label>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6aad] disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar producto"}
      </button>
    </form>
  );
}

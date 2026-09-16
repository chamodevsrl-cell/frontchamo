"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Image as ImageIcon,
  Link2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import { useSiteContent } from "@/components/ContentProvider";
import { readCmsImageFile } from "@/lib/cms-image";
import type { Category, CreateProductInput, Product, ProductStatus } from "@/types/admin";

const STATUSES: ProductStatus[] = ["active", "draft", "archived"];

const STEPS = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Detalle" },
  { id: 3, label: "Precios" },
  { id: 4, label: "Especs" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

type SpecRow = { label: string; value: string };

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminNewProductForm({
  categories,
  product,
}: {
  /** Viene de `getCategories()` (mock) — no importar `mainCategories` directo aquí. */
  categories: Category[];
  /** Si viene, el wizard actualiza el SKU en vez de crearlo. */
  product?: Product;
}) {
  const isEdit = Boolean(product);
  const router = useRouter();
  const { categories: siteCategories } = useSiteContent();
  const categoryOptions = useMemo(() => {
    const byId = new Map(categories.map((item) => [item.id, item]));
    for (const item of siteCategories) {
      const current = byId.get(item.slug);
      byId.set(item.slug, {
        id: item.slug,
        name: item.label,
        subcategoriesCount: current?.subcategoriesCount ?? 0,
        status: current?.status ?? "active",
        image: item.image,
        description: item.eyebrow,
      });
    }
    return [...byId.values()];
  }, [categories, siteCategories]);
  const [step, setStep] = useState<StepId>(1);
  const [stepError, setStepError] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // Fase 1 — Datos
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [descriptionShort, setDescriptionShort] = useState(product?.descriptionShort ?? "");

  // Fase 2 — Detalle
  const [descriptionFull, setDescriptionFull] = useState(product?.descriptionFull ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

  // Fase 3 — Precios
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [minStock, setMinStock] = useState(product ? String(product.minStock) : "10");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "active");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);

  // Fase 4 — Especs
  const [specs, setSpecs] = useState<SpecRow[]>(product?.specs ?? []);

  async function handleFiles(fileList: FileList) {
    setImageError("");
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) {
      setImageError("Elige archivos de imagen (JPG, PNG, WEBP…).");
      return;
    }
    try {
      const dataUrls = await Promise.all(files.map(readCmsImageFile));
      setImages((prev) => [...prev, ...dataUrls]);
    } catch (cause) {
      setImageError(
        cause instanceof Error ? cause.message : "No se pudo leer una de las imágenes.",
      );
    }
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url) {
      setImageError("Pega una URL o ruta de imagen.");
      return;
    }
    setImageError("");
    setImages((prev) => [...prev, url]);
    setImageUrl("");
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addSpec() {
    setSpecs((prev) => [...prev, { label: "", value: "" }]);
  }

  function updateSpec(index: number, field: "label" | "value", value: string) {
    setSpecs((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  function goNext() {
    if (step === 1 && (!name.trim() || !sku.trim() || !brand.trim())) {
      setStepError("Completa nombre, SKU y marca antes de continuar.");
      return;
    }
    setStepError("");
    setStep((current) => (current < 4 ? ((current + 1) as StepId) : current));
  }

  function goBack() {
    setStepError("");
    setStep((current) => (current > 1 ? ((current - 1) as StepId) : current));
  }

  async function handleSubmit() {
    if (!name.trim() || !sku.trim() || !brand.trim()) {
      setStep(1);
      setStepError("Completa nombre, SKU y marca antes de continuar.");
      return;
    }
    setError("");
    setPending(true);
    const payload: CreateProductInput = {
      sku: sku.trim(),
      name: name.trim(),
      brand: brand.trim(),
      categoryId,
      subcategoryId: `${categoryId}-general`,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 10,
      status,
      images,
      descriptionShort: descriptionShort.trim(),
      descriptionFull: descriptionFull.trim(),
      isFeatured,
      specs: specs.filter((row) => row.label.trim() && row.value.trim()),
    };
    try {
      const result = product
        ? await updateProductAction(product.id, payload)
        : await createProductAction(payload);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace("/admin/productos");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : product
            ? "No se pudo actualizar el producto."
            : "No se pudo crear el producto.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/admin/productos"
          className="text-xs font-semibold text-brand-dark/50 hover:text-brand-primary"
        >
          ← Volver a productos
        </Link>
        <p className="mt-2 text-sm text-brand-dark/65">
          Wizard de 4 fases. Llama a{" "}
          <code>{isEdit ? "updateProduct()" : "createProduct()"}</code> (mock) recién al
          terminar la fase 4 — nada se guarda antes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStep(item.id)}
            className={`rounded-lg border px-3 py-2 text-center text-[11px] font-semibold tracking-wide uppercase ${
              step === item.id
                ? "border-brand-primary bg-brand-primary text-white"
                : "border-brand-dark/10 bg-white text-brand-dark/55 hover:border-brand-primary/40"
            }`}
          >
            Fase {item.id}
            <span className="mt-0.5 block text-[13px] normal-case">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4 rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm">
          {stepError ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert">
              {stepError}
            </p>
          ) : null}

          {step === 1 ? (
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
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-brand-dark">
                Fase 2 — Detalle e imágenes
              </h2>
              <label className="block text-sm font-semibold">
                Descripción completa
                <textarea
                  value={descriptionFull}
                  onChange={(event) => setDescriptionFull(event.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
                />
              </label>

              <div>
                <p className="text-sm font-semibold">Fotos del producto</p>
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (event.dataTransfer.files.length > 0) {
                      void handleFiles(event.dataTransfer.files);
                    }
                  }}
                  className="mt-1 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-brand-dark/20 bg-brand-gray/50 px-4 py-6 text-center"
                >
                  <ImageIcon className="h-8 w-8 text-brand-dark/30" strokeWidth={1.5} />
                  <p className="text-sm text-brand-dark/60">
                    Arrastra imágenes aquí o
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#0e6aad]">
                    <FolderOpen className="h-4 w-4" />
                    Galería o carpetas
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        if (event.target.files && event.target.files.length > 0) {
                          void handleFiles(event.target.files);
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                  <p className="text-xs text-brand-dark/40">
                    En móvil abre la galería/cámara del equipo. También puedes pegar una
                    URL. La primera imagen es la principal.
                  </p>
                </div>
                <label className="mt-3 block text-sm font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Link2 className="h-3.5 w-3.5" />
                    O pega una URL / ruta
                  </span>
                  <span className="mt-1 flex gap-2">
                    <input
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addImageUrl();
                        }
                      }}
                      placeholder="https://… o /images/…"
                      className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="shrink-0 rounded-lg border border-brand-primary/30 px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10"
                    >
                      Añadir
                    </button>
                  </span>
                </label>
                {imageError ? (
                  <p className="mt-2 text-sm text-red-700">{imageError}</p>
                ) : null}

                {images.length > 0 ? (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((src, index) => (
                      <div
                        key={`${index}-${src.slice(-12)}`}
                        className="group relative overflow-hidden rounded-lg border border-brand-dark/10"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`Imagen ${index + 1}`} className="h-24 w-full object-cover" />
                        {index === 0 ? (
                          <span className="absolute top-1 left-1 rounded bg-brand-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            Principal
                          </span>
                        ) : null}
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 px-1 py-0.5 opacity-0 transition group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => moveImage(index, -1)}
                            disabled={index === 0}
                            className="rounded p-1 text-white disabled:opacity-30"
                            aria-label="Mover a la izquierda"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="rounded p-1 text-white hover:text-red-300"
                            aria-label="Quitar imagen"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 1)}
                            disabled={index === images.length - 1}
                            className="rounded p-1 text-white disabled:opacity-30"
                            aria-label="Mover a la derecha"
                          >
                            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-brand-dark">
                Fase 3 — Precios y stock
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-semibold">
                  Precio (S/)
                  <input
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    type="number"
                    min={0}
                    step="0.01"
                    className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Stock
                  <input
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Stock mínimo
                  <input
                    value={minStock}
                    onChange={(event) => setMinStock(event.target.value)}
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  Estado
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as ProductStatus)}
                    className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
                  >
                    {STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="mt-6 flex items-center gap-2 text-sm font-semibold sm:mt-0 sm:self-end">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(event) => setIsFeatured(event.target.checked)}
                    className="rounded border-brand-dark/20"
                  />
                  Destacado
                </label>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
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
                      onChange={(event) => updateSpec(index, "label", event.target.value)}
                      placeholder="Atributo (p. ej. Material)"
                      className="w-1/3 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm"
                    />
                    <input
                      value={row.value}
                      onChange={(event) => updateSpec(index, "value", event.target.value)}
                      placeholder="Valor"
                      className="flex-1 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
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
                onClick={addSpec}
                className="flex items-center gap-1.5 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-gray"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Agregar especificación
              </button>
            </div>
          ) : null}

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-between border-t border-brand-dark/10 pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1 rounded-lg border border-brand-dark/15 px-4 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-gray"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                Atrás
              </button>
            ) : (
              <Link
                href="/admin/productos"
                className="text-sm font-semibold text-brand-dark/55 hover:text-brand-primary"
              >
                Cancelar
              </Link>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6aad]"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={() => void handleSubmit()}
                className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6aad] disabled:opacity-60"
              >
                {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear producto"}
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-brand-dark/10 bg-white p-4 shadow-sm lg:sticky lg:top-4">
          <p className="text-xs font-semibold tracking-wide text-brand-dark/50 uppercase">
            Vista previa en la tienda
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-brand-dark/10">
            <div className="flex aspect-square items-center justify-center bg-brand-gray">
              {images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[0]}
                  alt={name || "Producto"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-10 w-10 text-brand-dark/25" strokeWidth={1.5} />
              )}
            </div>
            <div className="space-y-1 p-3">
              {isFeatured ? (
                <span className="inline-block rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-bold text-brand-gold uppercase">
                  Destacado
                </span>
              ) : null}
              <p className="text-[11px] font-semibold text-brand-dark/50 uppercase">
                {brand || "Sin marca"}
              </p>
              <p className="font-display text-sm font-bold text-brand-dark">
                {name || "Nombre del producto"}
              </p>
              <p className="text-xs text-brand-dark/40">SKU: {sku || "—"}</p>
              <p className="font-display text-lg font-bold text-brand-primary">
                {Number(price) > 0 ? soles(Number(price)) : "Consultar"}
              </p>
              <button
                type="button"
                disabled
                className="mt-1 w-full rounded-lg bg-brand-primary py-2 text-xs font-semibold text-white opacity-90"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

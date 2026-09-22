"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import { useSiteContent } from "@/components/ContentProvider";
import { MAX_PRODUCT_IMAGE_BYTES, readCmsImageFile } from "@/lib/cms-image";
import type {
  Category,
  CreateProductInput,
  PackagingLine,
  Product,
  ProductStatus,
} from "@/types/admin";
import AdminProductFormStepDatos from "./AdminProductFormStepDatos";
import AdminProductFormStepDetalle from "./AdminProductFormStepDetalle";
import AdminProductFormStepPrecios from "./AdminProductFormStepPrecios";
import AdminProductFormStepEspecs from "./AdminProductFormStepEspecs";
import AdminProductPreviewCard from "./AdminProductPreviewCard";

const STEPS = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Detalle" },
  { id: 3, label: "Precios" },
  { id: 4, label: "Especs" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

type SpecRow = { label: string; value: string };

export default function AdminNewProductForm({
  categories,
  product,
}: {
  /** Viene de `getCategories()` (mock) — no importar `mainCategories` directo aquí. */
  categories: Category[];
  /** Si viene, el formulario edita este producto en vez de crear uno nuevo. */
  product?: Product;
}) {
  const isEditing = Boolean(product);
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
  const [isOnOffer, setIsOnOffer] = useState(product?.isOnOffer ?? false);
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ? String(product.oldPrice) : "");

  // Fase 4 — Especs + presentaciones de venta
  const [specs, setSpecs] = useState<SpecRow[]>(product?.specs ?? []);
  const [packaging, setPackaging] = useState<PackagingLine[]>(product?.packaging ?? []);
  const [customUnit, setCustomUnit] = useState("");

  async function handleFiles(fileList: FileList) {
    setImageError("");
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) {
      setImageError("Elige archivos de imagen (JPG, PNG, WEBP…).");
      return;
    }
    try {
      const dataUrls = await Promise.all(
        files.map((file) => readCmsImageFile(file, MAX_PRODUCT_IMAGE_BYTES)),
      );
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

  function addPackagingUnit(unit: string) {
    const trimmed = unit.trim();
    if (!trimmed) return;
    if (packaging.some((row) => row.unit.toLowerCase() === trimmed.toLowerCase())) return;
    setPackaging((prev) => [...prev, { unit: trimmed, content: "" }]);
    setCustomUnit("");
  }

  function updatePackagingContent(index: number, content: string) {
    setPackaging((prev) =>
      prev.map((row, i) => (i === index ? { ...row, content } : row)),
    );
  }

  function removePackaging(index: number) {
    setPackaging((prev) => prev.filter((_, i) => i !== index));
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
      isOnOffer,
      oldPrice: isOnOffer && Number(oldPrice) > 0 ? Number(oldPrice) : null,
      packaging: packaging.filter((row) => row.unit.trim() && row.content.trim()),
      specs: specs.filter((row) => row.label.trim() && row.value.trim()),
    };
    try {
      const result = isEditing
        ? await updateProductAction(product!.id, payload)
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
          : `No se pudo ${isEditing ? "guardar" : "crear"} el producto.`,
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
          <code>{isEditing ? "updateProduct()" : "createProduct()"}</code> (mock)
          recién al terminar la fase 4 — nada se guarda antes.
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
            <AdminProductFormStepDatos
              categoryOptions={categoryOptions}
              name={name}
              setName={setName}
              sku={sku}
              setSku={setSku}
              brand={brand}
              setBrand={setBrand}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              descriptionShort={descriptionShort}
              setDescriptionShort={setDescriptionShort}
            />
          ) : null}

          {step === 2 ? (
            <AdminProductFormStepDetalle
              descriptionFull={descriptionFull}
              setDescriptionFull={setDescriptionFull}
              images={images}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              imageError={imageError}
              onFiles={(files) => void handleFiles(files)}
              onAddImageUrl={addImageUrl}
              onRemoveImage={removeImage}
              onMoveImage={moveImage}
            />
          ) : null}

          {step === 3 ? (
            <AdminProductFormStepPrecios
              price={price}
              setPrice={setPrice}
              stock={stock}
              setStock={setStock}
              minStock={minStock}
              setMinStock={setMinStock}
              status={status}
              setStatus={setStatus}
              isFeatured={isFeatured}
              setIsFeatured={setIsFeatured}
              isOnOffer={isOnOffer}
              setIsOnOffer={setIsOnOffer}
              oldPrice={oldPrice}
              setOldPrice={setOldPrice}
            />
          ) : null}

          {step === 4 ? (
            <AdminProductFormStepEspecs
              specs={specs}
              onAddSpec={addSpec}
              onUpdateSpec={updateSpec}
              onRemoveSpec={removeSpec}
              packaging={packaging}
              customUnit={customUnit}
              setCustomUnit={setCustomUnit}
              onAddPackagingUnit={addPackagingUnit}
              onUpdatePackagingContent={updatePackagingContent}
              onRemovePackaging={removePackaging}
            />
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
                {pending
                  ? "Guardando…"
                  : isEditing
                    ? "Guardar cambios"
                    : "Crear producto"}
              </button>
            )}
          </div>
        </div>

        <AdminProductPreviewCard
          image={images[0]}
          name={name}
          brand={brand}
          sku={sku}
          price={Number(price) || 0}
          oldPrice={Number(oldPrice) || 0}
          isFeatured={isFeatured}
          isOnOffer={isOnOffer}
        />
      </div>
    </div>
  );
}

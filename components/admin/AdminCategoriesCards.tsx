"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, X } from "lucide-react";
import { createCategoryAction, updateCategoryAction } from "@/app/admin/actions";
import { useSiteContent } from "@/components/ContentProvider";
import CmsImage from "@/components/CmsImage";
import CmsImageField, { fieldClass } from "@/components/admin/CmsImageField";
import { mainCategories } from "@/data/home";
import { uniqueCategorySlug, type CmsCategoryOverride, type CmsCustomCategory, type CmsState } from "@/lib/cms";
import type { Product } from "@/types/admin";

const DEFAULT_IMAGE = "/images/categorias/herramientas.jpg";
const DEFAULT_SLUGS = new Set(mainCategories.map((item) => item.slug));

type Draft = {
  slug: string | null;
  name: string;
  description: string;
  image: string;
};

export default function AdminCategoriesCards({
  products,
}: {
  products: Product[];
}) {
  const { cms, categories, ready, saveCms } = useSiteContent();

  if (!ready) {
    return <p className="text-sm text-brand-dark/70">Cargando categorías…</p>;
  }

  return (
    <AdminCategoriesCardsForm
      products={products}
      cmsCategories={cms.categories}
      customCategories={cms.customCategories}
      categories={categories}
      saveCms={saveCms}
    />
  );
}

function AdminCategoriesCardsForm({
  products,
  cmsCategories,
  customCategories,
  categories,
  saveCms,
}: {
  products: Product[];
  cmsCategories: CmsCategoryOverride[];
  customCategories: CmsCustomCategory[];
  categories: { slug: string; label: string; eyebrow: string; image: string }[];
  saveCms: (patch: Partial<CmsState>) => void;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function openFromHash() {
      if (window.location.hash === "#nueva-categoria") {
        setDraft({ slug: null, name: "", description: "", image: "" });
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  function productCount(slug: string) {
    return products.filter((item) => item.categoryId === slug).length;
  }

  function closeModal() {
    setDraft(null);
    setError("");
    if (typeof window !== "undefined" && window.location.hash === "#nueva-categoria") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function openAdd() {
    setError("");
    setDraft({ slug: null, name: "", description: "", image: "" });
  }

  async function persist() {
    if (!draft) return;
    const name = draft.name.trim();
    if (!name) {
      setError("El nombre es obligatorio.");
      return;
    }
    const description = draft.description.trim() || name;
    const image = draft.image.trim() || DEFAULT_IMAGE;
    setSaving(true);
    setError("");

    const isNew = draft.slug === null;
    const slug: string =
      draft.slug ??
      uniqueCategorySlug(
        name,
        categories.map((item) => item.slug),
      );

    if (DEFAULT_SLUGS.has(slug)) {
      const previous = cmsCategories.find((item) => item.slug === slug);
      saveCms({
        categories: [
          ...cmsCategories.filter((item) => item.slug !== slug),
          {
            slug,
            label: name,
            eyebrow: description,
            image,
            imageAlt: name,
            bannerTitle: name.toLocaleUpperCase("es"),
            bullets: previous?.bullets,
          },
        ],
      });
    } else {
      const previous = customCategories.find((item) => item.slug === slug);
      saveCms({
        customCategories: [
          ...customCategories.filter((item) => item.slug !== slug),
          {
            slug,
            label: name,
            eyebrow: description,
            image,
            imageAlt: name,
            bannerTitle: name.toLocaleUpperCase("es"),
            bullets: previous?.bullets,
            tint: previous?.tint,
          },
        ],
      });
    }

    const result = isNew
      ? await createCategoryAction({ id: slug, name, description, image })
      : await updateCategoryAction(slug, { name, description, image });

    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setNotice(isNew ? `Categoría “${name}” creada.` : `Categoría “${name}” actualizada.`);
    closeModal();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-dark/70">
          Cada tarjeta es una línea del catálogo. El recuento sale de los SKUs del
          mock asignados a esa categoría. Editar abre un modal; la imagen se pega
          por URL o se elige desde galería o carpetas.
        </p>
        <button
          type="button"
          id="nueva-categoria"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Agregar categoría
        </button>
      </div>
      {notice ? (
        <p role="status" className="text-sm font-medium text-brand-primary">
          {notice}
        </p>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const count = productCount(category.slug);
          return (
            <li
              key={category.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-[0_8px_24px_rgba(11,53,84,0.08)]"
            >
              <div className="relative h-36 w-full bg-brand-gray">
                <CmsImage
                  src={category.image}
                  alt={category.label}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="font-display text-lg font-bold text-brand-dark">
                  {category.label}
                </h2>
                <p className="line-clamp-3 text-sm text-brand-dark/65">
                  {category.eyebrow}
                </p>
                <p className="mt-auto text-sm font-semibold text-brand-primary">
                  {`${count} producto${count === 1 ? "" : "s"}`}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      slug: category.slug,
                      name: category.label,
                      description: category.eyebrow,
                      image: category.image,
                    })
                  }
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg border border-brand-primary/30 bg-white px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/10"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {draft
        ? createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[3px]"
            aria-label="Cerrar"
            onClick={closeModal}
          />
          <div className="animate-hero-enter relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border-[3px] border-brand-primary bg-white shadow-[0_20px_50px_rgba(11,53,84,0.35)]">
            <div className="flex items-center justify-between border-b-2 border-brand-primary/25 bg-brand-primary/8 px-5 py-3.5">
              <p
                id="category-modal-title"
                className="font-display text-sm font-bold tracking-wide text-brand-primary uppercase"
              >
                {draft.slug ? "Editar categoría" : "Nueva categoría"}
              </p>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-primary/40 text-brand-primary transition hover:bg-brand-primary hover:text-white"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
            <form
              className="max-h-[min(80vh,640px)] space-y-4 overflow-y-auto px-5 py-5"
              onSubmit={(event) => {
                event.preventDefault();
                void persist();
              }}
            >
              <label className="block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                Nombre
                <input
                  className={`${fieldClass} mt-1`}
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                  placeholder="Ej. Iluminación"
                  autoFocus
                />
              </label>
              <label className="block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                Descripción
                <textarea
                  className={`${fieldClass} mt-1 min-h-20`}
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                  placeholder="Texto corto que se ve en la tarjeta y en la tienda"
                />
              </label>
              <CmsImageField
                value={draft.image}
                onChange={(image) => setDraft({ ...draft, image })}
                label="Imagen de portada"
                previewClassName="h-36 w-full"
              />
              {error ? (
                <p className="text-sm font-medium text-red-600">{error}</p>
              ) : null}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-extrabold text-brand-dark hover:bg-[#f0c52a] disabled:opacity-60"
                >
                  {saving ? "Guardando…" : draft.slug ? "Guardar cambios" : "Crear categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>,
            document.body,
          )
        : null}
    </div>
  );
}

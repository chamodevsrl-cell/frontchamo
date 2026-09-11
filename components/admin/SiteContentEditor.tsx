"use client";

import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import { slides as defaultSlides } from "@/data/media";
import { mainCategories } from "@/data/home";
import { emptyCmsState, type CmsState } from "@/lib/cms";

const fieldClass =
  "w-full rounded-lg border border-brand-primary/35 bg-white px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

function slidesFromCms(cms: CmsState) {
  return defaultSlides.map((slide) => {
    const over = cms.slides.find((item) => item.id === slide.id);
    return {
      id: slide.id,
      src: over?.src ?? slide.src,
      alt: over?.alt ?? slide.alt,
      hidden: over?.hidden ?? false,
    };
  });
}

function categoriesFromCms(cms: CmsState) {
  return mainCategories.map((category) => {
    const over = cms.categories.find((item) => item.slug === category.slug);
    return {
      slug: category.slug,
      label: over?.label ?? category.label,
      eyebrow: over?.eyebrow ?? category.eyebrow,
      bullets: over?.bullets ?? [...category.bullets],
      image: over?.image ?? category.image,
      imageAlt: over?.imageAlt ?? category.imageAlt,
      bannerTitle: over?.bannerTitle ?? category.bannerTitle,
    };
  });
}

export default function SiteContentEditor({
  section,
}: {
  section: "banners" | "categories";
}) {
  const { cms, ready } = useSiteContent();

  if (!ready) {
    return <p className="text-sm text-brand-dark/70">Cargando contenido local…</p>;
  }

  return <SiteContentEditorForm section={section} cms={cms} />;
}

function SiteContentEditorForm({
  section,
  cms,
}: {
  section: "banners" | "categories";
  cms: CmsState;
}) {
  const { saveCms, resetCms } = useSiteContent();
  const [notice, setNotice] = useState("");
  const [slides, setSlides] = useState(() => slidesFromCms(cms));
  const [categories, setCategories] = useState(() => categoriesFromCms(cms));

  function persist() {
    saveCms({
      slides: slides.map((slide) => ({
        id: slide.id,
        src: slide.src,
        alt: slide.alt,
        hidden: slide.hidden,
      })),
      categories: categories.map((category) => ({
        slug: category.slug,
        label: category.label,
        eyebrow: category.eyebrow,
        bullets: category.bullets as [string, string, string],
        image: category.image,
        imageAlt: category.imageAlt,
        bannerTitle: category.bannerTitle,
      })),
    });
    setNotice("Guardado en este navegador (chamo-cms-v1).");
  }

  function handleReset() {
    resetCms();
    setSlides(slidesFromCms(emptyCmsState));
    setCategories(categoriesFromCms(emptyCmsState));
    setNotice("Volviste a los banners y categorías del código.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">
            {section === "banners" ? "Banners" : "Categorías"}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-brand-dark/70">
            {section === "banners"
              ? "Edita los banners del slider de este navegador."
              : "Edita nombres y textos de las líneas de este navegador."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={persist}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Save className="h-4 w-4" strokeWidth={2} />
            Guardar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Restaurar código
          </button>
        </div>
      </div>
      {notice ? (
        <p role="status" className="text-sm font-medium text-brand-primary">
          {notice}
        </p>
      ) : null}

      {section === "banners" ? (
        <section className="rounded-2xl border border-brand-dark/10 bg-white p-5">
          <ul className="space-y-4">
            {slides.map((slide, index) => (
              <li
                key={slide.id}
                className="grid gap-3 rounded-xl border border-brand-dark/8 p-3 sm:grid-cols-2"
              >
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  Ruta / URL
                  <input
                    className={`${fieldClass} mt-1`}
                    value={slide.src}
                    onChange={(event) =>
                      setSlides((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, src: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  Texto alternativo
                  <input
                    className={`${fieldClass} mt-1`}
                    value={slide.alt}
                    onChange={(event) =>
                      setSlides((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, alt: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-brand-dark">
                  <input
                    type="checkbox"
                    checked={slide.hidden}
                    onChange={(event) =>
                      setSlides((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, hidden: event.target.checked } : item,
                        ),
                      )
                    }
                  />
                  Ocultar este banner
                </label>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="rounded-2xl border border-brand-dark/10 bg-white p-5">
          <ul className="space-y-6">
            {categories.map((category, index) => (
              <li
                key={category.slug}
                className="grid gap-3 rounded-xl border border-brand-dark/8 p-3 sm:grid-cols-2"
              >
                <p className="font-display text-base font-bold text-brand-dark sm:col-span-2">
                  {category.slug}
                </p>
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  Nombre
                  <input
                    className={`${fieldClass} mt-1`}
                    value={category.label}
                    onChange={(event) =>
                      setCategories((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, label: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  Título de banner
                  <input
                    className={`${fieldClass} mt-1`}
                    value={category.bannerTitle}
                    onChange={(event) =>
                      setCategories((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, bannerTitle: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  Antetítulo
                  <input
                    className={`${fieldClass} mt-1`}
                    value={category.eyebrow}
                    onChange={(event) =>
                      setCategories((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, eyebrow: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                  Imagen
                  <input
                    className={`${fieldClass} mt-1`}
                    value={category.image}
                    onChange={(event) =>
                      setCategories((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, image: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </label>
                {category.bullets.map((bullet, bulletIndex) => (
                  <label
                    key={`${category.slug}-b-${bulletIndex}`}
                    className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase sm:col-span-2"
                  >
                    Viñeta {bulletIndex + 1}
                    <input
                      className={`${fieldClass} mt-1`}
                      value={bullet}
                      onChange={(event) =>
                        setCategories((current) =>
                          current.map((item, i) => {
                            if (i !== index) return item;
                            const bullets: [string, string, string] = [...item.bullets];
                            bullets[bulletIndex] = event.target.value;
                            return { ...item, bullets };
                          }),
                        )
                      }
                    />
                  </label>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

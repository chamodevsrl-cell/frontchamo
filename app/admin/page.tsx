"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, RotateCcw, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useAuth } from "@/components/AuthProvider";
import { useSiteContent } from "@/components/ContentProvider";
import { slides as defaultSlides } from "@/data/media";
import { mainCategories } from "@/data/home";
import { emptyCmsState, type CmsState } from "@/lib/cms";

const fieldClass =
  "w-full rounded-lg border border-brand-primary/35 bg-white px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:bg-brand-dark/40 dark:text-white";

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

export default function AdminPage() {
  const { user, openAuth } = useAuth();
  const { cms, ready } = useSiteContent();

  if (!user) {
    return (
      <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
        <Navbar />
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center">
          <LayoutDashboard className="mx-auto h-10 w-10 text-brand-primary" />
          <h1 className="mt-4 font-display text-2xl font-bold text-brand-dark dark:text-white">
            Admin de contenido
          </h1>
          <p className="mt-2 text-sm text-brand-dark/70 dark:text-white/70">
            Inicia sesión para editar banners y categorías de este navegador.
          </p>
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="mt-4 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            Iniciar sesión
          </button>
        </main>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
        <Navbar />
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center text-sm text-brand-dark/70">
          Cargando contenido local…
        </main>
      </div>
    );
  }

  return <AdminEditor cms={cms} />;
}

function AdminEditor({ cms }: { cms: CmsState }) {
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
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-[1100px] flex-1 space-y-10 px-4 py-12 sm:px-6">
        <Reveal>
          <Breadcrumbs
            items={[
              { href: "/", label: "Inicio" },
              { label: "Admin contenido" },
            ]}
          />
          <h1 className="mt-4 font-display text-3xl font-bold text-brand-dark dark:text-white">
            Admin liviano
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-dark/70 dark:text-white/70">
            Edita banners del slider y textos de categorías. Los cambios viven en
            este navegador hasta que haya un CMS/backend.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
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
              className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary dark:text-white"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
              Restaurar código
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-brand-primary hover:underline"
            >
              Ver el sitio
            </Link>
          </div>
          {notice ? (
            <p role="status" className="mt-3 text-sm font-medium text-brand-primary">
              {notice}
            </p>
          ) : null}
        </Reveal>

        <section className="rounded-2xl border border-brand-dark/10 bg-white p-5 dark:bg-[#102a40]">
          <h2 className="font-display text-xl font-bold text-brand-dark dark:text-white">
            Banners
          </h2>
          <ul className="mt-4 space-y-4">
            {slides.map((slide, index) => (
              <li
                key={slide.id}
                className="grid gap-3 rounded-xl border border-brand-dark/8 p-3 sm:grid-cols-2"
              >
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase dark:text-white/60">
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
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase dark:text-white/60">
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
                <label className="flex items-center gap-2 text-sm text-brand-dark dark:text-white">
                  <input
                    type="checkbox"
                    checked={slide.hidden}
                    onChange={(event) =>
                      setSlides((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, hidden: event.target.checked }
                            : item,
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

        <section className="rounded-2xl border border-brand-dark/10 bg-white p-5 dark:bg-[#102a40]">
          <h2 className="font-display text-xl font-bold text-brand-dark dark:text-white">
            Categorías
          </h2>
          <ul className="mt-4 space-y-6">
            {categories.map((category, index) => (
              <li
                key={category.slug}
                className="grid gap-3 rounded-xl border border-brand-dark/8 p-3 sm:grid-cols-2"
              >
                <p className="sm:col-span-2 font-display text-base font-bold text-brand-dark dark:text-white">
                  {category.slug}
                </p>
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase dark:text-white/60">
                  Nombre
                  <input
                    className={`${fieldClass} mt-1`}
                    value={category.label}
                    onChange={(event) =>
                      setCategories((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, label: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase dark:text-white/60">
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
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase dark:text-white/60">
                  Antetítulo
                  <input
                    className={`${fieldClass} mt-1`}
                    value={category.eyebrow}
                    onChange={(event) =>
                      setCategories((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, eyebrow: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                </label>
                <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase dark:text-white/60">
                  Imagen
                  <input
                    className={`${fieldClass} mt-1`}
                    value={category.image}
                    onChange={(event) =>
                      setCategories((current) =>
                        current.map((item, i) =>
                          i === index
                            ? { ...item, image: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                </label>
                {category.bullets.map((bullet, bulletIndex) => (
                  <label
                    key={`${category.slug}-b-${bulletIndex}`}
                    className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase dark:text-white/60 sm:col-span-2"
                  >
                    Viñeta {bulletIndex + 1}
                    <input
                      className={`${fieldClass} mt-1`}
                      value={bullet}
                      onChange={(event) =>
                        setCategories((current) =>
                          current.map((item, i) => {
                            if (i !== index) return item;
                            const bullets = [...item.bullets];
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
      </main>
    </div>
  );
}

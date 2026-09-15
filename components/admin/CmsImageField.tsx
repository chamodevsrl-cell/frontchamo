"use client";

import { useRef, useState } from "react";
import { FolderOpen, ImagePlus, Link2 } from "lucide-react";
import CmsImage from "@/components/CmsImage";
import { readCmsImageFile } from "@/lib/cms-image";

const fieldClass =
  "w-full rounded-lg border border-brand-primary/35 bg-white px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export default function CmsImageField({
  value,
  onChange,
  label = "Imagen",
  previewClassName = "h-28 w-full",
  objectFit = "cover",
}: {
  value: string;
  onChange: (src: string) => void;
  label?: string;
  previewClassName?: string;
  objectFit?: "cover" | "contain";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      onChange(await readCmsImageFile(file));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo leer la imagen.");
    }
  }

  return (
    <div className="space-y-2">
      {label ? (
        <p className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
          {label}
        </p>
      ) : null}
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void onFile(event.dataTransfer.files[0]);
        }}
        className="space-y-2"
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`relative overflow-hidden rounded-xl border border-dashed border-brand-primary/40 bg-brand-gray/60 ${previewClassName}`}
        >
          {value ? (
            <span className="absolute inset-0">
              <CmsImage
                src={value}
                alt=""
                fill
                objectFit={objectFit}
                className={
                  objectFit === "contain" ? "object-contain p-2" : "object-cover"
                }
              />
            </span>
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-1 px-3 text-sm text-brand-dark/55">
              <ImagePlus className="h-5 w-5" />
              Arrastra una imagen o elige un archivo
            </span>
          )}
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Galería o carpetas
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          void onFile(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
      <label className="block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
        <span className="inline-flex items-center gap-1">
          <Link2 className="h-3.5 w-3.5" />
          O pega una URL / ruta
        </span>
        <input
          className={`${fieldClass} mt-1`}
          value={value.startsWith("data:") ? "" : value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://… o /images/…"
        />
      </label>
      {value.startsWith("data:") ? (
        <p className="text-[11px] text-brand-dark/50">
          Imagen cargada desde este equipo (se guarda en el navegador).
        </p>
      ) : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

export { fieldClass };

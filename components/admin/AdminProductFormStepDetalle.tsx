"use client";

import { ChevronLeft, ChevronRight, FolderOpen, Image as ImageIcon, Link2, X } from "lucide-react";

export default function AdminProductFormStepDetalle({
  descriptionFull,
  setDescriptionFull,
  images,
  imageUrl,
  setImageUrl,
  imageError,
  onFiles,
  onAddImageUrl,
  onRemoveImage,
  onMoveImage,
}: {
  descriptionFull: string;
  setDescriptionFull: (value: string) => void;
  images: string[];
  imageUrl: string;
  setImageUrl: (value: string) => void;
  imageError: string;
  onFiles: (files: FileList) => void;
  onAddImageUrl: () => void;
  onRemoveImage: (index: number) => void;
  onMoveImage: (index: number, direction: -1 | 1) => void;
}) {
  return (
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
              onFiles(event.dataTransfer.files);
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
                  onFiles(event.target.files);
                }
                event.target.value = "";
              }}
            />
          </label>
          <p className="text-xs text-brand-dark/40">
            En móvil abre la galería/cámara del equipo. También puedes pegar una
            URL. La primera imagen es la principal. JPG/PNG/WebP · máx 60 MB
            por imagen.
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
                  onAddImageUrl();
                }
              }}
              placeholder="https://… o /images/…"
              className="w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            />
            <button
              type="button"
              onClick={onAddImageUrl}
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
                    onClick={() => onMoveImage(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-white disabled:opacity-30"
                    aria-label="Mover a la izquierda"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="rounded p-1 text-white hover:text-red-300"
                    aria-label="Quitar imagen"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveImage(index, 1)}
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
  );
}

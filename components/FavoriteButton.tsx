"use client";

import { useState, type MouseEvent } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/components/FavoritesProvider";

type FavoriteButtonProps = {
  productId: string;
  variant?: "overlay" | "box";
  className?: string;
};

export default function FavoriteButton({
  productId,
  variant = "overlay",
  className,
}: FavoriteButtonProps) {
  const { has, toggle } = useFavorites();
  const active = has(productId);
  const [justSaved, setJustSaved] = useState(false);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.preventDefault();
    const nowActive = toggle(productId);
    if (nowActive) {
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 1400);
    } else {
      setJustSaved(false);
    }
  }

  const overlayClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm transition hover:text-brand-primary";
  const boxClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-dark/12 text-brand-dark transition hover:border-brand-primary hover:text-brand-primary";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
        className={`${variant === "box" ? boxClass : overlayClass} ${
          active ? "text-brand-primary" : ""
        } ${className ?? ""}`}
      >
        <Heart
          className={variant === "box" ? "h-4 w-4" : "h-4 w-4"}
          strokeWidth={2}
          fill={active ? "currentColor" : "none"}
        />
      </button>
      {justSaved ? (
        <span
          className={`absolute z-20 whitespace-nowrap rounded-md bg-brand-dark px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase ${
            variant === "box"
              ? "top-full left-1/2 mt-1 -translate-x-1/2"
              : "top-1/2 right-full mr-1 -translate-y-1/2"
          }`}
        >
          Guardado
        </span>
      ) : null}
    </span>
  );
}

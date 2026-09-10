"use client";

import type { MouseEvent } from "react";
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

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.preventDefault();
    toggle(productId);
  }

  const overlayClass =
    "pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm transition hover:text-brand-primary";
  const boxClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-dark/12 text-brand-dark transition hover:border-brand-primary hover:text-brand-primary";

  return (
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
        className="h-4 w-4"
        strokeWidth={2}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}

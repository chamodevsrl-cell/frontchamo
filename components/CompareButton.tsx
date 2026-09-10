"use client";

import type { MouseEvent } from "react";
import { GitCompareArrows } from "lucide-react";
import { useCompare } from "@/components/CompareProvider";

type CompareButtonProps = {
  productId: string;
  variant?: "overlay" | "box";
  className?: string;
};

export default function CompareButton({
  productId,
  variant = "overlay",
  className,
}: CompareButtonProps) {
  const { has, toggle } = useCompare();
  const active = has(productId);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.preventDefault();
    toggle(productId);
  }

  const overlayClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm transition hover:text-brand-primary";
  const boxClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-dark/12 text-brand-dark transition hover:border-brand-primary hover:text-brand-primary";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Quitar de comparar" : "Agregar a comparar"}
      className={`${variant === "box" ? boxClass : overlayClass} ${
        active ? "text-brand-primary" : ""
      } ${className ?? ""}`}
    >
      <GitCompareArrows className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}

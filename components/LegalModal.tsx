"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import LegalCopy, { type LegalDoc } from "@/components/LegalCopy";

type LegalModalProps = {
  open: boolean;
  tab: LegalDoc;
  onClose: () => void;
  onTabChange: (tab: LegalDoc) => void;
};

const TABS: { id: LegalDoc; label: string }[] = [
  { id: "terminos", label: "Términos y condiciones" },
  { id: "privacidad", label: "Política de privacidad" },
];

export default function LegalModal({
  open,
  tab,
  onClose,
  onTabChange,
}: LegalModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[3px]"
        aria-label="Cerrar términos y privacidad"
        onClick={onClose}
      />

      <div className="animate-hero-enter relative z-10 flex max-h-[min(88vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-[3px] border-brand-primary bg-white shadow-[0_20px_50px_rgba(11,53,84,0.35),0_0_0_4px_rgba(18,126,201,0.2)]">
        <div className="flex items-center justify-between gap-3 border-b-2 border-brand-primary/25 bg-brand-primary/8 px-5 py-3.5">
          <p
            id="legal-modal-title"
            className="font-display text-sm font-bold tracking-wide text-brand-primary uppercase"
          >
            Políticas del sitio
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-brand-primary/40 text-brand-primary transition hover:bg-brand-primary hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex gap-1 border-b border-brand-primary/15 px-4 pt-3 sm:px-5">
          {TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-pressed={selected}
                className={`rounded-t-lg px-3 py-2 text-xs font-bold tracking-wide uppercase transition sm:text-sm ${
                  selected
                    ? "bg-brand-primary text-white"
                    : "text-brand-dark/65 hover:bg-brand-gray"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="font-display text-2xl font-bold text-brand-dark">
            {tab === "terminos"
              ? "Términos y condiciones"
              : "Política de privacidad"}
          </h2>
          <div className="mt-4">
            <LegalCopy doc={tab} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

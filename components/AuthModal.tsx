"use client";

import { X } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/components/AuthProvider";

export default function AuthModal() {
  const { isOpen, closeAuth } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[3px]"
        aria-label="Cerrar inicio de sesión"
        onClick={closeAuth}
      />

      <div className="animate-hero-enter relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-[3px] border-brand-primary bg-white shadow-[0_20px_50px_rgba(11,53,84,0.35),0_0_0_4px_rgba(18,126,201,0.2)] dark:bg-[#082a43]">
        <div className="flex items-center justify-between border-b-2 border-brand-primary/25 bg-brand-primary/8 px-5 py-3.5">
          <p
            id="auth-modal-title"
            className="font-display text-sm font-bold tracking-wide text-brand-primary uppercase"
          >
            Acceso a tu cuenta
          </p>
          <button
            type="button"
            onClick={closeAuth}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-primary/40 text-brand-primary transition hover:bg-brand-primary hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-h-[min(80vh,640px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}

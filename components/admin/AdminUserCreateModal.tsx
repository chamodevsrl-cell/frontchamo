"use client";

import type { FormEvent } from "react";
import { X } from "lucide-react";
import type { PanelRole } from "@/types/admin";

export default function AdminUserCreateModal({
  roles,
  pending,
  error,
  onSubmit,
  onClose,
}: {
  roles: PanelRole[];
  pending: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-user-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[3px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="animate-hero-enter relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-[3px] border-brand-primary bg-white shadow-[0_20px_50px_rgba(11,53,84,0.35)]">
        <div className="flex items-center justify-between border-b-2 border-brand-primary/25 bg-brand-primary/8 px-5 py-3.5">
          <p
            id="new-user-modal-title"
            className="font-display text-sm font-bold tracking-wide text-brand-primary uppercase"
          >
            Nuevo usuario
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-primary/40 text-brand-primary transition hover:bg-brand-primary hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          className="max-h-[min(80vh,640px)] space-y-4 overflow-y-auto px-5 py-5"
        >
          <p className="text-sm text-brand-dark/65">
            Llama a <code>createUser()</code> (mock). Queda <code>active</code> y
            puede entrar desde &quot;Mi cuenta&quot; con nombre o correo.
          </p>

          <label className="block text-sm font-semibold">
            Nombre
            <input
              name="name"
              required
              autoFocus
              className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            />
          </label>

          <label className="block text-sm font-semibold">
            Correo
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            />
          </label>

          <label className="block text-sm font-semibold">
            Contraseña
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            />
          </label>

          <fieldset>
            <legend className="text-sm font-semibold">
              Roles <span className="font-normal text-brand-dark/50">(elige uno o más)</span>
            </legend>
            <div className="mt-2 space-y-1.5">
              {roles.map((role, index) => (
                <label
                  key={role.id}
                  className="flex items-start gap-2 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm font-normal"
                >
                  <input
                    type="checkbox"
                    name="roleIds"
                    value={role.id}
                    defaultChecked={index === 0}
                    className="mt-0.5 rounded border-brand-dark/20"
                  />
                  <span>
                    <span className="block font-semibold">{role.name}</span>
                    <span className="block text-xs text-brand-dark/55">
                      {role.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error ? (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-brand-gold px-4 py-2 text-sm font-extrabold text-brand-dark hover:bg-[#f0c52a] disabled:opacity-60"
            >
              {pending ? "Guardando…" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

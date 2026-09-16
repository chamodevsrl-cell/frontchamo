"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";
import type { AuthUser } from "@/lib/auth-local";

const fieldClass =
  "w-full rounded-xl border border-brand-dark/15 bg-white px-3.5 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export default function AccountCompanyPanel({ user }: { user: AuthUser }) {
  const { updateProfile } = useAuth();
  const [companyName, setCompanyName] = useState(user.companyName);
  const [ruc, setRuc] = useState(user.ruc);
  const [city, setCity] = useState(user.city);
  const [address, setAddress] = useState(user.address);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = ruc.replace(/\D/g, "");
    if (ruc.trim() && digits.length !== 11) {
      setError("El RUC debe tener 11 dígitos.");
      setMessage("");
      return;
    }
    const result = updateProfile({ companyName, ruc: digits, city, address });
    if (result) {
      setError(result);
      setMessage("");
      return;
    }
    setError("");
    setMessage("Datos de empresa guardados.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-dark">Mi empresa</h2>
        <p className="mt-1 text-sm text-brand-dark/60">
          Estos datos se usan al armar cotizaciones por WhatsApp. Quedan en este
          navegador hasta que exista backend.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-semibold text-brand-dark">Razón social</span>
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className={fieldClass}
            placeholder="Ferretería o distribuidora"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark">RUC</span>
          <input
            value={ruc}
            onChange={(event) => setRuc(event.target.value)}
            className={fieldClass}
            placeholder="11 dígitos"
            inputMode="numeric"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark">Ciudad</span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={fieldClass}
            placeholder="Lima"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-semibold text-brand-dark">Dirección</span>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={fieldClass}
            placeholder="Calle, distrito"
          />
        </label>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {message ? <p className="text-sm font-medium text-brand-primary">{message}</p> : null}

      <button
        type="submit"
        className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
      >
        Guardar empresa
      </button>
    </form>
  );
}

"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Camera, ShieldCheck } from "lucide-react";
import AccountAvatar from "@/components/account/AccountAvatar";
import { useAuth } from "@/components/AuthProvider";
import {
  AVATAR_PRESETS,
  readProfileImageFile,
  type AvatarPresetId,
} from "@/lib/account-profile";
import type { AuthUser } from "@/lib/auth-local";

const fieldClass =
  "w-full rounded-xl border border-brand-dark/15 bg-white px-3.5 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 disabled:cursor-not-allowed disabled:bg-brand-gray disabled:text-brand-dark/55";

export default function AccountProfilePanel({ user }: { user: AuthUser }) {
  const { updateProfile, hasPanelSession } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [avatarPreset, setAvatarPreset] = useState<AvatarPresetId>(user.avatarPreset);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const preview = { ...user, name, avatarUrl, avatarPreset };
  const staff = user.role === "admin" || hasPanelSession;

  function persist(patch: Parameters<typeof updateProfile>[0], okMessage: string) {
    const result = updateProfile(patch);
    if (result) {
      setError(result);
      setMessage("");
      return false;
    }
    setError("");
    setMessage(okMessage);
    return true;
  }

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      const dataUrl = await readProfileImageFile(file);
      setAvatarUrl(dataUrl);
      persist({ avatarUrl: dataUrl }, "Foto de perfil actualizada.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo leer la foto.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    persist({ name, phone, avatarUrl, avatarPreset }, "Cambios guardados.");
    setBusy(false);
  }

  function toggleAuthenticator() {
    persist(
      { totpEnabled: !user.totpEnabled },
      user.totpEnabled
        ? "Autenticador desvinculado en este navegador."
        : "Autenticador marcado como vinculado en este navegador.",
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-4 rounded-2xl border border-brand-dark/10 bg-white px-5 py-5">
        <div className="relative">
          <AccountAvatar user={preview} size={72} />
          <span className="absolute -right-0.5 -bottom-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white ring-2 ring-white">
            <Camera className="h-3.5 w-3.5" strokeWidth={2.25} />
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.14em] text-brand-dark/45 uppercase">
            Datos de cuenta
          </p>
          <p className="truncate font-display text-lg font-bold text-brand-dark">
            {user.name}
          </p>
          <p className="truncate text-sm text-brand-dark/55">{user.email}</p>
          <p className="mt-1 text-xs text-brand-dark/50">
            {staff
              ? "Cuenta administrador · Teléfono obligatorio para contacto comercial"
              : "Cuenta mayorista · Teléfono para cotizaciones y despacho"}
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-brand-dark/45 uppercase">
            Foto de perfil
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                void handlePhoto(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full border-2 border-brand-primary px-4 py-2 text-xs font-bold tracking-wide text-brand-primary uppercase hover:bg-brand-primary hover:text-white"
            >
              Subir foto personalizada
            </button>
            <p className="text-xs text-brand-dark/45">JPG/PNG/WebP · máx 2.5 MB · este navegador</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-label={`Avatar ${preset.id}`}
                aria-pressed={avatarPreset === preset.id && !avatarUrl}
                onClick={() => {
                  setAvatarPreset(preset.id);
                  setAvatarUrl("");
                  persist(
                    { avatarPreset: preset.id, avatarUrl: "" },
                    "Avatar actualizado.",
                  );
                }}
                className={`rounded-full p-0.5 ${
                  avatarPreset === preset.id && !avatarUrl
                    ? "ring-2 ring-brand-primary ring-offset-2"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <AccountAvatar
                  user={{ name: user.name, avatarUrl: "", avatarPreset: preset.id }}
                  size={40}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="sr-only">Nombre</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
              placeholder="Nombre y apellido"
            />
          </label>
          <label className="block text-sm">
            <span className="sr-only">Correo</span>
            <input disabled value={user.email} className={fieldClass} />
          </label>
          <label className="block text-sm">
            <span className="sr-only">Teléfono</span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={fieldClass}
              placeholder="+51 999 999 999"
            />
          </label>
          <div className="rounded-xl border border-dashed border-brand-dark/15 bg-brand-gray/60 px-3.5 py-2.5 text-sm text-brand-dark/55">
            RUC / razón social
            <p className="mt-0.5 text-xs">
              Configúralos en{" "}
              <Link href="/perfil?tab=empresa" className="font-semibold text-brand-primary">
                Mi empresa
              </Link>
              .
            </p>
          </div>
        </div>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        {message ? <p className="text-sm font-medium text-brand-primary">{message}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          Guardar cambios
        </button>
      </form>

      <section className="border-t border-brand-dark/8 pt-6">
        <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-brand-dark">
          <ShieldCheck className="h-5 w-5 text-brand-primary" />
          Autenticador (Google / Microsoft)
        </h2>
        <p className="mt-1 max-w-xl text-sm text-brand-dark/60">
          Si lo vinculas, el inicio de sesión y la recuperación pedirán el código
          de la app en lugar de (o antes del) OTP por correo. Hoy queda marcado
          en este navegador; el backend real validará el código.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {user.totpEnabled ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Vinculado
            </span>
          ) : (
            <span className="rounded-full bg-brand-gray px-3 py-1 text-xs font-bold text-brand-dark/55">
              Sin vincular
            </span>
          )}
          <button
            type="button"
            onClick={toggleAuthenticator}
            className="rounded-full border border-brand-dark/15 px-4 py-1.5 text-sm font-semibold text-brand-dark hover:bg-brand-gray"
          >
            {user.totpEnabled ? "Desvincular" : "Vincular"}
          </button>
        </div>
      </section>
    </div>
  );
}

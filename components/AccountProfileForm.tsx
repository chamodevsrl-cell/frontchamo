"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import AccountAvatar, {
  PROFILE_AVATAR_PRESETS,
  presetPhoto,
} from "@/components/AccountAvatar";
import {
  MAX_BANNER_IMAGE_BYTES,
  MAX_PROFILE_IMAGE_BYTES,
  readCmsImageFile,
} from "@/lib/cms-image";
import { BIO_MAX_LENGTH, type ProfilePatch } from "@/lib/auth-local";

const fieldClass =
  "w-full rounded-lg border border-brand-dark/15 bg-white px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function AccountProfileForm({
  variant = "profile",
}: {
  variant?: "profile" | "company";
}) {
  const { user, updateProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [photo, setPhoto] = useState(user?.photo ?? "");
  const [banner, setBanner] = useState(user?.banner ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [ruc, setRuc] = useState(user?.ruc ?? "");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setMessage("");
    setOk(false);
    if (!ALLOWED_TYPES.has(file.type)) {
      setMessage("Usa JPG, PNG o WebP.");
      return;
    }
    try {
      setPhoto(await readCmsImageFile(file, MAX_PROFILE_IMAGE_BYTES));
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "No se pudo leer la foto.");
    }
  }

  async function onBannerFile(file: File | undefined) {
    if (!file) return;
    setMessage("");
    setOk(false);
    if (!ALLOWED_TYPES.has(file.type)) {
      setMessage("Usa JPG, PNG o WebP.");
      return;
    }
    try {
      setBanner(await readCmsImageFile(file, MAX_BANNER_IMAGE_BYTES));
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "No se pudo leer la foto.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setOk(false);
    setBusy(true);
    const patch: ProfilePatch = {
      name,
      phone,
      photo,
      banner,
      bio,
      company,
      ruc,
    };
    const error = await updateProfile(patch);
    setBusy(false);
    if (error) {
      setMessage(error);
      return;
    }
    setOk(true);
  }

  if (variant === "company") {
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <p className="text-[11px] font-bold tracking-wide text-brand-dark/50 uppercase">
            Datos fiscales
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-brand-dark">
            Mi empresa
          </h2>
          <p className="mt-1 text-sm text-brand-dark/65">
            RUC y razón social para cotizaciones mayoristas. Se guardan en este
            navegador (y en el panel si tu usuario es staff).
          </p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-brand-dark/70">Razón social</span>
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={fieldClass}
            placeholder="Chamo Import S.R.L."
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-brand-dark/70">RUC</span>
          <input
            value={ruc}
            onChange={(event) => setRuc(event.target.value)}
            className={fieldClass}
            inputMode="numeric"
            placeholder="20XXXXXXXXX"
          />
        </label>
        {message ? <p className="text-sm text-red-600">{message}</p> : null}
        {ok ? (
          <p className="text-sm font-medium text-brand-primary">Cambios guardados.</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? "Guardando…" : "Guardar empresa"}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-4 rounded-xl bg-brand-gray/70 p-4 sm:flex-row sm:items-center">
        <AccountAvatar photo={photo} name={name || user.name} size={72} />
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-wide text-brand-dark/50 uppercase">
            Datos de cuenta
          </p>
          <p className="truncate font-display text-lg font-bold text-brand-dark">
            {name || user.name}
          </p>
          <p className="truncate text-sm text-brand-dark/60">{user.email}</p>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold tracking-wide text-brand-dark/50 uppercase">
          Foto de perfil
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full border-2 border-brand-primary px-4 py-1.5 text-xs font-bold tracking-wide text-brand-primary uppercase hover:bg-brand-primary/8"
          >
            Subir foto personalizada
          </button>
          <span className="text-xs text-brand-dark/50">
            JPG/PNG/WebP · máx 2.5 MB
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROFILE_AVATAR_PRESETS.map((preset) => {
            const value = presetPhoto(preset.id);
            const selected = photo === value;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPhoto(value)}
                className={`rounded-full p-0.5 ${selected ? "ring-2 ring-brand-primary ring-offset-2" : ""}`}
                aria-label={`Avatar ${preset.id}`}
                aria-pressed={selected}
              >
                <AccountAvatar photo={value} name={name} size={40} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold tracking-wide text-brand-dark/50 uppercase">
          Foto de portada
        </p>
        <p className="mt-1 text-xs text-brand-dark/50">
          Se ve de fondo detrás de tu nombre en “Mi cuenta”.
        </p>
        <div
          className="mt-2 flex h-24 items-center justify-center overflow-hidden rounded-xl bg-brand-dark bg-cover bg-center"
          style={banner ? { backgroundImage: `url(${banner})` } : undefined}
        >
          {!banner ? (
            <span className="text-xs font-semibold text-white/50">Sin foto de portada</span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => bannerFileRef.current?.click()}
            className="rounded-full border-2 border-brand-primary px-4 py-1.5 text-xs font-bold tracking-wide text-brand-primary uppercase hover:bg-brand-primary/8"
          >
            Subir foto de portada
          </button>
          {banner ? (
            <button
              type="button"
              onClick={() => setBanner("")}
              className="text-xs font-semibold text-brand-dark/50 hover:text-brand-dark"
            >
              Quitar
            </button>
          ) : null}
          <span className="text-xs text-brand-dark/50">
            JPG/PNG/WebP · máx 3.5 MB
          </span>
          <input
            ref={bannerFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => void onBannerFile(event.target.files?.[0])}
          />
        </div>
      </div>

      <label className="block space-y-1.5">
        <span className="flex items-center justify-between text-xs font-semibold text-brand-dark/70">
          Descripción breve
          <span className="font-normal text-brand-dark/40">
            {bio.length}/{BIO_MAX_LENGTH}
          </span>
        </span>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value.slice(0, BIO_MAX_LENGTH))}
          className={`${fieldClass} min-h-20 resize-none`}
          placeholder="Cuéntale a tu equipo o a tus clientes quién eres…"
          maxLength={BIO_MAX_LENGTH}
        />
        <span className="block text-xs text-brand-dark/50">
          Aparece debajo de tu nombre en “Mi cuenta”.
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-brand-dark/70">Nombre</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
            autoComplete="name"
            required
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-brand-dark/70">Correo</span>
          <input
            value={user.email}
            readOnly
            className={`${fieldClass} cursor-not-allowed bg-brand-gray text-brand-dark/60`}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-brand-dark/70">Teléfono</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClass}
            inputMode="tel"
            autoComplete="tel"
            placeholder="+51 959 723 602"
          />
        </label>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-brand-dark/70">RUC / razón social</p>
          <p className="rounded-lg border border-brand-dark/10 bg-brand-gray px-3 py-2.5 text-sm text-brand-dark/55">
            Configúralos en{" "}
            <Link href="/cuenta/empresa" className="font-semibold text-brand-primary hover:underline">
              Mi empresa
            </Link>
            {user.company ? ` · ${user.company}` : ""}
          </p>
        </div>
      </div>

      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      {ok ? (
        <p className="text-sm font-medium text-brand-primary">Cambios guardados.</p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {busy ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}

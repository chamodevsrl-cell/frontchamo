"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAdminAction } from "@/app/admin/actions";
import { persistAdminSession } from "@/lib/auth";
import { MOCK_ADMIN_EMAIL } from "@/services/adminApi";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(MOCK_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("admin-shell");
    return () => document.documentElement.classList.remove("admin-shell");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result = await loginAdminAction({
        email,
        password,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      persistAdminSession(result.session);
      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "No se pudo iniciar sesión.";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[75] flex flex-col items-center justify-center bg-[#0B3554] px-4">
      <Image
        src="/logo.png"
        alt="Chamo Import S.R.L."
        width={192}
        height={64}
        className="w-48 object-contain"
      />
      <h1 className="mt-6 font-display text-2xl font-bold text-white">
        Panel de administración
      </h1>
      <p className="mt-2 max-w-sm text-center text-sm text-white/70">
        Sesión del panel (independiente de la cuenta de la tienda). Mock local:
        no es un acceso oficial.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-brand-dark shadow-xl"
      >
        <label className="block text-sm font-semibold">
          Correo
          <input
            type="email"
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm font-normal outline-none focus:border-brand-primary"
          />
        </label>
        <label className="block text-sm font-semibold">
          Contraseña
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm font-normal outline-none focus:border-brand-primary"
          />
        </label>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : (
          <p className="text-xs text-brand-dark/55">
            Demo: <code>{MOCK_ADMIN_EMAIL}</code> / <code>admin123</code>
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-brand-primary py-2.5 text-sm font-semibold text-white hover:bg-[#0e6aad] disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <Link href="/" className="mt-6 text-sm font-medium text-brand-gold hover:underline">
        Volver al sitio
      </Link>
    </div>
  );
}

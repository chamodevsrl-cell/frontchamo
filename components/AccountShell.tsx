"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import AccountAvatar from "@/components/AccountAvatar";
import { useAuth } from "@/components/AuthProvider";
import { accountRoleLabel } from "@/lib/auth-local";
import { House } from "lucide-react";

const TABS = [
  { href: "/cuenta", label: "Resumen", exact: true },
  { href: "/cuenta/pedidos", label: "Mis pedidos" },
  { href: "/cotizar", label: "Cotizaciones" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/cuenta/perfil", label: "Mi perfil" },
  { href: "/cuenta/empresa", label: "Mi empresa" },
] as const;

function isTabActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/cuenta") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, ready, openAuth, hasPanelSession, panelSession } = useAuth();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb]">
      <Navbar />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {!ready ? (
          <p className="text-sm text-brand-dark/60">Cargando tu cuenta…</p>
        ) : !user ? (
          <div className="rounded-2xl border border-brand-dark/10 bg-white p-8 text-center shadow-sm">
            <h1 className="font-display text-2xl font-bold text-brand-dark">
              Mi cuenta
            </h1>
            <p className="mt-2 text-sm text-brand-dark/70">
              Inicia sesión para ver y editar tu perfil. Sirve para clientes,
              administradores y cualquier rol del panel.
            </p>
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="mt-5 inline-flex rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Iniciar sesión
            </button>
          </div>
        ) : (
          <Reveal>
            <section className="admin-page-hero relative overflow-hidden rounded-2xl px-5 py-6 text-white sm:px-8 sm:py-7">
              {user.banner ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.banner}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 z-0 h-full w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 z-0 bg-gradient-to-r from-brand-dark/92 via-brand-dark/80 to-brand-dark/50"
                  />
                </>
              ) : null}
              <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <AccountAvatar
                    photo={user.photo}
                    name={user.name}
                    size={72}
                    className="ring-2 ring-white/40"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-[0.18em] text-white/70 uppercase">
                      Área cliente
                    </p>
                    <h1 className="truncate font-display text-3xl font-bold tracking-tight sm:text-4xl">
                      {user.name}
                    </h1>
                    <p className="mt-1 max-w-sm text-sm text-white/85">
                      {user.bio ? (
                        user.bio
                      ) : (
                        <>
                          Agrega una breve descripción en{" "}
                          <Link
                            href="/cuenta/perfil"
                            className="font-semibold underline decoration-white/40 underline-offset-2 hover:decoration-white"
                          >
                            Mi perfil
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hasPanelSession ? (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark/70 px-4 py-2 text-xs font-bold tracking-wide text-white uppercase ring-1 ring-white/15 hover:bg-brand-dark"
                    >
                      <House className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Administrar
                    </Link>
                  ) : null}
                  <Link
                    href="/cuenta/empresa"
                    className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide uppercase ring-1 ${
                      pathname.startsWith("/cuenta/empresa")
                        ? "bg-brand-primary text-white ring-brand-primary"
                        : "bg-white/10 text-white ring-white/25 hover:bg-white/15"
                    }`}
                  >
                    Mi empresa
                  </Link>
                  <Link
                    href="/cuenta/perfil"
                    className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide uppercase ${
                      pathname.startsWith("/cuenta/perfil")
                        ? "bg-brand-primary text-white"
                        : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15"
                    }`}
                  >
                    Mi perfil
                  </Link>
                </div>
              </div>
            </section>

            <nav
              className="mt-5 flex gap-1 overflow-x-auto rounded-full bg-brand-gray p-1.5"
              aria-label="Secciones de mi cuenta"
            >
              {TABS.map((tab) => {
                const active = isTabActive(pathname, tab.href, "exact" in tab);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold tracking-wide uppercase sm:px-4 ${
                      active
                        ? "bg-white text-brand-primary shadow-sm"
                        : "text-brand-dark/55 hover:text-brand-dark"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>

            <p className="mt-3 text-xs text-brand-dark/50">
              {accountRoleLabel(user, hasPanelSession, panelSession?.role)}
            </p>

            <div className="mt-5">{children}</div>
          </Reveal>
        )}
      </main>
    </div>
  );
}

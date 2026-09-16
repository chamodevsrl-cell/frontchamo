"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import AccountDashboard from "@/components/account/AccountDashboard";

export default function PerfilPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb] dark:bg-brand-dark">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Reveal>
          <Breadcrumbs
            items={[{ href: "/", label: "Inicio" }, { label: "Mi cuenta" }]}
          />
        </Reveal>
        <Reveal delayMs={60}>
          <div className="mt-4">
            <Suspense
              fallback={
                <p className="text-sm text-brand-dark/60">Cargando tu cuenta…</p>
              }
            >
              <AccountDashboard />
            </Suspense>
          </div>
        </Reveal>
      </main>
    </div>
  );
}

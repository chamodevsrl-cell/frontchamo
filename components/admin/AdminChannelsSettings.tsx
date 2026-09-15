"use client";

import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import { fieldClass } from "@/components/admin/CmsImageField";
import { defaultFooter, type CmsFooter } from "@/lib/cms";

export default function AdminChannelsSettings() {
  const { cms, ready, saveCms } = useSiteContent();

  if (!ready) {
    return <p className="text-sm text-brand-dark/70">Cargando canales…</p>;
  }

  return <AdminChannelsSettingsForm initial={cms.footer} saveCms={saveCms} />;
}

function AdminChannelsSettingsForm({
  initial,
  saveCms,
}: {
  initial: CmsFooter;
  saveCms: (patch: { footer: CmsFooter }) => void;
}) {
  const [footer, setFooter] = useState<CmsFooter>(() => structuredClone(initial));
  const [notice, setNotice] = useState("");

  function update<K extends keyof CmsFooter>(key: K, value: CmsFooter[K]) {
    setFooter((current) => ({ ...current, [key]: value }));
  }

  function persist() {
    saveCms({ footer });
    setNotice("Canales guardados. El botón flotante, llamadas, correo y redes usan estos datos.");
  }

  function restore() {
    const base = defaultFooter();
    const next: CmsFooter = {
      ...footer,
      phone: base.phone,
      whatsapp: base.whatsapp,
      email: base.email,
      facebookUrl: base.facebookUrl,
      instagramUrl: base.instagramUrl,
      youtubeUrl: base.youtubeUrl,
    };
    setFooter(next);
    saveCms({ footer: next });
    setNotice("Volviste a los canales del código (data/contact.ts).");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-dark/70">
          Número de WhatsApp del botón verde, teléfono para llamar, correo y
          URLs de redes. Se ven en el footer, en Contacto y en las cotizaciones.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={persist}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Save className="h-4 w-4" />
            Guardar canales
          </button>
          <button
            type="button"
            onClick={restore}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-dark/15 px-4 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar código
          </button>
        </div>
      </div>
      {notice ? (
        <p role="status" className="text-sm font-medium text-brand-primary">
          {notice}
        </p>
      ) : null}

      <section className="rounded-2xl border border-brand-dark/10 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-brand-dark">
          WhatsApp y llamadas
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            WhatsApp (botón flotante)
            <input
              className={`${fieldClass} mt-1`}
              value={footer.whatsapp}
              onChange={(event) => update("whatsapp", event.target.value)}
              placeholder={footer.phone || "+51 959 723 602"}
            />
            <span className="mt-1 block text-[11px] font-medium normal-case tracking-normal text-brand-dark/50">
              Si lo dejas vacío, se usa el teléfono de llamadas.
            </span>
          </label>
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            Teléfono para llamar
            <input
              className={`${fieldClass} mt-1`}
              value={footer.phone}
              onChange={(event) => update("phone", event.target.value)}
              placeholder="+51 959 723 602"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-dark/10 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-brand-dark">
          Correo electrónico
        </h2>
        <label className="mt-4 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
          Correo
          <input
            type="email"
            className={`${fieldClass} mt-1`}
            value={footer.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="ventas@chamoimport.com"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-brand-dark/10 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-brand-dark">
          Redes sociales
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            Facebook
            <input
              className={`${fieldClass} mt-1`}
              value={footer.facebookUrl}
              onChange={(event) => update("facebookUrl", event.target.value)}
              placeholder="https://facebook.com/…"
            />
          </label>
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            Instagram
            <input
              className={`${fieldClass} mt-1`}
              value={footer.instagramUrl}
              onChange={(event) => update("instagramUrl", event.target.value)}
              placeholder="https://instagram.com/…"
            />
          </label>
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            YouTube
            <input
              className={`${fieldClass} mt-1`}
              value={footer.youtubeUrl}
              onChange={(event) => update("youtubeUrl", event.target.value)}
              placeholder="https://youtube.com/…"
            />
          </label>
        </div>
      </section>
    </div>
  );
}

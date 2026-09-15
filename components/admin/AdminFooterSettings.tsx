"use client";

import { useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useSiteContent } from "@/components/ContentProvider";
import CmsImageField, { fieldClass } from "@/components/admin/CmsImageField";
import { defaultFooter, type CmsFooter, type CmsPaymentMethod } from "@/lib/cms";

export default function AdminFooterSettings() {
  const { cms, ready, saveCms } = useSiteContent();

  if (!ready) {
    return <p className="text-sm text-brand-dark/70">Cargando ajustes…</p>;
  }

  return <AdminFooterSettingsForm initial={cms.footer} saveCms={saveCms} />;
}

function AdminFooterSettingsForm({
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
    setNotice("Footer guardado en este navegador.");
  }

  function restore() {
    const base = defaultFooter();
    const next: CmsFooter = {
      ...footer,
      tagline: base.tagline,
      newsletterBlurb: base.newsletterBlurb,
      address: base.address,
      addressHint: base.addressHint,
      hours: base.hours,
      hoursHint: base.hoursHint,
      mapUrl: base.mapUrl,
      mapEmbedUrl: base.mapEmbedUrl,
      paymentMethods: base.paymentMethods.map((item) => ({ ...item })),
    };
    setFooter(next);
    saveCms({ footer: next });
    setNotice("Volviste al footer del código (dirección, mapa y pagos).");
  }

  function setPayment(index: number, patch: Partial<CmsPaymentMethod>) {
    setFooter((current) => ({
      ...current,
      paymentMethods: current.paymentMethods.map((method, i) =>
        i === index ? { ...method, ...patch } : method,
      ),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-brand-dark/70">
          Pie de la tienda: frase, dirección, mapa, horario y medios de pago.
          El WhatsApp, el teléfono, el correo y las redes se editan en
          Canales de atención.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={persist}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Save className="h-4 w-4" />
            Guardar footer
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
        <h2 className="font-display text-lg font-bold text-brand-dark">Identidad</h2>
        <label className="mt-4 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
          Frase del footer
          <input
            className={`${fieldClass} mt-1`}
            value={footer.tagline}
            onChange={(event) => update("tagline", event.target.value)}
          />
        </label>
        <label className="mt-3 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
          Texto del boletín
          <input
            className={`${fieldClass} mt-1`}
            value={footer.newsletterBlurb}
            onChange={(event) => update("newsletterBlurb", event.target.value)}
          />
        </label>
      </section>

      <section className="rounded-2xl border border-brand-dark/10 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-brand-dark">
          Dirección y mapa
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            Dirección
            <input
              className={`${fieldClass} mt-1`}
              value={footer.address}
              onChange={(event) => update("address", event.target.value)}
            />
          </label>
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            Detalle / cómo coordinar
            <input
              className={`${fieldClass} mt-1`}
              value={footer.addressHint}
              onChange={(event) => update("addressHint", event.target.value)}
            />
          </label>
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase sm:col-span-2">
            Enlace de Google Maps
            <input
              className={`${fieldClass} mt-1`}
              value={footer.mapUrl}
              onChange={(event) => update("mapUrl", event.target.value)}
            />
          </label>
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase sm:col-span-2">
            URL del mapa embebido (iframe)
            <input
              className={`${fieldClass} mt-1`}
              value={footer.mapEmbedUrl}
              onChange={(event) => update("mapEmbedUrl", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-dark/10 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-brand-dark">Horario</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            Horario
            <input
              className={`${fieldClass} mt-1`}
              value={footer.hours}
              onChange={(event) => update("hours", event.target.value)}
            />
          </label>
          <label className="text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
            Nota del horario
            <input
              className={`${fieldClass} mt-1`}
              value={footer.hoursHint}
              onChange={(event) => update("hoursHint", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-dark/10 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-brand-dark">
              Medios de pago
            </h2>
            <p className="mt-1 text-sm text-brand-dark/65">
              Sube el logo de Visa, Yape, Plin u otro. Si no hay imagen, se
              muestra la etiqueta.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setFooter((current) => ({
                ...current,
                paymentMethods: [
                  ...current.paymentMethods,
                  {
                    id: `pay_${Date.now()}`,
                    label: "Nuevo medio",
                    hint: "Pago",
                    image: "",
                  },
                ],
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-brand-primary/10 px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-primary/15"
          >
            <Plus className="h-4 w-4" />
            Agregar medio
          </button>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {footer.paymentMethods.map((method, index) => (
            <li
              key={method.id}
              className="rounded-2xl border border-brand-dark/10 bg-brand-gray/40 p-4"
            >
              <CmsImageField
                value={method.image}
                onChange={(image) => setPayment(index, { image })}
                label="Logo"
                previewClassName="h-20 w-full bg-white"
                objectFit="contain"
              />
              <label className="mt-3 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                Nombre
                <input
                  className={`${fieldClass} mt-1`}
                  value={method.label}
                  onChange={(event) =>
                    setPayment(index, { label: event.target.value })
                  }
                />
              </label>
              <label className="mt-2 block text-xs font-bold tracking-wide text-brand-dark/60 uppercase">
                Nota
                <input
                  className={`${fieldClass} mt-1`}
                  value={method.hint}
                  onChange={(event) =>
                    setPayment(index, { hint: event.target.value })
                  }
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  setFooter((current) => ({
                    ...current,
                    paymentMethods: current.paymentMethods.filter(
                      (_, i) => i !== index,
                    ),
                  }))
                }
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Quitar
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

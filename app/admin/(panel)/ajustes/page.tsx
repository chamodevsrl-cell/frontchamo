import Link from "next/link";
import { Headphones, PanelBottom } from "lucide-react";

const SECTIONS = [
  {
    href: "/admin/ajustes/footer",
    title: "Footer",
    body: "Frase, dirección, mapa, horario y logos de pago del pie de la tienda.",
    icon: PanelBottom,
  },
  {
    href: "/admin/ajustes/canales",
    title: "Canales de atención",
    body: "WhatsApp del botón flotante, teléfono para llamar, correo y redes sociales.",
    icon: Headphones,
  },
] as const;

export default function AdminAjustesPage() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {SECTIONS.map((section) => {
        const Icon = section.icon;
        return (
          <li key={section.href}>
            <Link
              href={section.href}
              className="flex h-full flex-col rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-[0_8px_24px_rgba(11,53,84,0.08)] transition hover:-translate-y-0.5 hover:border-brand-primary/40"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-brand-dark">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-brand-dark/65">{section.body}</p>
              <span className="mt-4 text-sm font-semibold text-brand-primary">
                Abrir
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

import Link from "next/link";
import AccountShell from "@/components/AccountShell";

export default function CuentaPedidosPage() {
  return (
    <AccountShell>
      <div className="rounded-2xl border border-brand-dark/10 bg-white p-8 text-center shadow-sm">
        <h2 className="font-display text-xl font-bold text-brand-dark">
          Mis pedidos
        </h2>
        <p className="mt-2 text-sm text-brand-dark/65">
          El historial de pedidos llega cuando el backend esté conectado. Mientras
          tanto puedes armar la cotización y enviarla por WhatsApp.
        </p>
        <Link
          href="/cotizar"
          className="mt-5 inline-flex rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Ir a cotizar
        </Link>
      </div>
    </AccountShell>
  );
}

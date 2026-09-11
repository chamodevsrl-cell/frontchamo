import {
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  UserPlus,
  Wallet,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import { adminSalesLast7Days, adminTopProducts } from "@/data/admin";
import { getDashboardKPIs } from "@/services/adminApi";
import type { DashboardKPIs } from "@/types/admin";

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function kpiCards(kpis: DashboardKPIs) {
  return [
    {
      key: "totalSales",
      label: "Ventas totales",
      value: soles(kpis.totalSales),
      hint: "Pedidos confirmados, enviados o entregados",
      icon: Wallet,
      tone: "up" as const,
    },
    {
      key: "pendingOrders",
      label: "Pedidos pendientes",
      value: String(kpis.pendingOrders),
      hint: "Estado pending",
      icon: ShoppingCart,
      tone: "up" as const,
    },
    {
      key: "lowStockCount",
      label: "Stock bajo",
      value: String(kpis.lowStockCount),
      hint: "stock ≤ minStock",
      icon: Warehouse,
      tone: "alert" as const,
    },
    {
      key: "newClientsCount",
      label: "Clientes nuevos",
      value: String(kpis.newClientsCount),
      hint: "Altas del periodo (mock)",
      icon: UserPlus,
      tone: "up" as const,
    },
  ];
}

export default async function AdminDashboardPage() {
  const kpis = await getDashboardKPIs();
  const cards = kpiCards(kpis);
  const maxSale = Math.max(...adminSalesLast7Days.map((day) => day.amount));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-dark sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-brand-dark/65">
          KPIs desde <code>getDashboardKPIs()</code> (mock 300 ms). La gráfica y
          el ranking siguen en <code>data/admin.ts</code> hasta que el backend
          los exponga.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((kpi) => {
          const Icon = kpi.icon;
          const alert = kpi.tone === "alert";
          return (
            <article
              key={kpi.key}
              className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-brand-dark/60">{kpi.label}</p>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    alert ? "bg-amber-100 text-red-600" : "bg-[#eef6fc] text-brand-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-brand-dark">
                {kpi.value}
              </p>
              {alert ? (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold tracking-wide text-red-700 uppercase">
                  <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.4} />
                  {kpi.hint}
                </span>
              ) : (
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <TrendingUp className="h-4 w-4" strokeWidth={2} />
                  {kpi.hint}
                </p>
              )}
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,1fr)]">
        <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold text-brand-dark">
            Ventas de los últimos 7 días
          </h2>
          <p className="mt-1 text-xs text-brand-dark/50">Demo local (S/) — no viene del mock API</p>
          <div
            className="mt-6 flex h-52 items-end gap-2 sm:gap-3"
            role="img"
            aria-label="Gráfica de ventas de los últimos 7 días"
          >
            {adminSalesLast7Days.map((day) => {
              const height = Math.max(8, Math.round((day.amount / maxSale) * 100));
              return (
                <div key={day.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-md bg-brand-primary"
                      style={{ height: `${height}%` }}
                      title={`S/ ${day.amount.toLocaleString("es-PE")}`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-brand-dark/60">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold text-brand-dark">
            Productos más vendidos
          </h2>
          <p className="mt-1 text-xs text-brand-dark/50">Unidades de ejemplo — demo local</p>
          <ul className="mt-4 divide-y divide-brand-dark/8">
            {adminTopProducts.map((product) => (
              <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Image
                  src={product.image}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-dark">
                    {product.name}
                  </p>
                  <p className="text-xs text-brand-dark/50">
                    {product.brand} · {product.sku}
                  </p>
                </div>
                <span className="shrink-0 font-display text-sm font-bold text-brand-primary">
                  {product.unitsSold} uds
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

import { getDashboardKPIs, getProducts } from "@/services/adminApi";
import { adminSalesLast7Days } from "@/data/admin";

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function AdminReportesPage() {
  const [kpis, products] = await Promise.all([getDashboardKPIs(), getProducts()]);
  const maxSale = Math.max(...adminSalesLast7Days.map((day) => day.amount));

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-dark/65">
        Analítica operativa · KPIs de <code>getDashboardKPIs()</code>. La gráfica de 7
        días sigue en <code>data/admin.ts</code>.
      </p>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-dark/55">Ventas</p>
          <p className="mt-2 font-display text-2xl font-bold">{soles(kpis.totalSales)}</p>
        </article>
        <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-dark/55">Pendientes</p>
          <p className="mt-2 font-display text-2xl font-bold">{kpis.pendingOrders}</p>
        </article>
        <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-dark/55">Stock bajo</p>
          <p className="mt-2 font-display text-2xl font-bold">{kpis.lowStockCount}</p>
        </article>
        <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-brand-dark/55">SKUs</p>
          <p className="mt-2 font-display text-2xl font-bold">{products.length}</p>
        </article>
      </section>
      <article className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold">Ventas 7 días (demo)</h2>
        <div className="mt-6 flex h-40 items-end gap-2">
          {adminSalesLast7Days.map((day) => {
            const height = Math.max(8, Math.round((day.amount / maxSale) * 100));
            return (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-md bg-brand-primary"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-brand-dark/60">{day.label}</span>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/app/admin/actions";
import type { Order, OrderStatus } from "@/types/admin";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminOrdersTable({
  orders,
  statusFilter,
}: {
  orders: Order[];
  statusFilter: string;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  function changeFilter(next: string) {
    const url = next === "all" ? "/admin/pedidos" : `/admin/pedidos?status=${next}`;
    router.push(url);
  }

  async function changeStatus(orderId: string, newStatus: OrderStatus) {
    setError("");
    setPendingId(orderId);
    try {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      startTransition(() => {
        router.refresh();
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar el pedido.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-brand-dark/65">
          Mock <code>getOrders()</code> / <code>updateOrderStatus()</code>
        </p>
        <label className="text-sm font-semibold">
          Estado
          <select
            className="ml-2 rounded-lg border border-brand-dark/15 px-3 py-2 font-normal"
            value={statusFilter}
            onChange={(event) => changeFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {/* Móvil / tablet: cards (la tabla no entra en pantallas angostas) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-brand-dark/10 bg-white px-4 py-8 text-center text-sm text-brand-dark/55 shadow-sm sm:col-span-2">
            No hay pedidos con ese filtro.
          </p>
        ) : (
          orders.map((order) => (
            <article
              key={order.id}
              className="flex flex-col gap-3 rounded-2xl border border-brand-dark/10 border-l-4 border-l-brand-primary bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-brand-dark">{order.orderNumber}</p>
                  <p className="text-xs text-brand-dark/50">
                    {order.items.length} línea{order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="shrink-0 font-display text-lg font-bold text-brand-dark">
                  {soles(order.total)}
                </p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-brand-dark">{order.clientName}</p>
                <p className="text-xs text-brand-dark/50">{order.clientPhone}</p>
              </div>
              <p className="text-xs text-brand-dark/60 uppercase">
                {order.paymentMethod} · {order.shippingMethod}
              </p>
              <label className="mt-auto flex items-center gap-2 border-t border-brand-dark/8 pt-3 text-xs font-semibold text-brand-dark/60 uppercase">
                Estado
                <select
                  disabled={pendingId === order.id}
                  value={order.status}
                  onChange={(event) =>
                    void changeStatus(order.id, event.target.value as OrderStatus)
                  }
                  className="min-w-0 flex-1 rounded-lg border border-brand-dark/15 px-2 py-2 text-sm font-normal text-brand-dark normal-case"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white shadow-sm lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0B3554] text-xs font-semibold tracking-wide text-white uppercase">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Pago / envío</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-dark/55">
                  No hay pedidos con ese filtro.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-brand-dark/50">
                      {order.items.length} línea{order.items.length === 1 ? "" : "s"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{order.clientName}</p>
                    <p className="text-xs text-brand-dark/50">{order.clientPhone}</p>
                  </td>
                  <td className="px-4 py-3 font-display font-bold">{soles(order.total)}</td>
                  <td className="px-4 py-3 text-xs uppercase">
                    {order.paymentMethod} · {order.shippingMethod}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      disabled={pendingId === order.id}
                      value={order.status}
                      onChange={(event) =>
                        void changeStatus(order.id, event.target.value as OrderStatus)
                      }
                      className="rounded-lg border border-brand-dark/15 px-2 py-1 text-sm"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

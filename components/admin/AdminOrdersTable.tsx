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
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Pedidos</h1>
          <p className="mt-1 text-sm text-brand-dark/65">
            Mock <code>getOrders()</code> / <code>updateOrderStatus()</code>
          </p>
        </div>
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

      <div className="overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white shadow-sm">
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

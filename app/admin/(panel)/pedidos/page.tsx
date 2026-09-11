import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import { getOrders } from "@/services/adminApi";
import type { OrderStatus } from "@/types/admin";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const raw = firstParam(params.status) || "all";
  const statusFilter = isOrderStatus(raw) ? raw : "all";
  const orders = await getOrders(statusFilter);
  return <AdminOrdersTable orders={orders} statusFilter={statusFilter} />;
}

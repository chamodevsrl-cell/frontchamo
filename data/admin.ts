import { featuredProducts } from "@/data/products";

/** Cifras de ejemplo para el diseño del panel (aún no hay backend). */
export const adminKpis = [
  {
    id: "products",
    label: "Total productos",
    value: "1,248",
    delta: "+12%",
    tone: "up" as const,
  },
  {
    id: "orders",
    label: "Pedidos hoy",
    value: "32",
    delta: "+8%",
    tone: "up" as const,
  },
  {
    id: "sales",
    label: "Ventas del mes",
    value: "S/ 24,580",
    delta: "+15%",
    tone: "up" as const,
  },
  {
    id: "low-stock",
    label: "Stock bajo",
    value: "18",
    delta: "Alerta",
    tone: "alert" as const,
  },
] as const;

export const adminSalesLast7Days = [
  { label: "Lun", amount: 2800 },
  { label: "Mar", amount: 3200 },
  { label: "Mié", amount: 4100 },
  { label: "Jue", amount: 3600 },
  { label: "Vie", amount: 5200 },
  { label: "Sáb", amount: 4700 },
  { label: "Dom", amount: 3100 },
] as const;

const DEMO_UNITS = [186, 142, 128, 97, 81] as const;

export const adminTopProducts = featuredProducts.slice(0, 5).map((product, index) => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  sku: product.sku,
  image: product.images[0],
  unitsSold: DEMO_UNITS[index] ?? 40,
}));

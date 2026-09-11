import { featuredProducts } from "@/data/products";

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

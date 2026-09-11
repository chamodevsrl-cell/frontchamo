/**
 * Cliente mock del Panel Admin.
 *
 * Cada función exportada simula un round-trip HTTP (300 ms) y documenta la
 * ruta real que el backend debe exponer. Cuando exista API, reemplazar el
 * cuerpo por `fetch('/api/v1/...')` manteniendo la misma firma.
 *
 * Credenciales de demo (NO son datos oficiales de Chamo Import):
 *   email:    admin@local.test
 *   password: admin123
 */

import { featuredProducts } from "@/data/products";
import { mainCategories } from "@/data/home";
import type {
  AuthSession,
  CreateProductInput,
  DashboardKPIs,
  LoginCredentials,
  Order,
  OrderStatus,
  Product,
  ProductFilters,
} from "@/types/admin";

/** Latencia artificial para emular red. No usar en `getAdminSession()`. */
export const MOCK_NETWORK_DELAY_MS = 300;

/** Usuario de prueba del mock. No usar correos de la empresa. */
export const MOCK_ADMIN_EMAIL = "admin@local.test";
export const MOCK_ADMIN_PASSWORD = "admin123";

export class AdminApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.code = code;
  }
}

function delay(ms: number = MOCK_NETWORK_DELAY_MS) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function shortDescription(text: string) {
  const trimmed = text.trim();
  if (trimmed.length <= 140) return trimmed;
  return `${trimmed.slice(0, 137).trimEnd()}…`;
}

function seedProducts(): Product[] {
  return featuredProducts.map((item, index) => {
    const lowStock = index % 7 === 0;
    const stock = lowStock ? 4 : item.stock;
    const minStock = 10;
    const status: Product["status"] =
      item.badge === "oferta" && index > 18 ? "draft" : "active";
    return {
      id: item.id,
      sku: item.sku,
      name: item.name,
      brand: item.brand,
      categoryId: item.category,
      subcategoryId: `${item.category}-general`,
      price: item.price,
      stock,
      minStock,
      status,
      images: item.images,
      descriptionShort: shortDescription(item.description),
      descriptionFull: item.description,
      isFeatured: item.badge === "destacado" || index < 3,
      createdAt: `2026-08-${String(10 + (index % 18)).padStart(2, "0")}T12:00:00.000Z`,
    };
  });
}

function seedOrders(products: Product[]): Order[] {
  const p0 = products[0];
  const p1 = products[1];
  const p2 = products[2];
  const p3 = products[3];
  if (!p0 || !p1 || !p2 || !p3) return [];

  const lines = (
    items: { product: Product; quantity: number }[],
  ): Order["items"] =>
    items.map(({ product, quantity }) => ({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity,
      unitPrice: product.price,
    }));

  const totalOf = (items: Order["items"]) =>
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const orderAItems = lines([
    { product: p0, quantity: 12 },
    { product: p1, quantity: 6 },
  ]);
  const orderBItems = lines([{ product: p2, quantity: 24 }]);
  const orderCItems = lines([
    { product: p3, quantity: 8 },
    { product: p0, quantity: 4 },
  ]);
  const orderDItems = lines([{ product: p1, quantity: 18 }]);

  return [
    {
      id: "ord_pending_1",
      orderNumber: "CI-2026-00041",
      clientName: "Ferretería Los Andes S.A.C. (demo)",
      clientPhone: "+51 900 000 001",
      clientEmail: "compras.demo1@local.test",
      address: "Av. Ejemplo 120, Lima",
      status: "pending",
      items: orderAItems,
      total: totalOf(orderAItems),
      createdAt: "2026-09-10T14:20:00.000Z",
      paymentMethod: "yape",
      shippingMethod: "lima",
    },
    {
      id: "ord_pending_2",
      orderNumber: "CI-2026-00042",
      clientName: "Distribuidora Norte (demo)",
      clientPhone: "+51 900 000 002",
      clientEmail: "compras.demo2@local.test",
      address: "Recojo en almacén",
      status: "pending",
      items: orderBItems,
      total: totalOf(orderBItems),
      createdAt: "2026-09-11T09:05:00.000Z",
      paymentMethod: "transfer",
      shippingMethod: "pickup",
    },
    {
      id: "ord_shipped_1",
      orderNumber: "CI-2026-00038",
      clientName: "Obra Sur (demo)",
      clientPhone: "+51 900 000 003",
      clientEmail: "obra.demo@local.test",
      address: "Calle Ficticia 450, Arequipa",
      status: "shipped",
      items: orderCItems,
      total: totalOf(orderCItems),
      createdAt: "2026-09-08T16:40:00.000Z",
      paymentMethod: "plin",
      shippingMethod: "provinces",
    },
    {
      id: "ord_delivered_1",
      orderNumber: "CI-2026-00035",
      clientName: "Mayorista Central (demo)",
      clientPhone: "+51 900 000 004",
      clientEmail: "mayorista.demo@local.test",
      address: "Jr. Demo 88, Lima",
      status: "delivered",
      items: orderDItems,
      total: totalOf(orderDItems),
      createdAt: "2026-09-05T11:10:00.000Z",
      paymentMethod: "card",
      shippingMethod: "lima",
    },
  ];
}

const productsDb: Product[] = seedProducts();
const ordersDb: Order[] = seedOrders(productsDb);

const MOCK_SESSION: AuthSession = {
  id: "usr_admin_local",
  name: "Admin Demo",
  email: MOCK_ADMIN_EMAIL,
  role: "admin",
  token: "mock.jwt.admin-local-test",
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * POST /api/v1/auth/login
 * Body: `{ email, password }`
 */
export async function loginAdmin(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/auth/login')
  await delay();
  const email = normalizeEmail(credentials.email);
  const password = credentials.password ?? "";
  if (email !== MOCK_ADMIN_EMAIL || password !== MOCK_ADMIN_PASSWORD) {
    throw new AdminApiError(
      "INVALID_CREDENTIALS",
      "Correo o contraseña incorrectos. En el mock usa admin@local.test / admin123.",
    );
  }
  return { ...MOCK_SESSION };
}

/**
 * GET /api/v1/dashboard/kpis
 */
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/dashboard/kpis')
  await delay();
  const deliveredOrConfirmed = ordersDb.filter(
    (order) =>
      order.status === "delivered" ||
      order.status === "confirmed" ||
      order.status === "shipped",
  );
  return {
    totalSales: deliveredOrConfirmed.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: ordersDb.filter((order) => order.status === "pending").length,
    lowStockCount: productsDb.filter(
      (product) => product.status !== "archived" && product.stock <= product.minStock,
    ).length,
    newClientsCount: 6,
  };
}

/**
 * GET /api/v1/products
 * Query: `q`, `categoryId`, `status`, `brand`
 */
export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/products')
  await delay();
  const q = filters.q?.trim().toLowerCase() ?? "";
  const brand = filters.brand?.trim().toLowerCase() ?? "";
  return productsDb.filter((product) => {
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
    if (filters.status && product.status !== filters.status) return false;
    if (brand && product.brand.toLowerCase() !== brand) return false;
    if (!q) return true;
    return (
      product.sku.toLowerCase().includes(q) ||
      product.name.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q)
    );
  });
}

/**
 * POST /api/v1/products
 * Body: {@link CreateProductInput}
 */
export async function createProduct(
  productData: CreateProductInput,
): Promise<Product> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/products')
  await delay();
  const sku = productData.sku.trim();
  if (!sku || !productData.name.trim()) {
    throw new AdminApiError("VALIDATION", "SKU y nombre son obligatorios.");
  }
  if (productsDb.some((product) => product.sku.toLowerCase() === sku.toLowerCase())) {
    throw new AdminApiError("CONFLICT", `Ya existe un producto con SKU ${sku}.`);
  }
  const created: Product = {
    ...productData,
    sku,
    name: productData.name.trim(),
    brand: productData.brand.trim(),
    images: productData.images.length > 0 ? productData.images : ["/logo.png"],
    id: newId("prd"),
    createdAt: new Date().toISOString(),
  };
  productsDb.unshift(created);
  return created;
}

/**
 * GET /api/v1/orders
 * Query: `status` (opcional)
 */
export async function getOrders(
  statusFilter?: OrderStatus | "all",
): Promise<Order[]> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/orders')
  await delay();
  if (!statusFilter || statusFilter === "all") {
    return [...ordersDb];
  }
  return ordersDb.filter((order) => order.status === statusFilter);
}

/**
 * PUT /api/v1/orders/:orderId/status
 * Body: `{ status }`
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<Order> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/orders/:id/status')
  await delay();
  const order = ordersDb.find((item) => item.id === orderId);
  if (!order) {
    throw new AdminApiError("NOT_FOUND", `No existe el pedido ${orderId}.`);
  }
  order.status = newStatus;
  return { ...order, items: [...order.items] };
}

/** Listado de categorías del mock (útil para el alta de producto). No es endpoint pedido, pero reutiliza `mainCategories`. */
export function listMockCategories() {
  return mainCategories.map((category) => ({
    id: category.slug,
    name: category.label,
    image: category.image,
  }));
}

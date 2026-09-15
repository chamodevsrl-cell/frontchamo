/**
 * Cliente mock del Panel Admin.
 *
 * Cada función exportada simula un round-trip HTTP (300 ms) y documenta la
 * ruta real que el backend debe exponer. Cuando exista API, reemplazar el
 * cuerpo por `fetch('/api/v1/...')` manteniendo la misma firma.
 *
 * Credenciales de demo (NO son datos oficiales de Chamo Import).
 * `loginAdmin()` valida contra `usersDb` + contraseñas en memoria.
 *   THE WINTER / Criper@11  (también thewinter@local.test)
 *   admin@local.test / admin123
 */

import { featuredProducts } from "@/data/products";
import { mainCategories } from "@/data/home";
import { slugifyLabel, uniqueCategorySlug } from "@/lib/cms";
import type {
  AdminPermission,
  AuthSession,
  Category,
  CreateCategoryInput,
  CreatePanelRoleInput,
  CreatePanelUserInput,
  CreateProductInput,
  DashboardKPIs,
  LoginCredentials,
  Order,
  OrderStatus,
  PanelRole,
  PanelUser,
  PanelUserStatus,
  Product,
  ProductFilters,
  UpdateCategoryInput,
} from "@/types/admin";

/** Latencia artificial para emular red. No usar en `getAdminSession()`. */
export const MOCK_NETWORK_DELAY_MS = 300;

/** Usuario de prueba del mock. No usar correos de la empresa. */
export const MOCK_ADMIN_EMAIL = "admin@local.test";
export const MOCK_ADMIN_PASSWORD = "admin123";

/** Cuenta staff pedida para entrar al dashboard (rol Administrador). */
export const MOCK_WINTER_NAME = "THE WINTER";
export const MOCK_WINTER_EMAIL = "thewinter@local.test";
export const MOCK_WINTER_PASSWORD = "Criper@11";

const MOCK_EDITOR_PASSWORD = "editor123";
const MOCK_ALMACEN_PASSWORD = "almacen123";

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
      specs: item.specs,
      createdAt: `2026-08-${String(10 + (index % 18)).padStart(2, "0")}T12:00:00.000Z`,
    };
  });
}

function seedCategories(): Category[] {
  return mainCategories.map((category) => ({
    id: category.slug,
    name: category.label,
    subcategoriesCount: 0,
    status: "active",
    image: category.image,
    description: category.eyebrow,
  }));
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

const ALL_PERMISSIONS: AdminPermission[] = [
  "dashboard",
  "productos",
  "categorias",
  "marcas",
  "pedidos",
  "clientes",
  "inventario",
  "ofertas",
  "banners",
  "reportes",
  "usuarios",
  "roles",
  "configuracion",
];

function seedRoles(): PanelRole[] {
  return [
    {
      id: "role_admin",
      name: "Administrador",
      description: "Acceso total al panel, incluyendo Usuarios y Roles.",
      permissions: [...ALL_PERMISSIONS],
      isSystem: true,
      createdAt: "2026-09-11T12:00:00.000Z",
    },
    {
      id: "role_editor",
      name: "Editor",
      description: "Gestiona catálogo y pedidos, sin acceso a Usuarios/Roles.",
      permissions: [
        "dashboard",
        "productos",
        "categorias",
        "marcas",
        "pedidos",
        "ofertas",
        "banners",
      ],
      isSystem: true,
      createdAt: "2026-09-11T12:00:00.000Z",
    },
    {
      id: "role_almacen",
      name: "Almacén",
      description: "Solo inventario y pedidos, para el equipo de despacho.",
      permissions: ["dashboard", "inventario", "pedidos"],
      isSystem: false,
      createdAt: "2026-09-15T09:00:00.000Z",
    },
  ];
}

function seedUsers(): PanelUser[] {
  return [
    {
      id: "usr_winter",
      name: MOCK_WINTER_NAME,
      email: MOCK_WINTER_EMAIL,
      roleId: "role_admin",
      status: "active",
      createdAt: "2026-09-15T10:00:00.000Z",
      lastLoginAt: null,
    },
    {
      id: "usr_admin_local",
      name: "Admin Demo",
      email: MOCK_ADMIN_EMAIL,
      roleId: "role_admin",
      status: "active",
      createdAt: "2026-09-11T12:00:00.000Z",
      lastLoginAt: "2026-09-15T08:30:00.000Z",
    },
    {
      id: "usr_editor_demo",
      name: "Katia Ríos (demo)",
      email: "katia.demo@local.test",
      roleId: "role_editor",
      status: "active",
      createdAt: "2026-09-12T15:00:00.000Z",
      lastLoginAt: "2026-09-14T19:10:00.000Z",
    },
    {
      id: "usr_almacen_demo",
      name: "Julio Paredes (demo)",
      email: "julio.demo@local.test",
      roleId: "role_almacen",
      status: "suspended",
      createdAt: "2026-09-13T10:00:00.000Z",
      lastLoginAt: null,
    },
  ];
}

const productsDb: Product[] = seedProducts();
const ordersDb: Order[] = seedOrders(productsDb);
const categoriesDb: Category[] = seedCategories();
const rolesDb: PanelRole[] = seedRoles();
const usersDb: PanelUser[] = seedUsers();

/** Contraseñas del mock. Nunca viajan en {@link PanelUser} ni en la sesión. */
const passwordsByUserId = new Map<string, string>([
  ["usr_winter", MOCK_WINTER_PASSWORD],
  ["usr_admin_local", MOCK_ADMIN_PASSWORD],
  ["usr_editor_demo", MOCK_EDITOR_PASSWORD],
  ["usr_almacen_demo", MOCK_ALMACEN_PASSWORD],
]);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sessionRoleFromPermissions(permissions: AdminPermission[]): AuthSession["role"] {
  if (permissions.includes("usuarios") && permissions.includes("roles")) {
    return "admin";
  }
  return "editor";
}

function buildSession(user: PanelUser, role: PanelRole): AuthSession {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: sessionRoleFromPermissions(role.permissions),
    roleId: role.id,
    permissions: [...role.permissions],
    token: `mock.jwt.${user.id}`,
  };
}

function findUserByLogin(identifier: string): PanelUser | undefined {
  const trimmed = identifier.trim();
  if (!trimmed) return undefined;
  const email = normalizeEmail(trimmed);
  return usersDb.find(
    (user) =>
      user.email.toLowerCase() === email ||
      user.name.toLowerCase() === trimmed.toLowerCase(),
  );
}

/**
 * POST /api/v1/auth/login
 * Body: `{ email, password }` — `email` acepta correo o nombre del PanelUser.
 */
export async function loginAdmin(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/auth/login')
  await delay();
  const password = credentials.password ?? "";
  const user = findUserByLogin(credentials.email);
  const expectedPassword = user ? passwordsByUserId.get(user.id) : undefined;
  if (!user || expectedPassword === undefined || expectedPassword !== password) {
    throw new AdminApiError(
      "INVALID_CREDENTIALS",
      "Usuario o contraseña incorrectos.",
    );
  }
  if (user.status === "suspended") {
    throw new AdminApiError(
      "FORBIDDEN",
      "Esta cuenta está suspendida. Un administrador debe reactivarla.",
    );
  }
  const role = rolesDb.find((item) => item.id === user.roleId);
  if (!role) {
    throw new AdminApiError("FORBIDDEN", "El rol de esta cuenta ya no existe.");
  }
  user.lastLoginAt = new Date().toISOString();
  return buildSession(user, role);
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

/**
 * GET /api/v1/categories
 *
 * Reutiliza `mainCategories` (la tienda) como árbol comercial del panel — el
 * mock no distingue las dos todavía. `subcategoriesCount` queda en 0 porque
 * `MainCategory` no modela subcategorías; el backend real sí debería contarlas.
 */
export async function getCategories(): Promise<Category[]> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/categories')
  await delay();
  return categoriesDb.map((category) => ({ ...category }));
}

/**
 * POST /api/v1/categories
 * Body: {@link CreateCategoryInput}
 */
export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/categories')
  await delay();
  const name = input.name.trim();
  if (!name) {
    throw new AdminApiError("VALIDATION", "El nombre de la categoría es obligatorio.");
  }
  const taken = categoriesDb.map((item) => item.id);
  const requested = input.id?.trim() || slugifyLabel(name);
  const id = taken.includes(requested)
    ? uniqueCategorySlug(requested, taken)
    : requested;
  const created: Category = {
    id,
    name,
    description: input.description.trim(),
    image: input.image.trim() || "/images/categorias/herramientas.jpg",
    subcategoriesCount: 0,
    status: "active",
  };
  categoriesDb.push(created);
  return { ...created };
}

/**
 * PUT /api/v1/categories/:id
 * Body: {@link UpdateCategoryInput}
 */
export async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/categories/:id')
  await delay();
  const category = categoriesDb.find((item) => item.id === categoryId);
  if (!category) {
    throw new AdminApiError("NOT_FOUND", `No existe la categoría ${categoryId}.`);
  }
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (name) category.name = name;
  }
  if (input.description !== undefined) {
    category.description = input.description.trim();
  }
  if (input.image !== undefined) {
    const image = input.image.trim();
    if (image) category.image = image;
  }
  if (input.status !== undefined) {
    category.status = input.status;
  }
  return { ...category };
}

/**
 * GET /api/v1/roles
 */
export async function getRoles(): Promise<PanelRole[]> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/roles')
  await delay();
  return [...rolesDb];
}

/**
 * POST /api/v1/roles
 * Body: {@link CreatePanelRoleInput}
 */
export async function createRole(input: CreatePanelRoleInput): Promise<PanelRole> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/roles')
  await delay();
  const name = input.name.trim();
  if (!name) {
    throw new AdminApiError("VALIDATION", "El nombre del rol es obligatorio.");
  }
  if (rolesDb.some((role) => role.name.toLowerCase() === name.toLowerCase())) {
    throw new AdminApiError("CONFLICT", `Ya existe un rol llamado ${name}.`);
  }
  const created: PanelRole = {
    id: newId("role"),
    name,
    description: input.description.trim(),
    permissions: input.permissions,
    isSystem: false,
    createdAt: new Date().toISOString(),
  };
  rolesDb.push(created);
  return created;
}

/**
 * GET /api/v1/users
 */
export async function getUsers(): Promise<PanelUser[]> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/users')
  await delay();
  return [...usersDb];
}

/**
 * POST /api/v1/users
 * Body: {@link CreatePanelUserInput}
 */
export async function createUser(input: CreatePanelUserInput): Promise<PanelUser> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/users')
  await delay();
  const email = normalizeEmail(input.email);
  const name = input.name.trim();
  const password = input.password ?? "";
  if (!name || !email) {
    throw new AdminApiError("VALIDATION", "Nombre y correo son obligatorios.");
  }
  if (password.length < 6) {
    throw new AdminApiError(
      "VALIDATION",
      "La contraseña debe tener al menos 6 caracteres.",
    );
  }
  if (usersDb.some((user) => user.email.toLowerCase() === email)) {
    throw new AdminApiError("CONFLICT", `Ya existe un usuario con correo ${email}.`);
  }
  if (usersDb.some((user) => user.name.toLowerCase() === name.toLowerCase())) {
    throw new AdminApiError("CONFLICT", `Ya existe un usuario llamado ${name}.`);
  }
  if (!rolesDb.some((role) => role.id === input.roleId)) {
    throw new AdminApiError("VALIDATION", "El rol seleccionado no existe.");
  }
  const created: PanelUser = {
    id: newId("usr"),
    name,
    email,
    roleId: input.roleId,
    status: "active",
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };
  usersDb.push(created);
  passwordsByUserId.set(created.id, password);
  return created;
}

/**
 * PUT /api/v1/users/:userId/status
 * Body: `{ status }`
 */
export async function updateUserStatus(
  userId: string,
  status: PanelUserStatus,
): Promise<PanelUser> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/users/:id/status')
  await delay();
  const user = usersDb.find((item) => item.id === userId);
  if (!user) {
    throw new AdminApiError("NOT_FOUND", `No existe el usuario ${userId}.`);
  }
  user.status = status;
  return { ...user };
}

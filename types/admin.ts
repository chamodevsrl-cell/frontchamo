/**
 * Contrato de datos del Panel Admin de Chamo Import S.R.L.
 *
 * Estas interfaces son la forma que el front espera del backend (`/api/v1/...`).
 * No mezclar con `FeaturedProduct` (`data/products.ts`) ni con `AuthUser`
 * (`lib/auth-local.ts`): esos tipos pertenecen a la tienda pública.
 *
 * Fuente de verdad HTTP: `API_CONTRACT.md` en la raíz del repo.
 */

/** Rol del usuario del panel. El mock actual solo emite `admin`. */
export type AdminRole = "admin" | "editor";

/** Estado de publicación de un SKU en el catálogo admin. */
export type ProductStatus = "active" | "draft" | "archived";

/** Estado de visibilidad de una categoría. */
export type CategoryStatus = "active" | "hidden";

/** Ciclo de vida de un pedido mayorista. */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/** Medio de pago informado en el pedido (valores de ejemplo del mock). */
export type PaymentMethod = "yape" | "plin" | "transfer" | "cash" | "card";

/** Modalidad de despacho informada en el pedido. */
export type ShippingMethod = "pickup" | "lima" | "provinces";

/**
 * Usuario del panel (sin credenciales).
 * El token de sesión vive en {@link AuthSession}, no aquí.
 */
export interface User {
  /** Identificador estable del usuario (UUID del backend). */
  id: string;
  /** Nombre para mostrar en el header del panel. */
  name: string;
  /** Correo de acceso. En el mock es `admin@local.test` (no es un correo oficial). */
  email: string;
  /** Permiso dentro del panel (`admin` | `editor`). */
  role: AdminRole;
}

/**
 * Sesión autenticada del panel: el usuario más el token que viaja en cookie
 * y, en el mock, también en `localStorage`.
 */
export interface AuthSession {
  /** Identificador estable del usuario (UUID del backend). */
  id: string;
  /** Nombre para mostrar en el header del panel. */
  name: string;
  /** Correo de acceso. En el mock es `admin@local.test`. */
  email: string;
  /** Permiso dentro del panel (`admin` | `editor`). */
  role: AdminRole;
  /**
   * Token opaco de sesión. El front lo guarda en la cookie `chamo_admin_session`.
   * En producción el backend debería emitirlo como JWT/sesión httpOnly.
   */
  token: string;
}

/** Credenciales que envía el formulario de `/admin/login`. */
export interface LoginCredentials {
  /** Correo normalizado (trim + minúsculas en el cliente). */
  email: string;
  /** Contraseña en texto plano. Nunca loguear este campo. */
  password: string;
}

/**
 * Producto del catálogo admin.
 * Independiente de `FeaturedProduct` de la tienda: el backend puede mapear
 * ambos desde la misma tabla, pero el panel necesita estos campos de gestión.
 */
export interface Product {
  /** Identificador estable del SKU (UUID o id interno). */
  id: string;
  /** Código de inventario visible (único). */
  sku: string;
  /** Nombre comercial. */
  name: string;
  /** Marca / fabricante. */
  brand: string;
  /** Id de la categoría padre (no el slug de la tienda, aunque el mock reutiliza el slug). */
  categoryId: string;
  /** Id de la subcategoría. Vacío (`""`) si el SKU no tiene subcategoría. */
  subcategoryId: string;
  /** Precio unitario en soles (número, no string formateado). */
  price: number;
  /** Unidades disponibles. */
  stock: number;
  /** Umbral a partir del cual el dashboard cuenta el SKU como stock bajo. */
  minStock: number;
  /** `active` visible, `draft` oculto, `archived` fuera de catálogo. */
  status: ProductStatus;
  /** URLs de galería. `images[0]` es la imagen principal. */
  images: string[];
  /** Resumen corto para listados (1–2 frases). */
  descriptionShort: string;
  /** Descripción completa / ficha larga. */
  descriptionFull: string;
  /** Si aparece en destacados / home. */
  isFeatured: boolean;
  /** ISO-8601 de alta (`2026-09-11T18:00:00.000Z`). */
  createdAt: string;
}

/** Filtros opcionales de `GET /api/v1/products`. */
export interface ProductFilters {
  /** Texto libre: sku, nombre o marca. */
  q?: string;
  /** Restringe a una categoría. */
  categoryId?: string;
  /** Restringe por estado de publicación. */
  status?: ProductStatus;
  /** Restringe por marca (coincidencia exacta, case-insensitive en el mock). */
  brand?: string;
}

/** Payload de alta. El backend asigna `id` y `createdAt`. */
export type CreateProductInput = Omit<Product, "id" | "createdAt">;

/**
 * Categoría del panel (árbol comercial).
 * El CMS local de banners (`chamo-cms-v1`) es otra capa; no confundir.
 */
export interface Category {
  /** Identificador estable. En el mock coincide con el slug de `mainCategories`. */
  id: string;
  /** Nombre visible (p. ej. Ferretería). */
  name: string;
  /** Cantidad de subcategorías colgando de esta línea. */
  subcategoriesCount: number;
  /** `active` se lista en la tienda; `hidden` no. */
  status: CategoryStatus;
  /** URL de la imagen de portada. */
  image: string;
}

/** Línea de un pedido. */
export interface OrderItem {
  /** Id del producto. */
  productId: string;
  /** SKU al momento del pedido (denormalizado). */
  sku: string;
  /** Nombre al momento del pedido (denormalizado). */
  name: string;
  /** Unidades pedidas. */
  quantity: number;
  /** Precio unitario acordado en soles. */
  unitPrice: number;
}

/**
 * Pedido / cotización mayorista gestionado desde el panel.
 */
export interface Order {
  /** Identificador interno. */
  id: string;
  /** Número visible para el cliente (p. ej. `CI-2026-00041`). */
  orderNumber: string;
  /** Nombre o razón social del comprador. */
  clientName: string;
  /** Teléfono de contacto (formato libre, p. ej. `+51 959 000 000`). */
  clientPhone: string;
  /** Correo del comprador. */
  clientEmail: string;
  /** Dirección de entrega o `Recojo en almacén` si es pickup. */
  address: string;
  /** Estado actual del ciclo de vida. */
  status: OrderStatus;
  /** Líneas del pedido. */
  items: OrderItem[];
  /** Total en soles (suma de `quantity * unitPrice`). */
  total: number;
  /** ISO-8601 de creación. */
  createdAt: string;
  /** Medio de pago informado. */
  paymentMethod: PaymentMethod;
  /** Modalidad de envío. */
  shippingMethod: ShippingMethod;
}

/**
 * Indicadores del dashboard. El front pinta estas 4 cifras 1:1;
 * la gráfica de 7 días y el ranking de SKUs siguen siendo demo local
 * (`data/admin.ts`) hasta que el backend exponga esos endpoints.
 */
export interface DashboardKPIs {
  /** Ventas acumuladas del periodo (soles). */
  totalSales: number;
  /** Pedidos en estado `pending`. */
  pendingOrders: number;
  /** SKUs con `stock <= minStock`. */
  lowStockCount: number;
  /** Clientes dados de alta en el periodo. */
  newClientsCount: number;
}

/** Sobre JSON de éxito que debe devolver el backend. */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

/** Sobre JSON de error que debe devolver el backend. */
export interface ApiErrorBody {
  ok: false;
  error: {
    /** Código estable para ramificar en el front (`UNAUTHORIZED`, `VALIDATION`, …). */
    code: string;
    /** Mensaje legible en español. */
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;

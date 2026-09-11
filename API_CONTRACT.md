# Contrato HTTP — Panel Admin (Chamo Import S.R.L.)

Documento de handover para el desarrollador **Backend**. El front del panel
hoy no llama a estos endpoints: consume `services/adminApi.ts` (mock con
promesas y **300 ms** de latencia). Cada función de ese archivo tiene un
comentario `// TODO Backend: Reemplazar mock con fetch('/api/v1/...')`.

Tipos TypeScript 1:1: [`types/admin.ts`](./types/admin.ts).

Base URL sugerida: **`/api/v1`** (mismo origen). Autenticación: header

```
Authorization: Bearer <token>
```

más cookie `chamo_admin_session` (el mock la escribe en el navegador; en
producción debe ser **httpOnly + Secure + SameSite=Lax**, emitida por el
login).

## Sobre JSON

Éxito:

```json
{
  "ok": true,
  "data": {}
}
```

Error:

```json
{
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Sesión inválida o expirada"
  }
}
```

Códigos estables: `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION`, `NOT_FOUND`,
`CONFLICT`, `INVALID_CREDENTIALS`.

---

## Mock actual (solo front)

| Campo | Valor |
| --- | --- |
| Correo | `admin@local.test` |
| Contraseña | `admin123` |
| Token de ejemplo | `mock.jwt.admin-local-test` |

**No es una cuenta oficial de Chamo Import.** No usar correos de la empresa
en el mock. Cuando el login real exista, borrar estas credenciales del front.

Sesión del panel ≠ cuentas de la tienda (`lib/auth-local.ts` /
`chamo-accounts-v1`).

---

## Auth

### `POST /api/v1/auth/login`

Front: `loginAdmin(credentials)`.

**Body**

```json
{
  "email": "admin@local.test",
  "password": "admin123"
}
```

**Respuesta `200`**

```json
{
  "ok": true,
  "data": {
    "id": "usr_…",
    "name": "Admin Demo",
    "email": "admin@local.test",
    "role": "admin",
    "token": "eyJhbGciOi…"
  }
}
```

También enviar `Set-Cookie: chamo_admin_session=…` (httpOnly). Roles:
`admin` | `editor`.

**Errores:** `401 INVALID_CREDENTIALS`.

### `POST /api/v1/auth/logout`

Front: `logoutAdmin()`. Invalida el token y borra la cookie.

**Respuesta `200`**

```json
{ "ok": true, "data": { "loggedOut": true } }
```

### `GET /api/v1/auth/session`

Front: `getAdminSession()` (hoy lee cookie/localStorage, **sin** delay de 300 ms).

**Respuesta `200`:** mismo objeto `AuthSession` que el login.
**Errores:** `401 UNAUTHORIZED`.

---

## Dashboard

### `GET /api/v1/dashboard/kpis`

Front: `getDashboardKPIs()`.

**Respuesta `200`**

```json
{
  "ok": true,
  "data": {
    "totalSales": 24580.5,
    "pendingOrders": 2,
    "lowStockCount": 4,
    "newClientsCount": 6
  }
}
```

| Campo | Significado |
| --- | --- |
| `totalSales` | Ventas del periodo en **soles** (número, no string). |
| `pendingOrders` | Pedidos con `status: "pending"`. |
| `lowStockCount` | SKUs con `stock <= minStock` (no archivados). |
| `newClientsCount` | Clientes dados de alta en el periodo. |

La gráfica de 7 días y el ranking de SKUs del dashboard **aún no** tienen
endpoint; siguen en `data/admin.ts`.

---

## Productos

Estados: `active` | `draft` | `archived`.

### `GET /api/v1/products`

Front: `getProducts(filters)`.

**Query**

| Parámetro | Tipo | Notas |
| --- | --- | --- |
| `q` | string | SKU, nombre o marca |
| `categoryId` | string | Id de categoría |
| `status` | string | `active` \| `draft` \| `archived` |
| `brand` | string | Coincidencia de marca |

**Respuesta `200`** — el mock del front hoy devuelve el array plano; el HTTP
debe envolverlo:

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "1",
        "sku": "TRU-7821",
        "name": "Taladro percutor 1/2\" 750W industrial",
        "brand": "TRUPER",
        "categoryId": "herramientas",
        "subcategoryId": "herramientas-general",
        "price": 89.9,
        "stock": 45,
        "minStock": 10,
        "status": "active",
        "images": ["https://…"],
        "descriptionShort": "Taladro percutor profesional…",
        "descriptionFull": "Taladro percutor profesional para concreto…",
        "isFeatured": true,
        "createdAt": "2026-08-10T12:00:00.000Z"
      }
    ],
    "total": 22
  }
}
```

Al conectar el fetch, `getProducts` debe devolver `data.items`.

### `POST /api/v1/products`

Front: `createProduct(productData)`.

El backend asigna `id` y `createdAt`. **Body:** el resto de campos de `Product`.

**Respuesta `201`**

```json
{
  "ok": true,
  "data": { "id": "prd_…", "sku": "NUE-0001", "createdAt": "2026-09-11T18:00:00.000Z" }
}
```

(puede devolver el `Product` completo; el front usa el objeto entero).

**Errores:** `409 CONFLICT` (SKU duplicado), `400 VALIDATION`.

### `GET /api/v1/products/:id` (recomendado)

Aún no hay UI de edición; dejar listo para el siguiente sprint.

### `PUT /api/v1/products/:id` (recomendado)

Mismo body parcial o completo de `Product` sin `id` / `createdAt`.

### `DELETE /api/v1/products/:id` (recomendado)

Soft-delete → `status: "archived"` preferible a borrar filas.

---

## Categorías

Tipo: `Category` en `types/admin.ts`. El CMS de banners/textos del home
(`chamo-cms-v1`) es **otra** capa; este recurso es el árbol comercial.

### `GET /api/v1/categories`

Front: `getCategories()`. Usada hoy por el `<select>` de categoría en
`/admin/productos/nuevo` (`AdminNewProductForm.tsx`).

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "ferreteria",
        "name": "Ferretería",
        "subcategoriesCount": 0,
        "status": "active",
        "image": "/images/categorias/ferreteria.jpg"
      }
    ]
  }
}
```

El mock del front devuelve el array plano; el fetch real debe usar `data.items`
(mismo patrón que `getProducts`/`getOrders`).

### `POST /api/v1/categories` / `PUT /api/v1/categories/:id`

Pendientes de UI. Estados: `active` | `hidden`.

---

## Pedidos

Estados: `pending` | `confirmed` | `shipped` | `delivered` | `cancelled`.

Pago: `yape` | `plin` | `transfer` | `cash` | `card`.
Envío: `pickup` | `lima` | `provinces`.

### `GET /api/v1/orders`

Front: `getOrders(statusFilter)`.

**Query:** `status` (opcional; omitir o `all` = todos).

**Respuesta `200`**

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "ord_pending_1",
        "orderNumber": "CI-2026-00041",
        "clientName": "Ferretería Los Andes S.A.C. (demo)",
        "clientPhone": "+51 900 000 001",
        "clientEmail": "compras.demo1@local.test",
        "address": "Av. Ejemplo 120, Lima",
        "status": "pending",
        "items": [
          {
            "productId": "1",
            "sku": "TRU-7821",
            "name": "Taladro percutor 1/2\" 750W industrial",
            "quantity": 12,
            "unitPrice": 89.9
          }
        ],
        "total": 1558.2,
        "createdAt": "2026-09-10T14:20:00.000Z",
        "paymentMethod": "yape",
        "shippingMethod": "lima"
      }
    ],
    "total": 4
  }
}
```

El mock del front devuelve el array plano; el fetch real debe usar `data.items`.

### `PUT /api/v1/orders/:orderId/status`

Front: `updateOrderStatus(orderId, newStatus)`.

**Body**

```json
{ "status": "confirmed" }
```

**Respuesta `200`:** `{ "ok": true, "data": { /* Order actualizado */ } }`

**Errores:** `404 NOT_FOUND`, `400 VALIDATION` (transición ilegal).

---

## Cómo enchufar el front

1. Implementar los endpoints de arriba.
2. En `services/adminApi.ts`, sustituir el cuerpo de cada función por
   `fetch` + parseo del sobre `{ ok, data }`, **manteniendo la firma**.
3. En `lib/auth.ts` / `app/admin/actions.ts`, dejar de escribir la cookie
   desde el cliente; el `Set-Cookie` del login basta. Marcar
   `httpOnly: true`.
4. No mezclar este contrato con `GET /api/productos` (catálogo público de
   la tienda, `FeaturedProduct`).

## Rutas del panel (front)

| Ruta | Protección | Datos |
| --- | --- | --- |
| `/admin/login` | Pública; si hay sesión → `/admin` | `loginAdmin` |
| `/admin` | Cookie de sesión | `getDashboardKPIs` |
| `/admin/productos` | Cookie | `getProducts({ q })` |
| `/admin/productos/nuevo` | Cookie | `createProduct` |
| `/admin/pedidos` | Cookie | `getOrders` / `updateOrderStatus` |

El layout `app/admin/(panel)/layout.tsx` redirige a `/admin/login` si
`getAdminSession()` es `null`.

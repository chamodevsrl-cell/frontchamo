# Contrato HTTP — Panel Admin (Chamo Import S.R.L.)

Documento de handover para el desarrollador **Backend**. El front del panel
hoy no llama a estos endpoints: consume `services/adminApi.ts` (mock con
promesas y **300 ms** de latencia). Cada función de ese archivo tiene un
comentario `// TODO Backend: Reemplazar mock con fetch('/api/v1/...')`.

Tipos TypeScript 1:1: [`types/admin.ts`](./types/admin.ts).

> Este documento cubre **solo** el panel admin. Para el resto del front (catálogo
> público, carrito, favoritos, cuentas de la tienda, manual de uso) ver
> [`FRONTEND_DOCUMENTATION.md`](./FRONTEND_DOCUMENTATION.md).

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

El login valida contra la lista de `PanelUser` (no una sola cuenta fija).
`email` en el body acepta **correo o nombre**.

| Usuario | Correo | Contraseña | Rol |
| --- | --- | --- | --- |
| THE WINTER | `thewinter@local.test` | `Criper@11` | Administrador |
| Admin Demo | `admin@local.test` | `admin123` | Administrador |
| Katia Ríos (demo) | `katia.demo@local.test` | `editor123` | Editor |
| Julio Paredes (demo) | `julio.demo@local.test` | `almacen123` | Almacén (**suspendido**) |

**No son cuentas oficiales de Chamo Import.** No usar correos de la empresa
en el mock. Cuando el login real exista, borrar estas credenciales del front.

La sesión incluye `roleIds` (un usuario puede tener más de un rol) + `roleId`
(`roleIds[0]`, por compatibilidad) + `permissions` — la **unión** de los
`permissions` de todos los `PanelRole` en `roleIds`. El sidebar del front
filtra con eso.

Sesión del panel ≠ cuentas de la tienda (`lib/auth-local.ts` /
`chamo-accounts-v1`).

---

## Auth

### `POST /api/v1/auth/login`

Front: `loginAdmin(credentials)`.

**Body**

```json
{
  "email": "THE WINTER",
  "password": "Criper@11"
}
```

**Respuesta `200`**

```json
{
  "ok": true,
  "data": {
    "id": "usr_winter",
    "name": "THE WINTER",
    "email": "thewinter@local.test",
    "role": "admin",
    "roleId": "role_admin",
    "roleIds": ["role_admin"],
    "permissions": ["dashboard", "productos", "usuarios", "roles"],
    "token": "eyJhbGciOi…"
  }
}
```

También enviar `Set-Cookie: chamo_admin_session=…` (httpOnly). `role` grosero:
`admin` | `editor` (si el `PanelRole` incluye Usuarios y Roles → `admin`).

**Errores:** `401 INVALID_CREDENTIALS`, `403 FORBIDDEN` (cuenta suspendida).

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
        "isOnOffer": true,
        "oldPrice": 105.0,
        "discountPercent": 20,
        "packaging": [
          { "unit": "Unidad", "content": "1 taladro + llave mandril" },
          { "unit": "Docena", "content": "12 unidades (caja mayorista)" },
          { "unit": "Caja", "content": "24 unidades por master box" }
        ],
        "createdAt": "2026-08-10T12:00:00.000Z"
      }
    ],
    "total": 22
  }
}
```

`isOnOffer` + `oldPrice` alimentan el badge "Oferta" y el precio tachado;
`discountPercent` (0–100, número entero, independiente de `oldPrice` — no se
calcula solo) es el texto del badge "-X% OFF". `packaging` es una lista
libre (no solo unidad/docena/caja): `unit` es texto, así el panel puede
crear una presentación de venta nueva (p. ej. "Rollo", "Par"). `oldPrice` y
`discountPercent` son `null` cuando `isOnOffer` es `false`.

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

### `GET /api/v1/products/:id`

Front: `getProduct(id)`. Usada por `/admin/productos/[id]/editar` para
precargar el wizard en modo edición. Ya tiene UI (Ver/Editar en
`/admin/productos`) — implementada en el mock (`productsDb.find`), pendiente
de reemplazar por `fetch`.

### `PUT /api/v1/products/:id`

Front: `updateProduct(id, input)` → `updateProductAction`. Mismo body parcial
de `Product` sin `id` / `createdAt` (ver {@link UpdateProductInput}). El mock
valida SKU duplicado igual que el alta.

### `DELETE /api/v1/products/:id`

Front: `deleteProduct(id)` → `deleteProductAction`, con confirmación en el
panel. El mock borra la fila; **recomendado** para el backend real un
soft-delete (`status: "archived"`) en vez de borrar filas.

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
        "image": "/images/categorias/ferreteria.jpg",
        "description": "Insumos al por mayor"
      }
    ]
  }
}
```

El mock del front devuelve el array plano; el fetch real debe usar `data.items`
(mismo patrón que `getProducts`/`getOrders`). `description` es el texto corto de
la línea (tarjeta del panel y antetítulo en la tienda).

### `POST /api/v1/categories`

Front: `createCategory()` / `createCategoryAction()`. Body:

```json
{
  "name": "Iluminación",
  "description": "Focos y tiras LED",
  "image": "/images/categorias/electricos.jpg",
  "id": "iluminacion"
}
```

`id` es opcional (slug). Si falta, el mock lo genera con `slugifyLabel(name)`.

**Respuesta `201`:** `{ ok: true, data: { item: Category } }`

### `PUT /api/v1/categories/:id`

Front: `updateCategory()` / `updateCategoryAction()`. Body parcial:
`name`, `description`, `image`, `status` (`active` | `hidden`).

**Respuesta `200`:** `{ ok: true, data: { item: Category } }`

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

## Usuarios y roles del panel

Staff que entra a `/admin`, distinto de los clientes de la tienda.

### `GET /api/v1/roles`

Front: `getRoles()`.

**Respuesta `200`:** `{ "ok": true, "data": [ /* PanelRole[] */ ] }`

### `POST /api/v1/roles`

Front: `createRole(input)`. Body: `{ name, description, permissions }`.

### `GET /api/v1/users`

Front: `getUsers()`. **Nunca** devolver contraseñas.

### `POST /api/v1/users`

Front: `createUser(input)`. Body: `{ name, email, roleIds: string[], password }`.
**`roleIds` es un arreglo** — un usuario puede tener más de un rol asignado; la
sesión hereda la **unión** de los `permissions` de todos sus roles. La cuenta
queda `active` y puede usarse en `POST /auth/login`.

**Errores:** `400 VALIDATION` (`roleIds` vacío o con un id que no existe),
`409 CONFLICT` (correo o nombre duplicado).

### `PUT /api/v1/users/:userId`

Front: `updateUser(userId, input)`, desde el formulario del modal "Editar
usuario" en `/admin/usuarios` (`AdminUsersCards.tsx`). Body parcial —
solo se aplican los campos presentes:

```json
{
  "name": "Nuevo Nombre",
  "email": "nuevo@correo.test",
  "roleIds": ["role_admin", "role_editor"],
  "password": "opcional, se omite o va vacío para no cambiarla"
}
```

Distinto de `PUT /api/v1/users/me` (esa es la propia cuenta editando su
nombre/teléfono desde "Mi perfil"); este endpoint es el **staff con permiso
`usuarios` editando a cualquier otro usuario del panel** — nombre, correo,
contraseña y roles.

**Respuesta `200`:** `{ "ok": true, "data": { /* PanelUser actualizado, sin password */ } }`

**Errores:** `404 NOT_FOUND`, `400 VALIDATION` (correo inválido, `roleIds`
vacío o con un id que no existe, contraseña nueva menor a 6 caracteres),
`409 CONFLICT` (correo o nombre ya usado por otra cuenta).

### `PUT /api/v1/users/:userId/status`

Front: `updateUserStatus(userId, status)`. Body: `{ "status": "active" | "suspended" }`.
`suspended` bloquea el login.

### `DELETE /api/v1/users/:userId`

Front: `deleteUser(userId)`, desde el modal "Editar usuario" en `/admin/usuarios`
(`AdminUsersCards.tsx`). Borra la cuenta staff. El front bloquea borrarte a ti
mismo mientras tienes la sesión abierta (comparando contra `getAdminSession().id`),
pero el backend real **debería validar lo mismo** por si acaso.

**Respuesta `200`:** `{ "ok": true, "data": { "deleted": true } }`

**Errores:** `404 NOT_FOUND`.

### `PUT /api/v1/users/me`

Front: `updateOwnProfile(userId, input)`. Body: `{ "name", "phone?", "company?", "ruc?" }`.
Cualquier rol del panel edita **su** ficha. La foto de perfil no viaja en este
endpoint (queda en el cliente, `chamo-profiles-v1`) para no inflar la cookie.

**Respuesta `200`:** `{ "ok": true, "data": { /* AuthSession actualizado */ } }`

**Errores:** `404 NOT_FOUND`, `400 VALIDATION`, `409 CONFLICT` (nombre duplicado).

---

## Cómo enchufar el front

1. Implementar los endpoints de arriba.
2. En `services/adminApi.ts`, sustituir el cuerpo de cada función por
   `fetch` + parseo del sobre `{ ok, data }`, **manteniendo la firma**.
3. En `lib/auth.ts` / `app/admin/actions.ts`, dejar de escribir la cookie
   desde el cliente; el `Set-Cookie` del login basta. Marcar
   `httpOnly: true`.
4. No mezclar este contrato con el catálogo público de la tienda
   (`FeaturedProduct`, namespace `/api/v1/catalog` — ver
   `API_CONTRACT_TIENDA.md` §2). `/api/v1/products` de este documento es
   **solo del panel** (`Product`, requiere sesión de panel).

## Rutas del panel (front)

| Ruta | Protección | Datos |
| --- | --- | --- |
| `/admin/login` | Redirige a `/login` (modal de Mi cuenta) | `loginAdmin` vía `AuthProvider` |
| `/admin` | Cookie de sesión | `getDashboardKPIs` |
| `/admin/productos` | Cookie + permiso `productos` | `getProducts({ q })` |
| `/admin/productos/nuevo` | Cookie + permiso `productos` | `createProduct` |
| `/admin/pedidos` | Cookie + permiso `pedidos` | `getOrders` / `updateOrderStatus` |
| `/admin/usuarios` | Cookie + permiso `usuarios` | `getUsers` / `createUser` |
| `/admin/roles` | Cookie + permiso `roles` | `getRoles` / `createRole` |

El layout `app/admin/(panel)/layout.tsx` redirige a `/admin/login` si
`getAdminSession()` es `null`.

# Mapa de conexión — qué conectar con qué

Una fila por pieza del sitio: dónde vive hoy en el código, qué endpoint la
reemplaza, y en qué documento está el detalle exacto (body/respuesta/
errores). Orden = orden recomendado de implementación (ver también
`docs/MANUAL.md` §A.13.7). El detalle de cada endpoint (JSON de ejemplo,
errores) **no** está acá — está en los contratos; esta tabla es solo el
índice para no perderte entre los dos archivos.

## 0. Panel admin (`/admin/*`) — el más autocontenido, ya tiene contrato completo

| Pieza | Vive hoy en (código) | Endpoint(s) | Contrato |
| --- | --- | --- | --- |
| Login / logout / sesión del panel | `lib/auth.ts`, `app/admin/actions.ts` | `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/session` | [`API_CONTRACT.md`](../../API_CONTRACT.md#auth) |
| KPIs del dashboard | `services/adminApi.ts` → `getDashboardKPIs()` | `GET /api/v1/dashboard/kpis` | [`API_CONTRACT.md`](../../API_CONTRACT.md) |
| Productos (CRUD) | `services/adminApi.ts`, `components/admin/AdminNewProductForm.tsx`, `AdminProductsTable.tsx`, ruta `app/admin/(panel)/productos/[id]/editar/` | `GET/POST /api/v1/products`, `GET/PUT/DELETE /api/v1/products/:id` | [`API_CONTRACT.md`](../../API_CONTRACT.md) |
| Categorías (panel) | `services/adminApi.ts` | `GET/POST /api/v1/categories`, `PUT /api/v1/categories/:id` | [`API_CONTRACT.md`](../../API_CONTRACT.md) |
| Pedidos | `services/adminApi.ts`, `AdminOrdersTable.tsx` | `GET /api/v1/orders`, `PUT /api/v1/orders/:orderId/status` | [`API_CONTRACT.md`](../../API_CONTRACT.md) |
| Roles y usuarios del panel | `services/adminApi.ts`, `AdminUsersCards.tsx`, `AdminRolesView.tsx` | `GET/POST /api/v1/roles`, `GET/POST /api/v1/users`, `PUT /api/v1/users/:userId`, `PUT /api/v1/users/:userId/status`, `DELETE /api/v1/users/:userId`, `PUT /api/v1/users/me` | [`API_CONTRACT.md`](../../API_CONTRACT.md) |

**Marcador en código:** `// TODO Backend` al lado de cada función de
`services/adminApi.ts` (19 en total) y en `app/admin/actions.ts`.

---

## 1. Contenido del sitio (CMS) — lo más urgente para el negocio

Hoy un admin que edita `/admin/banners`, `/admin/categorias`,
`/admin/ajustes/*` o `/admin/equipo` **solo lo ve en su propio navegador**.

| Pieza | Vive hoy en (código) | Endpoint(s) | Contrato |
| --- | --- | --- | --- |
| Slider, categorías (overrides), footer, banners de página, equipo | `components/ContentProvider.tsx` (`localStorage: chamo-cms-v1`), `lib/cms.ts` (tipo `CmsState`) | `GET/PUT /api/v1/site-content` | [`API_CONTRACT_TIENDA.md` §1](../../API_CONTRACT_TIENDA.md#1-contenido-del-sitio-cms-del-panel) |

Lo editan (sin cambios de UI necesarios, todos pasan por `useSiteContent()`):
`AdminBannersStudio.tsx`, `AdminCategoriesCards.tsx`,
`AdminFooterSettings.tsx`, `AdminChannelsSettings.tsx`, `AdminTeamCards.tsx`.

**Marcador en código:** `ContentProvider.tsx` (2 `TODO Backend`, en los
`useEffect` de lectura y escritura).

---

## 2. Catálogo público (`/catalogo`, `/`, fichas de producto)

| Pieza | Vive hoy en (código) | Endpoint(s) | Contrato |
| --- | --- | --- | --- |
| Listado + búsqueda/filtros | `data/products.ts` → `searchCatalog()`, servido por `app/api/productos/route.ts` | `GET /api/v1/catalog?q=&category=&brand=` | [`API_CONTRACT_TIENDA.md` §2](../../API_CONTRACT_TIENDA.md#2-catálogo-público) |
| Detalle por id | `data/products.ts` → `getProductById()` | `GET /api/v1/catalog/:id` | ídem |
| Relacionados | `data/products.ts` → `getRelatedProducts()` | `GET /api/v1/catalog/:id/related` | ídem |

> ⚠️ Namespace **`catalog`**, no `products` — `/api/v1/products` ya es del
> panel (fila 0, tipo `Product`, requiere sesión). Mismo path para las dos
> cosas sería un choque de nombres — ver la nota al inicio de
> `API_CONTRACT_TIENDA.md` §2.

**Marcador en código:** `app/api/productos/route.ts`, `data/products.ts`
(`getProductById`, `getRelatedProducts`).

---

## 3. Cuentas de la tienda (clientes)

| Pieza | Vive hoy en (código) | Endpoint(s) | Contrato |
| --- | --- | --- | --- |
| Registro | `lib/auth-local.ts` → `createAccount()` | `POST /api/v1/store/register` | [`API_CONTRACT_TIENDA.md` §3](../../API_CONTRACT_TIENDA.md#3-cuentas-de-la-tienda-clientes) |
| Login | `lib/auth-local.ts` → `verifyAccount()` | `POST /api/v1/store/login` | ídem |
| Logout | `components/AuthProvider.tsx` → `logout()` | `POST /api/v1/store/logout` | ídem |
| Hidratar sesión al cargar | `components/AuthProvider.tsx` (primer `useEffect`) | `GET /api/v1/store/session` | ídem |
| Editar perfil (`/cuenta/perfil`, `/cuenta/empresa`) | `components/AccountProfileForm.tsx` → `AuthProvider.tsx` → `updateAccountProfile()` | `PATCH /api/v1/store/profile` | ídem |

**Ojo:** el hash de contraseña hoy se calcula **en el cliente**
(`hashPassword()`, SHA-256 + salt) — el backend real debe recibir la
contraseña en texto plano por HTTPS y hashear con bcrypt/argon2 del lado del
servidor, no reusar esa función.

**Marcador en código:** `lib/auth-local.ts` (2), `AuthProvider.tsx` (5, uno
por cada función: hidratación, login, register, updateProfile, logout).

---

## 4. Carrito, favoritos y comparar — depende de tener cuentas reales (§3)

| Pieza | Vive hoy en (código) | Endpoint(s) | Contrato |
| --- | --- | --- | --- |
| Carrito | `components/CartProvider.tsx` (`localStorage: chamo-cart-v1`) | `GET/PUT /api/v1/store/cart` | [`API_CONTRACT_TIENDA.md` §4](../../API_CONTRACT_TIENDA.md#4-carrito-favoritos-y-comparar) |
| Favoritos | `components/FavoritesProvider.tsx` (`localStorage: chamo-favorites-v1`) | `GET/PUT /api/v1/store/favorites` | ídem |
| Comparar (máx. 3) | `components/CompareProvider.tsx` (`localStorage: chamo-compare-v1`) | `GET/PUT /api/v1/store/compare` (opcional, prioridad baja) | ídem |

**Patrón:** invitado (sin sesión) sigue 100% en `localStorage`; al iniciar
sesión se fusiona el carrito local con el del servidor (sumar cantidades por
`productId` repetido) y de ahí en más se lee/escribe contra estos endpoints.

**Marcador en código:** `CartProvider.tsx` (2), `FavoritesProvider.tsx` (2),
`CompareProvider.tsx` (1).

---

## 5. Imágenes (transversal — resolver antes de subir fotos reales)

| Pieza | Vive hoy en (código) | Endpoint(s) | Contrato |
| --- | --- | --- | --- |
| Lectura de archivo → data URL base64 | `lib/cms-image.ts` → `readCmsImageFile()` | `POST /api/v1/uploads` (nuevo, no existe todavía) | [`API_CONTRACT_TIENDA.md` §5](../../API_CONTRACT_TIENDA.md#5-imágenes-subidas-desde-el-panel) |

Afecta a cualquier endpoint que reciba `images`/`photo`/`image`/`src` con
contenido base64: productos del panel (fila 0), `site-content` (fila 1),
`store/profile` (fila 3). No bloquea arrancar el resto — bloquea subir fotos
reales de producto (hoy hasta 60 MB por imagen en base64, inviable en
producción).

---

## Cómo verificar que no falta nada

```bash
grep -rn "TODO Backend" --include="*.ts" --include="*.tsx" . | wc -l
```

Si ese número baja a 0, ya no queda ningún punto de integración sin marcar
en el código (los contratos siguen siendo la referencia de body/respuesta,
el `grep` es solo para no perderte ninguno).

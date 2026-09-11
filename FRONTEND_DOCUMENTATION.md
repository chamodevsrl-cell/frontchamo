# Documentación del Front — Chamo Import

Documento único de referencia para quien conecte el backend y para quien opere el
sitio: qué variables/tipos usa cada componente, de dónde salen hoy, y cómo enchufar
un backend real sin romper nada. Incluye también el manual de uso (tienda + panel).

> **Para el desarrollador de backend:** empieza por [§3](#3-mapa-de-datos--de-dónde-sale-cada-cosa-hoy)
> y [§4](#4-componentes-y-las-variables-que-usan-por-dominio), y usa
> [`API_CONTRACT.md`](./API_CONTRACT.md) como la especificación HTTP exacta (bodies,
> respuestas, códigos de error) del panel admin — este archivo te dice **qué**
> componente necesita **qué** dato; `API_CONTRACT.md` te dice **cómo** debe verse el
> JSON de cada endpoint.
>
> Este archivo es la foto técnica completa. El proceso de trabajo día a día (qué se
> cambió, qué falta, bugs abiertos) sigue viviendo en `docs/` (`docs/MANUAL.md`,
> `docs/SUGERENCIAS.md`, `docs/cambios/`) — no lo duplicamos aquí.

Última actualización: **2026-09-11** (justo después de mergear el panel admin a `main`).

---

## 1. Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (`strict: true`)
- **Tailwind CSS v4** (tokens en `app/globals.css`, sin `tailwind.config`)
- **Lucide React** (iconografía) · **Framer Motion** (preloader/loader)
- Fuentes: Barlow / Barlow Semi Condensed (`next/font/google`)
- **Vitest** para tests (`npm test`, `tests/smoke.test.ts`)

```bash
npm run dev      # http://localhost:3000
npm run build    # producción — corre type-check completo
npm run start
npm run lint
npm test
```

---

## 2. Dos sistemas de datos que **no** hay que confundir

| | 🛒 Tienda pública | 🎛️ Panel admin |
| --- | --- | --- |
| Para quién | Clientes/visitantes del sitio | Equipo de Chamo Import |
| Rutas | `/`, `/catalogo`, `/carrito`, `/favoritos`, `/comparar`, `/categorias`, etc. | `/admin/*` |
| Tipos de datos | `FeaturedProduct` (`data/products.ts`) | `Product`, `Order`, `Category`, `AuthSession` (`types/admin.ts`) |
| Sesión | `AuthUser`/`StoredAccount` (`lib/auth-local.ts`), 100% `localStorage` | `AuthSession` (`lib/auth.ts`), cookie `chamo_admin_session` + copia en `localStorage` |
| Se conecta a backend vía | Parcial: `GET /api/productos` ya existe (`app/api/productos/route.ts`); el resto (carrito, favoritos, comparar, cuentas) sigue en `localStorage`, sin endpoint todavía | `services/adminApi.ts` — contrato completo en `API_CONTRACT.md` |

Son dos catálogos de productos **distintos en el mock** (`FeaturedProduct` para la
tienda, `Product` para el panel) que hoy leen el mismo `data/products.ts` con formas
diferentes (`services/adminApi.ts` → `seedProducts()` los convierte). Un backend real
probablemente los unifica en una sola tabla — ver [§5.4](#54-unificar-los-dos-catálogos-y-las-dos-sesiones).

---

## 3. Mapa de datos — de dónde sale cada cosa hoy

| Dato | Dónde vive hoy | Tipo / clave | ¿Ya hay endpoint? |
| --- | --- | --- | --- |
| Catálogo público | `data/products.ts` (22 SKUs de ejemplo) | `FeaturedProduct[]` | ✅ `GET /api/productos?q=&category=&brand=` |
| Categorías (tienda) | `data/home.ts` → `mainCategories` | `MainCategory[]` | ❌ estático |
| Carrito | `localStorage: chamo-cart-v1` | `CartLine[]` (`CartProvider.tsx`) | ❌ |
| Favoritos | `localStorage: chamo-favorites-v1` | `string[]` (ids) | ❌ |
| Comparar (máx. 3) | `localStorage: chamo-compare-v1` | `string[]` (ids) | ❌ |
| Cuentas de la tienda | `localStorage: chamo-accounts-v1` | `StoredAccount[]` (`lib/auth-local.ts`) | ❌ |
| Sesión de la tienda | `localStorage: chamo-session-v1` | `AuthUser` | ❌ |
| CMS de banners/categorías (home) | `localStorage: chamo-cms-v1` | `CmsState` (`lib/cms.ts`) | ❌ |
| Sesión del panel admin | Cookie `chamo_admin_session` + `localStorage: chamo-admin-session-v1` | `AuthSession` (`types/admin.ts`) | 🟡 mock, ver §5 |
| Productos del panel | En memoria (`services/adminApi.ts`, se reinicia con el server) | `Product[]` | 🟡 mock |
| Pedidos del panel | En memoria (`services/adminApi.ts`) | `Order[]` | 🟡 mock |
| Categorías del panel | Deriva de `mainCategories` en cada llamada | `Category[]` | 🟡 mock |
| KPIs del dashboard | Calculados de `Product[]`/`Order[]` en memoria | `DashboardKPIs` | 🟡 mock |
| Gráfica 7 días / ranking SKUs | `data/admin.ts` (fijo, no simulado) | — | ❌ ni mock |
| Contacto / horario / WhatsApp | `data/contact.ts` (constantes) | — | ❌ estático |
| Testimonios | `data/testimonials.ts` (ejemplo) | — | ❌ estático |
| Perfil de empresa (Nosotros) | `data/company.ts` (placeholder) | — | ❌ estático |

🟡 = ya está detrás de `services/adminApi.ts` con la firma exacta que espera un
`fetch()` real — es el trabajo **más fácil** de conectar. ❌ = todavía no hay ni mock de
red; conectar esto requiere decidir el endpoint primero.

---

## 4. Componentes y las variables que usan, por dominio

Cada tabla: **Componente** → **prop / variable** (con su tipo) → **de dónde sale hoy**.
Solo se listan componentes que reciben datos con forma de dominio (no los puramente
visuales como `Reveal`, `StampHeading`, `BrandLoader`, `WrenchCursor`, `SocialIcons`).

### 4.1 Catálogo (`FeaturedProduct`, `data/products.ts`)

```ts
type FeaturedProduct = {
  id: string; name: string; brand: string; sku: string;
  category: string;         // slug de categoría (relacionados por igualdad)
  categoryLabel: string;    // denormalizado — ver §5.5
  price: number; oldPrice: number; wholesalePrice: number;
  discountPercent?: number; // 0–100, no un monto
  badge: "oferta" | "destacado";
  stock: number;
  images: string[];         // images[0] = imagen principal, sin campo `image` aparte
  description: string; features: string[];
  specs: { label: string; value: string }[]; // ficha técnica
  packaging: { unidad: string; docena: string; caja: string };
  warning: string;
};
```

| Componente | Props relevantes | Fuente |
| --- | --- | --- |
| `ProductCard.tsx` | `product: FeaturedProduct`, `onOpen(): void`, `onAddToCart?(): void` | lista pasada por el padre |
| `ProductModal.tsx` | `product: FeaturedProduct`, `onClose(): void`, `onSelectProduct?(p: FeaturedProduct): void` | igual |
| `ProductCatalog.tsx` | `products: FeaturedProduct[]`, `emptyMessage?: string` | `getProducts()`/`searchCatalog()` en `data/products.ts` |
| `CatalogFilters.tsx` | `q: string`, `category: string`, `brand: string` (controla `?q=&category=&brand=` de `/catalogo`) | `useSearchParams()` |
| `CategoryCollage.tsx` | `slug: string`, `fallback: string`, `fallbackAlt: string` | `getCategoryCollage(slug)` en `data/products.ts` |
| `CategoryBanner.tsx` | `category: MainCategory`, `brands?: readonly string[]` | `data/home.ts` + `useSiteContent()` (overlay CMS) |
| `FeaturedOffers.tsx` / `app/catalogo/page.tsx` / `app/ofertas/page.tsx` | consumen `featuredProducts`/`searchCatalog()` y arman los `FeaturedProduct[]` de arriba | `data/products.ts` |

Helpers relevantes en `data/products.ts`: `searchCatalog(filters)`, `getProductById(id)`,
`getRelatedProducts(product, limit)`, `getProductsByCategory(category)`,
`getCategoryCollage(slug, limit)`, `getCatalogBrands()`.

### 4.2 Carrito (`CartLine`, `components/CartProvider.tsx`)

```ts
type CartLine = {
  productId: string;
  quantity: number;
  unitPrice: number;          // precio al momento de agregar — no se recalcula solo
  wholesaleUnitPrice: number;
};
type CartResolvedLine = CartLine & {
  product: FeaturedProduct;
  priceChanged: boolean;      // true si el precio vivo del catálogo ya no coincide
};
// useCart() expone: items, lines: CartResolvedLine[], count,
//   addItem(productId, quantity?), setQuantity(productId, quantity),
//   removeItem(productId), clear()
```

Usado por: `app/carrito/page.tsx` (totales, WhatsApp del pedido), `Navbar.tsx` (badge
del carrito), `ProductCard.tsx`/`ProductModal.tsx` (`addItem`), `QuoteForm.tsx` (arma
el mensaje de cotización con `lines`).

### 4.3 Favoritos y Comparar (`FavoritesProvider.tsx` / `CompareProvider.tsx`)

Mismo patrón en ambos — `ids: string[]`, `products: FeaturedProduct[]` (resueltos),
`count`, `has(productId)`, `toggle(productId)`, `remove(productId)`, `clear()`.
Comparar además expone `COMPARE_LIMIT = 3`.

| Componente | Props | Fuente |
| --- | --- | --- |
| `FavoriteButton.tsx` | `productId: string`, `variant?: "overlay" \| "box"` | `useFavorites()` |
| `CompareButton.tsx` | `productId: string`, `variant?: "overlay" \| "box"` | `useCompare()` |
| `app/favoritos/page.tsx`, `app/comparar/page.tsx` | consumen `products`/`ids` directo del hook | — |

### 4.4 Cuentas de la tienda (`lib/auth-local.ts`)

```ts
type AuthRole = "customer" | "admin"; // "admin" = primera cuenta creada en el navegador
type StoredAccount = { id: string; name: string; email: string; salt: string; passwordHash: string; role: AuthRole };
type AuthUser = { id: string; name: string; email: string; role: AuthRole };
// useAuth() expone: user, ready, openAuth(mode?), closeAuth(), login(email, password),
//   register(name, email, password), resetPassword(email, password), logout()
```

Contraseñas: `SHA-256(salt:password)` vía WebCrypto (`hashPassword`), no en texto
plano — pero **es solo del lado del cliente**, no reemplaza un backend de auth real.

Usado por: `AuthForm.tsx` (login/registro/recuperar), `AuthModal.tsx` (wrapper),
`Navbar.tsx` (menú "Mi cuenta", enlace a `/admin` solo si `role === "admin"`),
`app/admin/page.tsx` legado (ya no gatea el panel — ver §4.7).

### 4.5 Contacto, cotización y testimonios (constantes, sin tipo de dominio propio)

| Componente | Datos que recibe | Fuente |
| --- | --- | --- |
| `QuoteForm.tsx` | `lines: CartResolvedLine[]` (de `useCart()`) + campos de formulario propios (`name`, `company`, `ruc`, `phone`, `email`, `city`, `sku`, `notes`) | arma un mensaje de WhatsApp con `whatsappUrl()` de `data/contact.ts` |
| `ContactForm.tsx` | campos de formulario propios (nombre, empresa, mensaje) | `openWhatsApp()` de `data/contact.ts` |
| `Testimonials.tsx` | `testimonials` (importado directo) | `data/testimonials.ts` |
| `Footer.tsx`, `WhatsAppFloat.tsx`, `app/contacto/page.tsx` | `PHONE_DISPLAY`, `WHATSAPP_NUMBER`, `EMAIL`, `MAP_URL`, etc. | `data/contact.ts` |
| `app/nosotros/page.tsx` | `companyProfile` | `data/company.ts` |

Ninguno de estos tiene endpoint ni mock todavía — son constantes/formularios que solo
abren WhatsApp. Si el backend va a recibir cotizaciones/contactos como registros (no
solo WhatsApp), hay que diseñar ese endpoint desde cero; no hay contrato previo.

### 4.6 Panel admin — tipos (`types/admin.ts`, contrato completo en `API_CONTRACT.md`)

| Tipo | Campos clave | Quién lo produce hoy |
| --- | --- | --- |
| `AuthSession` | `id, name, email, role: "admin"\|"editor", token` | `loginAdmin()` en `services/adminApi.ts` (mock: solo `admin@local.test`/`admin123`) |
| `Product` | `id, sku, name, brand, categoryId, subcategoryId, price, stock, minStock, status, images, descriptionShort, descriptionFull, isFeatured, createdAt` | `getProducts()`, `createProduct()` |
| `Order` / `OrderItem` | `id, orderNumber, clientName/Phone/Email, address, status, items[], total, createdAt, paymentMethod, shippingMethod` | `getOrders()`, `updateOrderStatus()` |
| `Category` | `id, name, subcategoriesCount, status, image` | `getCategories()` (nuevo — ver `docs/cambios/2026-09-11-categorias-mock-api.md`) |
| `DashboardKPIs` | `totalSales, pendingOrders, lowStockCount, newClientsCount` | `getDashboardKPIs()` |
| `CreateProductInput` | `Omit<Product, "id" \| "createdAt">` | formulario de alta |
| `LoginCredentials` | `email, password` | formulario de login |

### 4.7 Panel admin — componentes

| Componente | Props | Fuente de los datos |
| --- | --- | --- |
| `AdminShell.tsx` | `children: ReactNode`, `session: AuthSession` | `app/admin/(panel)/layout.tsx` (server, lee la cookie) |
| `AdminLoginForm.tsx` | sin props — llama `loginAdminAction()` (Server Action) | `app/admin/login/page.tsx` |
| `AdminNewProductForm.tsx` | `categories: Category[]` | `app/admin/(panel)/productos/nuevo/page.tsx` awaits `getCategories()` |
| `AdminOrdersTable.tsx` | `orders: Order[]`, `statusFilter: string` | `app/admin/(panel)/pedidos/page.tsx` awaits `getOrders(statusFilter)` |
| `app/admin/(panel)/productos/page.tsx` | (server) lee `?q=` y awaits `getProducts({ q })` | — |
| `SiteContentEditor.tsx` | `section: "banners" \| "categories"` | `useSiteContent()` → `chamo-cms-v1` (esto **no** es del backend, es el CMS local del home) |
| `AdminPlaceholder.tsx` | `title: string`, `description: string` | usado por Marcas/Clientes/Inventario/Ofertas/Reportes/Configuración — sin datos reales aún |

Todas las funciones de datos (`getDashboardKPIs`, `getProducts`, `createProduct`,
`getOrders`, `updateOrderStatus`, `getCategories`, `loginAdmin`) viven en
**`services/adminApi.ts`** — ese es el único archivo que hay que tocar para conectar
el backend real (ver §5).

---

## 5. Cómo conectar el backend

### 5.1 Panel admin (lo más directo — ya está todo preparado)

1. Implementar los endpoints de `API_CONTRACT.md` (`/api/v1/auth/login`,
   `/api/v1/auth/logout`, `/api/v1/auth/session`, `/api/v1/dashboard/kpis`,
   `/api/v1/products` [+ `GET/PUT/DELETE :id` recomendados], `/api/v1/categories`,
   `/api/v1/orders` + `PUT :id/status`).
2. En `services/adminApi.ts`, reemplazar el cuerpo de cada función por un
   `fetch('/api/v1/...')` que parsee el sobre `{ ok, data }` / `{ ok, error }` —
   **manteniendo la misma firma** (nombre, parámetros, tipo de retorno). Nada más en
   el front necesita cambiar: las páginas server (`productos/page.tsx`,
   `pedidos/page.tsx`, el dashboard) y los componentes cliente ya llaman a estas
   funciones, no a `fetch` directo.
3. En `lib/auth.ts` / `app/admin/actions.ts`, dejar que el `Set-Cookie` lo mande el
   backend en el login (marcarla `httpOnly: true`, `secure: true` en producción) en
   vez de escribirla desde el cliente (`persistAdminSession`).
4. Borrar `MOCK_ADMIN_EMAIL` / `MOCK_ADMIN_PASSWORD` de `services/adminApi.ts`.
5. `data/admin.ts` (gráfica 7 días + ranking de SKUs) sigue siendo demo hasta que se
   agreguen esos dos endpoints — no están en el contrato todavía.

### 5.2 Tienda pública — catálogo

Ya existe `GET /api/productos?q=&category=&brand=` (`app/api/productos/route.ts`,
usa `searchCatalog()` de `data/products.ts`). Para un backend real: reemplazar
`searchCatalog()`/`featuredProducts` por una consulta a base de datos con la misma
forma `FeaturedProduct[]` — el resto de la tienda (`ProductCatalog`, `ProductCard`,
`ProductModal`, etc.) no necesita cambios si el shape se mantiene.

### 5.3 Tienda pública — carrito, favoritos, comparar, cuentas

Hoy **100% en `localStorage` del navegador** — no hay ningún endpoint ni mock de red
para esto (a diferencia del panel admin). Decisiones a tomar antes de conectar:

- ¿El carrito/favoritos se sincronizan a una cuenta real, o siguen siendo por
  dispositivo? Si se sincronizan, hace falta un endpoint por recurso
  (`GET/POST/PUT /api/cart`, `/api/favorites`, etc.) y migrar `CartProvider.tsx` /
  `FavoritesProvider.tsx` / `CompareProvider.tsx` del patrón `useState` +
  `localStorage.setItem` a llamadas de red (mismo patrón que `adminApi.ts`: una
  capa de funciones intermedia, no `fetch` disperso en los componentes).
- Las cuentas de la tienda (`lib/auth-local.ts`) son una demo funcional (salted
  SHA-256, sin backend) — no están pensadas para producción tal cual. Cuando haya
  login real de clientes, lo más simple es que reemplace también al panel admin
  (ver §5.4) en vez de mantener un tercer sistema de auth.

### 5.4 Unificar los dos catálogos y las dos sesiones

Hoy conviven, a propósito, dos pares de conceptos duplicados:

- **Catálogo:** `FeaturedProduct` (tienda) vs `Product` (panel) — mismos datos,
  campos distintos (el panel agrega `status`, `stock`/`minStock`, `descriptionShort`
  vs `descriptionFull`, etc.). Un backend real probablemente los sirve desde la
  misma tabla y expone dos vistas (`GET /api/productos` para la tienda,
  `GET /api/v1/products` para el panel) o unifica el tipo del front.
- **Sesión:** `AuthUser`/`StoredAccount` (tienda, `localStorage`) vs `AuthSession`
  (panel, cookie) — ver la comparación completa en
  [`docs/MANUAL.md` A.12.5](./docs/MANUAL.md#a125-dos-sesiones-distintas--no-confundir).
  Cuando exista un solo backend de usuarios, lo natural es que el panel también
  use cookies httpOnly emitidas por el mismo login, con un `role`/permiso que
  distinga cliente de administrador.

### 5.5 Otros detalles a tener en cuenta

- `categoryLabel` en `FeaturedProduct` está **denormalizado** (se repite en cada
  producto en vez de venir de un `JOIN`) — si se migra a base de datos, no hay que
  sincronizarlo a mano, debería derivarse de la tabla de categorías.
- `discountPercent` es un **porcentaje (0–100)**, no un monto en soles.
- Las imágenes de `FeaturedProduct.images[0]` es siempre la principal — no hay un
  campo `image` aparte (se quitó a propósito, ver `docs/cambios/2026-09-11-backend-ready-fixes.md`).

---

## 6. Manual de uso

### 6.1 Tienda (cliente / visitante)

1. **Inicio** (`/`): slider de banners, marcas distribuidoras, categorías (carrusel
   con flechas), productos destacados, testimonios.
2. **Buscar**: el buscador del Navbar navega a `/catalogo?q=...`. `/catalogo` tiene
   filtros por categoría y marca (`CatalogFilters.tsx`, vía query string).
3. **Ver un producto**: clic en una tarjeta abre el modal (`ProductModal.tsx`) con
   galería, precio unitario/mayorista, ficha técnica y productos relacionados de la
   misma categoría (clic en uno cambia el producto dentro del mismo modal).
4. **Carrito**: "Añadir al carrito" desde la tarjeta o el modal. `/carrito` muestra
   cantidades, totales (precio guardado al agregar, con aviso si cambió), y arma un
   mensaje de WhatsApp con el pedido o lleva a `/cotizar` (formulario completo).
5. **Favoritos / Comparar**: corazón y ícono de comparar en cada tarjeta; páginas
   `/favoritos` y `/comparar` (hasta 3 productos lado a lado) — ambos persisten en
   el navegador.
6. **Cuenta**: "Mi cuenta" en el Navbar abre un modal de login/registro (cuentas de
   este navegador, ver §4.4). Si es la primera cuenta creada, además puede entrar al
   panel admin **con su propio login** (no hereda sesión automática — ver 6.2).
7. **Contacto**: `/contacto` (formulario → WhatsApp, mapa, teléfono/horario),
   `/nosotros` (perfil de empresa), burbuja de WhatsApp flotante en todo el sitio.

### 6.2 Panel de administración (equipo Chamo Import)

1. Ir a **`/admin/login`** (no es la misma cuenta que "Mi cuenta" de la tienda).
2. Credenciales de prueba — **no oficiales, borrar cuando haya backend real**:
   correo `admin@local.test`, contraseña `admin123`.
3. Tras entrar: sidebar con Dashboard, Productos, Categorías, Marcas, Pedidos,
   Clientes, Inventario, Ofertas, Banners, Reportes, Configuración.
4. **Lo que ya funciona de verdad** (contra el mock, no una base de datos):
   - **Dashboard**: 4 KPIs (ventas, pedidos pendientes, stock bajo, clientes nuevos).
   - **Productos**: ver/buscar (`/admin/productos`) y crear (`/admin/productos/nuevo`,
     valida SKU único, categoría viene del mock de categorías).
   - **Pedidos**: listar y cambiar de estado (`pending → confirmed → shipped →
     delivered`, o `cancelled`).
   - **Banners** y **Categorías**: edita los textos/imágenes del home (otro
     almacenamiento local, `chamo-cms-v1` — no se mezcla con el catálogo del panel).
5. **Lo que todavía es una pantalla "próximamente"**: Marcas, Clientes, Inventario,
   Ofertas, Reportes, Configuración.
6. **Salir** cierra solo la sesión del panel — "Mi cuenta" de la tienda sigue activa
   si estaba iniciada.
7. Los datos de Productos/Pedidos viven **en memoria del servidor de desarrollo**:
   se pierden si se reinicia `npm run dev` (no hay base de datos todavía).

---

## 7. Dónde seguir leyendo

- [`API_CONTRACT.md`](./API_CONTRACT.md) — especificación HTTP exacta del panel (bodies, respuestas, errores).
- [`docs/MANUAL.md`](./docs/MANUAL.md) — documentación técnica ampliada + manual de usuario por sección (incluye A.12, el detalle completo del panel con historia de cómo se construyó).
- [`docs/SUGERENCIAS.md`](./docs/SUGERENCIAS.md) — backlog vivo y bugs encontrados/cerrados.
- [`docs/cambios/`](./docs/cambios/) — historial detallado de cada cambio (antes/después).
- [`CLAUDE.md`](./CLAUDE.md) — memoria corta para retomar el proyecto en una nueva sesión.

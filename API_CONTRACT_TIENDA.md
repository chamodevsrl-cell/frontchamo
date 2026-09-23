# Contrato HTTP — Tienda pública (Chamo Import S.R.L.)

Documento de handover para el desarrollador **Backend**. Cubre **todo lo que
no es el panel admin**: contenido editable del sitio (CMS), catálogo público,
cuentas de cliente y carrito/favoritos/comparar. Para el panel admin ver
[`API_CONTRACT.md`](./API_CONTRACT.md) — **no mezclar** ambos contratos.

Mismas convenciones que `API_CONTRACT.md`: base URL **`/api/v1`**, sobre de
respuesta `{ "ok": true, "data": {} }` / `{ "ok": false, "error": { "code",
"message" } }`, códigos `UNAUTHORIZED` | `FORBIDDEN` | `VALIDATION` |
`NOT_FOUND` | `CONFLICT` | `INVALID_CREDENTIALS`.

Orden recomendado para implementar (ver `docs/MANUAL.md` §A.13.7 — por qué
este orden): **1. Contenido del sitio (CMS)** → **2. Catálogo** → **3.
Cuentas** → **4. Carrito/Favoritos/Comparar**. El contenido del sitio es lo
más urgente: hoy un admin que edita `/admin/banners` o `/admin/categorias`
solo lo ve en su propio navegador.

---

## 1. Contenido del sitio (CMS del panel)

Hoy vive 100% en `localStorage` (`chamo-cms-v1`), leído/escrito por
`ContentProvider.tsx` (`lib/cms.ts`, tipo `CmsState`). Lo edita el panel
(`/admin/banners`, `/admin/categorias`, `/admin/ajustes/footer`,
`/admin/ajustes/canales`, `/admin/equipo`) y lo consume **toda la tienda
pública** (home, categorías, footer, banners de página).

### `GET /api/v1/site-content`

Front: reemplaza la lectura de `window.localStorage.getItem(CMS_KEY)` en
`ContentProvider.tsx`. Público — sin auth (lo lee cualquier visitante).

**Respuesta `200`**

```json
{
  "ok": true,
  "data": {
    "slides": [{ "id": 1, "alt": "…", "src": "…", "hidden": false }],
    "categories": [
      {
        "slug": "electricos",
        "label": "Eléctricos",
        "eyebrow": "…",
        "bullets": ["…", "…", "…"],
        "image": "…",
        "imageAlt": "…",
        "bannerTitle": "ELÉCTRICOS"
      }
    ],
    "customCategories": [],
    "footer": {
      "tagline": "…",
      "address": "…",
      "addressHint": "…",
      "phone": "…",
      "whatsapp": "…",
      "email": "…",
      "hours": "…",
      "hoursHint": "…",
      "mapUrl": "…",
      "mapEmbedUrl": "…",
      "facebookUrl": "…",
      "instagramUrl": "…",
      "youtubeUrl": "…",
      "newsletterBlurb": "…",
      "paymentMethods": [{ "id": "yape", "label": "Yape", "hint": "…", "image": "" }]
    },
    "pageBanners": [{ "id": "categorias", "src": "…", "alt": "…", "hidden": false }],
    "team": [{ "id": "…", "name": "…", "role": "…", "photo": "…", "hidden": false }],
    "offerBanner": [
      { "id": "…", "image": "…", "alt": "…", "label": "…", "productId": "sku-123", "url": "" }
    ],
    "brands": [{ "id": "indeco", "name": "INDECO", "src": "…", "hidden": false }]
  }
}
```

Forma exacta = tipo `CmsState` en [`lib/cms.ts`](./lib/cms.ts). Si el backend
no tiene fila guardada todavía, devolver `emptyCmsState` (mismo archivo) para
que el front caiga en los valores de fábrica (`data/home.ts`, `data/media.ts`,
`data/page-banners.ts`, `data/team.ts`). `brands` es la lista completa y
ordenada del carrusel "Marcas distribuidoras" (el orden del array es el del
carrusel; `hidden: true` la guarda sin mostrarla). `pageBanners` incluye `"ofertas"` —
el banner ancho normal de `/ofertas` se edita igual que
Nosotros/Contacto/Catálogo.

`offerBanner`: siempre trae **4** elementos (una por cada sección fija del
banner alternativo de `/ofertas` — reemplaza el banner normal cuando las 4
tienen `image` y destino). `productId` apunta a un `FeaturedProduct.id` del
catálogo (§2), no a un producto del panel admin. `url` es opcional: si viene
con contenido, la sección navega ahí en vez de abrir el producto de
`productId` (URL absoluta `http(s)://…` o ruta interna del sitio, p. ej.
`/categorias/electricos`).

### `PUT /api/v1/site-content`

Front: reemplaza `saveCms(patch)` en `ContentProvider.tsx` — hoy hace
`setCms(prev => ({ ...prev, ...patch }))` en el cliente; el backend debe
mergear igual (**parcial**, solo las claves presentes en el body).
Requiere sesión de panel con permiso de la sección que corresponda (ver
`AdminPermission` en `types/admin.ts`: `categorias` para `categories`/
`customCategories`, `ajustes` para `footer`, `banners` para `slides`/
`pageBanners`, `equipo` para `team`, `marcas` para `brands`).

**Body:** `Partial<CmsState>` — cualquier subconjunto de las claves de arriba.

**Respuesta `200`:** `{ "ok": true, "data": { /* CmsState completo, ya mergeado */ } }`

**Errores:** `401 UNAUTHORIZED`, `403 FORBIDDEN` (sin permiso de esa sección),
`400 VALIDATION`.

### Cómo enchufar

En `ContentProvider.tsx`: el primer `useEffect` (hidratación) pasa de leer
`localStorage` a `fetch('/api/v1/site-content')`; `saveCms()` pasa de
`setCms` + escribir `localStorage` a `fetch(..., { method: "PUT" })` seguido
de `setCms` con la respuesta. Los componentes del panel que ya editan esto
(`AdminBannersStudio.tsx`, `AdminCategoriesCards.tsx`,
`AdminFooterSettings.tsx`, `AdminChannelsSettings.tsx`, `AdminTeamCards.tsx`)
**no cambian** — todos pasan por `useSiteContent()`.

---

## 2. Catálogo público

> ⚠️ **No usar `/api/v1/products`** para nada de esta sección — ese path ya
> es del panel admin en `API_CONTRACT.md` (`Product[]`, requiere sesión de
> panel). El catálogo público usa el namespace `/api/v1/catalog` a propósito,
> para no pisar la ruta del panel ni mezclar los dos tipos (`Product` del
> panel vs. `FeaturedProduct` de la tienda — ver `FRONTEND_DOCUMENTATION.md`
> §2, "Dos sistemas de datos que no hay que confundir").

Hoy `featuredProducts` es un array estático en `data/products.ts`, servido
por `app/api/productos/route.ts` vía `searchCatalog()`. El detalle de un
producto y sus relacionados **no pasan por esa ruta** — `getProductById()` y
`getRelatedProducts()` leen el mismo array en el cliente. Para un backend
real, los tres deben ser HTTP.

### `GET /api/v1/catalog`

Front: reemplaza `searchCatalog({ q, category, brand })`, usado hoy por
`GET /api/productos` (`app/api/productos/route.ts`) y consumido por
`ProductCatalog.tsx` / `CatalogFilters.tsx` en `/catalogo`. Público — sin
auth.

**Query:** `?q=&category=&brand=` (los tres opcionales; `category` es el
`slug`, `brand` el nombre exacto). `q` busca en nombre, marca, SKU,
`categoryLabel` y descripción.

**Respuesta `200`:** `{ "ok": true, "data": [ /* FeaturedProduct[] */ ] }`

Forma exacta = tipo `FeaturedProduct` en [`data/products.ts`](./data/products.ts)
(incluye `images[]`, `specs[]`, `packaging`, `badge`, etc. — mismo shape que
ya consumen `ProductCard.tsx` y `ProductModal.tsx`, no cambia nada de UI si
se mantiene).

### `GET /api/v1/catalog/:id`

Front: reemplaza `getProductById(id)`. Usado por `ProductModal.tsx`,
`CartProvider.tsx`, `FavoritesProvider.tsx` y `CompareProvider.tsx` para
resolver un id guardado (carrito/favoritos/comparar solo guardan `productId`,
no el producto completo) al objeto `FeaturedProduct` completo. Público.

**Respuesta `200`:** `{ "ok": true, "data": { /* FeaturedProduct */ } }`

**Errores:** `404 NOT_FOUND` (el front debe tolerarlo: hoy si
`getProductById` devuelve `undefined` la línea de carrito/favorito se omite
en vez de romper — mantener ese comportamiento con un 404 silencioso).

### `GET /api/v1/catalog/:id/related`

Front: reemplaza `getRelatedProducts(product, limit)`, usado en el modal de
producto ("También te puede interesar"). Query opcional `?limit=4` (default
4). Misma categoría, excluyendo el propio id. Público.

**Respuesta `200`:** `{ "ok": true, "data": [ /* FeaturedProduct[] */ ] }`

### Cómo enchufar

`app/api/productos/route.ts` deja de importar `data/products.ts` y hace
`fetch` (o llama directo a la capa de datos real) manteniendo la forma de
salida `{ products: FeaturedProduct[] }` que ya consume el front, **o** se
apunta el front directo a `/api/v1/catalog` y se borra esa ruta intermedia —
cualquiera de las dos funciona, la segunda es más simple.

---

## 3. Cuentas de la tienda (clientes)

Hoy `AuthProvider.tsx` + `lib/auth-local.ts` crean la cuenta **100% en el
cliente**: contraseña hasheada con `SHA-256` + salt en el propio navegador
(`hashPassword()`), guardada en `localStorage` (`chamo-accounts-v1`), sesión
en `chamo-session-v1`. Suficiente para demo, **no** para producción — un
backend real debe hashear con `bcrypt`/`argon2` del lado del servidor, nunca
reusar `hashPassword()` del front.

Distinto de la sesión del panel (`chamo_admin_session`, ver
`API_CONTRACT.md`) — son dos sistemas de auth separados hoy;
`lib/admin-permissions.ts` / `CLAUDE.md` §10 ya anota unificarlos a futuro.

### `POST /api/v1/store/register`

Front: reemplaza `createAccount()` en `lib/auth-local.ts`, llamado desde
`AuthForm.tsx` (pestaña "Registrarse").

**Body**

```json
{ "name": "Juan Pérez", "email": "juan@empresa.pe", "password": "mínimo 6 caracteres" }
```

**Respuesta `200`**

```json
{
  "ok": true,
  "data": {
    "id": "usr_…",
    "name": "Juan Pérez",
    "email": "juan@empresa.pe",
    "role": "customer",
    "phone": "", "photo": "", "company": "", "ruc": "", "bio": "", "banner": "",
    "token": "eyJhbGciOi…"
  }
}
```

También enviar `Set-Cookie` de sesión (httpOnly). `role` es `"customer"`
salvo la primera cuenta creada en el mock actual (hoy la primera cuenta del
navegador es `"admin"` de la tienda — **regla de demo, no trasladar tal cual
a producción**; en un backend real el rol se asigna por invitación o panel,
no por "quién se registró primero").

**Errores:** `400 VALIDATION` (nombre vacío, correo inválido, contraseña
corta), `409 CONFLICT` (correo ya registrado).

### `POST /api/v1/store/login`

Front: reemplaza `verifyAccount()` + guardar sesión, llamado desde
`AuthForm.tsx` (pestaña "Iniciar sesión").

**Body:** `{ "email": "…", "password": "…" }`

**Respuesta `200`:** igual forma que `register`. **Errores:**
`401 INVALID_CREDENTIALS`.

### `POST /api/v1/store/logout`

Front: cierra sesión desde el menú "Mi cuenta" del `Navbar.tsx`. Invalida el
token y borra la cookie. **Respuesta `200`:** `{ "ok": true, "data": { "loggedOut": true } }`.

### `GET /api/v1/store/session`

Front: hidratación de `AuthProvider.tsx` al montar — reemplaza leer
`chamo-session-v1` de `localStorage`. Devuelve `null` en `data` (sin sesión)
o el mismo objeto `AuthUser` de `register`/`login` (sin `token`, ya viene en
la cookie).

### `PATCH /api/v1/store/profile`

Front: reemplaza `updateAccountProfile()`, llamado desde
`AccountProfileForm.tsx` (`/cuenta/perfil`, `/cuenta/empresa`). Body parcial:
`{ name?, phone?, photo?, company?, ruc?, bio?, banner? }` — mismos campos
que `ProfilePatch` en `lib/auth-local.ts`. Requiere sesión.

**Respuesta `200`:** `{ "ok": true, "data": { /* AuthUser actualizado */ } }`

**Errores:** `401 UNAUTHORIZED`, `400 VALIDATION` (mismas reglas que
`validateProfilePatch()`: nombre ≥ 2 caracteres, teléfono obligatorio si
`requirePhone`, RUC de 8-11 dígitos si viene, bio ≤ 160 caracteres).

> La foto de perfil hoy es una **data URL** (base64) guardada en
> `localStorage` (`chamo-profiles-v1`), no en la cuenta — ver §5 de este
> documento (imágenes) antes de mandarla tal cual a un body JSON en
> producción: para fotos reales conviene un endpoint de subida aparte
> (`POST /api/v1/uploads`) que devuelva una URL, y que `photo` guarde esa URL
> en vez del base64 completo.

---

## 4. Carrito, favoritos y comparar

Los tres son hoy arrays en `localStorage`, reescritos completos en cada
cambio (`CartProvider.tsx` → `chamo-cart-v1`, `FavoritesProvider.tsx` →
`chamo-favorites-v1`, `CompareProvider.tsx` → `chamo-compare-v1`). El patrón
más simple para el backend es replicar exactamente eso: **un recurso por
cliente que se lee entero y se reemplaza entero**, no operaciones línea por
línea — así el front cambia lo mínimo posible.

**Decisión de producto ya tomada por defecto** (estándar del rubro; ajustar
si el cliente pide otra cosa): mientras **no** hay sesión de cliente, todo
sigue en `localStorage` tal cual está hoy (carrito de invitado, por
dispositivo). Al iniciar sesión, el front debe **fusionar** el carrito local
con el del servidor (sumar cantidades por `productId` repetido) y a partir de
ahí leer/escribir contra estos endpoints. Esto es exactamente lo que ya
recomienda `docs/MANUAL.md` §A.13.4 ("depende de cuentas reales") — **por
eso van después de §3 en el orden de implementación**, no antes.

### `GET /api/v1/store/cart` · `PUT /api/v1/store/cart`

Front: reemplaza los dos `useEffect` (leer/escribir `localStorage`) de
`CartProvider.tsx`. Requiere sesión.

**`PUT` body / respuesta `200` de ambos:**

```json
{
  "ok": true,
  "data": [
    { "productId": "sku-123", "quantity": 2, "unitPrice": 45.9, "wholesaleUnitPrice": 39.9 }
  ]
}
```

Forma exacta = `CartLine[]` (`components/CartProvider.tsx`). El front manda
el array completo en cada `PUT` (mismo comportamiento que hoy con
`localStorage.setItem`).

### `GET /api/v1/store/favorites` · `PUT /api/v1/store/favorites`

Front: reemplaza `FavoritesProvider.tsx`. Body/respuesta: `{ "ok": true, "data": ["sku-123", "sku-456"] }`
(array de `productId`, mismo shape que `ids` hoy).

### `GET /api/v1/store/compare` · `PUT /api/v1/store/compare`

Front: reemplaza `CompareProvider.tsx`. Igual que favoritos pero limitado a
3 elementos (`COMPARE_LIMIT`) — **validar el límite también en el backend**,
no solo en el front. Prioridad más baja que carrito/favoritos: es estado de
comparación efímero, no hay urgencia de negocio en persistirlo entre
dispositivos — se puede dejar en `localStorage` indefinidamente sin problema
si se quiere ahorrar ese endpoint.

**Errores (los tres):** `401 UNAUTHORIZED` (sin sesión — el front debe caer
de nuevo a `localStorage` de invitado, no romper la página).

---

## 5. Imágenes subidas desde el panel

Hoy **todas** las imágenes que un admin sube desde el panel (fotos de
producto en `AdminNewProductForm.tsx`, foto de perfil, logos de categoría,
banners, foto de equipo) se leen con `readCmsImageFile()`
(`lib/cms-image.ts`) y se guardan como **data URL en base64**, directo dentro
del JSON/objeto que ya viaja por `localStorage` o (en el mock) por
`services/adminApi.ts`. Límite actual: **60 MB por imagen** (`MAX_PRODUCT_IMAGE_BYTES`).

Esto funciona para el mock pero **no** es el patrón que debe recibir un
backend real: un producto con 5 fotos de varios MB cada una en base64 vuelve
el JSON del endpoint gigante y lento. Antes de conectar cualquier endpoint
que hoy reciba `images: string[]` con contenido base64 (`POST/PUT
/api/v1/products` del panel, `PUT /api/v1/site-content`, `PATCH
/api/v1/store/profile`):

1. Agregar un endpoint de subida, p. ej. `POST /api/v1/uploads`
   (`multipart/form-data` o URL prefirmada a un bucket) que devuelva
   `{ "ok": true, "data": { "url": "https://…" } }`.
2. En el front, donde hoy se llama `readCmsImageFile()` para obtener el data
   URL y guardarlo en el estado (`AdminNewProductForm.tsx` función
   `handleFiles`, y los demás formularios con `CmsImageField.tsx`), subir el
   archivo a ese endpoint primero y guardar la `url` devuelta en vez del data
   URL completo.
3. Los campos que hoy son `string` (data URL) — `images[]` de producto,
   `photo` de perfil/usuario, `image` de categoría, `src` de banner/slide —
   no cambian de tipo (siguen siendo `string`), solo cambia **qué** valor
   contienen: una URL corta en vez de un blob base64.

No es bloqueante para arrancar el backend (el mock actual acepta cualquier
`string` en esos campos), pero **sí conviene resolverlo antes de subir fotos
reales de producto** — 60 MB en base64 por imagen no es viable en producción.

---

## Cómo enchufar el front (resumen)

1. **CMS** — `ContentProvider.tsx`: `fetch('/api/v1/site-content')`.
2. **Catálogo** — `app/api/productos/route.ts` o los componentes que llaman
   `getProductById`/`getRelatedProducts` directo.
3. **Cuentas** — `AuthProvider.tsx` + borrar `lib/auth-local.ts` del cliente
   (el hash de contraseña pasa a vivir solo en el backend).
4. **Carrito/Favoritos/Comparar** — `CartProvider.tsx`, `FavoritesProvider.tsx`,
   `CompareProvider.tsx`: mismo patrón (`useEffect` de hidratación +
   `useEffect` de guardado) apuntando a estos endpoints cuando hay sesión, con
   `localStorage` de respaldo cuando no la hay (invitado).
5. **Imágenes** — resolver §5 antes de subir fotos reales de producto.

No mezclar con `API_CONTRACT.md` (panel admin) — son dos sesiones y dos
bases de datos de usuarios distintas hoy (`chamo_admin_session` vs.
`chamo-session-v1`); `CLAUDE.md` §10 ya tiene anotado unificarlas cuando
exista un único backend de usuarios.

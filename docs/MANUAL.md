# Documentación técnica y manual de usuario — Chamo Import Front

Última actualización: **2026-09-11**

Este documento junta las dos caras del proyecto: cómo está construido (para quien
programa) y cómo se usa hoy (para negocio/operación). Se actualiza junto con cada
cambio visible o estructural — ver el flujo en [`docs/README.md`](./README.md).

---

## Parte A — Documentación técnica

### A.1 Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (tokens en `app/globals.css`, sin `tailwind.config`)
- Lucide React (iconografía)
- Fuentes: Barlow / Barlow Semi Condensed (`app/layout.tsx`)

### A.2 Marca (tokens)

| Token | Hex | Uso |
| --- | --- | --- |
| `brand-dark` | `#0B3554` | Tipografía, barra superior, footer |
| `brand-primary` | `#127EC9` | CTAs, bordes brillantes, acentos |
| `brand-gold` | `#E4B714` | Badges Oferta/Nuevo, detalles |
| `brand-gray` | `#F4F4F4` | Fondos suaves |
| `brand-whatsapp` | `#25D366` | Burbuja flotante y CTAs de WhatsApp |

### A.3 Estructura relevante

```
app/page.tsx              # Home: orden de secciones
app/categorias/           # Listado + detalle [slug]
app/catalogo/             # Búsqueda y filtros (API)
app/carrito/              # Cotización local
app/favoritos/            # Lista persistida (localStorage)
app/comparar/             # Comparación de hasta 3 SKUs
app/admin/                # Panel: login público + (panel) protegido por cookie
app/cotizar/              # Formulario + WhatsApp
app/api/productos/        # GET catálogo filtrable (tienda, no el admin)
types/admin.ts            # Contrato TS del panel (User, Product, Order, KPIs…)
services/adminApi.ts      # Mock `/api/v1` (300 ms) — ver API_CONTRACT.md
lib/auth.ts               # Sesión del panel (cookie + localStorage)
lib/auth-local.ts         # Cuentas de la tienda (otro almacén)
app/terminos/ /privacidad/
components/
  Navbar.tsx              # Header 3 niveles (categorías = mainCategories)
  CartProvider.tsx        # Carrito en localStorage
  FavoritesProvider.tsx   # Favoritos en localStorage
  CompareProvider.tsx     # Comparar (máx. 3) en localStorage
  ContentProvider.tsx     # Overlay CMS local de banners/categorías
  AuthProvider.tsx        # Cuentas locales + sesión de la tienda (`role` admin/customer)
  admin/AdminShell.tsx    # Sidebar + header; recibe `AuthSession` del layout
  admin/AdminLoginForm.tsx
  admin/SiteContentEditor.tsx  # CMS local de banners/categorías
  CategoryCollage.tsx     # Grilla 2×2 de productos/marcas de la línea
  CatalogFilters.tsx      # Filtros de /catalogo
  CategoryBanner.tsx      # Detalle de categoría → PageBanner
  PageBanner.tsx          # Banner ancho (categorías, /nosotros, /contacto)
  StampHeading.tsx        # Encabezado sticker (catálogo, nosotros, ofertas, contacto)
  CategoryIcon.tsx        # Iconos Lucide por categoría
  Reveal.tsx              # Fade/slide al entrar en viewport
  IntroSplash.tsx         # Puertas (logo y /carrito) + BrandLoader en el resto
  Preloader.tsx           # Carga inicial → BrandLoader
  BrandLoader.tsx         # Logo + engranaje + CARGANDO... (entrada y nav interna)
  ProductCard.tsx / ProductCatalog.tsx / ProductModal.tsx
  FavoriteButton.tsx / Testimonials.tsx / Breadcrumbs.tsx
  QuoteForm.tsx
  ContactForm.tsx           # /contacto → WhatsApp
data/
  contact.ts               # Teléfono, WhatsApp, correo, horario, Maps
  company.ts               # Historia / misión / visión (placeholder)
  testimonials.ts          # Prueba social B2B de ejemplo
  media.ts                 # Slides / logo / icon
  home.ts                   # trustItems, mainCategories, distributorBrands
  products.ts               # Catálogo de ejemplo + searchCatalog
  admin.ts                  # Gráfica 7 días + ranking demo (KPIs vienen del mock API)
public/images/slider/       # baner-1.png … baner-3.png
public/images/categorias/   # Fotos locales por categoría
public/images/marcas/       # Wordmarks SVG
```

### A.4 Home — orden actual

1. `Navbar`
2. `HeroSlider`
3. `BrandsCarousel`
4. `TrustInfoBar`
5. `main` → `CategoriesGrid` + `FeaturedOffers` + `Testimonials`

### A.5 Categorías (`data/home.ts` → `mainCategories`)

Cada ítem: `slug`, `href`, `label`, `bannerTitle`, `eyebrow`, `bullets` (3), `image` (local), `imageAlt`, `tint`. Opcional: `bannerImage` (fondo del detalle).

Fuente única también del dropdown **Categorías** del Navbar (cada línea lleva
icono Lucide: llave, rayo, escudo, casa, martillo, casco, cubeta).

**Actual (7):** Ferretería, Electricidad, Seguridad, Hogar, Herramientas, Construcción, Pinturas.

UI en `CategoriesGrid.tsx`: **carrusel horizontal en todos los breakpoints**
(`snap-x` + scroll). En PC/móvil hay **flechas circulares** (arriba a la derecha)
que desplazan una tarjeta; también se puede deslizar. En modo oscuro las tarjetas
usan fondo `#102a40` y texto claro para contraste.

Detalle `/categorias/[slug]`: banner ancho (`PageBanner` vía `CategoryBanner`) con la foto de la
línea, título centrado en mayúsculas (`bannerTitle`, p. ej. **ELÉCTRICOS**) y
chips de marcas de esa categoría. Los productos van debajo, a todo el ancho.

`/nosotros` reutiliza el mismo `PageBanner` con el encabezado sticker **SOBRE NOSOTROS**. Textos de
empresa (historia, misión, visión, valores) viven en `data/company.ts` y son
placeholder hasta ficha oficial del cliente.

### A.5b Animaciones de entrada

- Al **cargar o refrescar** la pestaña: `Preloader` → `BrandLoader` — fondo `#0B3554`,
  logo oficial (`/logo.png`) entra de izquierda a derecha (`x: -100 → 0`, fade in),
  `/engranaje.png` gira debajo (60×60) y el texto **CARGANDO...** en `brand-gold`.
  A los **2.5 s** hace fade-out y se desmonta (`z-[90]` para cubrir Navbar y WhatsApp).
- Al navegar a **otras páginas** (Catálogo, Categorías, Ofertas, Nosotros, etc.):
  el mismo `BrandLoader` de 2.5 s. No se apila con el preloader de la primera
  carga. Un clic dispara **una sola vez** (el `pathname` no lo repite).
- Al clic en el **logo**: `IntroSplash` — puertas azules se cierran, gira un engranaje
  Lucide (`Cog`) y se abren (~2.7s en desktop, un poco menos en móvil). Ese clic
  **reclama** la navegación para que, con `prefers-reduced-motion`, no se encadene
  un `BrandLoader` de 2.5 s al llegar a `/`.
- Al entrar a **`/carrito`**: las mismas puertas, pero el centro es un **carrito**
  Lucide (`ShoppingCart`) dorado. Entra desde la izquierda y **se estaciona entero
  detrás (a la izquierda) de la costura dorada**. Al abrirse las puertas, vuelve al
  **recorrido normal** (centro del hueco y salida a la derecha). Un clic en el navbar
  dispara la intro **una sola vez** (el cambio de `pathname` no la repite).
- Mientras corre cualquiera, `html` lleva la clase `intro-playing`
  (`overflow: hidden !important`) para que el Navbar no libere el scroll del body.
- Cambiar de producto **dentro del modal** (sin cambiar de ruta) no muestra este loader.
- Tamaños con `clamp`/`vmin` y `100dvh` para que el engranaje y las puertas entren en
  móvil y en landscape.
- Slider, banners de página, categorías, productos y el resto de bloques: `Reveal`
  (fade + slide-up al entrar en viewport).
- Si el usuario pide menos movimiento (`prefers-reduced-motion`), no hay animación.

### A.5c Panel de administración

> Resumen rápido — la referencia completa (arquitectura, credenciales, qué es real vs
> placeholder, cómo conectar el backend) está en **[A.12 🎛️ Dashboard](#a12-🎛️-dashboard--panel-de-administración)**.

El árbol `/admin` se parte en dos layouts para no bloquear el login:

- `app/admin/layout.tsx` — solo metadata.
- `app/admin/login` — formulario contra `loginAdmin()` (mock). Credenciales de
  demo: `admin@local.test` / `admin123` (no son datos oficiales).
- `app/admin/(panel)/layout.tsx` — lee `getAdminSession()` (cookie
  `chamo_admin_session`, sin delay de red). Si no hay sesión →
  `redirect('/admin/login')`. Envuelve `AdminShell` con esa sesión.
- `logoutAdmin()` borra cookie + `localStorage` (`chamo-admin-session-v1`) y
  vuelve al login. **No** cierra la cuenta de la tienda.

Tipos: `types/admin.ts`. Cliente: `services/adminApi.ts` (300 ms + comentarios
`TODO Backend`). Contrato HTTP: [`API_CONTRACT.md`](../API_CONTRACT.md) en la
raíz del repo.

El dashboard pinta **DashboardKPIs** (`totalSales`, `pendingOrders`,
`lowStockCount`, `newClientsCount`). Productos y pedidos ya listan/crean/cambian
estado contra el mock. Banners y categorías del CMS local siguen en
`/admin/banners` y `/admin/categorias`. El resto del menú es placeholder.
Navegar dentro de `/admin` **no** dispara el BrandLoader de la tienda.

### A.6 Productos y modal (`data/products.ts` → `ProductModal.tsx`)

Cada producto incluye `category` / `categoryLabel`, `specs[]` (ficha técnica) y
`packaging`. Helpers: `getRelatedProducts`, `searchCatalog`, `getProductsByCategory`.
Hay **al menos 3 productos por categoría** (22 SKUs de ejemplo).

El listado público pasa por `GET /api/productos?q=&category=&brand=`.
`CartProvider` guarda líneas `{ productId, quantity, unitPrice, wholesaleUnitPrice }`
en `localStorage` (`chamo-cart-v1`) — el precio se guarda al agregar, no se recalcula
solo si el catálogo cambia de precio después; `/carrito` avisa si detecta que cambió.
Líneas del formato viejo (`{productId, qty}`, sin precio) se migran solas al leer.
`FavoritesProvider` guarda IDs en `chamo-favorites-v1`; el corazón de la tarjeta y del
modal persiste, muestra el aviso fijo **Guardado en favoritos** y el Navbar lleva el contador.

Modal (diseño ficha):
1. Galería + thumbs  
2. Marca / SKU / OFF, descripción, caja de precios, stock, cantidad, CTAs  
3. Tabla **Especificaciones técnicas**: cabecera `brand-dark` con columnas
   “Especificación / Detalle”, filas blancas / `#eef6fc`, esquinas redondeadas + borde brillante  
4. **Productos relacionados de la misma categoría** (clic cambia el producto del modal)

WhatsApp unificado: `data/contact.ts` → `wa.me/51959723602`. Los formularios de
`/contacto` y `/cotizar` abren el chat con `openWhatsApp()` (enlace `<a>`, no
`window.open`, para no perder el envío por el bloqueador de popups).
`FavoritesProvider` sincroniza el toast con un `idsRef` para que clics rápidos
no desfasen “Guardado” / “Quitado”.

### A.7 Slider

- Rutas y tamaño en `data/media.ts`; archivos `public/images/slider/baner-1.png` … `baner-3.png`.
- El hero **solo** muestra esas fotos (sin recuadro de ejemplo “Imagen del anuncio”, sin overlay de título).
- Carrusel: puntos + swipe; el bloque entero hace fade-in con `Reveal` igual que el resto del sitio.

### A.8 Datos oficiales de contacto

Fuente: `data/contact.ts`.

- Razón social: Chamo Import S.R.L.
- Teléfono / WhatsApp oficial: **+51 959 723 602** (`wa.me/51959723602`) — ya sincronizado en float, footer, cotizar, contacto y modal
- Ubicación: Lima, Perú — https://maps.app.goo.gl/mrh3WueTJErXS2sg6
- Correo `ventas@chamoimport.com` sigue provisional

### A.9 Navbar — interacción del menú principal

`components/Navbar.tsx`, barra `brand-primary` (nivel 3): el link activo y el hover
solo cambian el **color del texto a `brand-gold`** (sin bloque de fondo); el activo
además lleva una barra dorada animada debajo, calculada con `offsetLeft`/`offsetWidth`
del link marcado `data-nav-active="true"` (estado `navIndicator`, se recalcula al
cambiar `pathname`). Si se agregan ítems a `mainLinks`, el indicador los sigue solo.

### A.10 Auditoría UX 2026-09-10 (origen y cierre)

La nota [`cambios/2026-09-10-auditoria-ux-funcional.md`](./cambios/2026-09-10-auditoria-ux-funcional.md)
se tomó contra **`main` antiguo** (antes de catálogo/carrito). En el código actual:

- **Cerrado:** `/catalogo`, `/categorias`, `/carrito` y `/favoritos` responden (ya no 404).
- **Cerrado:** buscador del Navbar → `/catalogo?q=`; carrito y cotización persisten; favoritos persisten con badge y confirmación.
- **Cerrado:** fallback de logos en `BrandsCarousel` también mira `load` + `naturalWidth === 0` (no solo `onError`). Los wordmarks SVG ya están en `public/images/marcas/`.
- **Cerrado:** intro del carrito una sola vez por clic; ícono entero detrás de la costura al entrar y recorrido normal al salir.
- **Cerrado:** preloader con logo/engranaje oficiales; fade-out a los 2.5 s (`z-[90]`). El mismo overlay cubre la navegación interna.
- **Cerrado:** login/registro local, comparar (hasta 3), admin liviano `/admin`, collages de categoría, specs de ejemplo completas.
- **Sigue abierto (cliente / backend):** correo oficial, ficha de `/nosotros`, testimonios reales, logos oficiales, ERP, fichas técnicas oficiales.

### A.11 Scripts

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
npm test         # Vitest smoke (slider, categorías, búsqueda)
```

---

### A.12 🎛️ Dashboard — Panel de administración

Referencia única y completa del panel `/admin`: cómo se construyó, cómo funciona hoy
(con datos simulados) y las credenciales para entrar. La versión resumida vive en
[A.5c](#a5c-panel-de-administración) — esta sección es la de detalle.

#### A.12.1 Qué es

Un panel interno (`/admin/*`) para el equipo de Chamo Import: ver KPIs de ventas,
gestionar productos y pedidos, y editar los banners/categorías del home — **separado
del sitio público** (no lo ve un cliente ni aparece en el menú de la tienda). Hoy
corre 100% en el navegador con datos de ejemplo (`services/adminApi.ts`); está
armado para que un backend real lo reemplace endpoint por endpoint sin tocar la UI.

#### A.12.2 Cómo se creó (historia y arquitectura)

Se construyó en dos etapas, documentadas en `docs/cambios/`:

1. **v1 — admin liviano** (2026-09-10,
   [`2026-09-10-sugerencias-login-comparar-admin.md`](./cambios/2026-09-10-sugerencias-login-comparar-admin.md)):
   una sola página `/admin` protegida con la **cuenta de la tienda**
   (`role: "admin"` en `lib/auth-local.ts`, la primera cuenta creada en el navegador),
   solo para editar banners y textos de categorías (`chamo-cms-v1`).
2. **v2 — panel completo, listo para backend** (2026-09-11,
   [`2026-09-11-admin-api-contract.md`](./cambios/2026-09-11-admin-api-contract.md)):
   se reestructuró en un panel de verdad, con **sesión propia** (no la de la tienda),
   sidebar con 10 secciones, dashboard de KPIs, alta/listado de productos, gestión de
   pedidos, y un contrato HTTP completo (`API_CONTRACT.md`) para que el desarrollador
   de backend sepa exactamente qué endpoints implementar.

Piezas clave (v2):

| Archivo | Rol |
| --- | --- |
| `types/admin.ts` | Contrato de datos en TypeScript: `AuthSession`, `Product`, `Order`, `DashboardKPIs`, `LoginCredentials`, etc. — 1:1 con lo que describe `API_CONTRACT.md` |
| `services/adminApi.ts` | Cliente **mock**: cada función simula un endpoint real con 300 ms de latencia y trae en un comentario la ruta HTTP que debe reemplazarla (`// TODO Backend: Reemplazar mock con fetch('/api/v1/...')`) |
| `lib/auth.ts` | Sesión del panel: lee/escribe la cookie `chamo_admin_session` (+ copia en `localStorage` para el cliente) |
| `app/admin/actions.ts` | Server Actions: `loginAdminAction`, `createProductAction`, `updateOrderStatusAction` — hacen de puente entre los componentes cliente y `lib/auth.ts`/`services/adminApi.ts` |
| `app/admin/login/page.tsx` + `components/admin/AdminLoginForm.tsx` | Login del panel (público) |
| `app/admin/(panel)/layout.tsx` | Layout protegido: si no hay sesión, `redirect('/admin/login')`; si hay, envuelve todo en `AdminShell` |
| `components/admin/AdminShell.tsx` | Sidebar (`#0B3554`) + header con el nombre/rol de la sesión y botón de salir |
| `components/admin/SiteContentEditor.tsx` | El editor de banners/categorías de la v1, reutilizado dentro del panel nuevo |
| `API_CONTRACT.md` (raíz del repo) | El documento de handover: cada endpoint, su body/respuesta de ejemplo, y el paso a paso para "enchufar" el backend real |

#### A.12.3 Cómo funciona

**Flujo de acceso:**

1. `GET /admin/login` — pública. Si ya hay sesión, redirige a `/admin`.
2. El formulario llama a `loginAdminAction` (Server Action) → `loginAdmin()` en
   `services/adminApi.ts` (valida contra las credenciales mock, ver A.12.4) →
   si es correcto, escribe la cookie `chamo_admin_session` (`lib/auth.ts`) y una
   copia en `localStorage` (`chamo-admin-session-v1`).
3. Cualquier ruta bajo `/admin/(panel)` (o sea, todo menos `/admin/login`) pasa por
   `app/admin/(panel)/layout.tsx`, que lee la cookie **en el servidor** con
   `getAdminSession()` — sin sesión válida, redirige de vuelta a `/admin/login`.
4. Con sesión válida, se renderiza `AdminShell` (sidebar + header) alrededor de la
   página pedida.
5. "Salir" llama a `logoutAdmin()`: borra cookie + `localStorage` y vuelve al login.
   **No** cierra la sesión de "Mi cuenta" de la tienda — son dos sistemas
   completamente aparte (ver A.12.5).

**Secciones del sidebar — qué es real y qué es placeholder hoy:**

| Sección | Ruta | Estado |
| --- | --- | --- |
| Dashboard | `/admin` | ✅ Real — KPIs desde `getDashboardKPIs()` (mock) |
| Productos → Ver productos | `/admin/productos` | ✅ Real — `getProducts({ q })`, búsqueda por SKU/nombre/marca |
| Productos → Crear producto | `/admin/productos/nuevo` | ✅ Real — `createProduct()`, valida SKU único; el `<select>` de categoría viene de `getCategories()` (no de `data/home.ts` directo) |
| Pedidos | `/admin/pedidos` | ✅ Real — `getOrders()` + cambiar estado (`updateOrderStatus`) |
| Banners | `/admin/banners` | ✅ Real — edita `chamo-cms-v1` (slider del home) |
| Categorías | `/admin/categorias` | ✅ Real — edita `chamo-cms-v1` (textos de líneas del home) |
| Marcas, Clientes, Inventario, Ofertas, Reportes, Configuración | `/admin/marcas`, etc. | 🚧 Placeholder — pantalla "próximamente", sin datos ni acciones |

**Datos:** todo lo "real" arriba corre contra `productsDb`/`ordersDb` **en memoria del
proceso de Next** (dentro de `services/adminApi.ts`) — se reinician con cada reinicio
del servidor de desarrollo, no hay base de datos todavía. El gráfico de ventas de 7
días y el ranking de SKUs del dashboard son datos de ejemplo fijos en `data/admin.ts`
(no tienen endpoint todavía, ver `API_CONTRACT.md`).

#### A.12.4 Credenciales para ingresar

> ⚠️ **Son credenciales de prueba, no una cuenta oficial de Chamo Import.** Están
> hardcodeadas en `services/adminApi.ts` (`MOCK_ADMIN_EMAIL` / `MOCK_ADMIN_PASSWORD`)
> solo para poder probar el panel mientras no existe backend. **Se deben borrar del
> código en cuanto el login real esté conectado** (ver A.12.5).

| Campo | Valor |
| --- | --- |
| URL | `/admin/login` (ej. `http://localhost:3000/admin/login` en desarrollo) |
| Correo | `admin@local.test` |
| Contraseña | `admin123` |
| Rol de la sesión | `admin` (el otro rol posible, `editor`, existe en el tipo pero ningún flujo lo asigna todavía) |
| Duración de la sesión | 8 horas (`ADMIN_SESSION_MAX_AGE_SECONDS` en `lib/auth.ts`) |

Cualquier otro correo/contraseña devuelve `INVALID_CREDENTIALS`. No hay
"olvidé mi contraseña" ni registro de nuevos usuarios del panel — mientras sea mock,
solo existe esta cuenta.

#### A.12.5 Dos sesiones distintas — no confundir

| | Sesión de la **tienda** | Sesión del **panel admin** |
| --- | --- | --- |
| Para qué | "Mi cuenta" del sitio público (favoritos, carrito, comparar) | Gestionar el negocio en `/admin` |
| Dónde vive | `lib/auth-local.ts` | `lib/auth.ts` |
| Storage | `chamo-accounts-v1` / `chamo-session-v1` (solo `localStorage`) | Cookie `chamo_admin_session` + copia en `localStorage` (`chamo-admin-session-v1`) |
| Cómo se entra | Se registra cualquiera desde `/login` | Con las credenciales mock en `/admin/login` |
| Quién es "admin" | La primera cuenta creada en ese navegador (`role: "admin"`) | La única cuenta del mock (`admin@local.test`) |
| Se cierran juntas? | No — cerrar una no afecta a la otra | |

Antes había un solo admin (v1, ligado a la cuenta de la tienda); ahora conviven las
dos porque el panel necesitaba una sesión que el **servidor** pudiera verificar (con
cookie) antes de pintar cualquier página, algo que la cuenta de la tienda
(`localStorage`, solo en el cliente) no podía dar. Pendiente documentado en
`CLAUDE.md` §10: unificar ambas cuando exista un solo backend de usuarios.

#### A.12.6 Conectar el backend real

Guía completa: [`API_CONTRACT.md`](../API_CONTRACT.md) (raíz del repo) — tiene, por
cada endpoint (`/api/v1/auth/login`, `/api/v1/dashboard/kpis`, `/api/v1/products`,
`/api/v1/orders`, etc.), el método, el body, la respuesta de ejemplo y los códigos de
error esperados. Resumen del "cómo enchufar":

1. Implementar los endpoints listados en `API_CONTRACT.md`.
2. En `services/adminApi.ts`, cambiar el cuerpo de cada función por un `fetch()` real
   al endpoint correspondiente, **manteniendo la misma firma** (el resto del panel no
   se entera del cambio).
3. En `lib/auth.ts` / `app/admin/actions.ts`, dejar que el `Set-Cookie` lo mande el
   backend (marcarla `httpOnly: true`) en vez de escribirla desde el cliente.
4. Borrar `MOCK_ADMIN_EMAIL`/`MOCK_ADMIN_PASSWORD` de `services/adminApi.ts`.

---

## Parte B — Manual de usuario (negocio / operación)

Describe **lo que se ve y se puede hacer hoy** en el sitio. Se actualiza cada vez que
cambia el comportamiento visible — incluso un cambio pequeño como reemplazar una imagen.

> ⚠️ **Importante para negocio/operación:** el catálogo, las categorías, el carrito,
> los favoritos y la **comparación** ya funcionan en el navegador (`localStorage`).
> El buscador lleva a `/catalogo`. WhatsApp sale prellenado por producto, carrito y
> **línea de categoría**. El login guarda cuentas **en este navegador**. Todavía **no**
> hay inventario/ERP. Correo, textos de `/nosotros` y testimonios reales siguen
> pendientes del cliente. Detalle en A.10 y
> [`SUGERENCIAS.md`](./SUGERENCIAS.md).

### B.1 Entrar al sitio

1. En desarrollo: `npm run dev` y abrir http://localhost:3000
2. En producción: URL pública del hosting (cuando esté desplegado)
3. Al entrar o refrescar, una pantalla `#0B3554` muestra el **logo oficial** entrando
   de izquierda a derecha, un engranaje girando y el texto **CARGANDO...**. A los
   **2.5 s** se desvanece y aparece el sitio. Si tocas el
   **logo**, las puertas azules con engranaje. Al entrar al **carrito**, las mismas
   puertas pero pasa un carrito dorado: frena **detrás** (a la izquierda) de la
   línea dorada y, al abrirse, cruza por el centro (recorrido normal). Al ir a
   Catálogo, Categorías, Ofertas u otras páginas se ve el **mismo loader** de
   entrada (logo + engranaje + CARGANDO...).

### B.2 Inicio (home)

**Barra superior**
- Buscar productos, cuenta, favoritos y carrito
- Menú: Inicio, Catálogo, Ofertas, Nosotros, Contacto
- El ítem activo del menú azul se marca en **dorado** (`brand-gold`) con una
  **barra inferior** que se anima al cambiar de página
- **Categorías** (desplegable)

**Slider de anuncios**
- Solo los banners reales (`baner-1.png` … `baner-3.png`); al recargar no aparece el recuadro azul de ejemplo
- Cambia automáticamente cada unos segundos; también con swipe en móvil o los puntos
- El banner se ve completo (sin recortar) y de borde a borde
- El slider y las secciones debajo (marcas, beneficios, categorías, ofertas, pie)
  **aparecen con fade-in** al cargar o al hacer scroll

**Marcas distribuidoras**
- Carrusel justo debajo del slider, para marcas que se comercializan/auspician
- Si un logo no carga, se muestra el nombre de la marca en texto

**Beneficios**
- Franja con envíos, venta mayorista, pagos (Yape/Plin/tarjetas) y atención a distribuidores

**Categorías principales**
- 7 tarjetas con borde brillante azul: Ferretería, Electricidad, Seguridad, Hogar,
  Herramientas, Construcción, Pinturas
- **Carrusel en móvil y PC**: flechas circulares ← → arriba a la derecha; también
  se puede deslizar con el dedo o el trackpad
- Cada una: icono Lucide, subtítulo, título, 3 beneficios, **Explorar**, **Cotizar línea** (WhatsApp) e imagen
- Enlace "Ver todas" → `/categorias` (listado) y **Explorar** → `/categorias/[slug]`

**Productos destacados / ofertas**
- **Carrusel de una sola fila** (igual que categorías): flechas circulares ← →
  arriba a la derecha en PC y móvil; también se puede deslizar
- Tarjetas con icono Lucide (oferta / destacado), precio, stock y "Añadir al carrito"; clic abre el detalle (modal)
- En el modal: precios unitario/mayorista, cantidad, cotización / WhatsApp,
  **ficha técnica** (tabla) y **productos relacionados** de la misma categoría
  (al tocar uno se abre ese producto en el mismo modal)

**WhatsApp**
- Botón flotante verde para cotizar / contactar (`+51 959 723 602`)
- En cada categoría: **Cotizar línea** abre WhatsApp con el nombre de esa línea

**Testimonios**
- Tres referencias de mayoristas de ejemplo (se reemplazan con casos reales del cliente)

**Pie de página**
- Enlaces, contacto, mapa, medios de pago, boletín, términos y privacidad

### B.3 Otras páginas

| Ruta | Uso |
| --- | --- |
| `/catalogo` | Encabezado sticker **NUESTRO CATÁLOGO**; búsqueda y filtros contra la API |
| `/categorias` | Todas las líneas; al elegir una, banner con el nombre centrado (p. ej. ELÉCTRICOS) y productos debajo |
| `/carrito` | Ítems guardados, cantidades, WhatsApp del pedido. Al entrar: puertas + carrito que se estaciona detrás de la costura (una vez por clic) y al abrir sale por el centro |
| `/favoritos` | Productos guardados (corazón); se mantienen en este navegador |
| `/comparar` | Hasta 3 SKUs lado a lado (precios, ficha de ejemplo, WhatsApp) |
| `/admin` | Panel (sidebar + dashboard). Requiere cookie `chamo_admin_session`. KPIs del mock `getDashboardKPIs()` |
| `/admin/login` | Login del panel (`admin@local.test` / `admin123` en el mock) |
| `/admin/productos` | Listado mock (`getProducts`). Query `?q=` |
| `/admin/productos/nuevo` | Alta mock (`createProduct`) |
| `/admin/pedidos` | Pedidos mock + cambio de estado |
| `/admin/banners` | Editar banners del slider (`chamo-cms-v1`) |
| `/admin/categorias` | Editar textos de líneas (`chamo-cms-v1`) |
| `/nosotros` | Banner con sticker **SOBRE NOSOTROS**, historia, misión, visión y valores (textos de ejemplo) |
| `/contacto` | Banner **NUESTRO CONTACTO**, tarjetas de WhatsApp/teléfono/correo/horario, formulario que abre WhatsApp (sin `window.open`), y mapa |
| `/ofertas` | Encabezado **OFERTAS DESCUENTOS** (azul + borde oro) y productos en oferta |
| `/cotizar` | Formulario mayorista + WhatsApp prellenado |
| `/terminos` / `/privacidad` | Políticas enlazadas desde el footer |
| Login (modal / cuenta) | Crear cuenta, entrar, recuperar contraseña y cerrar sesión (este navegador) |

### B.4 Contenido que el negocio puede cambiar sin programar

Hay un **panel de administración** en `/admin`. La sesión del panel es propia
(cookie `chamo_admin_session`, login en `/admin/login`; mock
`admin@local.test` / `admin123`). No es la misma cuenta que “Mi cuenta” de la
tienda. El dashboard muestra KPIs del contrato (`totalSales`, pedidos
pendientes, stock bajo, clientes nuevos). Productos y pedidos se gestionan
contra el mock documentado en [`API_CONTRACT.md`](../API_CONTRACT.md). Banners
del slider y textos de categorías se editan en `/admin/banners` y
`/admin/categorias` (`chamo-cms-v1`). El enlace “Editar contenido” del Navbar
sigue pidiendo `role: "admin"` de la tienda; al entrar a `/admin` hay que
iniciar la sesión del panel.

- Banners → `/admin/banners` o `public/images/slider/` + `data/media.ts`
- Categorías del home → `/admin/categorias` o `data/home.ts` + collage de productos de la línea
- Logos de marcas → `public/images/marcas/`
- Productos → `data/products.ts` (la UI de `/catalogo` los pide a `/api/productos`)
- Teléfono / WhatsApp / correo → `data/contact.ts`
- Testimonios del home → `data/testimonials.ts` (hoy ejemplo)
- Historia, misión y visión de `/nosotros` → `data/company.ts` (hoy placeholder)

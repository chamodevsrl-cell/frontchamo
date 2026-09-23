# Documentación técnica y manual de usuario — Chamo Import Front

Última actualización: **2026-09-22**

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
app/cuenta/               # Área cliente: resumen, perfil y empresa
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
  ContentProvider.tsx     # Overlay CMS local (slider, categorías, footer, banners de página, equipo)
  AuthProvider.tsx        # Cuentas locales + sesión + updateProfile (cualquier rol)
  AccountShell.tsx        # Área cliente `/cuenta` (banner, tabs)
  AccountProfileForm.tsx  # Editar nombre, foto, teléfono / empresa
  AccountAvatar.tsx       # Avatar (foto, preset o iniciales)
  admin/AdminShell.tsx    # Sidebar + header + banner de pestaña (azul/oro)
  admin/AdminPageHero.tsx # Franja de título de cada sección del panel
  admin/AdminLoginForm.tsx
  admin/AdminFooterSettings.tsx  # Ajustes → Footer (dirección, mapa, pagos)
  admin/AdminChannelsSettings.tsx # Ajustes → Canales (WhatsApp, teléfono, correo, redes)
  admin/AdminBannersStudio.tsx   # Banners del home y de otras páginas (cartas)
  admin/AdminTeamCards.tsx       # Equipo de /nosotros en cartas
  admin/AdminCategoriesCards.tsx # Categorías en cartas + modal (nombre, descripción, imagen)
  admin/CmsImageField.tsx        # Imagen por URL o galería/carpetas (CMS)
  CategoryCollage.tsx     # Grilla 2×2 de productos/marcas de la línea
  CatalogFilters.tsx      # Filtros de /catalogo
  CategoryBanner.tsx      # Detalle de categoría → PageBanner
  PageBanner.tsx          # Banner ancho (categorías, /nosotros, /contacto)
  StampHeading.tsx        # Encabezado sticker (catálogo, nosotros, ofertas, contacto)
  CategoryIcon.tsx        # Iconos Lucide por categoría
  Reveal.tsx              # Fade/slide al entrar en viewport
  IntroSplash.tsx         # BrandLoader solo al cruzar admin/perfil (sin recargar)
  Preloader.tsx           # Carga inicial → BrandLoader
  BrandLoader.tsx         # Logo + engranaje + CARGANDO... (entrada y nav interna)
  ProductCard.tsx / ProductCatalog.tsx / ProductModal.tsx
  FavoriteButton.tsx / Testimonials.tsx / Breadcrumbs.tsx
  QuoteForm.tsx
  ContactForm.tsx           # /contacto → WhatsApp
  WrenchCursor.tsx          # Cursor a medida (desktop, hover: hover): negro puro,
                            # blanco sobre cualquier <img> (target.closest("img"))
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

Un único loader (`BrandLoader`) y **nada más** — no hay otra animación de
transición en el sitio (se quitaron las puertas del clic en el logo y la
variante especial de `/carrito`; ver
[`cambios/2026-09-21-simplificar-loader-transiciones.md`](cambios/2026-09-21-simplificar-loader-transiciones.md)).

- Al **cargar o refrescar** la pestaña: `Preloader` → `BrandLoader` — fondo `#0B3554`,
  logo oficial (`/logo.png`) entra de izquierda a derecha (`x: -100 → 0`, fade in),
  `/engranaje.png` gira debajo (60×60) y el texto **CARGANDO...** en `brand-gold`.
  A los **2.5 s** hace fade-out y se desmonta (`z-[90]` para cubrir Navbar y WhatsApp).
- Ese mismo `BrandLoader` (vía `IntroSplash.tsx`, sin recargar la página) **solo**
  se ve al cruzar una de estas fronteras — nada más, ninguna otra navegación
  dispara nada (Catálogo, Categorías, Ofertas, Nosotros, `/cuenta`,
  `/cuenta/empresa`, clic en el logo, `/carrito`, iniciar/cerrar sesión, etc.):
  - Entrar **o** salir de `/admin` (panel de administración).
  - Entrar **o** salir de `/cuenta/perfil` (editar perfil).
  - `isLoadBoundary(from, to)` en `IntroSplash.tsx` decide esto comparando el
    pathname anterior y el nuevo; un `click` sobre un link que cruza la frontera
    lo dispara al instante (sin esperar a que cambie el pathname), y un efecto
    sobre `usePathname()` es el respaldo para navegación programática.
- Mientras está visible, `html` lleva la clase `intro-playing`
  (`overflow: hidden !important`) para que el Navbar no libere el scroll del body.
- Si el usuario pide menos movimiento (`prefers-reduced-motion`), no se muestra
  (ni este loader al cruzar fronteras ni el de `Preloader` en la carga inicial).
- Slider, banners de página, categorías, productos y el resto de bloques: `Reveal`
  (fade + slide-up al entrar en viewport) — esto es aparte y no cambió.

### A.5c Panel de administración

> Resumen rápido — la referencia completa (arquitectura, credenciales, qué es real vs
> placeholder, cómo conectar el backend) está en **[A.12 🎛️ Dashboard](#a12-🎛️-dashboard--panel-de-administración)**.

El árbol `/admin` se parte en dos layouts para no bloquear el login:

- `app/admin/layout.tsx` — solo metadata.
- `app/admin/login` — redirige a `/login` (mismo modal de “Mi cuenta”). Credenciales de
  demo: `THE WINTER` / `Criper@11` (no son datos oficiales).
- `app/admin/(panel)/layout.tsx` — lee `getAdminSession()` (cookie
  `chamo_admin_session`, sin delay de red). Si no hay sesión →
  `redirect('/login')`. Envuelve `AdminShell` con esa sesión.
- Cerrar sesión (tienda o panel) borra cookie + `localStorage`
  (`chamo-admin-session-v1`) y la cuenta de “Mi cuenta”.

Tipos: `types/admin.ts`. Cliente: `services/adminApi.ts` (300 ms + comentarios
`TODO Backend`). Contrato HTTP: [`API_CONTRACT.md`](../API_CONTRACT.md) en la
raíz del repo.

El dashboard pinta **DashboardKPIs** (`totalSales`, `pendingOrders`,
`lowStockCount`, `newClientsCount`). Productos y pedidos ya listan/crean/cambian
estado contra el mock. Banners y categorías del CMS local siguen en
`/admin/banners` y `/admin/categorias`; `/admin/ofertas` tiene su propio
editor de banner (4 secciones) + una lista de solo lectura de los productos
en oferta (ver A.12 más abajo). El resto del menú es placeholder.
Navegar **dentro** de `/admin` no dispara el BrandLoader (solo al entrar o salir
del panel — ver A.5b).

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
   CMS local (`chamo-cms-v1`) para slider, textos de categorías, footer, banners de
   página y equipo de `/nosotros`.
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
| `app/admin/actions.ts` | Server Actions: `loginAdminAction`, `createProductAction`, `createCategoryAction`, `updateCategoryAction`, `updateOrderStatusAction` |
| `app/admin/login/page.tsx` | Redirige a `/login` (modal de Mi cuenta) o a `/admin` si ya hay cookie |
| `app/admin/(panel)/layout.tsx` | Layout protegido: si no hay sesión, `redirect('/login')`; si hay, envuelve todo en `AdminShell` |
| `components/admin/AdminShell.tsx` | Sidebar (`#0B3554`) + header + **banner de pestaña** azul/oro (`AdminPageHero`) |
| `components/admin/AdminCategoriesCards.tsx` | Cartas de categorías + modal de alta/edición (nombre, descripción, imagen) |
| `components/admin/CmsImageField.tsx` | Campo de imagen reutilizable: URL o galería/carpetas |
| `API_CONTRACT.md` (raíz del repo) | El documento de handover: cada endpoint, su body/respuesta de ejemplo, y el paso a paso para "enchufar" el backend real |

#### A.12.3 Cómo funciona

**Flujo de acceso:**

1. “Mi cuenta” en la tienda (o `GET /login`) — mismo modal para clientes y staff.
   Si las credenciales son de un `PanelUser` (p. ej. THE WINTER), además se escribe
   la cookie `chamo_admin_session`.
2. El formulario llama a `login()` de `AuthProvider` → primero cuentas de tienda,
   si no hay match prueba `loginAdminAction()` → `loginAdmin()` en
   `services/adminApi.ts`.
3. Cualquier ruta bajo `/admin/(panel)` pasa por
   `app/admin/(panel)/layout.tsx`, que lee la cookie **en el servidor** con
   `getAdminSession()` — sin sesión válida, redirige a `/login`.
4. Con sesión válida, se renderiza `AdminShell` (sidebar + header) alrededor de la
   página pedida. En la tienda, **Administrar** aparece dentro del menú de la cuenta (al hacer clic en el perfil), no como botón suelto en la barra.
   **Mi perfil** (`/cuenta/perfil`) está en el menú de cuenta de la tienda y del panel:
   cualquier rol (cliente, admin de tienda, Administrador/Editor/Almacén del panel)
   edita nombre, foto, teléfono y datos de empresa. El banner de `/cuenta` (`AccountShell`)
   muestra el nombre del usuario y, debajo, su **descripción breve** editable
   (`bio`, máx. 160 caracteres) en vez del rótulo fijo "Mi cuenta"; también admite
   una **foto de portada** propia (`banner`, máx. 3.5 MB) como fondo del banner.
5. "Salir" (tienda o panel) borra cookie + `localStorage` de ambas sesiones.

**Header del panel (`AdminShell.tsx`):** junto al buscador, siempre visible (sin
abrir ningún menú) hay **fecha y hora** (`clockLabel`, se oculta en móvil,
`toLocaleString("es-PE", …)`, se refresca cada 30 s) y el botón **Ver sitio**
(ícono en móvil, ícono + texto desde `sm:`) que abre la tienda en una **pestaña
nueva** (`target="_blank"`) para poder comparar cambios sin perder el panel
abierto. El menú desplegable de la cuenta (foto/avatar) ya no repite ese enlace.

**Secciones del sidebar — qué es real y qué es placeholder hoy:**

| Sección | Ruta | Estado |
| --- | --- | --- |
| Dashboard | `/admin` | ✅ Real — KPIs desde `getDashboardKPIs()` (mock) |
| Productos → Ver productos | `/admin/productos` | ✅ Real — `getProducts({ q })`, búsqueda por SKU/nombre/marca |
| Productos → Crear producto | `/admin/productos/nuevo` | ✅ Real — wizard de 4 fases (Datos/Detalle/Precios/Especs) con vista previa en vivo; imágenes por **galería/carpetas** (máx **60 MB** por imagen, `MAX_PRODUCT_IMAGE_BYTES` en `lib/cms-image.ts`) o **URL**; `createProduct()` se llama al terminar la fase 4; el `<select>` de categoría une `getCategories()` + líneas del CMS. Fase 3 suma **En oferta + precio anterior + % de descuento** (badge "-X% OFF", independiente del precio anterior); Fase 4 suma **Presentaciones de venta**, con las unidades saliendo del catálogo de `getUnits()` (gestionado en Productos → Unidades de medida) o creadas al toque con el campo de texto libre |
| Productos → Unidades de medida | `/admin/productos/unidades` | ✅ Real — `getUnits()` / `createUnit()` / `deleteUnit()`. Unidad, Docena y Caja vienen de fábrica y no se pueden borrar; las que se agregan quedan disponibles al toque como preset en la Fase 4 del wizard de producto |
| Productos → Ver productos (acciones) | `/admin/productos` | ✅ Real — cada fila tiene **Ver** (modal de solo lectura), **Editar** (`/admin/productos/[id]/editar`, mismo wizard precargado, llama `updateProduct()`) y **Eliminar** (confirmación, `deleteProduct()`) — `components/admin/AdminProductsTable.tsx` |
| Pedidos | `/admin/pedidos` | ✅ Real — `getOrders()` + cambiar estado (`updateOrderStatus`) |
| Ofertas | `/admin/ofertas` | ✅ Real — editor del **banner de 4 secciones** de `/ofertas` (`AdminOffersBannerEditor.tsx`, 4 casillas fijas) + lista de solo lectura de los productos con `badge === "oferta"` del catálogo público — ver debajo |
| Banners | `/admin/banners` | ✅ Real — cartas para el slider del home y los banners de Nosotros, Contacto, Ofertas y Catálogo (`chamo-cms-v1`). El banner de Ofertas es el de una imagen (fallback); el de 4 secciones se arma en `/admin/ofertas` |
| Categorías | `/admin/categorias` | ✅ Real — cartas (nombre, descripción, recuento de productos) + modal para editar/agregar; imagen por URL o galería; persiste en CMS (`customCategories`) y en el mock `createCategory`/`updateCategory` |
| Equipo | `/admin/equipo` | ✅ Real — cartas de colaboradores (se ven en `/nosotros`) |
| Ajustes | `/admin/ajustes` | ✅ Real — desglose: Footer (`/admin/ajustes/footer`) y Canales de atención (`/admin/ajustes/canales`). `/admin/configuracion` redirige al índice |
| Usuarios | `/admin/usuarios` | ✅ Real — tarjetas estilo carnet (foto, rol(es), último acceso, estado) desde `AdminUsersCards.tsx`; el modal "Editar" cambia **nombre, correo, contraseña y roles** (`updateUser()`, checkboxes — un usuario puede tener más de un rol), además de habilitar/suspender y **borrar** (`deleteUser()`). Alta (`createUser()`) también admite varios roles a la vez. No se puede deshabilitar, borrar ni cambiar los roles de la propia cuenta logueada. Esas cuentas entran por “Mi cuenta” |
| Roles | `/admin/roles` | ✅ Real — `getRoles()` + alta (`createRole()`). El login copia `permissions` a `AuthSession`; `AdminShell` filtra el sidebar |
| Marcas, Clientes, Inventario, Reportes | `/admin/marcas`, etc. | 🚧 Placeholder — pantalla "próximamente", sin datos ni acciones |

**Banner de 4 secciones de Ofertas** (`/admin/ofertas`, componente
`AdminOffersBannerEditor.tsx`): reemplaza el banner ancho normal de
`/ofertas` cuando las **4 casillas fijas** (Sección 1 a 4) tienen foto y un
destino (producto o URL) — con menos de 4 completas, cae al banner normal
de una sola imagen (editable en `/admin/banners`, sin panel de "Agregar
imagen": son siempre 4). Cuando está activo, la página muestra un
**`<h1>` "¡Mega ofertas!"** (con "ofertas" en `brand-gold`) y debajo la
grilla de 4 fotos con bordes gruesos (`border-[3px]`/`border-4`) y líneas
divisorias — sin panel de título oscuro ni banda de breadcrumb, ese modo
**reemplaza el banner entero** por completo. Entre el banner y la lista de
productos en oferta va el **carrusel infinito de marcas distribuidoras**
(`<BrandsCarousel variant="inline" />`, mismo componente y datos que el home,
dibujado como tarjeta redondeada) — reemplazó a la línea divisoria que
había antes. CMS: `CmsOfferBannerTile[]` (`lib/cms.ts`, campo `offerBanner` de
`CmsState`) — `{ id, image, alt, label, productId, url }`; si `url` tiene
contenido, gana sobre `productId` (el `<select>` de producto se deshabilita
en el panel). Front público: `components/OffersBanner.tsx`, usado en
`app/ofertas/page.tsx`. `/admin/ofertas` también lista (solo lectura) los
productos con `badge === "oferta"` del catálogo público, con un aviso: esa
lista **no** se actualiza marcando "En oferta" en `/admin/productos` — son
dos catálogos separados hasta que haya backend real. El wizard de producto
(Fase 3) sí tiene **"En oferta" + precio anterior + % de descuento** (badge
"-X% OFF").

Guardar cualquier CMS local (este banner, banners normales, equipo, footer,
canales, categorías) ya no rompe la página si `localStorage` se queda sin
espacio por fotos muy pesadas — `saveCms()` devuelve un mensaje de error en
vez de lanzar una excepción, y cada formulario del panel lo muestra en una
caja roja en vez de decir "Guardado" a medias. Detalle:
[`docs/cambios/2026-09-22-fix-crash-localstorage-lleno.md`](./cambios/2026-09-22-fix-crash-localstorage-lleno.md).

Historial completo de este banner (varias vueltas de diseño, la vuelta
actual es la última):
[`docs/cambios/2026-09-22-ofertas-rediseno-4-secciones-sin-panel.md`](./cambios/2026-09-22-ofertas-rediseno-4-secciones-sin-panel.md)
→
[`docs/cambios/2026-09-22-ofertas-4-secciones-sin-titulo-encima.md`](./cambios/2026-09-22-ofertas-4-secciones-sin-titulo-encima.md)
→
[`docs/cambios/2026-09-22-ofertas-separador-bordes-mas-gruesos.md`](./cambios/2026-09-22-ofertas-separador-bordes-mas-gruesos.md)
→
[`docs/cambios/2026-09-22-ofertas-titulo-mega-ofertas.md`](./cambios/2026-09-22-ofertas-titulo-mega-ofertas.md)
(el diseño anterior con panel oscuro y 3-4 imágenes variables se probó y se
revirtió — historial en
[`docs/cambios/2026-09-22-franja-imagenes-ofertas.md`](./cambios/2026-09-22-franja-imagenes-ofertas.md)
y
[`docs/cambios/2026-09-22-ofertas-revertir-franja-imagenes.md`](./cambios/2026-09-22-ofertas-revertir-franja-imagenes.md)).

**Datos:** todo lo "real" arriba corre contra `productsDb`/`ordersDb` **en memoria del
proceso de Next** (dentro de `services/adminApi.ts`) — se reinician con cada reinicio
del servidor de desarrollo, no hay base de datos todavía. El gráfico de ventas de 7
días y el ranking de SKUs del dashboard son datos de ejemplo fijos en `data/admin.ts`
(no tienen endpoint todavía, ver `API_CONTRACT.md`).

#### A.12.4 Credenciales para ingresar

> ⚠️ **Son credenciales de prueba, no una cuenta oficial de Chamo Import.** Viven
> en `services/adminApi.ts` (`usersDb` + mapa de contraseñas) para probar el panel
> mientras no existe backend. **Se deben borrar del código en cuanto el login real
> esté conectado** (ver A.12.5).

El campo del login acepta **nombre o correo**. Cuentas suspendidas no entran.

| Campo | THE WINTER (staff) | Admin Demo |
| --- | --- | --- |
| URL | “Mi cuenta” en la tienda (`/login`) | igual |
| Usuario | `THE WINTER` | `admin@local.test` |
| Correo | `thewinter@local.test` | `admin@local.test` |
| Contraseña | `Criper@11` | `admin123` |
| Rol | Administrador (`role_admin`, sesión `admin`) | Administrador |
| Duración | 8 horas (`ADMIN_SESSION_MAX_AGE_SECONDS`) | igual |

Otras semillas: Katia Ríos (`katia.demo@local.test` / `editor123`, rol Editor — no ve Usuarios/Roles) y Julio Paredes (`julio.demo@local.test`, suspendido). El alta en `/admin/usuarios` pide contraseña y esa cuenta puede entrar de inmediato.

Cualquier usuario/contraseña que no coincida devuelve `INVALID_CREDENTIALS`. No hay
"olvidé mi contraseña" del panel.

#### A.12.5 Dos sesiones distintas — no confundir

| | Sesión de la **tienda** | Sesión del **panel admin** |
| --- | --- | --- |
| Para qué | "Mi cuenta" del sitio público (favoritos, carrito, comparar) | Gestionar el negocio en `/admin` |
| Dónde vive | `lib/auth-local.ts` | `lib/auth.ts` |
| Storage | `chamo-accounts-v1` / `chamo-session-v1` / `chamo-profiles-v1` (foto y extras) | Cookie `chamo_admin_session` + copia en `localStorage` (`chamo-admin-session-v1`) |
| Cómo se entra | Se registra cualquiera desde “Mi cuenta” | Staff del panel, mismo modal (THE WINTER / `Criper@11`) |
| Quién es "admin" | La primera cuenta creada en ese navegador (`role: "admin"`) | Staff con rol Administrador (p. ej. THE WINTER o `admin@local.test`) |
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

Esto es solo el panel. Para conectar el **resto del sitio** (catálogo público,
cuentas de cliente, carrito, CMS que edita el panel, etc.) ver **[A.13](#a13-🔌-conectar-un-backend-real--tienda-y-panel)**.

---

### A.13 🔌 Conectar un backend real — tienda y panel

Hoy **nada** del sitio habla con un servidor propio: el panel usa un mock en
memoria ([A.12.6](#a126-conectar-el-backend-real)) y la tienda pública guarda
todo en el **`localStorage` del navegador de cada visitante** — sin backend no
hay nada compartido entre dispositivos, usuarios ni sesiones. Esta sección es
el mapa completo de qué pieza vive dónde y qué hace falta para reemplazarla.

**Resumen — qué vive dónde hoy:**

| Pieza | Dónde vive hoy | Alcance actual |
| --- | --- | --- |
| Panel admin (productos, pedidos, KPIs, usuarios, roles) | `services/adminApi.ts` (mock en memoria del servidor, se resetea al reiniciar `next dev`) | Ver [A.12](#a12-🎛️-dashboard--panel-de-administración) |
| Catálogo público | `data/products.ts` (array estático) vía `GET /api/productos` | Mismo catálogo de ejemplo para **todos** los visitantes; no se puede editar sin tocar código |
| Cuentas de la tienda (clientes) | `localStorage` del navegador (`AuthProvider.tsx` + `lib/auth-local.ts`) | Una cuenta creada en un navegador **no existe** en otro dispositivo |
| Carrito / cotización | `localStorage` (`CartProvider.tsx`) | Se pierde si el cliente cambia de navegador o borra datos del sitio |
| Favoritos | `localStorage` (`FavoritesProvider.tsx`) | Igual que el carrito |
| Comparar (hasta 3 SKUs) | `localStorage` (`CompareProvider.tsx`) | Igual que el carrito |
| CMS del panel (banners, categorías, footer, canales, equipo) | `localStorage` (`ContentProvider.tsx` + `lib/cms.ts`, clave `chamo-cms-v1`) | **Un admin que edita el home solo lo cambia en su propio navegador** — el resto de visitantes sigue viendo el contenido de fábrica |
| Formularios de Contacto / Cotizar | No se guardan — arman un mensaje y abren WhatsApp (`data/contact.ts` → `openWhatsApp()`) | Sin registro; si se pierde el chat de WhatsApp, se pierde el mensaje |

El punto más importante para el negocio: **el CMS del panel (§A.5c, A.12) no es
multiusuario ni persistente entre dispositivos todavía** — cualquier cambio que
el cliente haga en `/admin/banners`, `/admin/categorias`, `/admin/ajustes/*` o
`/admin/equipo` solo se ve en la computadora donde lo editó, hasta que exista
backend para el CMS.

> **Contrato HTTP exacto:** las piezas de **A.13.1 a A.13.4** (CMS, catálogo,
> cuentas, carrito/favoritos/comparar) tienen ahora contrato HTTP completo —
> endpoint, body y respuesta de ejemplo, igual de detallado que
> `API_CONTRACT.md` del panel — en
> [`API_CONTRACT_TIENDA.md`](../API_CONTRACT_TIENDA.md). El código además
> tiene un comentario `// TODO Backend` junto a cada punto exacto de
> integración (`ContentProvider.tsx`, `CartProvider.tsx`,
> `FavoritesProvider.tsx`, `CompareProvider.tsx`, `AuthProvider.tsx`,
> `app/api/productos/route.ts`, `data/products.ts`, `lib/cms-image.ts`,
> `lib/auth-local.ts`), mismo patrón que ya usaba `services/adminApi.ts`
> para el panel. La guía paso a paso de
> [`FRONTEND_DOCUMENTATION.md` §5](../FRONTEND_DOCUMENTATION.md#5-cómo-conectar-el-backend)
> sigue vigente como resumen narrativo — acá quedan los links, para no
> mantener el mismo texto en tres archivos.

#### A.13.1 Panel admin

Ver [A.12.6](#a126-conectar-el-backend-real) (arriba, en este mismo documento)
y [`FRONTEND_DOCUMENTATION.md` §5.1](../FRONTEND_DOCUMENTATION.md#51-panel-admin-lo-más-directo--ya-está-todo-preparado) —
reemplazar `services/adminApi.ts` función por función siguiendo
[`API_CONTRACT.md`](../API_CONTRACT.md).

#### A.13.2 Catálogo de productos (tienda pública)

Contrato exacto: [`API_CONTRACT_TIENDA.md` §2](../API_CONTRACT_TIENDA.md#2-catálogo-público).
Resumen: `app/api/productos/route.ts` usa `searchCatalog()` sobre
`data/products.ts` (array estático) — se reemplaza por una consulta real
manteniendo la forma `FeaturedProduct[]`; el resto de la tienda
(`ProductCatalog.tsx`, `CatalogFilters.tsx`, `ProductModal.tsx`, etc.) no
cambia si esa forma se mantiene. El detalle por id y los relacionados
(`getProductById`, `getRelatedProducts`) hoy **no** pasan por ninguna ruta
HTTP — el contrato agrega `GET /api/v1/catalog/:id` y
`GET /api/v1/catalog/:id/related` para eso (namespace `catalog`, no
`products`, para no pisar la ruta del panel — ver la nota al inicio de
`API_CONTRACT_TIENDA.md` §2).

#### A.13.3 Cuentas de la tienda (clientes)

Contrato exacto: [`API_CONTRACT_TIENDA.md` §3](../API_CONTRACT_TIENDA.md#3-cuentas-de-la-tienda-clientes).
Resumen: hoy `AuthForm.tsx` crea la cuenta en `localStorage`
(`chamo-accounts-v1`, contraseña hasheada **en el cliente** vía
`hashPassword()` de `lib/auth-local.ts`) — suficiente para demo, no para
producción. `AuthProvider.tsx` es el punto único a migrar a `fetch()` +
cookie `httpOnly` (mismo criterio que la sesión del panel).

#### A.13.4 Carrito, favoritos y comparar

Contrato exacto: [`API_CONTRACT_TIENDA.md` §4](../API_CONTRACT_TIENDA.md#4-carrito-favoritos-y-comparar).
Resumen: `CartProvider.tsx`, `FavoritesProvider.tsx` y `CompareProvider.tsx`
son 100% `localStorage`, sin backend. Depende de **A.13.3** (cuentas reales)
para tener sentido — dejar para el final. El contrato ya fija el patrón por
defecto: invitado sigue en `localStorage`, y al iniciar sesión se fusiona con
el carrito del servidor.

#### A.13.5 CMS del panel (banners, categorías, footer, canales, equipo)

Esta es la pieza que **más urge** conectar si el cliente va a operar el sitio
desde `/admin` en producción — hoy sus cambios no se comparten con nadie.
Contrato exacto ya escrito en
[`API_CONTRACT_TIENDA.md` §1](../API_CONTRACT_TIENDA.md#1-contenido-del-sitio-cms-del-panel).

1. Implementar `GET/PUT /api/v1/site-content`, que devuelve/recibe la misma
   forma que hoy tiene el objeto `CmsState` de `lib/cms.ts` (slides,
   categorías, footer, banners de página, equipo) — body/respuesta de
   ejemplo en el contrato de arriba.
2. En `ContentProvider.tsx`, reemplazar la lectura/escritura de
   `window.localStorage` (clave `CMS_KEY`) por `fetch()` a ese endpoint al
   montar, y `PUT`/`PATCH` en cada `set...()` que hoy solo actualiza el
   estado local.
3. Los componentes del panel que ya editan esto (`AdminBannersStudio.tsx`,
   `AdminCategoriesCards.tsx`, `AdminFooterSettings.tsx`,
   `AdminChannelsSettings.tsx`, `AdminTeamCards.tsx`) no necesitan cambios de
   UI — todos pasan por `useSiteContent()` (`ContentProvider.tsx`).
4. Importante: una vez conectado, decidir permisos de escritura en el backend
   (hoy cualquier sesión admin del panel puede editar todo — el contrato de
   `AdminPermission` en `types/admin.ts` ya distingue por sección, así que el
   backend puede reusar esos mismos permisos).

#### A.13.6 Formularios de Contacto y Cotizar

`QuoteForm.tsx` y `ContactForm.tsx` arman el mensaje y llaman
`openWhatsApp()` (`data/contact.ts`) — no hay nada que "conectar" salvo que el
negocio quiera **guardar un registro** antes de abrir WhatsApp (para que
aparezca en un futuro `/admin/cotizaciones` o `/admin/contactos` — descartado
por ahora, ver `docs/SUGERENCIAS.md`). Si se retoma: agregar un
`POST /api/v1/quotes` / `/api/v1/contacts` que se llame **antes** de
`openWhatsApp()`, sin bloquear el envío si falla (el mensaje de WhatsApp sigue
siendo el canal real).

#### A.13.7 Orden recomendado

1. **Panel admin** ([A.12.6](#a126-conectar-el-backend-real)) — ya tiene el
   contrato más completo escrito (`API_CONTRACT.md`).
2. **CMS del panel** (A.13.5) — es lo que más se nota si no se conecta (el
   cliente edita y "no pasa nada" para sus visitantes).
3. **Catálogo público** (A.13.2) — para que el panel de productos sea la
   fuente real de lo que se vende, no un mock aparte de `data/products.ts`.
4. **Cuentas de cliente** (A.13.3) — habilita compras/pedidos reales por
   cliente.
5. **Carrito/favoritos/comparar** (A.13.4) — depende de tener cuentas reales.
6. **Contacto/Cotizar** (A.13.6) — opcional, solo si el negocio quiere
   historial además de WhatsApp.

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
| `/cuenta` | Área cliente: resumen, Mi perfil y Mi empresa (cualquier rol con sesión) |
| `/comparar` | Hasta 3 SKUs lado a lado (precios, ficha de ejemplo, WhatsApp) |
| `/admin` | Panel (sidebar + dashboard). Requiere cookie `chamo_admin_session`. KPIs del mock `getDashboardKPIs()` |
| `/admin/login` | Redirige a `/login` (modal de Mi cuenta) |
| `/admin/productos` | Listado mock (`getProducts`). Query `?q=` |
| `/admin/productos/nuevo` | Alta mock (`createProduct`) |
| `/admin/productos/unidades` | Catálogo de unidades de medida reutilizables en "Presentaciones de venta" (`getUnits`/`createUnit`/`deleteUnit`) |
| `/admin/pedidos` | Pedidos mock + cambio de estado |
| `/admin/ofertas` | Editor del banner de 4 secciones de `/ofertas` (foto + producto o URL en cada una) + lista de productos en oferta del catálogo público |
| `/admin/banners` | Cartas para editar el slider del home y los banners de Nosotros/Contacto/Ofertas/Catálogo |
| `/admin/categorias` | Cartas de líneas: nombre, descripción, cantidad de productos, editar/agregar |
| `/admin/equipo` | Cartas de colaboradores (alta, foto, cargo, bio) |
| `/admin/ajustes` | Índice de ajustes (Footer y Canales). Alias: `/admin/configuracion` |
| `/admin/ajustes/footer` | Pie de tienda: frase, dirección, mapa, horario y pagos |
| `/admin/ajustes/canales` | WhatsApp (botón flotante), teléfono para llamar, correo y redes |
| `/nosotros` | Banner CMS, historia, misión, visión, **equipo de trabajo en cartas** y valores |
| `/contacto` | Banner CMS **NUESTRO CONTACTO**, tarjetas y mapa leen el footer de Ajustes, formulario WhatsApp |
| `/ofertas` | Banner CMS **OFERTAS DESCUENTOS** (o, con las 4 secciones completas en `/admin/ofertas`, el título **"¡Mega ofertas!"** + una grilla de 4 fotos con borde grueso en su lugar — clic en una abre el producto o la URL asignada) y productos en oferta |
| `/cotizar` | Formulario mayorista + WhatsApp prellenado |
| `/terminos` / `/privacidad` | Políticas enlazadas desde el footer |
| Login (modal / cuenta) | Crear cuenta, entrar, recuperar contraseña, **editar perfil** (`/cuenta/perfil`) y cerrar sesión (este navegador) |

### B.4 Contenido que el negocio puede cambiar sin programar

Hay un **panel de administración** en `/admin`. La sesión del panel es propia
(cookie `chamo_admin_session`, login en “Mi cuenta”; mock
`THE WINTER` / `Criper@11` o `admin@local.test` / `admin123`). El enlace
**Administrar** solo aparece con sesión del panel, y únicamente dentro del menú del perfil (desktop) o en el drawer móvil — ya no hay botón suelto en la barra.
El dashboard muestra KPIs del contrato. Productos y pedidos se gestionan contra
el mock documentado en [`API_CONTRACT.md`](../API_CONTRACT.md). El CMS local
(`chamo-cms-v1`) cubre:

- Banners (home + páginas) → `/admin/banners`
- Banner de 4 secciones de Ofertas (cada una con producto o URL) → `/admin/ofertas`
- Categorías (cartas, alta y foto) → `/admin/categorias`
- Footer (dirección, mapa, pagos) → `/admin/ajustes/footer`
- Canales de atención (WhatsApp, llamadas, correo, redes) → `/admin/ajustes/canales`
- Equipo de `/nosotros` → `/admin/equipo`
- Logos de marcas → `public/images/marcas/`
- Productos → `data/products.ts` (la UI de `/catalogo` los pide a `/api/productos`)
- Testimonios del home → `data/testimonials.ts` (hoy ejemplo)
- Historia, misión y visión de `/nosotros` → `data/company.ts` (hoy placeholder)

> ⚠️ Todo lo del CMS local se guarda en el navegador (`localStorage`), que
> tiene un límite de espacio (unos 5-10 MB según el navegador). Si al subir
> varias fotos aparece un aviso rojo de "No se pudo guardar: las imágenes
> son muy pesadas…", hay que sacar alguna foto o usar una más liviana antes
> de guardar de nuevo — ya no rompe la página, pero el cupo sigue existiendo
> hasta que las imágenes se guarden en un servidor real (ver A.13).

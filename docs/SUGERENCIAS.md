# Sugerencias para el proyecto

Última actualización: **2026-09-11**

Lista viva de mejoras. Al completar una, márcala como hecha y añade fecha. Al surgir una idea en un cambio, anótala aquí.

## 🔎 Evaluación UX / UI y funcional (2026-09-10)

Revisión original con el sitio de **`main` antiguo** (`npm run dev`), desktop y móvil.
Detalle: [`cambios/2026-09-10-auditoria-ux-funcional.md`](./cambios/2026-09-10-auditoria-ux-funcional.md).
Cierre de los huecos abiertos: [`cambios/2026-09-10-cierre-auditoria-ux.md`](./cambios/2026-09-10-cierre-auditoria-ux.md).

**Lo que funciona bien:**
- Navbar de 3 niveles con jerarquía clara; hover e ítem activo con indicador dorado animado.
- Hero slider full-bleed, carrusel de categorías con flechas y carrusel de productos.
- Modal de producto (ficha técnica + relacionados + WhatsApp con número oficial y mensaje prellenado).
- CTA de WhatsApp visible, coherente con venta B2B en Perú.

**Bugs de la auditoría — estado actual:**
- [x] 2026-09-10 — **Fallback de logos rotos.** `BrandsCarousel` ahora marca fallo con `onError`, `onLoad` y `naturalWidth === 0` (`lib/image.ts`). Los wordmarks SVG ya están en `public/images/marcas/`.
- [x] 2026-09-10 — **Rutas que daban 404 en `main`:** `/catalogo`, `/categorias`, `/carrito` (este PR, 2026-09-09) y `/favoritos` (esta pasada).
- [x] 2026-09-10 — **Intro scrolleable / WhatsApp bloqueado / toast de favoritos.** Clase `intro-playing`, `openWhatsApp()` y `idsRef` en favoritos. Detalle: [`cambios/2026-09-10-bugs-cambios-recientes.md`](./cambios/2026-09-10-bugs-cambios-recientes.md).

**Funciones que eran solo UI — estado actual:**
- [x] 2026-09-09 — El **buscador** navega a `/catalogo?q=`
- [x] 2026-09-09 — **Añadir al carrito** / **Agregar a cotización** persisten en `localStorage` y actualizan el badge
- [x] 2026-09-10 — **Login / registro** en este navegador (`chamo-accounts-v1`): crea cuenta, entra, recupera contraseña y cierra sesión. Pendiente migrar a backend.
- [x] 2026-09-10 — **Favoritos** persisten (`chamo-favorites-v1`), cuentan en el Navbar y confirman “Guardado”

## 🐛 Bugs nuevos en la intro/preloader (2026-09-10, revisión de Claude Code)

El usuario mandó una captura de la intro del carrito (línea dorada atravesando el
ícono) y describió que la animación se repite dos veces. Verificado en vivo levantando
esta rama en un servidor propio (puerto 3055) — detalle completo con evidencia medida
en [`cambios/2026-09-10-bugs-intro-preloader.md`](./cambios/2026-09-10-bugs-intro-preloader.md).

- [x] 2026-09-10 — **1. La intro del carrito se dispara dos veces para la misma navegación.** El clic reclama el ingreso (`cartClaimedByClick`) y el efecto de `pathname` no vuelve a disparar. Back/forward sí reproducen. Detalle: [`cambios/2026-09-10-bugs-intro-preloader.md`](./cambios/2026-09-10-bugs-intro-preloader.md).
- [x] 2026-09-11 — **2. La costura dorada atraviesa el ícono del carrito.** Park a `translate(-100% - 0.75rem)` (el ícono queda entero a la izquierda de la línea); al abrir, recorrido normal por el centro. Nota: [`cambios/2026-09-11-loader-nav-carrito-costura.md`](./cambios/2026-09-11-loader-nav-carrito-costura.md).
- [x] 2026-09-11 — Preloader con fade-out fijo a **2.5 s** (brief de logo + engranaje). Cubrir Navbar/WhatsApp con `z-[90]`.
- [x] 2026-09-10 — **3. El preloader ignoraba si la página realmente cargó.** Se implementó `window.load` + mínimo 1.2 s; el 2026-09-11 el brief volvió al timer de 2.5 s. Misma nota de intro + [`cambios/2026-09-11-preloader-2-5s-logo-engranaje.md`](./cambios/2026-09-11-preloader-2-5s-logo-engranaje.md).

## 🐛 Bugs nuevos (2026-09-11, revisión de Claude Code)

Revisión del estado actual de esta rama (tip `0e78c52`), centrada en `IntroSplash.tsx`
(loader de navegación interna, nuevo ese mismo día) y en las áreas que más importan de
cara a un backend real (cuentas, carrito, admin). Detalle completo:
[`cambios/2026-09-11-bugs-admin-loader-carrito.md`](./cambios/2026-09-11-bugs-admin-loader-carrito.md).

- [ ] **1. Doble pantalla de carga al hacer clic en el logo con `prefers-reduced-motion` activado.** En `IntroSplash.tsx`, el clic en `[data-site-intro]` llama `play("brand")` pero **no** marca `loadClaimedByClick.current = true` (a diferencia de la rama de carrito y la de links internos genéricos, que sí lo hacen). Con movimiento reducido, `play("brand")` se salta al instante (`setTimeout(hide, 0)`), así que cuando cambia el `pathname` un momento después, el `useEffect` que vigila la ruta no encuentra ningún "reclamo" y dispara **también** `play("load")` — un `BrandLoader` completo de 2.5s justo después del intro saltado. Doble pantalla de carga, y justo para el grupo de usuarios al que menos se le debería hacer esperar.
  - **Solución:** marcar `loadClaimedByClick.current = true` también en la rama `[data-site-intro]` (o, mejor, unificar los tres refs de "reclamo" en uno solo que registre qué variante ya quedó cubierta para la próxima navegación).
- [ ] **2. `/admin` no tiene control de rol — cualquier cuenta registrada entra.** `app/admin/page.tsx` solo verifica `if (!user)`; no existe ningún campo `role`/`isAdmin` en `AuthUser` ni en `StoredAccount` (`lib/auth-local.ts`). Como el registro es autoservicio (cualquiera crea una cuenta desde `/login`), cualquier visitante que se registre puede entrar a una página que dice "Admin de contenido". Hoy el impacto es bajo porque el CMS (`chamo-cms-v1`) también vive en `localStorage` de ese mismo navegador — no afecta a otros visitantes — pero es exactamente el tipo de hueco que se vuelve serio en cuanto haya un backend real detrás.
  - **Solución:** agregar `role: "customer" | "admin"` a `AuthUser`/`StoredAccount` desde ya, y cambiar la condición de `app/admin/page.tsx` a `user?.role === "admin"`. Ver también la recomendación de nombres para backend, abajo.
- [ ] **3. El carrito recalcula el precio en vivo del catálogo — no guarda el precio al agregar.** `CartLine` es solo `{ productId, qty }`; el total en `app/carrito/page.tsx` se calcula con `line.product.price` (el precio ACTUAL de `data/products.ts`), no con el precio que tenía el producto cuando se agregó. Si mañana el admin cambia un precio, el total del carrito de alguien que ya lo tenía agregado cambia solo, sin aviso.
  - **Solución:** guardar `unitPrice` (y opcionalmente `wholesaleUnitPrice`) en `CartLine` en el momento de `addItem`, y usar ese valor para el total — mostrando un aviso si el precio actual del catálogo difiere.

## 🏷️ Nombres de variables pensando en el backend futuro

Pedido explícito: usar nombres/formas de datos que faciliten conectar un backend real
más adelante, sin tener que reescribir todo. Los tipos actuales (`data/products.ts`,
`CartLine`, `AuthUser`) ya están bastante bien pensados — esto es más bien pulir
detalles antes de que haya más código escrito encima:

- **Cuentas (`lib/auth-local.ts`):** agregar `id: string` a `StoredAccount`/`AuthUser` — hoy la clave real es `email`, y un backend real siempre va a asignar su propio `id` primario. Agregar `role: "customer" | "admin"` (ver bug 2). Considerar `createdAt` para poder ordenar/auditar cuentas más adelante.
- **Carrito (`CartProvider.tsx`):** `qty` → `quantity` (más explícito, más común en APIs REST/GraphQL). Agregar `unitPrice` al agregar el ítem (ver bug 3) y `addedAt` si se quiere ordenar el carrito.
- **Favoritos (`FavoritesProvider.tsx`):** hoy es `ids: string[]` — si más adelante se sincroniza con una cuenta real o se quiere ordenar "agregado recientemente", va a hacer falta `{ productId: string; addedAt: string }[]` en vez de un array plano de ids.
- **Productos (`data/products.ts`):**
  - `discount` → `discountPercent` (el nombre no dice la unidad; hoy se asume "%" por convención, no por el tipo).
  - `image` (singular) es redundante con `images[0]` y puede desincronizarse — quitarlo y derivar siempre del array.
  - `categoryLabel` está denormalizado (duplica el nombre de la categoría en cada producto). En un backend real esto normalmente viene de un `JOIN` con una tabla `categories` — documentar esa intención para que quien conecte el backend no intente "sincronizar" el texto a mano.
- **General:** `CartProvider`, `FavoritesProvider` y `CompareProvider` son casi el mismo código tres veces (persistencia en `localStorage`, flag `ready`, patrón `idsRef`). No es un bug, pero un solo hook genérico (`useLocalIdSet(key)`) del que salgan los tres reduciría el riesgo de que se desincronicen al conectar el backend (hoy, si se corrige un bug en uno, hay que acordarse de replicarlo en los otros dos).

## 💡 Recomendaciones de cosas nuevas a agregar

- [x] 2026-09-09 — **Carrito real** en `localStorage` + página `/carrito`
- [x] 2026-09-09 — **Búsqueda** client-side / API contra `data/products.ts`
- [x] 2026-09-09 — **Página de catálogo** (`/catalogo`) con filtros
- [x] 2026-09-09 — **Estado vacío** cuando búsqueda o filtro no encuentra nada
- [x] 2026-09-10 — **WhatsApp prellenado por categoría** (home, listado y banner de detalle)
- [x] 2026-09-10 — **Reseñas / testimonios** de ejemplo en la home (`data/testimonials.ts`) — sustituir por casos reales del cliente
- [x] 2026-09-10 — **Indicador de guardado** al marcar favoritos (aviso fijo «Guardado en favoritos»)
- [x] 2026-09-10 — **Breadcrumbs** en páginas internas (Inicio / sección)

## Prioridad alta

- [x] 2026-09-09 — Imágenes de categorías en `public/images/categorias/` (ya no se hotlinkea Unsplash)
- [x] 2026-09-09 — Logos en `public/images/marcas/` (wordmarks SVG; el carrusel deja de dar 404)
- [x] 2026-09-09 — Renombrar banners del slider sin espacios (`baner-1.png`)
- [x] 2026-09-09 — Página `/categorias` (y detalle `/categorias/[slug]`)
- [x] 2026-09-09 — Página `/carrito` (localStorage + badge del Navbar)
- [x] 2026-09-10 — Página `/favoritos` (localStorage + badge + corazón funcional)

## Producto / UX

- [x] 2026-09-09 — Unificar lista de categorías del **Navbar** con `mainCategories`
- [x] 2026-09-09 — Filtros y búsqueda contra catálogo / API (`/catalogo` + `GET /api/productos`)
- [x] 2026-09-09 — Cotización mayorista con formulario + WhatsApp prellenado por producto/carrito
- [x] 2026-09-09 — Modo oscuro: contraste en tarjetas de categorías (fondo `#102a40` + texto claro)
- [x] 2026-09-09 — Sumar más productos por categoría (mín. 3 en cada una → el modal muestra relacionados)

## Técnico

- [x] 2026-09-09 — API interna de productos (`app/api/productos`) — el catálogo ya no se consulta solo hardcodeado en la UI
- [x] 2026-09-10 — Completar specs de **ejemplo** por SKU (origen, material/dimensiones, peso, garantía).
- [ ] Fichas técnicas **oficiales** por SKU cuando el cliente las envíe
- [x] 2026-09-10 — CMS / admin liviano en `/admin` (banners y categorías en `chamo-cms-v1`, este navegador)
- [x] 2026-09-09 — `allowedDevOrigins` en `next.config` (LAN vía `ALLOWED_DEV_ORIGINS`)
- [x] 2026-09-09 — Tests básicos de smoke (slider N slides, categorías, búsqueda, home HTTP si el server está arriba)

## Contenido

- [x] 2026-09-09 — Teléfono oficial `+51 959 723 602` en `WhatsAppFloat.tsx`, `Footer.tsx`, `app/cotizar/page.tsx` y `app/contacto/page.tsx`
- [ ] Confirmar correo de contacto oficial (footer y `/contacto` usan `ventas@chamoimport.com` como provisional)
- [ ] Reemplazar textos placeholder de `/nosotros` (`data/company.ts`: año 2016, misión/visión de ejemplo) por ficha oficial del cliente
- [x] 2026-09-09 — Políticas (términos, privacidad) enlazadas desde el footer
- [ ] Sustituir testimonios de ejemplo (`data/testimonials.ts`) por casos reales de distribuidores

## Ideas nuevas de este bloque

- [x] 2026-09-09 — Banner de detalle de categoría: imagen ancha + título centrado (ELÉCTRICOS, FERRETERÍA, …)
- [x] 2026-09-09 — `/nosotros` con banner **NOSOTROS**, historia Chamo Import, misión y visión
- [x] 2026-09-09 — Animación de entrada al scroll (Reveal) en home y páginas; banners con fade-in
- [x] 2026-09-09 — Intro de entrada: puertas azules + engranaje Lucide
- [x] 2026-09-10 — Intro de puertas al entrar, refrescar o clic en el logo (no en cada sección)
- [x] 2026-09-10 — Intro del carrito: mismas puertas, carrito que frena al centro y sigue al abrir
- [x] 2026-09-10 — Preloader Framer Motion en la carga inicial (nombre + engranaje + barra)
- [x] 2026-09-10 — Preloader con `/logo.png` y `/engranaje.png` oficiales
- [x] 2026-09-10 — Página `/contacto` completa (canales, formulario WhatsApp, mapa)
- [x] 2026-09-10 — Corrección de bugs: intro no scrolleable, formularios WhatsApp sin popup blocker, toast de favoritos a tono
- [x] 2026-09-10 — Collages de marcas/productos de cada línea en tarjetas y banners de categoría (`CategoryCollage`). Los JPEG de `public/images/categorias/` quedan de fallback.
- [ ] Reemplazar wordmarks SVG de marcas por logos oficiales
- [ ] Conectar inventario real (ERP / backend) en lugar del catálogo de ejemplo servido por `/api/productos`
- [x] 2026-09-10 — Comparar productos (hasta 3 SKUs, `/comparar`, badge en Navbar)

## Hecho recientemente (referencia)

- [x] 2026-09-11 — Navegación interna (Catálogo, Categorías, Ofertas, etc.) usa el **mismo loader** de entrada a la web. Intro del carrito: ícono detrás de la costura al entrar, recorrido normal al salir. Nota: [`cambios/2026-09-11-loader-nav-carrito-costura.md`](./cambios/2026-09-11-loader-nav-carrito-costura.md).
- [x] 2026-09-11 — Preloader según brief: `/logo.png` entra de izquierda a derecha, `/engranaje.png` gira, **CARGANDO...** en oro, fade-out a los 2.5 s (`z-[90]`). Nota: [`cambios/2026-09-11-preloader-2-5s-logo-engranaje.md`](./cambios/2026-09-11-preloader-2-5s-logo-engranaje.md).
- [x] 2026-09-10 — Login/comparar/admin liviano/collages/specs de ejemplo (`docs/cambios/2026-09-10-sugerencias-login-comparar-admin.md`)
- [x] 2026-09-10 — Bugs intro/preloader: un solo play al clic de Carrito, ícono a la izquierda de la costura, preloader espera `window.load`
- [x] 2026-09-10 — Preloader con logo y engranaje oficiales (`/logo.png`, `/engranaje.png`)
- [x] 2026-09-10 — Preloader Framer Motion (carga inicial)
- [x] 2026-09-10 — Intro del carrito (puertas + carrito que frena y sigue su camino)
- [x] 2026-09-10 — Bugs de intro / WhatsApp / favoritos (scroll lock, openWhatsApp, idsRef)
- [x] 2026-09-10 — Intro de puertas solo al entrar, refrescar o clic en el logo
- [x] 2026-09-10 — Página de contacto completa (formulario WhatsApp + mapa)
- [x] 2026-09-10 — Intro de puertas también al navegar (Categorías, etc.) + responsive
- [x] 2026-09-10 — Cierre de la auditoría UX: favoritos, fallback de marcas, testimonios, WhatsApp por categoría, breadcrumbs
- [x] 2026-09-10 — Auditoría UX/UI y funcional con el sitio corriendo (bugs confirmados + recomendaciones)
- [x] 2026-09-09 — Intro de entrada (puertas azules + engranaje)
- [x] 2026-09-09 — Iconos Lucide (carrito, categorías, productos)
- [x] 2026-09-09 — Productos destacados en una fila (carrusel como categorías)
- [x] 2026-09-09 — Encabezados sticker Catálogo / Nosotros / Ofertas / Contacto
- [x] 2026-09-09 — Slider sin recuadro de ejemplo; fade-in al scroll en banners y bloques
- [x] 2026-09-09 — Banner Nosotros + misión/visión + animaciones de scroll en el sitio
- [x] 2026-09-09 — Banner de detalle de categoría (imagen + título centrado)
- [x] 2026-09-09 — Bloque SUGERENCIAS.md en orden (categorías, carrito, catálogo, cotizar, teléfono, tests)
- [x] 2026-09-08 — Slider full-bleed y sin recorte
- [x] 2026-09-08 — Marcas debajo del slider
- [x] 2026-09-08 — Categorías layout Explorar + glow
- [x] 2026-09-08 — Categorías en carrusel horizontal (patrón FeaturedOffers)
- [x] 2026-09-08 — Carrusel de categorías también en PC con flechas circulares
- [x] 2026-09-08 — Modal de producto con ficha técnica + relacionados por categoría
- [x] 2026-09-08 — 7 categorías en home (se añadieron 3)
- [x] 2026-09-08 — Navbar: hover solo en texto + barra dorada animada bajo el ítem activo
- [x] 2026-09-08 — Auditoría de docs: sincronizar CLAUDE.md/MANUAL.md con el código real (carrusel, modal, navbar)

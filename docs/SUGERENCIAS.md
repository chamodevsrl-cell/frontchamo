# Sugerencias para el proyecto

Última actualización: **2026-09-22**

## ↩️ Ofertas: se revierte la franja de imágenes, se rediseña desde cero (2026-09-22)

- [x] 2026-09-22 — El usuario pidió deshacer por completo la franja de
  imágenes de Ofertas (las tres entradas de abajo marcadas **[REVERTIDO]**)
  para rediseñarla desde cero. Se borraron `OffersBanner.tsx`,
  `AdminOffersBannerEditor.tsx` y el campo `offerBanner`/tipo
  `CmsOfferBannerTile` de `lib/cms.ts`. `/ofertas` volvió a usar el banner
  ancho normal (`SitePageBanner`, editable en `/admin/banners` igual que
  Nosotros/Contacto/Catálogo). Se conservó lo que no era parte de la franja:
  el campo **% de descuento** del wizard de producto y la página
  `/admin/ofertas` con su lista de solo lectura de productos en oferta.
  Detalle: [`cambios/2026-09-22-ofertas-revertir-franja-imagenes.md`](./cambios/2026-09-22-ofertas-revertir-franja-imagenes.md).
- [ ] Cuando se retome el diseño de esta pieza, partir de la referencia
  visual que ya mandó el usuario (panel oscuro + fila de imágenes con enlace
  a producto/URL) — el historial de la versión anterior queda en las tres
  notas de cambios de abajo por si sirve de punto de partida.

## 🧹 [REVERTIDO] Ofertas: se quita el banner anterior + límite 3-4 imágenes (2026-09-22)

- [x] 2026-09-22 — Ya no existe el banner de una sola imagen para Ofertas
  (se quitó de `/admin/banners` → "Otras páginas"); la franja de imágenes
  es ahora la única forma de personalizar esa parte de `/ofertas`, con
  fallback a un banner simple sin foto si hay menos de 3 imágenes
  completas. Límite: mínimo 3, máximo 4 (el botón "Agregar imagen" se
  deshabilita al llegar a 4). De paso se corrigió un bug real: una imagen
  sin foto subida tumbaba `next/image` en la tienda pública. Detalle:
  [`cambios/2026-09-22-ofertas-quitar-banner-anterior-limite-3-4.md`](./cambios/2026-09-22-ofertas-quitar-banner-anterior-limite-3-4.md).

## 🏷️ [PARCIALMENTE REVERTIDO] Ofertas: editor propio en /admin/ofertas + % de descuento (2026-09-22)

> El editor de franja que se movió acá se borró (ver la entrada de arriba).
> Lo que sigue vigente de esta nota: el campo **% de descuento** del wizard
> de producto y la lista de solo lectura de `/admin/ofertas`.

- [x] 2026-09-22 — El editor de la franja de imágenes se movió de
  `/admin/banners` a `/admin/ofertas` (ya tenía su propio permiso `ofertas`
  en el sidebar, separado de `banners`). Esa página también lista, de solo
  lectura, los productos en oferta del catálogo público, con un aviso claro
  de que todavía no es lo mismo que "Productos" del panel. El wizard de
  producto (Fase 3) suma un campo **% de descuento** independiente del
  precio anterior, que alimenta el badge "-X% OFF". Detalle:
  [`cambios/2026-09-22-ofertas-panel-dedicado-descuento-porcentaje.md`](./cambios/2026-09-22-ofertas-panel-dedicado-descuento-porcentaje.md).
- [ ] **El pendiente real de fondo:** unificar el catálogo del panel
  (`services/adminApi.ts`, mock en memoria) con el catálogo público
  (`data/products.ts`, array estático) para que marcar "En oferta" en
  `/admin/productos` se refleje solo en `/ofertas` y en la lista de
  `/admin/ofertas`. Es trabajo de "conectar el backend real", no algo para
  resolver a medias solo para Ofertas — ver
  [`API_CONTRACT_TIENDA.md` §2](../API_CONTRACT_TIENDA.md#2-catálogo-público)
  y `docs/backend-handoff/MAPA-CONEXION.md`.

## 🖼️ [REVERTIDO] Ofertas: franja de imágenes enlazadas a producto o URL (2026-09-22)

- [x] 2026-09-22 — El banner de `/ofertas` ahora puede reemplazarse por una
  franja de imágenes subidas desde `/admin/banners`, cada una enlazada a un
  producto (clic abre ese producto en el modal) **o** a una URL personalizada
  (interna o externa, escrita a mano — gana sobre el producto elegido). Si no
  hay imágenes cargadas, se ve el banner normal de siempre. Detalle:
  [`cambios/2026-09-22-franja-imagenes-ofertas.md`](./cambios/2026-09-22-franja-imagenes-ofertas.md).
- [ ] Ideas para después: reordenar las imágenes (hoy solo agregar/quitar,
  quedan en el orden en que se agregaron); permitir la misma franja en otras
  páginas si el negocio lo pide (hoy es específica de Ofertas).

## 📁 Carpeta de handoff para el backend dev (2026-09-22)

- [x] 2026-09-22 — Nueva `docs/backend-handoff/`: `README.md` (entry point,
  orden de lectura, cómo buscar los `// TODO Backend`) y
  `MAPA-CONEXION.md` (tabla única: pieza → archivo de código → endpoint →
  contrato, en orden de prioridad). `docs/README.md` y `CLAUDE.md` ahora
  apuntan ahí. De paso se encontró y corrigió un choque de nombres: el
  catálogo público usaba el mismo path (`/api/v1/products`) que el panel
  admin con una forma de datos distinta — se movió a `/api/v1/catalog`.
  Detalle: [`cambios/2026-09-22-carpeta-backend-handoff.md`](./cambios/2026-09-22-carpeta-backend-handoff.md).

## 🔌 Contrato HTTP de la tienda pública + TODOs en código (2026-09-22)

- [x] 2026-09-22 — Nuevo [`API_CONTRACT_TIENDA.md`](../API_CONTRACT_TIENDA.md):
  mismo nivel de detalle que `API_CONTRACT.md` (panel) pero para CMS,
  catálogo, cuentas y carrito/favoritos/comparar de la tienda — antes solo
  tenían guía narrativa. Se agregó además `// TODO Backend` junto a cada
  punto de integración en el código (`ContentProvider.tsx`,
  `CartProvider.tsx`, `FavoritesProvider.tsx`, `CompareProvider.tsx`,
  `AuthProvider.tsx`, `app/api/productos/route.ts`, `data/products.ts`,
  `lib/cms-image.ts`, `lib/auth-local.ts`), mismo patrón que ya usaba
  `services/adminApi.ts`. Detalle:
  [`cambios/2026-09-22-contrato-api-tienda-backend-ready.md`](./cambios/2026-09-22-contrato-api-tienda-backend-ready.md).
- [ ] Pendiente real (no solo documental — el contrato ya está escrito, falta
  que el backend lo implemente): CMS del panel (`ContentProvider.tsx`,
  `chamo-cms-v1`), catálogo (`data/products.ts`), cuentas de la tienda
  (`lib/auth-local.ts`) y carrito/favoritos/comparar siguen 100% en
  `localStorage`. Orden recomendado en `API_CONTRACT_TIENDA.md` §0: CMS →
  catálogo → cuentas → carrito.

## 🧩 Split de componentes grandes del panel (2026-09-22)

- [x] 2026-09-22 — `AdminNewProductForm.tsx` (817 líneas) y
  `AdminUsersCards.tsx` (804 líneas) eran monolíticos. Se dividieron en
  componentes por paso/pieza sin cambiar comportamiento (verificado en el
  navegador). Detalle:
  [`cambios/2026-09-22-split-admin-componentes-grandes.md`](./cambios/2026-09-22-split-admin-componentes-grandes.md).

## 🔌 Manual: guía completa para conectar backend (tienda + panel) (2026-09-21)

- [x] 2026-09-21 — `MANUAL.md` solo explicaba cómo conectar el backend del
  panel admin (A.12.6). Nueva sección **A.13** cubre el resto del sitio:
  catálogo público, cuentas de cliente, carrito/favoritos/comparar, CMS del
  panel y formularios de contacto/cotizar — con tabla de "qué vive dónde hoy"
  y pasos concretos por pieza. Detalle:
  [`cambios/2026-09-21-manual-conectar-backend-tienda.md`](./cambios/2026-09-21-manual-conectar-backend-tienda.md).

## 🚪 Simplificar animaciones de transición (2026-09-21)

- [x] 2026-09-21 — Se quitaron las puertas del clic en el logo, la animación
  especial de `/carrito` y el disparo del loader en login/logout. Ahora
  `IntroSplash.tsx` solo muestra `BrandLoader` al cruzar hacia/desde `/admin` o
  `/cuenta/perfil` (más la carga inicial/recarga, que sigue siendo
  `Preloader.tsx`) — nada más. Se limpió el CSS muerto asociado (~330 líneas en
  `app/globals.css`) y el evento `AUTH_TRANSITION_EVENT` de `AuthProvider.tsx`
  (sin otro consumidor). Detalle:
  [`cambios/2026-09-21-simplificar-loader-transiciones.md`](./cambios/2026-09-21-simplificar-loader-transiciones.md).

## 📦 Productos: Ver/Editar/Eliminar + oferta + presentaciones de venta (2026-09-21)

- [x] 2026-09-21 — `/admin/productos` ya tenía solo una tabla de lectura. Ahora
  cada fila tiene **Ver** (modal), **Editar** (reusa el wizard de alta,
  precargado, llama a `updateProduct()`) y **Eliminar** (confirmación,
  `deleteProduct()`). El wizard suma **"En oferta" + precio anterior** (Fase 3)
  y **"Presentaciones de venta"** — unidad/docena/caja con su contenido, más
  poder crear una unidad propia de texto libre (Fase 4). Detalle:
  [`cambios/2026-09-21-productos-crud-oferta-presentaciones.md`](./cambios/2026-09-21-productos-crud-oferta-presentaciones.md).
- [ ] `API_CONTRACT.md` ya documenta `GET/PUT/DELETE /api/v1/products/:id`;
  falta que el backend real los implemente (hoy solo mock en memoria).
- [ ] El modal "Ver" y la edición no tocan el catálogo público de ejemplo
  (`data/products.ts`, estático) — sigue siendo una limitación conocida hasta
  que ambos lean de la misma fuente.

## 🖼️ Límite de imagen de producto: 60 MB (2026-09-21)

- [x] 2026-09-21 — El wizard de alta de producto (fase "Detalle e imágenes")
  aceptaba imágenes hasta 1.5 MB (default de CMS, pensado para banners/
  categorías). Ahora tiene su propio límite, `MAX_PRODUCT_IMAGE_BYTES` (60 MB),
  con aviso en pantalla. Detalle:
  [`cambios/2026-09-21-limite-imagen-producto-60mb.md`](./cambios/2026-09-21-limite-imagen-producto-60mb.md).
- [ ] Al conectar backend con subida a bucket real, replicar este límite del
  lado servidor (hoy solo se valida en el navegador).

## 🕒 Header del panel: "Ver sitio" visible + reloj (2026-09-21)

- [x] 2026-09-21 — Junto al buscador del panel (visible siempre, sin abrir el
  menú de la cuenta) ahora hay **fecha y hora** en vivo y un botón **Ver sitio**
  que abre la tienda en pestaña nueva (`target="_blank"`) para revisar cambios
  sin perder el panel abierto. Se quitó el enlace duplicado que antes vivía
  dentro del menú desplegable de la cuenta. Detalle:
  [`cambios/2026-09-21-panel-ver-sitio-reloj.md`](./cambios/2026-09-21-panel-ver-sitio-reloj.md).

## 🔑 Editar usuario completo + varios roles por usuario (2026-09-16)

- [x] 2026-09-16 — El modal "Editar usuario" ahora deja cambiar **nombre,
  correo, contraseña y roles** (antes solo habilitar/deshabilitar y borrar).
  Al crear un usuario nuevo se puede marcar **más de un rol** (checkboxes en
  vez de un `<select>` único). `PanelUser.roleId` pasó a `roleIds: string[]`;
  la sesión hereda la unión de permisos de todos los roles asignados. No
  puedes cambiar tus propios roles mientras tienes la sesión abierta (mismo
  criterio que no poder suspenderte/borrarte a ti mismo). Detalle:
  [`cambios/2026-09-16-editar-usuario-multirol.md`](./cambios/2026-09-16-editar-usuario-multirol.md).

## 🪪 Usuarios del panel en tarjetas estilo carnet (2026-09-16)

- [x] 2026-09-16 — `/admin/usuarios` pasó de tabla a **tarjetas** (foto, rol,
  último acceso, nombre, correo, estado). "Editar" abre un modal con
  **habilitar/deshabilitar** y **borrar usuario** (nuevo — antes no se podía
  borrar, solo suspender). No se puede deshabilitar ni borrar tu propia cuenta
  logueada. Estilo ajustado a pedido del cliente para parecerse a un carnet de
  empleado (foto grande superpuesta a una franja de marca, rol en pastilla).
  Se puede **voltear** (botón circular junto a "Editar", volteo 3D con CSS
  puro): el reverso muestra rol + descripción + secciones habilitadas,
  correo/teléfono y fecha de alta. Sin código QR. Proporción **vertical**
  (240×440), **logo oficial** en vez del texto "Chamo Import" (frente y
  reverso), y **franja de color por rol** (paleta fija de 8 colores hasheada
  por `roleId`, así cada rol —Administrador, Editor, Almacén o uno nuevo como
  "Gerente General"— sale siempre del mismo color). Grilla más junta
  (`gap-3`), borde azul brillante (`border-2 border-brand-primary`) y logo más
  grande; en móvil se ven **2 tarjetas por fila** desde el inicio (antes 1).
  Detalle:
  [`cambios/2026-09-16-usuarios-tarjetas-modal.md`](./cambios/2026-09-16-usuarios-tarjetas-modal.md).

## 🚪 Animación de entrada solo en transiciones clave (2026-09-16)

- [x] 2026-09-16 — El loader de "CARGANDO..." (`IntroSplash.tsx`) ya no se ve en
  cada navegación interna (catálogo, categorías, ofertas, `/cuenta`, etc.). Ahora
  solo aparece al: recargar el navegador (sin cambios, ya era así), hacer clic en
  el logo, entrar o salir de `/admin`, entrar o salir de `/cuenta/perfil`, e
  iniciar o cerrar sesión (cualquier cuenta). Detalle:
  [`cambios/2026-09-16-intro-solo-en-transiciones-clave.md`](./cambios/2026-09-16-intro-solo-en-transiciones-clave.md).

## 👤 Área cliente — editar perfil (2026-09-16)

Referencia de “Mi cuenta / Mi perfil”: cualquier rol (cliente, admin de tienda,
Administrador/Editor/Almacén del panel) entra a `/cuenta/perfil` y guarda nombre,
foto y teléfono. RUC/razón social van en `/cuenta/empresa`.

- [x] 2026-09-16 — Página `/cuenta` (resumen, perfil, empresa) + `updateProfile`.
- [x] 2026-09-16 — Enlace **Mi perfil** en el menú de la tienda y en el del panel.
- [x] 2026-09-16 — Banner de "Mi cuenta" con **foto de portada propia**
  (`/cuenta/perfil`, máx. 3.5 MB) y **descripción breve editable** debajo del
  nombre (en vez del rótulo fijo "Mi cuenta"/"Hola, {nombre}").
- [ ] Autenticador Google/Microsoft (OTP de app) cuando haya backend de usuarios.
- [ ] Historial real de pedidos/reseñas (hoy “Mis pedidos” es placeholder).

Detalle: [`cambios/2026-09-16-editar-perfil.md`](./cambios/2026-09-16-editar-perfil.md).

## 🖱️ Cursor negro/blanco sobre imágenes (2026-09-15)

- [x] 2026-09-15 — `WrenchCursor.tsx`: negro puro por defecto, blanco al pasar sobre
  cualquier `<img>` (antes usaba los colores de marca). Detalle:
  [`cambios/2026-09-15-cursor-negro-blanco-imagenes.md`](./cambios/2026-09-15-cursor-negro-blanco-imagenes.md).

## 🧙 Wizard de alta de producto + imágenes reales (2026-09-15)

El cliente mandó otra captura del panel de su compañero (rosversac.com/admin/productos/nuevo):
formulario en fases (Datos/Detalle/Precios/Especs) con vista previa en vivo y subida de
imagen real. Se llevó a nuestro panel — detalle:
[`cambios/2026-09-15-wizard-producto-imagenes.md`](./cambios/2026-09-15-wizard-producto-imagenes.md).

- [x] 2026-09-15 — Wizard de 4 fases en `/admin/productos/nuevo` + vista previa en vivo.
- [x] 2026-09-15 — Subida de imágenes desde archivos/galería (drag & drop +
  `<input type="file">`) **o pegando una URL**; sin bucket real todavía — los
  archivos locales quedan como `data:` URL.
- [x] 2026-09-15 — Ficha técnica (Especs) como fase del alta, sumando `specs` al
  contrato `Product`/`CreateProductInput`.
- [ ] Cuando haya backend: reemplazar el guardado de imágenes en `data:` URL por
  subida real a un bucket (tipo R2/S3) y guardar solo la URL resultante.
- [ ] Evaluar el mismo wizard para **editar** un producto existente (hoy solo existe
  para alta; `/admin/productos` no tiene pantalla de edición todavía).

## 🗂️ Propuesta: ampliar el panel admin para que la web sea 100% editable (2026-09-15)

El cliente mandó una captura de otro panel de referencia (sidebar "ROSVER SYSTEM")
pidiendo que el sitio se pueda administrar por completo desde `/admin` (productos,
categorías, imágenes de banners/slider, textos, etc.). Comparado contra el `NAV` actual
de [`AdminShell.tsx`](../components/admin/AdminShell.tsx):

**Ya cubierto (solo cambia de nombre o agrupamiento):**
- Inicio → Dashboard, Analítica → Reportes, Almacenamiento → Inventario, Slider → Banners
- Catálogo (con submenú) → hoy son 3 links sueltos: Productos, Categorías, Marcas

**Nuevo de verdad (no existe ni el dato ni la pantalla):**
- **Usuarios** — cuentas del *staff* que entra al panel (distinto de "Clientes", que son
  cuentas de la tienda). Necesita modelo propio + relación con **Roles**.
- **Roles** — permisos por usuario admin (qué secciones puede ver/editar). Sin esto,
  "Usuarios" es solo una lista sin función real.
- **Cotizaciones** — hoy `/cotizar` arma el mensaje y abre WhatsApp directo, no queda
  ningún registro. Para que aparezca en el panel hay que guardar la cotización antes de
  redirigir a WhatsApp (nuevo modelo de datos + mock API).
- **Contactos** — mismo caso que Cotizaciones: `ContactForm.tsx` hoy solo abre WhatsApp,
  no persiste el mensaje en ningún lado.
- **Reclamaciones** — no existe ni el formulario del lado cliente. Habría que decidir
  primero si el negocio quiere un canal formal de reclamos (¿un form público nuevo tipo
  `/reclamaciones`?) antes de construir la vista admin.

**Nota:** Cotizaciones/Contactos/Reclamaciones implican guardar algo que hoy es
"efímero" (se arma un mensaje y se abre WhatsApp, sin persistir nada) — como todo el
panel sigue siendo mock (`services/adminApi.ts`, sin backend real), esto quedaría en
`localStorage` por ahora, igual que carrito/favoritos, con el mismo TODO de
"reemplazar por `fetch()` cuando haya backend" que ya aplica al resto.

- [x] 2026-09-15 — El cliente definió prioridad: **Usuarios + Roles primero**,
  **Cotizaciones descartada por ahora**. Construido: `/admin/usuarios` y
  `/admin/roles` (mock completo, 13 permisos por sección, 3 roles semilla). Detalle:
  [`cambios/2026-09-15-admin-usuarios-roles.md`](./cambios/2026-09-15-admin-usuarios-roles.md).
- [x] 2026-09-15 — **Usuarios/Roles conectados al login.** `loginAdmin()` valida
  contra `PanelUser` + contraseña en memoria, copia `PanelRole.permissions` a la
  sesión, el sidebar filtra por permiso y las cuentas suspendidas no entran.
  Cuenta staff: **THE WINTER** / `Criper@11` (también `thewinter@local.test`).
  Detalle: [`cambios/2026-09-15-admin-login-usuarios.md`](./cambios/2026-09-15-admin-login-usuarios.md).
- [x] 2026-09-15 — **Ajustes + Banners + Equipo (CMS local).** Footer 100% editable
  (dirección, mapa, redes, imágenes de medios de pago) en `/admin/ajustes`. Banners
  en cartas para el slider del home y Nosotros/Contacto/Ofertas/Catálogo. Equipo de
  trabajo en cartas (gerente, asesor, vendedor, tienda, TI…) en `/admin/equipo`,
  visible en `/nosotros`. Detalle:
  [`cambios/2026-09-15-cms-footer-banners-equipo.md`](./cambios/2026-09-15-cms-footer-banners-equipo.md).
- [x] 2026-09-15 — **Ajustes desglosado** como Productos: Footer (dirección, mapa, pagos)
  y Canales de atención (WhatsApp del botón flotante, teléfono para llamar, correo y
  redes). Detalle:
  [`cambios/2026-09-15-ajustes-footer-canales.md`](./cambios/2026-09-15-ajustes-footer-canales.md).
- [x] 2026-09-15 — **Banner de pestaña azul/oro** en todo el panel (`AdminPageHero`),
  al estilo de la barra “Roles y permisos” de referencia pero con `brand-dark` +
  `brand-gold`. Detalle:
  [`cambios/2026-09-15-admin-page-hero.md`](./cambios/2026-09-15-admin-page-hero.md).
- [x] 2026-09-15 — **Categorías en cartas** (nombre, descripción, recuento) + modal
  editar/agregar; imágenes por URL o galería/carpetas (`CmsImageField`) en banners,
  equipo, ajustes, categorías y alta de producto. Detalle:
  [`cambios/2026-09-15-categorias-cartas-imagenes.md`](./cambios/2026-09-15-categorias-cartas-imagenes.md).
- [ ] Contactos — guardar el mensaje del formulario antes de abrir WhatsApp + vista admin
- [ ] Reclamaciones — decidir si existe un formulario público antes de construir la vista admin
- [ ] Evaluar renombrar Reportes→Analítica e Inventario→Almacenamiento, o dejarlos así

Lista viva de mejoras. Al completar una, márcala como hecha y añade fecha. Al surgir una idea en un cambio, anótala aquí.

## 🔌 Revisión de backend-readiness del panel admin (2026-09-11)

Se revisaron las funciones nuevas del panel (`AdminNewProductForm.tsx`,
`AdminOrdersTable.tsx`, `app/admin/(panel)/productos/page.tsx`,
`app/admin/(panel)/pedidos/page.tsx`) verificando específicamente que todo pase por
`services/adminApi.ts` — el único punto donde se debe enchufar el backend real (ver
[A.12.6](./MANUAL.md#a126-conectar-el-backend-real)). Detalle:
[`cambios/2026-09-11-categorias-mock-api.md`](./cambios/2026-09-11-categorias-mock-api.md).

- [x] **El formulario "Crear producto" no pasaba por el mock API para las categorías.**
  `AdminNewProductForm.tsx` importaba `mainCategories` directo de `data/home.ts` (la
  tienda) en vez de llamar a algo en `services/adminApi.ts` — el resto del panel
  (productos, pedidos, KPIs) sí lo hace. Cuando se conecte el backend real y se
  reemplacen los `fetch()` en `adminApi.ts`, este dropdown se hubiera quedado leyendo
  siempre datos locales de la tienda, sin enterarse del backend.
- [x] **La función que ya existía para esto (`listMockCategories`) no cumplía el tipo
  `Category`** (le faltaban `subcategoriesCount` y `status`) y **nunca se llamaba desde
  ningún lado** — código muerto con un contrato roto.
- [x] **Arreglado:** se renombró a `getCategories()` (async, con el mismo `delay()` de
  300 ms que el resto del mock, comentario `// TODO Backend` igual que las demás
  funciones), devuelve el `Category` completo, y `app/admin/(panel)/productos/nuevo/page.tsx`
  la llama y le pasa el resultado a `AdminNewProductForm` como prop `categories`.
  Verificado con build/test/lint + un test nuevo (`getCategories devuelve el contrato
  Category completo`) + prueba en vivo (el `<select>` sigue mostrando las 7
  categorías, ahora vía el mock en vez del import directo).

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

- [x] 2026-09-11 — **1. Doble pantalla de carga al hacer clic en el logo con `prefers-reduced-motion` activado.** El clic en `[data-site-intro]` ahora reclama la navegación (`loadClaimedByClick`) para que el cambio de `pathname` no dispare un `BrandLoader` extra. Fix: [`cambios/2026-09-11-fix-loader-admin-role.md`](./cambios/2026-09-11-fix-loader-admin-role.md).
- [x] 2026-09-11 — **2. `/admin` no tiene control de rol — cualquier cuenta registrada entra.** `AuthUser`/`StoredAccount` tienen `role: "customer" | "admin"`. La primera cuenta del navegador es admin; las siguientes, customer. `/admin` y el enlace del Navbar exigen `role === "admin"`. Fix: misma nota. Pendiente backend real.
- [x] 2026-09-11 — **3. El carrito recalcula el precio en vivo del catálogo — no guardaba el precio al agregar.** `CartLine` ahora guarda `unitPrice`/`wholesaleUnitPrice` al momento de `addItem`; los totales de `/carrito` y el mensaje de WhatsApp usan ese precio, no el vivo del catálogo. Si el precio cambió, se muestra un aviso ("El precio de este producto cambió desde que lo agregaste"). Carritos viejos (`{productId, qty}` sin precio) se migran solos al leer `chamo-cart-v1`, rellenando con el precio vivo. Verificado en vivo (carrito viejo → migra bien; precio desactualizado → muestra el aviso y usa el precio guardado). Fix: [`cambios/2026-09-11-backend-ready-fixes.md`](./cambios/2026-09-11-backend-ready-fixes.md).
- [x] 2026-09-11 — **4. `npm run build` estaba roto.** Dos errores de TypeScript bloqueaban la build de producción: `app/admin/page.tsx` perdía el tipo tupla `[string,string,string]` de `bullets` al hacer `[...item.bullets]`, y `vitest.config.mts` quedaba dentro del mismo proyecto TS que compila Next (dos versiones de `vite` incompatibles — la de `vitest` y la que jala `@vitejs/plugin-react`). Se encontró corriendo `npm run build` real (no solo `tsc`), con un `npm ci` limpio para descartar que fuera un problema del entorno. Fix: [`cambios/2026-09-11-backend-ready-fixes.md`](./cambios/2026-09-11-backend-ready-fixes.md).

## 🏷️ Nombres de variables — aplicado pensando en el backend futuro

Pedido explícito: usar nombres/formas de datos que faciliten conectar un backend real
más adelante, sin tener que reescribir todo. Aplicado el 2026-09-11
([`cambios/2026-09-11-backend-ready-fixes.md`](./cambios/2026-09-11-backend-ready-fixes.md)),
verificado con `npm run build` + `npm run test` en verde después de cada cambio:

- [x] **Cuentas (`lib/auth-local.ts`):** `id: string` en `StoredAccount`/`AuthUser` (antes la clave real era `email`); cuentas viejas sin `id` lo reciben solo al leerlas. `role` ya estaba (bug 2).
- [x] **Carrito (`CartProvider.tsx`):** `qty` → `quantity`; `setQty` → `setQuantity`; se agregó `unitPrice`/`wholesaleUnitPrice` (bug 3).
- [x] **Productos (`data/products.ts`):** `discount` → `discountPercent` (con comentario de que es 0-100, no un monto); se quitó el campo `image` (singular) redundante — todo el código ahora usa `images[0]`.
- [ ] **Favoritos (`FavoritesProvider.tsx`):** sigue siendo `ids: string[]` — **sin aplicar todavía**. Cambiar a `{ productId, addedAt }[]` cuando se necesite ordenar "agregado recientemente" o sincronizar con cuenta real; no había ningún bug detrás, así que se dejó fuera de este cierre para no tocar más de la cuenta antes del backend.
- [ ] **`categoryLabel` denormalizado** en cada producto — sin tocar, solo documentado: en un backend real normalmente viene de un `JOIN` con una tabla `categories`.
- [ ] **`CartProvider`/`FavoritesProvider`/`CompareProvider` casi duplicados** (mismo patrón `localStorage` + `ready` + `idsRef`) — sin tocar; unificarlos en un hook genérico reduciría el riesgo de que se desincronicen, pero no es urgente para conectar el backend.

## ✅ Revisión de merge-readiness a `main` (2026-09-11)

`main` no tiene ninguno de los features de esta rama (carrito, favoritos, comparar,
cuentas, admin) — no hay conflictos de **código**. Sí hay 5 conflictos de **docs**
(`CLAUDE.md`, `MANUAL.md`, `SUGERENCIAS.md`, `cambios/README.md` y un archivo
`cambios/*.md` con el mismo nombre en ambas ramas) porque las dos ramas documentaron
cosas en paralelo — se resuelven a mano, quedándose con el contenido más completo de
esta rama y sumando lo que `main` tenía de más.

`main` (antes de divergir) había documentado 5 bugs menores que esta rama nunca había
cerrado del todo. Se revisó cada uno contra el código actual de esta rama antes de
mergear:

- [x] **`ProductModal` sí vuelve arriba al cambiar de producto relacionado** — resultó que
  ya estaba resuelto, pero por otra vía: `FeaturedOffers.tsx`/`ProductCatalog.tsx` le
  pasan `key={selected.id}` al modal, así que React lo **remonta entero** al cambiar de
  producto (reinicia `activeImage`, cantidad y el scroll del contenedor). Verificado en
  vivo con un clic real: `scrollTop` pasó de `2871` a `0`. No hacía falta tocar nada —
  se corrigió la nota vieja para no reportarlo de nuevo.
- [x] **`CategoriesGrid`: el paso de las flechas ya usa el gap real** (antes, 16px fijo).
- [x] **`/login`: el comentario ya no promete "página previa"** (nunca lo hacía).
- [x] **Boletín del footer: ahora confirma la suscripción** con un mensaje.
- [x] **Cursor personalizado: los campos de texto ya muestran una barra en vez de la llave.**

Los 5 se aplicaron en esta pasada (`npm run build` + `npm run test` + `npm run lint` en
verde después de cada uno). Detalle: [`cambios/2026-09-11-merge-ready-fixes.md`](./cambios/2026-09-11-merge-ready-fixes.md).

**Veredicto:** el código está listo (build, tests y lint en verde; sin conflictos de
código con `main`). Falta resolver a mano los 5 conflictos de documentación al mergear.

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
- [x] 2026-09-11 — CMS / admin liviano en `/admin` (banners y categorías en `chamo-cms-v1`). El panel tiene sidebar, login propio y mock API (`types/admin.ts`, `services/adminApi.ts`, `API_CONTRACT.md`).
- [ ] Conectar `services/adminApi.ts` al backend real (`/api/v1/...` según `API_CONTRACT.md`) y pasar la cookie a httpOnly.
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
- [ ] Unificar la sesión del panel (`chamo_admin_session`) con `role: "admin"` de la tienda cuando exista un único backend de usuarios.
- [x] 2026-09-10 — Comparar productos (hasta 3 SKUs, `/comparar`, badge en Navbar)

## Hecho recientemente (referencia)

- [x] 2026-09-16 — Cada perfil (cualquier rol) edita su ficha en `/cuenta/perfil`. Nota:
  [`cambios/2026-09-16-editar-perfil.md`](./cambios/2026-09-16-editar-perfil.md).
- [x] 2026-09-15 — El admin inicia sesión en el mismo modal de “Mi cuenta”.
  **Comparar** salió de la barra de la tienda. Con sesión del panel aparece
  **Administrar** (ícono de casa). Nota:
  [`cambios/2026-09-15-admin-login-tienda.md`](./cambios/2026-09-15-admin-login-tienda.md).
- [x] 2026-09-15 — Login del panel conectado a Usuarios/Roles + cuenta **THE WINTER** / `Criper@11`. Nota: [`cambios/2026-09-15-admin-login-usuarios.md`](./cambios/2026-09-15-admin-login-usuarios.md).
- [x] 2026-09-15 — Panel admin: secciones Usuarios y Roles (permisos por sección, mock API). Nota: [`cambios/2026-09-15-admin-usuarios-roles.md`](./cambios/2026-09-15-admin-usuarios-roles.md).
- [x] 2026-09-11 — `FRONTEND_DOCUMENTATION.md`: referencia única (variables por componente + cómo conectar el backend + manual de uso). Nota: [`cambios/2026-09-11-frontend-documentation.md`](./cambios/2026-09-11-frontend-documentation.md).
- [x] 2026-09-11 — Contrato API del panel admin (`types/admin.ts`, mock `services/adminApi.ts`, login `/admin/login`, `API_CONTRACT.md`). Nota: [`cambios/2026-09-11-admin-api-contract.md`](./cambios/2026-09-11-admin-api-contract.md).
- [x] 2026-09-11 — Diseño base del **panel de administración** (sidebar corporativa, header, dashboard KPI). Nota: [`cambios/2026-09-11-admin-panel-layout.md`](./cambios/2026-09-11-admin-panel-layout.md).
- [x] 2026-09-11 — **Listo para backend:** `npm run build` roto (2 errores de TS) → arreglado; carrito guarda `unitPrice`/`quantity` y migra el formato viejo; cuentas con `id`; productos con `discountPercent` y sin `image` redundante. `npm run build` + `npm run test` en verde. Nota: [`cambios/2026-09-11-backend-ready-fixes.md`](./cambios/2026-09-11-backend-ready-fixes.md).
- [x] 2026-09-11 — Fix doble loader del logo con reduced-motion + rol admin en `/admin` (bug 3 del carrito sin tocar). Nota: [`cambios/2026-09-11-fix-loader-admin-role.md`](./cambios/2026-09-11-fix-loader-admin-role.md).
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

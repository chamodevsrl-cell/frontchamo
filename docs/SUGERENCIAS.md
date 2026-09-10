# Sugerencias para el proyecto

Última actualización: **2026-09-10**

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
- [ ] **Login / registro** (`AuthForm.tsx`) sigue siendo un stub honesto — no autentica ni guarda cuentas
- [x] 2026-09-10 — **Favoritos** persisten (`chamo-favorites-v1`), cuentan en el Navbar y confirman “Guardado”

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
- [ ] Completar specs técnicas reales por SKU (material, voltaje, dimensiones, país de origen, etc.) cuando el cliente envíe fichas oficiales — hoy son de ejemplo
- [ ] CMS o admin liviano para banners y categorías
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
- [x] 2026-09-10 — Página `/contacto` completa (canales, formulario WhatsApp, mapa)
- [x] 2026-09-10 — Corrección de bugs: intro no scrolleable, formularios WhatsApp sin popup blocker, toast de favoritos a tono
- [ ] Sustituir los JPEG de `public/images/categorias/` por collages de marcas/productos de cada línea
- [ ] Reemplazar wordmarks SVG de marcas por logos oficiales
- [ ] Conectar inventario real (ERP / backend) en lugar del catálogo de ejemplo servido por `/api/productos`
- [ ] Comparar productos (el botón de dos flechas sigue siendo visual)

## Hecho recientemente (referencia)

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

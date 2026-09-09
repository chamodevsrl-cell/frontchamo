# Sugerencias para el proyecto

Última actualización: **2026-09-09**

Lista viva de mejoras. Al completar una, márcala como hecha y añade fecha. Al surgir una idea en un cambio, anótala aquí.

## Prioridad alta

- [x] 2026-09-09 — Imágenes de categorías en `public/images/categorias/` (ya no se hotlinkea Unsplash)
- [x] 2026-09-09 — Logos en `public/images/marcas/` (wordmarks SVG; el carrusel deja de dar 404)
- [x] 2026-09-09 — Renombrar banners del slider sin espacios (`baner-1.png`)
- [x] 2026-09-09 — Página `/categorias` (y detalle `/categorias/[slug]`)
- [x] 2026-09-09 — Página `/carrito` (localStorage + badge del Navbar)

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

## Ideas nuevas de este bloque

- [x] 2026-09-09 — Banner de detalle de categoría: imagen ancha + título centrado (ELÉCTRICOS, FERRETERÍA, …)
- [x] 2026-09-09 — `/nosotros` con banner **NOSOTROS**, historia Chamo Import, misión y visión
- [x] 2026-09-09 — Animación de entrada al scroll (Reveal) en home y páginas; banners con `hero-enter`
- [ ] Sustituir los JPEG de `public/images/categorias/` por collages de marcas/productos de cada línea
- [ ] Reemplazar wordmarks SVG de marcas por logos oficiales
- [ ] Conectar inventario real (ERP / backend) en lugar del catálogo de ejemplo servido por `/api/productos`
- [ ] Página `/favoritos` (el Navbar sigue enlazándola)

## Hecho recientemente (referencia)

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

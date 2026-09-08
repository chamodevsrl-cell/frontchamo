# Sugerencias para el proyecto

Última actualización: **2026-09-08**

Lista viva de mejoras. Al completar una, márcala como hecha y añade fecha. Al surgir una idea en un cambio, anótala aquí.

## Prioridad alta

- [ ] Reemplazar imágenes Unsplash de categorías por fotos propias en `public/images/categorias/`
- [ ] Completar logos reales en `public/images/marcas/` (hoy varios 404)
- [ ] Renombrar banners del slider sin espacios (`baner-1.png`) para evitar encoding
- [ ] Página `/categorias` (y detalle por categoría) — el CTA “Explorar” / “Ver todas” ya apunta ahí
- [ ] Página `/carrito` (hoy el enlace puede dar 404)

## Producto / UX

- [ ] Unificar lista de categorías del **Navbar** con `mainCategories` (una sola fuente)
- [ ] Filtros y búsqueda real contra catálogo / API
- [ ] Cotización mayorista con formulario + WhatsApp prellenado por producto
- [ ] Modo oscuro: revisar contraste en tarjetas pastel de categorías
- [ ] Sumar más productos por categoría en `data/products.ts` (hoy "Seguridad" tiene solo 1 → el modal no muestra "Productos relacionados" para ese ítem)

## Técnico

- [ ] Conectar backend / API de productos (dejar de hardcodear `data/products.ts`)
- [ ] Completar specs técnicas reales por SKU (material, voltaje, dimensiones, país de origen, etc.) cuando el cliente envíe fichas oficiales — hoy son de ejemplo
- [ ] CMS o admin liviano para banners y categorías
- [ ] `allowedDevOrigins` en `next.config` si se prueba por IP LAN (`192.168.x.x`)
- [ ] Tests básicos de smoke (home carga, slider tiene N slides)

## Contenido

- [ ] Reemplazar el teléfono placeholder `+51 999 999 999` por el oficial `+51 959 723 602` en `WhatsAppFloat.tsx`, `Footer.tsx`, `app/cotizar/page.tsx` y `app/contacto/page.tsx` (`ProductModal.tsx` ya está correcto, usarlo de referencia)
- [ ] Confirmar correo de contacto oficial (footer y `/contacto` usan `ventas@chamoimport.com` como provisional)
- [ ] Políticas (términos, privacidad) enlazadas desde el footer

## Hecho recientemente (referencia)

- [x] 2026-09-08 — Slider full-bleed y sin recorte
- [x] 2026-09-08 — Marcas debajo del slider
- [x] 2026-09-08 — Categorías layout Explorar + glow
- [x] 2026-09-08 — Categorías en carrusel horizontal (patrón FeaturedOffers)
- [x] 2026-09-08 — Carrusel de categorías también en PC con flechas circulares
- [x] 2026-09-08 — Modal de producto con ficha técnica + relacionados por categoría
- [x] 2026-09-08 — 7 categorías en home (se añadieron 3)

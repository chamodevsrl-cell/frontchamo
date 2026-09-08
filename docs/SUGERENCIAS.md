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

## Técnico

- [ ] Conectar backend / API de productos (dejar de hardcodear `data/products.ts`)
- [ ] CMS o admin liviano para banners y categorías
- [ ] `allowedDevOrigins` en `next.config` si se prueba por IP LAN (`192.168.x.x`)
- [ ] Tests básicos de smoke (home carga, slider tiene N slides)

## Contenido

- [ ] Textos reales de teléfono / correo (hoy hay placeholders en footer)
- [ ] Políticas (términos, privacidad) enlazadas desde el footer

## Hecho recientemente (referencia)

- [x] 2026-09-08 — Slider full-bleed y sin recorte
- [x] 2026-09-08 — Marcas debajo del slider
- [x] 2026-09-08 — Categorías layout Explorar + glow
- [x] 2026-09-08 — 7 categorías en home (se añadieron 3)
- [x] 2026-09-08 — Carpeta `docs/` con manual, técnica, usuario y sugerencias

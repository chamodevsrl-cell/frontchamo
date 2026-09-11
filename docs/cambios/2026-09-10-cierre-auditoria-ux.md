# Cierre de la auditoría UX / funcional

- **Fecha:** 2026-09-10
- **Solicitud:** "lee los nuevos requerimiento de cambios y ejecutalos"
- **Archivos:** `components/FavoritesProvider.tsx`, `components/FavoriteButton.tsx`, `app/favoritos/page.tsx`, `components/BrandsCarousel.tsx`, `components/Testimonials.tsx`, `components/Breadcrumbs.tsx`, `components/Navbar.tsx`, `components/CategoriesGrid.tsx`, `components/CategoryBanner.tsx`, `docs/SUGERENCIAS.md`
- **Commit:** (este bloque)

## Qué había antes

La auditoría del 2026-09-10 (`2026-09-10-auditoria-ux-funcional.md`) se corrió contra
**`main` antiguo**. En esa rama `/catalogo`, `/categorias`, `/carrito` y `/favoritos`
daban 404, el buscador no navegaba y el fallback de logos no se activaba. Este PR ya
había cerrado catálogo, categorías y carrito; seguían abiertos favoritos, el fallback
robusto de marcas, testimonios, WhatsApp por categoría y breadcrumbs.

## Código nuevo (puntos clave)

Favoritos en `localStorage` (`chamo-favorites-v1`), página `/favoritos`, badge en Navbar
y corazón con confirmación **Guardado**.

Fallback de marcas: además de `onError`, se mira `load` + `naturalWidth === 0`
(`lib/image.ts`) por si Turbopack no dispara `error` en un 404.

WhatsApp por línea: `categoryWhatsappUrl("Ferretería")` en home, listado y banner de
detalle.

Testimonios de ejemplo en la home (`data/testimonials.ts`) y miga de pan en páginas
internas.

## Recomendación

- Sustituir testimonios y textos de `/nosotros` cuando el cliente envíe material real.
- Login/registro y comparar productos siguen siendo stubs.
- Si un logo oficial reemplaza un SVG, el fallback solo se verá si ese archivo falla.

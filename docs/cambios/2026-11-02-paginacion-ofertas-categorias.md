# Paginación en ofertas y categorías

- **Fecha:** 2026-11-02
- **Solicitud:** Aplicar la misma paginación de 16 productos del catálogo en Ofertas y al entrar a una categoría.
- **Archivos:** `components/CatalogPagination.tsx`, `app/ofertas/page.tsx`, `app/categorias/[slug]/page.tsx`, `components/CategoryDetailLive.tsx`
- **Commit:** (local)

## Qué había antes

Solo `/catalogo` recortaba a 16 y mostraba el numerador. `/ofertas` y `/categorias/[slug]` listaban todos los SKUs.

## Código nuevo

`CatalogPagination` recibe `basePath` (`/ofertas`, `/categorias/ferreteria`, etc.). Misma grilla, mismo límite, numerador centrado.

## Recomendación

Hoy hay ~13 ofertas y ~3 SKUs por categoría, así que el numerador 1/2 no aparece hasta que el catálogo crezca.

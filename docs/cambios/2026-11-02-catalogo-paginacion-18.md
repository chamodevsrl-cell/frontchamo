# Catálogo: 16 productos por página

- **Fecha:** 2026-11-02
- **Solicitud:** En `/catalogo` mostrar como máximo 16 productos y un numerador debajo para ver el resto.
- **Archivos:** `app/catalogo/page.tsx`, `components/CatalogPagination.tsx`, `components/CatalogFilters.tsx`, `data/products.ts`
- **Commit:** (local)

## Qué había antes

El catálogo pintaba todos los SKUs filtrados de una vez (hoy 22).

## Código nuevo

`paginateItems(..., 16)` recorta la lista. `?page=` cambia de hoja. El numerador (números 1, 2…) va centrado bajo la grilla; al filtrar se vuelve a la página 1. Con 22 SKUs de ejemplo: 16 + 6.

## Recomendación

Cuando el backend pagine de verdad, `GET /api/v1/catalog` debería aceptar `page` y `pageSize` en vez de recortar en el front.

# Panel: Marcas editables (logos del carrusel)

- **Fecha:** 2026-09-23
- **Solicitud:** En el apartado **Marcas** del panel, poder subir marcas
  nuevas con su logo para el carrusel.
- **Archivos:** `components/admin/AdminBrandsCards.tsx` (nuevo),
  `app/admin/(panel)/marcas/page.tsx`, `components/BrandsCarousel.tsx`,
  `components/ContentProvider.tsx`, `lib/cms.ts`, `lib/cms-image.ts`,
  `data/home.ts`, `API_CONTRACT_TIENDA.md`.
- **Commit:** (ver historial de Git)

## Qué había antes

- `/admin/marcas` era un placeholder ("Módulo en diseño base").
- El carrusel **Marcas distribuidoras** (home y `/ofertas`) leía directo el
  array fijo `distributorBrands` de `data/home.ts` (10 wordmarks SVG). Para
  cambiar un logo había que tocar código.

## Código nuevo (resumen)

- **`data/home.ts`** — tipo `DistributorBrand` (`id`, `name`, `src`,
  `hidden?`). `distributorBrands` queda como valores de fábrica.
- **`lib/cms.ts`** — `CmsState.brands: CmsBrand[]` (+ `defaultBrands()`,
  `isBrand()`, `visibleBrands()`). Si el CMS guardado no trae `brands`, se
  usan las de fábrica.
- **`ContentProvider.tsx`** — expone `brands` (solo visibles y con nombre).
- **`BrandsCarousel.tsx`** — lee `useSiteContent().brands`; si la lista
  queda vacía, no se renderiza. La key incluye el final del `src` para que
  el fallback de "logo roto" se reinicie al cambiar el logo.
- **`AdminBrandsCards.tsx`** (nuevo, mismo patrón que `AdminTeamCards`):
  - **Nueva marca** (se agrega al inicio), logo con `CmsImageField`
    (archivo/arrastrar o URL, vista previa en `contain`), nombre.
  - Orden con flechas ↑/↓ (= orden del carrusel), **Ocultar en la web**,
    **Quitar**.
  - **Guardar** (valida que todas tengan nombre) y **Restaurar** (vuelve a
    las 10 de fábrica).
- **`/admin/marcas`** ahora usa `AdminBrandsCards` (permiso `marcas`, ya
  existente en el sidebar).
- **`API_CONTRACT_TIENDA.md`** — `brands` en `GET/PUT /api/v1/site-content`
  (permiso `marcas`).

Verificado en el navegador: `/admin/marcas` lista las 10 marcas; se agregó
"CHAMO TEST" con logo `/logo.png`, se guardó y el carrusel del home la
mostró primera con el logo cargado. Después se restauró el estado. `tsc`,
`eslint` y `npm test` (30/30) sin errores.

## Recomendación

Hoy un logo subido desde el equipo se guarda como data URL en
`localStorage` (`chamo-cms-v1`), así que solo se ve en ese navegador y
cuenta para el cupo. Con backend: subir a `POST /api/v1/uploads` y guardar
la URL.

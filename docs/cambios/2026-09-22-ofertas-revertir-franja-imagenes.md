# Se revierte la franja de imágenes de Ofertas (a rediseñar desde cero)

- **Fecha:** 2026-09-22
- **Solicitud:** "Bro mejor borra todo el apartado de oferta y rediseñemos
  desde cero." Se preguntó el alcance exacto y el usuario confirmó: solo la
  **franja de imágenes (banner)** — no la página `/admin/ofertas` completa
  ni el campo de % de descuento del wizard de producto.
- **Archivos:** borrados `components/OffersBanner.tsx` y
  `components/admin/AdminOffersBannerEditor.tsx`; modificados `lib/cms.ts`,
  `data/page-banners.ts`, `app/ofertas/page.tsx`,
  `components/admin/AdminBannersStudio.tsx`,
  `app/admin/(panel)/ofertas/page.tsx`, `tests/smoke.test.ts`,
  `FRONTEND_DOCUMENTATION.md`, `docs/MANUAL.md`, `API_CONTRACT_TIENDA.md`,
  `docs/backend-handoff/MAPA-CONEXION.md`, `docs/SUGERENCIAS.md`.
- **Commit:** (pendiente)

## Qué había antes

La franja de imágenes de Ofertas (introducida en
[`2026-09-22-franja-imagenes-ofertas.md`](./2026-09-22-franja-imagenes-ofertas.md),
movida y ajustada en
[`2026-09-22-ofertas-panel-dedicado-descuento-porcentaje.md`](./2026-09-22-ofertas-panel-dedicado-descuento-porcentaje.md)
y
[`2026-09-22-ofertas-quitar-banner-anterior-limite-3-4.md`](./2026-09-22-ofertas-quitar-banner-anterior-limite-3-4.md))
reemplazaba el banner ancho normal de `/ofertas` por un panel oscuro +
fila de 3-4 imágenes enlazadas a producto o URL, editable desde
`/admin/ofertas`. El banner de una sola imagen para Ofertas ya no existía
en `/admin/banners`.

## Código nuevo (resumen) — en realidad, código que se quitó

- **Borrados:** `components/OffersBanner.tsx`,
  `components/admin/AdminOffersBannerEditor.tsx`.
- **`lib/cms.ts`** — se quitó el tipo `CmsOfferBannerTile`, el campo
  `offerBanner` de `CmsState`, su entrada en `emptyCmsState`, su parseo en
  `parseCms()` y el validador `isOfferBannerTile()`.
- **`data/page-banners.ts`** — se restauró `"ofertas"` en
  `PAGE_BANNER_IDS` y su entrada en `pageBannerCatalog` (mismo default de
  antes: `/images/categorias/pinturas.jpg`).
- **`app/ofertas/page.tsx`** — vuelve a usar `SitePageBanner` (con
  `pageId="ofertas"`) en vez de `OffersBanner`.
- **`AdminBannersStudio.tsx`** — la tarjeta "Ofertas" vuelve a aparecer en
  "Otras páginas" (automático, al restaurar `pageBannerCatalog`); se quitó
  el texto que decía "la franja se edita en Ofertas".
- **`app/admin/(panel)/ofertas/page.tsx`** — se quitó
  `<AdminOffersBannerEditor />` y su import. **Se conservó** la lista de
  solo lectura de productos en oferta del catálogo público (no era parte de
  lo que se pidió borrar).
- **`types/admin.ts`, `AdminProductFormStepPrecios.tsx`,
  `AdminNewProductForm.tsx`, `AdminProductPreviewCard.tsx`,
  `services/adminApi.ts`, `API_CONTRACT.md`** — **sin cambios**: el campo
  "% de descuento" del wizard de producto se queda tal cual, no era parte
  de lo que se pidió borrar.
- **`tests/smoke.test.ts`** — se restauró el fixture que esperaba
  `"ofertas"` en `mergePageBanners()`.
- **Documentación** — se corrigieron todas las menciones a la franja en
  `FRONTEND_DOCUMENTATION.md`, `docs/MANUAL.md`, `API_CONTRACT_TIENDA.md` y
  `docs/backend-handoff/MAPA-CONEXION.md` para que no describan código que
  ya no existe (esto fue justo lo que causó confusión la vuelta anterior:
  texto viejo mencionando "Ofertas" después de sacar la tarjeta). Las notas
  de `docs/cambios/` de la franja **no se borraron** — quedan como
  historial, marcadas `[REVERTIDO]` en `docs/SUGERENCIAS.md`.

Verificado: `tsc --noEmit`, `eslint` y `npm test` (30/30, con el fixture de
`pageBanners` restaurado) sin errores. No se verificó de nuevo en el
navegador porque es una reversión a un estado ya probado antes (el banner
simple de Ofertas funcionaba así desde el principio del proyecto).

## Recomendación

- Antes de rediseñar, vale la pena que el usuario mande de nuevo la
  referencia visual (o confirme si sigue siendo la misma) y aclare puntos
  que quedaron ambiguos la vuelta pasada: ¿el panel oscuro de la izquierda
  es necesario, o alcanza con la fila de imágenes sola? ¿Sigue queriendo el
  límite de 3-4, o eso también se redefine desde cero?

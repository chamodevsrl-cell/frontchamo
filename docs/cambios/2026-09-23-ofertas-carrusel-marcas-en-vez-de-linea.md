# Ofertas: carrusel de marcas en lugar de la línea divisoria

- **Fecha:** 2026-09-23
- **Solicitud:** En `/ofertas`, en vez de la línea que separa la grilla de
  4 secciones de las tarjetas de producto, mostrar ahí el mismo carrusel
  infinito de marcas distribuidoras del home.
- **Archivos:** `components/BrandsCarousel.tsx`, `app/ofertas/page.tsx`.
- **Commit:** (ver historial de Git)

## Qué había antes

El banner de Ofertas iba envuelto en un `<div>` con `border-b-[3px]`
(`border-b-4` en `sm:`) y padding inferior: una línea gris separaba la grilla
de las tarjetas de producto (ver
[`2026-09-22-ofertas-separador-bordes-mas-gruesos.md`](./2026-09-22-ofertas-separador-bordes-mas-gruesos.md)).

## Código nuevo (resumen)

- **`BrandsCarousel.tsx`** — nueva prop opcional
  `variant?: "section" | "inline"` (por defecto `"section"`, el home no
  cambia). `"inline"` lo dibuja como tarjeta redondeada (`rounded-2xl`, borde
  `brand-primary/20`) sin `max-w`/padding lateral propio, porque el `main` de
  la página ya los pone.
- **`app/ofertas/page.tsx`** — se quita el `<div>` con la línea; entre
  `OffersBanner` y `ProductCatalog` va
  `<div className="my-8 sm:my-10"><BrandsCarousel variant="inline" /></div>`.

Los logos siguen saliendo de `distributorBrands` (`data/home.ts`), igual que
en el home.

Verificado en el navegador: el carrusel aparece entre el banner y las
tarjetas, con el loop y los degradados laterales funcionando.

## Recomendación

Hacer las marcas editables desde `/admin/marcas` (hoy placeholder) para que
ambos carruseles tomen los logos oficiales desde el CMS.

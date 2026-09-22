# Ofertas: separador entre la grilla y las tarjetas + bordes más gruesos

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario mandó una captura anotada: una línea azul entre
  la grilla de 4 fotos y las tarjetas de producto de abajo (pedía separarlas
  con una línea ahí) y pidió que los contornos de la grilla de arriba fueran
  "un poco más gruesos".
- **Archivos:** `components/OffersBanner.tsx`, `app/ofertas/page.tsx`.
- **Commit:** (pendiente)

## Qué había antes

La grilla de 4 secciones (borde `border-2`, 2px) quedaba pegada directo a la
grilla de tarjetas de producto de abajo, sin margen ni línea divisoria entre
ambas.

## Código nuevo (resumen)

- **`OffersBanner.tsx`** — el borde exterior de la grilla pasa de
  `border-2` a `border-[3px]` (`border-4` en `sm:` y superiores).
- **`app/ofertas/page.tsx`** — el banner ahora va envuelto en un
  `<div className="mb-8 border-b-[3px] ... pb-8 sm:mb-10 sm:border-b-4 sm:pb-10">`:
  separa con margen + una línea divisoria del mismo grosor que el borde de
  la grilla, antes de que empiece la sección de productos en oferta.

Verificado en el navegador: la grilla de 4 fotos se ve con borde más grueso
y, debajo, una línea clara separándola de las tarjetas de producto — no
quedan pegadas. `tsc --noEmit`, `eslint` y `npm test` (30/30) sin errores.

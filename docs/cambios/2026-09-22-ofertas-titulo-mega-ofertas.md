# Ofertas: título "¡Mega ofertas!" arriba de la grilla de 4 secciones

- **Fecha:** 2026-09-22
- **Solicitud:** "arriba del banner de oferta pon un título o un H1 que
  diga mega ofertas !!!!!".
- **Archivos:** `components/OffersBanner.tsx`.
- **Commit:** (pendiente)

## Qué había antes

Tras quitar el `StampBand` (ver
[`2026-09-22-ofertas-4-secciones-sin-titulo-encima.md`](./2026-09-22-ofertas-4-secciones-sin-titulo-encima.md)),
la grilla de 4 secciones no tenía ningún título arriba.

## Código nuevo (resumen)

Se agregó un `<h1>` justo arriba de la grilla (solo en la rama donde las 4
secciones están completas — el banner de respaldo con menos de 4 sigue
usando su propio título vía `SitePageBanner`, sin duplicar): "¡Mega
**ofertas**!" en `font-display`, mayúsculas, con "ofertas" en
`brand-gold` para destacar, centrado.

Verificado en el navegador: con las 4 secciones completas, `/ofertas`
muestra "¡MEGA OFERTAS!" arriba de la grilla de fotos. `tsc --noEmit`,
`eslint` y `npm test` (30/30) sin errores.

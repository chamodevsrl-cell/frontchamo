# Ofertas: la grilla de 4 secciones reemplaza el banner completo (sin título encima)

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario mandó una captura mostrando el título "OFERTAS
  DESCUENTOS" arriba y la grilla de 4 fotos debajo, y aclaró: "la idea es
  que esa sección esté en remplazo del banner que dice ofertas" — quería
  que la grilla sea *todo* el banner, no que aparezca debajo del título.
- **Archivos:** `components/OffersBanner.tsx`.
- **Commit:** (pendiente)

## Qué había antes

Cuando las 4 secciones estaban completas, `OffersBanner.tsx` mostraba un
encabezado (`StampBand` + `StampHeading`, breadcrumb y subtítulo) y **debajo**
la grilla de 4 fotos — dos bloques apilados.

## Código nuevo (resumen)

Se sacó el bloque `<StampBand>...</StampBand>` de la rama de 4 secciones
completas: ahora esa rama solo devuelve la grilla de fotos, sin título ni
breadcrumb encima — la grilla **es** el banner. (El fallback sin 4 secciones
completas no cambió: sigue siendo `SitePageBanner`, con su título de
siempre.)

Verificado en el navegador: con las 4 secciones completas, `/ofertas` ya no
muestra "OFERTAS DESCUENTOS" arriba — la página pasa directo del menú a la
grilla de 4 fotos. `tsc --noEmit`, `eslint` y `npm test` (30/30) sin errores.

## Recomendación

- Sin el breadcrumb "Inicio / Ofertas", se pierde ese rastro visual en este
  modo — si más adelante se extraña, se puede reinsertar sin el título
  grande (solo `<Breadcrumbs>` chico, sin `StampBand`).

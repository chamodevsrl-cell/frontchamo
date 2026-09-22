# Ofertas: rediseño del banner — sin panel oscuro, 4 secciones con borde

- **Fecha:** 2026-09-22
- **Solicitud:** Después de revertir la franja de imágenes (ver
  [`2026-09-22-ofertas-revertir-franja-imagenes.md`](./2026-09-22-ofertas-revertir-franja-imagenes.md)),
  el usuario pidió rediseñarla desde cero: "la idea es que quites el panel y
  pongas uno donde se divida 4 secciones con bordes" — sin el panel oscuro
  de título a la izquierda, un banner de exactamente 4 secciones iguales
  separadas por borde.
- **Archivos:** `lib/cms.ts`, `components/OffersBanner.tsx` (nuevo),
  `components/admin/AdminOffersBannerEditor.tsx` (nuevo),
  `app/ofertas/page.tsx`, `app/admin/(panel)/ofertas/page.tsx`,
  `components/admin/AdminBannersStudio.tsx`.
- **Commit:** (pendiente)

## Qué había antes

`/ofertas` usaba el banner ancho normal de una sola imagen
(`SitePageBanner`, editable en `/admin/banners`) — sin franja de imágenes
(se había revertido en el cambio anterior).

## Código nuevo (resumen)

- **`lib/cms.ts`** — vuelve el tipo `CmsOfferBannerTile` (`id`, `image`,
  `alt`, `label`, `productId`, `url`) y el campo `offerBanner:
  CmsOfferBannerTile[]` de `CmsState`, igual forma que la versión anterior
  (para no reinventar lo que ya funcionaba a nivel de datos).
- **`components/OffersBanner.tsx`** (nuevo, distinto del anterior) — **sin
  panel oscuro**: el título/breadcrumb/subtítulo se renderizan arriba con el
  mismo estilo "banda simple" que usa cualquier página sin banner CMS
  (`StampBand` + `StampHeading`, fondo punteado claro, sin foto de fondo).
  Debajo, si hay **exactamente 4** secciones con imagen y destino
  (producto o URL), se muestra un grid `grid-cols-2 sm:grid-cols-4` con
  `gap-[3px]` sobre fondo oscuro — el efecto visual son líneas divisorias
  finas entre las 4 fotos, más un borde grueso alrededor de todo el banner.
  Cada sección se comporta igual que antes: clic abre el modal del producto,
  o navega a la URL si la tiene (interna con `next/link`, externa con
  `target="_blank"`). Con menos de 4 completas, cae al banner normal de
  siempre (`SitePageBanner`).
- **`components/admin/AdminOffersBannerEditor.tsx`** (nuevo) — ya no hay
  botones "Agregar/Quitar imagen": son **4 casillas fijas** ("Sección 1" a
  "Sección 4"), siempre las 4 a la vista. Contador "Vas N/4" en ámbar hasta
  completar, "Completo (4/4)" en azul cuando están las 4. Mismos campos por
  sección que la versión anterior: imagen (`CmsImageField`), texto opcional,
  producto (`<select>`, se deshabilita si hay URL) y URL personalizada
  opcional.
- **`app/ofertas/page.tsx`** — vuelve a usar `OffersBanner` (ya no
  `SitePageBanner` directo).
- **`app/admin/(panel)/ofertas/page.tsx`** — vuelve a incluir
  `<AdminOffersBannerEditor />`, arriba de la lista de productos en oferta.
- **`AdminBannersStudio.tsx`** — el texto de arriba vuelve a avisar que
  Ofertas puede mostrar el banner de 4 secciones, con link a `/admin/ofertas`.

Verificado en el navegador: sin las 4 secciones completas, `/ofertas` se ve
igual que el banner normal (fallback). Se completaron las 4 casillas desde
`/admin/ofertas` (el contador pasó de "Vas 0/4" a "Completo (4/4)"), se
guardó, y `/ofertas` mostró el nuevo diseño: encabezado sin panel arriba +
4 fotos con líneas divisorias abajo. El clic en una sección abrió el
producto correcto en el modal. `tsc --noEmit`, `eslint` y `npm test`
(30/30) sin errores.

## Recomendación

- El límite fijo de 4 (sin agregar/quitar) es intencional por el pedido
  "4 secciones" — si más adelante se quiere un número variable, hay que
  decidir de nuevo el layout (el `gap-[3px]` como líneas divisorias asume
  una grilla par, con 3 o 5 secciones se vería distinto).

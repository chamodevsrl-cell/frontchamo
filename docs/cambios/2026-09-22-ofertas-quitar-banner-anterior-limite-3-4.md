# Ofertas: se quita el banner anterior de un solo cuadro + límite 3-4 imágenes

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario probó la franja en su propio navegador (4
  imágenes con precios y badges de descuento) y pidió dos ajustes: quitar el
  banner de una sola imagen que existía antes para Ofertas, y limitar la
  franja a un máximo de 4 imágenes y un mínimo de 3.
- **Archivos:** `data/page-banners.ts`, `components/OffersBanner.tsx`,
  `components/admin/AdminOffersBannerEditor.tsx`,
  `components/admin/AdminBannersStudio.tsx`, `tests/smoke.test.ts`.
- **Commit:** (pendiente)

**Addendum (misma fecha):** el usuario seguía viendo "Ofertas" mencionado en
`/admin/banners` y dudaba si el cambio se había aplicado. La tarjeta ya
estaba eliminada, pero el párrafo de arriba de la página seguía diciendo
"el banner de Nosotros, Contacto, **Ofertas** y Catálogo" — texto viejo que
no se había actualizado al sacar la tarjeta. Se corrigió a "el banner de
Nosotros, Contacto y Catálogo. La franja de imágenes de Ofertas… ya no se
edita acá — se mudó a Ofertas [link]".

## Qué había antes

Ofertas tenía dos sistemas de banner conviviendo: la franja nueva de
imágenes (con 0 tiles cae al banner de una sola imagen) **y** ese banner de
una sola imagen seguía siendo editable aparte en `/admin/banners` →
"Otras páginas" (`pageBannerCatalog`, id `"ofertas"`), aunque ya no tenía
sentido mantenerlo separado. Tampoco había límite de cantidad: se podían
agregar tantas imágenes como se quisiera a la franja.

## Código nuevo (resumen)

- **`data/page-banners.ts`** — se quitó `"ofertas"` de `PAGE_BANNER_IDS` y su
  entrada de `pageBannerCatalog`. Esto automáticamente saca la tarjeta
  "Ofertas" de `/admin/banners` → "Otras páginas" (esa grilla se arma
  iterando `pageBannerCatalog`) y hace que `SitePageBanner` con
  `pageId="ofertas"` ya no encuentre banner — pero `OffersBanner.tsx` ya no
  depende de eso (ver abajo).
- **`components/OffersBanner.tsx`** — ya no usa `SitePageBanner` como
  fallback; ahora arma su propio fallback simple (`StampBand` + título,
  igual que el de cualquier página sin banner CMS) directamente. Nuevo
  límite: `MIN_TILES = 3`, `MAX_TILES = 4` — con menos de 3 imágenes
  **resueltas** se ve el fallback; nunca se muestran más de 4 aunque el CMS
  tenga guardadas más (`resolved.slice(0, MAX_TILES)`).
- **Bug encontrado y arreglado de paso:** una imagen de la franja sin foto
  subida (`tile.image` vacío) tumbaba `next/image` en la tienda pública
  (`Image is missing required "src" property`) — pasaba el filtro porque
  solo se exigía producto o URL, no imagen. Ahora `resolved` también exige
  `tile.image` no vacío.
- **`AdminOffersBannerEditor.tsx`** — el botón "Agregar imagen" se
  deshabilita al llegar a 4; aviso ámbar mientras hay menos de 3
  ("Te faltan N imágenes más…"); grilla de tarjetas a 4 columnas en desktop.

Verificado en el navegador: `/admin/banners` → "Otras páginas" ya no
muestra "Ofertas" (solo Nosotros/Contacto/Catálogo). En
`/admin/ofertas`, al llegar a 4 imágenes el botón "Agregar imagen" queda
deshabilitado (confirmado por JS: `disabled === true`); con menos de 3, el
sitio muestra el banner simple sin foto en vez de romper o quedarse en el
banner viejo. El bug del `src` vacío se reprodujo (consola con
`Image is missing required "src" property`) y se confirmó resuelto después
del fix (recarga limpia, sin errores). `tsc --noEmit`, `eslint` y
`npm test` (30/30, se ajustó un fixture que esperaba `"ofertas"` en
`pageBannerCatalog`) sin errores.

## Recomendación

- Si en el futuro se permite reordenar o editar tiles ya guardados con
  imagen vacía, conviene validar en el propio formulario del panel (no solo
  en el front público) para que el admin note el problema antes de guardar,
  no después.

# Ofertas: banner reemplazado por franja de imágenes enlazadas a producto

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario mandó una referencia visual (panel oscuro con
  título + fila de fotos, cada una con su propio título) y pidió reemplazar
  el banner de `/ofertas` por algo así, donde se puedan subir imágenes y cada
  una lleve al producto de la promoción. En una segunda vuelta pidió poder
  editar las imágenes y poner directamente la URL a la que redirige cada una
  (no solo elegir un producto de la lista).
- **Archivos:** `lib/cms.ts`, `components/OffersBanner.tsx` (nuevo),
  `components/admin/AdminBannersStudio.tsx`, `app/ofertas/page.tsx`.
- **Commit:** (pendiente)

## Qué había antes

`/ofertas` usaba `SitePageBanner` (el mismo banner ancho de una sola imagen
que usan Nosotros, Contacto y Catálogo), editable desde `/admin/banners`
como una imagen + texto alternativo, sin ningún enlace a producto.

## Código nuevo (resumen)

- **`lib/cms.ts`** — nuevo tipo `CmsOfferBannerTile` (`id`, `image`, `alt`,
  `productId`, `url`, `label`) y campo `offerBanner: CmsOfferBannerTile[]` en
  `CmsState` (default `[]`, con su validador en `parseCms`). `url` es
  opcional; si tiene contenido, gana sobre `productId`.
- **`components/OffersBanner.tsx`** (nuevo) — reemplazo de `SitePageBanner`
  específico para `/ofertas`: si `cms.offerBanner` está vacío, se comporta
  exactamente igual que antes (cae al banner normal vía `SitePageBanner`).
  Si hay imágenes, muestra un panel oscuro a la izquierda (stamp "OFERTAS
  DESCUENTOS" + subtítulo, igual que antes) y a la derecha una fila de
  imágenes. Por cada una: si tiene `url`, es un enlace (`next/link` para
  rutas internas, `<a target="_blank">` si empieza con `http`); si no,
  resuelve `productId` contra `data/products.ts` (`getProductById`) y el
  clic abre el `ProductModal` de ese producto (mismo patrón que
  `FeaturedOffers.tsx`/`ProductCatalog.tsx`: estado local + `<ProductModal>`).
  Una imagen sin `url` ni producto resoluble se omite en silencio.
- **`AdminBannersStudio.tsx`** — nueva sección "Ofertas — franja de
  imágenes" entre el slider de inicio y "Otras páginas": botón "Agregar
  imagen", y por cada una: `CmsImageField` (subir archivo o pegar URL, igual
  que el resto del panel), texto opcional sobre la imagen (si queda vacío
  usa el nombre del producto), un `<select>` con todo `featuredProducts` y un
  campo "URL personalizada (opcional)" — al escribir algo ahí, el `<select>`
  de producto se deshabilita visualmente para dejar claro cuál manda. Se
  guarda junto con el resto de banners (mismo botón "Guardar banners");
  "Restaurar código" también la vacía.
- **`app/ofertas/page.tsx`** — cambia `SitePageBanner` por `OffersBanner`
  (mismas props, sin `pageId` porque ya es específico de Ofertas).

Verificado en el navegador: sin imágenes configuradas se ve igual que antes
(fallback). Se agregó una imagen apuntando a un producto (clic abrió el
modal de ese producto), y después se le puso una URL personalizada
(`/categorias/electricos`) al mismo tile — el `<select>` de producto quedó
deshabilitado y el clic navegó a esa categoría en vez de abrir el modal.
`tsc --noEmit`, `eslint` y `npm test` (30/30) sin errores en ambas vueltas.

## Recomendación

- Las imágenes se guardan como antes (`localStorage`/data URL) — cuando se
  conecte el backend real de la tienda (`API_CONTRACT_TIENDA.md` §1, CMS del
  sitio), este campo (`offerBanner`) viaja dentro del mismo `CmsState`, sin
  contrato aparte.
- Si más adelante se quiere reordenar las imágenes (hoy solo agregar/quitar,
  en el orden en que se agregaron), agregar botones mover-izquierda/derecha
  como ya existen en las imágenes del wizard de producto.

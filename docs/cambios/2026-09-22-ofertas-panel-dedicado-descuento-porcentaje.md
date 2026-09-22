# Ofertas: editor de franja movido a /admin/ofertas + % de descuento en productos

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario mandó capturas mostrando que `/admin/ofertas`
  seguía siendo el placeholder "Módulo en diseño base" y pidió que el editor
  de la franja de imágenes (fotos + link de destino) viva ahí, no en
  Banners; y que al crear/editar un producto en el panel se pueda marcar "en
  oferta" y poner el % de descuento que se aplica.
- **Archivos:** `components/admin/AdminOffersBannerEditor.tsx` (nuevo),
  `app/admin/(panel)/ofertas/page.tsx`, `components/admin/AdminBannersStudio.tsx`,
  `types/admin.ts`, `services/adminApi.ts`,
  `components/admin/AdminProductFormStepPrecios.tsx`,
  `components/admin/AdminNewProductForm.tsx`,
  `components/admin/AdminProductPreviewCard.tsx`, `API_CONTRACT.md`,
  `tests/smoke.test.ts`.
- **Commit:** (pendiente)

## Qué había antes

La franja de imágenes de Ofertas (ver
[`2026-09-22-franja-imagenes-ofertas.md`](./2026-09-22-franja-imagenes-ofertas.md))
se editaba dentro de `/admin/banners`, aunque el sidebar ya tiene un ítem
"Ofertas" (`/admin/ofertas`, permiso `ofertas` propio, distinto de
`banners`) que seguía siendo el placeholder genérico
(`AdminPlaceholder.tsx`, "Módulo en diseño base…"). El wizard de producto
(Fase 3) ya tenía "En oferta" + "Precio anterior", pero no un % de
descuento explícito — el badge "-X% OFF" de la tienda (`discountPercent` en
`FeaturedProduct`) no tenía equivalente en el `Product` del panel.

## Código nuevo (resumen)

- **`AdminOffersBannerEditor.tsx`** (nuevo) — la UI de la franja de
  imágenes, extraída de `AdminBannersStudio.tsx` a su propio componente
  autocontenido (guarda solo `cms.offerBanner`, con su propio botón
  "Guardar"). `AdminBannersStudio.tsx` ya no la incluye; su texto ahora
  enlaza a **Ofertas** para encontrarla.
- **`app/admin/(panel)/ofertas/page.tsx`** — reemplaza el placeholder.
  Muestra `AdminOffersBannerEditor` y, debajo, una lista de solo lectura de
  los productos que hoy tienen `badge === "oferta"` en el catálogo público
  (`data/products.ts`), con precio y `-X%`. Incluye un aviso explícito: esta
  lista **no** es lo mismo que "Productos" del panel — son dos catálogos
  separados hasta que haya backend real (ver `docs/backend-handoff/`).
- **`types/admin.ts`** — nuevo campo `discountPercent: number | null` en
  `Product` (y por extensión en `CreateProductInput`/`UpdateProductInput`).
- **`AdminProductFormStepPrecios.tsx`** — junto a "Precio anterior", nuevo
  input "% de descuento (badge)"; independiente de `oldPrice`, no se
  calcula solo.
- **`AdminNewProductForm.tsx`** / **`AdminProductPreviewCard.tsx`** — estado
  y payload del wizard incluyen `discountPercent`; la vista previa lateral
  ahora muestra "-X% OFF" en vez de solo "Oferta" cuando hay un valor.
- **`services/adminApi.ts`** — `seedProducts()` mapea `discountPercent`
  desde `FeaturedProduct` al sembrar el mock; `createProduct`/`updateProduct`
  ya lo propagan solos (spread del input).
- **`API_CONTRACT.md`** — el ejemplo JSON de `Product` y su nota de campos
  suman `discountPercent`.

Verificado en el navegador: `/admin/ofertas` muestra el editor de franja
(con la imagen ya guardada en una vuelta anterior) y la lista de productos
en oferta con el aviso; `/admin/banners` ya no repite la sección; en el
wizard de producto, marcar "En oferta" y escribir "25" en "% de descuento"
actualiza la vista previa a "-25% OFF" al toque. `tsc --noEmit`, `eslint` y
`npm test` (30/30) sin errores.

## Recomendación

- El aviso de `/admin/ofertas` es honesto a propósito: hoy no hay forma de
  que un producto marcado "en oferta" en `/admin/productos` aparezca solo en
  `/ofertas` — necesita que el catálogo del panel (`services/adminApi.ts`,
  mock en memoria) y el catálogo público (`data/products.ts`, array
  estático) sean la misma fuente, lo cual es justamente el trabajo de
  "conectar el backend real" ya documentado (ver
  [`API_CONTRACT_TIENDA.md` §2](../../API_CONTRACT_TIENDA.md#2-catálogo-público)
  y `docs/backend-handoff/MAPA-CONEXION.md`). No conviene resolverlo a medias
  solo para Ofertas — cuando se conecte, se resuelve para todo el catálogo a
  la vez.

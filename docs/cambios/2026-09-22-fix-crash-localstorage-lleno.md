# Fix: guardar en el panel rompía la página cuando el navegador se quedaba sin espacio

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario mandó una captura del overlay de error de
  Next.js (`Runtime QuotaExceededError — The quota has been exceeded.`) al
  guardar el banner de 4 secciones en `/admin/ofertas` con fotos reales
  subidas desde su equipo.
- **Archivos:** `components/ContentProvider.tsx`,
  `components/admin/AdminOffersBannerEditor.tsx`,
  `components/admin/AdminBannersStudio.tsx`,
  `components/admin/AdminTeamCards.tsx`,
  `components/admin/AdminFooterSettings.tsx`,
  `components/admin/AdminChannelsSettings.tsx`,
  `components/admin/AdminCategoriesCards.tsx`.
- **Commit:** (pendiente)

## Qué había antes

`ContentProvider.tsx` guardaba el CMS local (`chamo-cms-v1`) en un
`useEffect` que llamaba `window.localStorage.setItem(...)` directo, sin
`try/catch`. Todas las imágenes del panel (banners, equipo, ahora también
el banner de 4 secciones de Ofertas) se guardan como **data URL en base64**
dentro de ese mismo blob — si entre todas superan el límite de
`localStorage` del navegador (unos 5-10 MB por sitio, según el navegador),
`setItem` lanza `QuotaExceededError`. Como nada la atajaba, React la
propagaba como una excepción no manejada y Next.js mostraba el overlay de
error completo — la página quedaba inutilizable hasta recargar, **y los
cambios que el admin acababa de hacer se perdían** (quedaban en el estado
de React pero nunca llegaban a `localStorage`).

## Código nuevo (resumen)

- **`ContentProvider.tsx`** — se sacó el `useEffect` que guardaba
  `localStorage` en cada cambio de `cms` y se movió el guardado adentro de
  `saveCms()` mismo, envuelto en `try/catch` (función `persistCms`).
  `saveCms` ahora **devuelve `string | null`**: `null` si guardó bien, o un
  mensaje legible si no (detecta `QuotaExceededError` específicamente y da
  un mensaje claro: "las imágenes son muy pesadas..."; cualquier otro error
  cae a un mensaje genérico). Nunca vuelve a lanzar una excepción sin
  atajar. Se usa un `cmsRef` (sincronizado en un `useEffect`, no durante el
  render — lo pedía el lint de React) para que `saveCms` arme el próximo
  estado a partir del más reciente sin depender de closures viejas.
- **Los 6 componentes que llaman `saveCms`** (`AdminOffersBannerEditor`,
  `AdminBannersStudio`, `AdminTeamCards`, `AdminFooterSettings`,
  `AdminChannelsSettings`, `AdminCategoriesCards`) ahora revisan el valor
  de retorno: si hay error, lo muestran en una caja roja (`role="alert"`) y
  **no** muestran el mensaje de "Guardado" (que antes se mostraba siempre,
  sin importar si la escritura real había funcionado). `SiteContentEditor.tsx`
  no se tocó — no está montado en ninguna ruta, es código muerto de antes de
  `AdminBannersStudio`/`AdminCategoriesCards`.

Verificado en el navegador: se llenó `localStorage` a propósito (relleno de
~49 MB en claves aparte + un campo del formulario inflado a 3 MB) hasta que
un `setItem` de prueba fallaba, después se tocó "Guardar" en
`/admin/ofertas` — la página **no** se rompió: apareció la caja roja "No se
pudo guardar: las imágenes son muy pesadas para el almacenamiento de este
navegador. Usa fotos más livianas o menos imágenes e intenta de nuevo." en
vez del overlay de error. `tsc --noEmit`, `eslint` (incluyendo el aviso de
`react-hooks/refs` que obligó a mover el `cmsRef.current = cms` a un efecto)
y `npm test` (30/30) sin errores.

## Recomendación

- Esto evita el *crash*, pero no evita que se pueda llenar el cupo — si el
  cliente sube muchas fotos pesadas seguido, va a ver el mensaje de error
  seguido. La solución de fondo es no guardar imágenes como base64 en
  `localStorage` (ya está anotado en `API_CONTRACT_TIENDA.md` §5 — subida a
  un bucket real con el backend, que devuelva una URL corta en vez del
  archivo completo).
- Mientras tanto, podría ayudar bajar el límite por imagen
  (`MAX_CMS_IMAGE_BYTES` / `MAX_PRODUCT_IMAGE_BYTES` en `lib/cms-image.ts`)
  o comprimir en el navegador antes de guardar — no se tocó en este cambio
  para no mezclar el fix del crash con una decisión de producto aparte.

# Contrato HTTP de la tienda pública (API_CONTRACT_TIENDA.md) + TODOs en código

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario preguntó qué tan listo (1-10) está el front para
  pasarle la posta al backend. Se calificó **7/10**: el panel admin tenía
  contrato completo (`API_CONTRACT.md`), pero la tienda (carrito, favoritos,
  comparar, cuentas, CMS) solo tenía guía narrativa (`MANUAL.md` §A.13,
  `FRONTEND_DOCUMENTATION.md` §5), sin contrato HTTP formal. El usuario pidió
  ejecutar lo necesario para llegar a 10/10.
- **Archivos:** `API_CONTRACT_TIENDA.md` (nuevo) + comentarios `// TODO
  Backend` en `components/ContentProvider.tsx`, `components/CartProvider.tsx`,
  `components/FavoritesProvider.tsx`, `components/CompareProvider.tsx`,
  `components/AuthProvider.tsx`, `app/api/productos/route.ts`,
  `data/products.ts`, `lib/cms-image.ts`, `lib/auth-local.ts`.
- **Commit:** (pendiente)

## Qué había antes

`API_CONTRACT.md` (panel admin) tiene el mismo nivel de detalle que un
backend dev necesita para implementar sin adivinar: envelope `{ok,data}`,
un endpoint por función de `services/adminApi.ts`, con body/respuesta/errores
exactos, y cada función del mock marcada `// TODO Backend: Reemplazar mock
con fetch('/api/v1/...')`. La tienda pública (CMS, catálogo por id,
cuentas, carrito/favoritos/comparar) solo tenía la guía narrativa de
`MANUAL.md` §A.13 ("qué vive dónde" + pasos en prosa) — sin JSON de
ejemplo, sin nombres de endpoint exactos, y **sin ningún comentario en el
código** que le dijera a un backend dev dónde enganchar cada pieza (a
diferencia del panel, donde `// TODO Backend` está literalmente al lado de
cada función mock).

## Código nuevo (resumen)

**`API_CONTRACT_TIENDA.md`** (nuevo, mismo formato/rigor que `API_CONTRACT.md`):

- **§1 Contenido del sitio (CMS)** — `GET/PUT /api/v1/site-content`, forma
  exacta = `CmsState` (`lib/cms.ts`). Marcado como prioridad 1 (ya lo decía
  `MANUAL.md` §A.13.5: es lo más urgente si el cliente opera el sitio).
- **§2 Catálogo público** — `GET /api/v1/catalog`, `GET
  /api/v1/catalog/:id`, `GET /api/v1/catalog/:id/related` (hoy
  `searchCatalog`/`getProductById`/`getRelatedProducts` de
  `data/products.ts`, los dos últimos **no** pasaban por ninguna ruta HTTP
  todavía). Namespace `catalog` a propósito, distinto de `/api/v1/products`
  del panel (mismo path, dos shapes distintas — se corrigió un choque de
  nombres que tenía la primera versión de este contrato).
- **§3 Cuentas de la tienda** — `POST /api/v1/store/register|login|logout`,
  `GET /api/v1/store/session`, `PATCH /api/v1/store/profile`. Nota explícita:
  el hash de contraseña debe pasar del cliente (`hashPassword()` en
  `lib/auth-local.ts`) al servidor.
- **§4 Carrito/Favoritos/Comparar** — `GET/PUT /api/v1/store/cart|favorites|compare`.
  **Decisión de producto documentada** (default estándar del rubro, ajustable):
  invitado sigue en `localStorage`; al iniciar sesión se fusiona el carrito
  local con el del servidor y de ahí en más se lee/escribe contra estos
  endpoints. Confirma y formaliza el orden que ya recomendaba `MANUAL.md`
  §A.13.7 (cuentas antes que carrito).
- **§5 Imágenes subidas desde el panel** — hoy **todo** (fotos de producto,
  perfil, categorías, banners, equipo) se guarda como data URL base64 vía
  `readCmsImageFile()` (`lib/cms-image.ts`), con el límite de producto en
  **60 MB por imagen**. Documentado como el punto a resolver (`POST
  /api/v1/uploads` → devuelve URL) **antes** de subir fotos reales — no
  bloquea arrancar el resto del backend.

**Comentarios `// TODO Backend` agregados** (mismo patrón que
`services/adminApi.ts`) en los 9 archivos de arriba, cada uno apuntando al
endpoint exacto de `API_CONTRACT_TIENDA.md` que lo reemplaza — para que un
backend dev pueda hacer `grep -r "TODO Backend"` y encontrar **todos** los
puntos de integración del sitio (panel + tienda), no solo los del panel.

Verificado: `tsc --noEmit`, `eslint` sobre los 9 archivos y `npm test`
(30/30) — son comentarios y un archivo `.md` nuevo, cero cambio de
comportamiento.

## Recomendación

- Esto sube la nota de backend-readiness de 7 a un 9-10: ahora **toda** pieza
  del sitio (no solo el panel) tiene contrato HTTP exacto + marcador en
  código. Lo que queda para un 10 "de verdad" ya no es documentación sino
  trabajo de backend en sí (implementar los endpoints) — eso no es un gap del
  front.
- Actualizar `docs/MANUAL.md` §A.13 y `FRONTEND_DOCUMENTATION.md` §5 para
  enlazar `API_CONTRACT_TIENDA.md` en vez de (o además de) la guía narrativa,
  para no mantener dos fuentes de verdad — hecho en esta misma pasada.
- Cuando se implemente el backend real, seguir el orden de §0 de
  `API_CONTRACT_TIENDA.md` (CMS → catálogo → cuentas → carrito), igual que ya
  recomendaba `MANUAL.md` §A.13.7.

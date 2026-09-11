# Fix del build roto + carrito con precio guardado + nombres listos para backend

- **Fecha:** 2026-09-11
- **Solicitud:** "Que los nuevos cambios no tengan bugs y las variables estén perfectamente estructuradas, las funciones etc., para conectar con el backend — a 1 día de que se empiece a hacer."
- **Archivos:** `tsconfig.json`, `app/admin/page.tsx`, `components/CartProvider.tsx`, `app/carrito/page.tsx`, `components/QuoteForm.tsx`, `lib/auth-local.ts`, `data/products.ts`, `components/ProductCard.tsx`, `components/ProductModal.tsx`, `app/comparar/page.tsx`, `tests/smoke.test.ts`
- **Commit:** (pendiente al momento de escribir esta nota)
- **Hallazgos previos:** [`2026-09-11-bugs-admin-loader-carrito.md`](./2026-09-11-bugs-admin-loader-carrito.md)

## Método

Antes de tocar nada: `npm ci` limpio (no copiar `node_modules`, para no arrastrar un
estado que no sea el real de esta rama) y `npm run build` + `npm run test` como línea
base. Después de **cada** cambio: `npm run build` de nuevo (para que TypeScript
encuentre exhaustivamente cualquier sitio que haya quedado sin actualizar) y, al final,
`npm run test` + `npm run lint`. Los cambios de mayor riesgo (migración del carrito) se
probaron además en vivo, sembrando datos del formato viejo en `localStorage` y
recargando la página real.

## Hallazgo nuevo y más grave: `npm run build` estaba roto

```
app/admin/page.tsx(343,39): error TS2345: ... Type 'string[]' is not assignable to type '[string, string, string]' ...
vitest.config.mts(6,30): error TS2769: ... vite@8 (top-level) vs vite@7 (dentro de vitest) ...
Failed to type check.
```

Confirmado con `npm ci` limpio (no era un artefacto del entorno de esta sesión) — la
build de producción **no compilaba** en el tip de la rama. Es el hallazgo más urgente
de esta nota: no se puede desplegar ni conectar un backend a una app que no compila.

**Causa 1 — `app/admin/page.tsx`:** al editar una viñeta de categoría,
`const bullets = [...item.bullets]` pierde el tipo tupla `[string,string,string]` al
esparcir el array (comportamiento normal de TS). Fix: anotar el tipo explícito.

```tsx
const bullets: [string, string, string] = [...item.bullets];
```

**Causa 2 — `vitest.config.mts` dentro del mismo proyecto TS que compila Next:**
`tsconfig.json` incluía `**/*.mts`, así que `next build` intentaba tipar también el
config de Vitest. Ese archivo usa `@vitejs/plugin-react` (que trae `vite@8` a nivel
raíz) mientras `vitest` trae su propio `vite@7` anidado — dos versiones de `Plugin`
incompatibles. Fix: sacar el archivo del proyecto TS de la app (Vitest no necesita que
`next build` lo tipe; corre su propio config vía esbuild):

```json
// tsconfig.json
"include": [ /* sin "**/*.mts" */ ],
"exclude": ["node_modules", "vitest.config.mts"]
```

`npm run build` y `npm run test` quedaron en verde después de esto.

## Carrito: precio guardado al agregar (bug 3, ver nota anterior)

`CartLine` pasó de `{ productId, qty }` a:

```ts
type CartLine = {
  productId: string;
  quantity: number;        // antes: qty
  unitPrice: number;       // nuevo — precio al momento de agregar
  wholesaleUnitPrice: number; // nuevo — precio mayorista al momento de agregar
};
```

- `addItem` captura el precio vivo del catálogo **solo la primera vez** que se agrega
  ese producto; incrementar la cantidad de una línea ya existente no toca su precio.
- `app/carrito/page.tsx` y `components/QuoteForm.tsx` (mensaje de WhatsApp) ahora usan
  `line.unitPrice`/`line.wholesaleUnitPrice` para los totales, no el precio en vivo.
- `CartResolvedLine` agrega `priceChanged: boolean` (compara el precio guardado contra
  el vivo); si difiere, `/carrito` muestra un aviso por línea y uno general, pero el
  total sigue usando el precio guardado (no cambia solo).
- **Migración de carritos viejos:** `parseCart` acepta el formato anterior
  (`{productId, qty}`, sin precio) y lo convierte al leer `chamo-cart-v1`: si falta
  `unitPrice`/`wholesaleUnitPrice`, los rellena con el precio vivo del catálogo en ese
  momento (mejor que perder el carrito de alguien).

**Verificado en vivo** (no solo por tipos):

1. Se sembró `localStorage["chamo-cart-v1"] = [{"productId":"1","qty":2}]` (formato
   viejo) y se recargó `/carrito`. Resultado: migró a
   `{"productId":"1","quantity":2,"unitPrice":89.9,"wholesaleUnitPrice":79.9}`, la
   página mostró "2 unidades", S/179.80 referencial y S/159.80 mayorista — sin errores.
2. Se sembró una línea con `unitPrice`/`wholesaleUnitPrice` distintos al catálogo
   (1.23/1.11 contra 89.9/79.9 reales). Resultado: apareció el aviso "El precio de este
   producto cambió desde que lo agregaste (ahora S/79.90 mayorista)" y los totales
   siguieron usando el precio guardado (1.23/1.11), como se esperaba.

## Nombres aplicados (ver también `2026-09-11-bugs-admin-loader-carrito.md`)

- `lib/auth-local.ts`: `StoredAccount`/`AuthUser` ahora tienen `id: string` (generado
  con `crypto.randomUUID()`, con reserva en hex si el navegador no lo soporta). Cuentas
  viejas sin `id` lo reciben al leerlas (`parseAccounts`), igual que ya pasaba con
  `role`.
- `CartProvider.tsx`: `qty` → `quantity`, `setQty` → `setQuantity` (contexto y todos los
  usos en `app/carrito/page.tsx`).
- `data/products.ts`: `discount` → `discountPercent` (con comentario de que es 0-100,
  no un monto) en el tipo, los ~22 productos y los 2 componentes que lo leen
  (`ProductCard.tsx`, `ProductModal.tsx`). Se quitó el campo `image` (singular),
  redundante con `images[0]` (matemáticamente idéntico, dado cómo `makeProduct()`
  construye ambos desde el mismo `imageIndex`) — se actualizaron los 5 sitios que lo
  leían para usar `images[0]`.

**Sin tocar (documentado, no urgente):** `FavoritesProvider` sigue en `ids: string[]`
(sin `addedAt`); `categoryLabel` sigue denormalizado en cada producto;
`CartProvider`/`FavoritesProvider`/`CompareProvider` siguen siendo casi el mismo código
tres veces. Ninguno tenía un bug real detrás, así que se dejaron fuera para no ampliar
el cambio más de la cuenta a un día del backend.

## Recomendación

- Antes de escribir el backend real, revisar esta nota junto con
  `2026-09-11-bugs-admin-loader-carrito.md` — ahí está la tabla completa de nombres,
  incluyendo los que quedaron pendientes a propósito.
- `role` e `id` siguen siendo 100% locales a este navegador (`localStorage`); en cuanto
  haya login real, el backend debe ser la fuente de verdad para ambos, no el cliente.
- Correr `npm run build` como parte de cualquier CI/paso de deploy — hoy nada lo hacía
  automáticamente y por eso el error de tipos pasó desapercibido.

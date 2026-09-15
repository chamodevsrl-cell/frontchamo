# Fix: build roto por narrowing de tipos en Categorías (cartas)

**Fecha:** 2026-09-15

## Qué encontré

`npm run build` y `npm run lint` fallaban en `components/admin/AdminCategoriesCards.tsx`
(la feature de "categorías en cartas" que se estaba construyendo en paralelo). El
`tsc` del build tiraba 7 errores, todos por la misma causa raíz.

## Causa

```ts
const isNew = draft.slug === null;
const slug = isNew
  ? uniqueCategorySlug(name, categories.map((item) => item.slug))
  : draft.slug;
```

`draft.slug` es `string | null` (`null` significa "categoría nueva"). TypeScript no
reduce el tipo de `draft.slug` a `string` en la rama `else` porque el chequeo de
null pasa por una variable intermedia (`isNew`) en vez de comparar `draft.slug`
directo — el control-flow narrowing de TS no sigue esa indirección. Por eso `slug`
seguía tipado `string | null` más abajo, rompiendo cada lugar donde se esperaba
`string` (el objeto de categoría, `createCategoryAction`, `updateCategoryAction`).

## Fix

```ts
const isNew = draft.slug === null;
const slug: string =
  draft.slug ??
  uniqueCategorySlug(name, categories.map((item) => item.slug));
```

Mismo comportamiento en tiempo de ejecución (si `draft.slug` es `null`, genera un
slug nuevo; si no, usa el existente) — `??` sí permite que TS reduzca el tipo
correctamente. `isNew` se dejó igual porque se sigue usando más abajo para elegir
entre `createCategoryAction` / `updateCategoryAction`.

## Verificado

`npm run build` + `npm run lint` + `npm test` (27/27) en verde. En vivo: `/admin/categorias`
sigue mostrando las 7 líneas en cartas con su conteo de productos.

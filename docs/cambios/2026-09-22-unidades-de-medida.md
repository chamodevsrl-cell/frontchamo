# Nueva sección "Unidades de medida" en el panel

- **Fecha:** 2026-09-22
- **Solicitud:** "en el panel pon una parte para agregar las unidades de
  medida para los productos".
- **Archivos:** `types/admin.ts`, `services/adminApi.ts`,
  `app/admin/actions.ts`, `components/admin/AdminShell.tsx`,
  `lib/admin-hero.ts`, `components/admin/AdminUnitsView.tsx` (nuevo),
  `app/admin/(panel)/productos/unidades/page.tsx` (nuevo),
  `app/admin/(panel)/productos/nuevo/page.tsx`,
  `app/admin/(panel)/productos/[id]/editar/page.tsx`,
  `components/admin/AdminNewProductForm.tsx`,
  `components/admin/AdminProductFormStepEspecs.tsx`, `API_CONTRACT.md`.
- **Commit:** (pendiente)

## Qué había antes

La Fase 4 del wizard de producto ("Presentaciones de venta") tenía 3
unidades sugeridas **hardcodeadas** en el propio componente
(`PACKAGING_PRESETS = ["Unidad", "Docena", "Caja"]`, en
`AdminProductFormStepEspecs.tsx`), más un campo de texto libre para escribir
una unidad nueva al momento — pero esa unidad nueva **no quedaba guardada
en ningún lado**: si dos productos distintos necesitaban "Rollo", había que
escribirlo a mano las dos veces, sin un catálogo reutilizable ni una
pantalla para administrarlo.

## Código nuevo (resumen)

- **`types/admin.ts`** — nuevo tipo `MeasurementUnit`
  (`{ id, name, isSystem, createdAt }`, mismo patrón que `PanelRole`) y
  `CreateMeasurementUnitInput`. `PackagingLine.unit` sigue siendo texto
  libre — este catálogo es solo la lista de sugerencias reutilizable.
- **`services/adminApi.ts`** — `unitsDb` sembrado con las 3 unidades base
  (`isSystem: true`, no se pueden borrar) + `getUnits()` / `createUnit()` /
  `deleteUnit()` (mismo patrón que `getRoles`/`createRole` y
  `deleteProduct`, con `// TODO Backend` y `AdminApiError`).
- **`app/admin/actions.ts`** — `createUnitAction` / `deleteUnitAction`
  (mismo patrón `{ ok, ... } | { ok: false, message }` que el resto).
- **`components/admin/AdminUnitsView.tsx`** (nuevo) — lista de tarjetas con
  las unidades existentes (las 3 base marcadas "BASE", sin botón de borrar)
  + un formulario "Nueva unidad" debajo. Mismo estilo que
  `AdminRolesView.tsx`.
- **Ruta nueva:** `/admin/productos/unidades`
  (`app/admin/(panel)/productos/unidades/page.tsx`, server component que
  llama `getUnits()`), agregada como tercer hijo de "Productos" en el
  sidebar (`AdminShell.tsx`) y con su propio título en `lib/admin-hero.ts`.
  Hereda el permiso `productos` (no hizo falta un permiso nuevo — el
  matching de rutas ya es por prefijo).
- **Wizard de producto** — `productos/nuevo/page.tsx` y
  `productos/[id]/editar/page.tsx` ahora también llaman `getUnits()` y
  pasan `units` a `AdminNewProductForm` → `AdminProductFormStepEspecs`. Los
  3 botones de preset fijos se reemplazaron por
  `units.map(...)` (ahora dinámico, incluye cualquier unidad que se haya
  agregado en `/admin/productos/unidades`); el campo de texto libre para
  crear una unidad "al toque" se mantuvo para no perder esa comodidad
  (aunque esa unidad puntual no queda guardada en el catálogo — solo en
  ese producto, salvo que además se agregue desde Unidades de medida).
- **`API_CONTRACT.md`** — nueva sección "Unidades de medida" con los 3
  endpoints (`GET/POST/DELETE /api/v1/units`) y la fila correspondiente en
  la tabla de rutas del panel.

Verificado en el navegador: `/admin/productos/unidades` muestra Unidad,
Docena y Caja marcadas "Base"; se agregó "Rollo" y quedó sin esa etiqueta
(con botón de borrar). En `/admin/productos/nuevo` → Fase 4, "Rollo" ya
aparece como botón de preset junto a los 3 de siempre; al hacer clic se
agrega como fila de presentación, igual que los presets fijos de antes.
`tsc --noEmit`, `eslint` y `npm test` (30/30) sin errores.

## Recomendación

- La unidad que se escribe en el campo de texto libre del wizard sigue sin
  guardarse en el catálogo — si el negocio usa seguido una unidad que no
  está en la lista, conviene ir primero a "Unidades de medida" y agregarla
  ahí, no solo escribirla en el producto.

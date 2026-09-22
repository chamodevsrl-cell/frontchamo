# Productos: Ver/Editar/Eliminar + oferta + presentaciones de venta

- **Fecha:** 2026-09-21
- **Solicitud:** El usuario mostró capturas de `/admin/productos` (sin acciones por
  fila) y pidió: poder ver, editar y eliminar cada producto; al crear/editar poder
  marcarlo "en oferta"; indicar si sale por docena/unidad/caja y su contenido; y
  poder crear una unidad de medida propia (no solo las 3 fijas).
- **Archivos:** `types/admin.ts`, `services/adminApi.ts`, `app/admin/actions.ts`,
  `components/admin/AdminNewProductForm.tsx` (ahora también edita, no solo crea),
  `components/admin/AdminProductsTable.tsx` (nuevo), `app/admin/(panel)/productos/page.tsx`,
  `app/admin/(panel)/productos/[id]/editar/page.tsx` (nuevo), `tests/smoke.test.ts`
- **Commit:** (pendiente)

## Qué había antes

`/admin/productos` era una tabla de solo lectura (SKU/Nombre/Marca/Precio/Stock/
Estado), sin ninguna acción por fila — no se podía ver el detalle, editar ni
eliminar un producto desde el panel. El wizard de alta (`AdminNewProductForm`)
solo servía para **crear**, no para editar. El contrato `Product` no tenía
concepto de "oferta" (aunque el catálogo de ejemplo de la tienda,
`data/products.ts`, sí lo tenía: `badge`, `oldPrice`, `discountPercent`) ni de
presentación de venta (`data/products.ts` sí tenía `packaging: {unidad, docena,
caja}`, fijo a esas 3 claves, sin poder agregar una unidad nueva).

## Código nuevo (resumen)

**`types/admin.ts`** — nuevo tipo `PackagingLine { unit: string; content: string }`
(texto libre en `unit`, así se puede "crear" una unidad nueva sin una pantalla de
gestión aparte) y en `Product`: `isOnOffer: boolean`, `oldPrice: number | null`,
`packaging: PackagingLine[]`. Nuevo `UpdateProductInput`.

**`services/adminApi.ts`** — `seedProducts()` ahora mapea `isOnOffer`/`oldPrice`/
`packaging` desde `data/products.ts` (que ya traía esos datos de ejemplo); nuevas
`getProduct(id)`, `updateProduct(id, input)` y `deleteProduct(id)` (mismo patrón
de `updateCategory`/`deleteUser`: valida SKU duplicado, 404 si no existe).

**`app/admin/actions.ts`** — `updateProductAction`, `deleteProductAction`.

**`AdminNewProductForm.tsx`** — ahora acepta `product?: Product` opcional: si
viene, precarga todos los campos y llama `updateProductAction` en vez de
`createProductAction` (botón "Guardar cambios" en vez de "Crear producto").
Fase 3 (Precios): checkbox **"En oferta"** + campo **"Precio anterior"** (solo
visible si está en oferta). Fase 4 (Especs): nueva sección **"Presentaciones de
venta"** — chips rápidos Unidad/Docena/Caja + campo de texto libre para crear
una unidad propia (Rollo, Par, Galón…), cada presentación con su "contenido"
editable y botón de quitar. La vista previa de la tienda (panel derecho) ahora
muestra el badge "Oferta" y el precio anterior tachado.

**`AdminProductsTable.tsx`** (nuevo, client component) — la tabla de
`/admin/productos` ahora tiene columna **Acciones**: Ver (modal de solo lectura
con imagen, precios, stock, presentaciones de venta y ficha técnica), Editar
(link a `/admin/productos/[id]/editar`) y Eliminar (modal de confirmación, mismo
patrón que borrar un usuario). La fila también muestra el badge "Oferta" y el
precio anterior tachado cuando aplica.

**`app/admin/(panel)/productos/[id]/editar/page.tsx`** (nuevo) — carga
`getProduct(id)` + `getCategories()` y renderiza `AdminNewProductForm` en modo
edición; `notFound()` si el id no existe.

## Recomendación

- El campo `unit` de `PackagingLine` es texto libre a propósito (igual que
  `brand`, que tampoco tiene una pantalla de gestión aparte) — así "crear una
  unidad de medida" no necesita una sección CRUD nueva; si más adelante se
  quiere estandarizar nombres (evitar "Caja" y "caja" como cosas distintas),
  se puede normalizar en el mock o agregar una lista sugerida más larga.
- `getProduct`/`updateProduct`/`deleteProduct` son mock (`productsDb` en
  memoria, se resetea al recargar el server de Next). Al conectar el backend
  real, reemplazar por `fetch('/api/v1/products/:id')` (ver `API_CONTRACT.md`,
  que hay que actualizar con estos 3 endpoints nuevos — no estaban documentados).
- El modal "Ver" es de solo lectura; no reemplaza la ficha pública del
  catálogo (que sigue viviendo en `data/products.ts`, sin conexión al mock del
  panel — limitación ya conocida, ver `SUGERENCIAS.md`).

# Alta de producto: wizard de 4 fases + subir imágenes desde archivos/galería

**Fecha:** 2026-09-15

## Pedido

El cliente mandó una captura de "Nuevo producto" del panel que le hizo su compañero
para la otra tienda de la empresa (rosversac.com): formulario dividido en fases
(Datos/Detalle/Precios/Especs) con vista previa en vivo a la derecha y subida de
imagen real (no una URL pegada a mano). Pidió llevar eso a nuestro panel, poder subir
imagen desde archivos o galería, dejarlo bien ordenado, y **no tocar nada de Usuarios
ni Roles** (sección recién construida).

## Antes

`/admin/productos/nuevo` (`AdminNewProductForm.tsx`) era un solo formulario largo con
un campo de texto para pegar URLs de imágenes separadas por coma — no había forma de
subir un archivo real, ni vista previa, ni ficha técnica (specs) en el alta.

## Después

- **`types/admin.ts`:** nuevo `ProductSpec` (`{ label, value }`) y campo
  `specs: ProductSpec[]` en `Product` (y por lo tanto en `CreateProductInput`).
- **`services/adminApi.ts`:** `seedProducts()` ahora mapea `specs: item.specs` desde
  `featuredProducts` (ya traían ficha técnica de ejemplo) — sin esto los 23 SKUs
  semilla hubieran quedado con `specs` vacío.
- **`AdminNewProductForm.tsx`** reescrito como **wizard de 4 fases**, todo en estado de
  React (nada se guarda hasta terminar la fase 4):
  1. **Datos** — nombre, SKU, marca, categoría, descripción corta.
  2. **Detalle** — descripción completa + **subida de imágenes real**: dropzone con
     drag & drop y `<input type="file" accept="image/*" multiple>` (en el celular abre
     galería/cámara del equipo). Cada archivo se lee con `FileReader.readAsDataURL()`
     y queda como `data:` URL en el array `images` — no hay bucket real (tipo R2)
     todavía, así que el mock guarda la imagen como base64 en memoria. Miniaturas con
     botón de quitar y flechas para reordenar (la primera es la "Principal").
  3. **Precios** — precio, stock, stock mínimo, estado, destacado.
  4. **Especs** — filas dinámicas atributo/valor para la ficha técnica.
- **Vista previa en vivo** a la derecha (como la referencia): imagen principal, marca,
  nombre, SKU, precio (o "Consultar" si está vacío) y badge "Destacado" — se actualiza
  con cada campo, en cualquier fase.
- Al terminar la fase 4, "Crear producto" llama a `createProductAction()` (sin cambios
  en la Server Action ni en `createProduct()` del mock — solo se le suma `specs` al
  payload).

**No se tocó** `AdminUsersTable.tsx`, `AdminRolesView.tsx` ni sus páginas/acciones —
esos ya estaban en producción y no formaban parte de este pedido.

## Verificado

`npm run build` + `npm run lint` + `npm test` en verde (se corrigieron 2 errores de
tipos preexistentes en `tests/smoke.test.ts` que rompían el build, de un cambio
paralelo de otra sesión: `permissions` sin tipar como `AdminPermission[]` y un
`createProduct()` de prueba sin el nuevo campo `specs`). En vivo: las 4 fases con
datos reales, **una imagen real soltada por drag & drop** (se ve la miniatura +
preview), precio/stock/destacado, una fila de ficha técnica, y el producto
(`QA-TEST-0001`) apareciendo correctamente en `/admin/productos` con su precio, stock
y badge Destacado.

## Pendiente

- Las imágenes quedan como `data:` URL en memoria del proceso — pesadas y se pierden
  al reiniciar el server de dev, igual que el resto de `productsDb`. Cuando haya
  backend real, reemplazar por subida a un bucket (R2/S3) y guardar solo la URL.
- No hay subcategoría seleccionable en el wizard (el mock no modela subcategorías
  reales todavía — se mantiene el mismo `${categoryId}-general` autogenerado de antes).

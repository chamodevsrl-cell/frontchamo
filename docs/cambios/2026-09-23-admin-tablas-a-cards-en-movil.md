# Panel: tablas de Pedidos y Productos pasan a cards en móvil

- **Fecha:** 2026-09-23
- **Solicitud:** En el celular las tablas del panel (Pedidos, Productos) se
  veían apretadas y cortadas a la derecha. En responsive, usar cards en vez
  de tablas para que encajen bien.
- **Archivos:** `components/admin/AdminOrdersTable.tsx`,
  `components/admin/AdminProductsTable.tsx`.
- **Commit:** (ver historial de Git)

## Qué había antes

Las dos tablas iban dentro de un `overflow-x-auto`: en un teléfono (~375 px)
las columnas se partían en muchas líneas (p. ej. `CI-2026-00041` en tres
renglones) y las columnas de la derecha (Pago/envío, Estado, Acciones)
quedaban fuera de pantalla.

## Código nuevo (resumen)

Mismo patrón en ambos componentes:

- **`< lg` (móvil y tablet):** grilla de cards
  (`grid gap-3 sm:grid-cols-2 lg:hidden`), cada una con borde izquierdo
  `brand-primary`.
  - **Pedido:** número + cantidad de líneas, total grande a la derecha,
    cliente y teléfono, pago · envío y abajo el selector de **Estado** a
    todo el ancho (mismo `changeStatus()`).
  - **Producto:** miniatura, marca + SKU, nombre, badges
    Destacado/Oferta, precio (y precio anterior), stock (en rojo si está
    bajo) + estado, y tres botones con texto: **Ver**, **Editar**,
    **Eliminar** (mismos modales).
- **`lg` en adelante:** la tabla de siempre (`hidden … lg:block`).

Verificado en el navegador a 375 px: sin scroll horizontal
(`scrollWidth === 375`), 4 cards de pedidos y 22 de productos. A 1280 px se
ve la tabla y las cards quedan ocultas. `tsc --noEmit` y `eslint` sin
errores.

# Ficha: presentación Unidad / Docena / Caja + textos más legibles

- **Fecha:** 2026-10-26
- **Solicitud:** Quitar “Precio mayorista” y elegir Unidad / Docena / Caja para que cambie el precio; agrandar las notas “Mayorista c/u” y el texto de la presentación.
- **Archivos:** `components/ProductDetail.tsx`, `data/products.ts`
- **Commit:** (local)

## Qué había antes

El precio grande era siempre el de lista. Debajo había una línea de mayorista. Las notas de empaque y mayorista iban en 11px grises, difíciles de leer.

## Código nuevo

Selector **Unidad / Docena / Caja**: unidad usa `price`; docena/caja usan `wholesalePrice × packQuantity` (unidades leídas de `packaging`). Al cotizar se suma `qty × unidades del pack`. Las notas van en `text-sm` / `sm:text-base` con más contraste.

## Recomendación

El carrito sigue guardando unidades sueltas. Cuando el backend tenga presentaciones reales, alinear `PACK_OPTIONS` con `getUnits()`.

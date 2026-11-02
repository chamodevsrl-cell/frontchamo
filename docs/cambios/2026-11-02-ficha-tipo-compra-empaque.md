# Ficha: card de tipo de compra y empaque

- **Fecha:** 2026-11-02
- **Solicitud:** Que el bloque de precio/presentación se vea como el mock (radio por empaque, ahorro, equivalencia por unidad).
- **Archivos:** `components/ProductDetail.tsx`, `data/products.ts`
- **Commit:** (local)

## Qué había antes

Precio grande a la izquierda y chips Unidad/Docena/Caja a la derecha.

## Código nuevo

Card con precio de la presentación elegida, retail tachado, “contiene N unidades”, subtotal y radios (Unidad / Docena / Caja) con disp. y % de ahorro. **Agregar a cotización** y WhatsApp van debajo de la galería. El carrito sigue sumando unidades sueltas (`qty × pack`).

## Recomendación

Cuando el backend tenga stock por presentación, dejar de derivar `disp.` con `floor(stock / unidades)`.

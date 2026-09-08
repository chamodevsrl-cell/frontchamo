# Modal de producto: ficha técnica + relacionados por categoría

- **Fecha:** 2026-09-08
- **Solicitud:** Que los productos de la misma categoría salgan abajo como relacionados; que el modal siga el diseño de la ficha (sobre todo especificaciones técnicas).
- **Archivos:** `components/ProductModal.tsx`, `components/FeaturedOffers.tsx`, `data/products.ts`
- **Commit:** `9b0794c`

## Qué había antes

El modal mostraba descripción, lista de características, bloque de empaque y CTAs en dos columnas, **sin** tabla de ficha técnica ni sección de relacionados.

## Código / datos nuevos

```ts
// data/products.ts
category: "herramientas" | "ferreteria" | "electricos" | "seguridad" | ...
specs: { label: string; value: string }[]
getRelatedProducts(product, limit)
```

```tsx
// ProductModal — debajo de la ficha comercial
<section>Especificaciones técnicas — tabla filas alternadas</section>
<section>Productos relacionados de la misma categoría — grid clicable</section>
```

Al hacer clic en un relacionado, `onSelectProduct` actualiza el producto del modal.

## Recomendación

- Completar más productos por categoría (p. ej. Seguridad solo tiene 1 → no muestra relacionados).
- Sustituir imágenes Unsplash por fotos reales del catálogo.
- Unificar WhatsApp en `WhatsAppFloat` / `Footer` con el mismo `51959723602` del modal.

# Ficha de producto a pantalla completa (sin modal)

- **Fecha:** 2026-10-26
- **Solicitud:** Quitar el modal al abrir un producto y usar una interfaz más grande que aproveche todo el espacio, con el diseño de ficha tipo catálogo.
- **Archivos:** `app/producto/[id]/page.tsx`, `components/ProductDetail.tsx`, `components/ProductCard.tsx`, `components/ProductCatalog.tsx`, `components/FeaturedOffers.tsx`, `components/OffersBanner.tsx`, `components/ProductModal.tsx` (eliminado), `data/products.ts`, `app/carrito/page.tsx`, `app/comparar/page.tsx`
- **Commit:** (pendiente)

## Qué había antes

Al hacer clic en una tarjeta se abría `ProductModal` (diálogo overlay, `max-w-5xl`). El detalle no tenía ruta propia.

## Código anterior

```tsx
<ProductCard
  product={product}
  onOpen={() => setSelected(product)}
  onAddToCart={() => addItem(product.id, 1)}
/>
{selected ? (
  <ProductModal
    product={selected}
    onClose={() => setSelected(null)}
    onSelectProduct={(product) => setSelected(product)}
  />
) : null}
```

## Código nuevo

```tsx
<ProductCard
  product={product}
  onAddToCart={() => addItem(product.id, 1)}
/>
// Clic → /producto/[id] (ProductDetail a pantalla completa)
```

## Recomendación

- Vigilar móvil: galería + CTAs deben quedar por encima del pliegue razonable.
- Cuando exista backend, `app/producto/[id]` debe pasar a `GET /api/v1/catalog/:id` + related.

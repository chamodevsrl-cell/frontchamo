# Productos destacados en una sola fila

- **Fecha:** 2026-09-09
- **Solicitud:** En productos destacados, que esté solo en una fila, como las categorías.
- **Archivos:** `components/FeaturedOffers.tsx`, `components/ProductCard.tsx`
- **Commit:** (se registra al subir)

## Qué había antes

En PC la sección pasaba a **grilla** (`lg:grid-cols-2` / `xl:grid-cols-4`). En móvil ya era carrusel, pero sin las flechas circulares de categorías.

## Código anterior

```tsx
<ul className="flex ... lg:grid lg:grid-cols-2 ... xl:grid-cols-4">
```

## Código nuevo

Misma fila en todos los anchos: `flex` + `overflow-x-auto` + `snap-x`, tarjetas del mismo ancho que categorías, flechas circulares ← → en la cabecera.

## Recomendación

- Si el home suma más de 8 destacados, el carrusel sigue igual; no volver a una grilla en desktop.

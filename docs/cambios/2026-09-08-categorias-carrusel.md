# Categorías en carrusel (como productos destacados)

- **Fecha:** 2026-09-08
- **Solicitud:** Que las categorías sean tipo carrusel, igual que los productos destacados.
- **Archivos:** `components/CategoriesGrid.tsx`
- **Commit:** `064bec8`

## Qué había antes

Grilla fija (`grid-cols-1 / 2 / 3 / 4`) que mostraba todas las tarjetas apiladas o en filas; en móvil se veían una bajo otra.

## Código anterior

```tsx
<ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
  {mainCategories.map(...)}
</ul>
```

## Código nuevo

```tsx
<div className="-mx-4 sm:-mx-6 lg:mx-0">
  <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:gap-4 sm:px-6 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-4">
    <li className="w-[min(78vw,18rem)] shrink-0 snap-start sm:w-[min(48vw,20rem)] lg:w-auto lg:shrink">
      <CategoryCard ... />
    </li>
  </ul>
</div>
```

Mismo patrón que `FeaturedOffers`: scroll horizontal + snap en móvil/tablet; grilla en `lg`/`xl`.

## Recomendación

- Si se quiere carrusel también en desktop (porque hay 7 categorías), quitar el `lg:grid` y dejar siempre `overflow-x-auto`.
- Opcional: flechas prev/next en desktop para descubrir que hay más cards.

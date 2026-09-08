# Carrusel de categorías en PC con flechas

- **Fecha:** 2026-09-08
- **Solicitud:** En PC que también sea carrusel movible con flechas (estilo mockup: botones circulares arriba a la derecha).
- **Archivos:** `components/CategoriesGrid.tsx`
- **Commit:** `ed61915`

## Qué había antes

En `lg+` el listado pasaba a **grilla** (`lg:grid` / `xl:grid-cols-4`), así que en desktop no había carrusel ni flechas.

## Código anterior

```tsx
<ul className="flex snap-x ... lg:grid lg:grid-cols-2 ... xl:grid-cols-4">
  <li className="... lg:w-auto lg:shrink">...</li>
</ul>
```

## Código nuevo

```tsx
// Flechas circulares (arriba derecha)
<button aria-label="Categorías anteriores" className="h-10 w-10 rounded-full border ... bg-white shadow-..." />
<button aria-label="Categorías siguientes" className="h-10 w-10 rounded-full border ... bg-white shadow-..." />

// Siempre carrusel
<ul ref={scrollerRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto ... scrollbar-none">
  <li className="... lg:w-[17.5rem] xl:w-[18.75rem] shrink-0 snap-start">...</li>
</ul>
```

`scrollBy` mueve ~1 tarjeta; `canPrev` / `canNext` deshabilitan las flechas en los extremos.

## Recomendación

- Mantener acentos en **brand-primary** (el mockup usa rojo; la marca Chamo es azul).
- Si más adelante hay muchas categorías, valorar autoplay opcional o indicadores (dots).

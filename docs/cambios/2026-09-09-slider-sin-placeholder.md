# Quitar placeholder del slider y fade-in en bloques

- **Fecha:** 2026-09-09
- **Solicitud:** Al recargar, el hero mostraba un bloque azul de ejemplo (“Imagen del anuncio”). Dejar solo los banners reales y aplicar fade-in al scroll en los elementos.
- **Archivos:** `components/HeroSlider.tsx`, `data/media.ts`, `components/PageBanner.tsx`, `components/Reveal.tsx`, `components/ProductCatalog.tsx`, `components/FeaturedOffers.tsx`, `components/CategoriesGrid.tsx`, `app/page.tsx`
- **Commit:** `0fa344a` — fix: show real hero banners on reload and fade-in blocks

## Qué había antes

El slider ocultaba las fotos (`opacity-0`) hasta que JS marcaba `loaded`. Mientras tanto pintaba un recuadro azul de ejemplo con “Imagen del anuncio” y `bg-brand-primary`. En cada recarga se veía ese bloque en vez de `baner-1.png` … `baner-3.png`.

## Código anterior

```tsx
const showImage = loaded[slide.id] && !failed[slide.id];
<section className="... bg-brand-primary">
  <img className={showImage ? "opacity-100" : "opacity-0"} />
  {!showImage && (
    <div className="... aspect-[21/9]">
      <p>Imagen del anuncio</p>
      <p>Coloca {slide.src} en public/images/slider/</p>
    </div>
  )}
</section>
```

## Código nuevo

- Solo las tres imágenes reales (`next/image`, sin placeholder ni overlay de texto).
- Fade-in al entrar en viewport (`Reveal`) en slider, banners de página, categorías, productos y el resto de bloques.

## Recomendación

- No volver a poner un estado “cargando” opaco en azul: si falta un PNG, se verá el ícono roto del browser, no un recuadro de ejemplo.

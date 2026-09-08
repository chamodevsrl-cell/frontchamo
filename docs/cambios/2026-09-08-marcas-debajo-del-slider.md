# Marcas distribuidoras debajo del slider

- **Fecha:** 2026-09-08
- **Solicitud:** Que las marcas auspiciadoras / distribuidoras vayan debajo del slider.
- **Archivos:** `app/page.tsx`
- **Commit:** `5696f3c`

## Qué había antes

En el home, el carrusel de marcas (`BrandsCarousel`) estaba **al final de la página**, después del `main` (categorías y ofertas). El orden era:

1. Navbar  
2. HeroSlider  
3. TrustInfoBar  
4. Categorías + Ofertas (`main`)  
5. BrandsCarousel  

## Código anterior

```tsx
export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb]">
      <Navbar />
      <HeroSlider />
      <TrustInfoBar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-14 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <CategoriesGrid />
        <FeaturedOffers />
      </main>
      <BrandsCarousel />
    </div>
  );
}
```

## Código nuevo

```tsx
export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb]">
      <Navbar />
      <HeroSlider />
      <BrandsCarousel />
      <TrustInfoBar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-14 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <CategoriesGrid />
        <FeaturedOffers />
      </main>
    </div>
  );
}
```

**Orden actual:** Navbar → Slider → Marcas → Beneficios (`TrustInfoBar`) → Categorías → Ofertas.

## Recomendación

- En móvil, si el bloque de marcas se siente muy alto justo bajo el banner, se puede reducir padding o el tamaño de logos en `components/BrandsCarousel.tsx` sin mover de nuevo la sección.
- Conviene tener los logos reales en `public/images/marcas/` (hoy varios pueden faltar y mostrar fallback).
- Si más adelante se quiere “marcas solo en home”, mantener este orden solo en `app/page.tsx` y no acoplarlo al layout global.

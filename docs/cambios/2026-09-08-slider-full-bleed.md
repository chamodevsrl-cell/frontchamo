# Slider de banners a todo el ancho (full-bleed)

- **Fecha:** 2026-09-08
- **Solicitud:** Que el slider ocupe todo hasta chocar con los lados de la pantalla.
- **Archivos:** `components/HeroSlider.tsx`
- **Commit:** `4ef8ee3`

## Qué había antes

El contenedor interno tenía `max-w-[1600px] mx-auto`, así que en monitores anchos el banner no llegaba a los bordes.

## Código anterior

```tsx
<div className="relative mx-auto aspect-[21/9] min-h-[220px] w-full max-w-[1600px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[420px]">
```

## Código nuevo

```tsx
<div className="relative aspect-[21/9] min-h-[220px] w-full sm:min-h-[280px] md:min-h-[340px] lg:min-h-[420px]">
```

*(Nota: el `aspect` / `min-h` se reemplazó después en el cambio de “banner completo sin recorte”.)*

## Recomendación

- Mantener el slider **fuera** de wrappers con `px-*` / `max-w-*` (como ya está en `app/page.tsx`, fuera del `main`).
- El resto de secciones pueden seguir con `max-w-[1600px]` para legibilidad de contenido.

# Banner del slider completo (sin recorte) en responsive

- **Fecha:** 2026-09-08
- **Solicitud:** Que al hacerse responsivo el banner se vea completo y no recortado.
- **Archivos:** `components/HeroSlider.tsx`
- **Commit:** `f7c3772`

## Qué había antes

El contenedor usaba `aspect-[21/9]` + alturas mínimas y las imágenes `object-cover`. Eso **rellena el cuadro recortando** lados o partes de la imagen (texto/logo del banner podían cortarse en móvil).

## Código anterior (idea clave)

```tsx
<div className="relative aspect-[21/9] min-h-[220px] w-full ...">
  <img className="h-full w-full object-cover ..." />
</div>
```

## Código nuevo (idea clave)

```tsx
<div className="relative w-full">
  {/* slide activo en flujo normal; inactivos absolutos */}
  <img className="block h-auto w-full object-contain ..." />
</div>
```

La altura del slider sigue la proporción real de la imagen (`h-auto` + `w-full`), sin forzar un recuadro que recorte.

## Recomendación

- Diseñar banners con la misma proporción entre sí para que el salto de altura al cambiar de slide sea suave.
- Evitar textos críticos demasiado cerca de los bordes si en el futuro se vuelve a `object-cover` por decisión de diseño.
- En pantallas muy angostas el banner se verá más bajo (es el trade-off de mostrar la imagen completa).

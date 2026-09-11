# Banner de categoría (título centrado sobre imagen)

- **Fecha:** 2026-09-09
- **Solicitud:** Al entrar a una categoría (p. ej. Eléctricos), mostrar un banner ancho tipo catálogo, con imagen de fondo para marcas/productos y el nombre centrado (ELÉCTRICOS) en todas las líneas
- **Archivos:** `components/CategoryBanner.tsx`, `app/categorias/[slug]/page.tsx`, `data/home.ts`
- **Commit:** (se registra al subir)

## Qué había antes

El detalle `/categorias/[slug]` usaba una **tarjeta vertical a la izquierda** (foto + título + bullets) y la grilla de productos a la derecha.

## Código anterior

```tsx
<div className="mt-4 grid gap-6 lg:grid-cols-[18rem_1fr]">
  <div className="overflow-hidden rounded-2xl ...">
    <Image src={category.image} ... />
    <h1>{category.label}</h1>
  </div>
  <ProductCatalog products={products} />
</div>
```

## Código nuevo

Banner a todo el ancho (`CategoryBanner`): foto de la categoría de fondo, franjas `brand-primary` / `brand-gold`, placa blanca con sombra y `bannerTitle` en mayúsculas (ELÉCTRICOS, FERRETERÍA, …). Debajo, productos a ancho completo. La foto se puede sustituir por un collage de marcas en `public/images/categorias/`.

## Recomendación

- Subir collages horizontales por línea cuando el cliente los tenga (`bannerImage` en `data/home.ts`).
- Vigilar contraste del título sobre fotos muy claras (hoy hay velo `brand-dark`).

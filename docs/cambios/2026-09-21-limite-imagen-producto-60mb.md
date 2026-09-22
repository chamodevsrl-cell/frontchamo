# Límite de imagen de producto: 60 MB

- **Fecha:** 2026-09-21
- **Solicitud:** El usuario pidió que, al subir una imagen para productos, el
  límite sea de 60 MB (confirmado por opción múltiple: 60 KB / 600 KB / 60 MB).
- **Archivos:** `lib/cms-image.ts`, `components/admin/AdminNewProductForm.tsx`
- **Commit:** (pendiente)

## Qué había antes

`readCmsImageFile()` (usada por el wizard de alta de producto, fase "Detalle e
imágenes") no recibía un `maxBytes` propio, así que caía al default
`MAX_CMS_IMAGE_BYTES` (1.5 MB) — pensado para imágenes de CMS livianas
(banners, categorías), no para fotos de producto en alta resolución. No había
texto de ayuda indicando el límite en esa pantalla.

## Código anterior

```ts
// lib/cms-image.ts
export const MAX_CMS_IMAGE_BYTES = 1.5 * 1024 * 1024;
export const MAX_PROFILE_IMAGE_BYTES = 2.5 * 1024 * 1024;
export const MAX_BANNER_IMAGE_BYTES = 3.5 * 1024 * 1024;
```

```tsx
// components/admin/AdminNewProductForm.tsx
const dataUrls = await Promise.all(files.map(readCmsImageFile));
…
<p className="text-xs text-brand-dark/40">
  En móvil abre la galería/cámara del equipo. También puedes pegar una
  URL. La primera imagen es la principal.
</p>
```

## Código nuevo

```ts
// lib/cms-image.ts
export const MAX_PRODUCT_IMAGE_BYTES = 60 * 1024 * 1024;
```

```tsx
// components/admin/AdminNewProductForm.tsx
const dataUrls = await Promise.all(
  files.map((file) => readCmsImageFile(file, MAX_PRODUCT_IMAGE_BYTES)),
);
…
<p className="text-xs text-brand-dark/40">
  En móvil abre la galería/cámara del equipo. También puedes pegar una
  URL. La primera imagen es la principal. JPG/PNG/WebP · máx 60 MB
  por imagen.
</p>
```

`readCmsImageFile()` ya rechazaba archivos que superan `maxBytes` con un
mensaje (`La imagen supera X MB. Usa una más liviana.`) — solo hacía falta
pasarle el límite correcto para el wizard de productos.

## Recomendación

- 60 MB por imagen es holgado para fotos de cámara/celular sin comprimir. Cada
  imagen se guarda hoy como `data:` URL en el mock (sin backend real, ver
  `SUGERENCIAS.md`), así que varias fotos de 60 MB pueden hacer pesado el
  `localStorage`/la respuesta del mock en el navegador — vigilar si se nota
  lentitud al guardar productos con fotos grandes.
- Cuando haya backend real con subida a bucket (S3/R2, ya anotado como
  pendiente), este límite debería aplicarse también del lado servidor, no
  solo en el input del navegador.

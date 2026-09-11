# Sugerencias.md: bloque de implementación en orden

- **Fecha:** 2026-09-09
- **Solicitud:** Generar cambios en base a `docs/SUGERENCIAS.md` y ejecutarlos en el orden del archivo
- **Archivos:** `data/*`, `app/categorias/`, `app/carrito/`, `app/catalogo/`, `app/cotizar/`, `app/api/productos/`, `components/*`, `public/images/*`, `next.config.ts`, `tests/smoke.test.ts`
- **Commit:** (se registra al subir)

## Qué había antes

El backlog de `SUGERENCIAS.md` estaba sin ejecutar: categorías con Unsplash, logos de marcas en 404, banners con espacios en el nombre, rutas `/categorias` y `/carrito` sin página, Navbar con otra lista de categorías, búsqueda inerte, teléfono placeholder y sin políticas.

## Código anterior

```ts
const categories = [
  { href: "/categorias/herramientas", label: "Herramientas" },
  { href: "/categorias/electricos", label: "Eléctricos" },
  { href: "/categorias/seguridad", label: "Seguridad industrial" },
  { href: "/categorias/ferreteria", label: "Ferretería general" },
  { href: "/categorias/abrasivos", label: "Abrasivos" },
];
// slides: "/images/slider/baner 1.png"
// WhatsApp / tel: +51 999 999 999
```

## Código nuevo

- Categorías e imágenes locales en `public/images/categorias/` + `mainCategories` como fuente única del Navbar.
- Logos SVG en `public/images/marcas/` y banners `baner-1.png` … `baner-3.png`.
- Páginas `/categorias`, `/categorias/[slug]`, `/carrito`, `/catalogo`, `/terminos`, `/privacidad`.
- API `GET /api/productos` + formulario de cotización con WhatsApp prellenado.
- Teléfono oficial `+51 959 723 602` en los 4 archivos pendientes.
- Smoke tests (`npm test`) del slider y del catálogo.

## Recomendación

- Sustituir los JPEG de categoría y los wordmarks SVG por fotos/logos oficiales del cliente cuando lleguen.
- El correo `ventas@chamoimport.com` sigue provisional.
- Las specs técnicas siguen siendo de ejemplo hasta fichas de SKU reales.
- CMS/admin y un backend de inventario real quedan fuera de este bloque.

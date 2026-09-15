# Categorías en cartas + imágenes por URL o galería

- **Fecha:** 2026-09-15
- **Solicitud:** Poder subir imágenes por URL o desde galería/carpetas en todo el panel; categorías en tarjetas con nombre, descripción y cantidad de productos; botón Editar que abre un modal; opción de agregar categoría.
- **Archivos:** `components/admin/AdminCategoriesCards.tsx`, `components/admin/CmsImageField.tsx`, `components/admin/AdminNewProductForm.tsx`, `lib/cms.ts`, `services/adminApi.ts`, `types/admin.ts`, `app/admin/(panel)/categorias/page.tsx`, `app/admin/actions.ts`, `components/CatalogFilters.tsx`, `components/CategoryCollage.tsx`, `components/CategoryDetailLive.tsx`
- **Commit:** (pendiente)

## Qué había antes

`/admin/categorias` era el editor de textos (`SiteContentEditor`) de las 7 líneas fijas. No se podían agregar categorías. Las imágenes del alta de producto solo salían de archivos (`data:`), no de una URL pegada.

## Código anterior

```tsx
export default function AdminCategoriasPage() {
  return <SiteContentEditor section="categories" />;
}
```

## Código nuevo

```tsx
export default async function AdminCategoriasPage() {
  const products = await getProducts();
  return <AdminCategoriesCards products={products} />;
}
```

Cartas con nombre, descripción (eyebrow) y recuento de SKUs. **Editar** / **Agregar categoría** (CTA del banner `#nueva-categoria`) abren un modal: nombre, descripción e imagen (`CmsImageField`: galería/carpetas o URL). Las líneas nuevas van a `cms.customCategories` y al mock `POST /api/v1/categories`. El wizard de producto también acepta URL.

## Recomendación

- Las líneas nuevas se ven en home, menú y `/categorias`. El detalle `/categorias/[slug]` de un slug que no está en `data/home.ts` se resuelve en el cliente (`CategoryDetailLive`); sin SKUs asignados el listado queda vacío.
- Las fotos en `data:` viven en `localStorage` (`chamo-cms-v1`); conviene un bucket cuando haya backend.
- El recuento de productos sale del mock `getProducts()` (se reinicia con el proceso de Next).

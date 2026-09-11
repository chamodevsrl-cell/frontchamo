# Panel de administración: layout y dashboard base

- **Fecha:** 2026-09-11
- **Solicitud:** diseño base del Panel de Administración (sidebar `#0B3554`, menú Lucide, header blanco, dashboard con 4 KPI, gráfica 7 días y productos más vendidos)
- **Archivos:** `app/admin/layout.tsx`, `app/admin/page.tsx`, `components/admin/AdminShell.tsx`, `data/admin.ts`, `app/admin/*`
- **Commit:** (se registra al subir)

## Qué había antes

`/admin` era una página con el Navbar de la tienda y el editor CMS de banners + categorías. No había sidebar ni dashboard.

## Código anterior

```tsx
export default function AdminLayout({ children }) {
  return children;
}
// page.tsx: Navbar + editor CMS
```

## Código nuevo

```tsx
export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
// /admin → dashboard KPI + gráfica + más vendidos (cifras de ejemplo)
// CMS → /admin/banners y /admin/categorias
```

El menú cubre Dashboard, Productos (Ver / Crear), Categorías, Marcas, Pedidos, Clientes, Inventario, Ofertas, Banners, Reportes y Configuración. Las rutas sin backend son placeholders. Dentro de `/admin` no corre el BrandLoader de la tienda.

## Recomendación

- Las cifras del dashboard son de **diseño**, no ventas reales.
- Siguiente paso: listado real de productos en `/admin/productos` contra `/api/productos`.

# Banner azul y oro en cada pestaña del panel

- **Fecha:** 2026-09-15
- **Solicitud:** En cada pestaña del dashboard, un encabezado tipo “Roles y permisos” (barra oscura + botón), pero en azul y amarillo de marca.
- **Archivos:** `components/admin/AdminPageHero.tsx`, `lib/admin-hero.ts`, `components/admin/AdminShell.tsx`, `app/globals.css`
- **Commit:** (pendiente)

## Qué había antes

Cada sección del panel arrancaba con un `h1` negro sobre fondo gris. No había una franja de título compartida.

## Código anterior

```tsx
<h1 className="font-display text-2xl font-bold text-brand-dark">Roles</h1>
```

## Código nuevo

```tsx
<main>
  <AdminPageHero {...heroForAdminPath(pathname)} />
  {children}
</main>
```

Fondo `brand-dark`, rayas y glow `brand-primary` / `brand-gold`, etiqueta CHAMO y, donde aplica, botón oro (Nuevo rol, Crear producto, Nuevo usuario).

## Recomendación

- El botón oro de Roles/Usuarios hace scroll al formulario (`#nuevo-rol` / `#nuevo-usuario`).
- Si más adelante hay un modal de alta, el mismo CTA puede abrir el modal sin cambiar el hero.

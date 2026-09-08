# Navbar: barra dorada bajo el ítem seleccionado

- **Fecha:** 2026-09-08
- **Solicitud:** Que la línea del nav (barra amarilla) se mueva a donde esté seleccionado, como en el mockup.
- **Archivos:** `components/Navbar.tsx`
- **Commit:** (al push)

## Qué había antes

El enlace activo solo tenía fondo `bg-brand-dark/35`, sin subrayado dorado ni animación.

## Código nuevo (idea)

```tsx
// texto activo en brand-gold + indicador absoluto animado
<span
  className="absolute bottom-0 h-[3px] rounded-full bg-brand-gold transition-all duration-300"
  style={{ left: navIndicator.left, width: navIndicator.width }}
/>
```

La posición se calcula con `offsetLeft` / `offsetWidth` del link `data-nav-active="true"` al cambiar `pathname`.

## Recomendación

- Si se añaden más ítems al menú (p. ej. “Tienda Online”), incluirlos en `mainLinks` y el indicador los seguirá.
- En móvil se marca el activo con anillo dorado (no hay barra inferior en el drawer).

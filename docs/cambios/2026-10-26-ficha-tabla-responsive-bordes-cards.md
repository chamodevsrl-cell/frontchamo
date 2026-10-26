# Ficha: tabla de specs fluid y bordes de cards visibles

- **Fecha:** 2026-10-26
- **Solicitud:** Que la tabla de especificaciones encaje en cualquier ancho y que los bordes de las cards blancas se noten (azul o amarillo).
- **Archivos:** `components/ProductDetail.tsx`
- **Commit:** (pendiente)

## Qué había antes

La tabla tenía `min-w-[32rem]` y `overflow-x-auto`, así que en móvil hacía scroll horizontal. Las cards blancas usaban `border-brand-dark/8` o `/10` y casi no se veían.

## Código anterior

```tsx
<div className="overflow-x-auto">
  <table className="w-full min-w-[32rem] border-collapse ...">
```

```tsx
<div className="overflow-hidden rounded-2xl border border-brand-dark/10 bg-white">
```

## Código nuevo

```tsx
<table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
  {/* celdas con break-words y padding reducido en móvil */}
</table>
```

```tsx
<div className="rounded-2xl border-2 border-brand-primary/50 bg-white shadow-[0_0_0_1px_rgba(18,126,201,0.12),0_0_22px_rgba(18,126,201,0.28)]">
```

## Recomendación

- Probar 375px y 1280px: la tabla no debe generar scroll horizontal.

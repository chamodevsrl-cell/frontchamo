# Ficha: specs en tabla y descripción debajo

- **Fecha:** 2026-10-26
- **Solicitud:** Usar una tabla para las especificaciones técnicas y poner la descripción debajo (Tailwind).
- **Archivos:** `components/ProductDetail.tsx`
- **Commit:** (pendiente)

## Qué había antes

Specs y descripción iban en dos columnas (`lg:grid-cols-2`). La tabla no tenía cabecera.

## Código anterior

```tsx
<section className="grid gap-6 lg:grid-cols-2 lg:gap-8">
  {/* tabla specs */}
  {/* descripción al lado */}
</section>
```

## Código nuevo

```tsx
<section className="flex flex-col gap-6">
  <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
    <thead>
      <tr className="bg-brand-dark text-white">
        <th>Especificación</th>
        <th>Detalle</th>
      </tr>
    </thead>
    {/* filas */}
  </table>
  {/* descripción debajo */}
</section>
```

## Recomendación

- En móvil la tabla hace scroll horizontal (`overflow-x-auto` + `min-w-[32rem]`).

# Ficha técnica del modal según mockup (cabecera + filas)

- **Fecha:** 2026-09-08
- **Solicitud:** Usar el diseño de la imagen para la ficha técnica (cabecera Especificación/Detalle, filas alternadas).
- **Archivos:** `components/ProductModal.tsx`
- **Commit:** `9c20a70`

## Qué había antes

Tabla sin `<thead>`, con bordes internos y filas blanco / gris; sin columnas tituladas “Especificación” y “Detalle”.

## Código nuevo (idea)

```tsx
<div className="overflow-hidden rounded-2xl border border-brand-primary/25 shadow-[...]">
  <table>
    <thead>
      <tr className="bg-brand-dark text-white">
        <th>Especificación</th>
        <th>Detalle</th>
      </tr>
    </thead>
    <tbody>
      {/* filas: bg-white / bg-[#eef6fc], sin bordes de celda */}
    </tbody>
  </table>
</div>
```

## Recomendación

- Completar specs reales por SKU (material, voltaje, dimensiones, país de origen, etc.) en `data/products.ts` cuando el cliente envíe fichas oficiales.

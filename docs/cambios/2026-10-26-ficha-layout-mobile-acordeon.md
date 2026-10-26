# Ficha móvil: orden tipo referencia + acordeón

- **Fecha:** 2026-10-26
- **Solicitud:** En responsive la galería y el bloque comercial se desordenaban; alinear el layout a la referencia móvil (título/chips, luego foto, luego precio/CTAs; specs y descripción plegadas).
- **Archivos:** `components/ProductDetail.tsx`
- **Commit:** (pendiente)

## Qué había antes

En móvil el precio y los CTAs salían **arriba** de la foto (mismo bloque izquierdo que en desktop), y la tabla de specs quedaba siempre abierta.

## Código nuevo

Grid de 2 columnas solo desde `lg`: identidad → galería (`lg:row-span-2`) → precio/CTAs. En móvil specs/descripción son acordeones (`hidden` / `lg:block`).

## Recomendación

- Verificar 375px: foto debajo de los chips, precio debajo de la foto.
- En desktop (`lg`) specs y descripción siguen abiertas.

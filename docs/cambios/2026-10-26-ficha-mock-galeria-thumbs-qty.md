# Ficha: mock galería + cantidad + specs en 2 columnas

- **Fecha:** 2026-10-26
- **Solicitud:** Probar el diseño de ficha del mock (desktop y móvil). Si no convence, volver al anterior. No subir a la repo.
- **Archivos:** `components/ProductDetail.tsx`
- **Commit:** (local, sin push)

## Qué había antes

La ficha ya era pantalla completa, pero la galería iba con puntos overlay, no había selector de cantidad, las specs eran una tabla con cabecera oscura y en móvil los chips/descripción iban encima de la foto.

## Código nuevo

`ProductDetail.tsx`: orden móvil título → galería con miniaturas → precio/qty/CTAs; specs, descripción y relacionados en acordeón. En escritorio, dos columnas (ficha comercial + galería), specs en pares de 2 columnas, descripción + checklist, selector `- 1 +` y “desde N unidades” según `packaging.docena`.

## Recomendación

Revisar desktop y móvil juntos. Si el mock no encaja con fotos reales (Unsplash vs producto), volver al layout anterior de la misma fecha (`ficha-layout-mobile-acordeon`).

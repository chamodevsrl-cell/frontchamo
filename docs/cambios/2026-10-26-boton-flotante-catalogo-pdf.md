# Botón flotante de catálogo PDF

- **Fecha:** 2026-10-26
- **Solicitud:** Botón flotante extra, arriba de WhatsApp, para descargar el catálogo PDF. Por ahora vacío.
- **Archivos:** `components/CatalogPdfFloat.tsx`, `app/layout.tsx`, `components/WhatsAppFloat.tsx`, `data/media.ts`
- **Commit:** (local)

## Qué había antes

Solo el botón verde de WhatsApp, fijo abajo a la derecha.

## Código nuevo

Columna flotante: PDF (azul, `FileDown`) arriba, WhatsApp abajo. `CATALOG_PDF_SRC = ""` — el botón no descarga nada hasta pegar la ruta del PDF.

## Recomendación

Cuando exista el archivo, dejarlo en `public/catalogo/` y poner esa ruta en `CATALOG_PDF_SRC`.

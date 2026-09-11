# Encabezados tipo etiqueta (Catálogo, Nosotros, Ofertas, Contacto)

- **Fecha:** 2026-09-09
- **Solicitud:** En Catálogo un encabezado estilo sticker (“NUESTROS PRODUCTOS”: caja blanca, borde grueso, sombra dura). Igual en Nosotros, Ofertas y Contacto. En Ofertas, diseño de descuentos con azul de marca y borde amarillo.
- **Archivos:** `components/StampHeading.tsx`, `app/catalogo/page.tsx`, `app/nosotros/page.tsx`, `app/ofertas/page.tsx`, `app/contacto/page.tsx`, `components/PageBanner.tsx`, `app/globals.css`
- **Commit:** `3b79358` — feat: sticker headings on catalog, about, offers, and contact

## Qué había antes

Títulos simples (`h1` Catálogo / Ofertas / Contacto) y en Nosotros una placa blanca sin rotación ni dos tonos.

## Código nuevo

`StampHeading`: caja inclinada, borde grueso, sombra dura `8px`.

- Catálogo: **NUESTRO CATÁLOGO** (blanco, borde azul oscuro, acento `brand-primary`)
- Nosotros: **SOBRE NOSOTROS** (mismo estilo, sobre el banner de foto)
- Contacto: **NUESTRO CONTACTO**
- Ofertas: **OFERTAS DESCUENTOS** (fondo `brand-primary`, borde `brand-gold`, badge -%)

Fondo de puntos `.stamp-dots` detrás del encabezado en catálogo, ofertas y contacto.

## Recomendación

- En móvil el texto largo puede partir línea; vigilar que CATÁLOGO / DESCUENTOS no se recorten.
- Las categorías (`/categorias/[slug]`) siguen con el título de banner anterior (ELÉCTRICOS, etc.).

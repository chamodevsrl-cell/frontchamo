# Brillo en bordes de cards

- **Fecha:** 2026-10-26
- **Solicitud:** Poner brillo en los bordes de todas las cards.
- **Archivos:** `app/globals.css` (`.card-glow`), `components/ProductDetail.tsx`, `ProductCard.tsx`, `CategoriesGrid.tsx`, `CategoriesDirectory.tsx`, `Testimonials.tsx`, `ContactForm.tsx`, `SiteContactInfo.tsx`, `QuoteForm.tsx`, `BrandsCarousel.tsx`, `app/carrito/page.tsx`, `app/comparar/page.tsx`
- **Commit:** (local; no subir salvo que se pida)

## Qué había antes

Las cards de la ficha usaban borde gris `#d7e4ef` sin halo. Otras (productos, categorías) tenían sombras distintas.

## Código nuevo

Clase `.card-glow` (borde `brand-primary` + halo azul/dorado) aplicada a las cards de la tienda.

## Recomendación

Si el halo se ve demasiado en móvil, bajar el spread del `box-shadow` en un `@media (max-width: 640px)`.

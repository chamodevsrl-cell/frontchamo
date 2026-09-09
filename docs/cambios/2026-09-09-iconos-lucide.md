# Iconos Lucide en carrito, categorías y productos

- **Fecha:** 2026-09-09
- **Solicitud:** En logos/íconos de carrito, categorías y productos no usar emojis; usar una librería de iconos.
- **Archivos:** `components/CategoryIcon.tsx`, `components/Navbar.tsx`, `components/CategoriesGrid.tsx`, `app/categorias/page.tsx`, `app/carrito/page.tsx`, `components/ProductCard.tsx`, `components/ProductModal.tsx`, `components/FeaturedOffers.tsx`, `components/StampHeading.tsx`
- **Commit:** (se registra al subir)

## Qué había antes

El Navbar ya usaba Lucide en Cuenta/Favoritos/Carrito. Las categorías del menú eran solo texto; destacados llevaban un `#` y Ofertas un badge `- %` tipo emoji.

## Código nuevo

Iconos **lucide-react** (ya en el proyecto):

- Categorías: llave, rayo, escudo, casa, martillo, casco, cubeta (menú, home y `/categorias`)
- Carrito: `ShoppingCart` en el título y estado vacío
- Productos: `BadgePercent` / `Star` en badges; `Sparkles` en “Selección destacada”; `Percent` en el stamp de Ofertas

## Recomendación

- No volver a meter emoji Unicode en UI; si hace falta un símbolo, importar de `lucide-react`.

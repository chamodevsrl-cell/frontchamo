# Relacionados: carrusel siempre visible

- **Fecha:** 2026-11-02
- **Solicitud:** Productos relacionados no en acordeón móvil; que se vea como en desktop (carrusel).
- **Archivos:** `components/ProductDetail.tsx`
- **Commit:** (local)

## Qué había antes

En móvil “Productos relacionados” era un acordeón cerrado. El carrusel y las flechas solo se veían bien en escritorio.

## Código nuevo

Sección abierta: título + “Ver más productos” + carrusel con flechas en todos los anchos.

## Recomendación

Vigilar que las flechas no tapen la primera/última tarjeta (`px-10` en la lista).

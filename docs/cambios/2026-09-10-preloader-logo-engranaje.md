# Preloader con logo y engranaje oficiales

- **Fecha:** 2026-09-10
- **Solicitud:** actualizar `Preloader` para usar `/logo.png` y `/engranaje.png` de `public/`
- **Archivos:** `components/Preloader.tsx`, `public/logo.png`, `public/engranaje.png`
- **Commit:** (este bloque)

## Qué había antes

El preloader mostraba el texto “Chamo Import”, un `Cog` de Lucide y una barra de progreso.

## Código nuevo

- Fondo fijo `#0B3554` con `z-50`.
- Logo `/logo.png` entra de izquierda a derecha (`x: -100 → 0`, `opacity: 0 → 1`).
- Debajo, `/engranaje.png` a 60×60 px gira 360° en loop (como una llanta).
- Texto **CARGANDO...** en `#E4B714`.
- A los 2.5 s, fade-out y se desmonta.

`/logo.png` es el logo oficial. `/engranaje.png` replica el engranaje del mismo logo
(el original no estaba suelto en `public/`).

## Recomendación

- Si el cliente entrega un PNG de engranaje aparte, reemplazar `public/engranaje.png`.

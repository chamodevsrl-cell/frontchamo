# Transición de puertas al cambiar de página

- **Fecha:** 2026-09-10
- **Solicitud:** que la animación de puertas + engranaje también se vea al ir a otra página (p. ej. Categorías) y que sea responsiva
- **Archivos:** `components/IntroSplash.tsx`, `app/globals.css`
- **Commit:** (este bloque)

## Qué había antes

`IntroSplash` solo corría al cargar la pestaña (~2.7s). Al navegar con el App Router (Categorías, Catálogo, etc.) la página nueva aparecía de golpe. En móvil el engranaje era un tamaño fijo y las puertas usaban `100%` del contenedor.

## Código nuevo

- Primera carga: igual, puertas que cierran desde los lados + engranaje.
- Navegación interna (`usePathname`): cubre al instante (para no mostrar un flash de la página nueva) y se abre (~1.1–1.3s, más corto que la intro).
- Responsivo: `100dvh`, engranajes con `vmin`/`clamp`, franja dorada más fina en móvil, tiempos más cortos en pantallas chicas y landscape.
- `prefers-reduced-motion` sigue omitiendo todo.

## Recomendación

- La transición de navegación es más corta a propósito: repetir 2.7s en cada clic se siente lento.
- Si se quiere el “slam” completo también entre páginas, subir `--intro-nav-ms`.

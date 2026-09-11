# Intro de entrada: puertas azules y engranaje

- **Fecha:** 2026-09-09
- **Solicitud:** Al entrar a la web, que de los lados se cierre en azul, al medio una tuerca/engranaje que gire y luego se abra la ventana y muestre el sitio.
- **Archivos:** `components/IntroSplash.tsx`, `app/globals.css`, `app/layout.tsx`
- **Commit:** (se registra al subir)

## Qué había antes

La home aparecía de golpe (solo fade de secciones con `Reveal`). No había intro a pantalla completa.

## Código nuevo

`IntroSplash` (Lucide `Cog`): paneles `brand-primary`/`brand-dark` con canto `brand-gold` entran desde los lados, el engranaje gira ~1.5s y las puertas se abren. Duración 2.7s. Se omite con `prefers-reduced-motion`.

## Recomendación

- Si resulta largo en móvil, bajar `INTRO_MS` y las keyframes a ~2s.
- No guardar en `sessionStorage` a propósito: cada recarga de la pestaña vuelve a mostrar la intro; la navegación interna no.

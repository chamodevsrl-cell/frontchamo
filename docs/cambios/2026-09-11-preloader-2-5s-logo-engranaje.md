# Preloader: logo, engranaje y fade-out a los 2.5 s

- **Fecha:** 2026-09-11
- **Solicitud:** actualizar `Preloader` con `/logo.png` (entrada izquierda → derecha + fade in), `/engranaje.png` 60×60 girando 360° en loop, texto **CARGANDO...** en `#E4B714`, fondo `#0B3554`, y desvanecimiento a los 2.5 s
- **Archivos:** `components/Preloader.tsx`, `public/logo.png`, `public/engranaje.png`
- **Commit:** (se registra al subir)

## Qué había antes

El overlay ya usaba logo y engranaje oficiales, pero se ocultaba cuando coincidían
`window.load` y un mínimo de 1.2 s (tope 6 s), no a los 2.5 s fijos del brief.

## Código anterior

```tsx
const MIN_MS = 1200;
const MAX_MS = 6000;
// hide when readyMin && pageLoaded
```

## Código nuevo

```tsx
const HOLD_MS = 2500;
// logo: x -100 → 0, opacity 0 → 1
// engranaje: rotate 360 linear infinite, 60×60
// exit: fade out after 2.5s
```

El overlay usa `z-[90]` (no `z-50`) para cubrir el Navbar sticky (`z-50`) y la
burbuja de WhatsApp (`z-[70]`). Sin eso la barra se ve encima de **CARGANDO...**.

## Recomendación

- Si en conexiones lentas el sitio aparece a medias justo al fade-out, se puede
  volver a combinar el timer de 2.5 s con `window.load`.

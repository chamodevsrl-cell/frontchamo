# Preloader Framer Motion en la carga inicial

- **Fecha:** 2026-09-10
- **Solicitud:** instalar `framer-motion`, crear `components/Preloader.tsx` e integrarlo en `app/layout.tsx`
- **Archivos:** `components/Preloader.tsx`, `app/layout.tsx`, `components/IntroSplash.tsx`, `package.json`
- **Commit:** (este bloque)

## Qué había antes

La carga inicial usaba `IntroSplash` (puertas azules + engranaje). No había preloader
con barra de progreso ni `framer-motion`.

## Código nuevo

- `Preloader`: pantalla `fixed inset-0 z-[9999] bg-[#0B3554]`. El nombre **Chamo Import**
  entra de `opacity 0 / scale 0.8` a `1`. Debajo, `Cog` dorado (`#E4B714`) gira en loop.
  Barra inferior `#127EC9` que anima `width` de `0%` a `100%`. A los 2.5s, fade-out hacia arriba y se desmonta.
- Va en `<body>` de `app/layout.tsx`.
- `IntroSplash` ya no arranca solo: sigue al clic del logo y al entrar al carrito.

## Recomendación

- Comprobar que no se solapan preloader y puertas en el primer load.
- `prefers-reduced-motion` omite el overlay.

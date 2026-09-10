# Intro del carrito: mismas puertas, carrito en vez de engranaje

- **Fecha:** 2026-09-10
- **Solicitud:** al entrar al carrito, la animación de puertas como el resto; en vez de Chamo Import y el engranaje, un carrito que se detiene al medio y al abrir sigue su camino
- **Archivos:** `components/IntroSplash.tsx`, `app/globals.css`, `components/Navbar.tsx`
- **Commit:** (este bloque)

## Qué había antes

La intro de puertas + engranaje solo corría al cargar, refrescar o clic en el logo.
Entrar a `/carrito` mostraba la página de golpe, sin overlay.

## Código anterior

```tsx
if (!target.closest("a[data-site-intro]")) return;
play();
// centro: Cog + “Chamo Import”
```

## Código nuevo

- Clic en el icono **Carrito** del Navbar (`data-cart-intro`) o cualquier enlace a
  `/carrito`: mismas puertas azules.
- Centro: icono Lucide `ShoppingCart` dorado. Entra desde la izquierda, **frena al
  medio** mientras las puertas están cerradas y, al abrirse, **sigue a la derecha**.
- Logo / carga inicial: se mantiene el engranaje + “Chamo Import”.
- Si ya estás en `/carrito`, no se repite.

## Recomendación

- Probar desktop y móvil: el carrito no debe recortarse al frenar, y al abrir hay
  que verlo salir de cuadro.
- `prefers-reduced-motion` sigue omitiendo el overlay.

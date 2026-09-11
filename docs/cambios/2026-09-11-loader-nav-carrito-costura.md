# Loader de navegación interna + carrito detrás de la costura

- **Fecha:** 2026-09-11
- **Solicitud:** que las demás animaciones de carga (al ir a catálogo, categorías, ofertas, etc.) usen el mismo loader de entrada a la web; en la intro de compras, que el carrito quede detrás de la línea al entrar y al salir use el recorrido normal
- **Archivos:** `components/BrandLoader.tsx`, `components/Preloader.tsx`, `components/IntroSplash.tsx`, `app/globals.css`
- **Commit:** (se registra al subir)

## Qué había antes

La carga inicial ya mostraba logo + engranaje + **CARGANDO...**. El resto de navegaciones internas no tenía ese overlay (o, en versiones previas, usaba puertas azules). En `/carrito`, el ícono se estacionaba a `calc(-50% - 2.5rem)`, demasiado cerca del centro: la costura dorada lo atravesaba, y al abrir las puertas no volvía al recorrido centrado.

## Código anterior

```tsx
type IntroVariant = "brand" | "cart";
// pathname !== /carrito → no hay overlay de carga
transform: translate(calc(-50% - 2.5rem), -50%); // park
```

## Código nuevo

```tsx
type IntroVariant = "brand" | "cart" | "load";
// clic interno → BrandLoader (mismo que Preloader, 2.5 s)
// /carrito → puertas + carrito
transform: translate(calc(-100% - 0.75rem), -50%); // park: borde derecho a la izquierda de la costura
// 78% → translate(-50%, -50%) recorrido normal al abrir
```

`BrandLoader` es el visual compartido. El clic en el logo sigue usando puertas + `Cog`. Filtros de catálogo (`router.push` solo query) no disparan el loader porque no cambia el `pathname`.

## Recomendación

- El modal de producto (cambio de SKU sin ruta) no muestra este loader a propósito: 2.5 s por cada relacionado sería demasiado.
- Si se quiere acortar el loader en navegaciones internas (p. ej. 1 s), extraer `holdMs` en `BrandLoader`.

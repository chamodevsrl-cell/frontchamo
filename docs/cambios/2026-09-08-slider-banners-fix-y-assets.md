# Fix de carga del slider + banners 2 y 3

- **Fecha:** 2026-09-08
- **Solicitud:** El slider no mostraba la imagen de la carpeta de banners; luego se agregaron banners 2 y 3.
- **Archivos:** `components/HeroSlider.tsx`, `data/media.ts`, `public/images/slider/baner 2.png`, `public/images/slider/baner 3.png`
- **Commits:** `ec693a6`, `a80d3f7`

## Qué había antes

1. Las rutas usaban `%20` escrito a mano (`baner%201.png`).
2. El estado “cargado” dependía solo de `onLoad`. Con imagen en caché (dev / Strict Mode) a veces no disparaba y se quedaba el placeholder.
3. Solo existía `baner 1.png` en disco; slides 2 y 3 fallaban (404).
4. Había overlay de título encima de banners que ya traen texto (`fullBleed` no existía).

## Código anterior (rutas)

```ts
src: "/images/slider/baner%201.png",
```

## Código nuevo (rutas + fullBleed)

```ts
src: "/images/slider/baner 1.png", // encodeURI en el <img>
fullBleed: true, // no superponer título si el arte ya lo trae
```

Y en el slider: detección de carga con `ref` + `queueMicrotask` / `naturalWidth`, no solo `onLoad`.

## Recomendación

- Preferir nombres **sin espacios** (`baner-1.png`) para evitar líos de encoding en URLs.
- Cada banner nuevo: archivo en `public/images/slider/` + entrada en `data/media.ts` con `alt` / título y `fullBleed: true` si el PNG ya incluye tipografía.
- Actualizar `public/images/slider/README.txt` cuando cambien nombres de archivo.

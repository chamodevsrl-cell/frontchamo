# Cursor personalizado: negro puro / blanco sobre imágenes

**Fecha:** 2026-09-15

## Pedido

Cambiar el cursor personalizado (llave inglesa) a otro esquema de color: **negro puro**
por defecto, y **blanco** al pasar sobre cualquier imagen del sitio (fotos de
producto, banners del slider, logos de marca, etc. — todas las `<img>` por igual).

## Antes

`components/WrenchCursor.tsx` pintaba el ícono `Wrench` con `text-brand-dark`
(`#0B3554`, azul oscuro corporativo) y el brillo detrás con `bg-brand-gold/25`. No
distinguía si el mouse estaba sobre una imagen.

## Después

- Nuevo estado `overImage`, calculado en el mismo listener de `mousemove` con
  `target?.closest("img")`.
- Ícono: `text-black` por defecto, `text-white` sobre cualquier `<img>`.
- Brillo detrás del ícono invertido para que siempre resalte: `bg-white/40` en negro,
  `bg-black/25` en blanco.
- Barra de texto (I-beam, para inputs) pasó de `bg-brand-primary`/`dark:bg-brand-gold`
  a `bg-black` (el modo oscuro está forzado apagado en todo el sitio, así que los
  `dark:` ya no aportaban nada).

## Verificado

`npm run build` + `npm run lint` en verde. En vivo: hover sobre el banner del hero
slider → ícono blanco (confirmado por clase `text-white` en el DOM); hover sobre el
ícono de Favoritos (fondo blanco, sin imagen) → ícono negro (`text-black`).

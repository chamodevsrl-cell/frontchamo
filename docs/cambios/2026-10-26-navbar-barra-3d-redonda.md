# Navbar: barra redonda (sin 3D), links a la izquierda

- **Fecha:** 2026-10-26
- **Solicitud:** Barra azul más redonda; luego quitar el 3D y alinear los links a la izquierda.
- **Archivos:** `components/Navbar.tsx`
- **Commit:** (local)

## Qué había antes

Franja azul a todo el ancho, esquinas cuadradas. Un primer paso la centró con sombra 3D.

## Código nuevo

En desktop la barra queda `rounded-2xl` sobre fondo blanco, **sin** sombra 3D. Los links van a la izquierda (`justify-start`). En móvil el menú sigue en el drawer.

## Recomendación

Comprobar que el dropdown de Categorías no quede recortado por el `rounded-2xl`.

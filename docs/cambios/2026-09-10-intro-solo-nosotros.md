# Intro solo al entrar y en Nosotros

- **Fecha:** 2026-09-10
- **Solicitud:** quitar las animaciones al entrar a una sección; que sea solo al entrar a la web y al apartado de Nosotros
- **Archivos:** `components/IntroSplash.tsx`
- **Commit:** (este bloque)

## Qué había antes

Las puertas + engranaje se repetían en **cada** navegación (Catálogo, Categorías, Contacto, etc.).

## Código nuevo

- Primera carga de la pestaña: intro completa (sin cambio).
- Navegación interna: **solo** al ir a `/nosotros`. Catálogo, categorías, contacto y el resto entran sin overlay.

## Recomendación

- Si más adelante se quiere otra página “especial” (p. ej. Ofertas), reutilizar el mismo filtro de ruta.

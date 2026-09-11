# Intro solo al entrar, refrescar o tocar el logo

- **Fecha:** 2026-09-10
- **Solicitud:** corrección — la animación solo al entrar a la web, al refrescar, o al dar clic al logo de la empresa
- **Archivos:** `components/IntroSplash.tsx`, `components/Navbar.tsx`, `components/Footer.tsx`
- **Commit:** (este bloque)

## Qué había antes

Además de la carga inicial, las puertas se repetían al entrar a `/nosotros`.

## Código nuevo

- Carga o **refresh** de la pestaña: intro completa.
- Clic en el **logo** (navbar y footer, `data-site-intro`): misma intro.
- Nosotros, Catálogo, Categorías, Contacto, Inicio (texto del menú) y el resto: **sin** overlay.

## Recomendación

- El ítem **Inicio** del menú azul no dispara la intro a propósito: solo el logo.

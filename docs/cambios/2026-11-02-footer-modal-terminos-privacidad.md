# Footer: modal de términos y privacidad

- **Fecha:** 2026-11-02
- **Solicitud:** Debajo del texto del footer (tagline), un enlace que abre un modal con términos y condiciones y política de privacidad.
- **Archivos:** `components/Footer.tsx`, `components/LegalModal.tsx`, `components/LegalCopy.tsx`, `data/legal.ts`, `app/terminos/page.tsx`, `app/privacidad/page.tsx`
- **Commit:** (local)

## Qué había antes

El tagline no tenía enlace legal. Términos y privacidad solo existían como páginas `/terminos` y `/privacidad` (también en la barra inferior del footer).

## Código nuevo

Bajo el tagline hay **Términos, condiciones y privacidad**. Abre un modal (portal al `body`) con pestañas para ambos documentos. El texto vive en `data/legal.ts` y se reutiliza en las páginas.

## Recomendación

Si el cliente envía redacción oficial, actualizar `data/legal.ts` una sola vez.

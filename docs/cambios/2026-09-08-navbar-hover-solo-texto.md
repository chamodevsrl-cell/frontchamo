# Navbar: hover solo ilumina el texto (sin bloque)

- **Fecha:** 2026-09-08
- **Solicitud:** En el hover del nav, que solo se iluminen las letras, no el bloque del enlace.
- **Archivos:** `components/Navbar.tsx`
- **Commit:** (al push)

## Qué había antes

```tsx
"text-white hover:bg-brand-dark/20 hover:text-brand-gold/90"
```

El fondo oscuro hacía un rectángulo detrás de todo el enlace.

## Código nuevo

```tsx
"text-white hover:text-brand-gold"
```

Solo cambia el color del texto; la barra dorada inferior sigue solo en el ítem activo.

## Recomendación

- Mantener `px`/`py` para área clicable amplia, aunque el hover visual sea solo tipográfico.

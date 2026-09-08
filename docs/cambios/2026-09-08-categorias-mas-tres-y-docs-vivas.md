# Agregar 3 categorías al home + set de documentación viva

- **Fecha:** 2026-09-08
- **Solicitud:** Aumentar 3 categorías más; documentar juntos los cambios (manual de cambios, documentación técnica, de usuario y sugerencias), actualizándolas en cada avance.
- **Archivos:** `data/home.ts`, `components/CategoriesGrid.tsx`, `docs/*`
- **Commit:** `3940345`

## Qué había antes

- Solo **4** categorías: Ferretería, Electricidad, Seguridad, Hogar.
- Documentación limitada a `docs/cambios/` (notas por ticket), sin manual / técnica / usuario / sugerencias como set fijo.

## Código anterior

```ts
// mainCategories: 4 ítems
// grilla: lg:grid-cols-4
```

## Código nuevo

```ts
// + Herramientas, Construcción, Pinturas → 7 ítems
// grilla: lg:grid-cols-3 xl:grid-cols-4
```

Nuevos docs:

- `docs/README.md` — índice
- `docs/MANUAL_CAMBIOS.md` — flujo obligatorio por solicitud
- `docs/TECNICA.md` — arquitectura actual
- `docs/USUARIO.md` — guía de uso del sitio
- `docs/SUGERENCIAS.md` — backlog de mejoras

## Recomendación

- En cada pedido futuro: código + nota en `docs/cambios/` + retocar técnica/usuario/sugerencias si el cambio es visible o estructural, luego push.
- No es Claude Code: el asistente en Cursor es **Auto (Composer)**; la “conexión” de la documentación es el propio repositorio Git.

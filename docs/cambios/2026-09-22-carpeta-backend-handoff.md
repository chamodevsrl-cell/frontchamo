# Carpeta de handoff para el backend dev (docs/backend-handoff/)

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario pidió una documentación detallada en una carpeta
  para que, al entrar el desarrollador de backend, sepa qué leer y en qué
  orden, y la documentación le diga qué conectar con qué.
- **Archivos:** `docs/backend-handoff/README.md` (nuevo),
  `docs/backend-handoff/MAPA-CONEXION.md` (nuevo), `docs/README.md`,
  `CLAUDE.md` (enlaces al punto de entrada nuevo) + fix de un choque de
  nombres encontrado al armar el mapa (ver abajo).
- **Commit:** (pendiente)

## Qué había antes

Ya existían `API_CONTRACT.md`, `API_CONTRACT_TIENDA.md` y
`FRONTEND_DOCUMENTATION.md`, pero repartidos en la raíz del repo sin un
único punto de entrada que dijera "empieza por acá, en este orden". Para
armar el panorama completo había que abrir los tres archivos y cruzarlos a
mano.

## Código nuevo (resumen)

- **`docs/backend-handoff/README.md`** — entry point: orden de lectura,
  cómo están marcados los TODOs en código (`grep -rn "TODO Backend"`), tabla
  de los dos sistemas de sesión (tienda vs. panel) para no confundirlos, y
  qué decisiones (storage de imágenes, DB, hosting) no son del front.
- **`docs/backend-handoff/MAPA-CONEXION.md`** — tabla maestra única, en
  orden de prioridad (panel → CMS → catálogo → cuentas → carrito →
  imágenes), con: pieza, archivo de código donde vive hoy, endpoint(s) y
  link directo a la sección del contrato correspondiente.
- `docs/README.md` y `CLAUDE.md` ahora apuntan a
  `docs/backend-handoff/README.md` como punto de entrada del handover.

**Bug encontrado al armar el mapa:** `API_CONTRACT_TIENDA.md` §2 (catálogo
público) usaba `GET /api/v1/products` — el mismo path que `API_CONTRACT.md`
ya usaba para el panel (`Product[]`, con sesión), pero con una forma
distinta (`FeaturedProduct[]`, público). Se corrigió moviendo el catálogo
público a su propio namespace, `/api/v1/catalog`, en los dos contratos, en
los comentarios `// TODO Backend` de `data/products.ts` y
`app/api/productos/route.ts`, y en `docs/MANUAL.md` §A.13.2.

Verificado: `tsc --noEmit` limpio después del fix de paths.

## Recomendación

- Si se agrega una pieza nueva al contrato de tienda o del panel más
  adelante, sumarla también a `MAPA-CONEXION.md` — si no, la tabla queda
  desactualizada y deja de ser confiable como índice único.

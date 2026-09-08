# Consolidar la documentación viva en 3 secciones fijas

- **Fecha:** 2026-09-08
- **Solicitud:** "Documenta todo en 3 secciones: 1) los cambios que se hacen, 2) sugerencias de cambios, 3) documentación técnica y manual de usuario. Cada una debe actualizarse con cualquier cambio del proyecto, por pequeño que sea (hasta una simple imagen)."
- **Archivos:** `docs/README.md`, `docs/MANUAL.md` (nuevo), `docs/SUGERENCIAS.md`, `docs/cambios/README.md`, `docs/TECNICA.md` / `docs/USUARIO.md` / `docs/MANUAL_CAMBIOS.md` (eliminados), `CLAUDE.md`, `README.md`
- **Commit:** (pendiente al momento de escribir esta nota)

## Qué había antes

El set de documentación viva creado en el avance anterior tenía **5 documentos**
(`README.md`, `MANUAL_CAMBIOS.md`, `TECNICA.md`, `USUARIO.md`, `SUGERENCIAS.md`) más la
carpeta `cambios/`. Cumplía la misma idea, pero no calzaba exactamente con las 3
secciones pedidas explícitamente por el usuario.

## Código nuevo (estructura)

```
docs/
  README.md         # Índice + flujo, mapeado a las 3 secciones
  MANUAL.md          # Sección 3: documentación técnica (Parte A) + manual de usuario (Parte B)
  SUGERENCIAS.md      # Sección 2: sugerencias de cambios (sin modificar contenido)
  cambios/            # Sección 1: una nota por solicitud (sin modificar contenido previo)
```

- `TECNICA.md` + `USUARIO.md` → fusionados en `MANUAL.md` (Parte A / Parte B).
- `MANUAL_CAMBIOS.md` → su flujo se integró dentro de `docs/README.md`.
- `CLAUDE.md` (§7 y §9) y `README.md` (raíz) actualizados para apuntar a la nueva
  estructura de 3 secciones.

## Recomendación

- Mantener la regla: **cualquier cambio, aunque sea una sola imagen o texto, actualiza
  `MANUAL.md` (Parte B) y deja nota en `docs/cambios/`.**
- Si en el futuro se necesita separar de nuevo técnica/usuario en archivos distintos
  (por ejemplo, si crecen mucho), hacerlo como una 4ª sección explícita en vez de romper
  el esquema de 3 sin avisar.

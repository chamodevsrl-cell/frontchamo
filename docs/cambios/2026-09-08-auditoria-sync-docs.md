# Auditoría: sincronizar CLAUDE.md / MANUAL.md / SUGERENCIAS.md con el código real

- **Fecha:** 2026-09-08
- **Solicitud:** "Revisa todo y actualiza las documentaciones."
- **Archivos:** `CLAUDE.md`, `docs/MANUAL.md`, `docs/SUGERENCIAS.md`, `README.md`
- **Commit:** (pendiente al momento de escribir esta nota)

## Qué había antes

Entre la consolidación de docs en 3 secciones y esta revisión, otra sesión (Cursor —
Auto/Composer) hizo varios cambios de código en paralelo y ya los documentó bien en
`docs/cambios/` y `docs/MANUAL.md` / `docs/SUGERENCIAS.md`:

- Categorías pasaron de grilla a carrusel horizontal (`064bec8`).
- Carrusel de categorías también en PC, con flechas circulares (`ed61915`).
- Modal de producto rediseñado: ficha técnica en tabla + relacionados por categoría (`9b0794c`, `9c20a70`).

`docs/MANUAL.md` y `docs/SUGERENCIAS.md` ya reflejaban esto correctamente. Lo que había
quedado desactualizado era **`CLAUDE.md`** (memoria de agentes) y el **`README.md`** raíz,
que seguían describiendo `CategoriesGrid` como grilla estática y no mencionaban el modal
rediseñado. También encontré una imprecisión: la nota de "pendiente sincronizar teléfono"
solo mencionaba 2 de los 4 archivos reales con el placeholder `+51 999 999 999`
(`WhatsAppFloat.tsx`, `Footer.tsx`, `app/cotizar/page.tsx`, `app/contacto/page.tsx` — este
último confirmado por revisión de código, no estaba anotado en ningún doc).

## Qué se corrigió

- `CLAUDE.md` §5/§6/§10: `CategoriesGrid` ahora se describe como carrusel con flechas;
  se agregó el detalle del modal de producto (ficha técnica + relacionados); se listaron
  las 4 ubicaciones reales del teléfono placeholder (antes decía "dos lugares").
- `docs/MANUAL.md` A.8: mismo ajuste (4 archivos, no 2).
- `docs/SUGERENCIAS.md`: se agregó el detalle de los 4 archivos con placeholder, el correo
  provisional también en `/contacto`, "Seguridad" solo tiene 1 producto (sin relacionados),
  y completar specs técnicas reales cuando el cliente las envíe.
- `README.md` raíz: bullet de categorías actualizado a "carrusel" y se sumó el modal de
  producto como feature destacada.

## Recomendación

- Antes de dar por hecho el estado del sitio en una sesión nueva, correr `git log --oneline -10`
  — el repo se trabaja desde Claude Code y desde Cursor (Auto/Composer) en paralelo, y el
  código puede haber avanzado sin que la sesión actual lo sepa hasta hacer `pull`.
- Próxima vez que se toque `WhatsAppFloat.tsx` / `Footer.tsx` / `cotizar` / `contacto`,
  aprovechar para sincronizar el teléfono oficial de una vez en los 4 archivos.

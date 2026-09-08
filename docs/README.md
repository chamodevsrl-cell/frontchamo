# Documentación — Chamo Import (Front)

Esta carpeta es la **fuente viva** del proyecto, organizada en **3 secciones fijas**.
Cualquier sesión (Claude Code, Cursor u otra) debe mantenerlas al día junto con el código
— incluso un cambio pequeño como reemplazar una imagen debe quedar documentado aquí.

| # | Sección | Archivo(s) | Para quién |
| --- | --- | --- | --- |
| 1 | **Cambios** — qué se hizo, antes/después | [`cambios/`](./cambios/) (índice en [`cambios/README.md`](./cambios/README.md)) | Todos / historial |
| 2 | **Sugerencias** — mejoras y deuda pendiente | [`SUGERENCIAS.md`](./SUGERENCIAS.md) | Producto / negocio |
| 3 | **Documentación técnica y manual de usuario** | [`MANUAL.md`](./MANUAL.md) | Desarrolladores + operación |

## Flujo obligatorio (cada solicitud, sin importar el tamaño)

1. Implementar el cambio en código (o el asset: imagen, texto, dato).
2. Crear una nota en `docs/cambios/AAAA-MM-DD-descripcion.md` (plantilla:
   [`cambios/_plantilla.md`](./cambios/_plantilla.md)) con qué había antes, qué cambió y
   una recomendación. Actualizar el índice `cambios/README.md`.
3. Actualizar `MANUAL.md`:
   - Parte A (técnica) si cambia arquitectura, componentes, datos o rutas.
   - Parte B (usuario) si cambia algo visible — sí, también una sola imagen o texto.
4. Actualizar `SUGERENCIAS.md`: marcar ítems resueltos, anotar ideas nuevas que hayan surgido.
5. Commit + push a Git.

## Relación entre secciones

| Si el cambio afecta… | Actualiza… |
| --- | --- |
| Layout, rutas, componentes, datos, APIs | `MANUAL.md` → Parte A |
| Lo que ve/usa el visitante o el negocio (textos, imágenes, flujos) | `MANUAL.md` → Parte B |
| Deuda técnica o ideas para después | `SUGERENCIAS.md` |
| Cualquier solicitud puntual (detalle antes/después) | `cambios/*.md` |

**Memoria de agentes:** [`../CLAUDE.md`](../CLAUDE.md) + [`../AGENTS.md`](../AGENTS.md)
resumen este mismo esquema para que cualquier sesión lo retome sin contexto previo.

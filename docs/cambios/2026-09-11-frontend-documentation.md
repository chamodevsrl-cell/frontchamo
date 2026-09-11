# Documentación única para el handover de backend: `FRONTEND_DOCUMENTATION.md`

- **Fecha:** 2026-09-11
- **Solicitud:** "Borra los worktrees que quedaron pendientes y asegura que todo esté
  documentado al detalle en una sola documentación como front documentación para que
  el backend sepa qué variable se usó en cada componente, cómo puede conectarlo y
  además un manual de uso."
- **Archivos:** `FRONTEND_DOCUMENTATION.md` (nuevo, raíz del repo), `README.md`,
  `CLAUDE.md`, `docs/README.md`, `API_CONTRACT.md` (enlaces cruzados)
- **Commit:** (pendiente al momento de escribir esta nota)

## Limpieza de worktrees

`git worktree list` ya no mostraba ninguno pendiente, pero quedaba un directorio
huérfano en disco (`frontchamo-branch-fix`, de una sesión anterior donde
`git worktree remove` había fallado con "Invalid argument" por un proceso que tenía
el `node_modules` abierto). Se confirmó que no era una carpeta registrada (`git
worktree prune` no encontró metadata) y se borró directo del filesystem.

## Qué había antes

La documentación técnica estaba repartida en varios archivos, cada uno con un
propósito distinto: `docs/MANUAL.md` (arquitectura + manual de usuario, orientado al
proceso de trabajo), `API_CONTRACT.md` (solo el contrato HTTP del panel admin),
`CLAUDE.md` (memoria corta de sesión), y ningún lugar que listara, componente por
componente, qué variables/props usa cada uno y de dónde salen — alguien de backend
tenía que armar ese mapa leyendo el código.

## Código nuevo

**`FRONTEND_DOCUMENTATION.md`** (raíz del repo, 345 líneas) — documento único con:

1. Stack y comandos.
2. Los **dos sistemas de datos** que no hay que confundir (tienda vs panel admin),
   en una tabla comparativa.
3. **Mapa de datos**: cada dato del sitio, dónde vive hoy (`localStorage`, cookie,
   memoria del server, archivo estático) y si ya tiene endpoint o mock.
4. **Componentes y las variables que usan, por dominio** (catálogo, carrito,
   favoritos/comparar, cuentas de la tienda, contacto/cotización/testimonios, panel
   admin) — para cada componente: sus props con tipo, y de dónde sale ese dato hoy.
5. **Cómo conectar el backend**: guía paso a paso para el panel (ya listo, solo
   reemplazar `services/adminApi.ts`), para el catálogo público (ya hay un endpoint),
   y para carrito/favoritos/comparar/cuentas (hoy 100% `localStorage`, sin mock —
   decisiones que hay que tomar antes de conectarlos). Incluye la nota de que
   `FeaturedProduct`/`Product` y las dos sesiones (`AuthUser` vs `AuthSession`) son
   duplicados a propósito que un backend real probablemente unifica.
6. **Manual de uso** completo: tienda (cliente) y panel admin (equipo), incluyendo
   las credenciales de prueba del panel.
7. Enlaces a `API_CONTRACT.md`, `docs/MANUAL.md`, `docs/SUGERENCIAS.md`,
   `docs/cambios/`, `CLAUDE.md` para quien necesite más detalle o el historial.

Se dejó explícito que este archivo **no reemplaza** `docs/` (el proceso de trabajo
día a día sigue ahí) ni `API_CONTRACT.md` (la especificación HTTP exacta) — es la
foto técnica completa que conecta ambos con el resto del front.

**Enlaces cruzados agregados** para que sea fácil de encontrar: `README.md` (arriba
de todo, con una llamada directa "¿Vas a conectar el backend?"), `CLAUDE.md` (debajo
de la intro), `docs/README.md` (línea "Handover de backend"), `API_CONTRACT.md`
(nota de que solo cubre el panel, el resto está en el nuevo archivo).

## Recomendación

- Cuando se conecte cualquier pieza del backend (panel, catálogo, carrito, etc.),
  actualizar la fila correspondiente de la tabla de §3 (Mapa de datos) en
  `FRONTEND_DOCUMENTATION.md` — de 🟡/❌ a ✅ — para que el documento siga siendo la
  foto real del estado del proyecto.
- Si se unifican los dos catálogos o las dos sesiones (§5.4), ese es el momento de
  simplificar esta misma sección en vez de mantener la duplicación documentada.

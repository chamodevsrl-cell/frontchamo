# "Administrar" solo con sesión del panel verificada por el servidor

- **Fecha:** 2026-09-23
- **Solicitud:** Sin iniciar sesión seguía apareciendo la opción de admin.
  Debe salir solo cuando se apruebe y compruebe el ingreso del admin.
- **Archivos:** `components/AuthProvider.tsx`, `app/admin/actions.ts`,
  `services/adminApi.ts`.
- **Commit:** (ver historial de Git)

## Qué había antes

Al cargar la página, `AuthProvider` daba por buena cualquier sesión del panel
guardada en el navegador:

- `readPanelSession()` leía la cookie **o** la copia en `localStorage`
  (`chamo-admin-session-v1`). Esa copia no vence, así que cuando la cookie de
  8 h expiraba seguía activando `hasPanelSession`.
- El usuario del panel también quedaba guardado en `chamo-session-v1` y se
  restauraba solo, aunque no fuera una cuenta de la tienda.

Resultado: sin haber iniciado sesión (o con la sesión ya vencida) se veía
"THE" + **Administrar**.

## Código nuevo (resumen)

- **`services/adminApi.ts`** — nuevo mock `verifyAdminSession(token)` de
  `GET /api/v1/auth/session` (ya estaba en `API_CONTRACT.md`): el token debe
  ser de un usuario que existe, no está suspendido y tiene rol; si no,
  `UNAUTHORIZED`. Devuelve la sesión al día.
- **`app/admin/actions.ts`** — `verifyAdminSessionAction()` (Server Action):
  lee la cookie en el servidor, la valida con lo anterior y, si falla, borra
  la cookie.
- **`components/AuthProvider.tsx`** — al montar:
  - Solo se restaura directo una **cuenta de la tienda** (su correo está en
    `chamo-accounts-v1`).
  - `hasPanelSession` arranca en `false`; solo pasa a `true` (y aparece el
    usuario del panel + **Administrar**) cuando `verifyAdminSessionAction()`
    responde `ok`.
  - Si el servidor la rechaza, se limpian cookie y `localStorage` del panel.

Verificado en el navegador:
- Sesión falsa/vencida en cookie + localStorage → al recargar se ve el botón
  **Cuenta**, no hay ningún link a `/admin` y los datos viejos se borran.
- Sesión válida de THE WINTER → el menú del perfil muestra Mi perfil,
  **Administrar** y Cerrar sesión.

`tsc --noEmit`, `eslint` y `npm test` (30/30) sin errores.

## Recomendación

Con el backend real, la cookie debe ser `httpOnly` + `Secure` y la copia en
`localStorage` puede eliminarse: `GET /api/v1/auth/session` pasa a ser la
única fuente de verdad.

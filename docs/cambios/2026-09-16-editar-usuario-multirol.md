# Editar usuario completo (nombre/correo/contraseña/roles) + varios roles por usuario

- **Fecha:** 2026-09-16
- **Solicitud:** al editar un usuario del panel debía poder cambiarse nombre,
  contraseña, correo y rol; y al crear uno nuevo debía poder asignarse más de
  un rol.
- **Archivos:** `types/admin.ts`, `services/adminApi.ts`, `app/admin/actions.ts`,
  `components/admin/AdminUsersCards.tsx`, `API_CONTRACT.md`, `tests/smoke.test.ts`.

## Qué había antes

`PanelUser.roleId: string` — un solo rol por usuario. El modal "Editar
usuario" solo tenía habilitar/deshabilitar y borrar; no había forma de
cambiar nombre, correo, contraseña ni rol después del alta. El alta
(`createUser`) tomaba un único `roleId` por un `<select>`.

## Código nuevo

**Modelo:** `PanelUser.roleId` → `PanelUser.roleIds: string[]`. `AuthSession`
suma `roleIds: string[]` (mantiene `roleId` = `roleIds[0]` por compatibilidad
con `lib/auth.ts` y código existente). `buildSession()` en `adminApi.ts` ahora
recibe todos los `PanelRole` del usuario y calcula `permissions` como la
**unión** (sin duplicados) de los `permissions` de cada rol — así alguien con
Editor + Almacén ve las secciones de ambos.

**Nuevo endpoint/función:** `updateUser(userId, input)` /
`updateUserAction()` — edición parcial (solo se aplican los campos
presentes): `name`, `email`, `roleIds`, `password` (vacío = no cambia).
Valida correo/nombre duplicados (excluyendo al propio usuario), que
`roleIds` no quede vacío y que cada id exista.

**Modal "Editar usuario"** (`AdminUsersCards.tsx`): ahora es un formulario
real — Nombre, Correo, Nueva contraseña (placeholder "Dejar en blanco para no
cambiarla") y **Roles** como checkboxes (uno o más), con "Guardar cambios" +
confirmación `role="status"`. Debajo siguen, sin cambios de comportamiento,
Habilitar/Deshabilitar y Borrar. Si es tu propia cuenta, los checkboxes de rol
quedan deshabilitados (mismo criterio que status/borrar: no auto-degradarte y
quedar sin acceso a Usuarios).

**Modal "Nuevo usuario"**: el `<select>` de un solo rol se volvió un grupo de
checkboxes ("elige uno o más"), mismo patrón que los permisos en
`AdminRolesView.tsx`.

**Tarjetas**: el pill de rol muestra el primero + `+N` si hay más de uno; el
reverso lista todos los roles con su descripción y el total de secciones
habilitadas (unión).

## Verificación

Probado en vivo: a Katia (Editor) se le asignó también Almacén desde
"Editar" → la tarjeta pasó a mostrar "EDITOR +1" y el reverso lista ambos
roles + "8 secciones habilitadas en total"; se revirtió a solo Editor. Se
creó un usuario nuevo con Administrador + Editor marcados a la vez, quedó con
badge "+1", y se borró después de confirmar que funcionaba. `npm run lint`,
`npm run build` y `npm test` (30/30, con 2 pruebas nuevas: multirol y
`updateUser`) en verde.

## Recomendación

- `updateOwnProfile` (Mi perfil) sigue sin poder cambiar correo/contraseña —
  ese endpoint es intencionalmente limitado a nombre/teléfono/empresa; el
  cambio de correo/contraseña de la propia cuenta, si se pide, debería vivir
  ahí, no solo en el modal de "Editar usuario" de otros.

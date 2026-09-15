# Panel admin: secciones Usuarios y Roles

**Fecha:** 2026-09-15

## Pedido

El cliente mandó una captura de otro panel de referencia pidiendo que la web sea
editable por completo desde `/admin`. De las 5 secciones nuevas propuestas
(ver [`SUGERENCIAS.md`](../SUGERENCIAS.md)) priorizó **Usuarios + Roles** y descartó
Cotizaciones por ahora.

## Antes

El sidebar (`AdminShell.tsx`) no tenía forma de gestionar quién entra al panel ni con
qué permisos — solo existía el login mock fijo (`admin@local.test`, rol `admin` único
en `AuthSession`).

## Después

- **`types/admin.ts`:** `AdminPermission` (13 secciones, calcadas del `NAV` del
  sidebar), `PanelRole` (nombre, descripción, permisos, `isSystem`) y `PanelUser`
  (nombre, correo, `roleId`, `status`, `lastLoginAt`). Son modelos nuevos, separados de
  `AdminRole`/`AuthSession` (el login sigue igual) y de `AuthUser` de la tienda.
- **`services/adminApi.ts`:** mock con 3 roles semilla (Administrador y Editor,
  `isSystem: true`; Almacén, un rol custom de ejemplo) y 3 usuarios semilla. Funciones
  `getRoles()`, `createRole()`, `getUsers()`, `createUser()`, `updateUserStatus()` —
  mismo patrón `delay()` + `// TODO Backend` que el resto del archivo.
- **`app/admin/actions.ts`:** `createRoleAction`, `createUserAction`,
  `updateUserStatusAction` (Server Actions, mismo patrón que pedidos/productos).
- **Páginas:** `/admin/usuarios` (tabla + alta) y `/admin/roles` (tarjetas de permisos
  + alta), componentes `AdminUsersTable.tsx` y `AdminRolesView.tsx`.
- **`AdminShell.tsx`:** dos ítems nuevos en el `NAV` (Usuarios con ícono `UserCog`,
  Roles con ícono `ShieldCheck`, para no repetir el ícono `Users` que ya usa Clientes).

Verificado con `npm run build` + `npm run lint` + `npm test` en verde, y en vivo:
login, alta de usuario (`Prueba QA` con rol Almacén) y las 3 tarjetas de rol con sus
permisos, ambas contra el dev server real.

## Pendiente

- Cerrado el 2026-09-15: el login ya valida contra `PanelUser` + `PanelRole`
  (ver [`2026-09-15-admin-login-usuarios.md`](./2026-09-15-admin-login-usuarios.md)).
- Sin borrado de usuarios/roles todavía (solo alta + cambio de estado).

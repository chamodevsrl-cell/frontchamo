# Login del panel conectado a Usuarios/Roles + cuenta THE WINTER

- **Fecha:** 2026-09-15
- **Solicitud:** Seguir al pie de la letra las sugerencias/cambios nuevos (conectar `loginAdmin()` a `PanelUser` + `PanelRole`) y crear un usuario para entrar al dashboard: nombre **THE WINTER**, contraseña **Criper@11**.
- **Archivos:** `services/adminApi.ts`, `types/admin.ts`, `lib/auth.ts`, `lib/admin-permissions.ts`, `components/admin/AdminLoginForm.tsx`, `components/admin/AdminShell.tsx`, `components/admin/AdminUsersTable.tsx`, `tests/smoke.test.ts`, `API_CONTRACT.md`, `docs/MANUAL.md`, `docs/SUGERENCIAS.md`
- **Commit:** (pendiente)

## Qué había antes

`loginAdmin()` solo aceptaba `admin@local.test` / `admin123` y devolvía siempre el mismo `MOCK_SESSION`. Las pantallas `/admin/usuarios` y `/admin/roles` existían, pero no controlaban quién entra ni qué ve en el sidebar. Alta de usuario no pedía contraseña.

## Código anterior

```ts
if (email !== MOCK_ADMIN_EMAIL || password !== MOCK_ADMIN_PASSWORD) {
  throw new AdminApiError("INVALID_CREDENTIALS", "…admin@local.test / admin123.");
}
return { ...MOCK_SESSION };
```

## Código nuevo

```ts
const user = findUserByLogin(credentials.email); // correo o nombre
// valida password en memoria, rechaza suspended, copia PanelRole.permissions a AuthSession
user.lastLoginAt = new Date().toISOString();
return buildSession(user, role);
```

- Semilla **THE WINTER** (`thewinter@local.test`, rol Administrador, contraseña `Criper@11`). Entra con el **nombre** o el correo.
- `AuthSession` ahora lleva `roleId` + `permissions`. El sidebar oculta secciones sin permiso; si se pega una URL prohibida, redirige a la primera sección permitida.
- Alta de usuario pide contraseña (≥ 6) y esa cuenta puede loguearse de inmediato.

## Recomendación

- Las credenciales viven en el mock del front. Borrarlas al conectar el backend real (`API_CONTRACT.md`).
- Sesiones viejas en cookie (sin `roleId`/`permissions`) dejan de parsear: hay que volver a entrar.
- Sigue sin haber borrado de usuarios/roles (solo alta + estado).

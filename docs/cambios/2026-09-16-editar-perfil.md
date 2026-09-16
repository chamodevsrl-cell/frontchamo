# Área cliente: cada perfil puede editar sus datos

- **Fecha:** 2026-09-16
- **Solicitud:** Cada perfil (admin, usuario o cualquier rol) debe poder editar su perfil; referencia de “Mi cuenta / Mi perfil”.
- **Archivos:** `lib/auth-local.ts`, `components/AuthProvider.tsx`, `components/AccountShell.tsx`, `components/AccountProfileForm.tsx`, `app/cuenta/**`, `components/Navbar.tsx`, `components/admin/AdminShell.tsx`, `services/adminApi.ts`, `app/admin/actions.ts`
- **Commit:** (pendiente)

## Qué había antes

“Mi cuenta” solo abría el login. Con sesión, el menú mostraba el correo, Administrar (si había panel) y Cerrar sesión. No había página de perfil ni `updateProfile`: ni clientes ni staff podían cambiar nombre, foto o teléfono.

## Código anterior

```tsx
{hasPanelSession ? (
  <Link href="/admin">Administrar</Link>
) : null}
<button type="button" onClick={() => logout()}>Cerrar sesión</button>
```

`StoredAccount` / `AuthUser` solo tenían `id, name, email, role`.

## Código nuevo

```tsx
<Link href="/cuenta/perfil">Mi perfil</Link>
```

`/cuenta/perfil` (cualquier rol con sesión): foto propia o avatares, nombre, correo de solo lectura, teléfono, Guardar. RUC/razón social en `/cuenta/empresa`. Staff del panel también actualiza `PUT /api/v1/users/me` (`updateOwnProfile`).

## Recomendación

- La foto vive en `chamo-profiles-v1` (no en la cookie) porque un `data:` URL reventaría el header.
- Autenticador Google/Microsoft de la captura de referencia no se implementó: pedir OTP de app cuando haya backend.
- Pedidos reales siguen pendientes del API; la pestaña “Mis pedidos” enlaza a cotizar.

## Foto de portada + descripción editable (2026-09-16, tercera pasada)

**Solicitud:** el banner de "Mi cuenta" debía poder llevar foto propia (como la
del perfil) y, en vez del rótulo fijo "Mi cuenta" / "Hola, {nombre}", mostrar
el nombre del usuario y una descripción corta editable por el dueño del perfil.

- `ProfileExtras` (`lib/auth-local.ts`) suma `bio` y `banner`; `BIO_MAX_LENGTH = 160`.
  `emptyProfile`, `readProfileFields`, `profileOf` y `validateProfilePatch` los
  cubren igual que `phone`/`photo`/`company`/`ruc` — el resto de la tubería
  (`updateAccountProfile`, `parseAccounts`, `parseSession`, `hydrateSessionUser`)
  no necesitó cambios porque ya opera genéricamente sobre `ProfileExtras`.
- `AccountProfileForm.tsx` (variant `profile`): nuevo bloque "Foto de portada"
  (subir archivo, máx. 3.5 MB — `MAX_BANNER_IMAGE_BYTES` en `lib/cms-image.ts`
  — o quitarla) y textarea "Descripción breve" con contador `0/160`.
- `AccountShell.tsx`: el banner (`admin-page-hero`) pinta `user.banner` como
  imagen de fondo con overlay degradado (`from-brand-dark/92 ... to-brand-dark/50`)
  para que el texto blanco siga legible sobre cualquier foto. El `<h1>` ya no
  dice "Mi cuenta": muestra `user.name`; debajo, `user.bio` o, si está vacía,
  una invitación a completarla con enlace a `/cuenta/perfil`.

Verificado en vivo (THE WINTER): escribir la descripción y guardar la
actualiza al instante en el banner; el contador de caracteres funciona;
`npm run lint`, `npm run build` (con el fix de tipos en `AuthProvider.tsx` y
`tests/smoke.test.ts` por los dos campos nuevos en `ProfileExtras`) y
`npm test` (28/28) quedan en verde.

## Verificación (2026-09-16, segunda pasada)

`npm run build` fallaba: `services/adminApi.ts` importaba `UpdateOwnProfileInput`
dos veces desde `@/types/admin` (`TS2300: Duplicate identifier`). Se quitó el
import repetido. Con eso, `npm run lint`, `npm run build` (47 rutas, incluidas
`/cuenta`, `/cuenta/perfil`, `/cuenta/empresa`, `/cuenta/pedidos`) y `npm test`
(27/28 — el único que falla es el smoke HTTP opcional contra un server externo
en el puerto 3000 que no es este proyecto) quedan en verde. Probado en vivo:
cambiar teléfono + avatar en `/cuenta/perfil` guarda y se refleja al instante
en el Navbar y en el header del panel; `/cuenta/empresa` guarda razón
social/RUC; el dropdown de “Mi perfil” del panel (`AdminShell`) abre
`/cuenta/perfil` correctamente.

# Navbar: "Administrar" solo en el menú del perfil

- **Fecha:** 2026-09-23
- **Solicitud:** Quitar el botón **Administrar** (ícono de casa) de la fila
  blanca del Navbar; debe verse solo cuando el admin inicia sesión y dentro
  del menú que se abre al hacer clic en su perfil (donde ya estaba).
- **Archivos:** `components/Navbar.tsx`.
- **Commit:** (ver historial de Git)

## Qué había antes

Con sesión del panel (`hasPanelSession`), "Administrar" aparecía en tres
lugares: como botón suelto en la fila blanca (desktop), como ícono compacto
en pantallas pequeñas y dentro del menú del perfil / drawer móvil.

## Código nuevo (resumen)

- Se quitan del `Navbar.tsx` el `<Link href="/admin">` de la fila (desktop,
  `sm:inline-flex`) y el ícono compacto (`sm:hidden`).
- Se mantienen, siempre condicionados a `hasPanelSession`:
  - el ítem **Administrar** del menú desplegable de la cuenta (desktop);
  - el botón **Administrar** del drawer móvil (en móvil el menú de la
    cuenta vive ahí).

Verificado en el navegador: la fila muestra solo Cuenta/perfil, Favoritos y
Carrito; sin errores en consola. `tsc --noEmit` y `eslint` sin errores.

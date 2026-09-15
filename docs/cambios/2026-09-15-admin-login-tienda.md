# Login del admin desde “Mi cuenta” + Administrar en la barra

- **Fecha:** 2026-09-15
- **Solicitud:** El admin inicia sesión en el mismo modal de “Mi cuenta” que cualquier usuario. Quitar **Comparar** de la barra para los usuarios. Si entra un admin, mostrar un ícono de casa **Administrar**.
- **Archivos:** `components/AuthProvider.tsx`, `components/AuthForm.tsx`, `components/Navbar.tsx`, `components/admin/AdminShell.tsx`, `app/admin/login/page.tsx`, `app/admin/(panel)/layout.tsx`
- **Commit:** (pendiente)

## Qué había antes

El staff entraba por `/admin/login` (formulario aparte). En la barra de la tienda todos veían **Comparar**. El admin de la tienda (primera cuenta del navegador) veía “Editar contenido” en el menú de cuenta, no un acceso visible tipo casa.

## Código nuevo

- `AuthProvider.login()`: si no hay cuenta de tienda, prueba `loginAdminAction()` (THE WINTER / panel). Deja sesión de tienda `role: "admin"` + cookie del panel.
- Navbar: se quitó Comparar (desktop, móvil y drawer). Con sesión del panel aparece **Administrar** (`House`) entre Cuenta y Favoritos.
- `/admin` y `/admin/login` sin cookie redirigen a `/login` (abre el modal de Mi cuenta).

## Recomendación

- Comparar sigue existiendo en las tarjetas de producto y en `/comparar`; solo salió de la barra.
- Las cuentas de tienda (clientes) no ven Administrar.
- Si una sesión vieja del panel quedó en cookie, Administrar puede aparecer al recargar; Cerrar sesión limpia ambas.

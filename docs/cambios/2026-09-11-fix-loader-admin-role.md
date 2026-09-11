# Fix: doble loader del logo (reduced-motion) y rol de admin

- **Fecha:** 2026-09-11
- **Solicitud:** aplicar el bug 1 y el rol de admin (bug 2) de la nota previa; **no** tocar el precio del carrito (bug 3) hasta confirmarlo, porque cambia el formato ya guardado en el navegador
- **Archivos:** `components/IntroSplash.tsx`, `lib/auth-local.ts`, `components/AuthProvider.tsx`, `app/admin/page.tsx`, `components/Navbar.tsx`, `tests/smoke.test.ts`
- **Commit:** (se registra al subir)
- **Hallazgos:** [`2026-09-11-bugs-admin-loader-carrito.md`](./2026-09-11-bugs-admin-loader-carrito.md)

## Qué había antes

El clic en el logo (`data-site-intro`) no reclamaba la navegación, así que con
`prefers-reduced-motion` el intro `brand` se saltaba y luego `pathname` disparaba
un `BrandLoader` de 2.5 s. `/admin` solo pedía estar logueado: cualquier cuenta
registrada entraba.

## Código anterior

```tsx
if (link.matches("[data-site-intro]")) {
  play("brand");
  return;
}
// admin: if (!user) { pantalla de login }
```

## Código nuevo

```tsx
if (link.matches("[data-site-intro]")) {
  if (play("brand")) loadClaimedByClick.current = true;
  return;
}

// StoredAccount / AuthUser.role: "customer" | "admin"
// primera cuenta del navegador → admin; las siguientes → customer
if (!isAdminUser(user)) { /* Sin permiso de admin */ }
```

Cuentas viejas sin `role` se migran al leer `chamo-accounts-v1`: la primera pasa a
admin y el resto a customer. El enlace **Editar contenido** del Navbar solo se
muestra a admin.

## Recomendación

- El **bug 3** (guardar `unitPrice` en el carrito) sigue pendiente de confirmación:
  hay que migrar o reinterpretar líneas ya guardadas en `chamo-cart-v1`.
- Cuando haya backend, `role` debe venir del servidor; hoy es local a este navegador.

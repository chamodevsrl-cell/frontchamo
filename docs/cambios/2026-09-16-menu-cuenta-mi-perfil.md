# Menú de cuenta: "Mi perfil" y "Mi carrito" para el cliente

- **Fecha:** 2026-09-16
- **Solicitud:** El usuario mandó una captura de otro panel (dropdown "Acosta" con
  Mi perfil / Mi empresa / Mis pedidos / SystemRSV / Cerrar sesión) y pidió que en
  Chamo el cliente vea, en ese mismo menú, solo sus propias opciones: perfil y
  carrito guardado (sin nada de admin).
- **Archivos:** `components/Navbar.tsx`, `app/perfil/page.tsx` (nuevo).
- **Commit:** (pendiente)

## Qué había antes

El dropdown de "Mi cuenta" en el Navbar solo mostraba el correo, el enlace
**Administrar** (si había sesión del panel) y **Cerrar sesión**. No existía
ninguna página de perfil ni acceso directo al carrito desde ese menú — el
carrito solo se veía por el ícono aparte de la barra.

## Código nuevo

`Navbar.tsx`: se agregaron dos enlaces al dropdown, siempre visibles para
cualquier cuenta logueada, antes de "Administrar":

```tsx
<Link href="/perfil">
  <UserCircle .../> Mi perfil
</Link>
<Link href="/carrito">
  <ShoppingCart .../> Mi carrito
  {count > 0 ? <span>{count}</span> : null}
</Link>
{hasPanelSession ? <Link href="/admin">Administrar</Link> : null}
```

`app/perfil/page.tsx` (nuevo): página con avatar (inicial del nombre), nombre,
correo, badge de rol (`Cliente` / `Administrador`), accesos a **Mi carrito** y
**Mis favoritos** con conteo, enlace a **Ir al panel de administración** (solo
si `hasPanelSession`) y **Cerrar sesión**. Si no hay sesión, muestra un aviso
para iniciar sesión.

## Verificación

- `npm run lint` y `npm run build` en verde (`/perfil` sale como ruta estática).
- Probado en vivo con dos cuentas: la primera cuenta del navegador (rol
  `admin`, ve Administrar) y una segunda cuenta nueva (rol `customer`, badge
  **Cliente**, sin Administrar ni acceso al panel) — confirmado en desktop y
  móvil (375px).

## Recomendación

- El perfil hoy es de solo lectura (nombre/correo vienen de la cuenta local).
  Si el cliente pide poder editarlos, `AuthProvider` necesita una función
  `updateProfile()` nueva — no existe todavía.
- Mismo patrón que el resto del front: cuentas y roles siguen en
  `chamo-accounts-v1` (este navegador) hasta que haya backend real.

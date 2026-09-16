# Área de cuenta (perfil + empresa) para cliente y usuario

- **Fecha:** 2026-09-16
- **Solicitud:** Llevar el área de cuenta de referencia (banner "Mi cuenta", pestañas
  Resumen/Pedidos/Cotizaciones/Favoritos/Reseñas/Perfil/Empresa, foto, teléfono,
  autenticador y Mi empresa) tanto al **cliente** de la tienda como al **usuario**
  del panel.
- **Archivos:** `app/perfil/page.tsx`, `app/perfil/layout.tsx`,
  `components/account/*`, `components/AuthProvider.tsx`, `lib/auth-local.ts`,
  `lib/account-profile.ts`, `components/Navbar.tsx`,
  `components/admin/AdminShell.tsx`, `components/QuoteForm.tsx`, `app/globals.css`
- **Commit:** (pendiente)

## Qué había antes

`/perfil` era una ficha de solo lectura (inicial, nombre, correo, badge de rol y
accesos a carrito/favoritos). No se podía editar nada. El dropdown de "Mi cuenta"
tenía perfil y carrito; el menú del panel no enlazaba al perfil de la tienda.

## Código nuevo

Misma pantalla para `role: "customer"` y `role: "admin"` / sesión del panel:

- Banner **Área cliente** o **Área usuario**, saludo por apellido, botones
  Administrar / Mi empresa / Mi perfil.
- Pestañas: Resumen, Mis pedidos, Cotizaciones, Favoritos, Mis reseñas, Mi perfil,
  Mi empresa (`/perfil?tab=`).
- Perfil editable: foto (JPG/PNG/WebP ≤ 2.5 MB o avatar de marca), nombre, teléfono,
  correo de solo lectura, enlace a empresa, autenticador (flag local).
- Empresa: razón social, RUC (11 dígitos), ciudad, dirección.
- Persistencia en `chamo-profiles-v1` (ambos tipos de cuenta) + nombre en
  `chamo-accounts-v1` si hay cuenta de tienda. `/cotizar` rellena los campos.

## Recomendación

- Pedidos y reseñas son estados vacíos a propósito: no hay backend de despachos
  ni valoraciones todavía.
- El autenticador no genera códigos TOTP; solo marca "vinculado" en este
  navegador hasta conectar el backend.

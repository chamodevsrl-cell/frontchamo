# Ejecutar sugerencias pendientes (login, comparar, admin, collages)

- **Fecha:** 2026-09-10
- **Solicitud:** seguir al pie de la letra `docs/SUGERENCIAS.md` y el README de cambios, y ejecutar los ítems abiertos
- **Archivos:** `components/AuthProvider.tsx`, `components/AuthForm.tsx`, `components/CompareProvider.tsx`, `components/CompareButton.tsx`, `components/ContentProvider.tsx`, `app/comparar/`, `app/admin/`, `components/CategoryCollage.tsx`, `data/products.ts`, `lib/auth-local.ts`, `lib/cms.ts`, Navbar/Footer/HeroSlider/PageBanner
- **Commit:** (se registra al subir)

## Qué había antes

Los ítems abiertos de `SUGERENCIAS.md` eran: login/registro stub, comparar visual, CMS/admin, specs de ejemplo incompletas, JPEG de categoría sin collage de marcas/productos, y varios bloqueados por el cliente (correo oficial, ficha de `/nosotros`, testimonios reales, logos oficiales, ERP).

## Código anterior

```tsx
setMessage(
  mode === "login"
    ? "Formulario listo. Conectaremos el inicio de sesión más adelante."
    : "Registro listo. Conectaremos la cuenta más adelante.",
);
// El botón de comparar solo hacía stopPropagation.
```

## Código nuevo

- **Cuentas locales** (`chamo-accounts-v1` + sesión `chamo-session-v1`): registro, login, reset de contraseña y logout. Hash SHA-256 con salt. El Navbar muestra el nombre y cierra sesión.
- **Comparar** (`chamo-compare-v1`, máximo 3): botón real en tarjeta y modal, badge en Navbar, página `/comparar` con tabla de precios/ficha y WhatsApp.
- **Admin liviano** `/admin` (requiere cuenta): edita banners y categorías; persiste en `chamo-cms-v1` y se ve en el slider/menú de este navegador.
- **Specs de ejemplo:** `fillExampleSpecs` completa origen, material/dimensiones, peso y garantía en cada SKU (sigue siendo ficha de ejemplo).
- **Collages:** `CategoryCollage` arma una grilla 2×2 con fotos y marcas de los productos de esa línea (home, `/categorias` y banner de detalle).

## Qué no se tocó (bloqueado por el cliente)

- Correo oficial (sigue `ventas@chamoimport.com` provisional).
- Textos de `/nosotros` y testimonios reales.
- Logos oficiales de marca (siguen wordmarks SVG).
- Inventario/ERP real.

## Recomendación

- El admin y las cuentas son **por navegador**, no un backend. Cuando haya API, migrar `chamo-accounts-v1` y `chamo-cms-v1`.
- Sustituir collages Unsplash por fotos de tienda cuando el cliente las envíe.

# MANUAL.md: guía completa para conectar el backend (tienda + panel)

- **Fecha:** 2026-09-21
- **Solicitud:** El usuario pidió actualizar el manual para que documente cómo
  conectar el backend con el front en la documentación técnica.
- **Archivos:** `docs/MANUAL.md`
- **Commit:** (pendiente)

## Qué había antes

La única guía de "conectar el backend" en `MANUAL.md` era **A.12.6**, y cubría
**solo el panel admin** (`services/adminApi.ts` → `API_CONTRACT.md`). No había
nada documentado sobre cómo conectar el resto del sitio: catálogo público,
cuentas de cliente, carrito/favoritos/comparar, ni — el punto más importante —
el **CMS que usa el panel** (banners, categorías, footer, canales, equipo),
que hoy vive en `localStorage` y por lo tanto **no es compartido entre
visitantes ni dispositivos**.

## Código nuevo (resumen)

Nueva sección **A.13 🔌 Conectar un backend real — tienda y panel**, después de
A.12.6, con:

- Una tabla "qué vive dónde hoy" (panel, catálogo, cuentas, carrito/favoritos/
  comparar, CMS, formularios de contacto/cotizar) con la ubicación exacta en
  código (`data/products.ts`, `AuthProvider.tsx` + `lib/auth-local.ts`,
  `CartProvider.tsx`, `FavoritesProvider.tsx`, `CompareProvider.tsx`,
  `ContentProvider.tsx` + `lib/cms.ts`) y el alcance actual de cada una.
- **A.13.1** Panel admin — remite a A.12.6 (no duplica).
- **A.13.2** Catálogo público — cómo reemplazar `app/api/productos/route.ts`
  (hoy lee `data/products.ts` con `searchCatalog()`).
- **A.13.3** Cuentas de la tienda — cómo reemplazar el auth 100% cliente de
  `lib/auth-local.ts` (contraseña hasheada en el navegador) por endpoints
  reales + cookie `httpOnly`.
- **A.13.4** Carrito/favoritos/comparar — por qué conviene dejarlos para
  después de tener cuentas reales, y el patrón sugerido (backend con sesión,
  `localStorage` de invitado sin sesión).
- **A.13.5** CMS del panel — la pieza señalada como más urgente: hoy un admin
  que edita `/admin/banners` (etc.) solo lo ve en su propio navegador.
- **A.13.6** Formularios de Contacto/Cotizar — opcional, solo si se retoma la
  idea (descartada antes) de guardar cotizaciones/contactos.
- **A.13.7** Orden recomendado para abordar todo lo anterior.

## Recomendación

- El hallazgo más importante para el negocio es **A.13.5**: como el CMS del
  panel no tiene backend, cualquier demo que el cliente haga editando
  `/admin/banners` o `/admin/categorias` **no se replica** a otros navegadores
  — vale la pena que lo sepan antes de que alguien piense que ya está
  "guardado para todos".
- Si se empieza a conectar backend de verdad, seguir el orden de A.13.7 (panel
  → CMS → catálogo → cuentas → carrito → contacto) en vez de intentarlo todo
  junto.

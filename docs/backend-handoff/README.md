# Handoff de Backend — Chamo Import

Punto de entrada único para el desarrollador que va a conectar el backend
real. Esta carpeta **no repite** contenido de los contratos — los indexa y
te dice en qué orden leerlos y qué archivo de código mirar por cada pieza.

## Empieza aquí (en este orden)

1. **[MAPA-CONEXION.md](./MAPA-CONEXION.md)** — la tabla maestra: qué pieza
   del sitio, dónde vive hoy en el código, qué endpoint la reemplaza, en qué
   contrato está el detalle exacto (body/respuesta/errores) y en qué orden
   conviene implementarla. Si solo vas a leer **un** archivo antes de
   empezar a codear, que sea este.
2. **[`FRONTEND_DOCUMENTATION.md`](../../FRONTEND_DOCUMENTATION.md)** (raíz del
   repo) — la foto técnica completa: stack, qué componente usa qué variable,
   los dos sistemas de datos que no hay que confundir (tienda vs. panel).
   Léelo si el mapa de conexión no te alcanza para entender el "por qué" de
   una pieza.
3. Los dos contratos HTTP, **con el detalle exacto** de cada endpoint (body,
   respuesta JSON de ejemplo, códigos de error):
   - **[`API_CONTRACT.md`](../../API_CONTRACT.md)** — panel admin
     (`/admin/*`): productos, categorías, pedidos, usuarios/roles, KPIs.
   - **[`API_CONTRACT_TIENDA.md`](../../API_CONTRACT_TIENDA.md)** — tienda
     pública: CMS del sitio, catálogo, cuentas de cliente, carrito/favoritos/
     comparar, y una nota sobre cómo migrar las imágenes (hoy base64).
4. **[`docs/MANUAL.md`](../MANUAL.md) §A.13** — si necesitas la explicación
   en prosa de por qué el orden recomendado es ese, o el detalle línea por
   línea de una pieza puntual (por ejemplo A.13.5 para el CMS).

## Novedades para el backend (2026-09-23)

Lo que cambió en el front y te afecta al conectar:

1. **`GET /api/v1/auth/session` ya es obligatorio para la tienda.** Al cargar
   cualquier página, `AuthProvider` llama a `verifyAdminSessionAction()`
   (`app/admin/actions.ts`) y solo muestra **Administrar** (en el menú del
   perfil) si responde `200`. Con `401` borra la sesión local del panel.
   Mock: `verifyAdminSession(token)` en `services/adminApi.ts` (usuario
   existe, activo y con rol). Contrato: `API_CONTRACT.md` → Auth.
2. **`site-content` suma la clave `brands`** (marcas del carrusel "Marcas
   distribuidoras", editables en `/admin/marcas`, permiso `marcas`). Array
   ordenado `{ id, name, src, hidden? }`; `src` puede ser data URL base64
   hasta que exista `POST /api/v1/uploads`. Contrato:
   `API_CONTRACT_TIENDA.md` §1. Si no hay fila guardada, devolver
   `emptyCmsState` (trae las 10 marcas de fábrica).
3. Solo UI (sin impacto en endpoints): Pedidos y Productos del panel se ven
   como cards en móvil; "Administrar" salió de la barra del Navbar; el
   carrusel de marcas también aparece en `/ofertas`.

Detalle de cada cambio: `docs/cambios/2026-09-23-*.md`.

## Cómo está marcado en el código

Cada punto exacto donde hoy hay un mock o `localStorage` que hay que
reemplazar tiene un comentario:

```
// TODO Backend: Reemplazar con fetch('/api/v1/...') — ver API_CONTRACT[_TIENDA].md §N.
```

Para encontrarlos todos:

```bash
grep -rn "TODO Backend" --include="*.ts" --include="*.tsx" .
```

Al día de hoy hay marcadores en (entre otros): `services/adminApi.ts`,
`app/admin/actions.ts`, `components/ContentProvider.tsx`,
`components/CartProvider.tsx`, `components/FavoritesProvider.tsx`,
`components/CompareProvider.tsx`, `components/AuthProvider.tsx`,
`app/api/productos/route.ts`, `data/products.ts`, `lib/cms-image.ts`,
`lib/auth-local.ts`.

## Dos sistemas de sesión — no confundir

El sitio tiene **dos** logins independientes hoy (se documentó así a
propósito, ver `CLAUDE.md` §10 — unificarlos queda para cuando exista un
solo backend de usuarios):

| | Sesión de la **tienda** (clientes) | Sesión del **panel** (staff) |
| --- | --- | --- |
| Cookie / storage | `chamo-session-v1` (`localStorage`) | `chamo_admin_session` (cookie) |
| Contrato | `API_CONTRACT_TIENDA.md` §3 | `API_CONTRACT.md` (Auth) |
| Rutas que protege | `/cuenta/*` | `/admin/*` |

## Orden recomendado (resumen — detalle en el mapa de conexión)

1. **Panel admin** — ya tiene contrato completo y es el más autocontenido.
2. **CMS del sitio** — lo más urgente si el cliente va a operar el sitio: hoy
   un admin que edita `/admin/banners` solo lo ve en su propio navegador.
3. **Catálogo público**
4. **Cuentas de cliente**
5. **Carrito / favoritos / comparar**
6. **Imágenes reales** (subida a bucket) — antes de que el catálogo tenga
   fotos de producto reales, no antes de arrancar el resto.

## Qué NO es responsabilidad del front (decisiones tuyas)

- Proveedor de storage para imágenes (S3, Cloudinary, etc.).
- Base de datos y dónde se hostea el backend.
- Estrategia exacta de tokens/expiración de sesión (el contrato asume cookie
  `httpOnly`, el resto es tu criterio).

## Qué sigue siendo placeholder (dato de negocio, no de código)

Correo de contacto oficial, textos de `/nosotros`, testimonios y fichas
técnicas por SKU reales — no bloquean empezar el backend, pero conviene
saber que el contenido de ejemplo no es definitivo. Lista completa:
`CLAUDE.md` §10.

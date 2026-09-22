# Simplificar animaciones de transición: un solo loader, solo en admin/perfil

- **Fecha:** 2026-09-21
- **Solicitud:** El usuario pidió que la pantalla de carga solo se muestre en los
  momentos designados (entrar al sitio, recargar la página, entrar o salir del
  panel admin, entrar o salir del perfil) — nada más — y que se quite cualquier
  otra animación que no sea esa, mencionando explícitamente la del carrito.
- **Archivos:** `components/IntroSplash.tsx`, `components/AuthProvider.tsx`,
  `components/Navbar.tsx`, `components/Footer.tsx`, `app/globals.css`,
  `CLAUDE.md`, `docs/MANUAL.md`
- **Commit:** (pendiente)

## Qué había antes

`IntroSplash.tsx` tenía **tres** variantes de animación (`brand` | `cart` | `load`):

1. **`load`** (`BrandLoader`, la pantalla azul con logo/engranaje/"CARGANDO...") —
   la única que el usuario quería conservar, al cruzar hacia/desde `/admin` o
   `/cuenta/perfil`.
2. **`brand`** — puertas azules + engranaje Lucide, se disparaba al hacer clic en
   el **logo** (`data-site-intro` en `Navbar.tsx` y `Footer.tsx`).
3. **`cart`** — las mismas puertas pero con un ícono de carrito dorado que
   "entraba y se estacionaba detrás de la costura", al navegar a **`/carrito`**
   (`data-cart-intro` en los links del carrito del `Navbar.tsx`).

Además, `AuthProvider.tsx` disparaba el loader `load` en **cada login/logout**
(cualquier cuenta, incluso sin cambiar de ruta) vía un evento propio
(`AUTH_TRANSITION_EVENT`) — otro disparador no pedido por el usuario en esta
ronda.

Todo esto tenía su propio bloque de CSS en `app/globals.css` (`.intro-splash`,
`.intro-panel*`, `.intro-gear*`, `.intro-cart*` y los `@keyframes` de puertas,
engranaje y carrito) — ~330 líneas que ya no se usan.

## Código nuevo (resumen)

**`IntroSplash.tsx`** — reescrito de punta a punta: ya no tiene variantes ni
`variant`/`cycle` state, ni el ref de "quién reclamó la navegación" para cada
tipo. Solo queda `visible` + `BrandLoader`, disparado por `isLoadBoundary(from, to)`
(sin cambios en esa función: compara `/admin` y `/cuenta/perfil`) desde un click
handler (respuesta inmediata) o el efecto sobre `usePathname()` (respaldo). Ya
no escucha `AUTH_TRANSITION_EVENT`.

**`AuthProvider.tsx`** — se quitó el `useRef` de `authTransitionState`, el efecto
que comparaba `user` antes/después y disparaba el evento, y el export
`AUTH_TRANSITION_EVENT` (sin otro consumidor).

**`Navbar.tsx` / `Footer.tsx`** — se quitaron los atributos `data-site-intro` y
`data-cart-intro` (ya inertes, nada los lee).

**`app/globals.css`** — se borró todo el bloque `.intro-splash*`/`.intro-panel*`/
`.intro-gear*`/`.intro-cart*` y sus `@keyframes` (puertas, engranaje del splash,
carrito). Se mantiene `.intro-playing` (el scroll-lock, todavía lo usa
`IntroSplash`/`Preloader`) y las entradas de `.intro-panel-left`/`.intro-gear`/
etc. dentro del bloque `@media (prefers-reduced-motion: reduce)` también se
quitaron (ya no hay selector que las necesite).

## Verificado

- `npm run lint`, `npx tsc --noEmit` y `npm test` (30/30) sin errores.
- En el navegador: recargar la página muestra el loader (sin cambios); clic en
  el logo y navegar a `/carrito` ya **no** muestran ninguna animación (transición
  instantánea); navegar entre páginas del panel admin (p. ej. Dashboard →
  Categorías) tampoco muestra nada (no es una frontera); iniciar sesión ya no
  dispara el loader; **entrar o salir de `/admin` sigue mostrando `BrandLoader`**
  correctamente.

## Recomendación

- Si en el futuro se quiere una transición distinta para alguna otra sección,
  extender `isLoadBoundary()` en `IntroSplash.tsx` (misma función que ya decide
  admin/perfil) en vez de reintroducir variantes nuevas — el componente quedó
  deliberadamente simple.

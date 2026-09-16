# Animación de entrada: solo en transiciones clave, no en cada navegación

- **Fecha:** 2026-09-16
- **Solicitud:** la animación de entrada (la misma de recargar la página) solo debía
  verse al recargar el navegador, al hacer clic en el logo, al entrar/salir del panel
  admin, al entrar/salir de editar el perfil (`/cuenta/perfil`) y al iniciar/cerrar
  sesión — no en cada navegación interna (catálogo, categorías, ofertas, `/cuenta`,
  `/cuenta/empresa`, etc.).
- **Archivos:** `components/IntroSplash.tsx`, `components/AuthProvider.tsx`

## Qué había antes

`IntroSplash.tsx` reproducía el loader `BrandLoader` ("CARGANDO...") en **cualquier**
clic a un link interno, salvo que el origen o destino fuera `/admin` (esas
transiciones no mostraban nada, ni siquiera al entrar o salir del panel). Iniciar o
cerrar sesión tampoco disparaba nada porque no cambian de ruta.

## Código anterior

```tsx
function isInternalPageLink(link: HTMLAnchorElement) {
  // ...
  if (url.pathname.startsWith("/admin") || window.location.pathname.startsWith("/admin")) {
    return false; // admin quedaba excluido por completo
  }
  return true;
}
// en el click handler: cualquier otro link interno → play("load")
```

## Código nuevo

`isLoadBoundary(from, to)` decide si el loader debe verse: solo cuando se **cruza**
la frontera de `/admin` (entrar o salir) o de `/cuenta/perfil` exacto (entrar o
salir) — navegar dentro del panel o entre otras páginas de la tienda ya no dispara
nada:

```tsx
function isLoadBoundary(from: string, to: string) {
  if (isAdminPath(from) !== isAdminPath(to)) return true;
  if (isProfilePath(from) !== isProfilePath(to)) return true;
  return false;
}
```

Para login/logout se agregó un evento propio: `AuthProvider.tsx` expone
`AUTH_TRANSITION_EVENT` y dispara `window.dispatchEvent(...)` cada vez que `user`
pasa de `null` a una cuenta o viceversa (comparando contra la hidratación inicial,
para no disparar nada en un simple refresh). `IntroSplash.tsx` escucha ese evento y
llama `play("load")`. Cubre login/registro/recuperar contraseña y cerrar sesión,
tanto desde el modal de la tienda como desde "Cerrar sesión" del panel — sin
importar si además hay o no cambio de ruta.

El clic en el logo (variante "brand", puertas) y la entrada a `/carrito` (variante
"cart") no cambiaron — siguen siendo sus propios disparadores, ya documentados.

## Verificación

Probado en vivo: navegar Catálogo → Inicio → Ofertas no muestra nada; entrar a
`/admin` sí; moverse entre Dashboard → Productos dentro del panel no muestra nada;
salir con "Ver el sitio" sí; "Cerrar sesión" (tienda y panel) sí. `npm run lint`,
`npm run build` y `npm test` (28/28) en verde.

## Recomendación

- Si más adelante se agrega otra sección "grande" (ej. checkout multi-paso), sumarla
  a `isLoadBoundary` en vez de reabrir el disparo genérico por cada link.

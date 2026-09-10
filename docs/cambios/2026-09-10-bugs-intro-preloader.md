# Bugs en la intro del carrito y el preloader (revisión de Claude Code)

- **Fecha:** 2026-09-10
- **Solicitud:** "Busca nuevos errores y cosas a mejorar" — el usuario mandó una captura de la intro del carrito mostrando la línea dorada atravesando el ícono, y describió que la animación se repite dos veces y pidió mejor soporte al recargar.
- **Archivos:** `components/IntroSplash.tsx`, `app/globals.css`, `components/Preloader.tsx`
- **Commit:** (pendiente al momento de escribir esta nota)

## Método

Esta rama (`cursor/sugerencias-docs-1bc3`) no estaba en el `npm run dev` que ya tenía
levantado esta sesión (ese servía `main`). Se creó un **worktree** aparte
(`git worktree add`), se instalaron dependencias (`framer-motion` no estaba en el
`node_modules` copiado) y se levantó un servidor propio en el puerto 3055 para probar
exactamente este código. Los hallazgos se confirmaron con JavaScript ejecutado en la
página real (`MutationObserver` para contar cuántas veces se monta `.intro-splash`,
lectura de `app/globals.css` para las keyframes) — no solo lectura de código.

## Hallazgos

### 1. La intro del carrito se dispara dos veces para la misma navegación

**Problema (confirmado con medición exacta):** hay **dos** disparadores independientes
para la intro `cart` en `IntroSplash.tsx`:

```tsx
// 1) en el click handler (captura), si el link va a /carrito
if ((link.matches("[data-cart-intro]") || isSameOriginPath(link.href, "/carrito")) &&
    window.location.pathname !== "/carrito") {
  play("cart");
}

// 2) en un efecto separado que observa el pathname
useEffect(() => {
  if (pathname === lastPath.current) return;
  lastPath.current = pathname;
  if (pathname === "/carrito") play("cart");
}, [pathname, play]);
```

El único freno es un debounce de 450ms (`if (now - lastPlay.current < 450) return;`).
Si la navegación real a `/carrito` tarda más que eso (típico en `dev` con Turbopack
compilando la ruta la primera vez), **ambos disparadores terminan llamando `play("cart")`**
y la intro se reinicia de cero justo después de terminar.

Se reprodujo con un `MutationObserver` contando montajes de `.intro-splash--cart` tras
un clic real en el ícono del carrito del Navbar:

```json
{
  "mounts": [
    { "t": 44110.0 },
    { "t": 46304.8 }
  ]
}
```

Dos montajes, **2194.8 ms** (~2.2s) de diferencia — muy por encima del debounce de
450ms — la intro completa (puertas + carrito, ~3.35s) se reproduce, y justo cuando
está terminando, vuelve a arrancar. Esto coincide exactamente con lo descrito: "la
animación se repite dos veces, debería ser solo una vez".

**Solución propuesta:** que el `onClick` "reclame" la navegación para que el efecto de
`pathname` no la repita:

```tsx
const cartClaimedByClick = useRef(false);

// en el onClick, antes de play("cart"):
cartClaimedByClick.current = true;

// en el efecto de pathname:
useEffect(() => {
  if (pathname === lastPath.current) return;
  lastPath.current = pathname;
  if (pathname === "/carrito") {
    if (cartClaimedByClick.current) {
      cartClaimedByClick.current = false;
      return; // ya se disparó por el clic, no repetir
    }
    play("cart"); // fallback: back/forward, URL directa, etc.
  } else {
    cartClaimedByClick.current = false;
  }
}, [pathname, play]);
```

### 2. La línea dorada de la puerta atraviesa el ícono del carrito al frenar en el centro

**Problema (confirmado con la matemática del CSS, y con la captura que mandó el
usuario):** las dos puertas (`.intro-panel-left`/`.intro-panel-right`) miden
`width: 50.2%` cada una, con un `box-shadow` dorado exactamente en el borde donde se
juntan (offset `±5px`/`±8px` desde `left:0`/`right:0` respectivamente) — esa es la
"costura" dorada entre las dos puertas, centrada en `x = 50%` del viewport.

El carrito (`.intro-cart`, `top:50%; left:50%`) usa `intro-cart-path`, cuyo tramo
"frenado" (24%–70% del tiempo total) lo deja exactamente en
`transform: translate(-50%, -50%)` — es decir, **centrado en el mismo `x = 50%`** donde
está la costura dorada. Mientras tanto, las puertas siguen cerradas hasta el 70%
(`intro-door-left-cart`/`intro-door-right-cart`: `translateX(0)` de 16% a 70%). Resultado:
durante ese tramo, la línea dorada de la costura y el centro del ícono del carrito
coinciden en la misma coordenada X — la línea "atraviesa" el ícono en vez de quedar a un
lado, tal como se ve en la captura.

**Solución propuesta:** separar el punto de reposo del carrito de la costura exacta, por
ejemplo desplazándolo unos `rem` a un lado durante el tramo "frenado":

```css
@keyframes intro-cart-path {
  /* ... */
  24% {
    /* antes: translate(-50%, -50%) */
    transform: translate(calc(-50% - 2.5rem), -50%);
    animation-timing-function: linear;
  }
  70% {
    transform: translate(calc(-50% - 2.5rem), -50%);
    animation-timing-function: cubic-bezier(0.55, 0, 0.45, 1);
  }
  /* ... */
}
```

(Ajustar el `18%`/`100%` de entrada/salida para que el recorrido siga viéndose fluido.)
Alternativa más simple: subir el `z-index` del `.intro-cart` (ya es `2`, por encima de
los paneles que no tienen `z-index` explícito) y darle un halo/fondo propio detrás del
ícono (`filter: drop-shadow` ya existe, pero no tapa una línea que pasa detrás) — la
opción de desplazar el punto de reposo es más limpia porque evita el cruce en vez de
disimularlo.

### 3. La barra de progreso del `Preloader` es decorativa, no sigue la carga real

**Problema:** `Preloader.tsx` muestra la pantalla por un tiempo fijo
(`HOLD_MS = 2500`) sin relación con si la página ya terminó de cargar. En una conexión
lenta o con assets pesados, el preloader puede ocultarse **antes** de que el sitio esté
listo, dejando ver el layout a medio cargar justo después. Esto conecta con lo que pidió
el usuario: "la animación al cargar la web... mejor apoyo para renovar [recargar]".

**Solución propuesta:** usar el evento real de carga como señal, con el timer fijo solo
como mínimo/tope de seguridad:

```tsx
useLayoutEffect(() => {
  if (reducedMotion) { setVisible(false); return; }
  document.documentElement.classList.add("intro-playing");

  const minTimer = window.setTimeout(() => setReadyMin(true), 1200); // mínimo visible
  const onLoad = () => setPageLoaded(true);
  if (document.readyState === "complete") setPageLoaded(true);
  else window.addEventListener("load", onLoad, { once: true });

  const maxTimer = window.setTimeout(() => setVisible(false), 6000); // tope de seguridad

  return () => { clearTimeout(minTimer); clearTimeout(maxTimer); window.removeEventListener("load", onLoad); };
}, []);

useEffect(() => {
  if (readyMin && pageLoaded) setVisible(false);
}, [readyMin, pageLoaded]);
```

## Recomendación

- Los 3 fixes son acotados (1–2 archivos cada uno) y no chocan entre sí — se pueden
  aplicar en cualquier orden.
- Antes de aplicar el fix del bug 1, confirmar en `dev` con Turbopack (donde el retraso
  de compilación de `/carrito` es más notorio) que ya no se repite.
- Este archivo vive en esta rama (`cursor/sugerencias-docs-1bc3`) porque `IntroSplash`/
  `Preloader` no existen todavía en `main` — al mergear, esta nota y las líneas nuevas
  de `SUGERENCIAS.md` deberían ir con el resto del PR.

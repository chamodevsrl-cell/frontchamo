# Panel admin: botón "Ver sitio" visible + reloj en el header

- **Fecha:** 2026-09-21
- **Solicitud:** El usuario pidió que, al lado o debajo de donde aparece el perfil del
  usuario al entrar al panel, salga la opción de "ver web" para ir viendo los cambios,
  y que además se muestre la hora y fecha.
- **Archivos:** `components/admin/AdminShell.tsx`
- **Commit:** (pendiente)

## Qué había antes

"Ver el sitio" solo existía **dentro del menú desplegable** de la cuenta (había que
abrir el menú de la cuenta para verlo) y navegaba en la misma pestaña, sin
`target="_blank"` — o sea, salía del panel para ver la web. No había reloj/fecha en
ningún lugar del header.

## Código anterior

```tsx
<Link
  href="/"
  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-gray"
>
  <Store className="h-4 w-4 text-brand-primary" />
  Ver el sitio
</Link>
```

## Código nuevo

En el header, junto al ícono de notificaciones y al botón de la cuenta (siempre
visible, sin abrir ningún menú):

```tsx
{clockLabel ? (
  <span className="hidden shrink-0 text-xs font-medium text-brand-dark/60 md:block">
    {clockLabel}
  </span>
) : null}

<a
  href="/"
  target="_blank"
  rel="noopener noreferrer"
  title="Ver el sitio web en una pestaña nueva"
  className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-gray sm:px-3"
>
  <Store className="h-5 w-5 text-brand-primary" strokeWidth={2} />
  <span className="hidden sm:inline">Ver sitio</span>
</a>
```

`clockLabel` sale de `useSyncExternalStore` (no de `useState` + `useEffect` como
en la primera versión de este cambio — ver **Corrección** abajo) y se formatea con
`toLocaleString("es-PE", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })`
→ ej. `Lun, 21 set., 11:18 a. m.`.

Se quitó el enlace duplicado "Ver el sitio" del menú desplegable de la cuenta (ya no
hace falta, queda solo el del header).

## Corrección (mismo día): `useState`/`useEffect` → `useSyncExternalStore`

La primera versión de `clockLabel` usaba:

```tsx
const [now, setNow] = useState<Date | null>(null);
useEffect(() => {
  setNow(new Date());
  const id = setInterval(() => setNow(new Date()), 30_000);
  return () => clearInterval(id);
}, []);
```

`npm run lint` marcó esto como `react-hooks/set-state-in-effect` (setState
síncrono dentro de un efecto). Al reescribirlo con `useSyncExternalStore` con un
primer intento ingenuo —`getClockSnapshot` devolviendo `Date.now()` en caliente—
la app quedó en **bucle infinito** ("Maximum update depth exceeded") apenas se
abría `/admin`, porque `useSyncExternalStore` compara el snapshot entre renders y
`Date.now()` cambia en cada llamada. La versión final cachea el valor en una
variable de módulo y solo lo actualiza al suscribirse y en cada tick:

```tsx
let cachedClockMs = Date.now();

function subscribeToClock(onStoreChange: () => void) {
  cachedClockMs = Date.now();
  onStoreChange();
  const id = setInterval(() => {
    cachedClockMs = Date.now();
    onStoreChange();
  }, 30_000);
  return () => clearInterval(id);
}
function getClockSnapshot() {
  return cachedClockMs;
}
function getServerClockSnapshot() {
  return null;
}
```

`getServerClockSnapshot` devuelve `null` para que el SSR y la primera pasada de
hidratación coincidan sin reloj (evita el warning de hidratación); recién
después el cliente se suscribe y lo muestra. Verificado: `npm run lint` y
`npx tsc --noEmit` sin errores, sin errores en consola del navegador, y el
reloj se ve y actualiza correctamente en `/admin`.

## Recomendación

- El botón abre en pestaña nueva (`target="_blank"`) justamente para que el admin
  pueda dejar el panel abierto en una pestaña y la web en otra mientras revisa
  cambios, en vez de perder su lugar en el panel.
- En móvil el reloj se oculta (`md:block`) y "Ver sitio" queda solo con el ícono
  (`hidden sm:inline` en el texto) para no saturar el header angosto.
- Si más adelante se agrega una zona horaria distinta a Lima (`es-PE` asume la
  hora del navegador del usuario), revisar si conviene fijar `America/Lima` con
  `timeZone` en las opciones de `toLocaleString`.

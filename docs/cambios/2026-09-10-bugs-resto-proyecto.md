# Bugs y mejoras en el resto del proyecto (tercera pasada)

> Escrita en `main` antes de que existiera esta rama de features. De los 4 hallazgos
> aquí, favoritos/comparar quedaron resueltos por el trabajo normal de la rama (ahora
> son reales, con persistencia); `/login`, el boletín y el cursor se cerraron al
> mergear (2026-09-11) — ver
> [`2026-09-11-merge-ready-fixes.md`](./2026-09-11-merge-ready-fixes.md).

- **Fecha:** 2026-09-10
- **Solicitud:** "Busca ahora en el proyecto nuevos bugs o mejoras a hacer."
- **Archivos revisados:** `app/login/page.tsx`, `components/Footer.tsx`, `components/FeaturedOffers.tsx`, `components/WrenchCursor.tsx`, `components/HeroSlider.tsx`, `app/ofertas/page.tsx`, `app/nosotros/page.tsx`, `next.config.ts` — el resto del proyecto que no se había revisado a fondo en las dos auditorías anteriores del mismo día.
- **Commit:** (pendiente al momento de escribir esta nota)

## Método

Con el sitio corriendo (mismo servidor en :3000), se navegó en vivo y se midió/confirmó
cada hallazgo en el DOM real. Se descartó explícitamente un falso positivo (ver abajo)
para no inflar la lista con una prueba mal hecha.

## Hallazgos

### 5. `/login` nunca vuelve a la página anterior

**Problema:** el comentario en `app/login/page.tsx` dice *"/login abre el modal global y
vuelve a la home (o página previa)"*, pero el código:

```tsx
useEffect(() => {
  openAuth("login");
  router.replace("/");
}, [openAuth, router]);
```

siempre hace `router.replace("/")`. Confirmado navegando en vivo: estando en
`http://localhost:3000/contacto` y yendo a `/login`, terminó en `/` — nunca volvió a
`/contacto`. Impacto bajo (la ruta casi no se usa, porque "Mi cuenta" abre el modal sin
navegar), pero el comentario no describe el comportamiento real.

**Solución:** implementar el "volver atrás" de verdad (`document.referrer` del mismo
origen, o un query param `?from=/contacto` que arme el link a `/login`), o simplificar
el comentario para que diga solo "vuelve a la home".

### 6. Boletín del footer sin mensaje de éxito/error

**Problema:** `handleNewsletter` en `Footer.tsx`:

```tsx
function handleNewsletter(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setEmail("");
}
```

No hay ningún elemento de mensaje en el JSX del formulario del boletín — a diferencia de
`AuthForm.tsx`, que sí tiene un `<p role="status">{message}</p>` para confirmar acciones.
El usuario no tiene ninguna señal de si el envío funcionó.

**Solución:** replicar el patrón `role="status"` de `AuthForm.tsx` con un mensaje de
confirmación simple.

### 7. Favoritos/Comparar sin feedback visual

**Problema:** en `FeaturedOffers.tsx`, los botones de favoritos (`Heart`) y comparar
(`GitCompareArrows`) sobre cada tarjeta de producto solo hacen
`onClick={(event) => event.stopPropagation()}` — no cambian de estado, no rellenan el
ícono, no hacen nada visible.

**Solución:** agregar un `useState<boolean>` local por tarjeta (o un `Set<string>` de
ids en el componente padre) que alterne `fill="currentColor"` en el ícono al hacer clic,
como paso intermedio antes de conectar persistencia real.

### 8. El cursor personalizado no distingue campos de texto

**Problema:** `WrenchCursor.tsx` marca como "interactivo" (mismo ícono de llave, solo
rotado/agrandado) cualquier elemento que matchee
`"a, button, input, textarea, select, label, [role='button']"`. Como el cursor nativo
está oculto globalmente (`cursor: none !important` en `app/globals.css`, con
`@media (hover: hover) and (pointer: fine)`), al pasar el mouse sobre el buscador, el
campo de correo del boletín o los inputs de login, el usuario ve una llave inglesa en
vez del cursor de texto (I-beam) que indica "aquí se puede escribir". El clic para
escribir sigue funcionando bien — es solo una afordancia visual perdida.

**Solución:** distinguir un tercer estado de cursor para
`input, textarea, [contenteditable]` (por ejemplo una barra vertical delgada) en lugar
de tratarlos igual que un botón/link.

### Descartado — falso positivo por prueba mal hecha

Se intentó verificar si el boletín del footer limpia el campo de correo tras enviarlo,
simulando un envío con `input.value = "..."` + `dispatchEvent(new Event("input"))` +
`form.requestSubmit()`. El campo **no** apareció vacío después. Se descartó como
hallazgo real: fijar `.value` directamente sobre un input controlado por React no pasa
por el setter nativo que React parchea, así que `onChange` puede no dispararse — es un
problema conocido de cómo se simuló el evento, no necesariamente del código del sitio.
El punto real y confirmado (por lectura de código) es la falta de mensaje de
confirmación (hallazgo 6 arriba), no si el campo se vacía o no.

## Recomendación

- Los hallazgos 6 y 7 son cambios pequeños y de bajo riesgo — buenos candidatos para un
  "sprint de pulido" junto con los bugs 1–3 ya documentados el mismo día.
- El hallazgo 8 (cursor) es más una decisión de diseño que un bug; vale la pena
  confirmarla con el dueño del negocio antes de invertir tiempo, dado que es un detalle
  fino que no rompe funcionalidad.
- Ver el resto de bugs y recomendaciones acumuladas en
  [`SUGERENCIAS.md`](../SUGERENCIAS.md#-evaluación-ux--ui-y-funcional-2026-09-10).

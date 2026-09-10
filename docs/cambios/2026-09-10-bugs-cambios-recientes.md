# Bugs en los cambios recientes (Navbar, CategoriesGrid, ProductModal)

- **Fecha:** 2026-09-10
- **Solicitud:** "Lee los nuevos cambios y busca error o bugs y agrégalo a problemas y una solución."
- **Archivos revisados:** `components/Navbar.tsx`, `components/CategoriesGrid.tsx`, `components/ProductModal.tsx` (los tres componentes tocados en los últimos commits: indicador dorado del nav, carrusel de categorías con flechas, ficha técnica + relacionados del modal)
- **Commit:** (pendiente al momento de escribir esta nota)

## Método

Con el sitio corriendo (`npm run dev`, mismo servidor que ya tenía levantado la sesión
de Cursor en el puerto 3000), se verificó cada sospecha con JavaScript ejecutado en la
página real — no solo lectura de código:

- Se midió `offsetLeft`/`offsetWidth` del link activo contra el `left`/`width` inline
  de la barra dorada del Navbar, antes y después de `document.fonts.ready`, para
  descartar una condición de carrera con la fuente `next/font` (Barlow Semi Condensed).
  **Resultado: no hay bug ahí** — Next.js genera un fallback con métricas ajustadas
  (`"Barlow Semi Condensed Fallback"`) que evita el desajuste; `width` del link y de la
  barra coincidieron exactamente (76px = 76px). Se descarta este hallazgo.
- Se abrió el modal de "Taladro percutor..." vía `.click()`, se bajó el scroll interno
  hasta el fondo, se hizo clic en el primer producto relacionado, y se comparó
  `scrollTop` antes/después.
- Se midió el `gap` real (`getComputedStyle`) del carrusel de categorías en desktop
  contra el valor que usa `scrollByCard` en el código.

## Hallazgos

### Bug 1 — el modal no vuelve arriba al cambiar de producto relacionado

**Problema:** en `ProductModal.tsx`, el `useEffect` que depende de `product.id` resetea
`activeImage` y `qty` pero no el scroll del contenedor `overflow-y-auto`.

Evidencia (medido en vivo):

```json
{
  "before": { "scrollTop": 714, "title": "Taladro percutor 1/2\" 750W industrial" },
  "after":  { "scrollTop": 714, "title": "Amoladora angular 4 1/2\" 850W" }
}
```

El título cambia (el producto sí cambió) pero `scrollTop` es idéntico: el usuario se
queda viendo la ficha técnica/relacionados del producto nuevo sin ver su imagen, precio
ni el botón de WhatsApp — como si el clic no hubiera hecho nada visible.

**Solución propuesta:**

```tsx
const scrollRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  setActiveImage(0);
  setQty(1);
  scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
}, [product.id]);

// ...
<div ref={scrollRef} className="flex-1 overflow-y-auto">
```

### Bug 2 — el paso de las flechas de categorías no coincide con el gap real

**Problema:** `scrollByCard` en `CategoriesGrid.tsx` usa `card.getBoundingClientRect().width + 16` (gap fijo). El gap real cambia por breakpoint (`gap-3`/`sm:gap-4`/`lg:gap-5` = 12/16/20px). Medido en desktop: `gap` real = 20px, no 16px.

**Solución propuesta:**

```tsx
function scrollByCard(direction: -1 | 1) {
  const el = scrollerRef.current;
  if (!el) return;
  const card = el.querySelector("li");
  const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "16");
  const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
  el.scrollBy({ left: direction * step, behavior: "smooth" });
}
```

### Descartado — no era un bug

Se investigó si el indicador dorado animado del Navbar podía desalinearse por una
condición de carrera entre el primer render (fuente de reserva) y la carga de
`Barlow Semi Condensed` vía `next/font`. Se confirmó que **no** ocurre: Next.js genera
automáticamente una fuente de reserva con métricas ajustadas para este caso exacto, y
la medición en vivo mostró `width` idéntico en el link y en la barra.

## Recomendación

- Aplicar los dos fixes de arriba (son cambios pequeños y acotados a un archivo cada uno).
- Ver también los bugs 1–4 documentados el mismo día en
  [`SUGERENCIAS.md`](../SUGERENCIAS.md#-evaluación-ux--ui-y-funcional-2026-09-10)
  (logos rotos, rutas 404) — ese archivo ahora trae "Problema" + "Solución" para cada uno.

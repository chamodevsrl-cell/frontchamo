# Auditoría UX/UI y funcional (con el sitio corriendo)

- **Fecha:** 2026-09-10
- **Solicitud:** "Documenta todos los cambios y nuevas sugerencias, evalúa el UX/UI y también si las funciones que están cumplen para el usuario; por otro lado, recomendaciones en nuevas cosas que agregar."
- **Archivos:** `docs/SUGERENCIAS.md` (resultados), ninguno de código (auditoría de solo lectura)
- **Commit:** (pendiente al momento de escribir esta nota)

## Método

Se levantó el sitio real (`npm run dev`, Next.js 16 + Turbopack) en el Browser pane, en
desktop (1440px y ancho de pane) y móvil (375px), navegando el home completo. Los
hallazgos de "no funciona" se verificaron a nivel DOM/red (no solo apariencia visual):

- Red: `read_network_requests` confirmó los 404 reales de `public/images/marcas/*.png`.
- DOM: se contaron `<img>` vs `<span>` de fallback dentro de la sección de marcas.
- Rutas: `fetch()` a `/catalogo`, `/categorias`, `/carrito`, `/favoritos` → los 4 devuelven 404.
- Interacción: se disparó `.click()` sobre una tarjeta de producto y se leyó el DOM del modal resultante (specs, relacionados, `href` de WhatsApp) para confirmar que sí funciona correctamente.

## Hallazgos

### 1. Bug — fallback de logos rotos no se activa

`components/BrandsCarousel.tsx` (función `BrandCard`) usa:

```tsx
const [failed, setFailed] = useState(false);
// ...
{!failed ? (
  <img src={src} alt={name} onError={() => setFailed(true)} ... />
) : (
  <span>{name}</span>
)}
```

Con los 10 logos ausentes en `public/images/marcas/`, se esperaría ver el `<span>` de
texto. En la práctica:

```json
{ "imgCount": 20, "fallbackSpanCount": 0 }
```

Los 20 `<img>` (10 marcas × 2 por el loop del marquee) siguen en el DOM con
`naturalWidth: 0` (carga fallida) pero **ninguno** cambió a texto. El usuario ve el
ícono nativo de "imagen rota" del navegador junto al nombre de la marca — se nota en el
home, justo debajo del slider.

**Recomendación:** revisar si el evento `error` realmente dispara sobre el `<img>` en
Turbopack dev (a veces un 404 servido por el dev server no dispara `onError` igual que
un 404 de producción) y, si el problema persiste, forzar el fallback también por
`onLoad`/timeout o usar `next/image` con `unoptimized` + manejo de error explícito.

### 2. Rutas rotas confirmadas (no solo "podrían dar 404")

```json
[
  {"path":"/categorias","status":404},
  {"path":"/carrito","status":404},
  {"path":"/favoritos","status":404},
  {"path":"/catalogo","status":404}
]
```

Los 4 están enlazados desde puntos muy visibles: nav principal (Catálogo), "Ver todas"
de categorías, ícono de carrito (con badge "0"), ícono de favoritos (corazón).

### 3. Funciones decorativas (UI sin lógica detrás)

- `Navbar.tsx` → `handleSearch`: solo `event.preventDefault()`, no filtra ni navega.
- `FeaturedOffers.tsx` → botón "Añadir al carrito": sin `onClick`.
- `ProductModal.tsx` → botón "Agregar a cotización": sin `onClick`.
- `AuthForm.tsx`: honesto en su propio mensaje ("Conectaremos el inicio de sesión más
  adelante") — no autentica ni persiste nada todavía.
- Favoritos (corazón): sin estado, no persiste ni cuenta.

### 4. Lo que sí funciona bien (verificado)

- Navbar: dropdown de categorías, hover de solo-texto + barra dorada animada en el ítem activo.
- `CategoriesGrid`: carrusel con flechas prev/next funcionales.
- `ProductModal`: al hacer clic en un producto, el modal abre con specs técnicas,
  relacionados de la misma categoría, y el link de WhatsApp ya sale con el número oficial
  y el mensaje prellenado correcto:
  `https://wa.me/51959723602?text=...Taladro%20percutor...%20(TRU-7821)%20x1`.

## Recomendación

Ver la lista completa y priorizada en
[`docs/SUGERENCIAS.md`](../SUGERENCIAS.md#-evaluación-ux--ui-y-funcional-2026-09-10)
(sección "Evaluación UX/UI y funcional" + "Recomendaciones de cosas nuevas a agregar").
Los dos hallazgos de esta nota (bug de fallback + 4 rutas 404) son los de mayor impacto
inmediato en la experiencia porque están en la primera pantalla que ve cualquier
visitante.

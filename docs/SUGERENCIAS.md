# Sugerencias para el proyecto

Última actualización: **2026-09-10**

Lista viva de mejoras. Al completar una, márcala como hecha y añade fecha. Al surgir una idea en un cambio, anótala aquí.

## 🔎 Evaluación UX / UI y funcional (2026-09-10)

Revisión con el sitio corriendo (`npm run dev`), en desktop y móvil (375px), más lectura
de código. Ampliada con una segunda pasada centrada en los cambios recientes de Navbar,
CategoriesGrid y ProductModal, verificando cada bug con clics/mediciones reales en el
DOM (no solo lectura). Detalle completo en las notas de auditoría:
[`cambios/2026-09-10-auditoria-ux-funcional.md`](./cambios/2026-09-10-auditoria-ux-funcional.md) y
[`cambios/2026-09-10-bugs-cambios-recientes.md`](./cambios/2026-09-10-bugs-cambios-recientes.md).

**Lo que funciona bien:**
- Navbar de 3 niveles con jerarquía clara; hover e ítem activo con indicador dorado animado — se siente pulido.
- Hero slider full-bleed, carrusel de categorías con flechas y carrusel de productos: buena experiencia táctil y de mouse.
- Modal de producto (ficha técnica + relacionados + WhatsApp con número oficial y mensaje prellenado) es el punto más sólido del sitio hoy — ayuda de verdad a decidir una compra mayorista.
- CTA de WhatsApp muy visible, coherente con cómo se vende en Perú (B2B por chat).

**Bugs confirmados (no solo sospecha — verificados en runtime), con solución propuesta:**

- [ ] **1. Fallback de logos rotos no funciona.**
  - **Problema:** en `components/BrandsCarousel.tsx`, cuando la imagen de marca falla (los 10 archivos de `public/images/marcas/` no existen → 404), el `onError` **no** reemplaza el `<img>` por el texto de respaldo: los 20 `<img>` (marcas × 2, por el loop del marquee) siguen en el DOM con `naturalWidth: 0` y **cero** `<span>` de fallback renderizados (verificado contando nodos en el DOM). El usuario ve el ícono nativo de "imagen rota" del navegador junto al nombre, justo debajo del slider — mala primera impresión.
  - **Solución:** además de subir los logos reales, blindar el fallback: usar `onError={(e) => { e.currentTarget.style.display = "none"; setFailed(true); }}` para ocultar el `<img>` roto de inmediato (no depender solo del re-render condicional), o migrar a `next/image` con `onError` + `unoptimized` para rutas locales. Verificar además que no haya una carga en caché (`complete: true`, `naturalWidth: 0`) que impida que el evento `error` vuelva a dispararse en un remount.

- [ ] **2. El modal de producto no vuelve arriba al cambiar de "relacionado".**
  - **Problema (confirmado con clic real):** en `components/ProductModal.tsx`, si el usuario baja hasta "Productos relacionados" y hace clic en uno, el `useEffect` que depende de `product.id` sí resetea `activeImage` y `qty`, pero **no** resetea el scroll del contenedor (`div.overflow-y-auto`). Probado en vivo: `scrollTop` quedó en `714` antes y después de cambiar de "Taladro percutor" a "Amoladora angular" — el título cambió pero la vista se queda abajo, mostrando la ficha técnica del producto nuevo sin su imagen, precio ni botón de WhatsApp, como si el clic no hubiera hecho nada.
  - **Solución:** agregar un `ref` al contenedor `overflow-y-auto` y, en el mismo `useEffect` que resetea `activeImage`/`qty` (dependencia `[product.id]`), llamar `scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })`.

- [ ] **3. Las flechas del carrusel de categorías avanzan un poco menos de lo real.**
  - **Problema (confirmado midiendo el DOM):** `scrollByCard` en `components/CategoriesGrid.tsx` calcula el paso como `card.getBoundingClientRect().width + 16` — un gap fijo de 16px. El gap real varía por breakpoint (`gap-3`=12px en móvil, `sm:gap-4`=16px, `lg:gap-5`=20px); en desktop medí 20px de gap real contra los 16px asumidos. El `snap-mandatory` disimula el error re-alineando la tarjeta, pero el scroll da un salto/corrección visible en vez de un desplazamiento limpio de una tarjeta exacta.
  - **Solución:** leer el gap real en vez de un número fijo: `const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "16"); const step = card.getBoundingClientRect().width + gap;`.

- [ ] **4. 4 rutas enlazadas devuelven 404 real.**
  - **Problema:** confirmado con `fetch()` (no solo "podría"): `/catalogo` (nav principal), `/categorias` ("Ver todas" en categorías), `/carrito` (ícono con badge), `/favoritos` (ícono con corazón). Son 4 de los puntos de navegación más visibles del sitio.
  - **Solución:** ver plan en "Recomendaciones de cosas nuevas a agregar" abajo (catálogo real, carrito/favoritos con `localStorage`, página `/categorias`) — mientras se construyen, considerar ocultar o deshabilitar visualmente el enlace en vez de dejarlo romperse.

**Funciones que existen visualmente pero no cumplen su función (decorativas):**
- [ ] El **buscador** (desktop y móvil) no busca nada: `handleSearch` en `Navbar.tsx` solo hace `preventDefault()`. El usuario escribe, da enter, y no pasa nada — sin resultados, sin mensaje de "no hay resultados". Para un catálogo mayorista esto es una promesa incumplida grande.
- [ ] **"Añadir al carrito"** (`FeaturedOffers.tsx`) y **"Agregar a cotización"** (`ProductModal.tsx`) no tienen `onClick`: no hacen nada. El ícono de carrito en el navbar siempre muestra "0" fijo, reforzando que no hay carrito real todavía.
- [ ] **Login / registro** (`AuthForm.tsx`) es honesto sobre ser un stub — el propio mensaje dice "Conectaremos el inicio de sesión más adelante" — pero vale la pena que el negocio sepa que hoy **no autentica a nadie** ni guarda nada.
- [ ] Favoritos (ícono corazón, botones en tarjetas) no persiste ni cuenta nada — es visual únicamente.

## 💡 Recomendaciones de cosas nuevas a agregar

- [ ] **Carrito real** (aunque sea local con `localStorage` mientras no hay backend): contador que sume de verdad, mini-carrito o página `/carrito` funcional. Es el hueco más grande entre "lo que promete la UI" y "lo que hace".
- [ ] **Búsqueda real** aunque sea client-side contra `data/products.ts` al inicio (filtrar por nombre/marca/SKU) — no hace falta backend para dar ya valor.
- [ ] **Página de catálogo completo** (`/catalogo`) con filtros por categoría/marca/precio — hoy solo existen 8 productos "destacados" en el home, no hay forma de ver el catálogo completo.
- [ ] **Estado vacío / mensaje de error** cuando una búsqueda o filtro no encuentra nada (hoy no existe ningún patrón de "no encontramos resultados").
- [ ] **WhatsApp prellenado por categoría** en las tarjetas de `CategoriesGrid` (hoy el botón "Explorar" solo navega a una ruta que da 404) — mientras no exista `/categorias`, que "Explorar" abra WhatsApp con el nombre de la categoría, igual que ya hace el modal de producto.
- [ ] **Reseñas / testimonios** de clientes mayoristas (distribuidores) — ayuda a la confianza B2B, hoy no hay ninguna prueba social en el sitio.
- [ ] **Indicador de "guardado"/confirmación** cuando se usa favoritos o se cambia cantidad en el modal (hoy el corazón se puede clickear pero no da ningún feedback de que pasó algo).
- [ ] **Breadcrumbs** en páginas internas (`/nosotros`, `/contacto`, futura `/categorias/[slug]`) para orientar en un catálogo con muchas categorías.

## Prioridad alta

- [ ] Reemplazar imágenes Unsplash de categorías por fotos propias en `public/images/categorias/`
- [ ] Completar logos reales en `public/images/marcas/` (hoy 404 — y además el fallback de texto no se ve, ver bug arriba)
- [ ] Renombrar banners del slider sin espacios (`baner-1.png`) para evitar encoding
- [ ] Páginas que hoy dan 404 real: `/categorias` (y detalle por categoría), `/carrito`, `/favoritos`, `/catalogo` — el CTA "Explorar" / "Ver todas" / nav principal ya apuntan ahí

## Producto / UX

- [ ] Unificar lista de categorías del **Navbar** con `mainCategories` (una sola fuente)
- [ ] Filtros y búsqueda real contra catálogo / API (ver recomendaciones arriba)
- [ ] Cotización mayorista con formulario + WhatsApp prellenado por producto
- [ ] Modo oscuro: revisar contraste en tarjetas pastel de categorías
- [ ] Sumar más productos por categoría en `data/products.ts` (hoy "Seguridad" tiene solo 1 → el modal no muestra "Productos relacionados" para ese ítem)

## Técnico

- [ ] Conectar backend / API de productos (dejar de hardcodear `data/products.ts`)
- [ ] Completar specs técnicas reales por SKU (material, voltaje, dimensiones, país de origen, etc.) cuando el cliente envíe fichas oficiales — hoy son de ejemplo
- [ ] CMS o admin liviano para banners y categorías
- [ ] `allowedDevOrigins` en `next.config` si se prueba por IP LAN (`192.168.x.x`)
- [ ] Tests básicos de smoke (home carga, slider tiene N slides, rutas del nav responden 200)

## Contenido

- [ ] Reemplazar el teléfono placeholder `+51 999 999 999` por el oficial `+51 959 723 602` en `WhatsAppFloat.tsx`, `Footer.tsx`, `app/cotizar/page.tsx` y `app/contacto/page.tsx` (`ProductModal.tsx` ya está correcto, usarlo de referencia)
- [ ] Confirmar correo de contacto oficial (footer y `/contacto` usan `ventas@chamoimport.com` como provisional)
- [ ] Políticas (términos, privacidad) enlazadas desde el footer

## Hecho recientemente (referencia)

- [x] 2026-09-08 — Slider full-bleed y sin recorte
- [x] 2026-09-08 — Marcas debajo del slider
- [x] 2026-09-08 — Categorías layout Explorar + glow
- [x] 2026-09-08 — Categorías en carrusel horizontal (patrón FeaturedOffers)
- [x] 2026-09-08 — Carrusel de categorías también en PC con flechas circulares
- [x] 2026-09-08 — Modal de producto con ficha técnica + relacionados por categoría
- [x] 2026-09-08 — 7 categorías en home (se añadieron 3)
- [x] 2026-09-08 — Navbar: hover solo en texto + barra dorada animada bajo el ítem activo
- [x] 2026-09-08 — Auditoría de docs: sincronizar CLAUDE.md/MANUAL.md con el código real (carrusel, modal, navbar)
- [x] 2026-09-10 — Auditoría UX/UI y funcional con el sitio corriendo (bugs confirmados + recomendaciones nuevas)

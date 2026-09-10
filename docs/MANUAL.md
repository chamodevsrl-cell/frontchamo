# Documentación técnica y manual de usuario — Chamo Import Front

Última actualización: **2026-09-10**

Este documento junta las dos caras del proyecto: cómo está construido (para quien
programa) y cómo se usa hoy (para negocio/operación). Se actualiza junto con cada
cambio visible o estructural — ver el flujo en [`docs/README.md`](./README.md).

---

## Parte A — Documentación técnica

### A.1 Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (tokens en `app/globals.css`, sin `tailwind.config`)
- Lucide React (iconografía)
- Fuentes: Barlow / Barlow Semi Condensed (`app/layout.tsx`)

### A.2 Marca (tokens)

| Token | Hex | Uso |
| --- | --- | --- |
| `brand-dark` | `#0B3554` | Tipografía, barra superior, footer |
| `brand-primary` | `#127EC9` | CTAs, bordes brillantes, acentos |
| `brand-gold` | `#E4B714` | Badges Oferta/Nuevo, detalles |
| `brand-gray` | `#F4F4F4` | Fondos suaves |
| — (`#25D366`, sin token aún) | Verde WhatsApp | Burbuja flotante (`WhatsAppFloat.tsx`) |

### A.3 Estructura relevante

```
app/page.tsx              # Home: orden de secciones
components/
  Navbar.tsx              # Header 3 niveles
  HeroSlider.tsx           # Banners full-bleed, imagen completa
  BrandsCarousel.tsx       # Marcas debajo del slider
  TrustInfoBar.tsx
  CategoriesGrid.tsx       # Tarjetas Explorar + glow
  FeaturedOffers.tsx       # Productos destacados
  ProductModal.tsx
  Footer.tsx
  WhatsAppFloat.tsx
  WrenchCursor.tsx
  AuthProvider.tsx / AuthModal.tsx / AuthForm.tsx
data/
  media.ts                 # Slides / logo / icon
  home.ts                   # trustItems, mainCategories, distributorBrands
  products.ts                # Ofertas destacadas
docs/                       # Documentación viva (este set de 3 secciones)
public/images/slider/       # baner 1–3.png
```

### A.4 Home — orden actual

1. `Navbar`
2. `HeroSlider`
3. `BrandsCarousel`
4. `TrustInfoBar`
5. `main` → `CategoriesGrid` + `FeaturedOffers`

### A.5 Categorías (`data/home.ts` → `mainCategories`)

Cada ítem: `href`, `label`, `eyebrow`, `bullets` (3), `image`, `imageAlt`, `tint`.

**Actual (7):** Ferretería, Electricidad, Seguridad, Hogar, Herramientas, Construcción, Pinturas.

UI en `CategoriesGrid.tsx`: **carrusel horizontal en todos los breakpoints**
(`snap-x` + scroll). En PC/móvil hay **flechas circulares** (arriba a la derecha)
que desplazan una tarjeta; también se puede deslizar. Borde brillante de marca.

### A.6 Productos y modal (`data/products.ts` → `ProductModal.tsx`)

Cada producto incluye `category` / `categoryLabel`, `specs[]` (ficha técnica) y
`packaging`. Helper `getRelatedProducts(product)` filtra por la misma categoría.

Modal (diseño ficha):
1. Galería + thumbs  
2. Marca / SKU / OFF, descripción, caja de precios, stock, cantidad, CTAs  
3. Tabla **Especificaciones técnicas**: cabecera `brand-dark` con columnas
   “Especificación / Detalle”, filas blancas / `#eef6fc`, esquinas redondeadas + borde brillante  
4. **Productos relacionados de la misma categoría** (clic cambia el producto del modal)

WhatsApp del modal: `wa.me/51959723602`.

### A.7 Slider

- Rutas en `data/media.ts`; archivos en `public/images/slider/`.
- `fullBleed: true` evita overlay de texto sobre el arte (el banner ya trae texto).
- Imagen `w-full h-auto object-contain` (sin recorte), puntos + swipe táctil, sin flechas.

### A.8 Datos oficiales de contacto

- Razón social: Chamo Import S.R.L.
- Teléfono / WhatsApp oficial: **+51 959 723 602**
- Ubicación: Lima, Perú — https://maps.app.goo.gl/mrh3WueTJErXS2sg6
- ⚠️ Pendiente: `WhatsAppFloat.tsx`, `Footer.tsx`, `app/cotizar/page.tsx` y
  `app/contacto/page.tsx` todavía usan el placeholder `+51 999 999 999`;
  `ProductModal.tsx` es el único que ya usa el número oficial — usarlo de referencia
  al corregir el resto.

### A.9 Navbar — interacción del menú principal

`components/Navbar.tsx`, barra `brand-primary` (nivel 3): el link activo y el hover
solo cambian el **color del texto a `brand-gold`** (sin bloque de fondo); el activo
además lleva una barra dorada animada debajo, calculada con `offsetLeft`/`offsetWidth`
del link marcado `data-nav-active="true"` (estado `navIndicator`, se recalcula al
cambiar `pathname`). Si se agregan ítems a `mainLinks`, el indicador los sigue solo.

### A.10 Estado funcional confirmado (auditoría 2026-09-10)

Verificado con el sitio corriendo (no solo lectura de código) — detalle completo en
[`cambios/2026-09-10-auditoria-ux-funcional.md`](./cambios/2026-09-10-auditoria-ux-funcional.md):

- **Rutas 404 reales:** `/catalogo`, `/categorias`, `/carrito`, `/favoritos` (confirmado con `fetch`).
- **Bug:** `BrandsCarousel.tsx` — el fallback de texto (`onError` → `setFailed(true)`) no se activa aunque las 10 imágenes de `public/images/marcas/` fallan; los 20 `<img>` (marcas × 2 del loop) quedan en el DOM sin reemplazarse por el `<span>` de texto.
- **Bug:** `ProductModal.tsx` — al hacer clic en un "producto relacionado", el `useEffect` (dep. `product.id`) resetea `activeImage`/`qty` pero no el `scrollTop` del contenedor; el usuario se queda scrolleado abajo viendo la ficha técnica del producto nuevo sin ver su imagen/precio/WhatsApp. Confirmado midiendo `scrollTop` antes/después de un clic real (714 → 714). Solución y detalle en [`cambios/2026-09-10-bugs-cambios-recientes.md`](./cambios/2026-09-10-bugs-cambios-recientes.md).
- **Bug menor:** `CategoriesGrid.tsx` — `scrollByCard` asume un gap fijo de 16px; el gap real por breakpoint es 12/16/20px (`gap-3`/`sm:gap-4`/`lg:gap-5`), medido 20px en desktop. El `snap-mandatory` lo disimula pero el scroll da un salto en vez de avanzar una tarjeta exacta.
- **Sin lógica (solo UI):** `handleSearch` en `Navbar.tsx` (no filtra ni navega), botón "Añadir al carrito" en `FeaturedOffers.tsx` (sin `onClick`), botón "Agregar a cotización" en `ProductModal.tsx` (sin `onClick`), `AuthForm.tsx` (no autentica, lo dice su propio mensaje), favoritos (sin estado ni persistencia).
- **Confirmado funcionando:** dropdown de categorías, carrusel de categorías con flechas, `ProductModal` completo (specs + relacionados + WhatsApp con número y mensaje correctos), e indicador dorado animado del Navbar (se descartó una posible condición de carrera con la carga de la fuente — Next.js ya la compensa con un fallback de métricas ajustadas).

### A.11 Scripts

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

---

## Parte B — Manual de usuario (negocio / operación)

Describe **lo que se ve y se puede hacer hoy** en el sitio. Se actualiza cada vez que
cambia el comportamiento visible — incluso un cambio pequeño como reemplazar una imagen.

> ⚠️ **Importante para negocio/operación:** varias piezas de la interfaz todavía son
> visuales sin funcionar por dentro. Hoy **no funcionan de verdad**: el buscador (no
> filtra nada), "Añadir al carrito" y "Agregar a cotización" (no guardan nada, el carrito
> siempre marca "0"), favoritos (no persiste), e iniciar sesión / registrarse (no crea
> cuentas). Tampoco existen aún las páginas de Catálogo, Categorías, Carrito ni Favoritos
> (dan error 404 al hacer clic). Lo que **sí funciona** hoy de punta a punta es el flujo
> de WhatsApp: botón flotante, modal de producto y `/cotizar`. Detalle técnico en
> A.10, y el plan para cerrar estos huecos en
> [`SUGERENCIAS.md`](./SUGERENCIAS.md).

### B.1 Entrar al sitio

1. En desarrollo: `npm run dev` y abrir http://localhost:3000
2. En producción: URL pública del hosting (cuando esté desplegado)

### B.2 Inicio (home)

**Barra superior**
- Buscar productos, cuenta, favoritos y carrito
- Menú: Inicio, Catálogo, Ofertas, Nosotros, Contacto
- El ítem activo del menú azul se marca en **dorado** (`brand-gold`) con una
  **barra inferior** que se anima al cambiar de página
- **Categorías** (desplegable)

**Slider de anuncios**
- Banners de campaña (hoy: navideño, herramientas, envíos a la sierra)
- Cambia automáticamente cada unos segundos; también con swipe en móvil o los puntos
- El banner se ve completo (sin recortar) y de borde a borde

**Marcas distribuidoras**
- Carrusel justo debajo del slider, para marcas que se comercializan/auspician

**Beneficios**
- Franja con envíos, venta mayorista, pagos (Yape/Plin/tarjetas) y atención a distribuidores

**Categorías principales**
- 7 tarjetas con borde brillante azul: Ferretería, Electricidad, Seguridad, Hogar,
  Herramientas, Construcción, Pinturas
- **Carrusel en móvil y PC**: flechas circulares ← → arriba a la derecha; también
  se puede deslizar con el dedo o el trackpad
- Cada una: subtítulo, título, 3 beneficios, botón **Explorar** e imagen
- Enlace "Ver todas" → `/categorias` (página aún pendiente)

**Productos destacados / ofertas**
- Tarjetas con precio, stock y "Añadir al carrito"; clic abre el detalle (modal)
- En el modal: precios unitario/mayorista, cantidad, cotización / WhatsApp,
  **ficha técnica** (tabla) y **productos relacionados** de la misma categoría
  (al tocar uno se abre ese producto en el mismo modal)

**WhatsApp**
- Botón flotante verde para cotizar / contactar

**Pie de página**
- Enlaces, contacto, mapa, medios de pago, boletín

### B.3 Otras páginas

| Ruta | Uso |
| --- | --- |
| `/nosotros` | Información de la empresa |
| `/contacto` | Datos de contacto y Maps |
| `/ofertas` | Vista de ofertas (en evolución) |
| `/cotizar` | Cotización / WhatsApp |
| Login (modal / cuenta) | Iniciar sesión o registrarse |

### B.4 Contenido que el negocio puede cambiar sin programar

Hoy los textos e imágenes viven en archivos del proyecto (`data/` y `public/images/`).
Más adelante conviene un panel admin; por ahora:

- Banners → `public/images/slider/` + `data/media.ts`
- Categorías del home → `data/home.ts`
- Logos de marcas → `public/images/marcas/`
- Productos destacados → `data/products.ts`

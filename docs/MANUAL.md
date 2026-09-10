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
| `brand-whatsapp` | `#25D366` | Burbuja flotante y CTAs de WhatsApp |

### A.3 Estructura relevante

```
app/page.tsx              # Home: orden de secciones
app/categorias/           # Listado + detalle [slug]
app/catalogo/             # Búsqueda y filtros (API)
app/carrito/              # Cotización local
app/favoritos/            # Lista persistida (localStorage)
app/cotizar/              # Formulario + WhatsApp
app/api/productos/        # GET catálogo filtrable
app/terminos/ /privacidad/
components/
  Navbar.tsx              # Header 3 niveles (categorías = mainCategories)
  CartProvider.tsx        # Carrito en localStorage
  FavoritesProvider.tsx   # Favoritos en localStorage
  CatalogFilters.tsx      # Filtros de /catalogo
  CategoryBanner.tsx      # Detalle de categoría → PageBanner
  PageBanner.tsx          # Banner ancho (categorías, /nosotros, /contacto)
  StampHeading.tsx        # Encabezado sticker (catálogo, nosotros, ofertas, contacto)
  CategoryIcon.tsx        # Iconos Lucide por categoría
  Reveal.tsx              # Fade/slide al entrar en viewport
  IntroSplash.tsx         # Intro: puertas azules + engranaje
  ProductCard.tsx / ProductCatalog.tsx / ProductModal.tsx
  FavoriteButton.tsx / Testimonials.tsx / Breadcrumbs.tsx
  QuoteForm.tsx
  ContactForm.tsx           # /contacto → WhatsApp
data/
  contact.ts               # Teléfono, WhatsApp, correo, horario, Maps
  company.ts               # Historia / misión / visión (placeholder)
  testimonials.ts          # Prueba social B2B de ejemplo
  media.ts                 # Slides / logo / icon
  home.ts                   # trustItems, mainCategories, distributorBrands
  products.ts               # Catálogo de ejemplo + searchCatalog
public/images/slider/       # baner-1.png … baner-3.png
public/images/categorias/   # Fotos locales por categoría
public/images/marcas/       # Wordmarks SVG
```

### A.4 Home — orden actual

1. `Navbar`
2. `HeroSlider`
3. `BrandsCarousel`
4. `TrustInfoBar`
5. `main` → `CategoriesGrid` + `FeaturedOffers` + `Testimonials`

### A.5 Categorías (`data/home.ts` → `mainCategories`)

Cada ítem: `slug`, `href`, `label`, `bannerTitle`, `eyebrow`, `bullets` (3), `image` (local), `imageAlt`, `tint`. Opcional: `bannerImage` (fondo del detalle).

Fuente única también del dropdown **Categorías** del Navbar (cada línea lleva
icono Lucide: llave, rayo, escudo, casa, martillo, casco, cubeta).

**Actual (7):** Ferretería, Electricidad, Seguridad, Hogar, Herramientas, Construcción, Pinturas.

UI en `CategoriesGrid.tsx`: **carrusel horizontal en todos los breakpoints**
(`snap-x` + scroll). En PC/móvil hay **flechas circulares** (arriba a la derecha)
que desplazan una tarjeta; también se puede deslizar. En modo oscuro las tarjetas
usan fondo `#102a40` y texto claro para contraste.

Detalle `/categorias/[slug]`: banner ancho (`PageBanner` vía `CategoryBanner`) con la foto de la
línea, título centrado en mayúsculas (`bannerTitle`, p. ej. **ELÉCTRICOS**) y
chips de marcas de esa categoría. Los productos van debajo, a todo el ancho.

`/nosotros` reutiliza el mismo `PageBanner` con el encabezado sticker **SOBRE NOSOTROS**. Textos de
empresa (historia, misión, visión, valores) viven en `data/company.ts` y son
placeholder hasta ficha oficial del cliente.

### A.5b Animaciones de entrada

- Al cargar la web: `IntroSplash` — puertas azules se cierran, gira un engranaje Lucide
  (`Cog`) y se abren para mostrar el sitio (~2.7s en desktop, un poco menos en móvil).
- Al entrar a **`/nosotros`**: la misma pieza cubre un momento y se abre (~1.1–1.3s).
  El resto de secciones (Catálogo, Categorías, Contacto, etc.) **no** llevan overlay.
- Tamaños con `clamp`/`vmin` y `100dvh` para que el engranaje y las puertas entren en
  móvil y en landscape.
- Slider, banners de página, categorías, productos y el resto de bloques: `Reveal`
  (fade + slide-up al entrar en viewport).
- Si el usuario pide menos movimiento (`prefers-reduced-motion`), no hay animación.

### A.6 Productos y modal (`data/products.ts` → `ProductModal.tsx`)

Cada producto incluye `category` / `categoryLabel`, `specs[]` (ficha técnica) y
`packaging`. Helpers: `getRelatedProducts`, `searchCatalog`, `getProductsByCategory`.
Hay **al menos 3 productos por categoría** (22 SKUs de ejemplo).

El listado público pasa por `GET /api/productos?q=&category=&brand=`.
`CartProvider` guarda líneas `{ productId, qty }` en `localStorage` (`chamo-cart-v1`).
`FavoritesProvider` guarda IDs en `chamo-favorites-v1`; el corazón de la tarjeta y del
modal persiste, muestra el aviso fijo **Guardado en favoritos** y el Navbar lleva el contador.

Modal (diseño ficha):
1. Galería + thumbs  
2. Marca / SKU / OFF, descripción, caja de precios, stock, cantidad, CTAs  
3. Tabla **Especificaciones técnicas**: cabecera `brand-dark` con columnas
   “Especificación / Detalle”, filas blancas / `#eef6fc`, esquinas redondeadas + borde brillante  
4. **Productos relacionados de la misma categoría** (clic cambia el producto del modal)

WhatsApp unificado: `data/contact.ts` → `wa.me/51959723602`.

### A.7 Slider

- Rutas y tamaño en `data/media.ts`; archivos `public/images/slider/baner-1.png` … `baner-3.png`.
- El hero **solo** muestra esas fotos (sin recuadro de ejemplo “Imagen del anuncio”, sin overlay de título).
- Carrusel: puntos + swipe; el bloque entero hace fade-in con `Reveal` igual que el resto del sitio.

### A.8 Datos oficiales de contacto

Fuente: `data/contact.ts`.

- Razón social: Chamo Import S.R.L.
- Teléfono / WhatsApp oficial: **+51 959 723 602** (`wa.me/51959723602`) — ya sincronizado en float, footer, cotizar, contacto y modal
- Ubicación: Lima, Perú — https://maps.app.goo.gl/mrh3WueTJErXS2sg6
- Correo `ventas@chamoimport.com` sigue provisional

### A.9 Navbar — interacción del menú principal

`components/Navbar.tsx`, barra `brand-primary` (nivel 3): el link activo y el hover
solo cambian el **color del texto a `brand-gold`** (sin bloque de fondo); el activo
además lleva una barra dorada animada debajo, calculada con `offsetLeft`/`offsetWidth`
del link marcado `data-nav-active="true"` (estado `navIndicator`, se recalcula al
cambiar `pathname`). Si se agregan ítems a `mainLinks`, el indicador los sigue solo.

### A.10 Auditoría UX 2026-09-10 (origen y cierre)

La nota [`cambios/2026-09-10-auditoria-ux-funcional.md`](./cambios/2026-09-10-auditoria-ux-funcional.md)
se tomó contra **`main` antiguo** (antes de catálogo/carrito). En el código actual:

- **Cerrado:** `/catalogo`, `/categorias`, `/carrito` y `/favoritos` responden (ya no 404).
- **Cerrado:** buscador del Navbar → `/catalogo?q=`; carrito y cotización persisten; favoritos persisten con badge y confirmación.
- **Cerrado:** fallback de logos en `BrandsCarousel` también mira `load` + `naturalWidth === 0` (no solo `onError`). Los wordmarks SVG ya están en `public/images/marcas/`.
- **Sigue abierto:** `AuthForm` no autentica (lo dice el propio formulario). Comparar producto sigue siendo visual. Specs/CMS/ERP y logos oficiales dependen del cliente.

### A.11 Scripts

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
npm test         # Vitest smoke (slider, categorías, búsqueda)
```

---

## Parte B — Manual de usuario (negocio / operación)

Describe **lo que se ve y se puede hacer hoy** en el sitio. Se actualiza cada vez que
cambia el comportamiento visible — incluso un cambio pequeño como reemplazar una imagen.

> ⚠️ **Importante para negocio/operación:** el catálogo, las categorías, el carrito y
> los favoritos ya funcionan en el navegador (`localStorage`). El buscador lleva a
> `/catalogo`. WhatsApp sale prellenado por producto, carrito y **línea de categoría**.
> Todavía **no** hay login real (el formulario lo dice) ni inventario/ERP. Los
> testimonios del home son de ejemplo. Detalle en A.10 y
> [`SUGERENCIAS.md`](./SUGERENCIAS.md).

### B.1 Entrar al sitio

1. En desarrollo: `npm run dev` y abrir http://localhost:3000
2. En producción: URL pública del hosting (cuando esté desplegado)
3. Al entrar, dos paneles azules se cierran, gira un engranaje al centro y se abren
   para mostrar el sitio. Esa intro **no** se repite al ir a Catálogo, Categorías o
   Contacto. Sí se vuelve a ver al entrar a **Nosotros**. En el celular el engranaje
   se achica para que no se corte.

### B.2 Inicio (home)

**Barra superior**
- Buscar productos, cuenta, favoritos y carrito
- Menú: Inicio, Catálogo, Ofertas, Nosotros, Contacto
- El ítem activo del menú azul se marca en **dorado** (`brand-gold`) con una
  **barra inferior** que se anima al cambiar de página
- **Categorías** (desplegable)

**Slider de anuncios**
- Solo los banners reales (`baner-1.png` … `baner-3.png`); al recargar no aparece el recuadro azul de ejemplo
- Cambia automáticamente cada unos segundos; también con swipe en móvil o los puntos
- El banner se ve completo (sin recortar) y de borde a borde
- El slider y las secciones debajo (marcas, beneficios, categorías, ofertas, pie)
  **aparecen con fade-in** al cargar o al hacer scroll

**Marcas distribuidoras**
- Carrusel justo debajo del slider, para marcas que se comercializan/auspician
- Si un logo no carga, se muestra el nombre de la marca en texto

**Beneficios**
- Franja con envíos, venta mayorista, pagos (Yape/Plin/tarjetas) y atención a distribuidores

**Categorías principales**
- 7 tarjetas con borde brillante azul: Ferretería, Electricidad, Seguridad, Hogar,
  Herramientas, Construcción, Pinturas
- **Carrusel en móvil y PC**: flechas circulares ← → arriba a la derecha; también
  se puede deslizar con el dedo o el trackpad
- Cada una: icono Lucide, subtítulo, título, 3 beneficios, **Explorar**, **Cotizar línea** (WhatsApp) e imagen
- Enlace "Ver todas" → `/categorias` (listado) y **Explorar** → `/categorias/[slug]`

**Productos destacados / ofertas**
- **Carrusel de una sola fila** (igual que categorías): flechas circulares ← →
  arriba a la derecha en PC y móvil; también se puede deslizar
- Tarjetas con icono Lucide (oferta / destacado), precio, stock y "Añadir al carrito"; clic abre el detalle (modal)
- En el modal: precios unitario/mayorista, cantidad, cotización / WhatsApp,
  **ficha técnica** (tabla) y **productos relacionados** de la misma categoría
  (al tocar uno se abre ese producto en el mismo modal)

**WhatsApp**
- Botón flotante verde para cotizar / contactar (`+51 959 723 602`)
- En cada categoría: **Cotizar línea** abre WhatsApp con el nombre de esa línea

**Testimonios**
- Tres referencias de mayoristas de ejemplo (se reemplazan con casos reales del cliente)

**Pie de página**
- Enlaces, contacto, mapa, medios de pago, boletín, términos y privacidad

### B.3 Otras páginas

| Ruta | Uso |
| --- | --- |
| `/catalogo` | Encabezado sticker **NUESTRO CATÁLOGO**; búsqueda y filtros contra la API |
| `/categorias` | Todas las líneas; al elegir una, banner con el nombre centrado (p. ej. ELÉCTRICOS) y productos debajo |
| `/carrito` | Ítems guardados, cantidades, WhatsApp del pedido |
| `/favoritos` | Productos guardados (corazón); se mantienen en este navegador |
| `/nosotros` | Banner con sticker **SOBRE NOSOTROS**, historia, misión, visión y valores (textos de ejemplo) |
| `/contacto` | Banner **NUESTRO CONTACTO**, tarjetas de WhatsApp/teléfono/correo/horario, formulario que abre el chat, y mapa |
| `/ofertas` | Encabezado **OFERTAS DESCUENTOS** (azul + borde oro) y productos en oferta |
| `/cotizar` | Formulario mayorista + WhatsApp prellenado |
| `/terminos` / `/privacidad` | Políticas enlazadas desde el footer |
| Login (modal / cuenta) | Iniciar sesión o registrarse |

### B.4 Contenido que el negocio puede cambiar sin programar

Hoy los textos e imágenes viven en archivos del proyecto (`data/` y `public/images/`).
Más adelante conviene un panel admin; por ahora:

- Banners → `public/images/slider/` (`baner-1.png` …) + `data/media.ts`
- Categorías del home → `data/home.ts` + `public/images/categorias/`
- Logos de marcas → `public/images/marcas/`
- Productos → `data/products.ts` (la UI de `/catalogo` los pide a `/api/productos`)
- Teléfono / WhatsApp / correo → `data/contact.ts`
- Testimonios del home → `data/testimonials.ts` (hoy ejemplo)
- Historia, misión y visión de `/nosotros` → `data/company.ts` (hoy placeholder)

# Documentación técnica y manual de usuario — Chamo Import Front

Última actualización: **2026-09-08**

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

### A.6 Slider

- Rutas en `data/media.ts`; archivos en `public/images/slider/`.
- `fullBleed: true` evita overlay de texto sobre el arte (el banner ya trae texto).
- Imagen `w-full h-auto object-contain` (sin recorte), puntos + swipe táctil, sin flechas.

### A.7 Datos oficiales de contacto

- Razón social: Chamo Import S.R.L.
- Teléfono / WhatsApp oficial: **+51 959 723 602**
- Ubicación: Lima, Perú — https://maps.app.goo.gl/mrh3WueTJErXS2sg6
- ⚠️ Pendiente: el código aún usa el placeholder `+51 999 999 999` en
  `components/WhatsAppFloat.tsx` y `components/Footer.tsx` — sincronizar (ver `SUGERENCIAS.md`).

### A.8 Scripts

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

### B.1 Entrar al sitio

1. En desarrollo: `npm run dev` y abrir http://localhost:3000
2. En producción: URL pública del hosting (cuando esté desplegado)

### B.2 Inicio (home)

**Barra superior**
- Buscar productos, cuenta, favoritos y carrito
- Menú: Inicio, Catálogo, Ofertas, Nosotros, Contacto
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

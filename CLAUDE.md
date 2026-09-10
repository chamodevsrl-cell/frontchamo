@AGENTS.md

# Chamo Import — Front (memoria técnica)

E-commerce / catálogo mayorista de ferretería e importaciones (**Chamo Import S.R.L.**).
Este documento es la memoria de referencia del proyecto para trabajar indistintamente
desde la oficina o desde casa: cualquier sesión de Claude Code debe poder retomar el
trabajo leyendo solo este archivo + `AGENTS.md`.

## 1. Stack tecnológico

- **Next.js 16** (App Router, `app/`)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (tokens en `app/globals.css` con `@theme inline`, sin `tailwind.config`)
- **Lucide React** (iconografía, `lucide-react`)
- Fuentes vía `next/font/google` (`app/layout.tsx`)
- ESLint 9 (`eslint.config.mjs`)

> ⚠️ Antes de tocar código de Next.js, leer `AGENTS.md`: esta instalación puede tener
> breaking changes respecto al Next.js "clásico"; hay que revisar
> `node_modules/next/dist/docs/` antes de usar APIs nuevas.

## 2. Paleta de colores corporativos

| Token CSS / Tailwind | Uso | Hex |
| --- | --- | --- |
| `brand-dark` | Azul oscuro corporativo (barra superior, footer, botón categorías, tipografía) | `#0B3554` |
| `brand-primary` | Azul principal / industrial (barra de navegación, bordes, CTAs, acentos) | `#127EC9` |
| `brand-gold` | Amarillo dorado (badges Oferta/Nuevo, detalles, títulos de footer) | `#E4B714` |
| `brand-gray` | Gris claro (fondos suaves, hover) | `#F4F4F4` |
| `brand-whatsapp` | Verde WhatsApp (burbuja flotante, CTAs) | `#25D366` |

Definidos en `app/globals.css` (`:root` + `@theme inline`). El verde de WhatsApp
es `--brand-whatsapp` / `brand-whatsapp`.

## 3. Datos oficiales de la empresa

- **Razón social:** Chamo Import S.R.L.
- **Teléfono / WhatsApp oficial:** +51 959 723 602
- **Ubicación:** Lima, Perú — Google Maps: https://maps.app.goo.gl/mrh3WueTJErXS2sg6
- **Idioma base del sitio:** `es` (`app/layout.tsx` → `<html lang="es">`)

> Teléfono / WhatsApp oficial **+51 959 723 602** (`wa.me/51959723602`) unificado en
> `data/contact.ts` (float, footer, cotizar, contacto y modal). El correo
> `ventas@chamoimport.com` sigue provisional; confirmar con el cliente.

## 4. Tipografías

- **Barlow** — cuerpo, navegación y UI general (`--font-barlow` → `font-sans`)
- **Barlow Semi Condensed** — titulares y precios (`--font-barlow-semi-condensed` → `font-display`)

Carga en `app/layout.tsx` vía `next/font/google` (pesos 400–700).

## 5. Estado actual del sitio (2026-09-10)

- **Navbar de 3 niveles** (`components/Navbar.tsx`), estilo ferretería:
  1. Barra superior `brand-dark`: envíos, atención mayorista, enlaces Nosotros/Contacto, redes sociales.
  2. Fila blanca: logo, buscador (navega a `/catalogo?q=`), lupa toggle en móvil, Mi cuenta, Favoritos (badge), Carrito (badge con `CartProvider`).
  3. Barra `brand-primary`: botón **Categorías** (fondo `brand-dark`, dropdown desde `mainCategories` + "Ver todas") y menú principal uppercase (Inicio, Catálogo, Ofertas, Nosotros, Contacto). El ítem activo y el hover solo cambian el **color del texto a `brand-gold`** (sin bloque de fondo); el activo además lleva una **barra dorada animada** debajo (`navIndicator`, calculada por `offsetLeft`/`offsetWidth` del link con `data-nav-active`).
  - Menú móvil tipo drawer lateral con categorías + navegación + botón "Mi cuenta".
  - Los badges **Oferta/Nuevo** (no el botón de categorías) son los que usan `brand-gold` — ver `FeaturedOffers.tsx` / `CategoriesGrid.tsx`.
- **CTA WhatsApp**: burbuja flotante verde (`WhatsAppFloat.tsx`, esquina inferior derecha, animación ping) con el número oficial; `/cotizar` arma el mensaje con formulario + carrito.
- **Footer** (`components/Footer.tsx`): marca + enlaces rápidos + contacto + pagos + mapa + boletín + términos/privacidad.
- **Home** (`app/page.tsx`): Navbar → HeroSlider → BrandsCarousel → TrustInfoBar → `main` (CategoriesGrid + FeaturedOffers + Testimonials).
- **Categorías** (`CategoriesGrid.tsx`): carrusel horizontal con flechas; fotos locales en `public/images/categorias/`. Listado `/categorias`. Detalle `/categorias/[slug]` con banner ancho (`CategoryBanner`) y título centrado (`bannerTitle`, p. ej. ELÉCTRICOS).
- Autenticación: `AuthProvider` + `AuthModal` + `AuthForm` (stub). Carrito: `CartProvider`. Favoritos: `FavoritesProvider` (`localStorage`).
- **Modal de producto** + catálogo de ejemplo (~22 SKUs, mín. 3 por categoría): ficha técnica, relacionados, agregar a cotización y WhatsApp.
- Modo oscuro: clase `.dark`; `Navbar.tsx` sigue forzando `classList.remove("dark")` en cada mount. Las tarjetas de categoría ya tienen contraste dark por si se reactiva.
- Hero slider: banners `public/images/slider/baner-1.png` … `baner-3.png` (sin espacios).
- API: `GET /api/productos`. Tests: `npm test`.

## 6. Componentes (`components/`)

| Componente | Rol |
| --- | --- |
| `Navbar.tsx` | Header de 3 niveles (ver §5) |
| `WhatsAppFloat.tsx` | Burbuja flotante WhatsApp (verde `#25D366`, fija inferior derecha) |
| `HeroSlider.tsx` | Slider de anuncios: solo banners reales (sin placeholder), swipe táctil |
| `BrandsCarousel.tsx` | Carrusel de marcas distribuidoras (marquee CSS), debajo del slider |
| `CategoriesGrid.tsx` | Categorías en carrusel horizontal con flechas circulares + borde brillante de marca |
| `FeaturedOffers.tsx` | Ofertas destacadas: carrusel de una fila (igual que categorías) + `ProductModal` |
| `ProductModal.tsx` | Modal de producto: galería, precios, ficha técnica (tabla) y relacionados por categoría |
| `TrustInfoBar.tsx` | Barra de confianza (envíos, garantía, atención, etc.) |
| `CartProvider.tsx` | Carrito / cotización en `localStorage` |
| `FavoritesProvider.tsx` | Favoritos en `localStorage` (`chamo-favorites-v1`) |
| `FavoriteButton.tsx` | Corazón con persistencia + confirmación “Guardado” |
| `Testimonials.tsx` | Prueba social B2B de ejemplo en la home |
| `Breadcrumbs.tsx` | Miga de pan en páginas internas |
| `ProductCard.tsx` | Tarjeta de producto reutilizable (home, catálogo, ofertas) |
| `ProductCatalog.tsx` | Grilla + modal |
| `CatalogFilters.tsx` | Filtros de `/catalogo` (query string) |
| `CategoryBanner.tsx` | Detalle de categoría: reutiliza `PageBanner` (imagen + título centrado) |
| `PageBanner.tsx` | Banner ancho compartido (categorías y `/nosotros`) |
| `StampHeading.tsx` | Encabezado sticker (Catálogo, Nosotros, Ofertas, Contacto) |
| `CategoryIcon.tsx` | Icono Lucide por categoría (menú, home, `/categorias`) |
| `Reveal.tsx` | Fade/slide-up al entrar en viewport (scroll); respeta `prefers-reduced-motion` |
| `IntroSplash.tsx` | Puertas + engranaje al cargar el sitio y al entrar a Nosotros |
| `QuoteForm.tsx` | Formulario mayorista → WhatsApp |
| `ContactForm.tsx` | Formulario de `/contacto` → WhatsApp |
| `AuthProvider.tsx` | Contexto de autenticación (estado global login/registro) |
| `AuthModal.tsx` | Modal que envuelve `AuthForm`, controlado por `AuthProvider` |
| `AuthForm.tsx` | Formulario iniciar sesión / registrarse |
| `Footer.tsx` | Footer corporativo (ver §5) |
| `WrenchCursor.tsx` | Cursor personalizado (llave inglesa) en desktop |
| `SocialIcons.tsx` | Iconos SVG de Facebook/Instagram/YouTube reutilizados en Navbar y Footer |

## 7. Arquitectura de carpetas

```
app/                  # App Router (páginas y layout)
  layout.tsx           # Fuentes, metadata, AuthProvider, Footer, WhatsApp float, cursor
  page.tsx              # Home (Navbar + HeroSlider + Brands + Categorías + Ofertas + TrustBar)
  globals.css           # Tokens de marca + Tailwind v4 + animaciones (hero, reveal, intro, marquee)
  login/                # Auth (/login)
  nosotros/             # Empresa (/nosotros)
  contacto/             # Contacto + enlace a Maps (/contacto)
  ofertas/              # Ofertas (/ofertas)
  cotizar/              # Cotización mayorista (/cotizar)
  catalogo/             # Búsqueda y filtros
  categorias/           # Listado + [slug]
  carrito/              # Cotización local
  favoritos/            # Lista persistida
  terminos/ privacidad/ # Políticas
  api/productos/        # GET catálogo
components/            # UI reutilizable (ver §6)
data/
  contact.ts            # Teléfono / WhatsApp / correo / Maps
  company.ts            # Historia / misión / visión de /nosotros (placeholder)
  media.ts              # Rutas de slider, logo e icono (LOGO_SRC, ICON_SRC, slides)
  home.ts                # Datos de secciones del home (marcas, categorías, trust bar…)
  products.ts            # Catálogo de productos de ejemplo
  testimonials.ts        # Testimonios de ejemplo (home)
docs/                   # Documentación viva en 3 secciones fijas (ver §9)
  README.md              # Índice + flujo obligatorio
  cambios/               # Sección 1 — nota antes/después por solicitud
  SUGERENCIAS.md         # Sección 2 — backlog y recomendaciones
  MANUAL.md              # Sección 3 — documentación técnica (Parte A) + manual de usuario (Parte B)
public/images/
  slider/                # baner-1.png, baner-2.png, baner-3.png
  categorias/            # Fotos locales por línea
  marcas/                # Wordmarks SVG
  logo/                  # logo-chamo-import.png (navbar / footer)
  icon/                  # logo-chamo-import.png (favicon)
```

## 8. Comandos de desarrollo

```bash
npm run dev      # servidor de desarrollo (localhost:3000)
npm run build    # build de producción
npm run start    # sirve el build de producción
npm run lint     # ESLint
npm test         # Vitest smoke
```

Flujo de Git habitual del proyecto:

```bash
git add -A
git commit -m "mensaje descriptivo"
git push
```

- Rama principal: `main`. Se trabaja directo sobre `main` salvo que se indique lo contrario.
- Usuario de Git configurado: `chamodevsrl-cell`.

## 9. Documentación y registro de cambios (`docs/`) — 3 secciones fijas

Toda la documentación viva vive en **3 secciones** (índice en `docs/README.md`). Se
actualizan con **cualquier** cambio del proyecto, sin importar el tamaño — hasta
reemplazar una sola imagen cuenta:

1. **Cambios** (`docs/cambios/`) — una nota antes/después por solicitud, plantilla en `cambios/_plantilla.md`, índice en `cambios/README.md`.
2. **Sugerencias** (`docs/SUGERENCIAS.md`) — backlog vivo; marcar ítems resueltos y anotar ideas nuevas que surjan.
3. **Documentación técnica y manual de usuario** (`docs/MANUAL.md`) — Parte A (arquitectura/componentes/datos) y Parte B (qué ve y hace el usuario/negocio hoy).

Flujo obligatorio por solicitud: código/asset → nota en `docs/cambios/` → actualizar
`MANUAL.md` (A y/o B según aplique) → actualizar `SUGERENCIAS.md` → commit + push.

Último avance (2026-09-10): intro de puertas solo al cargar el sitio y al entrar a Nosotros.

## 10. Pendientes conocidos

- Confirmar correo de contacto oficial (footer y `/contacto`).
- Reemplazar textos placeholder de `/nosotros` (`data/company.ts`) por ficha oficial.
- Revisar si el modo oscuro debe reactivarse (`Navbar.tsx` lo fuerza a apagado en cada carga).
- Login/registro real (`AuthForm` sigue siendo stub).
- Comparar productos (botón visual, sin lógica).
- Fotos reales de tienda/almacén y logos oficiales de marca (hoy JPEG localizados y wordmarks SVG).
- Specs técnicas oficiales por SKU cuando el cliente envíe fichas.
- CMS/admin y backend de inventario real (hoy `/api/productos` sirve el catálogo de ejemplo).
- Sustituir testimonios de ejemplo por casos reales de distribuidores.
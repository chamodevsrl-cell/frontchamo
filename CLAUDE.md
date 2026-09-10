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
| — | Verde WhatsApp (burbuja flotante, `WhatsAppFloat.tsx`, hardcodeado sin token) | `#25D366` |

Definidos en `app/globals.css` (`:root` + `@theme inline`). El verde de WhatsApp **no**
tiene token de marca todavía (`bg-[#25D366]` inline) — si se usa en más lugares, conviene
agregarlo como `--brand-whatsapp` en `globals.css`.

## 3. Datos oficiales de la empresa

- **Razón social:** Chamo Import S.R.L.
- **Teléfono / WhatsApp oficial:** +51 959 723 602
- **Ubicación:** Lima, Perú — Google Maps: https://maps.app.goo.gl/mrh3WueTJErXS2sg6
- **Idioma base del sitio:** `es` (`app/layout.tsx` → `<html lang="es">`)

> ⚠️ **Pendiente de sincronizar:** el código todavía usa el teléfono placeholder
> `+51 999 999 999` en **4 lugares** — [`components/WhatsAppFloat.tsx`](components/WhatsAppFloat.tsx)
> (`WHATSAPP_URL`), [`components/Footer.tsx`](components/Footer.tsx) (`tel:+51999999999`),
> [`app/cotizar/page.tsx`](app/cotizar/page.tsx) (enlace WhatsApp) y
> [`app/contacto/page.tsx`](app/contacto/page.tsx) (`tel:+51999999999`). Hay que
> reemplazarlo por `+51 959 723 602` (`wa.me/51959723602`) en los cuatro y registrar el
> commit en `docs/cambios/`. **`components/ProductModal.tsx` ya usa el número oficial**
> (`wa.me/51959723602`) — tomarlo como referencia al corregir el resto.
> El correo del footer y de `/contacto` (`ventas@chamoimport.com`) también es
> provisional; confirmar con el cliente antes de darlo por oficial.

## 4. Tipografías

- **Barlow** — cuerpo, navegación y UI general (`--font-barlow` → `font-sans`)
- **Barlow Semi Condensed** — titulares y precios (`--font-barlow-semi-condensed` → `font-display`)

Carga en `app/layout.tsx` vía `next/font/google` (pesos 400–700).

## 5. Estado actual del sitio (2026-09-08)

- **Navbar de 3 niveles** (`components/Navbar.tsx`), estilo ferretería:
  1. Barra superior `brand-dark`: envíos, atención mayorista, enlaces Nosotros/Contacto, redes sociales.
  2. Fila blanca: logo, buscador desktop, lupa toggle en móvil, Mi cuenta, Favoritos, Carrito.
  3. Barra `brand-primary`: botón **Categorías** (fondo `brand-dark`, dropdown con 5 categorías + "Ver todas") y menú principal uppercase (Inicio, Catálogo, Ofertas, Nosotros, Contacto). El ítem activo y el hover solo cambian el **color del texto a `brand-gold`** (sin bloque de fondo); el activo además lleva una **barra dorada animada** debajo (`navIndicator`, calculada por `offsetLeft`/`offsetWidth` del link con `data-nav-active`).
  - Menú móvil tipo drawer lateral con categorías + navegación + botón "Mi cuenta".
  - Los badges **Oferta/Nuevo** (no el botón de categorías) son los que usan `brand-gold` — ver `FeaturedOffers.tsx` / `CategoriesGrid.tsx`.
- **CTA WhatsApp**: burbuja flotante verde (`WhatsAppFloat.tsx`, esquina inferior derecha, animación ping) en vez de un botón dentro del navbar; también hay entrada "Cotizar" en `app/cotizar/page.tsx`.
- **Footer corregido** (`components/Footer.tsx`): marca + enlaces rápidos + contacto + métodos de pago (Visa, Mastercard, Yape, Plin) + mapa embebido de Google Maps (Lima) + boletín de correo.
- **Home** (`app/page.tsx`): Navbar → HeroSlider → BrandsCarousel → TrustInfoBar → `main` (CategoriesGrid + FeaturedOffers).
- **Categorías** (`CategoriesGrid.tsx`): ya no es grilla estática — es **carrusel horizontal** (`snap-x`, igual patrón que `FeaturedOffers`) con **flechas circulares** (◀ ▶) en la cabecera, visibles en PC y móvil, más swipe táctil. 7 tarjetas (`data/home.ts` → `mainCategories`: Ferretería, Electricidad, Seguridad, Hogar, Herramientas, Construcción, Pinturas).
- Autenticación: `AuthProvider` (contexto global) + `AuthModal` (modal login/registro montado en `layout.tsx`) + `AuthForm`.
- **Modal de producto** (`ProductModal.tsx` + `data/products.ts`, 8 productos de ejemplo): galería con thumbs, precio unitario + mayorista, cantidad, "Agregar a cotización" y **Cotizar por WhatsApp** (`wa.me/51959723602`, ya con el número oficial); debajo, tabla **Especificaciones técnicas** (cabecera `brand-dark`, filas zebra `#eef6fc`) construida desde `product.specs` + `product.packaging`, y una grilla de **productos relacionados de la misma categoría** (`getRelatedProducts`) — al hacer clic en uno, cambia el producto dentro del mismo modal.
- Modo oscuro: clase `.dark` + preferencia en `localStorage` (tokens `--background`/`--foreground` en `globals.css`); actualmente `Navbar.tsx` fuerza `classList.remove("dark")` en cada mount — revisar si es intencional antes de reactivar el toggle.
- Cursor personalizado (`WrenchCursor.tsx`): llave inglesa, solo en dispositivos con mouse/trackpad (`@media (hover: hover) and (pointer: fine)`).
- Hero slider (`HeroSlider.tsx`): sin flechas, puntos + swipe táctil, banners full-bleed en `public/images/slider/`.
- **Documentación viva** en `docs/` — 3 secciones fijas: `cambios/` (historial), `SUGERENCIAS.md` (backlog), `MANUAL.md` (técnica + usuario). Ver §9. En Cursor el agente es Auto (Composer); Claude Code y Cursor comparten estos mismos archivos vía Git, así que cualquier sesión puede dejar código sin que la otra se entere hasta el próximo `git pull` — por eso conviene revisar `git log` antes de dar por hecho el estado del sitio.

## 6. Componentes (`components/`)

| Componente | Rol |
| --- | --- |
| `Navbar.tsx` | Header de 3 niveles (ver §5) |
| `WhatsAppFloat.tsx` | Burbuja flotante WhatsApp (verde `#25D366`, fija inferior derecha) |
| `HeroSlider.tsx` | Slider de anuncios del home, animación de entrada, swipe táctil |
| `BrandsCarousel.tsx` | Carrusel de marcas distribuidoras (marquee CSS), debajo del slider |
| `CategoriesGrid.tsx` | Categorías en carrusel horizontal con flechas circulares + borde brillante de marca |
| `FeaturedOffers.tsx` | Sección de ofertas destacadas, carrusel en móvil / grilla en desktop (usa `ProductModal`) |
| `ProductModal.tsx` | Modal de producto: galería, precios, ficha técnica (tabla) y relacionados por categoría |
| `TrustInfoBar.tsx` | Barra de confianza (envíos, garantía, atención, etc.) |
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
  globals.css           # Tokens de marca + Tailwind v4 + animaciones (hero, marquee)
  login/                # Auth (/login)
  nosotros/             # Empresa (/nosotros)
  contacto/             # Contacto + enlace a Maps (/contacto)
  ofertas/              # Ofertas (/ofertas)
  cotizar/              # Cotización mayorista (/cotizar)
components/            # UI reutilizable (ver §6)
data/
  media.ts              # Rutas de slider, logo e icono (LOGO_SRC, ICON_SRC, slides)
  home.ts                # Datos de secciones del home (marcas, categorías, trust bar…)
  products.ts            # Catálogo de productos de ejemplo
docs/                   # Documentación viva en 3 secciones fijas (ver §9)
  README.md              # Índice + flujo obligatorio
  cambios/               # Sección 1 — nota antes/después por solicitud
  SUGERENCIAS.md         # Sección 2 — backlog y recomendaciones
  MANUAL.md              # Sección 3 — documentación técnica (Parte A) + manual de usuario (Parte B)
public/images/
  slider/                # Anuncios del home (baner 1.png, baner 2.png, baner 3.png)
  logo/                  # logo-chamo-import.png (navbar / footer)
  icon/                  # logo-chamo-import.png (favicon)
```

## 8. Comandos de desarrollo

```bash
npm run dev      # servidor de desarrollo (localhost:3000)
npm run build    # build de producción
npm run start    # sirve el build de producción
npm run lint     # ESLint
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

Último avance (2026-09-08): consolidación de la documentación viva en estas 3 secciones
(antes eran 5 archivos sueltos), y una segunda pasada de revisión que sincronizó
`CLAUDE.md` / `MANUAL.md` / `SUGERENCIAS.md` con cambios de código que se habían hecho
en paralelo (carrusel de categorías con flechas, modal de producto con ficha técnica y
relacionados).

## 10. Pendientes conocidos

- **Bug confirmado (2026-09-10):** el fallback de texto de `BrandsCarousel.tsx` no se activa — las 10 imágenes de `public/images/marcas/` fallan (404) pero el `onError`/`setFailed(true)` no reemplaza el `<img>` por el `<span>` de texto; el usuario ve el ícono nativo de "imagen rota". Ver [`docs/cambios/2026-09-10-auditoria-ux-funcional.md`](docs/cambios/2026-09-10-auditoria-ux-funcional.md).
- **4 rutas 404 reales confirmadas:** `/catalogo`, `/categorias`, `/carrito`, `/favoritos` (enlazadas desde nav principal, "Ver todas" de categorías, e íconos de carrito/favoritos).
- **Funciones sin lógica real (solo UI):** buscador del navbar (`handleSearch` solo hace `preventDefault`), "Añadir al carrito" (`FeaturedOffers.tsx`), "Agregar a cotización" (`ProductModal.tsx`), login/registro (`AuthForm.tsx`, lo admite su propio mensaje), favoritos. Plan de cierre priorizado en `docs/SUGERENCIAS.md`.
- Sincronizar el teléfono/WhatsApp oficial (+51 959 723 602) en `WhatsAppFloat.tsx`, `Footer.tsx`, `app/cotizar/page.tsx` y `app/contacto/page.tsx` (ver §3) — `ProductModal.tsx` ya lo tiene correcto, usarlo de referencia.
- Confirmar correo de contacto oficial (footer y `/contacto`).
- Revisar si el modo oscuro debe reactivarse (`Navbar.tsx` lo fuerza a apagado en cada carga).
- Las rutas `/catalogo`, `/categorias`, `/favoritos` y `/carrito` están enlazadas desde Navbar/Footer pero aún no tienen página propia en `app/`.
- Fotos propias de categorías (hoy Unsplash) y logos de marcas en `public/images/marcas/` (hoy varios 404).
- Unificar categorías del Navbar con `mainCategories` en `data/home.ts`.
- `data/products.ts` sigue siendo catálogo de ejemplo hardcodeado (8 productos) — pendiente conectar a backend/API real.
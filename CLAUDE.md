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

> ⚠️ **Pendiente de sincronizar:** el código todavía usa un teléfono placeholder
> (`+51 999 999 999`) en dos lugares — [`components/WhatsAppFloat.tsx`](components/WhatsAppFloat.tsx)
> (`WHATSAPP_URL`) y [`components/Footer.tsx`](components/Footer.tsx) (`tel:+51999999999`
> y el texto visible). Hay que reemplazarlo por `+51 959 723 602` (`wa.me/51959723602`)
> en la próxima sesión de cambios y registrar el commit en `docs/cambios/`.
> El correo del footer (`ventas@chamoimport.com`) también es provisional; confirmar con
> el cliente antes de darlo por oficial.

## 4. Tipografías

- **Barlow** — cuerpo, navegación y UI general (`--font-barlow` → `font-sans`)
- **Barlow Semi Condensed** — titulares y precios (`--font-barlow-semi-condensed` → `font-display`)

Carga en `app/layout.tsx` vía `next/font/google` (pesos 400–700).

## 5. Estado actual del sitio (2026-09-08)

- **Navbar de 3 niveles** (`components/Navbar.tsx`), estilo ferretería:
  1. Barra superior `brand-dark`: envíos, atención mayorista, enlaces Nosotros/Contacto, redes sociales.
  2. Fila blanca: logo, buscador desktop, lupa toggle en móvil, Mi cuenta, Favoritos, Carrito.
  3. Barra `brand-primary`: botón **Categorías** (fondo `brand-dark`, dropdown con 5 categorías + "Ver todas") y menú principal uppercase (Inicio, Catálogo, Ofertas, Nosotros, Contacto).
  - Menú móvil tipo drawer lateral con categorías + navegación + botón "Mi cuenta".
  - Los badges **Oferta/Nuevo** (no el botón de categorías) son los que usan `brand-gold` — ver `FeaturedOffers.tsx` / `CategoriesGrid.tsx`.
- **CTA WhatsApp**: burbuja flotante verde (`WhatsAppFloat.tsx`, esquina inferior derecha, animación ping) en vez de un botón dentro del navbar; también hay entrada "Cotizar" en `app/cotizar/page.tsx`.
- **Footer corregido** (`components/Footer.tsx`): marca + enlaces rápidos + contacto + métodos de pago (Visa, Mastercard, Yape, Plin) + mapa embebido de Google Maps (Lima) + boletín de correo.
- **Home** (`app/page.tsx`): Navbar → HeroSlider → BrandsCarousel → TrustInfoBar → `main` (CategoriesGrid 7 tarjetas Explorar + FeaturedOffers).
- Autenticación: `AuthProvider` (contexto global) + `AuthModal` (modal login/registro montado en `layout.tsx`) + `AuthForm`.
- Catálogo/producto: `ProductModal.tsx` + `data/products.ts` (datos de productos de ejemplo).
- Modo oscuro: clase `.dark` + preferencia en `localStorage` (tokens `--background`/`--foreground` en `globals.css`); actualmente `Navbar.tsx` fuerza `classList.remove("dark")` en cada mount — revisar si es intencional antes de reactivar el toggle.
- Cursor personalizado (`WrenchCursor.tsx`): llave inglesa, solo en dispositivos con mouse/trackpad (`@media (hover: hover) and (pointer: fine)`).
- Hero slider (`HeroSlider.tsx`): sin flechas, puntos + swipe táctil, banners full-bleed en `public/images/slider/`.
- **Documentación viva** en `docs/` (manual de cambios, técnica, usuario, sugerencias + historial `docs/cambios/`). En Cursor el agente es Auto (Composer); Claude Code y Cursor deben compartir estos mismos archivos en Git.

## 6. Componentes (`components/`)

| Componente | Rol |
| --- | --- |
| `Navbar.tsx` | Header de 3 niveles (ver §5) |
| `WhatsAppFloat.tsx` | Burbuja flotante WhatsApp (verde `#25D366`, fija inferior derecha) |
| `HeroSlider.tsx` | Slider de anuncios del home, animación de entrada, swipe táctil |
| `BrandsCarousel.tsx` | Carrusel de marcas distribuidoras (marquee CSS), debajo del slider |
| `CategoriesGrid.tsx` | Grilla de categorías estilo "Explorar" con borde brillante de marca |
| `FeaturedOffers.tsx` | Sección de ofertas destacadas (usa `ProductModal`) |
| `ProductModal.tsx` | Modal de detalle/quick-view de producto |
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
docs/                   # Documentación viva (ver §9)
  README.md              # Índice
  MANUAL_CAMBIOS.md      # Flujo obligatorio por solicitud
  TECNICA.md             # Arquitectura / stack / datos
  USUARIO.md             # Guía de uso del sitio
  SUGERENCIAS.md         # Backlog y recomendaciones
  cambios/               # Nota antes/después por solicitud
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

## 9. Documentación y registro de cambios (`docs/`)

Cada solicitud de cambio debe:

1. Actualizar código.
2. Añadir nota en `docs/cambios/` (plantilla `_plantilla.md`).
3. Retocar `TECNICA.md` / `USUARIO.md` / `SUGERENCIAS.md` si el cambio es estructural o visible.
4. Commit + push.

Índice de historial: `docs/cambios/README.md`. Último avance (2026-09-08): **7 categorías** en home (se sumaron Herramientas, Construcción, Pinturas) + set completo de docs vivas.

## 10. Pendientes conocidos

- Sincronizar el teléfono/WhatsApp oficial (+51 959 723 602) en `WhatsAppFloat.tsx` y `Footer.tsx` (ver §3).
- Confirmar correo de contacto oficial del footer.
- Revisar si el modo oscuro debe reactivarse (`Navbar.tsx` lo fuerza a apagado en cada carga).
- Las rutas `/catalogo`, `/categorias`, `/favoritos` y `/carrito` están enlazadas desde Navbar/Footer pero aún no tienen página propia en `app/`.
- Fotos propias de categorías (hoy Unsplash) y logos de marcas en `public/images/marcas/`.
- Unificar categorías del Navbar con `mainCategories` en `data/home.ts`.
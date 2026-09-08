@AGENTS.md

# Chamo Import — Front (registro de avances)

E-commerce / catálogo mayorista de ferretería e importaciones (**Chamo Import**).

## 1. Stack tecnológico

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** (v4, tokens en `app/globals.css` con `@theme`)
- **Lucide React** (iconografía)
- Fuentes via `next/font/google`

## 2. Paleta de colores corporativos

| Token CSS / Tailwind | Uso | Hex |
| --- | --- | --- |
| `brand-dark` | Azul oscuro corporativo (barra superior, footer, tipografía) | `#0B3554` |
| `brand-primary` | Azul principal / industrial (bordes, CTAs, acentos) | `#127EC9` |
| `brand-gold` | Amarillo dorado (detalles, títulos de footer) | `#E4B714` |
| `brand-gray` | Gris claro (fondos suaves) | `#F4F4F4` |

Definidos en `app/globals.css` (`:root` + `@theme inline`).

## 3. Tipografías

- **Barlow** — cuerpo, navegación y UI general (`--font-barlow` → `font-sans`)
- **Barlow Semi Condensed** — titulares y precios (`--font-barlow-semi-condensed` → `font-display`)

Carga en `app/layout.tsx`.

## 4. Componentes implementados

| Componente | Rol |
| --- | --- |
| `components/Navbar.tsx` | Header 3 niveles (estilo ferretería): barra gris útil, fila logo+buscador+cuenta/favoritos/carrito, barra azul `#127EC9` con Ver categorías + enlaces (Inicio, Catálogo, Ofertas, Contacto, Cotizar) y badges dorados |
| `components/WhatsAppFloat.tsx` | Burbuja flotante WhatsApp “Cotizar Mayorista” (esquina inferior derecha; reemplaza el CTA verde del navbar) |
| `components/HeroSlider.tsx` | Slider de anuncios con animación de entrada; imágenes en `public/images/slider/` |
| `components/AuthForm.tsx` | Formulario iniciar sesión / registrarse (`/login`) |
| `components/Footer.tsx` | Footer corporativo: Nosotros, Contacto, mapa Google Maps, medios de pago (Visa, Mastercard, Débito, Yape, Plin) |
| `components/WrenchCursor.tsx` | Cursor personalizado (llave inglesa) en desktop |

### Navbar — detalle de marca

- **Nivel 1** (blanco): logo, buscador desktop, lupa toggle en móvil, modo oscuro, Mi cuenta, favoritos, carrito
- **Nivel 2** (`#127EC9`): Ver categorías (dropdown `#0B3554`), menú uppercase; badges Oferta/Nuevo en `#E4B714`
- Logo: `public/images/logo/logo.png` (`LOGO_SRC` en `data/media.ts`)
- WhatsApp cotización: burbuja flotante (`WhatsAppFloat`) + Cotizar en menú móvil
- Hero slider: sin flechas; puntos + swipe táctil

## 5. Arquitectura de carpetas

```
app/                  # App Router (páginas y layout)
  layout.tsx          # Fuentes, metadata, Footer, WhatsApp float, cursor
  page.tsx            # Home (Navbar + HeroSlider)
  globals.css         # Tokens de marca + Tailwind
  login/              # Auth
  nosotros/           # Empresa
  contacto/           # Contacto + enlace a Maps
components/           # UI reutilizable
data/media.ts         # Rutas de slider, logo e icono
docs/cambios/         # Registro antes/después de cada solicitud
public/images/
  slider/             # Anuncios del home (baner 1.png …)
  logo/               # logo.png (navbar / footer)
  icon/               # icon.png (favicon)
```

## 6. Otros avances

- Ubicación Google Maps: https://maps.app.goo.gl/mrh3WueTJErXS2sg6 (CHAMO IMPORT S.R.L.)
- Modo oscuro (clase `.dark` + preferencia en `localStorage`)
- Idioma base: `es`
- Cada cambio solicitado se documenta en `docs/cambios/` (código anterior, nuevo y recomendación) y se sube a Git

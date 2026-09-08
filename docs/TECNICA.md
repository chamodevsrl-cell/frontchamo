# Documentación técnica — Chamo Import Front

Última actualización: **2026-09-08** (7 categorías en home)

## 1. Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (tokens en `app/globals.css`)
- Lucide React
- Fuentes: Barlow / Barlow Semi Condensed (`app/layout.tsx`)

## 2. Marca (tokens)

| Token | Hex | Uso |
| --- | --- | --- |
| `brand-dark` | `#0B3554` | Tipografía, footer |
| `brand-primary` | `#127EC9` | CTAs, bordes brillantes, acentos |
| `brand-gold` | `#E4B714` | Badges / detalles |
| `brand-gray` | `#F4F4F4` | Fondos suaves |

## 3. Estructura relevante

```
app/page.tsx              # Home: orden de secciones
components/
  HeroSlider.tsx          # Banners full-bleed, imagen completa
  BrandsCarousel.tsx      # Marcas debajo del slider
  TrustInfoBar.tsx
  CategoriesGrid.tsx      # Tarjetas Explorar + glow
  FeaturedOffers.tsx      # Productos (borde brillante de referencia)
data/
  media.ts                # Slides / logo / icon
  home.ts                 # trustItems, mainCategories, distributorBrands
  products.ts             # Ofertas destacadas
docs/                     # Manual, técnica, usuario, sugerencias, cambios/
public/images/slider/     # baner 1–3.png
```

## 4. Home — orden actual

1. `Navbar`
2. `HeroSlider`
3. `BrandsCarousel`
4. `TrustInfoBar`
5. `main` → `CategoriesGrid` + `FeaturedOffers`

## 5. Categorías (`data/home.ts` → `mainCategories`)

Cada ítem:

- `href`, `label`, `eyebrow`
- `bullets` (3)
- `image`, `imageAlt`
- `tint` (fondo pastel)

**Actual (7):** Ferretería, Electricidad, Seguridad, Hogar, Herramientas, Construcción, Pinturas.

UI: `CategoriesGrid` — grilla `1 / 2 / 3 / 4` cols; borde brillante igual que productos (`border-brand-primary` + glow).

## 6. Slider

- Rutas en `data/media.ts`; archivos en `public/images/slider/`
- `fullBleed: true` evita overlay de texto sobre el arte
- Imagen `w-full h-auto object-contain` (sin recorte)

## 7. Scripts

```bash
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

## 8. Docs vivos

Ver `docs/README.md` y `docs/MANUAL_CAMBIOS.md`.

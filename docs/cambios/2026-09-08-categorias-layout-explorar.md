# Categorías principales con layout “Explorar” y borde brillante

- **Fecha:** 2026-09-08
- **Solicitud:** Llevar las categorías al formato del mockup (eyebrow, título, bullets, botón Explorar e imagen abajo), manteniendo las tarjetas brillantes en el borde.
- **Archivos:** `components/CategoriesGrid.tsx`, `data/home.ts`
- **Commit:** `46fcd2c`

## Qué había antes

Grilla de tarjetas cuadradas con ícono `Wrench`, nombre y flecha. En móvil se mostraban 3 con carrusel de flechas; en desktop hasta 5 columnas. El borde era sombra suave gris, no el glow azul de productos.

## Código anterior (tarjeta)

```tsx
<Link
  href={href}
  className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(11,53,84,0.08)] ..."
>
  <div className="relative flex aspect-square items-center justify-center" style={{ background: ... }}>
    <Wrench ... />
  </div>
  <div className="...">
    <span>{label}</span>
    <ArrowRight ... />
  </div>
</Link>
```

## Código nuevo (tarjeta)

```tsx
<article
  className={`... rounded-2xl border border-brand-primary/35 shadow-[0_0_0_1px_rgba(18,126,201,0.12),0_0_18px_rgba(18,126,201,0.35)] ...`}
  style={{ backgroundColor: category.tint }}
>
  <p className="... text-brand-primary uppercase">{category.eyebrow}</p>
  <h3 className="font-display ... uppercase">{category.label}</h3>
  <ul>{/* 3 bullets con punto brand-primary */}</ul>
  <Link href={category.href} className="rounded-full bg-brand-primary ...">
    Explorar <ArrowRight />
  </Link>
  <div className="relative aspect-[16/10] overflow-hidden rounded-xl ...">
    <Image src={category.image} fill className="object-cover" />
  </div>
</article>
```

**Datos:** `mainCategories` ahora incluye `eyebrow`, `bullets`, `image`, `imageAlt` y `tint` (4 categorías: Ferretería, Electricidad, Seguridad, Hogar).

## Recomendación

- Reemplazar las URLs de Unsplash por fotos propias en `public/images/categorias/` cuando estén listas.
- El acento del mockup era rojo; se usó **brand-primary** (`#127EC9`) para eyebrow, bullets, CTA y glow, alineado con las tarjetas de productos.
- El menú del Navbar sigue con su lista propia de categorías; si se unifica el catálogo, conviene una sola fuente de datos.
- En móvil la grilla es 1 columna (tarjetas altas); si se prefiere scroll horizontal, se puede añadir un carrusel sin perder el layout interno.

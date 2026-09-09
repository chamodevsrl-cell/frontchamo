# Nosotros con banner + animaciones de entrada

- **Fecha:** 2026-09-09
- **Solicitud:** En `/nosotros` usar el mismo tipo de banner que las categorías (título **NOSOTROS**), una historia de empresa con el nombre Chamo Import, misión y visión, y animar la entrada del contenido en todo el sitio al cargar o al hacer scroll. Sin video; subir código y docs a Git.
- **Archivos:** `app/nosotros/page.tsx`, `data/company.ts`, `components/PageBanner.tsx`, `components/CategoryBanner.tsx`, `components/Reveal.tsx`, `app/globals.css`, `app/page.tsx`, páginas de catálogo/ofertas/cotizar/carrito/contacto/políticas, `components/Footer.tsx`
- **Commit:** (se registra al subir)

## Qué había antes

`/nosotros` era un bloque de texto corto sin banner. El slider del home ya tenía `animate-hero-enter`; el resto de secciones aparecía de golpe. El banner de categoría era un componente propio, no reutilizable.

## Código anterior

```tsx
export default function NosotrosPage() {
  return (
    <div>
      <Navbar />
      <main>
        <h1>Nosotros</h1>
        <p>Chamo Import S.R.L. — ferretería e importaciones mayoristas.</p>
      </main>
    </div>
  );
}
```

## Código nuevo

- Banner compartido (`PageBanner`): foto ancha, franjas de marca, placa blanca con **NOSOTROS** (mismo patrón que ELÉCTRICOS).
- Textos placeholder en `data/company.ts` (historia, misión, visión, valores) con el nombre **Chamo Import S.R.L.** — sustituir cuando el cliente envíe ficha oficial.
- `Reveal`: al entrar en viewport el bloque hace fade + slide-up (como el banner). Respeta `prefers-reduced-motion`.
- Home, categorías, catálogo, ofertas, cotizar, carrito, contacto, políticas y footer usan `Reveal`. El slider y `PageBanner` siguen con `animate-hero-enter`.

## Recomendación

- Pedir al cliente misión/visión/año de fundación reales; hoy **2016** y los textos son de ejemplo.
- Sustituir `NOSOTROS_BANNER_SRC` (hoy foto de construcción) por una foto de tienda/almacén cuando exista.

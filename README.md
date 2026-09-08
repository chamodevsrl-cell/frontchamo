# Chamo Import — Front

Catálogo web mayorista de **Chamo Import S.R.L.**: ferretería e importaciones para
distribuidores en todo el Perú. Construido con Next.js (App Router), TypeScript y
Tailwind CSS v4.

## ✨ Características

- **Navbar de 3 niveles** estilo ferretería: barra de utilidad, logo + buscador + cuenta,
  y barra de categorías/navegación principal.
- **Slider de anuncios** en el home con animación de entrada, puntos y swipe táctil.
- **Carrusel de marcas** distribuidoras y grilla de categorías con estilo "Explorar".
- **CTA de WhatsApp** flotante para cotizaciones mayoristas.
- **Autenticación** (login / registro) con contexto global y modal.
- **Modo oscuro** vía clase `.dark` y preferencia persistida en `localStorage`.
- **Footer corporativo** con mapa de Google Maps, métodos de pago y boletín.
- Cursor personalizado (llave inglesa) en dispositivos de escritorio.

## 🛠 Stack tecnológico

| Tecnología | Uso |
| --- | --- |
| [Next.js](https://nextjs.org) 16 (App Router) | Framework / routing |
| [React](https://react.dev) 19 + TypeScript | UI y tipado |
| [Tailwind CSS](https://tailwindcss.com) v4 | Estilos (tokens en `app/globals.css`) |
| [Lucide React](https://lucide.dev) | Iconografía |
| `next/font/google` (Barlow, Barlow Semi Condensed) | Tipografía |

## 🎨 Marca

| Color | Hex | Uso |
| --- | --- | --- |
| Azul oscuro | `#0B3554` | Barra superior, footer, botón categorías |
| Azul principal | `#127EC9` | Barra de navegación, CTAs, acentos |
| Amarillo dorado | `#E4B714` | Badges Oferta / Nuevo, detalles |
| Verde WhatsApp | `#25D366` | CTA flotante de WhatsApp |

**Empresa:** Chamo Import S.R.L. · **WhatsApp / Tel:** +51 959 723 602 · Lima, Perú

## 📂 Estructura del proyecto

```
app/                  # App Router (páginas y layout)
components/            # UI reutilizable (Navbar, Footer, Slider, Auth, etc.)
data/                  # Contenido tipado (slider, home, productos)
docs/                  # Documentación viva en 3 secciones fijas
  cambios/             # 1. Cambios — historial antes/después por solicitud
  SUGERENCIAS.md        # 2. Sugerencias de cambios (backlog vivo)
  MANUAL.md             # 3. Documentación técnica + manual de usuario
public/images/         # Slider, logo e íconos
```

Documentación (3 secciones, ver [`docs/README.md`](./docs/README.md)):

1. **Cambios** → [`docs/cambios/`](./docs/cambios/)
2. **Sugerencias** → [`docs/SUGERENCIAS.md`](./docs/SUGERENCIAS.md)
3. **Documentación técnica y manual de usuario** → [`docs/MANUAL.md`](./docs/MANUAL.md)

Memoria de agentes: [`CLAUDE.md`](./CLAUDE.md) + [`AGENTS.md`](./AGENTS.md).

Cada cambio del proyecto —código, texto o incluso una sola imagen— debe dejar nota en
`docs/cambios/` y actualizar `docs/MANUAL.md` / `docs/SUGERENCIAS.md` si corresponde.

## 🚀 Empezar

Requisitos: Node.js 20+ y npm.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el sitio. La página se
actualiza automáticamente al editar los archivos en `app/`.

### Otros comandos

```bash
npm run build    # build de producción
npm run start    # sirve el build de producción
npm run lint      # ESLint
```

## 🔀 Flujo de trabajo con Git

```bash
git add -A
git commit -m "mensaje descriptivo"
git push
```

Cada cambio funcional se documenta según el flujo de [`docs/README.md`](./docs/README.md)
y se registra en [`docs/cambios/`](./docs/cambios/) (plantilla:
[`docs/cambios/_plantilla.md`](./docs/cambios/_plantilla.md)).

## 📄 Licencia

Proyecto privado de Chamo Import S.R.L. Todos los derechos reservados.

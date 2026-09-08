# Guía de uso (usuario / negocio) — Chamo Import

Última actualización: **2026-09-08**

Esta guía describe **lo que se ve y se puede hacer hoy** en el front. Debe actualizarse cuando cambie el comportamiento visible.

## Entrar al sitio

1. Con el proyecto en marcha (`npm run dev`), abrir http://localhost:3000
2. En producción usarán la URL pública del hosting (cuando esté desplegado)

## Inicio (home)

### Barra superior

- Buscar productos (campo de búsqueda)
- Cuenta, favoritos y carrito
- Menú: Inicio, Catálogo, Ofertas, Nosotros, Contacto
- **Categorías** (desplegable del menú)

### Slider de anuncios

- Muestra los banners de campaña (hoy: navideño, herramientas, envíos a la sierra)
- Cambia solo cada unos segundos; también se puede deslizar en móvil o usar los puntos
- El banner se ve **completo** (sin recortar el texto de la imagen) y de **borde a borde**

### Marcas distribuidoras

- Carrusel de marcas **justo debajo del slider**
- Sirve para mostrar marcas que comercializan / auspician

### Beneficios

- Franja con envíos, venta mayorista, pagos (Yape/Plin/tarjetas) y atención a distribuidores

### Categorías principales

- **7 tarjetas** con borde brillante azul:
  1. Ferretería  
  2. Electricidad  
  3. Seguridad  
  4. Hogar  
  5. Herramientas  
  6. Construcción  
  7. Pinturas  
- Cada una tiene: subtítulo, título, 3 beneficios, botón **Explorar** e imagen
- Enlace **Ver todas las categorías** (ruta `/categorias`; página aún puede estar pendiente)

### Productos destacados / ofertas

- Tarjetas de producto con precio, stock y “Añadir al carrito”
- Al hacer clic se abre el detalle del producto (modal)

### WhatsApp

- Botón flotante verde para cotizar / contactar

### Pie de página

- Enlaces, contacto, mapa, medios de pago, boletín

## Otras páginas

| Ruta | Uso |
| --- | --- |
| `/nosotros` | Información de la empresa |
| `/contacto` | Datos de contacto y Maps |
| `/ofertas` | Vista de ofertas (en evolución) |
| `/cotizar` | Cotización / WhatsApp |
| Login (modal / cuenta) | Iniciar sesión o registrarse |

## Contenido que el negocio puede cambiar sin programar (cuando se entregue el flujo)

Hoy muchos textos e imágenes están en archivos del proyecto (`data/` y `public/images/`). Más adelante conviene un panel admin. Por ahora:

- Banners → `public/images/slider/` + `data/media.ts`
- Categorías del home → `data/home.ts`
- Logos de marcas → `public/images/marcas/`
- Productos destacados → `data/products.ts`

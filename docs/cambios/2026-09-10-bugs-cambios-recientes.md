# Bugs en los cambios recientes (intro, WhatsApp, favoritos)

- **Fecha:** 2026-09-10
- **Solicitud:** Volver a analizar los cambios del PR y buscar errores/bugs
- **Archivos:** `components/IntroSplash.tsx`, `app/globals.css`, `components/Navbar.tsx`, `data/contact.ts`, `components/ContactForm.tsx`, `components/QuoteForm.tsx`, `components/FavoritesProvider.tsx`, `components/Reveal.tsx`
- **Commit:** (se completa al subir)

## Qué había antes

Revisión del branch frente a `main` y del código de intro / contacto / favoritos.
Tres bugs reales (el resto eran falsos positivos: las fotos del slider y de
categorías sí están en `public/images/`).

1. **Intro scrolleable.** `IntroSplash` ponía `document.body.style.overflow = "hidden"`,
   pero el `Navbar` (efecto del menú móvil) lo volvía a `""` al montar. En la
   carga y al clic del logo se podía mover el home detrás de las puertas.
2. **Formularios de WhatsApp en silencio.** `/contacto` y `/cotizar` usaban
   `window.open(wa.me, "_blank")`. El bloqueador de popups puede devolver `null`
   y el envío no abre el chat.
3. **Toast de favoritos desfasado.** `toggle` leía `ids` cerrado y `setIds` era
   funcional: dos clics rápidos podían decir “Guardado” dos veces y dejar el
   corazón vacío.

## Código anterior

```tsx
document.body.style.overflow = "hidden";
// Navbar, al montar:
document.body.style.overflow = mobileOpen ? "hidden" : "";

window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");

const nextActive = !ids.includes(productId);
setIds((current) => /* add or remove */);
flash(nextActive ? "Guardado en favoritos" : "Quitado de favoritos");
```

## Código nuevo

- Clase `html.intro-playing` con `overflow: hidden !important` (gana al inline
  del Navbar). El Navbar no pisa el overflow si la intro está en curso.
- `openWhatsApp()` crea un `<a target="_blank">`, lo clickea y lo quita
  (gesto de usuario; no depende de `window.open`).
- `idsRef` se actualiza en el mismo `toggle` que el toast, así el segundo clic
  ve el estado real.

## Recomendación

- Confirmar en desktop que durante las puertas no hay scroll, y que Catálogo /
  Nosotros / Contacto siguen sin intro.
- Enviar el formulario de contacto y el de cotizar: debe abrir `wa.me/51959723602`.
- El corazón: un clic = “Guardado”, el segundo inmediato = “Quitado”, icono a tono.
- No son bugs de este pase: login stub, botón Comparar decorativo, correo
  `ventas@chamoimport.com` provisional, fotos Unsplash de productos.

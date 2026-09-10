# Página de contacto completa

- **Fecha:** 2026-09-10
- **Solicitud:** "genera la seccion de contactos"
- **Archivos:** `app/contacto/page.tsx`, `components/ContactForm.tsx`, `data/contact.ts`, `components/Footer.tsx`
- **Commit:** (este bloque)

## Qué había antes

`/contacto` era un encabezado sticker y una lista de 4 líneas (teléfono, correo, horario, Maps). No había formulario, tarjetas, mapa grande ni CTA de WhatsApp.

## Código nuevo

Página al estilo de `/nosotros`: banner **NUESTRO CONTACTO**, 4 canales (WhatsApp, teléfono, correo, horario), formulario que abre WhatsApp con el mensaje armado, bloque de visita + redes, y mapa embebido a todo el ancho. Horario y ciudad salen de `data/contact.ts` (también el footer).

## Recomendación

- Confirmar correo oficial y perfiles de redes antes de darlos por definitivos.
- Cuando haya dirección de calle, reemplazar `ADDRESS_DISPLAY`.

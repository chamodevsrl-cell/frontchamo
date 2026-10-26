# WhatsApp 936 608 583 + icono opcional en categorías

- **Fecha:** 2026-10-26
- **Solicitud:** El destino de WhatsApp pasa a 936 608 583. Al crear/editar categoría, el icono es opcional (archivo o URL).
- **Archivos:** `data/contact.ts`, `lib/cms.ts`, `components/admin/AdminCategoriesCards.tsx`, `components/admin/CmsImageField.tsx`, `components/CategoryIcon.tsx`, `data/home.ts`, `types/admin.ts`
- **Commit:** (pendiente)

## Qué había antes

WhatsApp iba a `wa.me/51959723602`. Las categorías solo tenían icono Lucide fijo por slug; el alta no permitía subir un icono.

## Código nuevo

- `WHATSAPP_DISPLAY` / `WHATSAPP_NUMBER` = `+51 936 608 583` / `51936608583`.
- CMS: campo `icon` opcional (URL, ruta o imagen local) en categorías; `CategoryIcon` lo muestra si existe.

## Recomendación

- Si el CMS local ya tenía el WhatsApp viejo guardado, al recargar se migra al 936.
- El teléfono de llamadas sigue en `+51 959 723 602` hasta que se pida unificarlo.

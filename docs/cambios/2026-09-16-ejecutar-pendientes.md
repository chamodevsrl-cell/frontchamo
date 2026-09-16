# Ejecutar backlog pendiente (panel + tienda)

- **Fecha:** 2026-09-16
- **Solicitud:** EJECUTA TODO (pendientes de SUGERENCIAS / CLAUDE que se pueden hacer sin backend ni datos oficiales del cliente)
- **Archivos:** `services/adminApi.ts`, `types/admin.ts`, `lib/inbox.ts`, `lib/favorites.ts`, `components/FavoritesProvider.tsx`, `app/reclamaciones/page.tsx`, `app/admin/(panel)/*`
- **Commit:** (se completa al subir)

## Qué había antes

Marcas, clientes, inventario, ofertas y reportes eran placeholders. `/contacto` solo
abría WhatsApp. No había reclamaciones. El alta de producto no tenía pantalla de
edición. Favoritos era `ids: string[]`. `categoryLabel` solo vivía copiado en cada SKU.

## Código nuevo

- Inbox (`createContact` / `createClaim`) + `/admin/contactos` y `/admin/reclamaciones`
- `/reclamaciones` público y enlace en el footer
- Wizard de edición en `/admin/productos/[id]` (`updateProduct`)
- `getBrands` / `getClients` + tablas reales
- Almacenamiento y Analítica (mismos URLs, nombres del sidebar)
- Favoritos `{ productId, addedAt }` con migración
- `resolveCategoryLabel()` en modal y comparar

No se inventaron correo oficial, ficha de Nosotros, testimonios reales ni logos de
marca. El backend real (`fetch('/api/v1')`) sigue pendiente.

## Recomendación

- Probar login staff, enviar un contacto y verlo en `/admin/contactos`.
- Al conectar backend, `chamo-inbox-v1` y `data:` URLs de imágenes se reemplazan por API/bucket.

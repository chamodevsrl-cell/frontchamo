# CMS: footer editable, banners por página y equipo en cartas

- **Fecha:** 2026-09-15
- **Solicitud:** Ajustes para editar todo el footer (pagos, dirección, etc.); Banners con mejor diseño para el home y el resto de páginas; apartado Nosotros/equipo con colaboradores en cartas (alta en el panel).
- **Archivos:** `lib/cms.ts`, `components/Footer.tsx`, `components/admin/AdminFooterSettings.tsx`, `components/admin/AdminBannersStudio.tsx`, `components/admin/AdminTeamCards.tsx`, `app/nosotros/page.tsx`, `app/admin/(panel)/ajustes/page.tsx`, `app/admin/(panel)/equipo/page.tsx`
- **Commit:** (pendiente)

## Qué había antes

- `/admin/configuracion` era un placeholder. El footer salía de `data/contact.ts` (dirección, teléfono, mapa, badges de pago fijos).
- `/admin/banners` era un formulario de URL/alt para los 3 slides del home, sin vista de tarjeta ni banners de otras páginas.
- `/nosotros` no tenía equipo. No había pantalla de colaboradores en el panel.

## Código anterior

```tsx
export default function AdminConfiguracionPage() {
  return (
    <AdminPlaceholder
      title="Configuración"
      description="Datos de empresa, usuarios del panel y preferencias. No inventar RUC ni correo oficial aquí."
    />
  );
}
```

## Código nuevo

```tsx
// Sidebar
{ href: "/admin/ajustes", label: "Ajustes", permission: "configuracion" }
{ href: "/admin/equipo", label: "Equipo", permission: "configuracion" }

// chamo-cms-v1 ahora guarda footer + pageBanners + team
saveCms({ footer });
saveCms({ slides, pageBanners });
saveCms({ team: members });
```

El footer de la tienda, el WhatsApp flotante y Contacto leen `cms.footer`. Nosotros, Contacto, Ofertas y Catálogo leen `cms.pageBanners`. La sección **Trabajo** de `/nosotros` pinta las cartas de `cms.team`.

## Recomendación

- Las fotos se guardan como `data:` URL en este navegador (tope 1.5 MB). Cuando haya backend, subir a bucket y guardar solo la URL.
- Vigilar el tamaño de `localStorage` si se suben varios banners pesados.
- El permiso sigue siendo `configuracion` (Ajustes + Equipo). `/admin/configuracion` redirige a `/admin/ajustes`.

# Ajustes: Footer y Canales de atención

- **Fecha:** 2026-09-15
- **Solicitud:** Desglosar Ajustes como Productos: Footer para todo lo del pie; Canales de atención para WhatsApp (botón flotante), teléfono para llamar, correo y redes.
- **Archivos:** `components/admin/AdminShell.tsx`, `components/admin/AdminChannelsSettings.tsx`, `components/admin/AdminFooterSettings.tsx`, `app/admin/(panel)/ajustes/page.tsx`, `app/admin/(panel)/ajustes/footer/page.tsx`, `app/admin/(panel)/ajustes/canales/page.tsx`, `lib/cms.ts`
- **Commit:** (pendiente)

## Qué había antes

`/admin/ajustes` era una sola pantalla con todo el footer mezclado (dirección, teléfono, WhatsApp, redes y pagos). El sidebar no se desglosaba.

## Código anterior

```tsx
{ href: "/admin/ajustes", label: "Ajustes", icon: Settings, permission: "configuracion" }
```

## Código nuevo

```tsx
{
  href: "/admin/ajustes",
  label: "Ajustes",
  children: [
    { href: "/admin/ajustes/footer", label: "Footer" },
    { href: "/admin/ajustes/canales", label: "Canales de atención" },
  ],
}
```

El índice `/admin/ajustes` muestra dos cartas. Canales edita `whatsapp` (flotante y cotizaciones), `phone` (llamadas), `email` y URLs de Facebook/Instagram/YouTube.

## Recomendación

- Si el campo WhatsApp queda vacío, se usa el teléfono de llamadas.
- Confirmar con el cliente el correo oficial (`ventas@chamoimport.com` sigue provisional).

# Dev server: localhost + 127.0.0.1

- **Fecha:** 2026-09-09
- **Solicitud:** Error -102 al abrir http://localhost:3000/
- **Archivos:** `next.config.ts`
- **Commit:** (se registra al subir)

## Qué había antes

`allowedDevOrigins` solo incluía `127.0.0.1`. El preview a veces entra por `localhost`.

## Código nuevo

```ts
allowedDevOrigins: ["localhost", "127.0.0.1", ...extraDevOrigins]
```

El `next dev` se relanzó con `--hostname 0.0.0.0 --port 3000`.

## Recomendación

Si el error -102 vuelve al abrir localhost en el navegador de tu PC (no el preview de Cursor), el servidor vive en el agente cloud: usa el panel Ports / Simple Browser del IDE, no el Chrome local.

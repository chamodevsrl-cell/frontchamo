# Exclusiones de watcher/index para el editor (Cursor/VS Code)

- **Fecha:** 2026-09-21
- **Solicitud:** El usuario reportó que Cursor demora demasiado en ejecutar órdenes simples; se investigó la causa y se propuso una mejora de configuración de editor.
- **Archivos:** `.vscode/settings.json` (nuevo)
- **Commit:** (pendiente)

## Qué había antes

No existía `.vscode/settings.json` en el repo. Cursor (basado en VS Code) indexaba
y vigilaba con su file watcher toda la carpeta del proyecto, incluyendo
`node_modules` (564 MB) y `.next`, lo que puede hacer que comandos simples en la
terminal integrada o el propio indexado se sientan lentos.

## Código nuevo

```json
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/coverage/**": true,
    "**/.git/objects/**": true
  },
  "files.exclude": {
    "**/.next": true,
    "**/coverage": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/coverage": true
  }
}
```

## Recomendación

- Esto no soluciona por sí solo la lentitud si la causa es el antivirus de
  Windows escaneando `node_modules`/`.next` en cada escritura de archivo —
  conviene agregar una exclusión de esas carpetas en Windows Defender (u otro
  antivirus) desde la configuración del sistema (fuera del alcance del repo).
- Verificar en la consola al correr `npm run dev` que Next 16 esté usando
  Turbopack (debería indicarlo en el arranque); si cayera al bundler
  clásico de Webpack, los rebuilds serían más lentos.
- Si el proyecto se clona/mueve a una carpeta sincronizada por OneDrive/Dropbox
  en el futuro, revisar de nuevo — el sync de nube es otra causa común de
  lentitud en Windows y hoy no aplica (el repo vive en `C:\Users\<usuario>\frontchamo`).

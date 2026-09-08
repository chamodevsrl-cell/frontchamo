# Manual de cambios

Última actualización: **2026-09-08**

## Objetivo

Dejar rastro claro de **qué pediste**, **qué había**, **qué quedó** y **qué conviene hacer después**, en cada avance.

## Flujo obligatorio (cada solicitud)

1. Implementar el cambio en código.
2. Crear o actualizar un archivo en `docs/cambios/AAAA-MM-DD-descripcion.md` (plantilla: `docs/cambios/_plantilla.md`).
3. Actualizar, si aplica:
   - `docs/TECNICA.md` (arquitectura / componentes / datos)
   - `docs/USUARIO.md` (comportamiento visible para el usuario)
   - `docs/SUGERENCIAS.md` (ideas nuevas o ítems resueltos)
4. Actualizar el índice de `docs/cambios/README.md`.
5. Commit + push a Git.

## Qué debe llevar cada nota de cambio

- Fecha y texto de la solicitud
- Archivos tocados y commit
- Explicación de lo anterior
- Fragmento de **código anterior**
- Fragmento de **código nuevo**
- Recomendación

## Convención de nombres

```
docs/cambios/2026-09-08-categorias-tres-nuevas.md
```

## Relación con el resto de docs

| Si el cambio afecta… | Actualiza también… |
| --- | --- |
| Layout, rutas, datos, APIs | `TECNICA.md` |
| Flujo en pantalla, textos, secciones | `USUARIO.md` |
| Deudas técnicas o ideas | `SUGERENCIAS.md` |
| Detalle de un ticket concreto | `cambios/*.md` |

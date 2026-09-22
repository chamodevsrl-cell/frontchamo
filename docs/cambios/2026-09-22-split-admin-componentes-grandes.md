# Split de componentes grandes del panel (AdminNewProductForm, AdminUsersCards)

- **Fecha:** 2026-09-22
- **Solicitud:** El usuario preguntó por optimizaciones al código; se señaló
  que `AdminNewProductForm.tsx` (817 líneas) y `AdminUsersCards.tsx` (804
  líneas) eran monolíticos, y pidió ejecutar el split.
- **Archivos:** `components/admin/AdminNewProductForm.tsx`,
  `components/admin/AdminUsersCards.tsx` + 8 archivos nuevos (ver abajo).
- **Commit:** (pendiente)

## Qué había antes

`AdminNewProductForm.tsx` tenía las 4 fases del wizard de alta/edición de
producto (Datos, Detalle, Precios, Especs) y la vista previa lateral todas
inline en un solo componente. `AdminUsersCards.tsx` tenía la tarjeta con flip,
el modal de editar usuario y el modal de nuevo usuario también inline.

## Código nuevo (resumen)

Cada archivo queda como **orquestador** (estado + wire-up) y delega a
componentes hijos, sin cambiar comportamiento:

- `AdminNewProductForm.tsx` (817 → ~330 líneas) → `AdminProductFormStepDatos.tsx`,
  `AdminProductFormStepDetalle.tsx`, `AdminProductFormStepPrecios.tsx`,
  `AdminProductFormStepEspecs.tsx`, `AdminProductPreviewCard.tsx`.
- `AdminUsersCards.tsx` (804 → ~150 líneas) → `AdminUserBadgeCard.tsx`,
  `AdminUserEditModal.tsx`, `AdminUserCreateModal.tsx`, más
  `adminUserBadge.ts` (helpers compartidos: colores de banner, formato de
  fecha, labels de estado).

Verificado: `tsc --noEmit`, `eslint` sobre los 11 archivos y `npm test`
(30/30) sin cambios de comportamiento; probado en el navegador — wizard de
alta de producto completo (4 fases, imagen por URL) y tarjetas de usuario
(flip, editar, nuevo usuario) funcionan igual que antes del split.

## Recomendación

- Ningún cambio funcional — es reorganización pura. Si se retoma el wizard o
  las tarjetas de usuario, editar el archivo del paso/modal específico en vez
  del orquestador.

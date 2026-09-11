# Bugs nuevos: loader de navegación (reduced-motion), rol de admin, precio del carrito

- **Fecha:** 2026-09-11
- **Solicitud:** "Busca error y bugs para solucionar y también recomendaciones como usar ciertos nombres en las variables para que se pueda conectar con el backend más adelante."
- **Archivos:** `components/IntroSplash.tsx`, `app/admin/page.tsx`, `lib/auth-local.ts`, `components/CartProvider.tsx`, `app/carrito/page.tsx`, `data/products.ts`
**Estado (2026-09-11):** bugs 1 y 2 aplicados en
[`2026-09-11-fix-loader-admin-role.md`](./2026-09-11-fix-loader-admin-role.md).
El bug 3 (precio del carrito) **sigue pendiente** de confirmación.

## Método

Se leyó el código en el tip actual de la rama (`0e78c52`) y se levantó un worktree +
servidor propio (puerto 3066) para intentar confirmar visualmente, pero el pane del
navegador estaba oculto en el momento de la revisión (`window.innerWidth === 0`), así
que los hallazgos 1 y 3 se apoyan en lectura de código + trazado manual de la lógica
(no en una captura en vivo); el hallazgo 2 se confirmó leyendo el único punto de
verificación de acceso a `/admin`.

Antes de reportar nada, se revisó `docs/cambios/2026-09-11-preloader-2-5s-logo-engranaje.md`
para confirmar que el timer fijo de 2.5s del `Preloader` es una decisión **explícita**
del brief (no un bug ni una regresión) — ya está anotado por el propio equipo, así que
no se repite aquí.

## Hallazgos

### 1. Doble pantalla de carga al hacer clic en el logo con `prefers-reduced-motion`

En `IntroSplash.tsx`, el manejador de clic tiene tres ramas:

```tsx
if (link.matches("[data-site-intro]")) {
  play("brand");
  return; // <- no marca ningún "reclamo"
}

if ((link.matches("[data-cart-intro]") || isSameOriginPath(link.href, "/carrito")) && ...) {
  if (play("cart")) cartClaimedByClick.current = true; // sí reclama
  return;
}

if (isInternalPageLink(link)) {
  if (play("load")) loadClaimedByClick.current = true; // sí reclama
}
```

Solo la rama del logo (`data-site-intro`) no marca ningún ref de "esta navegación ya
tiene su animación". Con `prefers-reduced-motion: reduce`, el intro `brand` se salta
casi al instante:

```tsx
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const skip = window.setTimeout(hide, 0);
  return () => window.clearTimeout(skip);
}
```

`visibleRef.current` vuelve a `false` en cuestión de milisegundos. Cuando el `pathname`
cambia (la navegación real del logo hacia `/`), el efecto que la vigila no encuentra
ningún reclamo (`loadClaimedByClick.current` sigue en `false`) y llama `play("load")`,
que **sí** pasa el guard (`visibleRef.current` ya es `false`) — resultado: un
`BrandLoader` completo de 2.5s se reproduce justo después del intro que se acababa de
saltar. Con movimiento normal esto no pasa porque el intro `brand` sigue `visible` por
~3.2s, tiempo de sobra para que la navegación real complete y el guard `visibleRef.current`
bloquee el `play("load")` duplicado.

**Solución propuesta:**

```tsx
if (link.matches("[data-site-intro]")) {
  if (play("brand")) loadClaimedByClick.current = true;
  return;
}
```

O, más robusto a futuro: unificar los tres refs (`cartClaimedByClick`,
`loadClaimedByClick`, y el que falta para `brand`) en uno solo,
`claimedVariantForNav: IntroVariant | null`, que el efecto de `pathname` consulte una
sola vez.

### 2. `/admin` no valida ningún rol — cualquier cuenta registrada entra

```tsx
// app/admin/page.tsx
const { user, openAuth } = useAuth();
if (!user) { /* pantalla de login */ }
```

`AuthUser` (`lib/auth-local.ts`) es `{ name: string; email: string }` — no existe
ningún campo de rol/permiso en todo el sistema de cuentas. Como el registro es
autoservicio (`createAccount` en `lib/auth-local.ts`, sin aprobación de nadie),
**cualquier visitante que se registre puede entrar a `/admin`**.

Impacto actual: bajo, porque `chamo-cms-v1` (el estado que edita `/admin`) también vive
en `localStorage` — cada visitante solo ve/edita su propia copia local, no afecta a
otros. Pero es exactamente el tipo de gap que se vuelve grave en cuanto `/admin` hable
con un backend compartido.

**Solución propuesta:** agregar `role: "customer" | "admin"` a `StoredAccount`/`AuthUser`
(ver sección de nombres para backend) y cambiar la verificación a
`user?.role === "admin"`. Mientras no haya backend, la primera cuenta creada podría
recibir `role: "admin"` automáticamente (o dejarlo fijo por variable de entorno) para no
bloquear el flujo de desarrollo.

### 3. El carrito no guarda el precio al momento de agregar

```ts
// app/carrito/page.tsx
const unitTotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
```

`CartLine` (`CartProvider.tsx`) es `{ productId: string; qty: number }` — el precio
**siempre** se relee en vivo desde `data/products.ts` vía `getProductById`. Si el precio
de un producto cambia (algo que va a pasar en cuanto haya un backend/admin de precios
real), el total del carrito de alguien que ya tenía ese producto agregado cambia sin
que lo note ni se le avise.

**Solución propuesta:** capturar `unitPrice` (y `wholesaleUnitPrice` si aplica) en
`CartLine` dentro de `addItem`, usarlo para los totales, y comparar contra el precio
vivo del catálogo solo para mostrar un aviso opcional ("el precio cambió desde que lo
agregaste").

## Nombres de variables — resumen para quien conecte el backend

| Archivo | Campo actual | Sugerencia | Motivo |
| --- | --- | --- | --- |
| `lib/auth-local.ts` | `StoredAccount`/`AuthUser` sin `id` | agregar `id: string` | un backend real asigna su propio ID; hoy la clave de facto es `email` |
| `lib/auth-local.ts` | sin `role` | agregar `role: "customer" \| "admin"` | necesario para el bug 2 y para cualquier permiso futuro |
| `CartProvider.tsx` | `qty` | `quantity` | más explícito/convencional en APIs REST |
| `CartProvider.tsx` | sin precio guardado | agregar `unitPrice` (ver bug 3) | evita que el total cambie solo si el catálogo cambia de precio |
| `FavoritesProvider.tsx` | `ids: string[]` | `{ productId, addedAt }[]` | necesario si se quiere ordenar u sincronizar con cuenta real |
| `data/products.ts` | `discount` | `discountPercent` | el nombre actual no dice la unidad |
| `data/products.ts` | `image` (singular) | quitar, usar `images[0]` | evita que se desincronice con el array |
| `data/products.ts` | `categoryLabel` en cada producto | documentar que es denormalizado | en un backend real suele venir de un `JOIN`, no copiarse a mano |

## Recomendación

- **Aplicado:** bugs 1 y 2 (logo reduced-motion + `role` admin). Ver
  [`2026-09-11-fix-loader-admin-role.md`](./2026-09-11-fix-loader-admin-role.md).
- El bug 3 (precio del carrito) sigue pendiente: cambia el formato de `chamo-cart-v1`.
- La tabla de nombres es una guía, no una lista obligatoria — priorizar `id`/`role` en
  cuentas (bug 2) y `unitPrice` en el carrito (bug 3) porque ya tienen un bug real detrás.

# Categorías del alta de producto: de import directo a `getCategories()` del mock

- **Fecha:** 2026-09-11
- **Solicitud:** "Revisa las nuevas funciones y verifica que todo esté bien para conectar a futuro con el backend."
- **Archivos:** `services/adminApi.ts`, `app/admin/(panel)/productos/nuevo/page.tsx`, `components/admin/AdminNewProductForm.tsx`, `tests/smoke.test.ts`
- **Commit:** (pendiente al momento de escribir esta nota)

## Método

Se leyeron las funciones nuevas del panel que todavía no se habían revisado a fondo:
`AdminNewProductForm.tsx`, `AdminOrdersTable.tsx`,
`app/admin/(panel)/productos/page.tsx`, `app/admin/(panel)/pedidos/page.tsx`. La
pregunta guía: **¿todo lo que muestra o guarda datos pasa por `services/adminApi.ts`?**
— porque ese archivo es, por diseño (ver `API_CONTRACT.md`), el único lugar que hay
que tocar para enchufar el backend real. Cualquier componente que se salte esa capa
va a quedar "atascado" en datos locales cuando el resto del panel ya hable con el
backend.

`productos/page.tsx`, `pedidos/page.tsx`, `AdminOrdersTable.tsx` y el dashboard **sí**
pasan todos por `getProducts`, `getOrders`, `updateOrderStatus`, `getDashboardKPIs` —
sin problema. `AdminNewProductForm.tsx` fue el único que no.

## Hallazgo

```tsx
// components/admin/AdminNewProductForm.tsx — antes
import { mainCategories } from "@/data/home"; // la tienda, no el panel

<select name="categoryId" defaultValue={mainCategories[0]?.slug}>
  {mainCategories.map((category) => (
    <option key={category.slug} value={category.slug}>{category.label}</option>
  ))}
</select>
```

Ya existía una función pensada exactamente para esto:

```ts
// services/adminApi.ts — antes
/** Listado de categorías del mock (útil para el alta de producto)... */
export function listMockCategories() {
  return mainCategories.map((category) => ({
    id: category.slug,
    name: category.label,
    image: category.image,
  }));
}
```

pero **nunca se llamaba desde ningún lado** (`grep` confirmó cero importaciones), y
tampoco cumplía el tipo `Category` de `types/admin.ts`, que exige también
`subcategoriesCount: number` y `status: CategoryStatus` — como la función no tenía un
tipo de retorno explícito, TypeScript no marcó el faltante.

## Código nuevo

```ts
// services/adminApi.ts
/**
 * GET /api/v1/categories
 * Reutiliza `mainCategories` (la tienda) como árbol comercial del panel — el
 * mock no distingue las dos todavía. `subcategoriesCount` queda en 0 porque
 * `MainCategory` no modela subcategorías; el backend real sí debería contarlas.
 */
export async function getCategories(): Promise<Category[]> {
  // TODO Backend: Reemplazar mock con fetch('/api/v1/categories')
  await delay();
  return mainCategories.map((category) => ({
    id: category.slug,
    name: category.label,
    subcategoriesCount: 0,
    status: "active",
    image: category.image,
  }));
}
```

```tsx
// app/admin/(panel)/productos/nuevo/page.tsx
export default async function AdminNuevoProductoPage() {
  const categories = await getCategories();
  return <AdminNewProductForm categories={categories} />;
}
```

```tsx
// components/admin/AdminNewProductForm.tsx
export default function AdminNewProductForm({ categories }: { categories: Category[] }) {
  // ...
  <select name="categoryId" defaultValue={categories[0]?.id}>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>{category.name}</option>
    ))}
  </select>
```

Mismo patrón que ya usan `productos/page.tsx` y `pedidos/page.tsx`: página servidor
`async` que llama al mock y pasa los datos como prop a un componente cliente.

## Verificación

- `npm run build` / `npm run test` (22 tests, +1 nuevo:
  *"getCategories devuelve el contrato Category completo"*) / `npm run lint`: todo en
  verde.
- En vivo: se entró a `/admin/productos/nuevo` logueado y se confirmó que el `<select>`
  de categoría sigue mostrando las 7 categorías (Ferretería, Electricidad, Seguridad,
  Hogar, Herramientas, Construcción, Pinturas) — mismo resultado visual, ahora servido
  por el mock en vez del import directo.

## Recomendación

- Cuando el backend real exista, `getCategories()` ya tiene la firma y el tipo
  correctos — solo hace falta cambiar el cuerpo por el `fetch('/api/v1/categories')`,
  igual que las demás funciones de `services/adminApi.ts`.
- Si se agrega **cualquier** función nueva al panel que lea o escriba datos, esta
  revisión es la plantilla: preguntar "¿pasa por `services/adminApi.ts`?" antes de
  darla por terminada.

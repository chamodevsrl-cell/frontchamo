# Contrato API del Panel Admin (handover backend)

- **Fecha:** 2026-09-11
- **Solicitud:** Estructurar y documentar el Panel Admin para que el backend conecte las APIs (tipos, mock, auth, `API_CONTRACT.md`)
- **Archivos:** `types/admin.ts`, `services/adminApi.ts`, `lib/auth.ts`, `app/admin/**`, `API_CONTRACT.md`, `components/admin/AdminShell.tsx`
- **Commit:** `f847730` — `feat: structure admin panel for backend API handover`

## Qué había antes

El panel (`/admin`) se protegía con la cuenta de la **tienda** (`AuthProvider` /
`isAdminUser`). No había tipos de contrato, ni cliente API, ni login propio.
El dashboard pintaba KPI de diseño en `data/admin.ts` (productos, pedidos hoy,
ventas del mes, stock bajo) que no coincidían con un backend.

## Código anterior

```tsx
// app/admin/layout.tsx — AdminShell envolvía también un hipotético login
export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}

// AdminShell leía useAuth() / isAdminUser() y mostraba un gate de la tienda
```

## Código nuevo

```ts
// types/admin.ts — User, AuthSession, Product, Category, Order, DashboardKPIs
// services/adminApi.ts — loginAdmin, getDashboardKPIs, getProducts, createProduct,
//                        getOrders, updateOrderStatus (mock 300 ms + TODO Backend)
// lib/auth.ts — cookie chamo_admin_session + localStorage + logoutAdmin()
// app/admin/layout.tsx — solo metadata
// app/admin/(panel)/layout.tsx — getAdminSession() o redirect('/admin/login')
```

Credenciales mock: `admin@local.test` / `admin123` (no son datos oficiales).
Contrato HTTP: [`API_CONTRACT.md`](../../API_CONTRACT.md).

## Recomendación

- Al existir backend, reemplazar solo el cuerpo de `services/adminApi.ts` y
  pasar la cookie a httpOnly (`Set-Cookie` del login).
- La gráfica de 7 días y el ranking de SKUs siguen en `data/admin.ts` hasta
  que haya endpoints.
- El CMS de banners/categorías (`chamo-cms-v1`) sigue local; no forma parte
  de este contrato.

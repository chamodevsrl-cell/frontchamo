import type { AdminPermission, AuthSession } from "@/types/admin";

/** Relación 1:1 entre ruta del panel y permiso de {@link PanelRole}. */
export const ADMIN_PATH_PERMISSIONS: {
  href: string;
  permission: AdminPermission;
}[] = [
  { href: "/admin", permission: "dashboard" },
  { href: "/admin/productos", permission: "productos" },
  { href: "/admin/categorias", permission: "categorias" },
  { href: "/admin/marcas", permission: "marcas" },
  { href: "/admin/pedidos", permission: "pedidos" },
  { href: "/admin/clientes", permission: "clientes" },
  { href: "/admin/inventario", permission: "inventario" },
  { href: "/admin/ofertas", permission: "ofertas" },
  { href: "/admin/banners", permission: "banners" },
  { href: "/admin/equipo", permission: "configuracion" },
  { href: "/admin/reportes", permission: "reportes" },
  { href: "/admin/usuarios", permission: "usuarios" },
  { href: "/admin/roles", permission: "roles" },
  { href: "/admin/ajustes", permission: "configuracion" },
  { href: "/admin/configuracion", permission: "configuracion" },
];

export function hasAdminPermission(
  session: AuthSession,
  permission: AdminPermission,
): boolean {
  if (session.permissions.length > 0) {
    return session.permissions.includes(permission);
  }
  return session.role === "admin";
}

export function permissionForAdminPath(pathname: string): AdminPermission | null {
  if (pathname === "/admin" || pathname === "/admin/") return "dashboard";
  const ranked = ADMIN_PATH_PERMISSIONS.filter((item) => item.href !== "/admin").sort(
    (a, b) => b.href.length - a.href.length,
  );
  const match = ranked.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.permission ?? null;
}

export function firstAllowedAdminHref(session: AuthSession): string {
  const allowed = ADMIN_PATH_PERMISSIONS.find((item) =>
    hasAdminPermission(session, item.permission),
  );
  return allowed?.href ?? "/admin/login";
}

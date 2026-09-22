import type { PanelUserStatus } from "@/types/admin";

export const STATUS_LABEL: Record<PanelUserStatus, string> = {
  active: "Activo",
  suspended: "Suspendido",
};

export const STATUS_BADGE: Record<PanelUserStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  suspended: "bg-amber-100 text-amber-800",
};

/**
 * Un color de banner por rol (no por usuario), para distinguir a simple
 * vista qué carga cada uno — p. ej. Gerente General en rojo, Almacén en otro
 * color, etc. `roleId` es estable aunque cambie el nombre del rol.
 */
const ROLE_BANNER_COLORS = [
  "#DC2626", // rojo
  "#127EC9", // azul (brand-primary)
  "#16A34A", // verde
  "#9333EA", // morado
  "#EA580C", // naranja
  "#0E7490", // turquesa
  "#0B3554", // azul marino (brand-dark)
  "#BE185D", // fucsia
] as const;

export function roleBannerColor(roleId: string) {
  let hash = 0;
  for (let index = 0; index < roleId.length; index += 1) {
    hash = (hash * 31 + roleId.charCodeAt(index)) >>> 0;
  }
  return ROLE_BANNER_COLORS[hash % ROLE_BANNER_COLORS.length];
}

export function formatDate(value: string | null) {
  if (!value) return "Nunca";
  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

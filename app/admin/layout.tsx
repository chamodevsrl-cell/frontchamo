import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Chamo Import",
  description: "Panel de administración de Chamo Import S.R.L.",
};

/**
 * Layout de `/admin/*`: solo metadata y children.
 * La protección de sesión y el `AdminShell` viven en `(panel)/layout.tsx`
 * para que `/admin/login` no redirija a sí mismo.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

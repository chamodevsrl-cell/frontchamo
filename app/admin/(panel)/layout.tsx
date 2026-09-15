import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth";

/**
 * Rutas autenticadas del panel (`/admin`, `/admin/productos`, …).
 * Sin sesión válida → `/login` (mismo modal de “Mi cuenta” de la tienda).
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}

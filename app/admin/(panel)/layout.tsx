import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth";

/**
 * Rutas autenticadas del panel (`/admin`, `/admin/productos`, …).
 * Sin sesión válida → `/admin/login`.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}

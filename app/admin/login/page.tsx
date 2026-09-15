import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

/**
 * El staff entra por el mismo modal de “Mi cuenta” que el resto de usuarios.
 * Esta ruta solo redirige: con sesión → panel; sin sesión → `/login`.
 */
export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }
  redirect("/login");
}

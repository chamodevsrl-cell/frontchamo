import AdminUsersCards from "@/components/admin/AdminUsersCards";
import { getAdminSession } from "@/lib/auth";
import { getRoles, getUsers } from "@/services/adminApi";

export default async function AdminUsuariosPage() {
  const [users, roles, session] = await Promise.all([
    getUsers(),
    getRoles(),
    getAdminSession(),
  ]);
  return (
    <AdminUsersCards users={users} roles={roles} currentUserId={session?.id ?? null} />
  );
}

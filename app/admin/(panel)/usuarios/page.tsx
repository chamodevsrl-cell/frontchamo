import AdminUsersTable from "@/components/admin/AdminUsersTable";
import { getRoles, getUsers } from "@/services/adminApi";

export default async function AdminUsuariosPage() {
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);
  return <AdminUsersTable users={users} roles={roles} />;
}

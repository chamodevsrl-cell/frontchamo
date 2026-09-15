import AdminRolesView from "@/components/admin/AdminRolesView";
import { getRoles } from "@/services/adminApi";

export default async function AdminRolesPage() {
  const roles = await getRoles();
  return <AdminRolesView roles={roles} />;
}

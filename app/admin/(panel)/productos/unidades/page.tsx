import AdminUnitsView from "@/components/admin/AdminUnitsView";
import { getUnits } from "@/services/adminApi";

export default async function AdminUnidadesPage() {
  const units = await getUnits();
  return <AdminUnitsView units={units} />;
}

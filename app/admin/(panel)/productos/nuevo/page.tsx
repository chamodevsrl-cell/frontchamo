import AdminNewProductForm from "@/components/admin/AdminNewProductForm";
import { getCategories, getUnits } from "@/services/adminApi";

export default async function AdminNuevoProductoPage() {
  const [categories, units] = await Promise.all([getCategories(), getUnits()]);
  return <AdminNewProductForm categories={categories} units={units} />;
}

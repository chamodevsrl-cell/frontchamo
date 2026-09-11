import AdminNewProductForm from "@/components/admin/AdminNewProductForm";
import { getCategories } from "@/services/adminApi";

export default async function AdminNuevoProductoPage() {
  const categories = await getCategories();
  return <AdminNewProductForm categories={categories} />;
}

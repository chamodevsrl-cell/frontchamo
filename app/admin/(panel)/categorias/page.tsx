import AdminCategoriesCards from "@/components/admin/AdminCategoriesCards";
import { getProducts } from "@/services/adminApi";

export default async function AdminCategoriasPage() {
  const products = await getProducts();
  return <AdminCategoriesCards products={products} />;
}

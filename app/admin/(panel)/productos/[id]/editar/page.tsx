import { notFound } from "next/navigation";
import AdminNewProductForm from "@/components/admin/AdminNewProductForm";
import { getCategories, getProduct, getUnits } from "@/services/adminApi";

export default async function AdminEditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, units, product] = await Promise.all([
    getCategories(),
    getUnits(),
    getProduct(id),
  ]);
  if (!product) notFound();
  return <AdminNewProductForm categories={categories} units={units} product={product} />;
}

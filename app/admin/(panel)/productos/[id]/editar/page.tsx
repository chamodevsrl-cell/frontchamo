import { notFound } from "next/navigation";
import AdminNewProductForm from "@/components/admin/AdminNewProductForm";
import { getCategories, getProduct } from "@/services/adminApi";

export default async function AdminEditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([getCategories(), getProduct(id)]);
  if (!product) notFound();
  return <AdminNewProductForm categories={categories} product={product} />;
}

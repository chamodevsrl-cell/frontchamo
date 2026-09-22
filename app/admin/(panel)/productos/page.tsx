import AdminProductsTable from "@/components/admin/AdminProductsTable";
import { getProducts } from "@/services/adminApi";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q);
  const products = await getProducts({ q: q || undefined });

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-dark/65">
        {products.length} SKU{products.length === 1 ? "" : "s"}
        {q ? ` · filtro “${q}”` : ""} · mock <code>getProducts()</code>
      </p>

      <AdminProductsTable products={products} />
    </div>
  );
}

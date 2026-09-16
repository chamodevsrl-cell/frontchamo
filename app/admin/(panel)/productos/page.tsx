import Link from "next/link";
import { getProducts } from "@/services/adminApi";
import type { ProductStatus } from "@/types/admin";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

const STATUS_LABEL: Record<ProductStatus, string> = {
  active: "Activo",
  draft: "Borrador",
  archived: "Archivado",
};

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

      <div className="overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0B3554] text-xs font-semibold tracking-wide text-white uppercase">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-brand-dark/55">
                  No hay productos con ese filtro.
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
                const low = product.stock <= product.minStock;
                return (
                  <tr
                    key={product.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3 font-semibold text-brand-dark">
                      {product.name}
                      {product.isFeatured ? (
                        <span className="ml-2 rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-dark uppercase">
                          Destacado
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3 font-display font-bold">{soles(product.price)}</td>
                    <td className={`px-4 py-3 ${low ? "font-bold text-red-700" : ""}`}>
                      {product.stock}
                      {low ? " · bajo" : ""}
                    </td>
                    <td className="px-4 py-3">{STATUS_LABEL[product.status]}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="text-sm font-semibold text-brand-primary hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

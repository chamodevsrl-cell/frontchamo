import Link from "next/link";
import { getProducts } from "@/services/adminApi";

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function AdminOfertasPage() {
  const products = await getProducts();
  const offers = products.filter((item) => item.isFeatured || item.status === "active");
  const featured = products.filter((item) => item.isFeatured);

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-dark/65">
        {featured.length} destacados de {offers.length} SKUs activos · mock{" "}
        <code>getProducts()</code>
      </p>
      <div className="overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0B3554] text-xs font-semibold tracking-wide text-white uppercase">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Destacado</th>
            </tr>
          </thead>
          <tbody>
            {featured.map((product, index) => (
              <tr
                key={product.id}
                className={index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"}
              >
                <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                <td className="px-4 py-3 font-semibold">{product.name}</td>
                <td className="px-4 py-3 font-display font-bold">{soles(product.price)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="text-sm font-semibold text-brand-primary hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

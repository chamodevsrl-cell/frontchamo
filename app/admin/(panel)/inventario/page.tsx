import { getProducts } from "@/services/adminApi";

export default async function AdminInventarioPage() {
  const products = await getProducts();
  const low = products.filter((item) => item.stock <= item.minStock);

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-dark/65">
        {products.length} SKUs · {low.length} con stock bajo · mock{" "}
        <code>getProducts()</code>
      </p>
      <div className="overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0B3554] text-xs font-semibold tracking-wide text-white uppercase">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Mínimo</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const alert = product.stock <= product.minStock;
              return (
                <tr
                  key={product.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"}
                >
                  <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className={`px-4 py-3 ${alert ? "font-bold text-red-700" : ""}`}>
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">{product.minStock}</td>
                  <td className="px-4 py-3">
                    {alert ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-700 uppercase">
                        Bajo
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-700">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

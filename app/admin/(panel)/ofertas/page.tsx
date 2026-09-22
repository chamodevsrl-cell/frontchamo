import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import AdminOffersBannerEditor from "@/components/admin/AdminOffersBannerEditor";
import CmsImage from "@/components/CmsImage";
import { featuredProducts } from "@/data/products";
import { formatPrice } from "@/lib/format";

export default function AdminOfertasPage() {
  const offerProducts = featuredProducts.filter(
    (product) => product.badge === "oferta",
  );

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-brand-dark/70">
        Campañas y descuentos del catálogo público. La franja de abajo
        reemplaza el banner de <code>/ofertas</code>; la lista de productos
        muestra lo que hoy se ve en esa página.
      </p>

      <AdminOffersBannerEditor />

      <section className="rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold text-brand-dark">
          Productos en oferta en la tienda
        </h2>
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <p>
            Esta lista viene del catálogo de ejemplo (<code>data/products.ts</code>),
            no de &ldquo;Productos&rdquo; del panel — hoy son dos catálogos
            separados. Ya podés marcar &ldquo;En oferta&rdquo; y poner el %
            de descuento al crear o editar un producto en{" "}
            <Link href="/admin/productos" className="font-semibold underline">
              Productos
            </Link>
            , pero eso todavía no se refleja acá ni en <code>/ofertas</code>
            — falta conectar el backend real para que ambos lean del mismo
            catálogo (ver el handoff de backend, <code>docs/backend-handoff/</code>).
          </p>
        </div>

        {offerProducts.length === 0 ? (
          <p className="mt-4 text-sm text-brand-dark/55">
            No hay productos en oferta en el catálogo de ejemplo.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {offerProducts.map((product) => (
              <li
                key={product.id}
                className="overflow-hidden rounded-xl border border-brand-dark/10"
              >
                <div className="relative aspect-square bg-brand-gray">
                  <CmsImage
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-semibold text-brand-dark">
                    {product.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-brand-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.discountPercent ? (
                      <span className="font-bold text-red-600">
                        -{product.discountPercent}%
                      </span>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

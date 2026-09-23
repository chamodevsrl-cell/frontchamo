"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { deleteProductAction } from "@/app/admin/actions";
import type { Product, ProductStatus } from "@/types/admin";

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

export default function AdminProductsTable({ products }: { products: Product[] }) {
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  return (
    <>
      {/* Móvil / tablet: cards (la tabla no entra en pantallas angostas) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {products.length === 0 ? (
          <p className="rounded-2xl border border-brand-dark/10 bg-white px-4 py-8 text-center text-sm text-brand-dark/55 shadow-sm sm:col-span-2">
            No hay productos con ese filtro.
          </p>
        ) : (
          products.map((product) => {
            const low = product.stock <= product.minStock;
            return (
              <article
                key={product.id}
                className="flex flex-col gap-3 rounded-2xl border border-brand-dark/10 border-l-4 border-l-brand-primary bg-white p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-gray">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center justify-between gap-2 text-[11px] text-brand-dark/50">
                      <span className="truncate font-semibold uppercase">{product.brand}</span>
                      <span className="shrink-0 font-mono">{product.sku}</span>
                    </p>
                    <p className="font-semibold leading-snug text-brand-dark">{product.name}</p>
                    {product.isFeatured || product.isOnOffer ? (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {product.isFeatured ? (
                          <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-dark uppercase">
                            Destacado
                          </span>
                        ) : null}
                        {product.isOnOffer ? (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-700 uppercase">
                            Oferta
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <p className="font-display text-lg font-bold text-brand-dark">
                    {soles(product.price)}
                    {product.isOnOffer && product.oldPrice ? (
                      <span className="ml-1.5 text-xs font-normal text-brand-dark/40 line-through">
                        {soles(product.oldPrice)}
                      </span>
                    ) : null}
                  </p>
                  <div className="text-right text-xs">
                    <p className={low ? "font-bold text-red-700" : "text-brand-dark/70"}>
                      Stock: {product.stock}
                      {low ? " · bajo" : ""}
                    </p>
                    <p className="text-brand-dark/50">{STATUS_LABEL[product.status]}</p>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-brand-dark/8 pt-3">
                  <button
                    type="button"
                    onClick={() => setViewProduct(product)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-dark/12 py-2 text-xs font-semibold text-brand-dark hover:border-brand-primary hover:text-brand-primary"
                  >
                    <Eye className="h-4 w-4" strokeWidth={2} />
                    Ver
                  </button>
                  <Link
                    href={`/admin/productos/${product.id}/editar`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-dark/12 py-2 text-xs font-semibold text-brand-dark hover:border-brand-primary hover:text-brand-primary"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={2} />
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(product)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white shadow-sm lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0B3554] text-xs font-semibold tracking-wide text-white uppercase">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
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
                      {product.isOnOffer ? (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-700 uppercase">
                          Oferta
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3 font-display font-bold">
                      {soles(product.price)}
                      {product.isOnOffer && product.oldPrice ? (
                        <span className="ml-1.5 text-xs font-normal text-brand-dark/40 line-through">
                          {soles(product.oldPrice)}
                        </span>
                      ) : null}
                    </td>
                    <td className={`px-4 py-3 ${low ? "font-bold text-red-700" : ""}`}>
                      {product.stock}
                      {low ? " · bajo" : ""}
                    </td>
                    <td className="px-4 py-3">{STATUS_LABEL[product.status]}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewProduct(product)}
                          className="rounded-lg p-2 text-brand-dark/50 hover:bg-brand-gray hover:text-brand-primary"
                          aria-label={`Ver ${product.name}`}
                          title="Ver"
                        >
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        </button>
                        <Link
                          href={`/admin/productos/${product.id}/editar`}
                          className="rounded-lg p-2 text-brand-dark/50 hover:bg-brand-gray hover:text-brand-primary"
                          aria-label={`Editar ${product.name}`}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={2} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="rounded-lg p-2 text-brand-dark/50 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Eliminar ${product.name}`}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {viewProduct ? (
        <ViewProductModal product={viewProduct} onClose={() => setViewProduct(null)} />
      ) : null}

      {deleteTarget ? (
        <DeleteProductModal product={deleteTarget} onClose={() => setDeleteTarget(null)} />
      ) : null}
    </>
  );
}

function ViewProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-product-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[3px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border-[3px] border-brand-primary bg-white shadow-[0_20px_50px_rgba(11,53,84,0.35)]">
        <div className="flex items-center justify-between border-b-2 border-brand-primary/25 bg-brand-primary/8 px-5 py-3.5">
          <p
            id="view-product-modal-title"
            className="font-display text-sm font-bold tracking-wide text-brand-primary uppercase"
          >
            Ver producto
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-primary/40 text-brand-primary transition hover:bg-brand-primary hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-h-[min(80vh,700px)] overflow-y-auto px-5 py-5">
          <div className="flex gap-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-gray">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-1">
                {product.isFeatured ? (
                  <span className="inline-block rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-bold text-brand-gold uppercase">
                    Destacado
                  </span>
                ) : null}
                {product.isOnOffer ? (
                  <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 uppercase">
                    Oferta
                  </span>
                ) : null}
              </div>
              <p className="mt-1 truncate text-xs font-semibold text-brand-dark/50 uppercase">
                {product.brand}
              </p>
              <p className="font-display text-lg font-bold text-brand-dark">
                {product.name}
              </p>
              <p className="text-xs text-brand-dark/40">SKU: {product.sku}</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-lg font-bold text-brand-primary">
                  {soles(product.price)}
                </span>
                {product.isOnOffer && product.oldPrice ? (
                  <span className="text-xs text-brand-dark/40 line-through">
                    {soles(product.oldPrice)}
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <p>
              <span className="font-semibold">Stock:</span> {product.stock}
              {product.stock <= product.minStock ? " · bajo" : ""}
            </p>
            <p>
              <span className="font-semibold">Estado:</span>{" "}
              {STATUS_LABEL[product.status]}
            </p>
          </div>

          {product.descriptionShort ? (
            <p className="mt-3 text-sm text-brand-dark/70">{product.descriptionShort}</p>
          ) : null}

          {product.packaging.length > 0 ? (
            <div className="mt-4 border-t border-brand-dark/10 pt-3">
              <p className="text-xs font-semibold tracking-wide text-brand-dark/50 uppercase">
                Presentaciones de venta
              </p>
              <div className="mt-1.5 space-y-1 text-sm">
                {product.packaging.map((row) => (
                  <p key={row.unit}>
                    <span className="font-semibold">{row.unit}:</span> {row.content}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {product.specs.length > 0 ? (
            <div className="mt-4 border-t border-brand-dark/10 pt-3">
              <p className="text-xs font-semibold tracking-wide text-brand-dark/50 uppercase">
                Ficha técnica
              </p>
              <div className="mt-1.5 space-y-1 text-sm">
                {product.specs.map((row) => (
                  <p key={row.label}>
                    <span className="font-semibold">{row.label}:</span> {row.value}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          <Link
            href={`/admin/productos/${product.id}/editar`}
            className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6aad]"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
            Editar producto
          </Link>
        </div>
      </div>
    </div>
  );
}

function DeleteProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function confirmDelete() {
    setError("");
    setPending(true);
    try {
      const result = await deleteProductAction(product.id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo borrar el producto.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-product-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/55 backdrop-blur-[3px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border-[3px] border-red-500 bg-white shadow-[0_20px_50px_rgba(11,53,84,0.35)]">
        <div className="flex items-center justify-between border-b-2 border-red-200 bg-red-50 px-5 py-3.5">
          <p
            id="delete-product-modal-title"
            className="font-display text-sm font-bold tracking-wide text-red-700 uppercase"
          >
            Eliminar producto
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-red-300 text-red-600 transition hover:bg-red-600 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-5 py-5">
          <p className="text-sm text-brand-dark/80">
            ¿Seguro que quieres eliminar <strong>{product.name}</strong> (
            {product.sku})? Esta acción no se puede deshacer.
          </p>
          {error ? (
            <p className="mt-2 text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={confirmDelete}
              className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {pending ? "Eliminando…" : "Sí, eliminar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-brand-dark/15 px-3 py-2 text-sm font-semibold text-brand-dark hover:border-brand-primary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

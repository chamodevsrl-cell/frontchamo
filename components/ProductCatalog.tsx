"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/components/CartProvider";
import type { FeaturedProduct } from "@/data/products";

type ProductCatalogProps = {
  products: FeaturedProduct[];
  emptyMessage?: string;
};

export default function ProductCatalog({
  products,
  emptyMessage = "No hay productos para estos filtros.",
}: ProductCatalogProps) {
  const [selected, setSelected] = useState<FeaturedProduct | null>(null);
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-brand-dark/10 bg-white px-4 py-8 text-center text-sm text-brand-dark/65 dark:bg-[#102a40] dark:text-white/70">
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              onOpen={() => setSelected(product)}
              onAddToCart={() => addItem(product.id, 1)}
            />
          </li>
        ))}
      </ul>
      {selected ? (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
          onSelectProduct={(product) => setSelected(product)}
        />
      ) : null}
    </>
  );
}

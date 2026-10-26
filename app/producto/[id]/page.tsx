import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";
import {
  featuredProducts,
  getProductById,
  getRelatedProducts,
} from "@/data/products";

export async function generateStaticParams() {
  return featuredProducts.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Producto | Chamo Import" };
  return {
    title: `${product.name} | Chamo Import`,
    description: product.description,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const related = getRelatedProducts(product, 6);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb]">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <ProductDetail key={product.id} product={product} related={related} />
      </main>
    </div>
  );
}

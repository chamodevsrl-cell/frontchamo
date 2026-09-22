import type { NextRequest } from "next/server";
import { searchCatalog } from "@/data/products";

// TODO Backend: reemplazar searchCatalog() (array estático de data/products.ts) con una
// consulta real — ver API_CONTRACT_TIENDA.md §2 (GET /api/v1/products). Mantener la forma
// de salida { products: FeaturedProduct[] } para no tocar ProductCatalog.tsx/CatalogFilters.tsx.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const products = searchCatalog({
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    brand: searchParams.get("brand") ?? "",
  });

  return Response.json({ products });
}

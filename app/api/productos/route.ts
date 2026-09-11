import type { NextRequest } from "next/server";
import { searchCatalog } from "@/data/products";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const products = searchCatalog({
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    brand: searchParams.get("brand") ?? "",
  });

  return Response.json({ products });
}

"use server";

import { listAllProducts } from "@/data/products/get";

export async function searchProductsAction(query: string) {
  if (!query || query.trim() === "") {
    return { products: [], total: 0 };
  }

  return await listAllProducts({
    search: query,
    limit: "5", // Limitamos la vista previa a 5 resultados
  });
}

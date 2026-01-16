import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { ProductService } from "@/server/modules/products/service";
import { toProductDto } from "@/shared/utils/dto";

type SearchParams = {
  search?: string;
  category?: string;
  businessId?: string;
  page?: string;
  limit?: string;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

export async function listAllProducts(searchParams?: SearchParams) {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");
  const { limit, page, search, sortBy, category, businessId } =
    searchParams || {};
  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;

  const data = await ProductService.listAll({
    businessId,
    category,
    limit: currentLimit,
    page: currentPage,
    search,
    sort: sortBy,
  });

  return {
    ...data,
    products: data.products.map(toProductDto),
  };
}

export async function getRecentProducts() {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  const products = await ProductService.getRecent();
  return products.map(toProductDto);
}

export async function getProductById(id: string) {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  const { product } = await ProductService.getById(id);
  return product ? toProductDto(product) : null;
}

export async function getSimilarProducts(params: {
  productId: string;
  limit?: number;
}) {
  "use cache";
  cacheTag("products");
  cacheLife("days");

  // Replicate logic from API: get product first to find category
  const { product } = await ProductService.getById(params.productId);
  if (!product?.categoryId) throw new Error("Product not found");

  const products = await ProductService.getSimilar(
    product.categoryId,
    params.productId,
  );

  return products.map(toProductDto);
}

/**
 * Specifically for generateStaticParams
 */
export const getProductIds = cache(async () => {
  const products = await db.query.product.findMany();
  return products.map((p) => ({ id: p.id }));
});

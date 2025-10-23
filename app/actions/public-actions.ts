"use server";

import prisma from "@/lib/prisma";
import { BusinessDAL } from "../data/business/business.dal";
import { ProductDAL } from "../data/product/product.dal";
import type { ProductDTO } from "../data/product/product.dto";

export async function getPublicBusinesses(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const businessDAL = await BusinessDAL.public();
  const { search, category, page = 1, limit = 12 } = params || {};
  const { businesses, total } = await businessDAL.listAllBusinesses({
    search,
    category,
    page,
    limit,
  });


  return {
    businesses,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getPublicProducts(params?: {
  search?: string;
  category?: string;
  businessId?: string;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
}): Promise<{
  products: ProductDTO[];
  total: number;
  pages: number;
  currentPage: number;
}> {
  const {
    search,
    category,
    businessId,
    page = 1,
    limit = 12,
    sort,
  } = params || {};
  const productDAL = await ProductDAL.public();
  const { products, total, pages, currentPage } =
    await productDAL.listAllProducts({
      search,
      category,
      businessId,
      page,
      limit,
      sort,
    });

  return {
    products,
    total,
    pages,
    currentPage,
  };
}

export async function getPublicBusiness(businessId: string) {
  const businessDAL = await BusinessDAL.public();
  const business = businessDAL.getBusinessById(businessId);

  return business;
}

export async function getPublicProduct(productId: string) {
  const productDAL = await ProductDAL.public();
  const product = productDAL.getProductById(productId);

  return product;
}

export async function getCategories() {
  const categories = await prisma.product.findMany({
    where: {
      active: true,
      category: { not: null },
      business: {
        planStatus: "ACTIVE",
      },
    },
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  return categories.map((c) => c.category).filter(Boolean) as string[];
}

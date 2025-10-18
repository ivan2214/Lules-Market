"use server";

import type { Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function getPublicBusinesses(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const { search, category, page = 1, limit = 12 } = params || {};

  const where: Prisma.BusinessWhereInput = {
    planStatus: "ACTIVE" as const,
    products: {
      some: {
        active: true,
      },
    },
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(category && { category }),
  };

  const [businesses, total] = await prisma.$transaction([
    prisma.business.findMany({
      where,
      include: {
        products: {
          where: { active: true },
          take: 4,
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        },
        logo: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        // Premium businesses first
        {
          plan: "asc" as const,
        },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.business.count({ where }),
  ]);

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
}) {
  const {
    search,
    category,
    businessId,
    page = 1,
    limit = 24,
    sort,
  } = params || {};

  const where: Prisma.ProductWhereInput = {
    active: true,
    business: {
      planStatus: "ACTIVE" as const,
    },
    ...(businessId && { businessId }),
    ...(category && { category }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput[] = [
    { featured: "desc" },
    { business: { plan: "asc" as const } },
    { createdAt: "desc" },
  ];

  if (sort) {
    const [field, direction] = sort.split("_") as [
      Prisma.SortOrder,
      Prisma.SortOrderInput
    ];
    orderBy.unshift({ [field]: direction });
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            plan: true,
            whatsapp: true,
            phone: true,
            email: true,
            facebook: true,
            instagram: true,
            twitter: true,
          },
        },
        images: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getPublicBusiness(businessId: string) {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      planStatus: "ACTIVE",
    },
    include: {
      logo: true,
      coverImage: true,
      products: {
        include: {
          images: true,
        },
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  return business;
}

export async function getPublicProduct(productId: string) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      active: true,
      business: {
        planStatus: "ACTIVE",
      },
    },
    include: {
      business: true,
      images: true,
    },
  });

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

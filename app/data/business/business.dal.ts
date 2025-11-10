import "server-only";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { deleteS3Object } from "@/app/actions/s3";
import type { Prisma } from "@/app/generated/prisma";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";
import type { CategoryDTO } from "../category/category.dto";
import type { ProductDTO } from "../product/product.dto";

import {
  type BusinessCreateInput,
  BusinessCreateInputSchema,
  type BusinessDTO,
  type BusinessUpdateInput,
  BusinessUpdateInputSchema,
} from "./business.dto";
import { canEditBusiness } from "./business.policy";
import { requireBusiness } from "./require-busines";

// ========================================
// FUNCIONES PÚBLICAS (CACHEABLES)
// ========================================

export async function listAllBusinesses({
  search,
  categories,
  limit,
  page,
}: {
  search?: string;
  categories?: BusinessDTO["categories"];
  page: number;
  limit: number;
}) {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.PUBLIC_BUSINESSES, CACHE_TAGS.BUSINESSES);

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
    ...(categories && {
      category: { in: categories, mode: "insensitive" as const },
    }),
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

  return { businesses, total };
}

export async function listAllBusinessesByCategories({
  categories,
}: {
  categories: CategoryDTO[];
}) {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.PUBLIC_BUSINESSES, CACHE_TAGS.BUSINESSES);

  const categoriesIds = categories.map((category) => category.id);

  const businesses = await prisma.business.findMany({
    where: {
      categories: {
        some: {
          id: {
            in: categoriesIds,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          products: true,
        },
      },
      logo: {
        select: {
          key: true,
          url: true,
        },
      },
    },
    orderBy: [
      {
        plan: "asc" as const,
      },
      { createdAt: "desc" },
    ],
  });

  return { businesses };
}

export async function getBusinessById(
  businessId: string
): Promise<BusinessDTO | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(
    CACHE_TAGS.PUBLIC_BUSINESSES,
    CACHE_TAGS.BUSINESSES,
    `business-${businessId}`
  );

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

// ========================================
// FUNCIONES PRIVADAS (NO CACHEABLES)
// ========================================

export async function getMyBusiness(): Promise<BusinessDTO> {
  const { business } = await requireBusiness();

  return business;
}

export async function createBusiness(
  data: BusinessCreateInput
): Promise<ActionResult> {
  const validated = BusinessCreateInputSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

  const { userId, email, name } = await requireBusiness();

  // Check if user already has a business
  const existing = await prisma.business.findUnique({
    where: { userId },
  });
  if (existing) return { errorMessage: "Ya tienes un negocio registrado" };

  const alreadyEmailBusiness = await prisma.business.findUnique({
    where: { email: email },
  });

  if (alreadyEmailBusiness)
    return { errorMessage: "Ya tienes un negocio registrado con este email" };

  try {
    const {
      description,
      phone,
      whatsapp,
      website,
      facebook,
      instagram,
      address,
      logo,
      coverImage,
    } = data as BusinessCreateInput;

    const created = await prisma.business.create({
      data: {
        name,
        description,
        phone,
        whatsapp,
        email,
        website,
        facebook,
        instagram,
        address,
        user: { connect: { id: userId } },
        logo: logo ? { create: logo as Prisma.ImageCreateInput } : undefined,
        coverImage: coverImage
          ? { create: coverImage as Prisma.ImageCreateInput }
          : undefined,
      },
    });

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(CACHE_TAGS.BUSINESSES);

    return {
      successMessage: "Negocio creado exitosamente",
      data: created,
    };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al crear negocio",
    };
  }
}

export async function updateBusiness(
  data: BusinessUpdateInput
): Promise<ActionResult> {
  const validated = BusinessUpdateInputSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

  const { business, email, userId } = await requireBusiness();

  if (!business) return { errorMessage: "No tienes un negocio registrado" };

  const userPolicy = {
    userId,
    email,
    activePlan: business.plan,
  };

  if (
    !canEditBusiness(userPolicy, { id: business.id, userId: business.userId })
  ) {
    return { errorMessage: "No tienes permisos para editar este negocio" };
  }

  const { logo, coverImage, ...rest } = data as BusinessUpdateInput;

  try {
    // eliminar logo previo si está siendo reemplazado
    if (logo) {
      await prisma.image.deleteMany({
        where: { logoBusinessId: business.id },
      });
    }
    if (coverImage) {
      await prisma.image.deleteMany({
        where: { coverBusinessId: business.id },
      });
    }

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        ...rest,
        logo: logo ? { create: logo as Prisma.ImageCreateInput } : undefined,
        coverImage: coverImage
          ? { create: coverImage as Prisma.ImageCreateInput }
          : undefined,
      },
    });

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(CACHE_TAGS.BUSINESSES);
    updateTag(`business-${business.id}`);

    return {
      successMessage: "Negocio actualizado exitosamente",
      data: updated,
    };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al actualizar negocio",
    };
  }
}

export async function getBusinessProducts({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<ProductDTO[]> {
  // NO usar "use cache" - requiere autenticación
  const { business } = await requireBusiness();

  if (!business) return [];

  const products = await prisma.product.findMany({
    where: { businessId: business.id },
    take: limit,
    skip: offset,
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
    },
  });

  return products;
}
export async function deleteBusiness(): Promise<ActionResult> {
  const { business } = await requireBusiness();
  if (!business) return { errorMessage: "No tienes un negocio registrado" };

  try {
    // Buscar todo lo necesario en paralelo
    const [products, logoBusiness, coverBusiness] = await Promise.all([
      prisma.product.findMany({
        where: { businessId: business.id },
        select: { id: true },
      }),
      prisma.image.findUnique({ where: { logoBusinessId: business.id } }),
      prisma.image.findUnique({ where: { coverBusinessId: business.id } }),
    ]);

    // Obtener imágenes de productos
    const productIds = products.map((p) => p.id);
    const imagesProducts = productIds.length
      ? await prisma.image.findMany({
          where: { productId: { in: productIds } },
          select: { key: true },
        })
      : [];

    // Agrupar todas las imágenes a borrar
    const allImages = [
      ...imagesProducts,
      ...(logoBusiness ? [logoBusiness] : []),
      ...(coverBusiness ? [coverBusiness] : []),
    ];

    // Borrar imágenes de S3 y DB en paralelo
    await Promise.all(
      allImages.map(async (image) => {
        await Promise.all([
          deleteS3Object({ key: image.key }).catch(console.error), // no bloquea si una falla
          prisma.image
            .delete({ where: { key: image.key } })
            .catch(console.error),
        ]);
      })
    );

    // Borrar productos, usuario y relaciones en paralelo
    await Promise.all([
      prisma.product.deleteMany({ where: { businessId: business.id } }),
      prisma.session.deleteMany({ where: { userId: business.userId } }),
      prisma.account.deleteMany({ where: { userId: business.userId } }),
      prisma.business.delete({ where: { id: business.id } }),
      prisma.user.delete({ where: { id: business.userId } }),
    ]);

    // Invalidar caché
    [
      CACHE_TAGS.PUBLIC_BUSINESSES,
      CACHE_TAGS.BUSINESSES,
      CACHE_TAGS.businessById(business.id),
      CACHE_TAGS.PUBLIC_PRODUCTS,
      CACHE_TAGS.PRODUCTS,
    ].forEach(updateTag);

    return { successMessage: "Negocio eliminado exitosamente" };
  } catch (error) {
    console.error(error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al eliminar negocio",
    };
  }
}

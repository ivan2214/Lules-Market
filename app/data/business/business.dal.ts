import "server-only";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { deleteS3Object } from "@/app/actions/s3";
import type { Prisma } from "@/app/generated/prisma";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";
import type { ProductDTO } from "../product/product.dto";
import { requireUser } from "../user/require-user";
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
  category,
  limit,
  page,
}: {
  search?: string;
  category?: string;
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

export async function getBusinessById(
  businessId: string,
): Promise<BusinessDTO | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(
    CACHE_TAGS.PUBLIC_BUSINESSES,
    CACHE_TAGS.BUSINESSES,
    `business-${businessId}`,
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
  data: BusinessCreateInput,
): Promise<ActionResult> {
  const validated = BusinessCreateInputSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

  const user = await requireUser();

  // Check if user already has a business
  const existing = await prisma.business.findUnique({
    where: { userId: user.id },
  });
  if (existing) return { errorMessage: "Ya tienes un negocio registrado" };

  try {
    const {
      name,
      description,
      phone,
      whatsapp,
      email,
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
        user: { connect: { id: user.id } },
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
  data: BusinessUpdateInput,
): Promise<ActionResult> {
  const validated = BusinessUpdateInputSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

  const user = await requireUser();
  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });
  if (!business) return { errorMessage: "No tienes un negocio registrado" };

  if (!canEditBusiness(user, { id: business.id, userId: business.userId })) {
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
  const user = await requireUser();

  const products = await prisma.product.findMany({
    where: { business: { userId: user.id } },
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
  const user = await requireUser();

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });
  if (!business) return { errorMessage: "No tienes un negocio registrado" };

  try {
    await prisma.business.delete({ where: { id: business.id } });
    const allProductsBusiness = await prisma.product.findMany({
      where: { businessId: business.id },
    });
    const imagesProducts = await prisma.image.findMany({
      where: { productId: { in: allProductsBusiness.map((p) => p.id) } },
    });
    const logoBusiness = await prisma.image.findUnique({
      where: { logoBusinessId: business.id },
    });
    const coverBusiness = await prisma.image.findUnique({
      where: { coverBusinessId: business.id },
    });

    // eliminar la imagenes de s3
    for (const image of imagesProducts) {
      await deleteS3Object({ key: image.key });
    }
    if (coverBusiness) {
      await deleteS3Object({ key: coverBusiness.key });
    }
    if (logoBusiness) {
      await deleteS3Object({ key: logoBusiness.key });
    }

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(CACHE_TAGS.BUSINESSES);
    updateTag(CACHE_TAGS.businessById(business.id));
    updateTag(CACHE_TAGS.PUBLIC_PRODUCTS);
    updateTag(CACHE_TAGS.PRODUCTS);

    return { successMessage: "Negocio eliminado exitosamente" };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al eliminar negocio",
    };
  }
}

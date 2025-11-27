"use server";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { deleteS3Object } from "@/app/actions/s3";
import type { Prisma } from "@/app/generated/prisma/client";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";
import { daysFromNow } from "@/utils";
import type { CategoryDTO } from "../category/category.dto";
import type { ProductDTO } from "../product/product.dto";
import { requireUser } from "../user/require-user";
import {
  type BusinessDTO,
  type BusinessSetupInput,
  BusinessSetupInputSchema,
  type BusinessUpdateInput,
  BusinessUpdateInputSchema,
} from "./business.dto";
import { canEditBusiness } from "./business.policy";
import { getCurrentBusiness } from "./require-busines";

// ========================================
// FUNCIONES PÚBLICAS (CACHEABLES)
// ========================================

export async function listAllBusinesses({
  search,
  category,
  limit,
  page,
  minRating,
  sortBy,
}: {
  search?: string;
  category?: string;
  page: number;
  limit: number;
  sortBy?: string;
  minRating?: number;
}) {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.PUBLIC_BUSINESSES, CACHE_TAGS.BUSINESSES);

  const where: Prisma.BusinessWhereInput = {
    isActive: true,
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
    ...(category && {
      category: {
        value: {
          contains: category,
          mode: "insensitive" as const,
        },
      },
    }),
    ...(minRating && {
      averageRating: {
        gte: minRating,
      },
    }),
  };

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      include: {
        products: {
          include: {
            images: true,
          },
          where: { active: true },
          take: 4,
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        },
        logo: true,
        category: true,
        coverImage: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        {
          currentPlan: {
            expiresAt: "desc",
          },
        },
        { createdAt: "desc" },
        ...(sortBy
          ? [
              {
                [sortBy]: "desc" as const,
              },
            ]
          : []),
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.business.count({ where }),
  ]);

  return { businesses, total };
}

export async function listAllBusinessesByCategories({
  category,
}: {
  category?: CategoryDTO | null;
}): Promise<{ businesses: BusinessDTO[] }> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.PUBLIC_BUSINESSES, CACHE_TAGS.BUSINESSES);

  const businesses = await prisma.business.findMany({
    where: {
      category: {
        value: {
          contains: category?.value,
          mode: "insensitive" as const,
        },
      },
    },
    include: {
      products: {
        include: {
          images: true,
        },
      },
      logo: true,
      category: true,
      coverImage: true,
      _count: {
        select: { products: true },
      },
      reviews: {
        include: {
          author: {
            include: {
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        currentPlan: {
          expiresAt: "desc",
        },
      },
      { createdAt: "desc" },
    ],
  });

  return { businesses };
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
    },
    include: {
      logo: true,
      coverImage: true,
      category: true,
      products: {
        include: {
          images: true,
          category: true,
          reviews: {
            include: {
              author: {
                include: {
                  avatar: true,
                },
              },
            },
          },
        },
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      },
      reviews: {
        include: {
          author: {
            include: {
              avatar: true,
            },
          },
        },
      },
    },
  });
  return business;
}

export async function businessSetup(
  data: BusinessSetupInput,
): Promise<ActionResult> {
  const validated = BusinessSetupInputSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

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
      category,
      tags,
    } = data as BusinessSetupInput;

    const user = await requireUser();

    const alreadyEmailBusiness = await prisma.business.findUnique({
      where: { email: user.email },
    });

    if (alreadyEmailBusiness)
      return { errorMessage: "Ya tienes un negocio registrado con este email" };

    const currentPlanType = await prisma.plan
      .findUnique({
        where: {
          type: "FREE",
        },
        select: {
          type: true,
        },
      })
      .then((plan) => plan?.type);

    if (!currentPlanType) {
      return {
        errorMessage: "Error al obtener el plan",
      };
    }

    const business = await prisma.business.create({
      data: {
        name: user.name,
        description,
        phone,
        whatsapp,
        email: user.email,
        website,
        facebook,
        instagram,
        address,
        userId: user.userId,
        logo: logo ? { create: logo as Prisma.ImageCreateInput } : undefined,
        coverImage: coverImage
          ? { create: coverImage as Prisma.ImageCreateInput }
          : undefined,
        status: "ACTIVE",
        tags,
      },
    });

    await prisma.trial.create({
      data: {
        businessId: business.id,
        plan: currentPlanType,
        expiresAt: daysFromNow(30), // Expire in 30 days
        activatedAt: new Date(),
        isActive: true,
      },
    });

    await prisma.currentPlan.create({
      data: {
        businessId: business.id,
        planType: currentPlanType,
        expiresAt: daysFromNow(30), // Expire in 30 days
        activatedAt: new Date(),
        isActive: true,
        isTrial: true,
      },
    });

    const categoryDB = await prisma.category.findUnique({
      where: { value: category.toLowerCase() },
    });

    if (categoryDB) {
      await prisma.business.update({
        where: {
          id: business.id,
        },
        data: {
          category: {
            connect: {
              id: categoryDB.id,
            },
          },
        },
      });
    } else {
      await prisma.business.update({
        where: {
          id: business.id,
        },
        data: {
          category: {
            create: {
              value: category.toLowerCase(),
              label: category,
            },
          },
        },
      });
    }

    return {
      successMessage: "Negocio configurado exitosamente",
    };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al crear negocio",
    };
  } finally {
    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(CACHE_TAGS.BUSINESSES);
    redirect("/dashboard");
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

  const { currentBusiness } = await getCurrentBusiness();

  const userPolicy = {
    userId: currentBusiness.userId,
    email: currentBusiness.email,
    activePlan: currentBusiness.currentPlan?.planType || "FREE",
  };

  if (
    !canEditBusiness(userPolicy, {
      id: currentBusiness.id,
      userId: currentBusiness.userId,
    })
  ) {
    return { errorMessage: "No tienes permisos para editar este negocio" };
  }

  const {
    logo,
    coverImage,
    address,
    category,
    description,
    email: newEmail,
    name,
    facebook,
    instagram,
    phone,
    website,
    whatsapp,
  } = data as BusinessUpdateInput;

  try {
    // eliminar logo previo si está siendo reemplazado
    if (logo) {
      await prisma.image.deleteMany({
        where: { logoBusinessId: currentBusiness.id },
      });
      if (currentBusiness.logo?.key) {
        await deleteS3Object({ key: currentBusiness.logo?.key });
      }
    }
    if (coverImage) {
      await prisma.image.deleteMany({
        where: { coverBusinessId: currentBusiness.id },
      });
      if (currentBusiness.coverImage?.key) {
        await deleteS3Object({ key: currentBusiness.coverImage?.key });
      }
    }

    // categorias a quitar para ese negocio
    const categoryToDisconnect = currentBusiness.category?.value;
    // conectamos categorias nuevas al negocio
    await prisma.business.update({
      where: { id: currentBusiness.id },
      data: {
        category: {
          connect: {
            value: category,
          },
        },
      },
    });

    // desconectamos categorias antiguas del negocio
    await prisma.business.update({
      where: { id: currentBusiness.id },
      data: {
        category: {
          disconnect: {
            value: categoryToDisconnect,
          },
        },
      },
    });

    const updated = await prisma.business.update({
      where: { id: currentBusiness.id },
      data: {
        name,
        description,
        phone,
        whatsapp,
        email: newEmail,
        website,
        facebook,
        instagram,
        address,
        logo: logo ? { create: logo as Prisma.ImageCreateInput } : undefined,
        coverImage: coverImage
          ? { create: coverImage as Prisma.ImageCreateInput }
          : undefined,
      },
    });

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(CACHE_TAGS.BUSINESSES);
    updateTag(`business-${currentBusiness.id}`);

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
  const { currentBusiness } = await getCurrentBusiness();

  const products = await prisma.product.findMany({
    where: { businessId: currentBusiness.id },
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
  const { currentBusiness } = await getCurrentBusiness();

  try {
    // Buscar todo lo necesario en paralelo
    const [products, logoBusiness, coverBusiness] = await Promise.all([
      prisma.product.findMany({
        where: { businessId: currentBusiness.id },
        select: { id: true },
      }),
      prisma.image.findUnique({
        where: { logoBusinessId: currentBusiness.id },
      }),
      prisma.image.findUnique({
        where: { coverBusinessId: currentBusiness.id },
      }),
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
      }),
    );

    // Borrar productos, usuario y relaciones en paralelo
    await Promise.all([
      prisma.product.deleteMany({ where: { businessId: currentBusiness.id } }),
      prisma.session.deleteMany({ where: { userId: currentBusiness.userId } }),
      prisma.account.deleteMany({ where: { userId: currentBusiness.userId } }),
      prisma.business.delete({ where: { id: currentBusiness.id } }),
      prisma.user.delete({ where: { id: currentBusiness.userId } }),
    ]);

    // Invalidar caché
    [
      CACHE_TAGS.PUBLIC_BUSINESSES,
      CACHE_TAGS.BUSINESSES,
      CACHE_TAGS.businessById(currentBusiness.id),
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

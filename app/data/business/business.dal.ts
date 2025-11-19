import "server-only";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { connection } from "next/server";
import { deleteS3Object } from "@/app/actions/s3";
import type { Prisma } from "@/app/generated/prisma";
import type { ActionResult } from "@/hooks/use-action";
import { auth } from "@/lib/auth";
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
import { requireBusiness } from "./require-busines";

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

  const [businesses, total] = await prisma.$transaction([
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

// ========================================
// FUNCIONES PRIVADAS (NO CACHEABLES)
// ========================================

export async function getMyBusiness(): Promise<BusinessDTO> {
  await connection();

  const session = await requireUser();

  const business = await prisma.business.findUnique({
    where: { userId: session.userId },
    include: {
      logo: true,
      coverImage: true,
      user: {
        include: {
          admin: true,

          business: true,
        },
      },
      products: {
        include: {
          images: true,
        },
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!business) {
    throw new Error("No se encontro el negocio");
  }

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

    const { userId, email, name } = await requireBusiness();

    const alreadyEmailBusiness = await prisma.business.findUnique({
      where: { email: email },
    });

    if (alreadyEmailBusiness)
      return { errorMessage: "Ya tienes un negocio registrado con este email" };

    const emailVerified = await prisma.user.findUnique({
      where: { email: email, AND: { emailVerified: true } },
    });

    if (!emailVerified) {
      auth.api.sendVerificationEmail({
        body: {
          email,
        },
      });
    }

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
        name,
        description,
        phone,
        whatsapp,
        email,
        website,
        facebook,
        instagram,
        address,
        userId,
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

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(CACHE_TAGS.BUSINESSES);

    return {
      successMessage: "Negocio configurado exitosamente",
      data: business,
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

  const { business, email, userId } = await requireBusiness();

  if (!business) return { errorMessage: "No tienes un negocio registrado" };

  const userPolicy = {
    userId,
    email,
    activePlan: business.currentPlan?.planType || "FREE",
  };

  if (
    !canEditBusiness(userPolicy, { id: business.id, userId: business.userId })
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
        where: { logoBusinessId: business.id },
      });
      if (business.logo?.key) {
        await deleteS3Object({ key: business.logo?.key });
      }
    }
    if (coverImage) {
      await prisma.image.deleteMany({
        where: { coverBusinessId: business.id },
      });
      if (business.coverImage?.key) {
        await deleteS3Object({ key: business.coverImage?.key });
      }
    }

    // categorias a quitar para ese negocio
    const categoryToDisconnect = business.category?.value;
    // conectamos categorias nuevas al negocio
    await prisma.business.update({
      where: { id: business.id },
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
      where: { id: business.id },
      data: {
        category: {
          disconnect: {
            value: categoryToDisconnect,
          },
        },
      },
    });

    const updated = await prisma.business.update({
      where: { id: business.id },
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
      }),
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

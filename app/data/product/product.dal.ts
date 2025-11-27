import "server-only";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { deleteS3Object } from "@/app/actions/s3";
import type { Prisma } from "@/app/generated/prisma/client";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";
import { getCurrentBusiness } from "../business/require-busines";
import { requireUser } from "../user/require-user";
import {
  type ProductCreateInput,
  ProductCreateInputSchema,
  type ProductDTO,
  type ProductUpdateInput,
  ProductUpdateInputSchema,
} from "./product.dto";
import {
  canAddProduct,
  canDeleteProduct,
  canFeatureProduct,
} from "./product.policy";

// ========================================
// FUNCIONES PÚBLICAS (CACHEABLES)
// ========================================

export async function listAllProducts({
  limit,
  page,
  search,
  sort,
  businessId,
  category,
  minRating,
}: {
  search?: string;
  category?: string;
  businessId?: string;
  page: number;
  limit: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
  minRating?: number;
}): Promise<{
  products: ProductDTO[];
  total: number;
  pages: number;
  currentPage: number;
}> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.PUBLIC_PRODUCTS, CACHE_TAGS.PRODUCTS);

  const where: Prisma.ProductWhereInput = {
    active: true,
    business: {
      isActive: true,
    },
    ...(businessId && { businessId }),
    ...(category && {
      category: {
        label: { contains: category, mode: "insensitive" as const },
      },
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(minRating && { business: { rating: { gte: minRating } } }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput[] = [
    { featured: "desc" },
    { business: { currentPlan: { planType: "asc" as const } } },
    { createdAt: "desc" },
  ];

  if (sort) {
    const [field, direction] = sort.split("_") as [
      Prisma.SortOrder,
      Prisma.SortOrderInput,
    ];
    orderBy.unshift({ [field]: direction });
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        business: true,
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
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({
      where: {
        active: true,
      },
    }),
  ]);

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function listFeaturedProducts(): Promise<ProductDTO[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.PUBLIC_PRODUCTS, "featured");

  return await prisma.product.findMany({
    where: {
      active: true,
    },
    include: {
      business: {
        include: {
          logo: true,
          coverImage: true,
        },
      },
      images: true,
      productView: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(
  productId: string,
): Promise<ProductDTO | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.PUBLIC_PRODUCTS, `product-${productId}`);

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      active: true,
    },
    include: {
      category: true,
      business: {
        include: {
          logo: true,
          coverImage: true,
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
      },
      images: true,
    },
  });

  return product;
}

// ========================================
// FUNCIONES PRIVADAS (NO CACHEABLES - Requieren autenticación)
// ========================================

export async function getProductsByBusinessId(): Promise<ProductDTO[]> {
  const { currentBusiness } = await getCurrentBusiness();

  const products = await prisma.product.findMany({
    where: { businessId: currentBusiness.id },
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
    },
  });

  return products;
}

export async function createProduct(
  data: ProductCreateInput,
): Promise<ActionResult> {
  try {
    const validatedData = ProductCreateInputSchema.safeParse(data);
    if (!validatedData.success) {
      const message = validatedData.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");

      return {
        errorMessage: message,
      };
    }

    const { currentBusiness } = await getCurrentBusiness();

    // Check product limit
    const productCount = await prisma.product.count({
      where: { businessId: currentBusiness.id },
    });

    if (
      !canAddProduct(
        productCount,
        currentBusiness.currentPlan?.planType || "FREE",
      )
    ) {
      return {
        errorMessage: "Has alcanzado el límite de productos para tu plan",
      };
    }

    // Check if can feature products
    if (
      data.featured &&
      !canFeatureProduct(currentBusiness.currentPlan?.planType || "FREE")
    ) {
      return {
        errorMessage: "Tu plan no permite destacar productos",
      };
    }

    const { name, description, price, images, category, featured } = data;

    // fijatse si existe cada imagen en la db y sino crearrla
    let imagesDB = await prisma.image.findMany({
      where: {
        url: {
          in: images.map((image) => image.url),
        },
      },
    });

    // Crear imágenes que no existan
    const imagesToCreate = images.filter(
      (image) => !imagesDB.some((dbImage) => dbImage.url === image.url),
    );

    // Crear imágenes en la base de datos
    if (imagesToCreate.length > 0) {
      await prisma.image.createMany({
        data: imagesToCreate,
      });

      // Actualizar imagesDB con las nuevas imágenes
      imagesDB = await prisma.image.findMany({
        where: {
          url: {
            in: imagesToCreate.map((image) => image.url),
          },
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        // Asociar imágenes existentes
        images: {
          connect: imagesDB.map((image) => ({ key: image.key })),
        },
        featured,
        businessId: currentBusiness.id,
      },
    });

    if (!product) {
      return {
        errorMessage: "Error al crear el producto",
      };
    }

    const existingCategory = await prisma.category.findUnique({
      where: { value: category },
    });

    if (existingCategory) {
      await prisma.category.update({
        where: { id: existingCategory.id },
        data: {
          products: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    } else {
      await prisma.category.create({
        data: {
          label: category,
          value: category,
          products: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    }

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_PRODUCTS);
    updateTag(CACHE_TAGS.PRODUCTS);

    return {
      successMessage: "Producto creado exitosamente",
    };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al crear el producto",
    };
  }
}

export async function updateProduct(
  data: ProductUpdateInput,
): Promise<ActionResult> {
  try {
    const validatedData = ProductUpdateInputSchema.safeParse(data);
    if (!validatedData.success) {
      const message = validatedData.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");

      return {
        errorMessage: message,
      };
    }

    const { productId, ...rest } = data;
    const { currentBusiness } = await getCurrentBusiness();

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId: currentBusiness.id,
      },
    });

    if (!product) {
      return {
        errorMessage: "Producto no encontrado",
      };
    }

    // Check if can feature products
    if (
      data.featured &&
      !canFeatureProduct(currentBusiness.currentPlan?.planType || "FREE")
    ) {
      return {
        errorMessage: "Tu plan no permite destacar productos",
      };
    }

    const { name, description, price, images, category, featured, active } =
      rest;

    // Obtenemos las imágenes existentes del producto
    const existingImages = await prisma.image.findMany({
      where: { productId },
    });

    // Map de keys para fácil comparación
    const existingKeys = new Set(existingImages.map((img) => img.key));
    const incomingKeys = new Set(images.map((img) => img.key));

    // Imágenes a crear → están en el request pero no existen en DB
    const imagesToCreate = images.filter((img) => !existingKeys.has(img.key));

    // Imágenes a borrar → existen en DB pero no vienen en el request
    const imagesToDelete = existingImages.filter(
      (img) => !incomingKeys.has(img.key),
    );

    if (imagesToDelete.length) {
      await prisma.image.deleteMany({
        where: { key: { in: imagesToDelete.map((img) => img.key) } },
      });
    }

    for (const img of imagesToCreate) {
      await prisma.image.create({
        data: {
          ...img,
          productId,
        },
      });
    }

    // Actualiza si cambió cuál es la imagen principal
    for (const img of images) {
      const existing = existingImages.find((e) => e.key === img.key);
      if (existing && existing.isMainImage !== img.isMainImage) {
        await prisma.image.update({
          where: { key: img.key },
          data: { isMainImage: img.isMainImage },
        });
      }
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        category: {
          connectOrCreate: {
            where: { value: category },
            create: { label: category, value: category },
          },
        },
        featured,
        active,
      },
    });

    if (!updated) {
      return {
        errorMessage: "Error al actualizar el producto",
      };
    }

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_PRODUCTS);
    updateTag(CACHE_TAGS.PRODUCTS);
    updateTag(`product-${productId}`);

    return {
      successMessage: "Producto actualizado exitosamente",
    };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error
          ? error.message
          : "Error al actualizar el producto",
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const { userId, email } = await requireUser();
    const { currentBusiness } = await getCurrentBusiness();

    const policyUser = {
      userId: userId,
      email: email,
      activePlan: currentBusiness.currentPlan?.planType || "FREE",
    };

    canDeleteProduct(policyUser, {
      id: productId,
      businesId: currentBusiness.id,
    });

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId: currentBusiness.id,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return false;
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    await prisma.productView.deleteMany({
      where: {
        productId,
      },
    });

    for (const image of product.images) {
      await prisma.image.delete({
        where: {
          key: image.key,
        },
      });
      await deleteS3Object({
        key: image.key,
      });
    }

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_PRODUCTS);
    updateTag(CACHE_TAGS.PRODUCTS);
    updateTag(`product-${productId}`);

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

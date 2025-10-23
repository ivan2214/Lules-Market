import "server-only";

import { deleteS3Object } from "@/app/actions/s3";
import type { Prisma } from "@/app/generated/prisma";
import type { ActionResult } from "@/hooks/use-action";
import prisma from "@/lib/prisma";
import { requireBusiness } from "../business/require-busines";
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

export class ProductDAL {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: <>
  private constructor(private readonly userId?: string) { }

  static async create() {
    const user = await requireUser();
    return new ProductDAL(user.id);
  }

  static async public() {

    return new ProductDAL();
  }

  async listAllProducts(
    {
      limit, page, search,
      sort,
      businessId,
      category,
    }: {
      search?: string;
      category?: string;
      businessId?: string;
      page: number;
      limit: number;
      sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
    }
  ): Promise<{ products: ProductDTO[]; total: number, pages: number; currentPage: number }> {


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

  async listFeaturedProducts(): Promise<ProductDTO[]> {
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

  async listProductsGroupedByCategory(): Promise<Record<string, ProductDTO[]>> {
    const allProducts = await prisma.product.findMany({
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
    });

    const allCategories = allProducts.map(
      (product) => product.category?.toLowerCase() || "",
    );
    const uniqueCategories = [...new Set(allCategories)];

    const productsByCategory = uniqueCategories.splice(0, 10).reduce(
      (acc, category) => {
        acc[category] = allProducts.filter(
          (product) =>
            product.category?.toLowerCase() === category.toLowerCase(),
        );
        return acc;
      },
      {} as Record<string, ProductDTO[]>,
    );

    return productsByCategory;
  }

  async getProductById(productId: string): Promise<ProductDTO | null> {
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

  async getProductsByBusinessId() {
    const { business } = await requireBusiness();

    const products = await prisma.product.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
      },
    });

    return products;
  }

  async createProduct(data: ProductCreateInput): Promise<ActionResult> {
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

      const { business } = await requireBusiness();

      // Check product limit
      const productCount = await prisma.product.count({
        where: { businessId: business.id },
      });

      if (!canAddProduct(productCount, business.plan)) {
        return {
          errorMessage: "Has alcanzado el límite de productos para tu plan",
        };
      }

      // Check if can feature products
      if (data.featured && !canFeatureProduct(business.plan)) {
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
          category,
          featured,
          businessId: business.id,
        },
      });

      if (!product) {
        return {
          errorMessage: "Error al crear el producto",
        };
      }

      return {
        successMessage: "Producto creado exitosamente",
      };
    } catch (error) {
      console.log("Error al crear el producto:", error);

      return {
        errorMessage:
          error instanceof Error ? error.message : "Error al crear el producto",
      };
    }
  }

  async updateProduct(data: ProductUpdateInput): Promise<ActionResult> {
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
      const { business } = await requireBusiness();

      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          businessId: business.id,
        },
      });

      if (!product) {
        return {
          errorMessage: "Producto no encontrado",
        };
      }

      // Check if can feature products
      if (data.featured && !canFeatureProduct(business.plan)) {
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
      // 🔹 Nuevo: actualiza si cambió cuál es la imagen principal
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
          category,
          featured,
          active,
        },
      });

      if (!updated) {
        return {
          errorMessage: "Error al actualizar el producto",
        };
      }

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

  async deleteProduct(productId: string) {
    try {
      const user = await requireUser();
      const { business } = await requireBusiness();

      canDeleteProduct(
        {
          activePlan: business.plan,
          id: user.id,
          email: user.email,
        },
        {
          id: productId,
          businesId: user.id,
        },
      );

      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          businessId: business.id,
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

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }
}

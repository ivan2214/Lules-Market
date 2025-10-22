import "server-only";

import type { ActionResult } from "@/hooks/use-action";
import {
  confirmImages,
  deleteImageFromMediaService,
} from "@/lib/actions/image-action";
import { PROJECT_KEY } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { requireBusiness } from "../business/require-busines";
import { getCurrentUser, requireUser } from "../user/require-user";
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
  private constructor(private readonly userId: string) {}

  static async create() {
    const user = await requireUser();
    return new ProductDAL(user.id);
  }

  static async public() {
    // For read-only access without requiring auth (e.g., public list)
    const user = await getCurrentUser();
    return new ProductDAL(user?.id ?? "");
  }

  async listProducts(): Promise<ProductDTO[]> {
    const rows = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      price: r.price,
      category: r.category,
      featured: r.featured,
      active: r.active,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
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
        (image) => !imagesDB.some((dbImage) => dbImage.url === image.url)
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

      try {
        await confirmImages(images);
      } catch (err) {
        console.error("Error confirmando imágenes", err);
        return { errorMessage: "Error confirmando imágenes" };
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
        (img) => !incomingKeys.has(img.key)
      );

      if (imagesToDelete.length) {
        for (const image of imagesToDelete) {
          await deleteImageFromMediaService(image.key, PROJECT_KEY);
        }

        await prisma.image.deleteMany({
          where: { key: { in: imagesToDelete.map((img) => img.key) } },
        });
      }

      for (const img of imagesToCreate) {
        await confirmImages(imagesToCreate);
        await prisma.image.create({
          data: {
            ...img,
            productId,
          },
        });
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

  async deleteProduct(productId: string, projectKey: string) {
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
        }
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
        await deleteImageFromMediaService(image.key, projectKey);
        await prisma.image.delete({
          where: {
            key: image.key,
          },
        });
      }

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }
}

import "server-only";
import { ORPCError } from "@orpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type { Product, ProductWithRelations } from "@/db/types";
import { getCurrentBusiness } from "@/orpc/actions/business/get-current-business";

import { o } from "@/orpc/context";
import { authMiddleware } from "@/orpc/middlewares";
import {
  ProductCreateSchema,
  ProductDeleteSchema,
  ProductUpdateSchema,
} from "@/shared/validators/product";

// Helper policy functions adapted for oRPC context
const checkCanAddProduct = (currentBusiness: {
  currentPlan?: {
    productsUsed?: number;
    plan?: { maxProducts?: number };
  } | null;
}) => {
  const { productsUsed } = currentBusiness?.currentPlan || {};
  const { maxProducts } = currentBusiness?.currentPlan?.plan || {};

  if (maxProducts === -1) return true;
  if (typeof productsUsed !== "number") return false;
  if (!maxProducts) return false;
  return productsUsed < maxProducts;
};

// ==========================================
// CREATE PRODUCT
// ==========================================

export const createProduct = o
  .use(
    authMiddleware({
      role: "business",
    }),
  )
  .route({
    method: "POST",
    description: "Crear un nuevo producto",
    summary: "Crear un nuevo producto",
    tags: ["Products"],
  })
  .input(ProductCreateSchema)
  .output(
    z.object({
      success: z.boolean(),
      product: z.custom<Product>(),
    }),
  )
  .handler(async ({ input }) => {
    const [error, result] = await getCurrentBusiness();

    if (error || !result.currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Negocio no encontrado",
      });
    }
    const { currentBusiness } = result;

    if (!currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Negocio no encontrado",
      });
    }

    if (!checkCanAddProduct(currentBusiness)) {
      throw new ORPCError("FORBIDDEN", {
        message: "Has alcanzado el límite de productos para tu plan",
      });
    }

    // Buscar imágenes existentes
    const imageUrls = input.images.map((image) => image.url);
    let imagesDB = await db.query.image.findMany({
      where: inArray(schema.image.url, imageUrls),
    });

    // Crear imágenes que no existan
    const existingUrls = new Set(imagesDB.map((img) => img.url));
    const imagesToCreate = input.images.filter(
      (image) => !existingUrls.has(image.url),
    );

    if (imagesToCreate.length > 0) {
      await db.insert(schema.image).values(
        imagesToCreate.map((img) => ({
          key: img.key,
          url: img.url,
          name: img.name,
          size: img.size,
          isMainImage: img.isMainImage,
        })),
      );

      imagesDB = await db.query.image.findMany({
        where: inArray(schema.image.url, imageUrls),
      });
    }

    // Create product
    const [product] = await db
      .insert(schema.product)
      .values({
        name: input.name,
        description: input.description,
        price: Number(input.price),
        businessId: currentBusiness.id,
      })
      .returning();

    if (!product) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Error al crear producto",
      });
    }

    // Update images to link to product
    if (imagesDB.length > 0) {
      for (const img of imagesDB) {
        await db
          .update(schema.image)
          .set({ productId: product.id })
          .where(eq(schema.image.key, img.key));
      }
    }

    // Handle category
    const existingCategory = await db.query.category.findFirst({
      where: eq(schema.category.value, input.category),
    });

    if (existingCategory) {
      await db
        .update(schema.product)
        .set({ categoryId: existingCategory.id })
        .where(eq(schema.product.id, product.id));
    } else {
      const [newCategory] = await db
        .insert(schema.category)
        .values({
          label: input.category,
          value: input.category,
        })
        .returning();

      await db
        .update(schema.product)
        .set({ categoryId: newCategory.id })
        .where(eq(schema.product.id, product.id));
    }

    revalidatePath("/dashboard/products");

    return { success: true, product };
  });

// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProduct = o
  .use(
    authMiddleware({
      role: "business",
    }),
  )
  .route({
    method: "PUT",
    description: "Actualizar un producto",
    summary: "Actualizar un producto",
    tags: ["Products"],
  })
  .input(ProductUpdateSchema)
  .output(
    z.object({
      success: z.boolean(),
      product: z.custom<Product>(),
    }),
  )
  .handler(async ({ input }) => {
    const [error, result] = await getCurrentBusiness();

    if (error || !result.currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Negocio no encontrado",
      });
    }
    const { currentBusiness } = result;

    if (!currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Negocio no encontrado",
      });
    }

    const { productId, ...data } = input;

    if (!productId) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Product ID is required for update",
      });
    }

    const product = await db.query.product.findFirst({
      where: and(
        eq(schema.product.id, productId),
        eq(schema.product.businessId, currentBusiness.id),
      ),
    });

    if (!product) {
      throw new ORPCError("NOT_FOUND", { message: "Producto no encontrado" });
    }

    // Images logic
    const existingImages = await db.query.image.findMany({
      where: eq(schema.image.productId, productId),
    });

    const existingKeys = new Set(existingImages.map((img) => img.key));
    const incomingKeys = new Set(data.images.map((img) => img.key));

    const imagesToCreate = data.images.filter(
      (img) => !existingKeys.has(img.key),
    );
    const imagesToDelete = existingImages.filter(
      (img) => !incomingKeys.has(img.key),
    );

    if (imagesToDelete.length) {
      const keysToDelete = imagesToDelete.map((img) => img.key);
      await db
        .delete(schema.image)
        .where(inArray(schema.image.key, keysToDelete));
    }

    for (const img of imagesToCreate) {
      await db.insert(schema.image).values({
        key: img.key,
        url: img.url,
        name: img.name,
        size: img.size,
        isMainImage: img.isMainImage,
        productId,
      });
    }

    // Update main image flags
    for (const img of data.images) {
      const existing = existingImages.find((e) => e.key === img.key);
      if (existing && existing.isMainImage !== img.isMainImage) {
        await db
          .update(schema.image)
          .set({ isMainImage: img.isMainImage })
          .where(eq(schema.image.key, img.key));
      }
    }

    // Handle category
    let categoryId = product.categoryId;
    const existingCategory = await db.query.category.findFirst({
      where: eq(schema.category.value, data.category),
    });

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const [newCategory] = await db
        .insert(schema.category)
        .values({
          label: data.category,
          value: data.category,
        })
        .returning();
      categoryId = newCategory.id;
    }

    const [updated] = await db
      .update(schema.product)
      .set({
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId,

        active: data.active,
      })
      .where(eq(schema.product.id, productId))
      .returning();

    revalidatePath("/dashboard/products");

    return { success: true, product: updated };
  });

// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProduct = o
  .use(
    authMiddleware({
      role: "business",
    }),
  )
  .route({
    method: "DELETE",
    description: "Eliminar un producto",
    summary: "Eliminar un producto",
    tags: ["Products"],
  })
  .input(ProductDeleteSchema)
  .output(
    z.object({
      success: z.boolean(),
    }),
  )
  .handler(async ({ input }) => {
    const [error, result] = await getCurrentBusiness();

    if (error || !result.currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Negocio no encontrado",
      });
    }
    const { currentBusiness } = result;

    if (!currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Negocio no encontrado",
      });
    }

    const { productId } = input;

    const product = await db.query.product.findFirst({
      where: and(
        eq(schema.product.id, productId),
        eq(schema.product.businessId, currentBusiness.id),
      ),
      with: {
        images: true,
      },
    });

    if (!product) {
      throw new ORPCError("NOT_FOUND", { message: "Producto no encontrado" });
    }

    // Delete product views
    await db
      .delete(schema.productView)
      .where(eq(schema.productView.productId, productId));

    // Delete images
    for (const image of product.images) {
      await db.delete(schema.image).where(eq(schema.image.key, image.key));
    }

    // Delete product
    await db.delete(schema.product).where(eq(schema.product.id, productId));

    revalidatePath("/dashboard/products");

    return { success: true };
  });

export const listProductsByBusinessId = o
  .use(
    authMiddleware({
      role: "business",
    }),
  )
  .route({
    method: "GET",
    description: "Listar productos por negocio",
    summary: "Listar productos por negocio",
    tags: ["Products"],
  })
  .output(z.array(z.custom<ProductWithRelations>()))
  .handler(async () => {
    const [error, result] = await getCurrentBusiness();

    if (error || !result.currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Negocio no encontrado",
      });
    }
    const { currentBusiness } = result;

    if (!currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Negocio no encontrado",
      });
    }

    const products = await db.query.product.findMany({
      where: eq(schema.product.businessId, currentBusiness.id),
      with: {
        images: true,
        category: true,
      },
    });

    return products;
  });

export const productsPrivateRouter = {
  createProduct,
  updateProduct,
  deleteProduct,
  listProductsByBusinessId,
};

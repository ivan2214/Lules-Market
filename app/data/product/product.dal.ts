import "server-only";
import { and, desc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { deleteS3Object } from "@/app/actions/s3";
import { db, type ProductWithRelations, schema } from "@/db";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getCurrentBusiness } from "../business/require-busines";
import { requireUser } from "../user/require-user";
import {
  type ProductCreateInput,
  ProductCreateInputSchema,
  type ProductUpdateInput,
  ProductUpdateInputSchema,
} from "./product.dto";
import {
  canAddProduct,
  canDeleteProduct,
  canFeatureProduct,
} from "./product.policy";

export async function listFeaturedProducts(): Promise<ProductWithRelations[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.PUBLIC_PRODUCTS, "featured");

  const products = await db.query.product.findMany({
    where: eq(schema.product.active, true),
    with: {
      business: {
        with: {
          logo: true,
          coverImage: true,
        },
      },
      images: true,
      productViews: true,
    },
    orderBy: [desc(schema.product.createdAt)],
  });

  return products as ProductWithRelations[];
}

export async function getProductById(
  productId: string,
): Promise<ProductWithRelations | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.PUBLIC_PRODUCTS, `product-${productId}`);

  const product = await db.query.product.findFirst({
    where: and(
      eq(schema.product.id, productId),
      eq(schema.product.active, true),
    ),
    with: {
      category: true,
      business: {
        with: {
          logo: true,
          coverImage: true,
          category: true,
        },
      },
      images: true,
    },
  });

  return product as ProductWithRelations | null;
}

// ========================================
// FUNCIONES PRIVADAS (NO CACHEABLES - Requieren autenticación)
// ========================================

export async function getProductsByBusinessId(): Promise<
  ProductWithRelations[]
> {
  const { currentBusiness } = await getCurrentBusiness();

  const products = await db.query.product.findMany({
    where: eq(schema.product.businessId, currentBusiness.id),
    orderBy: [desc(schema.product.createdAt)],
    with: {
      images: true,
    },
  });

  return products as ProductWithRelations[];
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

    if (!canAddProduct()) {
      return {
        errorMessage: "Has alcanzado el límite de productos para tu plan",
      };
    }

    // Check if can feature products
    if (data.featured && !canFeatureProduct()) {
      return {
        errorMessage: "Tu plan no permite destacar productos",
      };
    }

    const { name, description, price, images, category, featured } = data;

    // Buscar imágenes existentes
    const imageUrls = images.map((image) => image.url);
    let imagesDB = await db.query.image.findMany({
      where: inArray(schema.image.url, imageUrls),
    });

    // Crear imágenes que no existan
    const existingUrls = new Set(imagesDB.map((img) => img.url));
    const imagesToCreate = images.filter(
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

      // Re-fetch images
      imagesDB = await db.query.image.findMany({
        where: inArray(schema.image.url, imageUrls),
      });
    }

    // Create product
    const [product] = await db
      .insert(schema.product)
      .values({
        name,
        description,
        price: Number(price),
        featured,
        businessId: currentBusiness.id,
      })
      .returning();

    if (!product) {
      return {
        errorMessage: "Error al crear el producto",
      };
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
      where: eq(schema.category.value, category),
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
          label: category,
          value: category,
        })
        .returning();

      await db
        .update(schema.product)
        .set({ categoryId: newCategory.id })
        .where(eq(schema.product.id, product.id));
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

    const product = await db.query.product.findFirst({
      where: and(
        eq(schema.product.id, productId || ""),
        eq(schema.product.businessId, currentBusiness.id),
      ),
    });

    if (!product) {
      return {
        errorMessage: "Producto no encontrado",
      };
    }

    // Check if can feature products
    if (data.featured && !canFeatureProduct()) {
      return {
        errorMessage: "Tu plan no permite destacar productos",
      };
    }

    const { name, description, price, images, category, featured, active } =
      rest;

    // Obtenemos las imágenes existentes del producto
    const existingImages = await db.query.image.findMany({
      where: eq(schema.image.productId, productId || ""),
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

    // Actualiza si cambió cuál es la imagen principal
    for (const img of images) {
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
      where: eq(schema.category.value, category),
    });

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const [newCategory] = await db
        .insert(schema.category)
        .values({
          label: category,
          value: category,
        })
        .returning();
      categoryId = newCategory.id;
    }

    const [updated] = await db
      .update(schema.product)
      .set({
        name,
        description,
        price,
        categoryId,
        featured,
        active,
      })
      .where(eq(schema.product.id, productId || ""))
      .returning();

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
      return false;
    }

    // Delete product views
    await db
      .delete(schema.productView)
      .where(eq(schema.productView.productId, productId));

    // Delete images
    for (const image of product.images) {
      await db.delete(schema.image).where(eq(schema.image.key, image.key));
      await deleteS3Object({ key: image.key });
    }

    // Delete product
    await db.delete(schema.product).where(eq(schema.product.id, productId));

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

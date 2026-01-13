import "server-only";
import { eq, inArray } from "drizzle-orm";
import type { Static } from "elysia";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  account,
  business,
  category as categorySchema,
  image,
  product,
  session,
  user as userSchema,
} from "@/db/schema";
import { env } from "@/env/server";
import { CACHE_KEYS, invalidateCache } from "@/lib/cache";
import type {
  BusinessSetupSchema,
  BusinessUpdateSchema,
} from "@/shared/validators/business";
import { AppError } from "../errors";

interface SetupBusinessInput extends Static<typeof BusinessSetupSchema> {}

export const setupBusiness = async (input: SetupBusinessInput) => {
  const { category } = input;

  const existingBusiness = await db.query.business.findFirst({
    where: eq(business.name, input.name),
  });

  if (existingBusiness) {
    throw new AppError("Ya existe un comercio con ese nombre", "BAD_REQUEST");
  }

  const user = await db.query.user.findFirst({
    where: eq(userSchema.email, input.userEmail),
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", "NOT_FOUND");
  }

  // Handle category
  let categoryId: string | null = null;
  const categoryDB = await db.query.category.findFirst({
    where: eq(categorySchema.value, category?.toLowerCase() || ""),
  });

  if (categoryDB) {
    categoryId = categoryDB.id;
  } else if (category) {
    const [newCategory] = await db
      .insert(categorySchema)
      .values({
        value: category?.toLowerCase(),
        label: category,
      })
      .returning();
    categoryId = newCategory.id;
  }

  const [newBusiness] = await db
    .insert(business)
    .values({
      name: input.name,
      description: input.description,
      phone: input.phone,
      whatsapp: input.whatsapp,
      website: input.website,
      facebook: input.facebook,
      instagram: input.instagram,
      address: input.address,
      categoryId,
      userId: user.id,
      tags: input.tags,
    })
    .returning();

  // Create logo if exists
  if (input.logo?.key) {
    await db.insert(image).values({
      key: input.logo.key,
      url: `${env.S3_BUCKET_URL}/${input.logo.key}`,
      isMainImage: true,
      logoBusinessId: newBusiness.id,
    });
  }

  // Create cover image if exists
  if (input.coverImage?.key) {
    await db.insert(image).values({
      key: input.coverImage.key,
      url: `${env.S3_BUCKET_URL}/${input.coverImage.key}`,
      isMainImage: true,
      coverBusinessId: newBusiness.id,
    });
  }

  // Update user role to BUSINESS
  await db
    .update(userSchema)
    .set({ role: "BUSINESS" })
    .where(eq(userSchema.id, user.id));

  // Invalidar caché
  void invalidateCache(CACHE_KEYS.PATTERNS.ALL_BUSINESSES);
  void invalidateCache(CACHE_KEYS.HOMEPAGE_STATS);

  return { success: true, business: newBusiness };
};

type UpdateBusinessInput = Static<typeof BusinessUpdateSchema>;

export const updateBusinessService = async (
  userId: string,
  input: UpdateBusinessInput,
) => {
  const { category } = input;

  const currentBusiness = await db.query.business.findFirst({
    where: eq(business.userId, userId),
    with: {
      logo: true,
      coverImage: true,
    },
  });

  if (!currentBusiness) {
    throw new AppError("Business not found", "NOT_FOUND");
  }

  // Delete previous logo if being replaced
  if (input.logo && input.logo.key) {
    await db.delete(image).where(eq(image.logoBusinessId, currentBusiness.id));

    // Create new logo
    await db.insert(image).values({
      key: input.logo.key,
      url: `${env.S3_BUCKET_URL}/${input.logo.key}`,
      isMainImage: true,
      logoBusinessId: currentBusiness.id,
    });
  }

  if (input.coverImage && input.coverImage.key) {
    await db.delete(image).where(eq(image.coverBusinessId, currentBusiness.id));
    // Create new cover image
    await db.insert(image).values({
      key: input.coverImage.key,
      url: `${env.S3_BUCKET_URL}/${input.coverImage.key}`,
      isMainImage: true,
      coverBusinessId: currentBusiness.id,
    });
  }

  // Handle category
  let categoryId = currentBusiness.categoryId;

  if (category) {
    const categoryDB = await db.query.category.findFirst({
      where: eq(categorySchema.value, category.toLowerCase()),
    });

    if (categoryDB) {
      categoryId = categoryDB.id;
    } else {
      const [newCategory] = await db
        .insert(categorySchema)
        .values({
          value: category.toLowerCase(),
          label: category,
        })
        .returning();
      categoryId = newCategory.id;
    }
  }

  const [updated] = await db
    .update(business)
    .set({
      name: input.name,
      description: input.description,
      phone: input.phone,
      whatsapp: input.whatsapp,
      website: input.website ?? null, // Ensure null if undefined
      facebook: input.facebook ?? null,
      instagram: input.instagram ?? null,
      address: input.address ?? null,
      categoryId,
    })
    .where(eq(business.id, currentBusiness.id))
    .returning();

  revalidatePath(`/comercio/${updated.id}`);

  // Invalidar caché de negocios
  void invalidateCache(CACHE_KEYS.PATTERNS.ALL_BUSINESSES);
  void invalidateCache(CACHE_KEYS.business(updated.id));

  return {
    success: true,
    business: updated,
  };
};

export const deleteBusinessService = async (userId: string) => {
  const currentBusiness = await db.query.business.findFirst({
    where: eq(business.userId, userId),
    with: {
      logo: true,
      coverImage: true,
    },
  });

  if (!currentBusiness) {
    throw new AppError("Business not found", "NOT_FOUND");
  }

  try {
    // Get all products
    const products = await db.query.product.findMany({
      where: eq(product.businessId, currentBusiness.id),
      columns: { id: true },
    });

    const productIds = products.map((p) => p.id);

    // Get all images for products
    const imagesProducts =
      productIds.length > 0
        ? await db.query.image.findMany({
            where: inArray(image.productId, productIds),
            columns: { key: true },
          })
        : [];

    // Get logo and cover images
    const logoImage = await db.query.image.findFirst({
      where: eq(image.logoBusinessId, currentBusiness.id),
    });

    const coverImage = await db.query.image.findFirst({
      where: eq(image.coverBusinessId, currentBusiness.id),
    });

    const allImages = [
      ...imagesProducts,
      ...(logoImage ? [logoImage] : []),
      ...(coverImage ? [coverImage] : []),
    ];

    // Delete images from S3 and DB
    await Promise.all(
      allImages.map(async (img) => {
        await Promise.all([
          db.delete(image).where(eq(image.key, img.key)).catch(console.error),
        ]);
      }),
    );

    // Delete related records
    await Promise.all([
      db.delete(product).where(eq(product.businessId, currentBusiness.id)),
      db.delete(session).where(eq(session.userId, currentBusiness.userId)),
      db.delete(account).where(eq(account.userId, currentBusiness.userId)),
    ]);

    // Delete business
    await db.delete(business).where(eq(business.id, currentBusiness.id));

    // Delete user
    await db
      .delete(userSchema)
      .where(eq(userSchema.id, currentBusiness.userId));

    // Invalidar caché de negocios y productos
    void invalidateCache(CACHE_KEYS.PATTERNS.ALL_BUSINESSES);
    void invalidateCache(CACHE_KEYS.business(currentBusiness.id));
    void invalidateCache(CACHE_KEYS.PATTERNS.ALL_PRODUCTS);
    void invalidateCache(CACHE_KEYS.HOMEPAGE_STATS);

    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new AppError("Error deleting business", "INTERNAL_SERVER_ERROR");
  }
};

import { eq } from "drizzle-orm";
import type { Static } from "elysia";
import { db } from "@/db";
import {
  business as businessSchema,
  category as categorySchema,
  currentPlan as currentPlanSchema,
  image as imageSchema,
  plan as planSchema,
  trial as trialSchema,
  user as userSchema,
} from "@/db/schema";
import type { Business } from "@/db/types";
import { env } from "@/env/server";
import { CACHE_KEYS, invalidateCache } from "@/lib/cache";
import type { BusinessSetupSchema } from "@/shared/validators/business";
import { AppError } from "../errors";

type SetupBusinessInput = Static<typeof BusinessSetupSchema>;

export const setupBusiness = async (data: SetupBusinessInput) => {
  const {
    name,
    description,
    phone,
    whatsapp,
    website,
    facebook,
    instagram,
    address,
    category,
    tags,
    userEmail,
    logo,
    coverImage,
  } = data;

  const user = await db.query.user.findFirst({
    where: eq(userSchema.email, userEmail),
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", "NOT_FOUND", {
      message: "Usuario no encontrado",
    });
  }

  const userId = user.id;

  const freePlan = await db.query.plan.findFirst({
    where: eq(planSchema.type, "FREE"),
  });

  if (!freePlan) {
    throw new AppError("Error interno del servidor", "INTERNAL_SERVER_ERROR", {
      message: "Error al obtener el plan gratuito",
    });
  }

  // Create business
  // Check if business already exists for this user
  const existingBusiness = await db.query.business.findFirst({
    where: eq(businessSchema.userId, userId),
  });

  let businessDB: Business;

  if (existingBusiness) {
    // Update existing business
    const [updatedBusiness] = await db
      .update(businessSchema)
      .set({
        name,
        description,
        phone,
        whatsapp,
        website,
        facebook,
        instagram,
        address,
        status: "ACTIVE",
        tags,
      })
      .where(eq(businessSchema.id, existingBusiness.id))
      .returning();
    businessDB = updatedBusiness;
  } else {
    // Create new business
    const [newBusiness] = await db
      .insert(businessSchema)
      .values({
        name,
        description,
        phone,
        whatsapp,
        website,
        facebook,
        instagram,
        address,
        userId,
        status: "ACTIVE",
        tags,
      })
      .returning();
    businessDB = newBusiness;
  }

  // Create logo if provided
  // Create or update logo if provided
  if (logo && logo.key) {
    const existingLogo = await db.query.image.findFirst({
      where: eq(imageSchema.logoBusinessId, businessDB.id),
    });

    if (existingLogo) {
      await db
        .update(imageSchema)
        .set({
          key: logo.key,
          url: `${env.S3_BUCKET_URL}/${logo.key}`,
          isMainImage: logo.isMainImage,
        })
        .where(eq(imageSchema.logoBusinessId, businessDB.id));
    } else {
      await db.insert(imageSchema).values({
        key: logo.key,
        url: `${env.S3_BUCKET_URL}/${logo.key}`,
        isMainImage: logo.isMainImage,
        logoBusinessId: businessDB.id,
      });
    }
  }

  // Create or update cover image if provided
  if (coverImage && coverImage.key) {
    const existingCover = await db.query.image.findFirst({
      where: eq(imageSchema.coverBusinessId, businessDB.id),
    });

    if (existingCover) {
      await db
        .update(imageSchema)
        .set({
          key: coverImage.key,
          url: `${env.S3_BUCKET_URL}/${coverImage.key}`,
          isMainImage: coverImage.isMainImage,
        })
        .where(eq(imageSchema.coverBusinessId, businessDB.id));
    } else {
      await db.insert(imageSchema).values({
        key: coverImage.key,
        url: `${env.S3_BUCKET_URL}/${coverImage.key}`,
        isMainImage: coverImage.isMainImage,
        coverBusinessId: businessDB.id,
      });
    }
  }

  // Create trial
  const existingTrial = await db.query.trial.findFirst({
    where: eq(trialSchema.businessId, businessDB.id),
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  if (!existingTrial) {
    await db.insert(trialSchema).values({
      businessId: businessDB.id,
      plan: freePlan.type,
      expiresAt: expiresAt,
      activatedAt: new Date(),
      isActive: true,
    });
  }

  // Create current plan
  const existingCurrentPlan = await db.query.currentPlan.findFirst({
    where: eq(currentPlanSchema.businessId, businessDB.id),
  });

  if (!existingCurrentPlan) {
    await db.insert(currentPlanSchema).values({
      businessId: businessDB.id,
      planType: freePlan.type,
      expiresAt: expiresAt,
      activatedAt: new Date(),
      isActive: true,
      isTrial: true,
    });
  }

  // Handle category
  let categoryDB:
    | {
        createdAt: Date;
        updatedAt: Date;
        id: string;
        value: string;
        label: string;
      }
    | undefined;

  if (category) {
    categoryDB = await db.query.category.findFirst({
      where: eq(categorySchema.value, category?.toLowerCase()),
    });
  }

  if (categoryDB) {
    await db
      .update(businessSchema)
      .set({ categoryId: categoryDB.id })
      .where(eq(businessSchema.id, businessDB.id));
  } else if (category) {
    const [newCategory] = await db
      .insert(categorySchema)
      .values({
        value: category?.toLowerCase(),
        label: category,
      })
      .returning();

    await db
      .update(businessSchema)
      .set({ categoryId: newCategory.id })
      .where(eq(businessSchema.id, businessDB.id));
  }

  // Update user role to business
  await db
    .update(userSchema)
    .set({ role: "business" })
    .where(eq(userSchema.id, userId));

  // Invalidar caché de negocios y categorías
  void invalidateCache(CACHE_KEYS.PATTERNS.ALL_BUSINESSES);
  void invalidateCache(CACHE_KEYS.PATTERNS.ALL_CATEGORIES);
  void invalidateCache(CACHE_KEYS.HOMEPAGE_STATS);

  return {
    success: true,
    business: businessDB,
  };
};

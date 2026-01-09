import "server-only";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import {
  featuredBusinessesCache,
  getBusinessByIdCache,
  ListAllBusinessesInputSchema,
  ListAllBusinessesOutputSchema,
  listAllBusinessesCache,
  listAllSimilarBusinessesCache,
} from "@/core/cache-functions/business";

import { db } from "@/db";
import {
  business as businessSchema,
  businessView,
  category as categorySchema,
  currentPlan as currentPlanSchema,
  image as imageSchema,
  plan as planSchema,
  trial as trialSchema,
  user as userSchema,
} from "@/db/schema";
import type { Business, BusinessWithRelations } from "@/db/types";
import { env } from "@/env/server";
import { o } from "@/orpc/context";
import { BusinessSetupSchema } from "@/shared/validators/business";

export const businessSetup = o
  .route({
    method: "POST",
    description: "Setup business",
    summary: "Setup business",
    tags: ["Business"],
  })
  .input(
    BusinessSetupSchema.extend({
      userEmail: z.string(),
    }),
  )
  .output(
    z.object({
      success: z.boolean(),
      business: z.custom<Business>(),
    }),
  )
  .handler(async ({ input }) => {
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
    } = input;
    const user = await db.query.user.findFirst({
      where: eq(userSchema.email, userEmail),
    });

    if (!user) {
      throw new ORPCError("NOT_FOUND", {
        message: "Usuario no encontrado",
      });
    }

    const userId = user.id;

    const freePlan = await db.query.plan.findFirst({
      where: eq(planSchema.type, "FREE"),
    });

    if (!freePlan) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
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

    return {
      success: true,
      business: businessDB,
    };
  });

export const featuredBusinesses = o
  .route({
    method: "GET",
    summary: "Obtener negocios destacados",
    description: "Obtener una lista de negocios destacados",
    tags: ["Business"],
  })
  .output(z.array(z.custom<BusinessWithRelations>()))
  .handler(async () => {
    return await featuredBusinessesCache();
  });

export const listAllBusinesses = o
  .route({
    method: "GET",
    summary: "Listar todos los negocios",
    description: "Listar todos los negocios con paginación y filtros",
    tags: ["Business"],
  })
  .input(ListAllBusinessesInputSchema)
  .output(ListAllBusinessesOutputSchema)
  .handler(async ({ input }) => {
    return await listAllBusinessesCache(input);
  });

export const getBusinessById = o
  .route({
    method: "GET",
    summary: "Get business by id",
    tags: ["Business"],
  })
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    return getBusinessByIdCache(input.id);
  });

export const listAllSimilarBusinesses = o
  .route({
    method: "GET",
    summary: "List all businesses by categories",
    tags: ["Business"],
  })
  .input(z.object({ category: z.string().nullish(), businessId: z.string() }))
  .output(
    z.object({
      businesses: z.array(z.custom<BusinessWithRelations>()).nullish(),
    }),
  )
  .handler(async ({ input }) => {
    if (!input.category) {
      return { businesses: null };
    }
    const businesses = await listAllSimilarBusinessesCache({
      category: input.category,
      businessId: input.businessId,
    });
    return businesses;
  });

export const trackBusinessView = o
  .route({
    method: "POST",
    summary: "Track business view",
    tags: ["Business"],
  })
  .input(z.object({ businessId: z.string() }))
  .handler(async ({ input }) => {
    await db.insert(businessView).values({
      businessId: input.businessId,
      referrer: "unknown",
    });
    revalidatePath(`/comercio/${input.businessId}`);
  });

export const businessPublicRouter = {
  businessSetup,
  featuredBusinesses,
  listAllBusinesses,
  getBusinessById,
  listAllSimilarBusinesses,
  trackBusinessView,
};

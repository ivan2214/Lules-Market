import { ORPCError } from "@orpc/server";
import { desc, eq, inArray } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { deleteS3Object } from "@/app/actions/s3";
import { db, schema } from "@/db";
import type { Business, ProductWithRelations } from "@/db/types";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { authorizedLogged, businessAuthorized } from "./middlewares/authorized";
import { BusinessSetupSchema, BusinessUpdateSchema } from "./schemas";

// Helper for invalidation
const invalidateBusiness = (businessId?: string) => {
  updateTag(CACHE_TAGS.BUSINESS.GET_ALL);
  if (businessId) {
    updateTag(CACHE_TAGS.BUSINESS.GET_BY_ID(businessId));
  }
};

// ==========================================
// BUSINESS SETUP
// ==========================================

export const businessSetup = authorizedLogged
  .route({
    method: "POST",
    description: "Setup business",
    summary: "Setup business",
    tags: ["Business"],
  })
  .input(BusinessSetupSchema)
  .output(
    z.object({
      success: z.boolean(),
      business: z.custom<Business>(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { user } = context;

    const alreadyEmailBusiness = await db.query.business.findFirst({
      where: eq(schema.business.email, user.email),
    });

    if (alreadyEmailBusiness) {
      throw new ORPCError("CONFLICT", {
        message: "Ya tienes un negocio registrado con este email",
      });
    }

    const freePlan = await db.query.plan.findFirst({
      where: eq(schema.plan.type, "FREE"),
    });

    if (!freePlan) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Error al obtener el plan gratuito",
      });
    }

    // Create business
    const [business] = await db
      .insert(schema.business)
      .values({
        name: user.name,
        description: input.description,
        phone: input.phone,
        whatsapp: input.whatsapp,
        email: user.email,
        website: input.website,
        facebook: input.facebook,
        instagram: input.instagram,
        address: input.address,
        userId: user.id,
        status: "ACTIVE",
        tags: input.tags,
      })
      .returning();

    // Create logo if provided
    if (input.logo) {
      await db.insert(schema.image).values({
        key: input.logo.key,
        url: input.logo.url,
        name: input.logo.name,
        size: input.logo.size,
        isMainImage: input.logo.isMainImage,
        logoBusinessId: business.id,
      });
    }

    // Create cover image if provided
    if (input.coverImage) {
      await db.insert(schema.image).values({
        key: input.coverImage.key,
        url: input.coverImage.url,
        name: input.coverImage.name,
        size: input.coverImage.size,
        isMainImage: input.coverImage.isMainImage,
        coverBusinessId: business.id,
      });
    }

    // Create trial
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.insert(schema.trial).values({
      businessId: business.id,
      plan: freePlan.type,
      expiresAt: expiresAt,
      activatedAt: new Date(),
      isActive: true,
    });

    // Create current plan
    await db.insert(schema.currentPlan).values({
      businessId: business.id,
      planType: freePlan.type,
      expiresAt: expiresAt,
      activatedAt: new Date(),
      isActive: true,
      isTrial: true,
    });

    // Handle category
    const categoryDB = await db.query.category.findFirst({
      where: eq(schema.category.value, input.category.toLowerCase()),
    });

    if (categoryDB) {
      await db
        .update(schema.business)
        .set({ categoryId: categoryDB.id })
        .where(eq(schema.business.id, business.id));
    } else {
      const [newCategory] = await db
        .insert(schema.category)
        .values({
          value: input.category.toLowerCase(),
          label: input.category,
        })
        .returning();

      await db
        .update(schema.business)
        .set({ categoryId: newCategory.id })
        .where(eq(schema.business.id, business.id));
    }

    invalidateBusiness(business.id);

    return {
      success: true,
      business,
    };
  });

// ==========================================
// UPDATE BUSINESS
// ==========================================

export const updateBusiness = businessAuthorized
  .route({
    method: "PATCH",
    description: "Update business",
    summary: "Update business",
    tags: ["Business"],
  })
  .input(BusinessUpdateSchema)
  .output(z.object({ success: z.boolean(), business: z.custom<Business>() }))
  .handler(async ({ context, input }) => {
    const { business: currentBusiness } = context;

    // Delete previous logo if being replaced
    if (input.logo) {
      await db
        .delete(schema.image)
        .where(eq(schema.image.logoBusinessId, currentBusiness.id));
      if (currentBusiness.logo?.key) {
        await deleteS3Object({ key: currentBusiness.logo.key }).catch(
          console.error,
        );
      }
      // Create new logo
      await db.insert(schema.image).values({
        key: input.logo.key,
        url: input.logo.url,
        name: input.logo.name,
        size: input.logo.size,
        isMainImage: true,
        logoBusinessId: currentBusiness.id,
      });
    }

    if (input.coverImage) {
      await db
        .delete(schema.image)
        .where(eq(schema.image.coverBusinessId, currentBusiness.id));
      if (currentBusiness.coverImage?.key) {
        await deleteS3Object({ key: currentBusiness.coverImage.key }).catch(
          console.error,
        );
      }
      // Create new cover image
      await db.insert(schema.image).values({
        key: input.coverImage.key,
        url: input.coverImage.url,
        name: input.coverImage.name,
        size: input.coverImage.size,
        isMainImage: true,
        coverBusinessId: currentBusiness.id,
      });
    }

    // Handle category
    let categoryId = currentBusiness.categoryId;

    const categoryDB = await db.query.category.findFirst({
      where: eq(schema.category.value, input.category.toLowerCase()),
    });

    if (categoryDB) {
      categoryId = categoryDB.id;
    } else {
      const [newCategory] = await db
        .insert(schema.category)
        .values({
          value: input.category.toLowerCase(),
          label: input.category,
        })
        .returning();
      categoryId = newCategory.id;
    }

    const [updated] = await db
      .update(schema.business)
      .set({
        name: input.name,
        description: input.description,
        phone: input.phone,
        whatsapp: input.whatsapp,
        email: input.email,
        website: input.website,
        facebook: input.facebook,
        instagram: input.instagram,
        address: input.address,
        categoryId,
      })
      .where(eq(schema.business.id, currentBusiness.id))
      .returning();

    invalidateBusiness(currentBusiness.id);

    return {
      success: true,
      business: updated,
    };
  });

export const deleteBusiness = businessAuthorized
  .route({
    method: "DELETE",
    description: "Delete business",
    summary: "Delete business",
    tags: ["Business"],
  })
  .output(
    z.object({
      success: z.boolean(),
    }),
  )
  .handler(async ({ context }) => {
    const { business: currentBusiness } = context;

    try {
      // Get all products
      const products = await db.query.product.findMany({
        where: eq(schema.product.businessId, currentBusiness.id),
        columns: { id: true },
      });

      const productIds = products.map((p) => p.id);

      // Get all images for products
      const imagesProducts =
        productIds.length > 0
          ? await db.query.image.findMany({
              where: inArray(schema.image.productId, productIds),
              columns: { key: true },
            })
          : [];

      // Get logo and cover images
      const logoImage = await db.query.image.findFirst({
        where: eq(schema.image.logoBusinessId, currentBusiness.id),
      });

      const coverImage = await db.query.image.findFirst({
        where: eq(schema.image.coverBusinessId, currentBusiness.id),
      });

      const allImages = [
        ...imagesProducts,
        ...(logoImage ? [logoImage] : []),
        ...(coverImage ? [coverImage] : []),
      ];

      // Delete images from S3 and DB
      await Promise.all(
        allImages.map(async (image) => {
          await Promise.all([
            deleteS3Object({ key: image.key }).catch(console.error),
            db
              .delete(schema.image)
              .where(eq(schema.image.key, image.key))
              .catch(console.error),
          ]);
        }),
      );

      // Delete related records
      await Promise.all([
        db
          .delete(schema.product)
          .where(eq(schema.product.businessId, currentBusiness.id)),
        db
          .delete(schema.session)
          .where(eq(schema.session.userId, currentBusiness.userId)),
        db
          .delete(schema.account)
          .where(eq(schema.account.userId, currentBusiness.userId)),
      ]);

      // Delete business
      await db
        .delete(schema.business)
        .where(eq(schema.business.id, currentBusiness.id));

      // Delete user
      await db
        .delete(schema.user)
        .where(eq(schema.user.id, currentBusiness.userId));

      invalidateBusiness(currentBusiness.id);
      updateTag(CACHE_TAGS.PRODUCT.GET_ALL);

      return { success: true };
    } catch (error) {
      console.error(error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Error deleting business",
      });
    }
  });

// ==========================================
// GET MY BUSINESS PRODUCTS
// ==========================================

export const getMyBusinessProducts = businessAuthorized
  .route({
    method: "GET",
    description: "Get my business products",
    summary: "Get my business products",
    tags: ["Business"],
  })
  .input(
    z.object({
      limit: z.number().default(10),
      offset: z.number().default(0),
    }),
  )
  .output(z.array(z.custom<ProductWithRelations>()))
  .handler(async ({ context, input }) => {
    const { business: currentBusiness } = context;

    const products = await db.query.product.findMany({
      where: eq(schema.product.businessId, currentBusiness.id),
      limit: input.limit,
      offset: input.offset,
      orderBy: [desc(schema.product.createdAt)],
      with: {
        images: true,
      },
    });

    return products;
  });

export const businessPrivateRoute = {
  setup: businessSetup,
  update: updateBusiness,
  delete: deleteBusiness,
  myProducts: getMyBusinessProducts,
};

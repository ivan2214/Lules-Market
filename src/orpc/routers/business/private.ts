import "server-only";
import { ORPCError } from "@orpc/server";
import { desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import {
  account,
  business,
  category as categorySchema,
  currentPlan,
  image,
  plan,
  product,
  session,
  trial,
  user as userSchema,
} from "@/db/schema";
import type { Business, ProductWithRelations } from "@/db/types";
import { deleteS3Object } from "@/orpc/actions/s3/delete-s3-object";
import { o } from "@/orpc/context";
import { authMiddleware } from "@/orpc/middlewares";
import {
  BusinessSetupSchema,
  BusinessUpdateSchema,
} from "@/shared/validators/business";

// ==========================================
// BUSINESS SETUP
// ==========================================

export const businessSetup = o
  .use(
    authMiddleware({
      role: "business",
    }),
  )
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
  .handler(async ({ input }) => {
    const {
      userEmail,
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
      where: eq(plan.type, "FREE"),
    });

    if (!freePlan) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Error al obtener el plan gratuito",
      });
    }

    // Create business
    const [businessDB] = await db
      .insert(business)
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

    // Create logo if provided
    if (logo) {
      await db.insert(image).values({
        key: input.logo.key,
        url: input.logo.url,
        name: input.logo.name,
        size: input.logo.size,
        isMainImage: input.logo.isMainImage,
        logoBusinessId: businessDB.id,
      });
    }

    // Create cover image if provided
    if (coverImage) {
      await db.insert(image).values({
        key: coverImage.key,
        url: coverImage.url,
        name: coverImage.name,
        size: coverImage.size,
        isMainImage: input.coverImage.isMainImage,
        coverBusinessId: businessDB.id,
      });
    }

    // Create trial
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.insert(trial).values({
      businessId: businessDB.id,
      plan: freePlan.type,
      expiresAt: expiresAt,
      activatedAt: new Date(),
      isActive: true,
    });

    // Create current plan
    await db.insert(currentPlan).values({
      businessId: businessDB.id,
      planType: freePlan.type,
      expiresAt: expiresAt,
      activatedAt: new Date(),
      isActive: true,
      isTrial: true,
    });

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
        .update(business)
        .set({ categoryId: categoryDB.id })
        .where(eq(business.id, businessDB.id));
    } else if (category) {
      const [newCategory] = await db
        .insert(categorySchema)
        .values({
          value: category?.toLowerCase(),
          label: category,
        })
        .returning();

      await db
        .update(business)
        .set({ categoryId: newCategory.id })
        .where(eq(business.id, businessDB.id));
    }

    return {
      success: true,
      business: businessDB,
    };
  });

// ==========================================
// UPDATE BUSINESS
// ==========================================

export const updateBusiness = o
  .use(
    authMiddleware({
      role: "business",
    }),
  )
  .input(BusinessUpdateSchema)
  .output(z.object({ success: z.boolean(), business: z.custom<Business>() }))
  .handler(async ({ context, input }) => {
    const { user } = context;
    const { category } = input;

    const currentBusiness = await db.query.business.findFirst({
      where: eq(business.userId, user.id),
      with: {
        logo: true,
        coverImage: true,
      },
    });

    if (!currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Business not found",
      });
    }

    // Delete previous logo if being replaced
    if (input.logo) {
      await db
        .delete(image)
        .where(eq(image.logoBusinessId, currentBusiness.id));
      if (currentBusiness.logo?.key) {
        await deleteS3Object({ key: currentBusiness.logo.key }).catch(
          console.error,
        );
      }
      // Create new logo
      await db.insert(image).values({
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
        .delete(image)
        .where(eq(image.coverBusinessId, currentBusiness.id));
      if (currentBusiness.coverImage?.key) {
        await deleteS3Object({ key: currentBusiness.coverImage.key }).catch(
          console.error,
        );
      }
      // Create new cover image
      await db.insert(image).values({
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

    const [updated] = await db
      .update(business)
      .set({
        name: input.name,
        description: input.description,
        phone: input.phone,
        whatsapp: input.whatsapp,

        website: input.website,
        facebook: input.facebook,
        instagram: input.instagram,
        address: input.address,
        categoryId,
      })
      .where(eq(business.id, currentBusiness.id))
      .returning();

    revalidatePath(`/comercio/${updated.id}`);

    return {
      success: true,
      business: updated,
    };
  });

export const deleteBusiness = o
  .use(
    authMiddleware({
      role: "business",
    }),
  )
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
    const { user } = context;

    const currentBusiness = await db.query.business.findFirst({
      where: eq(business.userId, user.id),
      with: {
        logo: true,
        coverImage: true,
      },
    });

    if (!currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Business not found",
      });
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
            deleteS3Object({ key: img.key }).catch(console.error),
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

export const getMyBusinessProducts = o
  .use(
    authMiddleware({
      role: "business",
    }),
  )
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
    const { user } = context;

    const currentBusiness = await db.query.business.findFirst({
      where: eq(business.userId, user.id),
      with: {
        logo: true,
        coverImage: true,
      },
    });

    if (!currentBusiness) {
      throw new ORPCError("NOT_FOUND", {
        message: "Business not found",
      });
    }

    const products = await db.query.product.findMany({
      where: eq(product.businessId, currentBusiness.id),
      limit: input.limit,
      offset: input.offset,
      orderBy: [desc(product.createdAt)],
      with: {
        images: true,
      },
    });

    return products;
  });

export const businessPrivateRouter = {
  setup: businessSetup,
  update: updateBusiness,
  delete: deleteBusiness,
  myProducts: getMyBusinessProducts,
};

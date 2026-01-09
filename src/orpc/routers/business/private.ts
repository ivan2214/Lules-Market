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
  image,
  product,
  session,
  user as userSchema,
} from "@/db/schema";
import type { Business, ProductWithRelations } from "@/db/types";

import { o } from "@/orpc/context";
import { authMiddleware } from "@/orpc/middlewares";
import { BusinessUpdateSchema } from "@/shared/validators/business";

// ==========================================
// BUSINESS SETUP
// ==========================================

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

    /* // Delete previous logo if being replaced
    if (input.logo) {
      await db
        .delete(image)
        .where(eq(image.logoBusinessId, currentBusiness.id));

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
      // Create new cover image
      await db.insert(image).values({
        key: input.coverImage.key,
        url: input.coverImage.url,
        name: input.coverImage.name,
        size: input.coverImage.size,
        isMainImage: true,
        coverBusinessId: currentBusiness.id,
      });
    } */

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
  update: updateBusiness,
  delete: deleteBusiness,
  myProducts: getMyBusinessProducts,
};

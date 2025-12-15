"use server";
import { desc, eq, inArray } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { deleteS3Object } from "@/app/actions/s3";
import type { ProductWithRelations } from "@/db";
import { db, schema } from "@/db";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { daysFromNow } from "@/utils";
import { requireUser } from "../user/require-user";
import {
  type BusinessSetupInput,
  BusinessSetupInputSchema,
  type BusinessUpdateInput,
  BusinessUpdateInputSchema,
} from "./business.dto";

import { canEditBusiness } from "./business.policy";
import { getCurrentBusiness } from "./require-busines";

export async function businessSetup(
  data: BusinessSetupInput,
): Promise<ActionResult> {
  const validated = BusinessSetupInputSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

  try {
    const {
      description,
      phone,
      whatsapp,
      website,
      facebook,
      instagram,
      address,
      logo,
      coverImage,
      category,
      tags,
    } = data as BusinessSetupInput;

    const user = await requireUser();

    const alreadyEmailBusiness = await db.query.business.findFirst({
      where: eq(schema.business.email, user.email),
    });

    if (alreadyEmailBusiness)
      return { errorMessage: "Ya tienes un negocio registrado con este email" };

    const freePlan = await db.query.plan.findFirst({
      where: eq(schema.plan.type, "FREE"),
    });

    if (!freePlan) {
      return {
        errorMessage: "Error al obtener el plan",
      };
    }

    // Create business
    const [business] = await db
      .insert(schema.business)
      .values({
        name: user.name,
        description,
        phone,
        whatsapp,
        email: user.email,
        website,
        facebook,
        instagram,
        address,
        userId: user.userId,
        status: "ACTIVE",
        tags,
      })
      .returning();

    // Create logo if provided
    if (logo) {
      await db.insert(schema.image).values({
        key: logo.key,
        url: logo.url,
        name: logo.name,
        size: logo.size,
        isMainImage: logo.isMainImage,
        logoBusinessId: business.id,
      });
    }

    // Create cover image if provided
    if (coverImage) {
      await db.insert(schema.image).values({
        key: coverImage.key,
        url: coverImage.url,
        name: coverImage.name,
        size: coverImage.size,
        isMainImage: coverImage.isMainImage,
        coverBusinessId: business.id,
      });
    }

    // Create trial
    await db.insert(schema.trial).values({
      businessId: business.id,
      plan: freePlan.type,
      expiresAt: daysFromNow(30),
      activatedAt: new Date(),
      isActive: true,
    });

    // Create current plan
    await db.insert(schema.currentPlan).values({
      businessId: business.id,
      planType: freePlan.type,
      expiresAt: daysFromNow(30),
      activatedAt: new Date(),
      isActive: true,
      isTrial: true,
    });

    // Handle category
    const categoryDB = await db.query.category.findFirst({
      where: eq(schema.category.value, category.toLowerCase()),
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
          value: category.toLowerCase(),
          label: category,
        })
        .returning();

      await db
        .update(schema.business)
        .set({ categoryId: newCategory.id })
        .where(eq(schema.business.id, business.id));
    }

    return {
      successMessage: "Negocio configurado exitosamente",
    };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al crear negocio",
    };
  } finally {
    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(CACHE_TAGS.BUSINESSES);
    redirect("/dashboard");
  }
}

export async function updateBusiness(
  data: BusinessUpdateInput,
): Promise<ActionResult> {
  const validated = BusinessUpdateInputSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

  const { currentBusiness } = await getCurrentBusiness();

  const userPolicy = {
    userId: currentBusiness.userId,
    email: currentBusiness.email,
    activePlan: currentBusiness.currentPlan?.planType || "FREE",
  };

  if (
    !canEditBusiness(userPolicy, {
      id: currentBusiness.id,
      userId: currentBusiness.userId,
    })
  ) {
    return { errorMessage: "No tienes permisos para editar este negocio" };
  }

  const {
    logo,
    coverImage,
    address,
    category,
    description,
    email: newEmail,
    name,
    facebook,
    instagram,
    phone,
    website,
    whatsapp,
  } = data as BusinessUpdateInput;

  try {
    // Delete previous logo if being replaced
    if (logo) {
      await db
        .delete(schema.image)
        .where(eq(schema.image.logoBusinessId, currentBusiness.id));
      if (currentBusiness.logo?.key) {
        await deleteS3Object({ key: currentBusiness.logo.key });
      }
      // Create new logo
      await db.insert(schema.image).values({
        key: logo.key,
        url: logo.url,
        name: logo.name,
        size: logo.size,
        isMainImage: logo.isMainImage,
        logoBusinessId: currentBusiness.id,
      });
    }

    if (coverImage) {
      await db
        .delete(schema.image)
        .where(eq(schema.image.coverBusinessId, currentBusiness.id));
      if (currentBusiness.coverImage?.key) {
        await deleteS3Object({ key: currentBusiness.coverImage.key });
      }
      // Create new cover image
      await db.insert(schema.image).values({
        key: coverImage.key,
        url: coverImage.url,
        name: coverImage.name,
        size: coverImage.size,
        isMainImage: coverImage.isMainImage,
        coverBusinessId: currentBusiness.id,
      });
    }

    // Handle category
    const categoryDB = await db.query.category.findFirst({
      where: eq(schema.category.value, category),
    });

    let categoryId = currentBusiness.categoryId;
    if (categoryDB) {
      categoryId = categoryDB.id;
    } else {
      const [newCategory] = await db
        .insert(schema.category)
        .values({
          value: category.toLowerCase(),
          label: category,
        })
        .returning();
      categoryId = newCategory.id;
    }

    const [updated] = await db
      .update(schema.business)
      .set({
        name,
        description,
        phone,
        whatsapp,
        email: newEmail,
        website,
        facebook,
        instagram,
        address,
        categoryId,
      })
      .where(eq(schema.business.id, currentBusiness.id))
      .returning();

    // Invalidar caché
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(CACHE_TAGS.BUSINESSES);
    updateTag(`business-${currentBusiness.id}`);

    return {
      successMessage: "Negocio actualizado exitosamente",
      data: updated,
    };
  } catch (error) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al actualizar negocio",
    };
  }
}

export async function getBusinessProducts({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<ProductWithRelations[]> {
  // NO usar "use cache" - requiere autenticación
  const { currentBusiness } = await getCurrentBusiness();

  const products = await db.query.product.findMany({
    where: eq(schema.product.businessId, currentBusiness.id),
    limit: limit,
    offset: offset,
    orderBy: [desc(schema.product.createdAt)],
    with: {
      images: true,
    },
  });

  return products as ProductWithRelations[];
}

export async function deleteBusiness(): Promise<ActionResult> {
  const { currentBusiness } = await getCurrentBusiness();

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

    // Collect all images to delete
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

    // Invalidate cache
    [
      CACHE_TAGS.PUBLIC_BUSINESSES,
      CACHE_TAGS.BUSINESSES,
      CACHE_TAGS.businessById(currentBusiness.id),
      CACHE_TAGS.PUBLIC_PRODUCTS,
      CACHE_TAGS.PRODUCTS,
    ].forEach(updateTag);

    return { successMessage: "Negocio eliminado exitosamente" };
  } catch (error) {
    console.error(error);
    return {
      errorMessage:
        error instanceof Error ? error.message : "Error al eliminar negocio",
    };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/hooks/use-action";
import prisma from "@/lib/prisma";
import { canAddProduct, canFeatureProduct } from "@/lib/subscription-limits";
import {
  CreateProductSchema,
  type CreateProductSchemaInput,
  type UpdateProductSchemaInput,
} from "@/schemas/product";
import { PROJECT_KEY } from "../constants";
import { requireBusiness } from "./auth-actions";

const MEDIA_SERVICE_URL = process.env.NEXT_PUBLIC_MEDIA_SERVICE_URL;

export async function createProduct(
  _prevState: ActionResult,
  data: CreateProductSchemaInput
): Promise<ActionResult> {
  try {
    const validatedData = CreateProductSchema.safeParse(data);
    if (!validatedData.success) {
      const message = validatedData.error.issues
        .map((issue) => issue.message)
        .join(", ");
      console.log("Error de validación:", message);

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
  } finally {
    revalidatePath("/dashboard/products");
    revalidatePath("/explorar");
  }
}

export async function updateProduct(
  _prevState: ActionResult,

  data: UpdateProductSchemaInput
): Promise<ActionResult> {
  try {
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
  } finally {
    revalidatePath("/dashboard/products");
    revalidatePath("/explorar");
  }
}

export async function deleteProduct(productId: string, projectKey: string) {
  try {
    const { business } = await requireBusiness();

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

    revalidatePath("/dashboard/products");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

export async function getProducts() {
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

export async function getProduct(productId: string) {
  const { business } = await requireBusiness();

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      businessId: business.id,
    },
  });

  return product;
}

async function deleteImageFromMediaService(key: string, projectKey: string) {
  try {
    await fetch(
      `${MEDIA_SERVICE_URL}/files/${encodeURIComponent(
        key
      )}?projectKey=${projectKey}`, // <-- enviamos projectKey
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error deleting image from media service:", error);
  }
}

async function confirmImages(
  images: {
    url: string;
    key: string;
    name?: string | undefined;
    isMainImage?: boolean | undefined;
    size?: number | undefined;
  }[]
) {
  for (const image of images) {
    await fetch(`${MEDIA_SERVICE_URL}/files/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: image.key,
        url: image.url,
        isMain: false,
        name: image.name,
        size: image.size,
        projectKey: PROJECT_KEY,
      }),
    });
  }
}

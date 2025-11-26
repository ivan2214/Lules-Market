"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import type {
  ProductCreateInput,
  ProductDeleteInput,
  ProductUpdateInput,
} from "@/app/data/product/product.dto";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../data/product/product.dal";

export async function createProductAction(
  _prevState: ActionResult,
  input: ProductCreateInput,
): Promise<ActionResult> {
  try {
    const result = await createProduct(input);
    if (result.errorMessage) {
      return { errorMessage: result.errorMessage };
    }

    if (result.successMessage) {
      // Revalidate cache tags when product is created
      revalidateTag(CACHE_TAGS.PRODUCTS, "max");
      revalidateTag(CACHE_TAGS.PUBLIC_PRODUCTS, "max");
      revalidateTag(CACHE_TAGS.CATEGORIES, "max");
    }

    return { successMessage: result.successMessage };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard/products");
    revalidatePath("/explorar/productos");
  }
}

export async function updateProductAction(
  _prevState: ActionResult,
  input: ProductUpdateInput,
): Promise<ActionResult> {
  try {
    const result = await updateProduct(input);
    if (result.errorMessage) {
      return { errorMessage: result.errorMessage };
    }

    if (!input.productId) {
      return { errorMessage: "El ID del producto es requerido" };
    }

    if (result.successMessage) {
      // Revalidate cache tags when product is updated
      revalidateTag(CACHE_TAGS.PRODUCTS, "max");
      revalidateTag(CACHE_TAGS.PUBLIC_PRODUCTS, "max");
      revalidateTag(CACHE_TAGS.productById(input.productId), "max");
      revalidateTag(CACHE_TAGS.CATEGORIES, "max");
    }

    return { successMessage: result.successMessage };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard/products");
    revalidatePath("/explorar/productos");
  }
}

export async function deleteProductAction(
  input: ProductDeleteInput,
): Promise<ActionResult> {
  try {
    await deleteProduct(input.productId);

    // Revalidate cache tags when product is deleted
    revalidateTag(CACHE_TAGS.PRODUCTS, "max");
    revalidateTag(CACHE_TAGS.PUBLIC_PRODUCTS, "max");
    revalidateTag(CACHE_TAGS.productById(input.productId), "max");
    revalidateTag(CACHE_TAGS.CATEGORIES, "max");

    return { successMessage: "Producto eliminado con éxito" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard/products");
    revalidatePath("/explorar/productos");
  }
}

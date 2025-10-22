"use server";

import { revalidatePath } from "next/cache";
import { ProductDAL } from "@/app/data/product/product.dal";
import type {
  ProductCreateInput,
  ProductDeleteInput,
  ProductUpdateInput,
} from "@/app/data/product/product.dto";
import type { ActionResult } from "@/hooks/use-action";
import { PROJECT_KEY } from "@/lib/constants";

export async function createProductAction(
  _prevState: ActionResult,
  input: ProductCreateInput,
): Promise<ActionResult> {
  try {
    const dal = await ProductDAL.create();
    await dal.createProduct(input);
    return { successMessage: "Producto creado con éxito" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard/products");
    revalidatePath("/explorar");
  }
}

export async function updateProductAction(
  _prevState: ActionResult,
  input: ProductUpdateInput,
): Promise<ActionResult> {
  try {
    const dal = await ProductDAL.create();
    await dal.createProduct(input);
    return { successMessage: "Producto creado con éxito" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard/products");
    revalidatePath("/explorar");
  }
}

export async function deleteProductAction(
  input: ProductDeleteInput,
): Promise<ActionResult> {
  try {
    const dal = await ProductDAL.create();
    await dal.deleteProduct(input.productId, PROJECT_KEY);
    return { successMessage: "Producto eliminado con éxito" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard/products");
    revalidatePath("/explorar");
  }
}

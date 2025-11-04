"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import type {
  BusinessCreateInput,
  BusinessUpdateInput,
} from "@/app/data/business/business.dto";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createBusiness, updateBusiness } from "../data/business/business.dal";

export async function createBusinessAction(
  _prevState: ActionResult,
  data: BusinessCreateInput
): Promise<ActionResult> {
  try {
    const result: ActionResult = await createBusiness(data);

    if (result.successMessage) {
      // Revalidate cache tags when business is created
      revalidateTag(CACHE_TAGS.BUSINESSES, "max");
      revalidateTag(CACHE_TAGS.PUBLIC_BUSINESSES, "max");
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard");
  }
}

export async function updateBusinessAction(
  _prevState: ActionResult,
  data: BusinessUpdateInput
): Promise<ActionResult> {
  try {
    const result: ActionResult = await updateBusiness(data);

    if (result.errorMessage) {
      return { errorMessage: result.errorMessage };
    }

    if (result.successMessage && result.data) {
      // Revalidate cache tags when business is updated
      revalidateTag(CACHE_TAGS.BUSINESSES, "max");
      revalidateTag(CACHE_TAGS.PUBLIC_BUSINESSES, "max");
      revalidateTag(CACHE_TAGS.businessById(result.data.id), "max");
    }

    return { successMessage: result.successMessage };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
  }
}

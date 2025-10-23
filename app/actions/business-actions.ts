"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { BusinessDAL } from "@/app/data/business/business.dal";
import type {
  BusinessCreateInput,
  BusinessUpdateInput,
} from "@/app/data/business/business.dto";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function createBusinessAction(data: BusinessCreateInput) {
  try {
    const dal = await BusinessDAL.create();

    const result: ActionResult = await dal.createBusiness(data);

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

export async function updateBusinessAction(data: BusinessUpdateInput) {
  try {
    const dal = await BusinessDAL.create();
    const result: ActionResult = await dal.updateBusiness(data);

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

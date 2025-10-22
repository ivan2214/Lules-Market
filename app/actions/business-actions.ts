"use server";

import { revalidatePath } from "next/cache";
import { BusinessDAL } from "@/app/data/business/business.dal";
import type {
  BusinessCreateInput,
  BusinessUpdateInput,
} from "@/app/data/business/business.dto";
import type { ActionResult } from "@/hooks/use-action";

export async function createBusinessAction(data: BusinessCreateInput) {
  try {
    const dal = await BusinessDAL.create();

    const result: ActionResult = await dal.createBusiness(data);
    if (result.errorMessage) {
      return { errorMessage: result.errorMessage };
    }

    return {
      successMessage: result.successMessage,
    };
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

    return { successMessage: result.successMessage };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { errorMessage: message };
  } finally {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
  }
}

import "server-only";
import { cache } from "react";
import type { BusinessWithRelations } from "@/db/types";
import { requireBusiness } from "./require.businesess";

export const getCurrentBusiness = cache(
  async (): Promise<{
    currentBusiness: BusinessWithRelations;
  }> => {
    const { business } = await requireBusiness();

    return {
      currentBusiness: business,
    };
  },
);

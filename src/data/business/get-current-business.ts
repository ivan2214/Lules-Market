"use server";

import { cache } from "react";
import type { BusinessWithRelations } from "@/db/types";
import { getCurrentSession } from "../session/get-current-session";
import { requireSession } from "../session/require-session";

export const getCurrentBusiness = cache(
  async (): Promise<{
    currentBusiness?: BusinessWithRelations | null;
    headers: Headers;
  }> => {
    await requireSession();
    const { business, headers } = await getCurrentSession();

    return {
      currentBusiness: business,
      headers: headers as Headers,
    };
  },
);

"use server";

import { cache } from "react";
import type { AdminWithRelations } from "@/db/types";
import { getCurrentSession } from "../session/get-current-session";
import { requireSession } from "../session/require-session";

export const getCurrentAdmin = cache(
  async (): Promise<{
    admin?: AdminWithRelations | null;
  }> => {
    try {
      await requireSession();
      const { admin } = await getCurrentSession();

      return {
        admin,
      };
    } catch (error) {
      console.log(error);
      return {
        admin: null,
      };
    }
  },
);

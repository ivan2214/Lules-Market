import "server-only";
import { cache } from "react";
import type { AdminWithRelations } from "@/db/types";
import { getCurrentSession } from "../session/get-current-session";

export const getCurrentAdmin = cache(
  async (): Promise<{
    admin?: AdminWithRelations | null;
  }> => {
    try {
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

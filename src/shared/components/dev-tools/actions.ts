"use server";

import { ORPCError, os } from "@orpc/server";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { account, admin, business, session, user } from "@/db/schema";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";

export const clearUsersCache = os
  .handler(async () => {
    try {
      // Delete in proper order due to foreign key constraints
      await db.delete(session);
      await db.delete(account);
      await db.delete(admin);
      await db.delete(business);
      await db.delete(user);
      updateTag(CACHE_TAGS.DEV_TOOLS.GET_ALL);
      return { success: true };
    } catch (error) {
      console.error("Error al borrar usuarios", error);
      throw new ORPCError("Error al borrar usuarios");
    }
  })
  .actionable();

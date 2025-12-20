import "server-only";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { user } from "@/db/schema";
import { verifySession } from "./verify-session";

export const getCurrentUser = cache(
  async (): Promise<{
    id: string;
    email: string;
    name: string;
  } | null> => {
    const session = await verifySession();
    if (!session) return null;
    try {
      const data = await db.query.user.findFirst({
        where: eq(user.id, session.userId),
        columns: {
          id: true,
          email: true,
          name: true,
        },
      });
      if (!data) return null;
      return {
        id: data.id,
        email: data.email ?? "",
        name: data.name ?? "",
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },
);

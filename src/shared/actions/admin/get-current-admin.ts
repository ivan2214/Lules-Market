import "server-only";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db, schema } from "@/db";
import { getCurrentUser } from "@/shared/actions/user/get-current-user";

export const getCurrentAdmin = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) return null;

    const admin = await db.query.admin.findFirst({
      where: eq(schema.admin.userId, user.id),
      with: {
        user: true,
      },
    });

    return admin ?? null;
  } catch {
    return null;
  }
});

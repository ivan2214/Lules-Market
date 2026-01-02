import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { admin as adminSchema } from "@/db/schema";

import { actionContext, oa } from "@/orpc/middlewares";
import { requireSession } from "../user/require-session";

export const requireAdmin = oa
  .handler(async () => {
    const [error, session] = await requireSession();

    if (error || !session) {
      throw error;
    }

    const admin = await db.query.admin.findFirst({
      where: eq(adminSchema.userId, session.user.id),
    });

    if (!admin) {
      redirect("/auth/sign-in");
    }

    return { session, admin };
  })
  .actionable({
    context: actionContext,
  });

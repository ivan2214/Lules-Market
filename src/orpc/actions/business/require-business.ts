"use server";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { admin as adminSchema, business as businessSchema } from "@/db/schema";
import { actionContext, oa } from "@/orpc/middlewares";
import { requireSession } from "../user/require-session";

export const requireBusiness = oa
  .handler(async () => {
    const [error, session] = await requireSession();

    if (error) {
      throw new ORPCError(error.message);
    }

    const business = await db.query.business.findFirst({
      where: eq(businessSchema.userId, session?.user.id),
    });

    const isAdmin = await db.query.admin.findFirst({
      where: eq(adminSchema.userId, session.user.id),
    });

    if (isAdmin) {
      redirect("/admin");
    }

    if (!business) {
      redirect("/dashboard/setup");
    }

    return {
      userId: session.user.id,
    };
  })
  .actionable({
    context: actionContext,
  });

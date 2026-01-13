"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { requireSession } from "@/data/session/require-session";
import { db } from "@/db";
import { admin as adminSchema, business as businessSchema } from "@/db/schema";

export const requireBusiness = async () => {
  const { user } = await requireSession();

  const business = await db.query.business.findFirst({
    where: eq(businessSchema.userId, user.id),
  });

  const isAdmin = await db.query.admin.findFirst({
    where: eq(adminSchema.userId, user.id),
  });

  if (isAdmin) {
    redirect("/admin");
  }

  if (!business) {
    redirect(pathsConfig.business.setup);
  }

  return {
    userId: user.id,
  };
};

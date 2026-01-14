"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { db } from "@/db";
import { admin as adminSchema } from "@/db/schema";
import { getCurrentBusiness } from "./get-current-business";

export const requireBusiness = async () => {
  const { currentBusiness } = await getCurrentBusiness();

  if (!currentBusiness) {
    redirect(pathsConfig.business.setup);
  }

  const isAdmin = await db.query.admin.findFirst({
    where: eq(adminSchema.userId, currentBusiness?.userId),
  });

  if (isAdmin) {
    redirect("/admin");
  }
};

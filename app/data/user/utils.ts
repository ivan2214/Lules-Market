"use server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });

    return user ?? null;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string | undefined) => {
  try {
    if (!id) return null;
    const user = await db.query.user.findFirst({
      where: eq(schema.user.id, id),
    });

    return user ?? null;
  } catch {
    return null;
  }
};

import "server-only";

import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "../user/require-user";
import type { AccountUpdateInput } from "./settings.dto";

export class SettingsDAL {
  private constructor() {}

  static async create() {
    const session = await requireUser();
    if (!session) throw new Error("Usuario no autenticado");
    return new SettingsDAL();
  }

  async updateAccount(data: AccountUpdateInput) {
    const session = await requireUser();
    // Only allow updating name for now
    const [updated] = await db
      .update(schema.user)
      .set({ name: data.name })
      .where(eq(schema.user.id, session.userId))
      .returning();

    return updated;
  }

  async deleteAccount() {
    const session = await requireUser();
    // Soft-delete pattern could be used; for now, remove user and cascade
    await db.delete(schema.user).where(eq(schema.user.id, session.userId));
    return true;
  }
}

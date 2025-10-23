import "server-only";

import prisma from "@/lib/prisma";
import { requireUser } from "../user/require-user";
import type { AccountUpdateInput } from "./settings.dto";

export class SettingsDAL {
  private constructor() { }

  static async create() {
    const user = await requireUser();
    if (!user) throw new Error("Usuario no autenticado");
    return new SettingsDAL();
  }

  async updateAccount(data: AccountUpdateInput) {
    const user = await requireUser();
    // Only allow updating name for now
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: data.name },
    });

    return updated;
  }

  async deleteAccount() {
    const user = await requireUser();
    // Soft-delete pattern could be used; for now, remove user and cascade via prisma
    await prisma.user.delete({ where: { id: user.id } });
    return true;
  }
}

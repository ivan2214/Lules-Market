"use server";

import { updateTag } from "next/cache";
import type { ActionResult } from "@/hooks/use-action";
import prisma from "@/lib/prisma";

export async function createLog(data: {
  businessId?: string;
  adminId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <necessary>
  details?: Record<string, any>;
}) {
  try {
    const log = await prisma.log.create({
      data: {
        businessId: data.businessId,
        adminId: data.adminId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details || {},
      },
    });
    return { success: true, log };
  } catch (error) {
    console.error("Error creating log:", error);
    return { success: false, error: "Failed to create log." };
  } finally {
    updateTag("admin-logs");
  }
}

export async function deleteAllLogs(
  _prevState: ActionResult,
): Promise<ActionResult> {
  try {
    await prisma.log.deleteMany();
    return { successMessage: "Logs eliminados exitosamente" };
  } catch (error) {
    console.error("Error deleting logs:", error);
    return { errorMessage: "Error al eliminar los logs" };
  } finally {
    updateTag("admin-logs");
  }
}

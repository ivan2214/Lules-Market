import "server-only";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/data/user/require-user";
import type { Log, Prisma } from "@/app/generated/prisma";
import type { ActionResult } from "@/hooks/use-action";
import prisma from "@/lib/prisma";

export const getCurrentAdmin = async () => {
  try {
    const user = await getCurrentUser();
    const admin = await prisma.admin.findUnique({
      where: {
        userId: user?.id,
      },
      include: {
        user: true,
      },
    });

    return admin;
  } catch {
    return null;
  }
};

export async function getLogs(
  page = 1,
  limit = 10,
  filters: { search?: string; entityType?: string; action?: string } = {},
): Promise<{
  logs: Log[];
  totalPages: number;
  currentPage: number;
}> {
  const skip = (page - 1) * limit;
  const where: Prisma.LogWhereInput = {};

  if (filters.search) {
    where.OR = [
      { action: { contains: filters.search, mode: "insensitive" } },
      { entityType: { contains: filters.search, mode: "insensitive" } },
      { adminId: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  // ✅ Ignora "all" como valor válido
  if (filters.entityType && filters.entityType !== "all") {
    where.entityType = filters.entityType;
  }

  if (filters.action && filters.action !== "all") {
    where.action = filters.action;
  }

  const totalLogs = await prisma.log.count({ where });
  const logs = await prisma.log.findMany({
    where,
    orderBy: { timestamp: "desc" },
    skip,
    take: limit,
  });

  return {
    logs,
    totalPages: Math.ceil(totalLogs / limit),
    currentPage: page,
  };
}

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
    revalidatePath("/admin/logs");
  }
}

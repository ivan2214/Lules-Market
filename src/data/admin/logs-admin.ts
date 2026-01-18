import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { AdminService } from "@/server/modules/admin/service";

export async function getAdminLogs(options: {
  page: number;
  perPage: number;
  entityType?: string;
  action?: string;
}) {
  "use cache";
  cacheTag("admin", "admin-logs");
  cacheLife("minutes");

  const [logs, total] = await Promise.all([
    AdminService.getPaginatedLogs(options),
    AdminService.getLogsCount({
      entityType: options.entityType,
      action: options.action,
    }),
  ]);

  return { logs, total };
}

export async function getAdminLogsCount(filters?: {
  entityType?: string;
  action?: string;
}) {
  "use cache";
  cacheTag("admin", "admin-logs-count");
  cacheLife("minutes");

  return await AdminService.getLogsCount(filters);
}

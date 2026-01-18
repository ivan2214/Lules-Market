import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { AdminService } from "@/server/modules/admin/service";

export async function getAdminPayments(options: {
  page: number;
  perPage: number;
  status?: string;
}) {
  "use cache";
  cacheTag("admin", "payments");
  cacheLife("minutes");

  const [payments, total] = await Promise.all([
    AdminService.getPaginatedPayments(options),
    AdminService.getPaymentsCount(options.status),
  ]);

  return { payments, total };
}

export async function getAdminPaymentsStats() {
  "use cache";
  cacheTag("admin", "payments-stats");
  cacheLife("hours");

  const [approved, pending, rejected] = await Promise.all([
    AdminService.getPaymentsCount("approved"),
    AdminService.getPaymentsCount("pending"),
    AdminService.getPaymentsCount("rejected"),
  ]);

  return {
    approved,
    pending,
    rejected,
    total: approved + pending + rejected,
  };
}

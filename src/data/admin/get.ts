import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { UserRole } from "@/db/types";
import { AdminService } from "@/server/modules/admin/service";

export async function getAdminDashboardStats() {
  "use cache";
  cacheTag("admin", "admin-stats");
  cacheLife("minutes");

  return await AdminService.getDashboardStats();
}

export async function getAdminAnalyticsData() {
  "use cache";
  cacheTag("admin", "admin-analytics");
  cacheLife("hours");

  return await AdminService.getAnalyticsData();
}

export async function getAdminPlans() {
  "use cache";
  cacheTag("plans");
  cacheLife("weeks");

  return await AdminService.getPlans();
}

export async function getTrialsAndActiveCount() {
  "use cache";
  cacheTag("admin", "trials");
  cacheLife("minutes");

  const { trials, activeTrials } = await AdminService.getTrialsAndActiveCount();

  const trialsWithDays = trials.map((trial) => ({
    ...trial,
    daysRemaining: trial.expiresAt
      ? Math.ceil(
          (new Date(trial.expiresAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
      : 0,
  }));

  return { trials: trialsWithDays, activeTrials };
}

export async function getAdminPaginatedUsers(options: {
  page: number;
  perPage: number;
  role?: UserRole;
}) {
  "use cache";
  cacheTag("admin", "users", "admin-users-paginated");
  cacheLife("minutes");

  const { page, perPage, role } = options;

  return await AdminService.getPaginatedUsers({ page, perPage, role });
}

export async function getAdminRecentUsers(limit = 5) {
  "use cache";
  cacheTag("admin", "users", "admin-users-recent");
  cacheLife("minutes");

  return await AdminService.getRecentUsers(limit);
}

export async function getAdminTotalUsersCount() {
  "use cache";
  cacheTag("admin", "users", "admin-users-count");
  cacheLife("minutes");

  return await AdminService.getTotalUsersCount();
}

import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { AdminService } from "@/server/modules/admin/service";
import { getCurrentSession } from "../session/get-current-session";

async function requireAdmin() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== "ADMIN") {
    redirect(pathsConfig.auth.signIn);
  }
  return user;
}

export async function getAdminDashboardStats() {
  await requireAdmin();
  ("use cache");
  cacheTag("admin", "admin-stats");
  cacheLife("minutes");

  return await AdminService.getDashboardStats();
}

export async function getAdminAnalyticsData() {
  await requireAdmin();
  ("use cache");
  cacheTag("admin", "admin-analytics");
  cacheLife("hours");

  return await AdminService.getAnalyticsData();
}

export async function getAdminPlans() {
  await requireAdmin();
  ("use cache");
  cacheTag("plans");
  cacheLife("weeks");

  return await AdminService.getPlans();
}

export async function getTrialsAndActiveCount() {
  await requireAdmin();
  // Trials might change more frequently, but let's cache briefly
  ("use cache");
  cacheTag("admin", "trials");
  cacheLife("minutes");

  return await AdminService.getTrialsAndActiveCount();
}

export async function getCurrentAdminData() {
  const user = await requireAdmin();
  return await AdminService.getCurrentAdmin(user.id);
}

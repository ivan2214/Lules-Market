import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { AdminService } from "@/server/modules/admin/service";

export async function getAdminEntities(options: {
  page: number;
  perPage: number;
}) {
  "use cache";
  cacheTag("admin", "entities", "users");
  cacheLife("minutes");

  const [users, total] = await Promise.all([
    AdminService.getUsersWithBusiness(options),
    AdminService.getTotalUsersCount(),
  ]);

  return { users, total };
}

export async function getAdminUserById(userId: string) {
  "use cache";
  cacheTag("admin", "users", `user-${userId}`);
  cacheLife("minutes");

  return await AdminService.getUserById(userId);
}

export async function getAdminBusinessById(businessId: string) {
  "use cache";
  cacheTag("admin", "businesses", `business-${businessId}`);
  cacheLife("minutes");

  return await AdminService.getBusinessById(businessId);
}

export async function getAdminBusinesses(options: {
  page: number;
  perPage: number;
  status?: string;
}) {
  "use cache";
  cacheTag("admin", "businesses");
  cacheLife("minutes");

  return await AdminService.getAllBusinesses(options);
}

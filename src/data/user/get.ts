import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { UserService } from "@/server/modules/user/service";

export async function getUserPublicProfile(userId: string) {
  "use cache";
  cacheTag("users", `user-${userId}`);
  cacheLife("days");

  return await UserService.getPublicProfile(userId);
}

export async function getUserByEmail(email: string) {
  // Sensitive info, maybe not cache with "use cache" unless we use email as tag
  return await UserService.getByEmail(email);
}

export async function getUserById(id: string) {
  "use cache";
  cacheTag("users", `user-${id}`);
  cacheLife("days");

  return await UserService.getById(id);
}

import { pgEnum } from "drizzle-orm/pg-core";

export const planTypeEnum = pgEnum("plan_type", ["FREE", "BASIC", "PREMIUM"]);

export const planStatusEnum = pgEnum("plan_status", [
  "ACTIVE",
  "INACTIVE",
  "CANCELLED",
  "EXPIRED",
]);

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "USER",
  "BUSINESS",
  "SUPER_ADMIN",
]);

export const permissionEnum = pgEnum("permission", [
  "ALL",
  "BAN_USERS",
  "MANAGE_PLANS",
]);

export const businessStatusEnum = pgEnum("business_status", [
  "PENDING_VERIFICATION",
  "ACTIVE",
  "SUSPENDED",
  "INACTIVE",
]);

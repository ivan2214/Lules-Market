import { pgEnum } from "drizzle-orm/pg-core";

export const planTypeEnum = pgEnum("plan_type", ["FREE", "BASIC", "PREMIUM"]);

export const planStatusEnum = pgEnum("plan_status", [
  "ACTIVE",
  "INACTIVE",
  "CANCELLED",
  "EXPIRED",
]);

export const listPriorityEnum = pgEnum("list_priority", [
  "Estandar",
  "Media",
  "Alta",
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
  "MANAGE_PAYMENTS",
  "MODERATE_CONTENT",
  "VIEW_ANALYTICS",
]);

export const businessStatusEnum = pgEnum("business_status", [
  "PENDING_VERIFICATION",
  "ACTIVE",
  "SUSPENDED",
  "INACTIVE",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "PRODUCT_AVAILABLE",
  "PLAN_EXPIRING",
  "PLAN_EXPIRED",
  "PAYMENT_RECEIVED",
  "ACCOUNT_VERIFIED",
  "REPORT_RESOLVED",
]);

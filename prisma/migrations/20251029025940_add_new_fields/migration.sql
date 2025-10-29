-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('ALL', 'MODERATE_CONTENT', 'BAN_USERS', 'MANAGE_PAYMENTS', 'MANAGE_COUPONS', 'VIEW_ANALYTIICS');

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "permissions" "Permission"[];

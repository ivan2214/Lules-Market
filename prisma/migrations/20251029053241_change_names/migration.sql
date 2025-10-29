/*
  Warnings:

  - The `plan` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `planStatus` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `plan` column on the `Coupon` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `plan` column on the `Trial` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `plan` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Plan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "plan",
ADD COLUMN     "plan" "PlanType" NOT NULL DEFAULT 'FREE',
DROP COLUMN "planStatus",
ADD COLUMN     "planStatus" "PlanStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "plan",
ADD COLUMN     "plan" "PlanType" NOT NULL DEFAULT 'PREMIUM';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "plan",
ADD COLUMN     "plan" "PlanType" NOT NULL;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "type",
ADD COLUMN     "type" "PlanType" NOT NULL;

-- AlterTable
ALTER TABLE "Trial" DROP COLUMN "plan",
ADD COLUMN     "plan" "PlanType" NOT NULL DEFAULT 'PREMIUM';

-- DropEnum
DROP TYPE "public"."SubscriptionPlan";

-- DropEnum
DROP TYPE "public"."SubscriptionStatus";

-- CreateIndex
CREATE INDEX "Business_plan_idx" ON "Business"("plan");

-- CreateIndex
CREATE INDEX "Business_planStatus_idx" ON "Business"("planStatus");

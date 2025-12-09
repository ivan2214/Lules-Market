/*
  Warnings:

  - The values [MODERATE_CONTENT,MANAGE_PAYMENTS,MANAGE_COUPONS,VIEW_ANALYTIICS] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `totalCoupons` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `totalRedemptions` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CouponRedemption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('ALL', 'BAN_USERS', 'MANAGE_PLANS');
ALTER TABLE "admin" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "public"."Permission_old";
COMMIT;

-- DropIndex
DROP INDEX "Image_postId_idx";

-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "totalCoupons",
DROP COLUMN "totalRedemptions";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "condition",
DROP COLUMN "model";

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "Coupon";

-- DropTable
DROP TABLE "CouponRedemption";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Review";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "ProductCondition";

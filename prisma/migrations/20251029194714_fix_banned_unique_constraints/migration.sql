/*
  Warnings:

  - The required column `id` was added to the `BannedBusiness` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `BannedProduct` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `BannedUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "public"."BannedBusiness_bannedById_key";

-- DropIndex
DROP INDEX "public"."BannedProduct_bannedById_key";

-- DropIndex
DROP INDEX "public"."BannedUser_bannedById_key";

-- AlterTable
ALTER TABLE "BannedBusiness" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "BannedBusiness_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BannedProduct" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "BannedProduct_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BannedUser" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "BannedUser_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "BannedBusiness_bannedById_idx" ON "BannedBusiness"("bannedById");

-- CreateIndex
CREATE INDEX "BannedProduct_bannedById_idx" ON "BannedProduct"("bannedById");

-- CreateIndex
CREATE INDEX "BannedUser_bannedById_idx" ON "BannedUser"("bannedById");

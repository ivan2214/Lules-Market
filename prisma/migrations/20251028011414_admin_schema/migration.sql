-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'BUSINESS');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "userRole" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "admin" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "BannedBusiness" (
    "bannedById" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "BannedUser" (
    "bannedById" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "BannedProduct" (
    "bannedById" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_userId_key" ON "admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BannedBusiness_bannedById_key" ON "BannedBusiness"("bannedById");

-- CreateIndex
CREATE UNIQUE INDEX "BannedBusiness_businessId_key" ON "BannedBusiness"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "BannedUser_bannedById_key" ON "BannedUser"("bannedById");

-- CreateIndex
CREATE UNIQUE INDEX "BannedUser_userId_key" ON "BannedUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BannedProduct_bannedById_key" ON "BannedProduct"("bannedById");

-- CreateIndex
CREATE UNIQUE INDEX "BannedProduct_productId_key" ON "BannedProduct"("productId");

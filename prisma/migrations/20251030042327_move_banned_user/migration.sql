/*
  Warnings:

  - You are about to drop the `BannedUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."BannedUser";

-- CreateTable
CREATE TABLE "BannedImages" (
    "id" TEXT NOT NULL,
    "bannedById" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannedImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BannedImages_imageKey_key" ON "BannedImages"("imageKey");

-- CreateIndex
CREATE INDEX "BannedImages_bannedById_idx" ON "BannedImages"("bannedById");

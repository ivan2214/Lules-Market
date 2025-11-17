/*
  Warnings:

  - A unique constraint covering the columns `[avatarId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "avatarId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Image_avatarId_key" ON "Image"("avatarId");

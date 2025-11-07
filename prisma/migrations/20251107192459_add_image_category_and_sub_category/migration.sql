/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subCategoryId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "subCategoryId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_categoryId_key" ON "Image"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_subCategoryId_key" ON "Image"("subCategoryId");
